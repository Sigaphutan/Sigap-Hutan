// ===============================================
// SIGAP HUTAN - ADMIN.JS
// Firebase v10
// ===============================================

// ======================
// FIREBASE IMPORT
// ======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ===============================================
// FIREBASE CONFIG
// GANTI DENGAN CONFIG FIREBASE MILIK ANDA
// ===============================================

const firebaseConfig = {

    apiKey: "ISI_API_KEY",

    authDomain: "ISI_AUTH_DOMAIN",

    projectId: "ISI_PROJECT_ID",

    storageBucket: "ISI_STORAGE_BUCKET",

    messagingSenderId: "ISI_SENDER_ID",

    appId: "ISI_APP_ID"

};


// ===============================================
// INISIALISASI
// ===============================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();


// ===============================================
// ELEMENT HTML
// ===============================================

const tbody = document.getElementById("tbody");

const total = document.getElementById("total");

const menunggu = document.getElementById("menunggu");

const diproses = document.getElementById("diproses");

const selesai = document.getElementById("selesai");

const ditolak = document.getElementById("ditolak");

const search = document.getElementById("search");

const filterStatus = document.getElementById("filterStatus");

const lastUpdate = document.getElementById("lastUpdate");

const btnRefresh = document.getElementById("btnRefresh");


// ===============================================
// DATA
// ===============================================

let semuaLaporan = [];


// ===============================================
// LOGIN ADMIN
// ===============================================

window.loginAdmin = async () => {

    try {

        await signInWithPopup(auth, provider);

    } catch (err) {

        console.error(err);

        alert("Login gagal.");

    }

};


// ===============================================
// LOGOUT ADMIN
// ===============================================

window.logoutAdmin = async () => {

    if (!confirm("Logout sekarang?")) return;

    await signOut(auth);

};


// ===============================================
// AUTH STATE
// ===============================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        document.getElementById("loginBox").style.display = "block";

        document.getElementById("adminPanel").style.display = "none";

        return;

    }

    document.getElementById("loginBox").style.display = "none";

    document.getElementById("adminPanel").style.display = "block";

    loadData();

});


// ===============================================
// LOAD DATA FIRESTORE
// ===============================================

