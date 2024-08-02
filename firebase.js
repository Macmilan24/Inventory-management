// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_dLce8UMjwHGkInV-5JVzRFLvhXrhTK0",
  authDomain: "hs-inventory-management-c5802.firebaseapp.com",
  projectId: "hs-inventory-management-c5802",
  storageBucket: "hs-inventory-management-c5802.appspot.com",
  messagingSenderId: "211081746213",
  appId: "1:211081746213:web:b0cf179bfede9123802ccc",
  measurementId: "G-JPLBRX0YPZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
