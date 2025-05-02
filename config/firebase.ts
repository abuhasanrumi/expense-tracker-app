// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from '@react-native-async-storage/async-storage'
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCfXZgZmKTPUG4-OwbM3aIA2sWbGjv9UFI',
  authDomain: 'expense-tracker-app-479e9.firebaseapp.com',
  projectId: 'expense-tracker-app-479e9',
  storageBucket: 'expense-tracker-app-479e9.firebasestorage.app',
  messagingSenderId: '808537211593',
  appId: '1:808537211593:web:d29f92979c46db3ceb0318'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

// db
export const firestore = getFirestore(app)
