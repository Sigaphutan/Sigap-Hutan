// ===============================
// LOGIN ADMIN SIGAP HUTAN
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyB4cX8QGigpL_hL9Wi-_HVZunkctdIGw_g",
    authDomain: "sigap-hutan-715d1.firebaseapp.com",
    projectId: "sigap-hutan-715d1",
    storageBucket: "sigap-hutan-715d1.firebasestorage.app",
    messagingSenderId: "902737210675",
    appId: "1:902737210675:web:85383221791e29f7e1e246"
};

// ===============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// ===============================
// LOGIN ID ADMIN
// ===============================

document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Login menggunakan ID Admin
    if (username === "sigaphutankph8" && password === "uptdkph8") {

        // Login ke Firebase menggunakan akun admin
        try {

            await signInWithEmailAndPassword(
                auth,
                "sigaphutan@gmail.com",
                "uptdkph8"
            );

            window.location.href = "admin.html";

        } catch (error) {

            alert("Gagal login Firebase.\n" + error.message);

        }

        return;
    }

    alert("ID Admin atau Password salah!");

});


// ===============================
// LOGIN GOOGLE
// ===============================

document.getElementById("googleLogin").addEventListener("click", async () => {

    try {

        const result = await signInWithPopup(auth, provider);

        if (result.user.email !== "sigaphutan@gmail.com") {

            await auth.signOut();

            alert("Akun Google ini tidak memiliki akses.");

            return;

        }

        window.location.href = "admin.html";

    } catch (error) {

        alert(error.message);

    }

});
