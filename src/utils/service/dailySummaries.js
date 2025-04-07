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


// Helper function to format date as YYYY-MM-DD
const formatDateString = (date) => {
    if (!(date instanceof Date)) {
        throw new Error('Invalid date object provided to formatDateString');
    }
    return format(date, 'yyyy-MM-dd');
};

// Helper function to split a multi-day session into daily segments
const handleMultiDaySession = (startTime, endTime) => {
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
                duration
            });
        }

        currentDayStart = nextDayStart;
    }

    return segments;
};

/**
 * Updates daily summaries for a task session, handling multi-day sessions
 * @param {string} userId - Current user's UID
 * @param {object} taskInfo - Task information
 * @param {Date} taskInfo.startTime - Task start time
 * @param {Date} taskInfo.endTime - Task end time
 * @param {string} [taskInfo.categoryId] - Optional category ID
 * @returns {Promise<{success: boolean, processedDays: string[]}>}
 */
export const updateDailySummary = async (userId, taskInfo) => {
    if (!userId) throw new Error("User ID is required.");
    if (!taskInfo?.startTime) throw new Error("Start time is required.");
    if (!taskInfo?.endTime) throw new Error("End time is required.");
    if (taskInfo.endTime < taskInfo.startTime) {
        throw new Error("End time cannot be before start time.");
    }

    try {
        const processedDays = [];
        const daySegments = handleMultiDaySession(taskInfo.startTime, taskInfo.endTime);

        for (const segment of daySegments) {
            await updateSingleDaySummary(
                userId,
                segment.dateString,
                {
                    categoryId: taskInfo.categoryId,
                    duration: segment.duration,
                    startTime: segment.start,
                    endTime: segment.end
                }
            );
            processedDays.push(segment.dateString);
        }

        return { success: true, processedDays };
    } catch (error) {
        console.error("updateDailySummariesForSession error:", error);
        throw new Error(`Failed to update daily summaries: ${error.message}`);
    }
};

// Helper function to update a single day's summary
const updateSingleDaySummary = async (userId, dateString, taskInfo) => {
    const dateDocRef = doc(db, 'dailySummaries', dateString);
    const sessionData = {
        start: taskInfo.startTime,
        end: taskInfo.endTime
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