import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBys0TPpB_8OLh2GJi0PAYrgfB9lLJ30Ro",
  authDomain: "recap-910c9.firebaseapp.com",
  projectId: "recap-910c9",
  storageBucket: "recap-910c9.firebasestorage.app",
  messagingSenderId: "718487588851",
  appId: "1:718487588851:web:2d0e9cfb40f0abd7340c86",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
