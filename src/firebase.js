import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAovECnuXuJtFVTxN8vhqeuxQI2WIPzgsc",
  authDomain: "sportzone-c8b53.firebaseapp.com",
  projectId: "sportzone-c8b53",
  storageBucket: "sportzone-c8b53.firebasestorage.app",
  messagingSenderId: "271924473162",
  appId: "1:271924473162:web:1fbd9f3d11701f463d65b3",
  measurementId: "G-84H50ZRPXM"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
