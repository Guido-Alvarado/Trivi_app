// src/firebaseConfig.js
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Proyecto 1
const firebaseConfig1 = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app1 = initializeApp(firebaseConfig1, "app1");
export const auth = getAuth(app1);
export const db1 = getFirestore(app1);
export const storage1 = getStorage(app1);
export const analytics1 = getAnalytics(app1);

// Proyecto 2
const firebaseConfig2 = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_2,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_2,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL_2,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_2,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_2,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_2,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_2,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_2
};

export const app2 = initializeApp(firebaseConfig2, "app2");
export const db2 = getFirestore(app2);
export const storage2 = getStorage(app2);
export const analytics2 = getAnalytics(app2);
