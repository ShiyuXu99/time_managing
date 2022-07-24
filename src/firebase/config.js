import firebase from 'firebase/app'
import 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeAmUvhl6xJKL2bnVqGEE8xqR2gT9SJLM",
    authDomain: "time-tracking-fbd44.firebaseapp.com",
    projectId: "time-tracking-fbd44",
    storageBucket: "time-tracking-fbd44.appspot.com",
    messagingSenderId: "190103436468",
    appId: "1:190103436468:web:564fbe8f6903cc76372be1"
};

// Initialize Firebase


firebase.initializeApp(firebaseConfig)

const projectFirestore = firebase.firestore()

export {projectFirestore}


