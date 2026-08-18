import { db, collection, getDocs, serverTimestamp } from "./firebase-config.js";
import { doc, runTransaction } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const currency = new Intl.NumberFormat("en-IN");
let products = [];
let activeCategory = "All";
let cart = JSON.parse(localStorage.getItem("layaliCart") || "[]");
let orderPlatform = "whatsapp";

const $ = (id) => document.getElementById(id);
const productsGrid = $("productsGrid");
const cartSidebar = $("cartSidebar");
const cartOverlay = $("cartOverlay");
const cartItems = $("cartItems");
const cartCount = $("cartCount");
const cartTotal = $("cartTotal");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function isAvailable(product) {
  const stock = Number(product.stock ?? 0);
  return stock > 0 && (product.status || "Active") === "Active";
}

function stockLabel(product) {
  const tag = product.tags?.[0] || "";

  return {
    text: tag,
    className: isAvailable(product) ? "in" : "out"
  };
}

function saveCart() { localStorage.setItem("layaliCart", JSON.stringify(cart)); }

function sanitizeCart() {
  const productById = new Map(products.map((product) => [product.id, product]));
  cart = cart
    .map((item) => {
      const current = productById.get(item.id);
      if (!current || !isAvailable(current)) return null;
      return { ...item, qty: Math.min(Math.max(1, item.qty), Number(current.stock)), price: Number(current.price), image: current.image, name: current.name };
    })
    .filter(Boolean);
  saveCart();
}

function updateCart() {
  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = totalQuantity;
  cartTotal.textContent = currency.format(total);
  cartItems.innerHTML = cart.length
    ? cart.map((item, index) => `<article class="cart-item"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"><div class="cart-item-info"><strong>${escapeHtml(item.name)}</strong><p>₹${currency.format(item.price)}</p><div class="cart-controls"><button type="button" data-cart-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-cart-action="increase" data-index="${index}" aria-label="Increase quantity">+</button><button type="button" class="remove-item" data-cart-action="remove" data-index="${index}" aria-label="Remove item">×</button></div></div></article>`).join("")
    : '<p class="empty-cart">Your cart is waiting for something beautiful.</p>';
  saveCart();
}

function renderFilters() {
  const categories = ["All", ...new Set(products.map((product) => product.category?.trim()).filter(Boolean))];
  $("categoryFilters").innerHTML = categories.map((category) => `<button type="button" class="filter-chip ${category === activeCategory ? "active" : ""}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
}

function renderProducts() {
  const query = $("catalogSearch").value.trim().toLowerCase();
  const visible = products.filter((product) => {
    const haystack = [product.name, product.category, product.subcategory, product.description, ...(product.tags || [])].join(" ").toLowerCase();
    return (activeCategory === "All" || product.category === activeCategory) && haystack.includes(query);
  });
  $("productCount").textContent = `${visible.length} ${visible.length === 1 ? "candle" : "candles"} found`;
  productsGrid.innerHTML = visible.length ? visible.map((product) => {
    const badge = stockLabel(product);
    const available = isAvailable(product);
    const details = [
      product.subcategory && ["Collection", product.subcategory],
      product.weight && ["Weight", product.weight],
      product.material && ["Wax", product.material],
      product.color && ["Colour", product.color],
      product.sku && ["SKU", product.sku],
    ].filter(Boolean);
    const inventoryText = available ? `${Number(product.stock)} available` : "Currently unavailable";
    const detailPanel = details.length || product.tags?.length ? `<div class="product-detail-panel">${details.length ? `<dl class="product-details">${details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>` : ""}${product.tags?.length ? `<div class="product-tags">${product.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}<p class="inventory-detail"><i class="fa-solid fa-cubes-stacked" aria-hidden="true"></i> ${inventoryText}</p></div>` : "";
return `<article class="product-card ${available ? "" : "sold-out"}" tabindex="0">
<div class="product-image">
<img src="${escapeHtml(product.image || "")}" alt="${escapeHtml(product.name)}" loading="lazy">

${badge.text ? `<span class="stock-badge ${badge.className}">${escapeHtml(badge.text)}</span>` : ""}

</div>

<div class="product-content">
<p class="product-category">${escapeHtml(product.category || "Signature collection")}</p>

<h3 class="product-title">${escapeHtml(product.name)}</h3>

<p class="product-description">${escapeHtml(product.description || "A handcrafted candle made for a beautiful atmosphere.")}</p>

${detailPanel}

<div class="product-footer">
<div>
<span class="price-label">From</span>
<div class="price">₹${currency.format(Number(product.price || 0))}</div>
</div>

<button class="buy-btn" type="button" data-product-id="${product.id}" ${available ? "" : "disabled"}>
${available ? "Add to cart" : "Sold out"}
</button>

</div>
</div>
</article>`;  }).join("") : '<div class="catalog-empty"><i class="fa-regular fa-gem"></i><h3>No candles found</h3><p>Try another search or browse all collections.</p></div>';
}

async function loadProducts() {
  productsGrid.innerHTML = '<p class="catalog-loading">Curating the collection…</p>';
  try {
    const snapshot = await getDocs(collection(db, "products"));
    products = snapshot.docs.map((document) => ({ id: document.id, ...document.data() })).sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    sanitizeCart();
    renderFilters();
    renderProducts();
    updateCart();
  } catch (error) {
    console.error("Product loading error", error);
    productsGrid.innerHTML = '<div class="catalog-empty"><h3>Unable to load the collection</h3><p>Please refresh and try again.</p></div>';
  }
}

