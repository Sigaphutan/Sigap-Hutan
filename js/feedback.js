import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let rating = 0;

// ===========================
// PILIH EMOJI
// ===========================

const emojis = document.querySelectorAll(".emoji");

const ratingText = document.getElementById("ratingText");

const teks = {
    1: "😡 Sangat Tidak Puas",
    2: "😕 Kurang Puas",
    3: "😐 Cukup",
    4: "😊 Puas",
    5: "😍 Sangat Puas"
};

emojis.forEach((emoji) => {

    emoji.addEventListener("click", () => {

        emojis.forEach(e => e.classList.remove("active"));

        emoji.classList.add("active");

        rating = Number(emoji.dataset.rating);

        ratingText.innerHTML = teks[rating];

    });

});

// ===========================
// KIRIM PENILAIAN
// ===========================

document.getElementById("feedbackForm")
.addEventListener("submit", async (e)=>{

    e.preventDefault();

    if(rating===0){

        alert("Silakan pilih emoji terlebih dahulu.");

        return;

    }

    let nama = document.getElementById("nama").value.trim();

    let komentar = document.getElementById("komentar").value.trim();

    if(nama===""){

        nama="Anonim";

    }

    try{

        await addDoc(collection(db,"feedback"),{

            nama:nama,

            komentar:komentar,

            rating:rating,

            createdAt:serverTimestamp()

        });

        alert("Terima kasih atas penilaian Anda 😊");

        document.getElementById("feedbackForm").reset();

        emojis.forEach(e=>e.classList.remove("active"));

        ratingText.innerHTML="Silakan pilih emoji";

        rating=0;

    }

    catch(error){

        console.error(error);

        alert("Gagal mengirim penilaian.");

    }

});
