// =============================
// FIREBASE CONFIG - SIGAP HUTAN
// =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4cX8QGigpL_hL9Wi-_HVZunkctdIGw_g",
  authDomain: "sigap-hutan-715d1.firebaseapp.com",
  projectId: "sigap-hutan-715d1",
  storageBucket: "sigap-hutan-715d1.firebasestorage.app",
  messagingSenderId: "902737210675",
  appId: "1:902737210675:web:85383221791e29f7e1e246"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Authentication
const auth = getAuth(app);

// Firebase Storage
const storage = getStorage(app);

// Export agar bisa dipakai di file lain
export { db, auth, storage };
