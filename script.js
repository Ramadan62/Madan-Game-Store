const ADMIN_NUMBER = "6285120170736";

const categories = [
  "Semua", "Genshin Impact", "Zenless Zone Zero", "Honkai: Star Rail",
  "Honkai Impact 3rd", "Mobile Legends", "Free Fire", "PUBG Mobile", "Game Lainnya"
];

const sampleProducts = [
  {game:"Genshin Impact",title:"Contoh Akun Genshin",price:250000,description:"Contoh katalog. Ganti dengan detail akun asli."},
  {game:"Zenless Zone Zero",title:"Contoh Akun ZZZ",price:180000,description:"Contoh katalog untuk menguji tampilan."},
  {game:"Honkai: Star Rail",title:"Contoh Akun HSR",price:200000,description:"Ini produk contoh, bukan penawaran sungguhan."},
  {game:"Honkai Impact 3rd",title:"Contoh Akun HI3",price:150000,description:"Tambahkan detail akun yang benar nantinya."},
  {game:"Mobile Legends",title:"Contoh Akun MLBB",price:100000,description:"Contoh tampilan kartu produk."},
  {game:"Free Fire",title:"Contoh Akun Free Fire",price:120000,description:"Harga dan data hanya untuk demo."},
  {game:"PUBG Mobile",title:"Contoh Akun PUBG",price:175000,description:"Ganti dengan informasi penawaran sebenarnya."},
  {game:"Game Lainnya",title:"Game Favorit Lainnya",price:50000,description:"Kategori untuk game tambahan."}
];

let products = [...sampleProducts];
let activeCategory = "Semua";
let uploadedPhoto = "";

const productArea = document.getElementById("products");
const filterArea = document.getElementById("filters");
const searchInput = document.getElementById("search");

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

function renderFilters() {
  filterArea.innerHTML = categories.map(category => `
    <button class="chip ${category === activeCategory ? "active" : ""}" data-category="${escapeHTML(category)}">
      ${escapeHTML(category)}
    </button>`).join("");
}

function getVisibleProducts() {
  const query = searchInput.value.toLowerCase().trim();
  return products.filter(product => {
    const matchesCategory = activeCategory === "Semua" || product.game === activeCategory;
    const matchesSearch = (product.game + " " + product.title + " " + product.description).toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const visible = getVisibleProducts();
  document.getElementById("count").textContent = visible.length + " produk";
  if (!visible.length) {
    productArea.innerHTML = '<div class="empty" style="grid-column:1/-1">Produk tidak ditemukan.</div>';
    return;
  }

  productArea.innerHTML = visible.map((product, index) => `
    <article class="card">
      <div class="cover">${product.photo ? `<img src="${product.photo}" alt="Foto ${escapeHTML(product.title)}">` : "🎮"}</div>
      <div class="card-body">
        <span class="tag">${escapeHTML(product.game)}</span>
        <h3 style="margin-top:12px">${escapeHTML(product.title)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="price">${rupiah(product.price)}</div>
        <button class="btn" data-contact="${index}">Tanya Penjual</button>
      </div>
    </article>`).join("");
}

filterArea.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);

productArea.addEventListener("click", event => {
  const button = event.target.closest("[data-contact]");
  if (!button) return;
  const product = getVisibleProducts()[Number(button.dataset.contact)];
  if (!product) return;
  const message = `Halo Admin Madan, saya ingin bertanya tentang: ${product.title} (${product.game}), harga ${rupiah(product.price)}. Apakah penawaran ini tersedia?`;
  window.open(`https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

const adminMessage = encodeURIComponent("Halo Madan, saya ingin bertanya tentang Madan Game Store.");
document.getElementById("contactBtn").href = `https://wa.me/${ADMIN_NUMBER}?text=${adminMessage}`;
document.getElementById("waFloat").href = `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent("Halo Madan!")}`;

document.getElementById("loginBtn").addEventListener("click", () => {
  alert("Login Google belum aktif. Firebase akan kita hubungkan pada tahap berikutnya.");
});

document.getElementById("photo").addEventListener("change", event => {
  const file = event.target.files[0];
  uploadedPhoto = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Pilih file gambar."); event.target.value = ""; return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert("Untuk demo ini, pilih foto maksimal 2 MB."); event.target.value = ""; return;
  }
  const reader = new FileReader();
  reader.onload = () => { uploadedPhoto = reader.result; };
  reader.readAsDataURL(file);
});

document.getElementById("postForm").addEventListener("submit", event => {
  event.preventDefault();
  const game = document.getElementById("game").value;
  const title = document.getElementById("title").value.trim();
  const price = Number(document.getElementById("price").value);
  const description = document.getElementById("description").value.trim();

  if (!game || !title || !description || price < 1000) {
    alert("Periksa kembali semua kolom."); return;
  }

  products.unshift({game,title,price,description,photo:uploadedPhoto});
  activeCategory = "Semua";
  searchInput.value = "";
  renderFilters();
  renderProducts();
  document.getElementById("postStatus").textContent = "Pratinjau berhasil dibuat di halaman ini. Belum tersimpan di server.";
  event.target.reset();
  uploadedPhoto = "";
  document.getElementById("katalog").scrollIntoView({behavior:"smooth"});
});

document.getElementById("year").textContent = new Date().getFullYear();
renderFilters();
renderProducts();
