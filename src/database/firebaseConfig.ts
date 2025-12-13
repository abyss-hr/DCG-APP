// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIeUhtKvancPltHOozpC3Ckp0U1MaMX8A",
  authDomain: "dubrovnikcityapp.firebaseapp.com",
  projectId: "dubrovnikcityapp",
  storageBucket: "dubrovnikcityapp.firebasestorage.app",  // ✅ KEEP THIS
  messagingSenderId: "984840969484",
  appId: "1:984840969484:web:0520beb8a148a300febd29",
  measurementId: "G-2QJ4MWC22M",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
