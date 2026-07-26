import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let rating = 0;

const emojis = document.querySelectorAll(".emoji");
const ratingText = document.getElementById("ratingText");

const pesan = {
    1: "😡 Sangat Tidak Puas",
    2: "😕 Kurang Puas",
    3: "😐 Cukup",
    4: "😊 Puas",
    5: "😍 Sangat Puas"
};

emojis.forEach((emoji) => {

    emoji.onclick = () => {

        emojis.forEach(e => e.classList.remove("active"));

        emoji.classList.add("active");

        rating = Number(emoji.dataset.rating);

        ratingText.innerHTML = pesan[rating];

    };

});

const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (rating === 0) {

        alert("Silakan pilih emoji.");

        return;

    }

    let nama = document.getElementById("nama").value.trim();

    if (nama === "") nama = "Anonim";

    const komentar = document.getElementById("komentar").value.trim();

    try {

        await addDoc(collection(db, "feedback"), {

            nama,

            komentar,

            rating,

            createdAt: serverTimestamp()

        });

        alert("Terima kasih atas penilaian Anda 😊");

        form.reset();

        emojis.forEach(e => e.classList.remove("active"));

        ratingText.innerHTML = "Silakan pilih emoji";

        rating = 0;

    }

    catch (err) {

        console.log(err);

        alert("Gagal mengirim penilaian.");

    }

});
