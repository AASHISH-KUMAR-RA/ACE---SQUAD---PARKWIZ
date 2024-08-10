// Import the functions you need from the SDKs you need
import { initializeApp ,getApps,getApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI8UDjadVtps3YHalEPwOINxtldCfIIKM",
  authDomain: "parkwiz-18e48.firebaseapp.com",
  projectId: "parkwiz-18e48",
  storageBucket: "parkwiz-18e48.appspot.com",
  messagingSenderId: "538039517976",
  appId: "1:538039517976:web:5d7fd395c654a873f2d46d",
  measurementId: "G-5Y1QPYHZZE"
};

// Initialize Firebase
const app = getApps().length==0?initializeApp(firebaseConfig):getApp();
const auth=getAuth(app);
auth.useDeviceLanguage()
export {auth};