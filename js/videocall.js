import { startCamera, remoteStream } from "./webrtc-user.js";

const btnVideoCall = document.getElementById("btnVideoCall");
const startCall = document.getElementById("startCall");
const endCall = document.getElementById("endCall");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const modal = new bootstrap.Modal(
    document.getElementById("videoCallModal")
);

btnVideoCall.addEventListener("click", async (e) => {

    e.preventDefault();

    modal.show();

    try {

        const stream = await startCamera();

        localVideo.srcObject = stream;

        remoteVideo.srcObject = remoteStream;

    } catch (err) {

        alert("Kamera atau mikrofon tidak diizinkan.");

        console.error(err);

        modal.hide();

    }

});

startCall.addEventListener("click", async () => {

    alert("Menghubungi petugas...\n\n(Fungsi WebRTC akan dibuat pada Paket 2 & 3)");

});

endCall.addEventListener("click", () => {

    if (localVideo.srcObject) {

        localVideo.srcObject.getTracks().forEach(track => {

            track.stop();

        });

    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    modal.hide();

});
