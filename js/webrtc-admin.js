import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    collection,
    addDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// =========================
// STUN SERVER
// =========================

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302"
            ]
        }
    ]
};

// =========================
// PEER
// =========================

const peer = new RTCPeerConnection(servers);

let localStream = null;
const remoteStream = new MediaStream();

// =========================
// ELEMENT
// =========================

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const btnAccept = document.getElementById("btnAccept");
const btnReject = document.getElementById("btnReject");

const ringtone = document.getElementById("ringtone");

// =========================
// FIRESTORE
// =========================

const callRef = doc(db, "callcenter", "current");

const offerCandidates = collection(
    db,
    "callcenter",
    "current",
    "offerCandidates"
);

const answerCandidates = collection(
    db,
    "callcenter",
    "current",
    "answerCandidates"
);

// =========================
// CAMERA
// =========================

async function startCamera() {

    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    localVideo.srcObject = localStream;

    localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
    });

}

// =========================
// REMOTE VIDEO
// =========================

peer.ontrack = (event) => {

    event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
    });

    remoteVideo.srcObject = remoteStream;

};

// =========================
// ICE
// =========================

peer.onicecandidate = async (event) => {

    if (!event.candidate) return;

    await addDoc(
        answerCandidates,
        event.candidate.toJSON()
    );

};

// =========================
// DENGARKAN PANGGILAN MASUK
// =========================

onSnapshot(callRef, async (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    if (data.status === "calling") {

        console.log("Ada panggilan masuk");

        if (ringtone) {

            ringtone.currentTime = 0;

            ringtone.play().catch(() => {});

        }

        btnAccept.style.display = "inline-block";
        btnReject.style.display = "inline-block";

    }

});

// =========================
// TERIMA
// =========================

btnAccept.addEventListener("click", async () => {

    if (ringtone) {

        ringtone.pause();
        ringtone.currentTime = 0;

    }

    btnAccept.style.display = "none";
    btnReject.style.display = "none";

    await startCamera();

    const snap = await getDoc(callRef);

    if (!snap.exists()) return;

    const data = snap.data();

    if (!data.offer) return;

    await peer.setRemoteDescription(
        new RTCSessionDescription(data.offer)
    );

    const answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);

    await updateDoc(callRef, {

        answer: {
            type: answer.type,
            sdp: answer.sdp
        },

        status: "accepted"

    });

});

// =========================
// TOLAK
// =========================

btnReject.addEventListener("click", async () => {

    if (ringtone) {

        ringtone.pause();
        ringtone.currentTime = 0;

    }

    btnAccept.style.display = "none";
    btnReject.style.display = "none";

    await updateDoc(callRef, {

        status: "rejected"

    });

});

// =========================
// ICE USER
// =========================

onSnapshot(offerCandidates, snapshot => {

    snapshot.docChanges().forEach(async change => {

        if (change.type === "added") {

            try {

                await peer.addIceCandidate(
                    new RTCIceCandidate(change.doc.data())
                );

            } catch (e) {

                console.error(e);

            }

        }

    });

});
