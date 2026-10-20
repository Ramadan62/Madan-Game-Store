
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const $ = id => document.getElementById(id);

let currentUser = null;
let currentGroup = null;
let stopMessages = null;
let busy = false;

function status(message) {
  $("status").textContent = message;
}

function groupStatus(message) {
  $("groupStatus").textContent = message;
}

function setBusy(value) {
  busy = value;
  document.querySelectorAll("button").forEach(button => {
    button.disabled = value;
  });
}

function showError(error) {
  console.error(error);
  status("Gagal: " + (error.code || error.message));
  groupStatus("Periksa login Google, koneksi, dan Firestore Rules.");
}

function stopChatListener() {
  if (stopMessages) stopMessages();
  stopMessages = null;
}

// Tombol login dan logout
$("login").addEventListener("click", async () => {
  if (busy) return;

  setBusy(true);
  try {
    if (currentUser) {
      await signOut(auth);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});

// Tombol + untuk membuka formulir pembuatan grup
$("plusButton").addEventListener("click", () => {
  $("createPanel").classList.remove("hidden");
  $("groupName").focus();

  if (!currentUser) {
    groupStatus("Login Google terlebih dahulu sebelum membuat grup.");
    status("Tekan Login dengan Google, lalu buat grup.");
  } else {
    status("Masukkan nama grup baru.");
  }
});

$("cancelCreate").addEventListener("click", () => {
  $("createPanel").classList.add("hidden");
});

// Login tidak lagi menyembunyikan tombol + atau formulir gabung
onAuthStateChanged(auth, user => {
  currentUser = user;

  $("account").textContent = user
    ? "Login sebagai " + (user.displayName || user.email || "Pengguna")
    : "Belum login.";

  $("login").textContent = user ? "Keluar" : "Login dengan Google";

  if (user) {
    status("Login berhasil. Kamu bisa membuat atau bergabung dengan grup.");
  } else {
    stopChatListener();
    currentGroup = null;
    $("chatPanel").classList.add("hidden");
    status("Kamu bisa melihat pilihan grup. Login diperlukan untuk mengobrol.");
  }
});

async function openGroup(groupId) {
  if (!currentUser) {
    status("Login Google terlebih dahulu.");
    return false;
  }

  stopChatListener();

  try {
    const groupRef = doc(db, "groups", groupId);
    const memberRef = doc(
      db, "groups", groupId, "members", currentUser.uid
    );

    // Buat keanggotaan sendiri menggunakan kode undangan.
    const memberSnapshot = await getDoc(memberRef);

    if (!memberSnapshot.exists()) {
      await setDoc(memberRef, {
        uid: currentUser.uid,
        joinedAt: serverTimestamp()
      });
    }

    const groupSnapshot = await getDoc(groupRef);

    if (!groupSnapshot.exists()) {
      throw new Error("Grup tidak ditemukan. Periksa kode undangan.");
    }

    const group = groupSnapshot.data();

    currentGroup = {
      id: groupId,
      name: group.name || "Grup Madan"
    };

    $("chatTitle").textContent = currentGroup.name;
    $("currentCode").textContent = groupId;
    $("messages").replaceChildren();
    $("chatPanel").classList.remove("hidden");
    $("createPanel").classList.add("hidden");

    groupStatus("Berhasil membuka grup.");
    status("Terhubung ke " + currentGroup.name + ".");

    const messagesQuery = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt", "desc"),
      limit(100)
    );

    stopMessages = onSnapshot(messagesQuery, snapshot => {
      const box = $("messages");
      box.replaceChildren();

      snapshot.docs.slice().reverse().forEach(messageDoc => {
        const message = messageDoc.data();
        const item = document.createElement("div");
        item.className = "message";

        const name = document.createElement("strong");
        name.textContent = message.name || "Pengguna";

        const content = document.createElement("p");
        content.textContent = message.text || "";

        const time = document.createElement("small");
        time.textContent = message.createdAt?.toDate
          ? message.createdAt.toDate().toLocaleString("id-ID")
          : "Baru saja";

        item.append(name, content, time);
        box.append(item);
      });

      box.scrollTop = box.scrollHeight;
    }, showError);

    return true;
  } catch (error) {
    currentGroup = null;
    $("chatPanel").classList.add("hidden");
    showError(error);
    return false;
  }
}

// Membuat grup
$("createGroup").addEventListener("click", async () => {
  if (busy) return;

  if (!currentUser) {
    groupStatus("Login Google terlebih dahulu, kemudian tekan Buat Grup lagi.");
    $("login").click();
    return;
  }

  const name = $("groupName").value.trim();

  if (!name || name.length > 40) {
    groupStatus("Isi nama grup, maksimal 40 karakter.");
    return;
  }

  setBusy(true);

  try {
    const groupRef = doc(collection(db, "groups"));

    await setDoc(groupRef, {
      name,
      ownerUid: currentUser.uid,
      createdAt: serverTimestamp()
    });

    await setDoc(
      doc(db, "groups", groupRef.id, "members", currentUser.uid),
      {
        uid: currentUser.uid,
        joinedAt: serverTimestamp()
      }
    );

    const opened = await openGroup(groupRef.id);

    if (opened) {
      $("groupName").value = "";
      groupStatus("Grup berhasil dibuat! Bagikan kode undangan kepada teman tepercaya.");
    }
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});

// Bergabung dengan kode grup
$("joinGroup").addEventListener("click", async () => {
  if (busy) return;

  if (!currentUser) {
    groupStatus("Login Google terlebih dahulu untuk bergabung.");
    $("login").click();
    return;
  }

  const code = $("groupCode").value.trim();

  if (!code) {
    groupStatus("Masukkan kode grup terlebih dahulu.");
    return;
  }

  setBusy(true);
  try {
    const opened = await openGroup(code);
    if (opened) $("groupCode").value = "";
  } finally {
    setBusy(false);
  }
});

// Mengirim pesan
$("messageForm").addEventListener("submit", async event => {
  event.preventDefault();

  if (!currentUser || !currentGroup || busy) return;

  const text = $("messageText").value.trim();

  if (!text || text.length > 1000) return;

  setBusy(true);
  try {
    await addDoc(
      collection(db, "groups", currentGroup.id, "messages"),
      {
        text,
        uid: currentUser.uid,
        name: (currentUser.displayName || "Pengguna").slice(0, 100),
        createdAt: serverTimestamp()
      }
    );

    $("messageText").value = "";
    status("Pesan berhasil dikirim.");
  } catch (error) {
    showError(error);
  } finally {
    setBusy(false);
  }
});

// Menyalin kode undangan
$("copyCode").addEventListener("click", async () => {
  if (!currentGroup) return;

  try {
    await navigator.clipboard.writeText(currentGroup.id);
    status("Kode grup berhasil disalin.");
  } catch {
    status("Salin kode secara manual: " + currentGroup.id);
  }
});

// Menutup chat
$("leaveGroup").addEventListener("click", () => {
  stopChatListener();
  currentGroup = null;
  $("chatPanel").classList.add("hidden");
  status("Chat ditutup. Kamu masih login.");
});
