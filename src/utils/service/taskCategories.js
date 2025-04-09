import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    getDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    onSnapshot
} from 'firebase/firestore';
import {db} from "../../firebase/config";

/**
 * Adds a new task category to Firestore (now in user subcollection)
 * @param {string} userId - Current user's UID
 * @param {object} categoryData - { name, color?, icon? }
 * @returns {Promise<{ id: string, ...categoryData }>}
 * @throws {Error} If Firestore operation fails
 */
export const addTaskCategory = async (userId, categoryData) => {
    if (!userId) throw new Error("User ID is required.");
    if (!categoryData?.name?.trim()) throw new Error("Category name is required.");

    try {
        // Reference to user's categories subcollection
        const userCategoriesRef = collection(db, 'users', userId, 'categories');

        // Check for existing category with same name
        const nameQuery = query(
            userCategoriesRef,
            where('name', '==', categoryData.name.trim())
        );

        const nameSnapshot = await getDocs(nameQuery);

        if (!nameSnapshot.empty) {
            throw new Error('A category with this name already exists');
        }

        // Create new category in user's subcollection
        const docRef = await addDoc(userCategoriesRef, {
            name: categoryData.name.trim(),
            color: categoryData.color || '#3b82f6',
            icon: categoryData.icon || 'task',
            createdAt: serverTimestamp(),
        });

        return { id: docRef.id, ...categoryData };
    } catch (error) {
        console.error("Firestore addTaskCategory error:", error);
        throw new Error(`Failed to add category: ${error.message}`);
    }
};

/**
 * Updates an existing task category in user subcollection
 * @param {string} userId - Verifies ownership (implicit via path)
 * @param {string} categoryId - Document ID to update
 * @param {object} updates - { name?, color?, icon? }
 * @returns {Promise<void>}
 * @throws {Error} If category not found or Firestore fails
 */
export const updateTaskCategory = async (userId, categoryId, updates) => {
    if (!userId || !categoryId) throw new Error("User ID and Category ID required.");
    if (!updates || Object.keys(updates).length === 0) throw new Error("No updates provided.");

    const categoryRef = doc(db, 'users', userId, 'categories', categoryId);

    try {
        // No need to check ownership - path already enforces it
        await updateDoc(categoryRef, updates);
    } catch (error) {
        console.error("Firestore updateTaskCategory error:", error);
        throw new Error(`Failed to update category: ${error.message}`);
    }
};

/**
 * Deletes a task category from user subcollection
 * @param {string} userId - Must match path
 * @param {string} categoryId - Document ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
export const deleteTaskCategory = async (userId, categoryId) => {
    if (!userId || !categoryId) throw new Error("User ID and Category ID required.");

    const categoryRef = doc(db, 'users', userId, 'categories', categoryId);

    try {
        await deleteDoc(categoryRef);
    } catch (error) {
        console.error("Firestore deleteTaskCategory error:", error);
        throw new Error(`Failed to delete category: ${error.message}`);
    }
};

/**
 * Real-time listener for user's categories
 * @param {string} userId - User ID
 * @param {function} callback - Receives categories array
 * @returns {function} Unsubscribe function
 */
export const getUserTaskCategoriesRealtime = (userId, callback) => {
    if (!userId) throw new Error("User ID required.");

    try {
        const q = query(
            collection(db, 'users', userId, 'categories')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            callback(result);
        }, (error) => {
            console.error("Firestore realtime error:", error);
            throw new Error(`Failed to listen for updates: ${error.message}`);
        });

        return unsubscribe;
    } catch (error) {
        console.error("Firestore getUserTaskCategoriesRealtime error:", error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
};

// Utility function remains unchanged as it doesn't interact with Firestore directly
export const getCategoryById = (categoryId, taskCategories) => {
    return taskCategories.find(cat => cat.id === categoryId) || {
        name: 'Uncategorized',
        color: '#9ca3af',
        icon: 'help'
    };
}