import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    doc,
    onSnapshot,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =======================
// Firebase
// =======================
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

// =======================
// Elemen
// =======================
const btnVideoCall = document.getElementById("btnVideoCall");
const startCall = document.getElementById("startCall");
const adminStatus = document.getElementById("adminStatus");

const modal = new bootstrap.Modal(
    document.getElementById("videoCallModal")
);

// =======================
// Status Admin
// =======================
onSnapshot(callRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.status === "online") {

        adminStatus.innerHTML = "🟢 Online";

    } else {

        adminStatus.innerHTML = "🔴 Offline";

    }

});

// =======================
// Buka Popup
// =======================
btnVideoCall.addEventListener("click", (e) => {

    e.preventDefault();

    modal.show();

});

// =======================
// Hubungi Admin
// =======================
startCall.addEventListener("click", async () => {

    try {

        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        await updateDoc(callRef, {

            status: "calling",
            caller: "Masyarakat"

        });

        alert("Permintaan video call telah dikirim.\nSilakan tunggu admin menerima.");

        modal.hide();

    } catch (err) {

        alert("Kamera atau mikrofon tidak diizinkan.");

        console.error(err);

    }

});
