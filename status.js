import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ===============================
// ELEMENT
// ===============================

const btnCari = document.getElementById("btnCari");
const kodeInput = document.getElementById("kodeLaporan");

const hasilCard = document.getElementById("hasilStatus");
const pesan = document.getElementById("pesan");

// ===============================
// CARI STATUS
// ===============================

btnCari.addEventListener("click", async () => {

    const kode = kodeInput.value.trim().toUpperCase();

    hasilCard.style.display = "none";
    pesan.style.display = "none";

    if (!kode) {

        pesan.className = "alert alert-warning mt-4";
        pesan.innerHTML = "Silakan masukkan kode laporan.";
        pesan.style.display = "block";
        return;

    }

    try {

        const q = query(
            collection(db, "laporan"),
            where("kodeLaporan", "==", kode)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {

            pesan.className = "alert alert-danger mt-4";
            pesan.innerHTML = "Kode laporan tidak ditemukan.";
            pesan.style.display = "block";
            return;

        }

        querySnapshot.forEach((doc) => {

            const data = doc.data();

            document.getElementById("hasilKode").textContent =
                data.kodeLaporan || "-";

            document.getElementById("hasilNama").textContent =
                data.nama || "-";

            document.getElementById("hasilKabupaten").textContent =
                data.kabupaten || "-";

            document.getElementById("hasilKecamatan").textContent =
                data.kecamatan || "-";

            document.getElementById("hasilLokasi").textContent =
                data.lokasi || "-";

            document.getElementById("hasilJenis").textContent =
                data.jenis || "-";

            document.getElementById("hasilTanggal").textContent =
                data.tanggalKejadian || "-";

            document.getElementById("hasilDeskripsi").textContent =
                data.deskripsi || "-";

            // ===============================
            // STATUS BADGE
            // ===============================

            let badge = "";

            switch (data.status) {

                case "Menunggu":
                    badge =
                        '<span class="badge bg-warning text-dark">Menunggu</span>';
                    break;

                case "Diproses":
                    badge =
                        '<span class="badge bg-primary">Diproses</span>';
                    break;

                case "Selesai":
                    badge =
                        '<span class="badge bg-success">Selesai</span>';
                    break;

                case "Ditolak":
                    badge =
                        '<span class="badge bg-danger">Ditolak</span>';
                    break;

                default:
                    badge =
                        '<span class="badge bg-secondary">Tidak diketahui</span>';

            }

            document.getElementById("hasilStatusBadge").innerHTML = badge;

            // ===============================
            // FOTO
            // ===============================

            const foto = document.getElementById("hasilFoto");

            if (data.foto) {

                foto.src = data.foto;
                foto.style.display = "block";

            } else {

                foto.style.display = "none";

            }

            // ===============================
            // MAPS
            // ===============================

            const maps = document.getElementById("hasilMaps");

            if (data.mapsUrl) {

                maps.href = data.mapsUrl;
                maps.style.display = "inline-block";

            } else {

                maps.style.display = "none";

            }

            hasilCard.style.display = "block";

        });

    } catch (error) {

        console.error(error);

        pesan.className = "alert alert-danger mt-4";
        pesan.innerHTML = "Terjadi kesalahan : " + error.message;
        pesan.style.display = "block";

    }

});

// ===============================
// ENTER UNTUK MENCARI
// ===============================

kodeInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        btnCari.click();

    }

});
