// src/hooks/useTaskCategories.js
import { useEffect } from 'react';
import useTaskCategoriesStore from "../store/useTaskCategoriesStore";

export const useTaskCategories = (userId) => {
    const { taskLists, loading, error, subscribe } = useTaskCategoriesStore();

    useEffect(() => {
        const unsubscribe = subscribe(userId);
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [userId, subscribe]);

    return {
        taskLists,
        loading,
        error,
        isEmpty: !loading && taskLists.length === 0
    };
};