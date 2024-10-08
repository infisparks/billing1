// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD7_5pY79YGSN3JcqmXR8hqYUFkGVzK6sk",
  authDomain: "medford-dc0a9.firebaseapp.com",
  databaseURL: "https://medford-dc0a9-default-rtdb.firebaseio.com",
  projectId: "medford-dc0a9",
  storageBucket: "medford-dc0a9.appspot.com",
  messagingSenderId: "1061076293989",
  appId: "1:1061076293989:web:b3665df46e056c0f4aa98c",
  measurementId: "G-83S71XJJE0"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app); 
export { app, db ,storage ,auth}; // Named export for db
