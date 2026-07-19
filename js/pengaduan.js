import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("formPengaduan");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

        nama: document.getElementById("nama").value,

        kabupaten: document.getElementById("kabupaten").value,

        kecamatan: document.getElementById("kecamatan").value,

        lokasi: document.getElementById("lokasi").value,

        jenis: document.getElementById("jenis").value,

        tanggal: document.getElementById("tanggal").value,

        deskripsi: document.getElementById("deskripsi").value,

        status: "Menunggu",

        dibuatPada: new Date()

    };

    try {

        await addDoc(collection(db, "laporan"), data);

        alert("Pengaduan berhasil dikirim.");

        form.reset();

    } catch (error) {

        console.error(error);

        alert("Gagal mengirim pengaduan.");

    }

});
