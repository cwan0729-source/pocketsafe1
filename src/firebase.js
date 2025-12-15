import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAxkUpBcOegUG8JMw7EQH-dJmHSRoKRbB4",
  authDomain: "safepocket-be7f4.firebaseapp.com",
  projectId: "safepocket-be7f4",
  storageBucket: "safepocket-be7f4.firebasestorage.app",
  messagingSenderId: "969671923810",
  appId: "1:969671923810:web:7baaf8b90e13917ead993b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);