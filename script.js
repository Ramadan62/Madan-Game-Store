const ADMIN_NUMBER = "6285120170736";

const categories = [
  "Semua", "Genshin Impact", "Zenless Zone Zero", "Honkai: Star Rail",
  "Honkai Impact 3rd", "Mobile Legends", "Free Fire", "PUBG Mobile", "Game Lainnya"
];


const sampleProducts = [
  {
    game: "Genshin Impact",
    title: "Akun Genshin Impact",
    price: 500000,
    description: "Informasi akun Genshin Impact.",
    photo: "genshin.png"
  },
  {
    game: "Honkai: Star Rail",
    title: "Akun Honkai: Star Rail",
    price: 500000,
    description: "Informasi akun Honkai: Star Rail.",
    photo: "hsr.png"
  },
  {
    game: "Zenless Zone Zero",
    title: "Akun Zenless Zone Zero",
    price: 500000,
    description: "Informasi akun Zenless Zone Zero.",
    photo: "zzz.png"
  },
  {
    game: "Honkai Impact 3rd",
    title: "Akun Honkai Impact 3rd",
    price: 500000,
    description: "Informasi akun Honkai Impact 3rd.",
    photo: "hi3.png"
  },
  {
    game: "Mobile Legends: Bang Bang",
    title: "Akun Mobile Legends",
    price: 300000,
    description: "Informasi akun Mobile Legends.",
    photo: "ml.png"
  },
  {
    game: "Free Fire",
    title: "Akun Free Fire",
    price: 300000,
    description: "Informasi akun Free Fire.",
    photo: "ff.png"
  },
  {
    game: "PUBG Mobile",
    title: "Akun PUBG Mobile",
    price: 300000,
    description: "Informasi akun PUBG Mobile.",
    photo: "pubg.png"
  },
  {
    game: "Game Lainnya",
    title: "Akun Game Favorit",
    price: 200000,
    description: "Informasi akun game favorit lainnya.",
    photo: "favorite.png"
  }
];

let products = [...sampleProducts];

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

function renderProducts() {
  if (!productContainer) return;

  const searchText = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const selectedGame = filterInput
    ? filterInput.value
    : "all";

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchText) ||
      product.game.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    const matchesGame =
      selectedGame === "all" ||
      product.game === selectedGame;

    return matchesSearch && matchesGame;
  });

  productContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    productContainer.innerHTML =
      '<p class="empty-message">Game atau akun tidak ditemukan.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const cover = document.createElement("div");
    cover.className = "cover";

    const img = document.createElement("img");
    img.src = product.photo || "favorite.png";
    img.alt = product.game;
    img.loading = "lazy";

    img.onerror = function () {
      this.style.display = "none";
      cover.textContent = "🎮";
    };

    cover.appendChild(img);

    const details = document.createElement("div");
    details.className = "product-info";

    const game = document.createElement("p");
    game.className = "game-name";
    game.textContent = product.game;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(product.price);

    details.append(game, title, description, price);
    card.append(cover, details);
    productContainer.appendChild(card);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

if (filterInput) {
  filterInput.addEventListener("change", renderProducts);
}

renderProducts();
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
