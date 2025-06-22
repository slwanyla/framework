// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyABHy3zU5UU7gYt5SFnEfRZrvr44QX5sJA",
  authDomain: "ojol-online-d9df1.firebaseapp.com",
  databaseURL: "https://ojol-online-d9df1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ojol-online-d9df1",
  storageBucket: "ojol-online-d9df1.firebasestorage.app",
  messagingSenderId: "784431260540",
  appId: "1:784431260540:web:ec661e4174c1b8f101faf9",
  measurementId: "G-C45420ZLMC"
};

// 🔥 Init Firebase App
const app = initializeApp(firebaseConfig);

// 📡 Get DB Instance
export const db = getDatabase(app);
