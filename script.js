const ADMIN_NUMBER = "6285120170736";

const categories = [
  "Semua", "Genshin Impact", "Zenless Zone Zero", "Honkai: Star Rail",
  "Honkai Impact 3rd", "Mobile Legends", "Free Fire", "PUBG Mobile", "Game Lainnya"
];

const sampleProducts = [
  {
    game: "Genshin Impact",
    title: "Koleksi Akun Genshin",
    price: 500000,
    description: "Informasi karakter, senjata, dan progres akun.",
    photo: "genshin.png"
  },
  {
    game: "Honkai: Star Rail",
    title: "Koleksi Akun HSR",
    price: 500000,
    description: "Informasi karakter, Light Cone, dan progres akun.",
    photo: "hsr.png"
  },
  {
    game: "Zenless Zone Zero",
    title: "Koleksi Akun ZZZ",
    price: 500000,
    description: "Informasi Agent, W-Engine, dan progres akun.",
    photo: "zzz.png"
  },
  {
    game: "Honkai Impact 3rd",
    title: "Koleksi Akun HI3",
    price: 500000,
    description: "Informasi Valkyrie dan perlengkapan akun.",
    photo: "hi3.png"
  },
  {
    game: "Mobile Legends: Bang Bang",
    title: "Koleksi Akun Mobile Legends",
    price: 300000,
    description: "Informasi hero, skin, dan progres akun.",
    photo: "ml.png"
  },
  {
    game: "Free Fire",
    title: "Koleksi Akun Free Fire",
    price: 300000,
    description: "Informasi koleksi dan progres akun.",
    photo: "ff.png"
  },
  {
    game: "PUBG Mobile",
    title: "Koleksi Akun PUBG Mobile",
    price: 300000,
    description: "Informasi outfit, item, dan progres akun.",
    photo: "pubg.png"
  },
  {
    game: "Game Lainnya",
    title: "Koleksi Game Favorit",
    price: 200000,
    description: "Informasi akun untuk game lainnya.",
    photo: "favorite.png"
  }
];

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");
const resultCount = document.getElementById("resultCount");

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const cover = document.createElement("div");
  cover.className = "cover";

  // Placeholder tetap tampil kalau gambar belum tersedia.
  const fallback = document.createElement("div");
  fallback.className = "cover-fallback";
  fallback.textContent = "🎮";
  cover.appendChild(fallback);

  const image = document.createElement("img");
  image.src = product.photo;
  image.alt = product.game;
  image.loading = "eager";
  image.decoding = "async";

  image.addEventListener("load", () => {
    fallback.remove();
  }, { once: true });

  image.addEventListener("error", () => {
    image.remove();
  }, { once: true });

  cover.appendChild(image);

  const info = document.createElement("div");
  info.className = "product-info";

  const game = document.createElement("p");
  game.className = "game-name";
  game.textContent = product.game;

  const title = document.createElement("h3");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = product.description;

  const bottom = document.createElement("div");
  bottom.className = "card-bottom";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(product.price);

  const label = document.createElement("span");
  label.className = "detail-label";
  label.textContent = "Info akun ↗";

  bottom.append(price, label);
  info.append(game, title, description, bottom);
  card.append(cover, info);

  return card;
}

function renderProducts() {
  if (!productsContainer) return;

  const query = searchInput.value.toLowerCase().trim();
  const selectedGame = filterInput.value;

  const filtered = sampleProducts.filter(product => {
    const searchableText = [
      product.game,
      product.title,
      product.description
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const matchesGame =
      selectedGame === "all" || product.game === selectedGame;

    return matchesSearch && matchesGame;
  });

  // Mengubah isi katalog hanya ketika pencarian atau filter berubah.
  productsContainer.replaceChildren();

  if (resultCount) {
    resultCount.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Game yang kamu cari belum ditemukan.";
    productsContainer.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach(product => {
    fragment.appendChild(createProductCard(product));
  });

  productsContainer.appendChild(fragment);
}

if (searchInput && filterInput && productsContainer) {
  searchInput.addEventListener("input", renderProducts);
  filterInput.addEventListener("change", renderProducts);
  renderProducts();
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
    }  
