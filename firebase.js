
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  signOut
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
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const profileBox = document.getElementById("profileBox");
const profilePhoto = document.getElementById("profilePhoto");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

loginBtn.addEventListener("click", async () => {
  try {
    if (auth.currentUser) {
      await signOut(auth);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    alert("Login gagal: " + error.code + " — " + error.message);
  }
});

onAuthStateChanged(auth, user => {
  if (user) {
    profileBox.style.display = "flex";
    profileName.textContent = user.displayName || "Pengguna";
    profileEmail.textContent = user.email || "Email tidak tersedia";

    if (user.photoURL) {
      profilePhoto.src = user.photoURL;
      profilePhoto.style.display = "block";
    } else {
      profilePhoto.style.display = "none";
    }

    loginBtn.textContent = "Keluar";
  } else {
    profileBox.style.display = "none";
    loginBtn.textContent = "Login Google";
  }
});
