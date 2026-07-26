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

onSnapshot(q, (snapshot) => {

    // Hitung jumlah tiap rating
    let jumlah1 = 0;
    let jumlah2 = 0;
    let jumlah3 = 0;
    let jumlah4 = 0;
    let jumlah5 = 0;

    snapshot.forEach((doc) => {
        const r = doc.data().rating;

        if (r == 1) jumlah1++;
        if (r == 2) jumlah2++;
        if (r == 3) jumlah3++;
        if (r == 4) jumlah4++;
        if (r == 5) jumlah5++;
    });

    const total = snapshot.size || 1;

    function persen(jumlah) {
        return Math.round((jumlah / total) * 100);
    }

    reviewList.innerHTML = `
        <h3>💬 Ulasan Masyarakat</h3>

        <div class="rating-summary">

            <p>😍 Sangat Puas : ${persen(jumlah5)}% (${jumlah5})</p>

            <div class="progress mb-2">
                <div class="progress-bar bg-success"
                    style="width:${persen(jumlah5)}%">
                </div>
            </div>

            <p>😊 Puas : ${persen(jumlah4)}% (${jumlah4})</p>

            <div class="progress mb-2">
                <div class="progress-bar bg-info"
                    style="width:${persen(jumlah4)}%">
                </div>
            </div>

            <p>😐 Cukup : ${persen(jumlah3)}% (${jumlah3})</p>

            <div class="progress mb-2">
                <div class="progress-bar bg-warning"
                    style="width:${persen(jumlah3)}%">
                </div>
            </div>

            <p>😕 Kurang Puas : ${persen(jumlah2)}% (${jumlah2})</p>

            <div class="progress mb-2">
                <div class="progress-bar"
                    style="width:${persen(jumlah2)}%;background:#fd7e14;">
                </div>
            </div>

            <p>😡 Sangat Tidak Puas : ${persen(jumlah1)}% (${jumlah1})</p>

            <div class="progress mb-4">
                <div class="progress-bar bg-danger"
                    style="width:${persen(jumlah1)}%">
                </div>
            </div>

        </div>
    `;

    // Tampilkan semua ulasan
    snapshot.forEach((doc) => {

        const data = doc.data();

        reviewList.innerHTML += `
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
