import { doc, collection, query, where, orderBy, startAt, endAt, onSnapshot, serverTimestamp, runTransaction } from 'firebase/firestore';
import { addDays, startOfDay, endOfDay, isWithinInterval, differenceInSeconds, format } from 'date-fns';
import {db} from "../../firebase/config";

/**
 * Subscribe to real-time updates for daily summaries (now in user subcollection)
 * @param {object} options - Query options
 * @param {function} callback - Called with updates
 * @returns {function} Unsubscribe function
 */
export const getDailySummaries = (options, callback) => {
    const { userId, date, startDate, endDate, withCategories = true } = options;
    if (!userId) throw new Error("User ID is required.");

    const summariesRef = collection(db, 'users', userId, 'dailySummaries');
    let q = query(summariesRef);

    // Build the query using document ID as date
    if (date) {
        const dateString = format(typeof date === 'string' ? new Date(date) : date, 'yyyy-MM-dd');
        q = query(q, where('__name__', '==', dateString));
    } else if (startDate || endDate) {
        const start = startDate ? format(startOfDay(startDate), 'yyyy-MM-dd') : '1970-01-01';
        const end = endDate ? format(endOfDay(endDate), 'yyyy-MM-dd') : '9999-12-31';
        q = query(q, orderBy('__name__'), startAt(start), endAt(end));
    }

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

        // Filter by precise date range
        const filteredResults = results.filter((summary) => {
            if (!startDate && !endDate) return true;
            return isWithinInterval(summary.date, {
                start: startDate ? startOfDay(startDate) : new Date(0),
                end: endDate ? endOfDay(endDate) : new Date(8640000000000000),
            });
        });

        filteredResults.sort((a, b) => a.date - b.date);
        callback(filteredResults);
    });

    return unsubscribe;
};

export const addDailySummary = async (userId, taskInfo) => {
    if (!userId) throw new Error("User ID is required.");
    if (!taskInfo?.startTime || !taskInfo?.endTime) throw new Error("Start and end time are required.");
    if (taskInfo.endTime < taskInfo.startTime) throw new Error("End time cannot be before start time.");

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

// Helper function to add a single day's summary
const addSingleDaySummary = async (userId, dateString, taskInfo) => {
    const dateDocRef = doc(db, 'users', userId, 'dailySummaries', dateString);
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

export const removeSessionFromDailySummary = async (userId, dateString, categoryId, sessionId) => {
    const dateDocRef = doc(db, 'users', userId, 'dailySummaries', dateString);

    await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(dateDocRef);
        if (!docSnap.exists()) throw new Error(`Summary not found for ${dateString}`);

        const data = docSnap.data();
        const categories = { ...(data.categories || {}) };
        const category = categories[categoryId];
        if (!category) throw new Error(`Category ${categoryId} not found`);

        const sessionIndex = category.sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) throw new Error(`Session ${sessionId} not found`);

        const session = category.sessions[sessionIndex];
        const duration = differenceInSeconds(
            session.end.toDate ? session.end.toDate() : new Date(session.end),
            session.start.toDate ? session.start.toDate() : new Date(session.start)
        );

        category.sessions.splice(sessionIndex, 1);
        category.duration -= duration;

        if (category.sessions.length === 0) {
            delete categories[categoryId];
        }

        transaction.update(dateDocRef, {
            categories,
            totalDuration: data.totalDuration - duration,
            updatedAt: serverTimestamp()
        });
    });

    return { success: true };
};

export const updateDailySummary = async (userId, oldSessionInfo, newSessionInfo) => {
    const { dateString, categoryId, sessionId } = oldSessionInfo;

    await removeSessionFromDailySummary(userId, dateString, categoryId, sessionId);
    await addDailySummary(userId, newSessionInfo);

    return { success: true };
};

// Helper functions remain unchanged
const formatDateString = (date) => format(date, 'yyyy-MM-dd');

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