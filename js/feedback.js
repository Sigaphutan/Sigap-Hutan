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

    // ========================
    // HITUNG JUMLAH RATING
    // ========================

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

    const total = snapshot.size;

    function persen(jumlah) {

        if (total === 0) return 0;

        return Math.round((jumlah / total) * 100);

    }

    // ========================
    // JUDUL ULASAN
    // ========================

    reviewList.innerHTML = `
        <h3 class="fw-bold mb-4">
            💬 Ulasan Masyarakat
        </h3>
    `;

    // ========================
    // TAMPILKAN ULASAN
    // ========================

    snapshot.forEach((doc) => {

        const data = doc.data();

        reviewList.innerHTML += `

        <div class="review-card mb-4">

            <div class="review-header d-flex justify-content-between align-items-center">

                <strong>${data.nama}</strong>

                <span style="font-size:22px;">
                    ${emojiMap[data.rating]}
                </span>

            </div>

            <p class="mb-0 mt-2">
                ${data.komentar}
            </p>

        </div>

        `;

    });

    // ========================
    // STATISTIK DI BAWAH
    // ========================

    reviewList.innerHTML += `

        <hr class="my-5">

        <h3 class="fw-bold text-success mb-4">
            📊 Statistik Penilaian
        </h3>

        <div class="rating-summary">

            <p class="mb-2">
                😍 Sangat Puas : <strong>${persen(jumlah5)}%</strong> (${jumlah5})
            </p>

            <div class="progress mb-4" style="height:18px;">
                <div class="progress-bar bg-success"
                    style="width:${persen(jumlah5)}%">
                </div>
            </div>


            <p class="mb-2">
                😊 Puas : <strong>${persen(jumlah4)}%</strong> (${jumlah4})
            </p>

            <div class="progress mb-4" style="height:18px;">
                <div class="progress-bar bg-info"
                    style="width:${persen(jumlah4)}%">
                </div>
            </div>


            <p class="mb-2">
                😐 Cukup : <strong>${persen(jumlah3)}%</strong> (${jumlah3})
            </p>

            <div class="progress mb-4" style="height:18px;">
                <div class="progress-bar bg-warning"
                    style="width:${persen(jumlah3)}%">
                </div>
            </div>


            <p class="mb-2">
                😕 Kurang Puas : <strong>${persen(jumlah2)}%</strong> (${jumlah2})
            </p>

            <div class="progress mb-4" style="height:18px;">
                <div class="progress-bar"
                    style="background:#fd7e14;width:${persen(jumlah2)}%">
                </div>
            </div>


            <p class="mb-2">
                😡 Sangat Tidak Puas : <strong>${persen(jumlah1)}%</strong> (${jumlah1})
            </p>

            <div class="progress" style="height:18px;">
                <div class="progress-bar bg-danger"
                    style="width:${persen(jumlah1)}%">
                </div>
            </div>

        </div>

    `;

});
