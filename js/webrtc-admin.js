import { db } from "./firebase.js";

import {
doc,
onSnapshot,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const callRef = doc(db, "callcenter", "current");

const statusText = document.getElementById("statusAdmin");
const btnOnline = document.getElementById("btnOnline");
const btnOffline = document.getElementById("btnOffline");

const btnAccept = document.getElementById("btnAccept");
const btnReject = document.getElementById("btnReject");

const ringtone = document.getElementById("ringtone");

let status = "offline";

// ==========================
// ONLINE
// ==========================

btnOnline.onclick = async () => {

    status = "online";

    await updateDoc(callRef, {

        status: "online"

    });

};

// ==========================
// OFFLINE
// ==========================

btnOffline.onclick = async () => {

    status = "offline";

    await updateDoc(callRef, {

        status: "offline"

    });

};

// ==========================
// LISTENER
// ==========================

onSnapshot(callRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    statusText.innerHTML = data.status;

    if (data.status === "calling") {

        ringtone.play();

        btnAccept.disabled = false;

        btnReject.disabled = false;

    }

});

// ==========================
// TERIMA
// ==========================

btnAccept.onclick = async () => {

    ringtone.pause();

    ringtone.currentTime = 0;

    await updateDoc(callRef, {

        status: "accepted"

    });

};

// ==========================
// TOLAK
// ==========================

btnReject.onclick = async () => {

    ringtone.pause();

    ringtone.currentTime = 0;

    await updateDoc(callRef, {

        status: "rejected"

    });

};
