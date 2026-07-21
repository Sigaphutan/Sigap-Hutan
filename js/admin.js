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
// LOGIN ADMIN
// =======================

const provider = new GoogleAuthProvider();

window.loginAdmin = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        alert(error.message);
    }
};

window.logoutAdmin = async () => {
    await signOut(auth);
};

// =======================
// ELEMENT HTML
// =======================

const tbody = document.getElementById("dataLaporan");

const total = document.getElementById("total");
const menunggu = document.getElementById("menunggu");
const diproses = document.getElementById("diproses");
const selesai = document.getElementById("selesai");

// =======================
// CEK LOGIN
// =======================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Login sebagai:", user.displayName);

        loadLaporan();

    } else {

        tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;padding:20px;">
                Silakan login sebagai Admin.
            </td>
        </tr>
        `;

    }

});

// =======================
// LOAD LAPORAN
// =======================

async function loadLaporan() {

    tbody.innerHTML = `
    <tr>
        <td colspan="7" style="text-align:center">
            Memuat data...
        </td>
    </tr>
    `;

    const snapshot = await getDocs(collection(db, "laporan"));

    let html = "";

    let totalData = 0;
    let jmlMenunggu = 0;
    let jmlDiproses = 0;
    let jmlSelesai = 0;

    snapshot.forEach((doc) => {

        const data = doc.data();

        totalData++;

        if (data.status === "Menunggu") jmlMenunggu++;
        if (data.status === "Diproses") jmlDiproses++;
        if (data.status === "Selesai") jmlSelesai++;

       html += `
<tr>

    <td>${data.kodeLaporan ?? "-"}</td>

    <td>${data.nama ?? "-"}</td>

    <td>${data.lokasi ?? "-"}</td>

    <td>${data.jenis ?? "-"}</td>

    <td>

        <select onchange="ubahStatus('${doc.id}', this.value)">

            <option value="Menunggu" ${data.status=="Menunggu"?"selected":""}>Menunggu</option>

            <option value="Diproses" ${data.status=="Diproses"?"selected":""}>Diproses</option>

            <option value="Selesai" ${data.status=="Selesai"?"selected":""}>Selesai</option>

        </select>

    </td>

    <td>

        ${
            data.mapsUrl

            ?

            `<a href="${data.mapsUrl}" target="_blank">📍 Maps</a>`

            :

            "-"

        }

    </td>

    <td>

        <button onclick="hapusLaporan('${doc.id}')">

            🗑️

        </button>

    </td>

</tr>
`;

    });

    if (totalData === 0) {

        html = `
        <tr>
            <td colspan="7" style="text-align:center;">
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

}
window.ubahStatus = async (id, statusBaru) => {

    try{

        await updateDoc(

            doc(db,"laporan",id),

            {
                status:statusBaru
            }

        );

        loadLaporan();

    }catch(error){

        console.log(error);

        alert("Gagal mengubah status");

    }

};
window.hapusLaporan = async(id)=>{

    const yakin = confirm(
        "Yakin ingin menghapus laporan ini?"
    );

    if(!yakin) return;

    try{

        await deleteDoc(
            doc(db,"laporan",id)
        );

        loadLaporan();

    }catch(error){

        console.log(error);

        alert("Gagal menghapus laporan");

    }

};
