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
    onSnapshot,
    Timestamp,
    runTransaction
} from 'firebase/firestore';
import {db} from "../../firebase/config";
import {addDailySummary, updateDailySummary} from "./dailySummaries";

/**
 * Adds a new task to Firestore (now in user subcollection)
 * @param {string} userId - Current user's UID
 * @param {object} taskData - Task properties
 * @returns {Promise<{ id: string, ...taskData }>}
 * @throws {Error} If validation fails or Firestore operation fails
 */
export const addTask = async (userId, taskData) => {
    if (!userId) throw new Error("User ID is required.");
    if (!taskData?.name?.trim()) throw new Error("Task name is required.");
    if (!taskData.startTime) throw new Error("Start time is required.");

    try {
        // Reference to user's tasks subcollection
        const userTasksRef = collection(db, 'users', userId, 'tasks');

        const task = {
            name: taskData.name.trim(),
            categoryId: taskData.categoryId || null,
            startTime: Timestamp.fromDate(taskData.startTime),
            endTime: taskData.endTime ? Timestamp.fromDate(taskData.endTime) : null,
            duration: taskData.duration || calculateDurationIfMissing(taskData.startTime, taskData.endTime) || 0,
            notes: taskData.notes || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(userTasksRef, task);

        // Update daily summaries
        await addDailySummaryUpdate(taskData, docRef.id, userId);

        return { id: docRef.id, ...task };
    } catch (error) {
        console.error("Firestore addTask error:", error);
        throw new Error(`Failed to add task: ${error.message}`);
    }
};

/**
 * Updates an existing task in user subcollection
 * @param {string} userId - Verifies ownership via path
 * @param {string} taskId - Document ID to update
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 * @throws {Error} If task not found or Firestore fails
 */
export const updateTask = async (userId, taskId, updates) => {
    if (!userId || !taskId) throw new Error("User ID and Task ID required.");
    if (!updates || Object.keys(updates).length === 0) throw new Error("No updates provided.");

    const taskRef = doc(db, 'users', userId, 'tasks', taskId);

    try {
        // Calculate duration if times are being updated
        const duration = updates.startTime || updates.endTime
            ? calculateDurationIfMissing(
                updates.startTime || (await getDoc(taskRef)).data().startTime,
                updates.endTime || (await getDoc(taskRef)).data().endTime
            )
            : undefined;

        const updateData = {
            ...updates,
            updatedAt: serverTimestamp()
        };

        if (duration !== undefined) {
            updateData.duration = duration;
        }

        await updateDoc(taskRef, updateData);
    } catch (error) {
        console.error("Firestore updateTask error:", error);
        throw new Error(`Failed to update task: ${error.message}`);
    }
};

/**
 * Deletes a task from user subcollection
 * @param {string} userId - Must match path
 * @param {string} taskId - Document ID to delete
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 */
export const deleteTask = async (userId, taskId) => {
    if (!userId || !taskId) throw new Error("User ID and Task ID required.");

    const taskRef = doc(db, 'users', userId, 'tasks', taskId);

    try {
        await deleteDoc(taskRef);
    } catch (error) {
        console.error("Firestore deleteTask error:", error);
        throw new Error(`Failed to delete task: ${error.message}`);
    }
};

/**
 * Gets tasks in real-time from user subcollection
 * @param {string} userId - Required for path
 * @param {function} callback - Receives tasks array
 * @param {object} [filters] - Optional filters
 * @returns {function} Unsubscribe function
 * @throws {Error} If initialization fails
 */
export const getTasksRealtime = (userId, callback, filters = {}) => {
    if (!userId) throw new Error("User ID required.");

    try {
        const q = query(
            collection(db, 'users', userId, 'tasks'),
            ...buildFilters(filters) // Add any additional filters
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

// Helper function to build query filters
const buildFilters = (filters) => {
    const queryFilters = [];
    if (filters.categoryId) {
        queryFilters.push(where('categoryId', '==', filters.categoryId));
    }
    if (filters.startDate) {
        queryFilters.push(where('startTime', '>=', Timestamp.fromDate(filters.startDate)));
    }
    if (filters.endDate) {
        queryFilters.push(where('startTime', '<=', Timestamp.fromDate(filters.endDate)));
    }
    return queryFilters;
};

// Helper function to calculate duration
export const calculateDurationIfMissing = (start, end) => {
    if (!start || !end) return 0;

    const startTime = start instanceof Timestamp ? start.toDate() : start;
    const endTime = end instanceof Timestamp ? end.toDate() : end;

    if (startTime && endTime) {
        const durationMs = endTime - startTime;
        return Math.floor(durationMs / 1000); // Return seconds
    }
    return 0;
};

// Helper function to update daily summaries
const addDailySummaryUpdate = async (taskData, taskId, userId) => {
    const session = {
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        categoryId: taskData.categoryId,
        notes: taskData.notes || '',
        taskId: taskId || '',
    };

    await addDailySummary(userId, session);
};