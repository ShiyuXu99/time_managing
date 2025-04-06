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
 * Adds a new task category to Firestore
 * @param {string} userId - Current user's UID
 * @param {object} categoryData - { name, color?, icon? }
 * @returns {Promise<{ id: string, ...categoryData }>}
 * @throws {Error} If Firestore operation fails
 */
export const addTaskCategory = async (userId, categoryData) => {
    if (!userId) throw new Error("User ID is required.");
    if (!categoryData?.name?.trim()) throw new Error("Category name is required.");

    try {
        // Check for existing category with same name
        const nameQuery = query(
            collection(db, 'taskCategories'),
            where('userId', '==', userId),
            where('name', '==', categoryData.name.trim())
        );

        // Check for existing category with same color and icon combination
        // const styleQuery = query(
        //     collection(db, 'taskCategories'),
        //     where('userId', '==', userId),
        //     where('color', '==', categoryData.color || '#3b82f6'),
        //     where('icon', '==', categoryData.icon || 'task')
        // );

        const [nameSnapshot, styleSnapshot] = await Promise.all([
            getDocs(nameQuery),
            // getDocs(styleQuery)
        ]);

        // Check for duplicates
        if (!nameSnapshot.empty) {
            throw new Error('A category with this name already exists');
        }

        // if (!styleSnapshot.empty) {
        //     throw new Error('A category with this color and icon combination already exists');
        // }

        // Create new category if no duplicates found
        const docRef = await addDoc(collection(db, 'taskCategories'), {
            userId,
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
 * Updates an existing task category
 * @param {string} userId - Verifies ownership
 * @param {string} categoryId - Document ID to update
 * @param {object} updates - { name?, color?, icon? }
 * @returns {Promise<void>}
 * @throws {Error} If user doesn't own the category or Firestore fails
 */
export const updateTaskCategory = async (userId, categoryId, updates) => {
    if (!userId || !categoryId) throw new Error("User ID and Category ID required.");
    if (!updates || Object.keys(updates).length === 0) throw new Error("No updates provided.");

    const categoryRef = doc(db, 'taskCategories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) throw new Error("Category not found.");
    if (categorySnap.data().userId !== userId) throw new Error("Unauthorized: Not your category.");

    try {
        await updateDoc(categoryRef, updates);
    } catch (error) {
        console.error("Firestore updateTaskCategory error:", error);
        throw new Error(`Failed to update category: ${error.message}`);
    }
};


/**
 * Deletes a task category (with ownership check)
 * @param {string} userId - Must match category's userId
 * @param {string} categoryId - Document ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails or unauthorized
 */
export const deleteTaskCategory = async (userId, categoryId) => {
    if (!userId || !categoryId) throw new Error("User ID and Category ID required.");

    const categoryRef = doc(db, 'taskCategories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) throw new Error("Category not found.");
    if (categorySnap.data().userId !== userId) throw new Error("Unauthorized: Not your category.");

    try {
        await deleteDoc(categoryRef);
    } catch (error) {
        console.error("Firestore deleteTaskCategory error:", error);
        throw new Error(`Failed to delete category: ${error.message}`);
    }
};


export const getUserTaskCategoriesRealtime = (userId, callback) => {
    if (!userId) throw new Error("User ID required.");

    try {
        const q = query(
            collection(db, 'taskCategories'),
            where('userId', '==', userId)
        );

        // Set up real-time listener and return unsubscribe function
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            callback(result); // Pass data to callback
        }, (error) => {
            console.error("Firestore realtime error:", error);
            throw new Error(`Failed to listen for updates: ${error.message}`);
        });

        return unsubscribe; // Return cleanup function
    } catch (error) {
        console.error("Firestore getUserTaskCategoriesRealtime error:", error);
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
};