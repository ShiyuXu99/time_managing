import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAeAmUvhl6xJKL2bnVqGEE8xqR2gT9SJLM",
    authDomain: "time-tracking-fbd44.firebaseapp.com",
    projectId: "time-tracking-fbd44",
    storageBucket: "time-tracking-fbd44.appspot.com",
    messagingSenderId: "190103436468",
    appId: "1:190103436468:web:564fbe8f6903cc76372be1"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
