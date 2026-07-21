import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// =======================
// KONFIGURASI
// =======================

const ADMIN_EMAIL = "sigaphutan@gmail.com";

// =======================
// LOGIN ADMIN
// =======================

const provider = new GoogleAuthProvider();

window.loginAdmin = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error(error);
        alert("Login gagal: " + error.message);
    }
};

window.logoutAdmin = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        alert("Logout gagal.");
    }
};

// =======================
// ELEMENT HTML
// =======================

const tbody = document.getElementById("dataLaporan");
const total = document.getElementById("total");
const menunggu = document.getElementById("menunggu");
const diproses = document.getElementById("diproses");
const selesai = document.getElementById("selesai");
const search = document.getElementById("search");

// Tombol login & logout (opsional)
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

let semuaLaporan = [];

// =======================
// CEK LOGIN
// =======================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        if (btnLogin) btnLogin.style.display = "inline-block";
        if (btnLogout) btnLogout.style.display = "none";

        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:20px;">
                    Silakan login sebagai Admin.
                </td>
            </tr>
        `;

        return;
    }

    if (user.email !== ADMIN_EMAIL) {

        alert("Akses ditolak! Anda bukan Admin SIGAP HUTAN.");

        await signOut(auth);

        return;
    }

    if (btnLogin) btnLogin.style.display = "none";
    if (btnLogout) btnLogout.style.display = "inline-block";

    console.log("Login sebagai:", user.displayName);

    await loadLaporan();

});
// =======================
// LOAD LAPORAN
// =======================

async function loadLaporan() {

    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;padding:20px;">
                Memuat data...
            </td>
        </tr>
    `;

    try {

        const snapshot = await getDocs(collection(db, "laporan"));

        semuaLaporan = [];

        let totalData = 0;
        let jmlMenunggu = 0;
        let jmlDiproses = 0;
        let jmlSelesai = 0;

        let html = "";

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            semuaLaporan.push({
                id: docSnap.id,
                ...data
            });

            totalData++;

            switch (data.status) {
                case "Menunggu":
                    jmlMenunggu++;
                    break;

                case "Diproses":
                    jmlDiproses++;
                    break;

                case "Selesai":
                    jmlSelesai++;
                    break;
            }

            html += `
                <tr>

                    <td>${data.kodeLaporan ?? "-"}</td>

                    <td>${data.nama ?? "-"}</td>

                    <td>${data.lokasi ?? "-"}</td>

                    <td>${data.jenis ?? "-"}</td>

                    <td>
                        <select onchange="ubahStatus('${docSnap.id}', this.value)">

                            <option value="Menunggu" ${data.status === "Menunggu" ? "selected" : ""}>
                                Menunggu
                            </option>

                            <option value="Diproses" ${data.status === "Diproses" ? "selected" : ""}>
                                Diproses
                            </option>

                            <option value="Selesai" ${data.status === "Selesai" ? "selected" : ""}>
                                Selesai
                            </option>

                        </select>
                    </td>

                    <td>
                        ${
                            data.mapsUrl
                                ? `<a href="${data.mapsUrl}" target="_blank" rel="noopener noreferrer">📍 Maps</a>`
                                : "-"
                        }
                    </td>

                    <td>
                        <button onclick="hapusLaporan('${docSnap.id}')">
                            🗑️ Hapus
                        </button>
                    </td>

                </tr>
            `;

        });

        if (totalData === 0) {

            html = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:20px;">
                        Belum ada laporan.
                    </td>
                </tr>
            `;

        }

        tbody.innerHTML = html;

        total.textContent = totalData;
        menunggu.textContent = jmlMenunggu;
        diproses.textContent = jmlDiproses;
        selesai.textContent = jmlSelesai;
updateWaktuTerakhir();
    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;color:red;padding:20px;">
                    Gagal memuat data.
                </td>
            </tr>
        `;

    }

}
// =======================
// UBAH STATUS
// =======================

window.ubahStatus = async (id, statusBaru) => {

    try {

        await updateDoc(doc(db, "laporan", id), {
            status: statusBaru
        });

        await loadLaporan();

        console.log("Status berhasil diperbarui.");

    } catch (error) {

        console.error(error);

        alert("Gagal mengubah status.");

    }

};

// =======================
// HAPUS LAPORAN
// =======================

window.hapusLaporan = async (id) => {

    const yakin = confirm("Yakin ingin menghapus laporan ini?");

    if (!yakin) return;

    try {

        await deleteDoc(doc(db, "laporan", id));

        alert("Laporan berhasil dihapus.");

        await loadLaporan();

    } catch (error) {

        console.error(error);

        alert("Gagal menghapus laporan.");

    }

};

// =======================
// PENCARIAN DATA
// =======================

if (search) {

    search.addEventListener("keyup", () => {

        const keyword = search.value.trim().toLowerCase();

        const rows = tbody.querySelectorAll("tr");

        rows.forEach((row) => {

            const text = row.textContent.toLowerCase();

            row.style.display = text.includes(keyword)
                ? ""
                : "none";

        });

    });

}

// =======================
// REFRESH OTOMATIS
// =======================

// Refresh data setiap 30 detik
setInterval(async () => {

    if (auth.currentUser &&
        auth.currentUser.email === ADMIN_EMAIL) {

        await loadLaporan();

    }

}, 30000);
// =======================
// UPDATE TERAKHIR
// =======================

const lastUpdate = document.getElementById("lastUpdate");

function updateWaktuTerakhir() {

    if (!lastUpdate) return;

    const sekarang = new Date();

    lastUpdate.textContent =
        "Update terakhir: " +
        sekarang.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "medium"
        });

}

