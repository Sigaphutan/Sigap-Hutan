import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

// Cek apakah admin sudah login
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Login berhasil");
        console.log(user.displayName);
    } else {
        console.log("Belum login");
    }
});

// Fungsi Login
window.loginAdmin = async function () {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        alert(error.message);
    }
};

// Fungsi Logout
window.logoutAdmin = async function () {
    await signOut(auth);
};
