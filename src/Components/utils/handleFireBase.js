import {projectFirestore} from "../../firebase/config";

export const getFireBaseData = (collectionName, setData, callBack) =>{
        projectFirestore.collection('adminUser').doc(collectionName).onSnapshot((doc) => {
            if(callBack){
                setData(callBack(doc.data()))
            }
            else{
                setData(doc.data())
            }
        })
}

export const updateFireBaseData = (collectionName, data) =>{
    projectFirestore.collection('adminUser').doc(collectionName).set(data)
}