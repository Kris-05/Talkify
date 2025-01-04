import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvoOcDAeXH2Cf_dXh0YlkQp2lDpmvZxrs",
  authDomain: "talkify-9b7b0.firebaseapp.com",
  projectId: "talkify-9b7b0",
  storageBucket: "talkify-9b7b0.firebasestorage.app",
  messagingSenderId: "850435580668",
  appId: "1:850435580668:web:5fa3ecf505f1476b1c6d79",
  measurementId: "G-LP7S8WL1QS"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);