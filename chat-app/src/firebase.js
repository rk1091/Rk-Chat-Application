// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRSWAfwFAE1fdj2fvM8Npt12pquloSQus",
  authDomain: "rk-chat-99148.firebaseapp.com",
  projectId: "rk-chat-99148",
  storageBucket: "rk-chat-99148.appspot.com",
  messagingSenderId: "772466433939",
  appId: "1:772466433939:web:ee6688f705619b232c5266",
  measurementId: "G-GF1N056DHZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const analytics = getAnalytics(app);
export const storage = getStorage();
export const db = getFirestore();
