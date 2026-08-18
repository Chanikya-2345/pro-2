import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy
    
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
    getAuth,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-njAkryA8s_chciQ2Tg09rVKufNvpGQ4",
  authDomain: "layali-lumina.firebaseapp.com",
  projectId: "layali-lumina",
  storageBucket: "layali-lumina.firebasestorage.app",
  messagingSenderId: "303441539050",
  appId: "1:303441539050:web:1df8e110c447bc706acc93",
  measurementId: "G-TX6CCEBZ7J"
};



const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const auth = getAuth(app);


export {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    auth,
    signInWithEmailAndPassword,
    query,
    orderBy
};