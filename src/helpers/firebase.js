import { initializeApp } from "firebase/app";
import { getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging/sw";
const firebaseConfig = {
  apiKey: "AIzaSyC2DrV8cY-R5MZG1GwtBqi9C-HV8KCa71Q",
  authDomain: "market-place-e8208.firebaseapp.com",
  projectId: "market-place-e8208",
  storageBucket: "market-place-e8208.appspot.com",
  messagingSenderId: "139934815468",
  appId: "1:139934815468:web:dad61481e513120780c1c9",
  measurementId: "G-MJVP17YZEH",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging();
const db = getFirestore(app);

export { messaging, getToken, onMessage, db };
