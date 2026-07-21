<tr>
    <td colspan="9" class="text-center">
        Memuat data...
    </td>
</tr>

</tbody>

</table>

</div>

</section>

</main>

<!-- ========================= -->
<!-- MODAL FOTO -->
<!-- ========================= -->

<div class="modal fade"
     id="fotoModal"
     tabindex="-1">

    <div class="modal-dialog modal-lg modal-dialog-centered">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">
                    Foto Laporan
                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body text-center">

                <img
                    id="previewFoto"
                    class="img-fluid rounded shadow"
                    src=""
                    alt="Foto Laporan">

            </div>

        </div>

    </div>

</div>

<!-- ========================= -->
<!-- MODAL DETAIL -->
<!-- ========================= -->

<div class="modal fade"
     id="detailModal"
     tabindex="-1">

    <div class="modal-dialog modal-xl">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">
                    Detail Laporan
                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="row">

                    <div class="col-md-6">

                        <table class="table table-bordered">

                            <tr>
                                <th>Kode</th>
                                <td id="dKode"></td>
                            </tr>

                            <tr>
                                <th>Nama</th>
                                <td id="dNama"></td>
                            </tr>

                            <tr>
                                <th>Kabupaten</th>
                                <td id="dKabupaten"></td>
                            </tr>

                            <tr>
                                <th>Kecamatan</th>
                                <td id="dKecamatan"></td>
                            </tr>

                            <tr>
                                <th>Jenis</th>
                                <td id="dJenis"></td>
                            </tr>

                            <tr>
                                <th>Status</th>
                                <td id="dStatus"></td>
                            </tr>

                            <tr>
                                <th>Tanggal</th>
                                <td id="dTanggal"></td>
                            </tr>

                        </table>

                    </div>

                    <div class="col-md-6">

                        <img
                            id="detailFoto"
                            class="img-fluid rounded shadow mb-3">

                        <p>
                            <strong>Deskripsi</strong>
                        </p>

                        <p id="dDeskripsi"></p>

                        <a
                            id="detailMaps"
                            target="_blank"
                            class="btn btn-success">

                            📍 Lihat Google Maps

                        </a>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>

<footer class="text-center py-4">

    © 2026 SIGAP Hutan

</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>

<script type="module" src="../js/admin.js"></script>

</body>
</html>
function renderTable(dataLaporan){

    let html="";

    let totalData=0;
    let jmlMenunggu=0;
    let jmlDiproses=0;
    let jmlSelesai=0;
    let jmlDitolak=0;

    dataLaporan.forEach(data=>{

        totalData++;

        switch(data.status){

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

        let badge="secondary";

        if(data.status==="Menunggu") badge="warning";
        if(data.status==="Diproses") badge="primary";
        if(data.status==="Selesai") badge="success";
        if(data.status==="Ditolak") badge="danger";

        html+=`

<tr>

<td>${data.kodeLaporan??"-"}</td>

<td>${data.nama??"-"}</td>

<td>

${data.kabupaten??""}

<br>

<small>${data.kecamatan??""}</small>

</td>

<td>${data.jenis??"-"}</td>

<td>

${data.foto?

`<img
src="${data.foto}"
style="
width:70px;
height:70px;
object-fit:cover;
cursor:pointer;
border-radius:10px;
"
onclick="lihatFoto('${data.foto}')">`

:"-"}

</td>

<td>${data.tanggal??"-"}</td>

<td>

<span class="badge bg-${badge}">
${data.status??"-"}
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

${data.mapsUrl?

`<a
href="${data.mapsUrl}"
target="_blank"
class="btn btn-success btn-sm">

📍 Maps

</a>`

:"-"}

</td>

<td>

<div class="d-grid gap-2">

<button
class="btn btn-info btn-sm"
onclick='lihatDetail(${JSON.stringify(data)})'>

👁 Detail

</button>

<button
class="btn btn-danger btn-sm"
onclick="hapusLaporan('${data.id}')">

🗑 Hapus

</button>

</div>

</td>

</tr>

`;

    });

    if(totalData===0){

        html=`

<tr>

<td colspan="9"
class="text-center">

Belum ada laporan.

</td>

</tr>

`;

    }

    tbody.innerHTML=html;

    total.textContent=totalData;
    menunggu.textContent=jmlMenunggu;
    diproses.textContent=jmlDiproses;
    selesai.textContent=jmlSelesai;
    ditolak.textContent=jmlDitolak;

    updateWaktu();

}
// ===============================
// PREVIEW FOTO
// ===============================

window.lihatFoto = (url) => {

    document.getElementById("previewFoto").src = url;

    new bootstrap.Modal(
        document.getElementById("fotoModal")
    ).show();

};

// ===============================
// DETAIL LAPORAN
// ===============================

window.lihatDetail = (data) => {

    document.getElementById("dKode").textContent = data.kodeLaporan ?? "-";
    document.getElementById("dNama").textContent = data.nama ?? "-";
    document.getElementById("dKabupaten").textContent = data.kabupaten ?? "-";
    document.getElementById("dKecamatan").textContent = data.kecamatan ?? "-";
    document.getElementById("dJenis").textContent = data.jenis ?? "-";
    document.getElementById("dStatus").textContent = data.status ?? "-";
    document.getElementById("dTanggal").textContent = data.tanggal ?? "-";
    document.getElementById("dDeskripsi").textContent = data.deskripsi ?? "-";

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

// ===============================
// UPDATE STATUS
// ===============================

window.ubahStatus = async (id, statusBaru) => {

    try {

        await updateDoc(
            doc(db, "laporan", id),
            {
                status: statusBaru
            }
        );

    } catch (e) {

        alert("Gagal mengubah status");

        console.error(e);

    }

};

// ===============================
// HAPUS LAPORAN
// ===============================

window.hapusLaporan = async (id) => {

    if (!confirm("Hapus laporan ini?"))
        return;

    try {

        await deleteDoc(
            doc(db, "laporan", id)
        );

    } catch (e) {

        alert("Gagal menghapus");

        console.error(e);

    }

};

// ===============================
// PENCARIAN
// ===============================

search.addEventListener("keyup", filterData);

filterStatus.addEventListener("change", filterData);

function filterData() {

    const keyword =
        search.value.toLowerCase();

    const status =
        filterStatus.value;

    const hasil =
        semuaLaporan.filter(item => {

            const cocokText = (

                (item.kodeLaporan || "") +
                (item.nama || "") +
                (item.kabupaten || "") +
                (item.kecamatan || "") +
                (item.jenis || "")

            ).toLowerCase();

            const cocokStatus =
                status === "" ||
                item.status === status;

            return cocokText.includes(keyword)
                && cocokStatus;

        });

    renderTable(hasil);

}

// ===============================
// UPDATE WAKTU
// ===============================

function updateWaktu() {

    lastUpdate.textContent =
        "Update terakhir : " +
        new Date().toLocaleString("id-ID");

}
