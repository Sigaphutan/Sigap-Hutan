import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ===============================
// DAFTAR KECAMATAN
// ===============================

const dataKecamatan = {

    "Aceh Tenggara": [
        "Babussalam",
        "Badar",
        "Babul Makmur",
        "Babul Rahmah",
        "Bambel",
        "Bukit Tusam",
        "Darul Hasanah",
        "Deleng Pokhkisen",
        "Ketambe",
        "Lawe Alas",
        "Lawe Bulan",
        "Lawe Sigala-gala",
        "Lawe Sumur",
        "Leuser",
        "Semadam",
        "Tanoh Alas"
    ],

    "Gayo Lues": [
        "Blangkejeren",
        "Blang Pegayon",
        "Dabun Gelang",
        "Kuta Panjang",
        "Pantan Cuaca",
        "Pining",
        "Putri Betung",
        "Rikit Gaib",
        "Terangun",
        "Teripe Jaya",
        "Tripe Jaya"
    ]

};

// ===============================
// DROPDOWN KECAMATAN
// ===============================

const kabupaten = document.getElementById("kabupaten");
const kecamatan = document.getElementById("kecamatan");

kabupaten.addEventListener("change", () => {

    kecamatan.innerHTML =
        '<option value="">Pilih Kecamatan</option>';

    if (!kabupaten.value) return;

    dataKecamatan[kabupaten.value].forEach((item) => {

        const option = document.createElement("option");

        option.value = item;

        option.textContent = item;

        kecamatan.appendChild(option);

    });

});

// ===============================
// FORM
// ===============================

const form = document.getElementById("formPengaduan");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    // Kode laporan otomatis
    const kode =
        "SGH-" +
        Date.now().toString().slice(-8);

    const data = {

        kodeLaporan: kode,

        nama: document.getElementById("nama").value,

        kabupaten: kabupaten.value,

        kecamatan: kecamatan.value,

        lokasi: document.getElementById("lokasi").value,

        jenis: document.getElementById("jenis").value,

        tanggalKejadian:
            document.getElementById("tanggal").value,

        deskripsi:
            document.getElementById("deskripsi").value,

        status: "Menunggu",

        dibuatPada: serverTimestamp()

    };

    try {

        await addDoc(collection(db, "laporan"), data);

        alert(
            "Pengaduan berhasil dikirim.\n\nKode Laporan : " +
            kode
        );

        form.reset();

        kecamatan.innerHTML =
            '<option value="">Pilih Kecamatan</option>';

    }

    catch (error) {

        console.error(error);

        alert("Terjadi kesalahan.");

    }

});
