// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYp0MoWXWzuPUUaNKHn2vjLEGKbWcRg7k",
    authDomain: "ai-travel-18ea0.firebaseapp.com",
    projectId: "ai-travel-18ea0",
    storageBucket: "ai-travel-18ea0.appspot.com",
    messagingSenderId: "294913619375",
    appId: "1:294913619375:web:5721fb8c2001917e07ab5a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)