function loadData() {

    const q = query(
        collection(db, "laporan"),
        orderBy("timestamp", "desc")
    );

    onSnapshot(q, (snapshot) => {

        semuaLaporan = [];

        snapshot.forEach((docSnap) => {

            semuaLaporan.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        renderTable(semuaLaporan);

    });

}
// ===============================================
// RENDER TABEL
// ===============================================

function renderTable(dataLaporan) {

    let html = "";

    let totalData = 0;
    let jmlMenunggu = 0;
    let jmlDiproses = 0;
    let jmlSelesai = 0;
    let jmlDitolak = 0;

    dataLaporan.forEach((data, index) => {

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

            case "Ditolak":
                jmlDitolak++;
                break;
        }

        let badge = "secondary";

        if (data.status === "Menunggu") badge = "warning";
        if (data.status === "Diproses") badge = "primary";
        if (data.status === "Selesai") badge = "success";
        if (data.status === "Ditolak") badge = "danger";

        html += `

<tr>

<td>${index + 1}</td>

<td>${data.kodeLaporan ?? "-"}</td>

<td>${data.nama ?? "-"}</td>

<td>
${data.kabupaten ?? "-"}<br>
<small>${data.kecamatan ?? "-"}</small>
</td>

<td>${data.jenis ?? "-"}</td>

<td>

${data.foto ?

`<img
src="${data.foto}"
style="
width:90px;
height:90px;
object-fit:cover;
cursor:pointer;
border-radius:10px;
"
onclick="lihatFoto('${data.foto}')">`

:"-"}

</td>

<td>${data.tanggal ?? "-"}</td>

<td>

<span class="badge bg-${badge} fs-6 px-3 py-2">

${data.status ?? "-"}

</span>

<br><br>

<select
class="form-select form-select-sm"
onchange="ubahStatus('${data.id}',this.value)">

<option value="Menunggu"
${data.status=="Menunggu"?"selected":""}>
Menunggu
</option>

<option value="Diproses"
${data.status=="Diproses"?"selected":""}>
Diproses
</option>

<option value="Selesai"
${data.status=="Selesai"?"selected":""}>
Selesai
</option>

<option value="Ditolak"
${data.status=="Ditolak"?"selected":""}>
Ditolak
</option>

</select>

</td>

<td>

${data.mapsUrl ?

`<a
href="${data.mapsUrl}"
target="_blank"
class="btn btn-success btn-sm">

📍 Google Maps

</a>`

:"-"}

</td>

<td>

<div class="d-grid gap-2">

<button
class="btn btn-primary btn-sm"
onclick="lihatDetail('${data.id}')">

👁 Detail

</button>

<button
class="btn btn-outline-danger btn-sm"
onclick="hapusLaporan('${data.id}')">

🗑 Hapus

</button>

</div>

</td>

</tr>

`;

    });

    if (totalData === 0) {

        html = `

<tr>

<td colspan="10" class="text-center">

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

    ditolak.textContent = jmlDitolak;

    updateWaktu();

}


// ===============================================
// PREVIEW FOTO
// ===============================================

window.lihatFoto = (url) => {

    document.getElementById("previewFoto").src = url;

    new bootstrap.Modal(
        document.getElementById("fotoModal")
    ).show();

};


// ===============================================
// DETAIL LAPORAN
// ===============================================

window.lihatDetail = (id) => {

    const data = semuaLaporan.find(x => x.id === id);

    if (!data) return;

    document.getElementById("dKode").textContent =
        data.kodeLaporan ?? "-";

    document.getElementById("dNama").textContent =
        data.nama ?? "-";

    document.getElementById("dKabupaten").textContent =
        data.kabupaten ?? "-";

    document.getElementById("dKecamatan").textContent =
        data.kecamatan ?? "-";

    document.getElementById("dJenis").textContent =
        data.jenis ?? "-";

    document.getElementById("dStatus").textContent =
        data.status ?? "-";

    document.getElementById("dTanggal").textContent =
        data.tanggal ?? "-";

    document.getElementById("dDeskripsi").textContent =
        data.deskripsi ?? "-";

    document.getElementById("detailFoto").src =
        data.foto || "";

    if (data.mapsUrl) {

        document.getElementById("detailMaps").href =
            data.mapsUrl;

        document.getElementById("detailMaps").style.display =
            "inline-block";

    } else {

        document.getElementById("detailMaps").style.display =
            "none";

    }

    new bootstrap.Modal(
        document.getElementById("detailModal")
    ).show();

};
// ===============================================
// UPDATE STATUS LAPORAN
// ===============================================

window.ubahStatus = async (id, statusBaru) => {

    try {

        await updateDoc(
            doc(db, "laporan", id),
            {
                status: statusBaru
            }
        );

        console.log("Status berhasil diubah");

    } catch (err) {

        console.error(err);

        alert("Gagal mengubah status.");

    }

};


// ===============================================
// HAPUS LAPORAN
// ===============================================

window.hapusLaporan = async (id) => {

    const konfirmasi = confirm(
        "Apakah Anda yakin ingin menghapus laporan ini?"
    );

    if (!konfirmasi) return;

    try {

        await deleteDoc(
            doc(db, "laporan", id)
        );

        alert("Laporan berhasil dihapus.");

    } catch (err) {

        console.error(err);

        alert("Gagal menghapus laporan.");

    }

};


// ===============================================
// SEARCH + FILTER
// ===============================================

if (search) {

    search.addEventListener("keyup", filterData);

}

if (filterStatus) {

    filterStatus.addEventListener("change", filterData);

}


function filterData() {

    const keyword =
        search.value.toLowerCase().trim();

    const status =
        filterStatus.value;

    const hasil =
        semuaLaporan.filter((item) => {

            const text = (

                (item.kodeLaporan || "") +

                (item.nama || "") +

                (item.kabupaten || "") +

                (item.kecamatan || "") +

                (item.jenis || "") +

                (item.deskripsi || "")

            ).toLowerCase();

            const cocokStatus =

                status === "" ||

                item.status === status;

            return text.includes(keyword) && cocokStatus;

        });

    renderTable(hasil);

}


// ===============================================
// REFRESH
// ===============================================

if (btnRefresh) {

    btnRefresh.addEventListener("click", () => {

        renderTable(semuaLaporan);

    });

}


// ===============================================
// UPDATE WAKTU
// ===============================================

function updateWaktu() {

    if (!lastUpdate) return;

    lastUpdate.textContent =
        "Update terakhir : " +
        new Date().toLocaleString("id-ID");

}


// ===============================================
// AUTO UPDATE JAM
// ===============================================

setInterval(() => {

    updateWaktu();

}, 1000);


// ===============================================
// SORT DATA
// ===============================================

window.sortData = (field) => {

    semuaLaporan.sort((a, b) => {

        if (a[field] > b[field]) return 1;

        if (a[field] < b[field]) return -1;

        return 0;

    });

    renderTable(semuaLaporan);

};


// ===============================================
// RESET FILTER
// ===============================================

window.resetFilter = () => {

    if (search)
        search.value = "";

    if (filterStatus)
        filterStatus.value = "";

    renderTable(semuaLaporan);

};


// ===============================================
// TOTAL DATA PER STATUS
// ===============================================

function hitungStatistik() {

    return {

        total: semuaLaporan.length,

        menunggu: semuaLaporan.filter(
            x => x.status === "Menunggu"
        ).length,

        diproses: semuaLaporan.filter(
            x => x.status === "Diproses"
        ).length,

        selesai: semuaLaporan.filter(
            x => x.status === "Selesai"
        ).length,

        ditolak: semuaLaporan.filter(
            x => x.status === "Ditolak"
        ).length

    };

}
// ===============================================
// PRINT
// ===============================================

const btnPrint = document.getElementById("btnPrint");

if (btnPrint) {

    btnPrint.addEventListener("click", () => {

        window.print();

    });

}


// ===============================================
// EXPORT EXCEL
// ===============================================

const btnExcel = document.getElementById("btnExcel");

if (btnExcel) {

    btnExcel.addEventListener("click", () => {

        const data = semuaLaporan.map(item => ({

            "Kode": item.kodeLaporan || "-",

            "Nama": item.nama || "-",

            "Kabupaten": item.kabupaten || "-",

            "Kecamatan": item.kecamatan || "-",

            "Jenis": item.jenis || "-",

            "Status": item.status || "-",

            "Tanggal": item.tanggal || "-"

        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Laporan"
        );

        XLSX.writeFile(
            workbook,
            "Laporan_SIGAP_Hutan.xlsx"
        );

    });

}


// ===============================================
// EXPORT PDF
// ===============================================

const btnPdf = document.getElementById("btnPdf");

if (btnPdf) {

    btnPdf.addEventListener("click", () => {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({

            orientation: "landscape"

        });

        pdf.setFontSize(18);

        pdf.text(
            "Laporan SIGAP Hutan",
            14,
            15
        );

        pdf.setFontSize(10);

        pdf.text(
            "Tanggal Cetak : " +
            new Date().toLocaleString("id-ID"),
            14,
            22
        );

        const rows = [];

        semuaLaporan.forEach(item => {

            rows.push([

                item.kodeLaporan || "-",

                item.nama || "-",

                item.kabupaten || "-",

                item.kecamatan || "-",

                item.jenis || "-",

                item.status || "-",

                item.tanggal || "-"

            ]);

        });

        pdf.autoTable({

            startY: 30,

            head: [[

                "Kode",

                "Nama",

                "Kabupaten",

                "Kecamatan",

                "Jenis",

                "Status",

                "Tanggal"

            ]],

            body: rows,

            styles: {

                fontSize: 9

            },

            headStyles: {

                fillColor: [34, 139, 34]

            }

        });

        pdf.save("Laporan_SIGAP_Hutan.pdf");

    });

}


// ===============================================
// LOADING
// ===============================================

window.showLoading = () => {

    const el = document.getElementById("loading");

    if (el)

        el.style.display = "flex";

};

window.hideLoading = () => {

    const el = document.getElementById("loading");

    if (el)

        el.style.display = "none";

};


// ===============================================
// FORMAT TANGGAL
// ===============================================

window.formatTanggal = (tanggal) => {

    if (!tanggal) return "-";

    try {

        return new Date(tanggal)
            .toLocaleDateString("id-ID");

    } catch {

        return tanggal;

    }

};


// ===============================================
// INIT
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("===================================");

    console.log("SIGAP HUTAN ADMIN PANEL");

    console.log("Admin.js berhasil dimuat");

    console.log("===================================");

});
