import {addDoc, collection, doc, getDocs, query, updateDoc, where} from 'firebase/firestore';
import { db } from '../../firebase/config';

export const addTasksList = async (name, color) => {
    const tasksRef = collection(db, 'adminUser', 'taskLists', 'tasks');
    const checkDuplicateQuery = query(tasksRef, where('title', '==', name), where('color', '==', color));

    try {
        const duplicateSnapshot = await getDocs(checkDuplicateQuery);
        if (!duplicateSnapshot.empty) {
            console.error("Error: A task with the same title and color already exists.");
            return { success: false, message: "*This task has already been created. Please use another name." };
        }

        const newTask = {
            title: name,
            color: color,
            time: 0 
        };
        await addDoc(tasksRef, newTask);
        console.log("New task added:", newTask);
        return {success: true, data: newTask}
    } catch (error) {
        console.error("Error adding new task or checking duplicates:", error);
    }
}

export const updateTasksList = async (name, color, taskId) => {
    const tasksRef = collection(db, 'adminUser', 'taskLists', 'tasks');
    const checkDuplicateQuery = query(tasksRef, where('title', '==', name), where('color', '==', color));

    try {
        const duplicateSnapshot = await getDocs(checkDuplicateQuery);
        if (!duplicateSnapshot.empty && !duplicateSnapshot.docs.map(doc => doc.id).includes(taskId)) {
            console.error("Error: A task with the same title and color already exists.");
            return; // Stop the function if a duplicate is found
        }

        const taskDocRef = doc(tasksRef, taskId);
        const updatedTask = {
            title: name,
            color: color,
        };
        await updateDoc(taskDocRef, updatedTask);
        // await get().fetchTaskLists(); // Re-fetch task lists to reflect the update
        console.log("Task updated:", updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
    }
}