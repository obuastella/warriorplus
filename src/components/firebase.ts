// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDD-lhJj4HheSTJpPcL9nEXaceUoH4BBs",
  authDomain: "warriorplus-92843.firebaseapp.com",
  projectId: "warriorplus-92843",
  storageBucket: "warriorplus-92843.firebasestorage.app",
  messagingSenderId: "1054799311273",
  appId: "1:1054799311273:web:f95a8724cdc83e9899d4b8",
  measurementId: "G-6TMLWBM9MD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore();
export default app;
