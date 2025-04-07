import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    getDoc,
    deleteDoc,
    query,
    where, onSnapshot,
    Timestamp,
} from 'firebase/firestore';
import {db} from "../../firebase/config";
import {updateDailySummary} from "./dailySummaries";

/**
 * Adds a new task to Firestore and updates daily summaries
 * @param {string} userId - Current user's UID
 * @param {object} taskData - Task properties
 * @returns {Promise<{ id: string, ...taskData }>}
 * @throws {Error} If validation fails or Firestore operation fails
 */
export const addTask = async (userId, taskData) => {
    if (!userId) throw new Error("User ID is required.");
    if (!taskData?.name?.trim()) throw new Error("Task name is required.");
    if (!taskData.startTime) throw new Error("Start time is required.");

    const session = {
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        categoryId: taskData.categoryId
    }

    await updateDailySummary(userId,session);

    try {
        // Basic task structure
        const task = {
            userId,
            name: taskData.name.trim(),
            categoryId: taskData.categoryId || null,
            startTime: Timestamp.fromDate(taskData.startTime),
            endTime: Timestamp.fromDate(taskData.endTime) || null,
            duration: taskData.duration || 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'tasks'), task);
        return { id: docRef.id, ...task };
    } catch (error) {
        console.error("Firestore addTask error:", error);
        throw new Error(`Failed to add task: ${error.message}`);
    }
};

/**
 * Updates an existing task and recalculates daily summaries
 * @param {string} userId - Verifies ownership
 * @param {string} taskId - Document ID to update
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 * @throws {Error} If unauthorized or Firestore fails
 */
export const updateTask = async (userId, taskId, updates) => {
    if (!userId || !taskId) throw new Error("User ID and Task ID required.");
    if (!updates || Object.keys(updates).length === 0) throw new Error("No updates provided.");

    const taskRef = doc(db, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) throw new Error("Task not found.");
    if (taskSnap.data().userId !== userId) throw new Error("Unauthorized: Not your task.");

    try {
        await updateDoc(taskRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Firestore updateTask error:", error);
        throw new Error(`Failed to update task: ${error.message}`);
    }
};

/**
 * Deletes a task and cleans up daily summaries
 * @param {string} userId - Must match task's userId
 * @param {string} taskId - Document ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails or unauthorized
 */
export const deleteTask = async (userId, taskId) => {
    if (!userId || !taskId) throw new Error("User ID and Task ID required.");

    const taskRef = doc(db, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) throw new Error("Task not found.");
    if (taskSnap.data().userId !== userId) throw new Error("Unauthorized: Not your task.");

    try {
        await deleteDoc(taskRef);
    } catch (error) {
        console.error("Firestore deleteTask error:", error);
        throw new Error(`Failed to delete task: ${error.message}`);
    }
};

/**
 * Gets tasks in real-time with optional filters
 * @param {string} userId - Required for ownership
 * @param {function} callback - Receives tasks array
 * @param {object} [filters] - Optional filters
 * @returns {function} Unsubscribe function
 * @throws {Error} If initialization fails
 */
export const getTasksRealtime = (userId, callback, filters = {}) => {
    if (!userId) throw new Error("User ID required.");

    try {
        let q = query(
            collection(db, 'tasks'),
            where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startTime: doc.data().startTime?.toDate() || null,
                endTime: doc.data().endTime?.toDate() || null,
                createdAt: doc.data().createdAt?.toDate() || null,
                updatedAt: doc.data().updatedAt?.toDate() || null
            }));
            callback(tasks);
        }, (error) => {
            console.error("Firestore tasks realtime error:", error);
            throw new Error(`Failed to listen for task updates: ${error.message}`);
        });

        return unsubscribe;
    } catch (error) {
        console.error("Firestore getTasksRealtime error:", error);
        throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
};
