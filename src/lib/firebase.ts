// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDviaexscUX3Q7ATPaPNxxaFW-0bLh4hqI",
  authDomain: "dj-cs-record.firebaseapp.com",
  projectId: "dj-cs-record",
  storageBucket: "dj-cs-record.firebasestorage.app",
  messagingSenderId: "339145232126",
  appId: "1:339145232126:web:fcd4713b1a76fab7bd1faf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
