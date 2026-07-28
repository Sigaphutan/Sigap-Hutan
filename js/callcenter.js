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
onSnapshot(callRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    console.log("Call Center:", data);

});

console.log("✅ Call Center SIGAP HUTAN aktif");
const btnOnline = document.getElementById("btnOnline");
const btnOffline = document.getElementById("btnOffline");
const callStatus = document.getElementById("callStatus");
const btnAccept = document.getElementById("btnAccept");
const btnReject = document.getElementById("btnReject");

onSnapshot(callRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.status === "online") {

        callStatus.innerHTML = "🟢 Online";

        btnAccept.style.display = "none";
        btnReject.style.display = "none";

    }

    else if (data.status === "offline") {

        callStatus.innerHTML = "🔴 Offline";

        btnAccept.style.display = "none";
        btnReject.style.display = "none";

    }

    else if (data.status === "calling") {

        callStatus.innerHTML = "📞 Ada Panggilan Masuk";

        btnAccept.style.display = "block";
        btnReject.style.display = "block";

    }

    else if (data.status === "accepted") {

        callStatus.innerHTML = "🎥 Sedang Video Call";

        btnAccept.style.display = "none";
        btnReject.style.display = "none";

    }

    else if (data.status === "rejected") {

        callStatus.innerHTML = "❌ Panggilan Ditolak";

        btnAccept.style.display = "none";
        btnReject.style.display = "none";

    }

});

btnOnline.addEventListener("click", async () => {

    await updateDoc(callRef, {
        status: "online"
    });

});

btnOffline.addEventListener("click", async () => {

    await updateDoc(callRef, {
        status: "offline"
    });

});
