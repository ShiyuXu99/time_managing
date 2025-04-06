import {addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {db} from "../firebase/config";

export const getFireBaseData = async (collectionPath, setData) => {
    // const collectionRef = collection(db, ...collectionPath);
    // try {
    //     const snapshot = await getDocs(collectionRef);
    //     const dataList = snapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data()
    //     }));
    //     setData(dataList);
    // } catch (error) {
    //     console.error("Error fetching collection data:", error);
    //     setData([]); // Optionally set to empty array on error
    // }
}

//
// export const getFirebaseDoc = (docName, setData) => {
//     const docRef = doc(db, 'adminUser', docName);
//     onSnapshot(docRef, (doc) => {
//         const data = doc.data();
//         setData(data);
//     });
// }
// export const getFirebaseCollection = async (docName, collectionName, setData) => {
//     const collectionRef = collection(db, 'adminUser', docName, collectionName);
//
//     try {
//         const snapshot = await getDocs(collectionRef);
//         const dataList = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));
//         setData(dataList);
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//         setData([]);  // Set empty array in state if there is an error
//     }
// }


export const updateFireBaseData = (collectionName, data) => {
    // const docRef = doc(db, 'adminUser', collectionName);
    // setDoc(docRef, data);
}