function openCart() { cartSidebar.classList.add("open"); cartOverlay.classList.add("active"); }
function closeCart() { cartSidebar.classList.remove("open"); cartOverlay.classList.remove("active"); }

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product || !isAvailable(product)) return;
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty = Math.min(existing.qty + 1, Number(product.stock));
  else cart.push({ id, name: product.name, price: Number(product.price), image: product.image, qty: 1 });
  updateCart(); openCart();
}

function changeQuantity(index, action) {
  const item = cart[index]; if (!item) return;
  const current = products.find((product) => product.id === item.id);
  if (action === "remove" || action === "decrease") item.qty -= 1;
  if (action === "increase" && current) item.qty = Math.min(item.qty + 1, Number(current.stock));
  if (item.qty <= 0) cart.splice(index, 1);
  updateCart();
}

function clearCheckoutForm() { ["customerName", "customerPhone", "customerAddress", "customerCity", "customerState", "customerPincode"].forEach((id) => { $(id).value = ""; }); }

async function placeOrder() {
  const customer = $("customerName").value.trim(); const phone = $("customerPhone").value.trim(); const address = $("customerAddress").value.trim(); const city = $("customerCity").value.trim(); const state = $("customerState").value.trim(); const pincode = $("customerPincode").value.trim();
  if (!/^[A-Za-z ]{2,}$/.test(customer) || !/^[6-9]\d{9}$/.test(phone) || address.length < 10 || !/^[A-Za-z ]+$/.test(city) || !/^[A-Za-z ]+$/.test(state) || !/^\d{6}$/.test(pincode)) { alert("Please complete all delivery details with valid information."); return; }
  sanitizeCart();
  if (!cart.length) { alert("Your cart contains unavailable items. Please select an in-stock candle."); $("checkoutModal").classList.remove("active"); return; }
  const orderItems = cart.map((item) => ({ ...item }));
  const total = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = `🕯️ *LAYALI LUMINA ORDER*\n\nCustomer: ${customer}\nPhone: ${phone}\n\nDelivery address:\n${address}\n${city}, ${state} - ${pincode}\n\nProducts:\n${orderItems.map((item) => `• ${item.name} × ${item.qty} — ₹${currency.format(item.price * item.qty)}`).join("\n")}\n\n*TOTAL: ₹${currency.format(total)}*\n\nThank you for choosing Layali Lumina.`;
  try {
    const orderRef = doc(collection(db, "orders"));
    const productRefs = orderItems.map((item) => doc(db, "products", item.id));
    await runTransaction(db, async (transaction) => {
      const productSnapshots = await Promise.all(productRefs.map((reference) => transaction.get(reference)));
      productSnapshots.forEach((snapshot, index) => {
        const item = orderItems[index];
        const product = snapshot.data();
        const stock = Number(product?.stock ?? 0);
        if (!snapshot.exists() || (product.status || "Active") !== "Active" || stock < item.qty) {
          throw new Error(`${item.name} is no longer available in the requested quantity.`);
        }
      });
      productSnapshots.forEach((snapshot, index) => {
        const item = orderItems[index];
        transaction.update(snapshot.ref, { stock: Number(snapshot.data().stock ?? 0) - item.qty, updatedAt: serverTimestamp() });
      });
      transaction.set(orderRef, { customerName: customer, phone, address, city, state, pincode, fullAddress: `${address}, ${city}, ${state} - ${pincode}`, items: orderItems, total, createdAt: serverTimestamp(), status: "New" });
    });
    $("checkoutModal").classList.remove("active"); cart = []; updateCart(); clearCheckoutForm(); alert("Your order has been placed successfully.");
    if (orderPlatform === "whatsapp") window.open(`https://wa.me/918977438292?text=${encodeURIComponent(message)}`, "_blank");
    else { await navigator.clipboard?.writeText(message); window.open("https://www.instagram.com/direct/t/17849561796664588/", "_blank"); alert("Your order has been copied. Paste it into the Instagram message."); }
  } catch (error) { console.error("Order save error", error); alert(error.message?.includes("requested quantity") ? error.message : "We couldn't place your order. Please try again."); }
}

$("productsGrid").addEventListener("click", (event) => { const button = event.target.closest("[data-product-id]"); if (button) addToCart(button.dataset.productId); });
$("categoryFilters").addEventListener("click", (event) => { const button = event.target.closest("[data-category]"); if (!button) return; activeCategory = button.dataset.category; renderFilters(); renderProducts(); });
$("catalogSearch").addEventListener("input", renderProducts);
$("cartItems").addEventListener("click", (event) => { const button = event.target.closest("[data-cart-action]"); if (button) changeQuantity(Number(button.dataset.index), button.dataset.cartAction); });
$("cartBtn").addEventListener("click", (event) => { event.preventDefault(); openCart(); });
$("closeCart").addEventListener("click", closeCart); cartOverlay.addEventListener("click", closeCart); $("continueShopping").addEventListener("click", closeCart);
$("checkoutBtn").addEventListener("click", () => { if (!cart.length) return alert("Your cart is empty."); orderPlatform = "whatsapp"; $("checkoutModal").classList.add("active"); });
$("checkoutBtn2").addEventListener("click", () => { if (!cart.length) return alert("Your cart is empty."); orderPlatform = "instagram"; $("checkoutModal").classList.add("active"); });
$("closeCheckout").addEventListener("click", () => { $("checkoutModal").classList.remove("active"); clearCheckoutForm(); });
$("placeOrderBtn").addEventListener("click", placeOrder);
$("searchBtn").addEventListener("click", () => { $("searchBox").classList.toggle("active"); $("searchInput").focus(); });
$("searchInput").addEventListener("input", (event) => { $("catalogSearch").value = event.target.value; renderProducts(); document.querySelector("#products").scrollIntoView({ behavior: "smooth" }); });
$("hamburger").addEventListener("click", () => $("navMenu").classList.toggle("active"));

updateCart();
loadProducts();
