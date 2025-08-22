// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYhSRyvHpmR_MnEVDS9mcVhEf35-cXSJs",
  authDomain: "mission-of-generations.firebaseapp.com",
  projectId: "mission-of-generations",
  storageBucket: "mission-of-generations.firebasestorage.app",
  messagingSenderId: "225493618675",
  appId: "1:225493618675:web:4cb6d105e10d6d517b0c86",
  measurementId: "G-0PTZ6K2NK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);
