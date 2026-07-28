import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const sendBtn = document.getElementById("sendBtn");

const input = document.getElementById("messageInput");

sendBtn.addEventListener("click", async ()=>{

    const text = input.value.trim();

    if(text==="") return;

    await addDoc(collection(db,"messages"),{

        sender:"user",

        message:text,

        time:serverTimestamp()

    });

    input.value="";

});
