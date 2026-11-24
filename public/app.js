
/* ==========================================
   SONDARIA — MAIN WEBSITE JAVASCRIPT
   ========================================== */

"use strict";

// BUSINESS SETTINGS
const ADMIN_WHATSAPP = "916395115988";

// DEMO PRODUCT CATALOGUE
// Real products will later load from Firebase.
const products = [
  {
    id: 1,
    name: "Pastel Balloon Set",
    category: "Decor",
    price: 299,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debuf?auto=format&fit=crop&w=700&q=85",
    description: "Beautiful pastel balloons for celebrations."
  },
  {
    id: 2,
    name: "Birthday Candle Set",
    category: "Candles",
    price: 149,
    image: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&w=700&q=85",
    description: "Colourful birthday candles."
  },
  {
    id: 3,
    name: "Premium Gift Hamper",
    category: "Gifts",
    price: 799,
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=700&q=85",
    description: "A beautiful gift for your loved ones."
  },
  {
    id: 4,
    name: "Party Confetti",
    category: "Party",
    price: 99,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=700&q=85",
    description: "Add sparkle to your special day."
  },
  {
    id: 5,
    name: "Fairy Light Decoration",
    category: "Decor",
    price: 349,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=700&q=85",
    description: "Warm lights for a magical atmosphere."
  },
  {
    id: 6,
    name: "Celebration Party Banner",
    category: "Party",
    price: 199,
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=85",
    description: "A colourful party decoration banner."
  },
  {
    id: 7,
    name: "Decorative Gift Box",
    category: "Gifts",
    price: 399,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=85",
    description: "A lovely gift box for special occasions."
  },
  {
    id: 8,
    name: "Golden Number Candles",
    category: "Candles",
    price: 129,
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=700&q=85",
    description: "Golden candles for birthday cakes."
  }
];

// CART DATA
let cart = {};

try {
  cart = JSON.parse(localStorage.getItem("sondaria_cart")) || {};
} catch (error) {
  cart = {};
}

let activeCategory = "All";

// ELEMENT SELECTOR
const $ = selector => document.querySelector(selector);

// FORMAT PRICE
function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

