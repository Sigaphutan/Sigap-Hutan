import { db, storage } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

console.log("pengaduan.js berhasil dimuat");

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
console.log(kabupaten);
console.log(kecamatan);

kabupaten.addEventListener("change", () => {
    console.log("Kabupaten dipilih:", kabupaten.value);

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
// ===============================
// SHARE LOKASI
// ===============================

let latitude = "";
let longitude = "";
let mapsUrl = "";

const btnLokasi = document.getElementById("btnLokasi");
const statusLokasi = document.getElementById("statusLokasi");

btnLokasi.addEventListener("click", () => {

    if (!navigator.geolocation) {
        statusLokasi.innerHTML = "❌ Browser tidak mendukung lokasi.";
        return;
    }

    statusLokasi.innerHTML = "📍 Mengambil lokasi...";

    navigator.geolocation.getCurrentPosition(

        (position) => {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

            statusLokasi.innerHTML =
                "✅ Lokasi berhasil dibagikan";

        },

        (error) => {

            statusLokasi.innerHTML =
                "❌ Gagal mengambil lokasi.";

            console.error(error);

        }

    );

});

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
        latitude: latitude,

longitude: longitude,

mapsUrl: mapsUrl,

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
latitude = "";
longitude = "";
mapsUrl = "";

statusLokasi.innerHTML = "";
    }

    catch (error) {

        console.error(error);

        alert("Terjadi kesalahan.");

    }

});
