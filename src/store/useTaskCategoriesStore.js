// stores/taskStore.js
import { create } from 'zustand';

const useTaskStore = create((set, get) => ({
    taskCategories: [],

    // Actions
    setTaskCategories: (categories) => set({ taskCategories: categories }),

    // Get category by ID
    getCategoryById: (categoryId) => {
        return get().taskCategories.find(cat => cat.id === categoryId) || {
            name: 'Uncategorized',
            color: '#9ca3af',
            icon: 'help'
        };
    },

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
    }
}));

export default useTaskStore;