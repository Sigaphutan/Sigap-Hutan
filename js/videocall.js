const appID = 1421040360;
const serverSecret = "743794df71d7e8d7f03b98d7c00bd73d";

const roomID = "sigaphutan-call";
const userID = "user_" + Math.floor(Math.random() * 100000);
const userName = "Pengunjung";

const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    userID,
    userName
);

const zp = ZegoUIKitPrebuilt.create(kitToken);

document.getElementById("startCall").onclick = function () {

    zp.joinRoom({

        container: document.querySelector("#videoCallModal .modal-body"),

        scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
        },

        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,

        showMicrophoneToggleButton: true,
        showCameraToggleButton: true,
        showScreenSharingButton: false,
        showTextChat: true,
        showUserList: false,
        showLeavingView: true

    });

};
