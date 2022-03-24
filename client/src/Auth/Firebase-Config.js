
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'


const firebaseConfig = {
  apiKey: 'AIzaSyCXEDzFbp4LVz2uHGQJtET7Wcbii5xYtOE',
  authDomain: "local-guide-11c65.firebaseapp.com",
  projectId: "local-guide-11c65",
  storageBucket: "local-guide-11c65.appspot.com",
  messagingSenderId: "332072745",
  appId: "1:332072745:web:2b52d819d59994a2f4d938",
  measurementId: "G-W6Z184D54E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);



