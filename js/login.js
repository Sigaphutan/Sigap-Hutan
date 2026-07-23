// ================================
// LOGIN ADMIN SIGAP HUTAN
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


// ================================
// FIREBASE CONFIG
// ================================

const firebaseConfig = {
    apiKey: "AIzaSyB4cXGigpL_hL9Wi-_HVZunkctdIGw_g",
    authDomain: "sigap-hutan-715d1.firebaseapp.com",
    projectId: "sigap-hutan-715d1",
    storageBucket: "sigap-hutan-715d1.firebasestorage.app",
    messagingSenderId: "902737210675",
    appId: "1:902737210675:web:85383221791e29f7e1e246"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// ================================
// LOGIN ID ADMIN
// ================================

document.getElementById("loginForm").addEventListener("submit", (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const remember = document.getElementById("remember").checked;

    if (
        username === "sigaphutankph8" &&
        password === "uptdkph8"
    ) {

        // Login lokal
        sessionStorage.setItem("adminLogin", "true");
        sessionStorage.setItem("adminName", "Administrator");

        // Remember Me
        if (remember) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        }

        window.location.href = "admin.html";

    } else {

        alert("❌ ID Admin atau Password salah!");

    }

});


// ================================
// LOGIN GOOGLE
// ================================

document.getElementById("googleLogin").addEventListener("click", async () => {

    try {

        const result = await signInWithPopup(auth, provider);

        // Hanya email ini yang boleh login
        if (result.user.email !== "sigaphutan@gmail.com") {

            await signOut(auth);

            alert("❌ Akun Google ini tidak memiliki akses.");

            return;

        }

        sessionStorage.setItem("adminLogin", "true");
        sessionStorage.setItem("adminName", result.user.displayName);

        window.location.href = "admin.html";

    } catch (error) {

        console.error(error);

        alert("Gagal login dengan Google.\n\n" + error.message);

    }

});


// ================================
// LOAD REMEMBER ME
// ================================

window.addEventListener("load", () => {

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (username && password) {

        document.getElementById("username").value = username;
        document.getElementById("password").value = password;
        document.getElementById("remember").checked = true;

    }

});
