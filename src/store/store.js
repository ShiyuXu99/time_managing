import {addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where} from 'firebase/firestore';
import create from 'zustand';
import {db} from "../firebase/config";
import {
    addToFirebaseTasksList,
    getFirebaseCollection,
    getFireBaseData,
    updateToFirebaseTasksList
} from "../utils/handleFireBase";

const useStore = create((set) => ({
    taskLists: [],
    fetchTaskLists: async () => {
        const path = ['adminUser', 'taskLists', 'tasks'];
        await getFireBaseData(path, (data) => {
            set({taskLists: data})
        })
    },
    addToTaskLists: async (name, color) => {
        const result = await addToFirebaseTasksList(name, color)
        if(result?.success) await useStore.getState().fetchTaskLists();
        return result
    },
    updateTaskList: async (taskId, name, color) => {
        const result = await updateToFirebaseTasksList(name, color, taskId)
        if(result?.success) await useStore.getState().fetchTaskLists();
    },
}));

export default useStore;
