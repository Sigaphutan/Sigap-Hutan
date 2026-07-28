import { db } from "./firebase.js";

import {
    doc,
    collection,
    addDoc,
    updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

peer.ontrack = (event) => {

    event.streams[0].getTracks().forEach(track => {

        remoteStream.addTrack(track);

    });

    remoteVideo.srcObject = remoteStream;

};

// =========================
// ICE ADMIN
// =========================

peer.onicecandidate = async (event) => {

    if (event.candidate) {

        await addDoc(
            answerCandidates,
            event.candidate.toJSON()
        );

    }

};

// =========================
// TERIMA PANGGILAN
// =========================

btnAccept.addEventListener("click", async () => {

    await startCamera();

    const call = (await onSnapshot);

    const snap = await new Promise(resolve => {

        onSnapshot(callRef, resolve);

    });

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
// ICE USER
// =========================

onSnapshot(offerCandidates, (snapshot) => {

    snapshot.docChanges().forEach(async change => {

        if (change.type === "added") {

            await peer.addIceCandidate(
                new RTCIceCandidate(change.doc.data())
            );

        }

    });

});
