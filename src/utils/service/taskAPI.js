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
    onSnapshot,
    Timestamp,
    arrayUnion,
    increment,
    writeBatch
} from 'firebase/firestore';
import {db} from "../../firebase/config";

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

    try {
        // Basic task structure
        const task = {
            userId,
            name: taskData.name.trim(),
            categoryId: taskData.categoryId || null,
            startTime: taskData.startTime,
            endTime: taskData.endTime || null,
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

/**
 * Gets daily summaries in real-time
 * @param {string} userId - Required for ownership
 * @param {Date} date - Date to get summary for
 * @param {function} callback - Receives summary data
 * @returns {function} Unsubscribe function
 */
export const getDailySummaryRealtime = (userId, date, callback) => {
    const dateString = date.toISOString().split('T')[0];
    const q = query(
        collection(db, 'dailySummaries'),
        where('userId', '==', userId),
        where('date', '==', dateString)
    );

    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            callback({
                date: dateString,
                totalDuration: 0,
                categories: {}
            });
            return;
        }

        const summaryDoc = snapshot.docs[0];
        const data = summaryDoc.data();
        callback({
            date: data.date,
            totalDuration: data.totalDuration || 0,
            categories: data.categories || {}
        });
    }, (error) => {
        console.error("Daily summary error:", error);
    });
};

/**
 * Splits a task across multiple days and updates summaries
 * @param {object} task - The task document
 * @returns {Promise<void>}
 */
export const updateTaskDailySegments = async (task) => {
    if (!task.endTime) return; // Only process completed tasks

    const batch = writeBatch(db);
    const userId = task.userId;
    const taskId = task.id;

    // Delete existing segments for this task
    const segmentsQuery = query(
        collection(db, 'dailyTaskSegments'),
        where('taskId', '==', taskId)
    );
    const existingSegments = await getDocs(segmentsQuery);
    existingSegments.forEach(doc => batch.delete(doc.ref));

    // Create new segments
    const segments = splitTaskByDays(task);
    segments.forEach(segment => {
        const segRef = doc(collection(db, 'dailyTaskSegments'));
        batch.set(segRef, segment);
    });

    // Update daily summaries
    const daysToUpdate = new Set(segments.map(s => s.date));
    for (const dateStr of daysToUpdate) {
        const daySegments = segments.filter(s => s.date === dateStr);
        const dayDuration = daySegments.reduce((sum, seg) => sum + seg.duration, 0);

        const dailySummaryRef = doc(db, 'dailySummaries', dateStr);
        const categoryUpdates = {};

        daySegments.forEach(seg => {
            if (!categoryUpdates[seg.categoryId]) {
                categoryUpdates[seg.categoryId] = {
                    duration: 0,
                    sessions: []
                };
            }
            categoryUpdates[seg.categoryId].duration += seg.duration;
            categoryUpdates[seg.categoryId].sessions.push({
                start: seg.startTime,
                end: seg.endTime
            });
        });

        batch.set(dailySummaryRef, {
            userId,
            date: dateStr,
            totalDuration: increment(dayDuration),
            categories: categoryUpdates,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }

    await batch.commit();
};

// Helper function to split tasks across days
function splitTaskByDays(task) {
    const segments = [];
    let currentStart = task.startTime.toDate();
    const end = task.endTime.toDate();

    while (currentStart < end) {
        const currentDate = new Date(currentStart);
        currentDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const segmentEnd = new Date(Math.min(end, nextDay));
        const duration = (segmentEnd - currentStart) / 1000;

        segments.push({
            userId: task.userId,
            taskId: task.id,
            categoryId: task.categoryId,
            date: currentDate.toISOString().split('T')[0],
            startTime: currentStart,
            endTime: segmentEnd,
            duration: duration
        });

        currentStart = segmentEnd;
    }

    return segments;
}