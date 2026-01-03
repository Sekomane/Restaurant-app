import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSkSLa8QMnqpO12xnMIaFPS_hIEQ1kyfM",
  authDomain: "restaurant-app-74fa0.firebaseapp.com",
  projectId: "restaurant-app-74fa0",
  storageBucket: "restaurant-app-74fa0.firebasestorage.app",
  messagingSenderId: "1069594633208",
  appId: "1:1069594633208:web:6fe96406aecf2d7acc2c0d"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
