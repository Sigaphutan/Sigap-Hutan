import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const form = document.getElementById("formPengaduan");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    alert("Berhasil terhubung dengan Firebase!");

});
