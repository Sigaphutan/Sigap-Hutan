export const servers={

iceServers:[

{

urls:[
"stun:stun.l.google.com:19302",
"stun:stun1.l.google.com:19302"
]

}

]

};

export const peer=new RTCPeerConnection(servers);

export let localStream=null;

export let remoteStream=new MediaStream();

export async function startCamera(){

localStream=await navigator.mediaDevices.getUserMedia({

video:true,

audio:true

});

localStream.getTracks().forEach(track=>{

peer.addTrack(track,localStream);

});

return localStream;

}

peer.ontrack=(event)=>{

event.streams[0].getTracks().forEach(track=>{

remoteStream.addTrack(track);

});

};

export function closeCall(){

peer.close();

}
