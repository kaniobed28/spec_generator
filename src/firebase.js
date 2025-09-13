// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa9vQACMbsBkFREeCzGEwe2QIXdRf1yv0",
  authDomain: "connet-cc316.firebaseapp.com",
  databaseURL: "https://connet-cc316-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "connet-cc316",
  storageBucket: "connet-cc316.firebasestorage.app",
  messagingSenderId: "77063875793",
  appId: "1:77063875793:web:e5fe6ecbb811c1309629f0",
  measurementId: "G-M5JSXQS7KZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, db, auth };