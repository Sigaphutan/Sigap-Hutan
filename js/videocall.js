import {
    startCamera,
    createOffer,
    closeCall,
    remoteStream
} from "./webrtc-user.js";

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

    startCall.disabled = true;
    startCall.innerHTML = "Menghubungi...";

    try {

        await createOffer();

    } catch (err) {

        console.error(err);

        alert("Gagal memulai panggilan.");

        startCall.disabled = false;
        startCall.innerHTML = "📞 Hubungi Sekarang";

    }

});

endCall.addEventListener("click", async () => {

    await closeCall();

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    startCall.disabled = false;
    startCall.innerHTML = "📞 Hubungi Sekarang";

    modal.hide();

});
