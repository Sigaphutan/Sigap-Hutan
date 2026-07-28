import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    doc,
    onSnapshot,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// Firebase Config
// =========================
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

// =========================
// Elemen HTML
// =========================
const callStatus = document.getElementById("callStatus");
const btnOnline = document.getElementById("btnOnline");
const btnOffline = document.getElementById("btnOffline");
const btnAccept = document.getElementById("btnAccept");
const btnReject = document.getElementById("btnReject");

// =========================
// Dering Browser
// =========================
let ringtone = null;

function beep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.value = 0.2;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    setTimeout(() => {
        osc.stop();
        ctx.close();
    }, 300);
}

function mulaiDering() {
    if (ringtone) return;

    ringtone = setInterval(() => {
        beep();
    }, 1000);
}

function berhentiDering() {
    if (!ringtone) return;

    clearInterval(ringtone);
    ringtone = null;
}

// =========================
// Pantau Status Call Center
// =========================
onSnapshot(callRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    berhentiDering();

    btnAccept.style.display = "none";
    btnReject.style.display = "none";

    switch (data.status) {

        case "online":

            callStatus.innerHTML = "🟢 Online";
            break;

        case "offline":

            callStatus.innerHTML = "🔴 Offline";
            break;

        case "calling":

            callStatus.innerHTML = "📞 Ada Panggilan Masuk";

            btnAccept.style.display = "inline-block";
            btnReject.style.display = "inline-block";

            mulaiDering();
            break;

        case "accepted":

            callStatus.innerHTML = "🎥 Sedang Video Call";
            break;

        case "rejected":

            callStatus.innerHTML = "❌ Panggilan Ditolak";
            break;

        default:

            callStatus.innerHTML = "⚪ Status Tidak Diketahui";
    }
});

// =========================
// Tombol Online
// =========================
btnOnline.addEventListener("click", async () => {

    await updateDoc(callRef, {
        status: "online"
    });

});

// =========================
// Tombol Offline
// =========================
btnOffline.addEventListener("click", async () => {

    await updateDoc(callRef, {
        status: "offline"
    });

});

// =========================
// Tombol Terima
// =========================
btnAccept.addEventListener("click", async () => {

    berhentiDering();

    await updateDoc(callRef, {
        status: "accepted"
    });

});

// =========================
// Tombol Tolak
// =========================
btnReject.addEventListener("click", async () => {

    berhentiDering();

    await updateDoc(callRef, {
        status: "rejected"
    });

});

console.log("✅ Call Center SIGAP HUTAN Aktif");
