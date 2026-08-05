import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
// =======================
// GLOBAL
// =======================

let rating = 0;

let currentFilter = 0;

let currentPage = 1;

const perPage = 5;

let reviews = [];
// =======================
// EMOJI
// =======================

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

};

});
// =======================
// RATING BINTANG
// =======================

const aspekRating = {};

document.querySelectorAll(".rating-stars").forEach(box=>{

const nama = box.dataset.name;

aspekRating[nama]=0;

for(let i=1;i<=5;i++){

const star=document.createElement("i");

star.className="bi bi-star-fill";

star.dataset.value=i;

star.onclick=()=>{

aspekRating[nama]=i;

box.querySelectorAll("i").forEach((s,index)=>{

if(index<i){

s.classList.add("active");

}else{

s.classList.remove("active");

}

});

};

box.appendChild(star);

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

kemudahan:aspekRating.kemudahan || rating,

kecepatan:aspekRating.kecepatan || rating,

pelayanan:aspekRating.pelayanan || rating,

keramahan:aspekRating.keramahan || rating,

pengaduan:aspekRating.pengaduan || rating,

keseluruhan:aspekRating.keseluruhan || rating,

createdAt:serverTimestamp()

});

alert("Terima kasih atas penilaian Anda.");

form.reset();

rating=0;

ratingText.innerHTML="Silakan pilih emoji";

emojis.forEach(e=>e.classList.remove("active"));

document.querySelectorAll(".rating-stars i").forEach(star=>{

star.classList.remove("active");

});

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
const badgeMap = {
    1: "Sangat Tidak Puas",
    2: "Kurang Puas",
    3: "Cukup",
    4: "Puas",
    5: "Sangat Puas"
};

function avatarHuruf(nama) {
    if (!nama) return "?";
    return nama.charAt(0).toUpperCase();
}

function formatTanggal(timestamp) {
    if (!timestamp) return "-";

    const tanggal = timestamp.toDate();

    return tanggal.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}
const q=query(
collection(db,"feedback"),
orderBy("createdAt","desc")
);
// =========================
// PAGINATION & FILTER
// =========================


onSnapshot(q, (snapshot) => {
reviews = [];

snapshot.forEach(doc=>{

reviews.push({

id:doc.id,

...doc.data()

});

});
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
// TAMPILKAN ULASAN
// ========================

reviewList.innerHTML = "";

renderReviews();
   
    // ========================
// UPDATE PANEL RINGKASAN
// ========================

const rata =
total === 0
? 0
:
(
(jumlah1*1)+(jumlah2*2)+(jumlah3*3)+(jumlah4*4)+(jumlah5*5)
)
/total;

document.getElementById("avgRating").innerHTML =
rata.toFixed(1);

document.getElementById("totalReview").innerHTML =
total + " Ulasan";

document.getElementById("bar5").style.width =
persen(jumlah5)+"%";

document.getElementById("bar4").style.width =
persen(jumlah4)+"%";

document.getElementById("bar3").style.width =
persen(jumlah3)+"%";

document.getElementById("bar2").style.width =
persen(jumlah2)+"%";

document.getElementById("bar1").style.width =
persen(jumlah1)+"%";
    });
function renderReviews() {

    reviewList.innerHTML = "";

    let data = [...reviews];

    // Filter rating
    if (currentFilter !== 0) {
        data = data.filter(r => r.rating === currentFilter);
    }

    // Pagination
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const tampil = data.slice(start, end);

    if (tampil.length === 0) {

        reviewList.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-chat-square-text display-4 text-muted"></i>
            <p class="mt-3 text-muted">
                Belum ada ulasan.
            </p>
        </div>
        `;

        renderPagination(0);
        return;
    }

    tampil.forEach(data => {

        reviewList.innerHTML += `

<div class="review-card mb-3">

<div class="review-header d-flex justify-content-between">

<div class="review-user d-flex">

<div class="avatar">

${avatarHuruf(data.nama)}

</div>

<div class="ms-3">

<strong>${data.nama}</strong>

<br>

<small class="text-muted">

${formatTanggal(data.createdAt)}

</small>

<br>

<span class="review-badge">

${badgeMap[data.rating]}

</span>

</div>

</div>

<div style="font-size:28px">

${emojiMap[data.rating]}

</div>

</div>

<p class="mt-3 mb-0">

${data.komentar || "-"}

</p>

</div>

`;

    });

    renderPagination(data.length);

}
    
    function renderPagination(totalReview) {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPage = Math.ceil(totalReview / perPage);

    if (totalPage <= 1) return;

    for (let i = 1; i <= totalPage; i++) {

        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link"
                   href="#"
                   onclick="gotoPage(${i}); return false;">
                   ${i}
                </a>
            </li>
        `;

    }

}
   // =========================
// FILTER RATING
// =========================

document.querySelectorAll(".filter-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        currentFilter = Number(btn.dataset.filter);

        currentPage = 1;

        // Ubah warna tombol aktif
        document.querySelectorAll(".filter-btn").forEach(b => {

            b.classList.remove("btn-success");
            b.classList.add("btn-outline-success");

        });

        btn.classList.remove("btn-outline-success");
        btn.classList.add("btn-success");

        renderReviews();

    });

});
window.gotoPage = function(page){

    currentPage = page;

    renderReviews();

}
