import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

//========================
// EMOJI
//========================

let rating = 0;

const emojis = document.querySelectorAll(".emoji");
const ratingText = document.getElementById("ratingText");

const teks = {
    1:"😡 Sangat Tidak Puas",
    2:"😕 Kurang Puas",
    3:"😐 Cukup",
    4:"😊 Puas",
    5:"😍 Sangat Puas"
};

emojis.forEach((emoji)=>{

    emoji.onclick=()=>{

        emojis.forEach(e=>e.classList.remove("active"));

        emoji.classList.add("active");

        rating=Number(emoji.dataset.rating);

        ratingText.innerHTML=teks[rating];

    }

});

//========================
// KIRIM DATA
//========================

const form=document.getElementById("feedbackForm");

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(rating===0){

        alert("Silakan pilih emoji.");

        return;

    }

    let nama=document.getElementById("nama").value.trim();

    if(nama===""){

        nama="Anonim";

    }

    const komentar=document.getElementById("komentar").value.trim();

    await addDoc(collection(db,"feedback"),{

        nama,

        komentar,

        rating,

        createdAt:serverTimestamp()

    });

    alert("Terima kasih atas penilaian Anda.");

    form.reset();

    emojis.forEach(e=>e.classList.remove("active"));

    ratingText.innerHTML="Silakan pilih emoji";

    rating=0;

});

//========================
// TAMPILKAN ULASAN
//========================

const reviewList=document.getElementById("reviewList");

const emojiMap={
1:"😡",
2:"😕",
3:"😐",
4:"😊",
5:"😍"
};

const q=query(
collection(db,"feedback"),
orderBy("createdAt","desc")
);

onSnapshot(q,(snapshot)=>{

reviewList.innerHTML="<h3>💬 Ulasan Masyarakat</h3>";

snapshot.forEach((doc)=>{

const data=doc.data();

reviewList.innerHTML+=`

<div class="review-card">

<div class="review-header">

<strong>${data.nama}</strong>

<span>${emojiMap[data.rating]}</span>

</div>

<p>${data.komentar}</p>

</div>

`;

});

});
