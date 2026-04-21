import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsXcoyWbnEWU_YRHJYfib71jcCv5x9voI",
  authDomain: "beverageshop-ea97b.firebaseapp.com",
  projectId: "beverageshop-ea97b",
  storageBucket: "beverageshop-ea97b.firebasestorage.app",
  messagingSenderId: "383810085546",
  appId: "1:383810085546:web:0b9f4e48081615452ae6d3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default db;
export { auth, googleProvider };
