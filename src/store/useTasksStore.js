// stores/taskStore.js
import { create } from 'zustand';

const useTaskStore = create((set, get) => ({
    taskCategories: [],
    todayTaskSummaries: [],
    taskSummaries: [],

    setTaskCategories: (categories) => set({ taskCategories: categories }),

    // Get all categories as {id: {name, color}} map
    getCategoriesMap: () => {
        return get().taskCategories.reduce((map, category) => {
            map[category.id] = {
                name: category.name,
                color: category.color,
                icon: category.icon
            };
            return map;
        }, {});
    },


    // New summary actions
    setTodayTaskSummaries: (summary) => set({ todayTaskSummaries: summary }),
    setTaskSummaries: (summaries) => set({ taskSummaries: summaries }),

    // Helper to get today's duration by category
    getTodayDurationByCategory: () => {
        const today = get().todayTaskSummaries;
        if (!today || !today.categories) return {};

        return Object.entries(today.categories).reduce((acc, [categoryId, data]) => {
            acc[categoryId] = data.duration;
            return acc;
        }, {});
    }
}));

export default useTaskStore;