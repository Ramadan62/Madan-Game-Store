
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKNEYWlP0jasT1E1TLapm-BObJwPARMpI",
  authDomain: "madan-game-store.firebaseapp.com",
  projectId: "madan-game-store",
  storageBucket: "madan-game-store.firebasestorage.app",
  messagingSenderId: "340051395448",
  appId: "1:340051395448:web:dc8ccd28da66c7de607e8d",
  measurementId: "G-G9CZBZ8E97"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Fungsi login Google
async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    alert("Berhasil login sebagai " + result.user.displayName);
  } catch (error) {
    console.error("Login gagal:", error);
    alert("Login gagal: " + error.message);
  }
}

// Sediakan fungsi untuk dipanggil dari index.html
window.loginGoogle = loginGoogle;
