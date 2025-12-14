// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcp2gtDd2I9n8eQEtwJEswyV3ltsV97Yo",
  authDomain: "intelli-class-5dd3f.firebaseapp.com",
  projectId: "intelli-class-5dd3f",
  storageBucket: "intelli-class-5dd3f.firebasestorage.app",
  messagingSenderId: "868618234474",
  appId: "1:868618234474:web:702bdfee70f426980bb813",
  measurementId: "G-W7XCZX02PX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
