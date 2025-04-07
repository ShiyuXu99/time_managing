export const getCategoryById =  (categoryId, taskCategories) => {
    return taskCategories.find(cat => cat.id === categoryId) || {
        name: 'Uncategorized',
        color: '#9ca3af',
        icon: 'help'
    };
}