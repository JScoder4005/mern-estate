// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'mern-estate-c3115.firebaseapp.com',
    projectId: 'mern-estate-c3115',
    storageBucket: 'mern-estate-c3115.appspot.com',
    messagingSenderId: '446391348637',
    appId: '1:446391348637:web:c03e55b9933e1391015374',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
