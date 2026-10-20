
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
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

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    alert("Login gagal: " + error.code + " — " + error.message);
  }
});

getRedirectResult(auth).catch(error => {
  alert("Login gagal: " + error.code + " — " + error.message);
});

onAuthStateChanged(auth, user => {
  if (user) {
    loginBtn.textContent = "Login: " + (user.displayName || user.email);
  } else {
    loginBtn.textContent = "Login Google";
  }
});
