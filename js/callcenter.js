import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    doc,
    onSnapshot,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyB4cX8QGigpL_hL9Wi-_HVZunkctdIGw_g",

    authDomain: "sigap-hutan-715d1.firebaseapp.com",

    projectId: "sigap-hutan-715d1",

    storageBucket: "sigap-hutan-715d1.firebasestorage.app",

    messagingSenderId: "902737210675",

    appId: "1:902737210675:web:85383221791e29f7e1e246"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const callRef = doc(db, "callcenter", "current");

console.log("✅ Call Center SIGAP HUTAN aktif");
