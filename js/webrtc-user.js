import { db } from "./firebase.js";

import {
    doc,
    updateDoc,
    collection,
    addDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// STUN SERVER
// =========================

export const servers = {

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
// PEER CONNECTION
// =========================

export const peer = new RTCPeerConnection(servers);

export let localStream = null;

export let remoteStream = new MediaStream();

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
// START CAMERA
// =========================

export async function startCamera() {

    localStream = await navigator.mediaDevices.getUserMedia({

        video: true,
        audio: true

    });

    localStream.getTracks().forEach(track => {

        peer.addTrack(track, localStream);

    });

    return localStream;

}

// =========================
// ICE CANDIDATE
// =========================

peer.onicecandidate = async (event) => {

    if (event.candidate) {

        await addDoc(
            offerCandidates,
            event.candidate.toJSON()
        );

    }

};

// =========================
// REMOTE VIDEO
// =========================

peer.ontrack = (event) => {

    event.streams[0].getTracks().forEach(track => {

        remoteStream.addTrack(track);

    });

};

// =========================
// CREATE OFFER
// =========================

export async function createOffer() {

    const offer = await peer.createOffer();

    await peer.setLocalDescription(offer);

    await updateDoc(callRef, {

        offer: {
            type: offer.type,
            sdp: offer.sdp
        },

        answer: null,

        status: "calling"

    });

}

// =========================
// LISTEN ANSWER
// =========================

onSnapshot(callRef, async (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    if (!data.answer) return;

    if (peer.currentRemoteDescription) return;

    await peer.setRemoteDescription(
        new RTCSessionDescription(data.answer)
    );

});

// =========================
// LISTEN ICE ADMIN
// =========================

onSnapshot(answerCandidates, (snapshot) => {

    snapshot.docChanges().forEach(async (change) => {

        if (change.type === "added") {

            await peer.addIceCandidate(
                new RTCIceCandidate(change.doc.data())
            );

        }

    });

});

// =========================
// CLOSE
// =========================

export function closeCall() {

    if (localStream) {

        localStream.getTracks().forEach(track => track.stop());

        localStream = null;

    }

    remoteStream.getTracks().forEach(track => {

        remoteStream.removeTrack(track);

    });

}
