import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB-_S3vbEFwbYHeA0ENtyBQEQyy6kGTxMc",
  authDomain: "peinados-5f37f.firebaseapp.com",
  databaseURL: "https://peinados-5f37f-default-rtdb.firebaseio.com",
  projectId: "peinados-5f37f",
  storageBucket: "peinados-5f37f.firebasestorage.app",
  messagingSenderId: "605579037908",
  appId: "1:605579037908:web:711268e51ac838922d3f41"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);