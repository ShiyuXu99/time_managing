import { doc, collection, query, where, orderBy, startAt, endAt, onSnapshot, serverTimestamp, runTransaction } from 'firebase/firestore';
import { addDays, startOfDay, endOfDay, isWithinInterval, differenceInSeconds, format } from 'date-fns';
import {db} from "../../firebase/config";

/**
 * Subscribe to real-time updates for daily summaries
 * @param {object} options - Query options (same as getDailySummaries)
 * @param {function} callback - Called with updates (receives summaries array)
 * @returns {function} Unsubscribe function to stop listening
 */
export const getDailySummaries = (options, callback) => {
    const { userId, date, startDate, endDate, withCategories = true } = options;
    const summariesRef = collection(db, 'dailySummaries');
    let q = query(summariesRef);

    // Build the query (same as before)
    if (userId) q = query(q, where('userId', '==', userId));
    if (date) {
        const dateString = format(typeof date === 'string' ? new Date(date) : date, 'yyyy-MM-dd');
        q = query(q, where('__name__', '==', dateString));
    } else if (startDate || endDate) {
        const start = startDate ? format(startOfDay(startDate), 'yyyy-MM-dd') : '1970-01-01';
        const end = endDate ? format(endOfDay(endDate), 'yyyy-MM-dd') : '9999-12-31';
        q = query(q, orderBy('__name__'), startAt(start), endAt(end));
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            const summary = {
                id: doc.id,
                date: data.date.toDate(),
                totalDuration: data.totalDuration || 0,
            };
            if (withCategories && data.categories) summary.categories = data.categories;
            results.push(summary);
        });

        // Filter by precise date range (Firestore string ranges are approximate)
        const filteredResults = results.filter((summary) => {
            if (!startDate && !endDate) return true;
            return isWithinInterval(summary.date, {
                start: startDate ? startOfDay(startDate) : new Date(0),
                end: endDate ? endOfDay(endDate) : new Date(8640000000000000),
            });
        });

        // Sort by date
        filteredResults.sort((a, b) => a.date - b.date);
        callback(filteredResults);
    });

    return unsubscribe; // Return cleanup function
};

export const addDailySummary = async (userId, taskInfo) => {
    if (!userId) throw new Error("User ID is required.");
    if (!taskInfo?.startTime || !taskInfo?.endTime) throw new Error("Start and end time are required.");
    if (taskInfo.endTime < taskInfo.startTime) {
        throw new Error("End time cannot be before start time.");
    }

    const processedDays = [];
    const daySegments = handleMultiDaySession(
        taskInfo.startTime,
        taskInfo.endTime,
        taskInfo.notes,
        taskInfo.taskId
    );

    for (const segment of daySegments) {
        await addSingleDaySummary(
            userId,
            segment.dateString,
            {
                categoryId: taskInfo.categoryId,
                duration: segment.duration,
                startTime: segment.start,
                endTime: segment.end,
                notes: segment.notes,
                taskId: segment.taskId
            }
        );
        processedDays.push(segment.dateString);
    }

    return { success: true, processedDays };
};

// Helper function to add a single day's summary with notes
const addSingleDaySummary = async (userId, dateString, taskInfo) => {
    const dateDocRef = doc(db, 'dailySummaries', dateString);
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const sessionData = {
        id: sessionId,
        start: taskInfo.startTime,
        end: taskInfo.endTime,
        notes: taskInfo.notes || '',
        taskId: taskInfo.taskId
    };

    await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(dateDocRef);
        const categoryId = taskInfo.categoryId || 'uncategorized';

        if (docSnap.exists()) {
            const existingData = docSnap.data();
            const newTotalDuration = (existingData.totalDuration || 0) + taskInfo.duration;

            let categoriesUpdate = { ...(existingData.categories || {}) };
            if (categoriesUpdate[categoryId]) {
                categoriesUpdate[categoryId] = {
                    duration: categoriesUpdate[categoryId].duration + taskInfo.duration,
                    sessions: [...categoriesUpdate[categoryId].sessions, sessionData]
                };
            } else {
                categoriesUpdate[categoryId] = {
                    duration: taskInfo.duration,
                    sessions: [sessionData]
                };
            }

            transaction.update(dateDocRef, {
                totalDuration: newTotalDuration,
                categories: categoriesUpdate,
                updatedAt: serverTimestamp()
            });
        } else {
            transaction.set(dateDocRef, {
                userId,
                date: new Date(dateString),
                totalDuration: taskInfo.duration,
                categories: {
                    [categoryId]: {
                        duration: taskInfo.duration,
                        sessions: [sessionData]
                    }
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    });
};
// Helper function to format date as YYYY-MM-DD
const formatDateString = (date) => {
    if (!(date instanceof Date)) {
        throw new Error('Invalid date object provided to formatDateString');
    }
    return format(date, 'yyyy-MM-dd');
};

// Updated helper function to split a multi-day session into daily segments with notes
const handleMultiDaySession = (startTime, endTime, notes = '', taskId = '') => {
    const segments = [];
    let currentDayStart = startOfDay(startTime);
    const sessionEnd = endTime;

    while (currentDayStart <= sessionEnd) {
        const nextDayStart = addDays(currentDayStart, 1);
        const dayEnd = nextDayStart < sessionEnd ? nextDayStart : sessionEnd;

        const dayStart = currentDayStart > startTime ? currentDayStart : startTime;
        const duration = differenceInSeconds(dayEnd, dayStart);

        if (duration > 0) {
            segments.push({
                date: new Date(currentDayStart),
                dateString: formatDateString(currentDayStart),
                start: dayStart,
                end: dayEnd,
                duration,
                notes,
                taskId
            });
        }

        currentDayStart = nextDayStart;
    }

    return segments;
};


export const removeSessionFromDailySummary = async (userId, dateString, categoryId, sessionId) => {
    const dateDocRef = doc(db, 'dailySummaries', dateString);

    await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(dateDocRef);
        if (!docSnap.exists()) throw new Error(`Summary not found for ${dateString}`);

        const data = docSnap.data();
        const categories = { ...(data.categories || {}) };
        const category = categories[categoryId];
        if (!category) throw new Error(`Category ${categoryId} not found`);

        console.log(sessionId, category.sessions.findIndex(s => s.id === sessionId))
        const sessionIndex = category.sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) throw new Error(`Session ${sessionId} not found`);

        const session = category.sessions[sessionIndex];
        const sessionStart = session.start.toDate ? session.start.toDate() : new Date(session.start);
        const sessionEnd = session.end.toDate ? session.end.toDate() : new Date(session.end);
        const duration = differenceInSeconds(sessionEnd, sessionStart);

        // Remove session
        category.sessions.splice(sessionIndex, 1);
        category.duration -= duration;

        if (category.sessions.length === 0) {
            delete categories[categoryId];
        }

        const newTotalDuration = (data.totalDuration || 0) - duration;

        transaction.update(dateDocRef, {
            categories,
            totalDuration: newTotalDuration,
            updatedAt: serverTimestamp()
        });
    });

    return { success: true };
};


export const updateDailySummary = async (userId, oldSessionInfo, newSessionInfo) => {
    const { dateString, categoryId, sessionId } = oldSessionInfo;

    // Step 1: Remove old session
    await removeSessionFromDailySummary(userId, dateString, categoryId, sessionId);

    // Step 2: Add new session (might span multiple days)
    await addDailySummary(userId, {
        ...newSessionInfo,
    });

    return { success: true };
};