// SAFE TEXT
function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// TOAST MESSAGE
function showMessage(message) {
  const toast = $("#toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.sondariaToastTimer);

  window.sondariaToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// SAVE CART
function saveCart() {
  localStorage.setItem(
    "sondaria_cart",
    JSON.stringify(cart)
  );

  updateCartCount();
  renderCart();
}

// CART COUNT
function updateCartCount() {
  const total = Object.values(cart).reduce(
    (sum, quantity) => sum + Number(quantity),
    0
  );

  const count = $("#cartCount");

  if (count) {
    count.textContent = total;
  }
}

// PRODUCT RENDERING
function renderProducts() {
  const grid = $("#productGrid");

  if (!grid) return;

  const search = ($("#searchBox")?.value || "")
    .trim()
    .toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-products">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">

      <img
        src="${safeText(product.image)}"
        alt="${safeText(product.name)}"
        loading="lazy"
      >

      <div class="product-info">

        <small>${safeText(product.category)}</small>

        <h3>${safeText(product.name)}</h3>

        <p>${safeText(product.description)}</p>

        <div class="product-bottom">

          <span class="price">
            ${formatPrice(product.price)}
          </span>

          <button
            class="add-btn"
            data-add="${product.id}"
          >
            ADD +
          </button>

        </div>
      </div>
    </article>
  `).join("");
}

// ADD PRODUCT
function addToCart(productId) {
  const product = products.find(
    item => item.id === Number(productId)
  );

  if (!product) return;

  cart[product.id] = (cart[product.id] || 0) + 1;

  saveCart();

  showMessage(product.name + " added to your bag!");
}

// PRODUCT BUTTON EVENTS
$("#productGrid")?.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  addToCart(button.dataset.add);
});

// CATEGORY FILTER
$("#categories")?.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderProducts();
});

// PRODUCT SEARCH
$("#searchBox")?.addEventListener("input", renderProducts);

// CART FUNCTIONS
function getCartProducts() {
  return Object.entries(cart)
    .map(([id, quantity]) => {
      const product = products.find(
        item => item.id === Number(id)
      );

      if (!product) return null;

      return {
        product,
        quantity: Number(quantity)
      };
    })
    .filter(Boolean);
}

// OPEN CART
function openCart() {
  renderCart();

  $("#cartPanel")?.classList.add("open");

  document.body.style.overflow = "hidden";
}

// CLOSE CART
function closeCart() {
  $("#cartPanel")?.classList.remove("open");

  document.body.style.overflow = "";
}

// RENDER CART
function renderCart() {
  const container = $("#cartItems");
  const totalElement = $("#cartTotal");

  if (!container || !totalElement) return;

  const items = getCartProducts();

  if (!items.length) {
    container.innerHTML = `
      <p>Your bag is empty.</p>
      <p>Explore our Party Store to add products.</p>
    `;

    totalElement.textContent = "Total: ₹0";

    return;
  }

  let total = 0;

  container.innerHTML = items.map(({product, quantity}) => {
    const subtotal = product.price * quantity;

    total += subtotal;

    return `
      <div class="cart-row">

        <div>
          <b>${safeText(product.name)}</b>
          <p>${formatPrice(product.price)} each</p>
        </div>

        <div>
          <button
            data-cart-action="minus"
            data-id="${product.id}"
          >−</button>

          <b>${quantity}</b>

          <button
            data-cart-action="plus"
            data-id="${product.id}"
          >+</button>

          <button
            data-cart-action="remove"
            data-id="${product.id}"
          >✕</button>
        </div>

        <strong>${formatPrice(subtotal)}</strong>

      </div>
    `;
  }).join("");

  totalElement.textContent = "Total: " + formatPrice(total);
}

// CART QUANTITY EVENTS
$("#cartItems")?.addEventListener("click", event => {
  const button = event.target.closest("[data-cart-action]");

  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.cartAction;

  if (!cart[id]) return;

  if (action === "plus") {
    cart[id]++;
  }

  if (action === "minus") {
    cart[id]--;

    if (cart[id] <= 0) {
      delete cart[id];
    }
  }

  if (action === "remove") {
    delete cart[id];
  }

  saveCart();
});

// WHATSAPP CHECKOUT
function checkoutWhatsApp() {
  const items = getCartProducts();

  if (!items.length) {
    showMessage("Your bag is empty!");
    return;
  }

  const name = prompt("Enter your full name:");

  if (!name || !name.trim()) {
    showMessage("Please enter your name.");
    return;
  }

  const phone = prompt("Enter your 10-digit mobile number:");

  if (!phone || !/^[6-9]\d{9}$/.test(phone.trim())) {
    showMessage("Please enter a valid Indian mobile number.");
    return;
  }

  const address = prompt("Enter your delivery address:");

  if (!address || !address.trim()) {
    showMessage("Please enter your address.");
    return;
  }

  let total = 0;

  let message =
    "SONDARIA — NEW ORDER ENQUIRY\n\n" +
    "Customer: " + name.trim() + "\n" +
    "Mobile: " + phone.trim() + "\n" +
    "Address: " + address.trim() + "\n\n" +
    "ORDER DETAILS\n";

  items.forEach(({product, quantity}) => {
    const subtotal = product.price * quantity;

    total += subtotal;

    message +=
      "\n" + product.name +
      " × " + quantity +
      " = " + formatPrice(subtotal);
  });

  message +=
    "\n\nTOTAL: " + formatPrice(total) +
    "\n\nPlease confirm product availability and delivery.";

  const whatsappURL =
    "https://wa.me/" +
    ADMIN_WHATSAPP +
    "?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank", "noopener");
}

// CELEBRATION SERVICE SELECTION
function selectService(service) {
  const occasion = $("#occasion");

  if (occasion) {
    occasion.value = service;
  }

  $("#booking")?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

// BOOKING FORM
$("#bookingForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const occasion = data.get("occasion");
  const date = data.get("date");
  const locality = data.get("locality");
  const budget = data.get("budget");
  const details = data.get("details") || "Not specified";

  if (!date || !locality) {
    showMessage("Please complete all required details.");
    return;
  }

  const selectedDate = new Date(date + "T00:00:00");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    showMessage("Please select a future event date.");
    return;
  }

  const message =
    "SONDARIA — CELEBRATION BOOKING\n\n" +
    "Occasion: " + occasion + "\n" +
    "Event date: " + date + "\n" +
    "Location: " + locality + "\n" +
    "Budget: " + budget + "\n" +
    "Details: " + details + "\n\n" +
    "Please contact me to confirm availability and quotation.";

  const url =
    "https://wa.me/" +
    ADMIN_WHATSAPP +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener");
});

// MOBILE MENU
const menuButton = $("#menuBtn");
const navigation = $("#navigation");

menuButton?.addEventListener("click", () => {
  navigation?.classList.toggle("open");
});

navigation?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
  });
});

// INITIALIZE WEBSITE
function initializeWebsite() {
  renderProducts();
  updateCartCount();
  renderCart();

  // Set the earliest booking date to today.
  const dateInput = document.querySelector(
    '#bookingForm input[name="date"]'
  );

  if (dateInput) {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localDate;
  }
}

// START
initializeWebsite();
