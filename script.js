/**
 * BRUNDAVAN NATURAL FARMS — OFFICIAL APPLICATION SCRIPT
 * Products: Milk, Curd, Ghee, Oil, Dry Fruits, Dryfruits Powder
 * Features:
 * 1. Making Process Animation Video Player (MP4 & WebP)
 * 2. 6-Step Vedic Process Interactive Walkthrough
 * 3. Shopping Cart Drawer with Real-Time Total
 * 4. Product Quick View Modal
 * 5. Instant Live Search
 * 6. Gallery Lightbox & Sticky Navigation
 */

// ============================================================================
// 1. PRODUCT DATABASE (EXACTLY THE 6 PRODUCTS REQUESTED)
// ============================================================================
const PRODUCTS_DATA = [
  {
    id: 1,
    category: "milk",
    categoryLabel: "Milk",
    name: "Brundavan Natural Farms - Milk",
    price: 85,
    unit: "/ 1 Litre",
    image: "images/product_milk.jpg",
    badge: "Fresh & Pure",
    description: "Pure wholesome dairy milk sourced directly from free-grazing indigenous Gir cows. Naturally rich in easy-to-digest A2 beta-casein protein, chilled immediately and delivered fresh in sanitized glass bottles.",
    features: [
      "🐄 100% Native Indian Gir Cows",
      "🥛 Naturally A2 Beta-Casein Protein",
      "🌾 Ethically Grass-Fed & Free-Grazing",
      "🫙 Sanitized Eco-Friendly Glass Bottle"
    ]
  },
  {
    id: 2,
    category: "curd",
    categoryLabel: "Curd",
    name: "Brundavan Natural Farms - Curd",
    price: 95,
    unit: "/ 500g",
    image: "images/product_curd.jpg",
    badge: "Naturally Prepared",
    description: "Fresh and traditionally prepared curd, naturally set in porous terracotta pots using rich cultured A2 Gir cow milk. Rich in natural probiotics, creamy, thick, and velvety with no synthetic thickeners.",
    features: [
      "🏺 Porous Terracotta Pot Setting",
      "🦠 Live Natural Probiotic Cultures",
      "🥛 100% Cultured Desi Gir Cow Milk",
      "✨ Zero Synthetic Preservatives"
    ]
  },
  {
    id: 3,
    category: "ghee",
    categoryLabel: "Ghee",
    name: "Brundavan Natural Farms - Ghee",
    price: 1450,
    unit: "/ 500ml",
    image: "images/product_ghee.jpg",
    badge: "Traditional Bilona Method",
    description: "Traditional ghee with a rich golden granular appearance. Handcrafted from cultured A2 curd churned with bi-directional wooden bilona and slow-boiled in heavy brass vessels over low firewood embers.",
    features: [
      "🏺 Vedic Curd-to-Ghee Bilona Craft",
      "🪵 Wooden Bi-Directional Mathani",
      "🔥 Slow Wood-Fire Brass Simmering",
      "✨ Sacred Granular Danedar Texture"
    ]
  },
  {
    id: 4,
    category: "oil",
    categoryLabel: "Oil",
    name: "Brundavan Natural Farms - Oil",
    price: 380,
    unit: "/ 1 Litre",
    image: "images/product_oil.jpg",
    badge: "Traditionally Extracted",
    description: "Traditional wood-pressed (marachekku / vaghai) unrefined oils extracted at room temperature. Retains vital natural antioxidants, delicate nutty aroma, and zero chemical solvent residues.",
    features: [
      "🪵 Ancient Wood-Ghani Extraction",
      "❄️ Cold-Pressed Below 40°C",
      "🥜 Unrefined & Unbleached Purity",
      "🌿 Rich in Natural Vitamin E"
    ]
  },
  {
    id: 5,
    category: "dryfruits",
    categoryLabel: "Dry Fruits",
    name: "Brundavan Natural Farms - Dry Fruits",
    price: 450,
    unit: "/ 250g",
    image: "images/product_dryfruits.jpg",
    badge: "Handpicked Grade A",
    description: "Carefully hand-sorted supreme almonds, jumbo cashews, natural mountain walnuts, and sweet golden raisins. Sun-dried with zero chemical or sulfur polishing for wholesome natural energy.",
    features: [
      "🌰 Handpicked Jumbo Supreme Grade",
      "☀️ Naturally Sun-Dried Crunch",
      "🚫 Zero Chemical Polishing",
      "💪 High Plant Protein & Heart Fats"
    ]
  },
  {
    id: 6,
    category: "powder",
    categoryLabel: "Dryfruits Powder",
    name: "Brundavan Natural Farms - Dryfruits Powder",
    price: 320,
    unit: "/ 200g",
    image: "images/product_dryfruits_powder.jpg",
    badge: "10+ Natural Ingredients",
    description: "Artisanal blend of 10+ wholesome dry fruits, nuts, seeds, and spices. Made with no chemicals and no preservatives for pure family nourishment.",
    features: [
      "🌰 10+ Wholesome Dry Fruits & Nuts",
      "🌱 100% Pure & Natural Ingredients",
      "🚫 No Chemicals & No Preservatives",
      "✨ Stone-Ground for Authentic Nutrition"
    ]
  }
];

// ============================================================================
// 2. PROCESS ANIMATION VIDEO HELPER
// ============================================================================
function playProcessVideo() {
  const vid = document.getElementById("makingProcessVideo");
  if (vid) vid.play();
}

function pauseProcessVideo() {
  const vid = document.getElementById("makingProcessVideo");
  if (vid) vid.pause();
}

// ============================================================================
// 4. SHOPPING CART SYSTEM & DRAWER (PERSISTENT ACROSS SUBPAGES)
// ============================================================================
let cart = [];

function loadCart() {
  try {
    const saved = localStorage.getItem("bnf_cart_items");
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("bnf_cart_items", JSON.stringify(cart));
  } catch (e) {}
}

// Load cart state on script execution
loadCart();

function addToCart(productId, name, price, image, unit, quantity = 1) {
  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += quantity;
  } else {
    cart.push({
      id: productId,
      name: name,
      price: price,
      image: image,
      unit: unit,
      qty: quantity
    });
  }

  saveCart();
  updateCartUI();
  showToast("Added to Cart!", `${name} (${quantity} × ₹${price}) added to your basket.`);
  animateCartBadge();
}

function changeCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast("Item Removed", "Removed from your farm basket.");
}

function updateCartUI() {
  const badge = document.getElementById("cartBadgeCount");
  const drawerCount = document.getElementById("cartDrawerCount");
  const itemsList = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (badge) badge.textContent = totalQty;
  if (drawerCount) drawerCount.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

  if (itemsList) {
    if (cart.length === 0) {
      itemsList.innerHTML = `
        <div class="empty-cart-view">
          <div class="empty-cart-icon">🧺</div>
          <h4>Your basket is currently empty</h4>
          <p>Explore our pure farm harvest: Milk, Curd, Ghee, Oils, Dry Fruits, and Dryfruits Powder.</p>
          <button class="btn btn-primary btn-sm" onclick="closeCart(); location.href='products.html'">Browse Products</button>
        </div>
      `;
    } else {
      itemsList.innerHTML = cart.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-unit">${item.unit} &bull; ₹${item.price} each</div>
            <div class="cart-item-controls">
              <div class="cart-item-qty">
                <button class="cart-qty-btn" onclick="changeCartQty(${item.id}, -1)">&minus;</button>
                <span class="cart-qty-num">${item.qty}</span>
                <button class="cart-qty-btn" onclick="changeCartQty(${item.id}, 1)">&plus;</button>
              </div>
              <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
              <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

function animateCartBadge() {
  const badge = document.getElementById("cartBadgeCount");
  if (!badge) return;
  badge.style.transform = "scale(1.4)";
  setTimeout(() => { badge.style.transform = "scale(1)"; }, 250);
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// 4. CHECKOUT & TAX INVOICE GENERATION SYSTEM
// ============================================================================
let currentPaymentMode = "Cash on Delivery (COD)";
let lastConfirmedOrder = null;

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Basket Empty", "Please add products before proceeding to order.");
    return;
  }

  // Close cart drawer
  closeCart();

  // Populate order items preview in checkout modal
  const previewContainer = document.getElementById("checkoutItemsPreview");
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const totalEl = document.getElementById("checkoutTotal");

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (previewContainer) {
    previewContainer.innerHTML = cart.map(item => `
      <div class="checkout-preview-item">
        <img src="${item.image}" alt="${item.name}" class="checkout-preview-thumb">
        <div class="checkout-preview-details">
          <div class="checkout-preview-name">${item.name}</div>
          <div class="checkout-preview-qty">${item.unit} &bull; Qty: ${item.qty} &times; ₹${item.price}</div>
        </div>
        <div class="checkout-preview-total">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
      </div>
    `).join('');
  }

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function selectPaymentOption(mode) {
  const codCard = document.getElementById("payOptionCod");
  const upiCard = document.getElementById("payOptionUpi");
  
  if (mode === 'cod') {
    if (codCard) {
      codCard.classList.add("active");
      const r = codCard.querySelector("input[type='radio']");
      if (r) r.checked = true;
    }
    if (upiCard) {
      upiCard.classList.remove("active");
      const r = upiCard.querySelector("input[type='radio']");
      if (r) r.checked = false;
    }
    currentPaymentMode = "Cash on Delivery (COD)";
  } else {
    if (upiCard) {
      upiCard.classList.add("active");
      const r = upiCard.querySelector("input[type='radio']");
      if (r) r.checked = true;
    }
    if (codCard) {
      codCard.classList.remove("active");
      const r = codCard.querySelector("input[type='radio']");
      if (r) r.checked = false;
    }
    currentPaymentMode = "UPI / Online Payment";
  }
}

function numberToWords(num) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n === 0) return 'Zero';
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
  }

  const str = inWords(Math.floor(num)).trim();
  return `Indian Rupees ${str} Only`;
}

function handlePlaceOrder(e) {
  if (e) e.preventDefault();

  if (cart.length === 0) {
    showToast("Basket Empty", "Please add products before confirming order.");
    return;
  }

  const custName = document.getElementById("custName") ? document.getElementById("custName").value.trim() : "Valued Customer";
  const custPhone = document.getElementById("custPhone") ? document.getElementById("custPhone").value.trim() : "+91 98765 43210";
  const custPincode = document.getElementById("custPincode") ? document.getElementById("custPincode").value.trim() : "506001";
  const custAddress = document.getElementById("custAddress") ? document.getElementById("custAddress").value.trim() : "Warangal, Telangana";

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const now = new Date();
  const year = now.getFullYear();
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `BNF-${year}-${randomId}`;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hours = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${year}, ${displayHours}:${mins} ${ampm}`;

  // Store last order for invoice and WhatsApp
  lastConfirmedOrder = {
    invoiceNumber,
    date: formattedDate,
    customerName: custName,
    phone: custPhone,
    address: `${custAddress} - Pincode: ${custPincode}`,
    items: [...cart],
    total,
    paymentMode: currentPaymentMode
  };

  // Populate Invoice
  const invNumEl = document.getElementById("invNumber");
  const invDateEl = document.getElementById("invDate");
  const invPayModeEl = document.getElementById("invPaymentMode");
  const invCustNameEl = document.getElementById("invCustName");
  const invCustPhoneEl = document.getElementById("invCustPhone");
  const invCustAddrEl = document.getElementById("invCustAddress");
  const invBodyEl = document.getElementById("invItemsTableBody");
  const invSubtotalEl = document.getElementById("invSubtotal");
  const invGrandTotalEl = document.getElementById("invGrandTotal");
  const invWordsEl = document.getElementById("invAmountInWords");

  if (invNumEl) invNumEl.textContent = invoiceNumber;
  if (invDateEl) invDateEl.textContent = formattedDate;
  if (invPayModeEl) invPayModeEl.textContent = currentPaymentMode;
  if (invCustNameEl) invCustNameEl.textContent = custName;
  if (invCustPhoneEl) invCustPhoneEl.textContent = custPhone;
  if (invCustAddrEl) invCustAddrEl.textContent = `${custAddress} — PIN: ${custPincode}`;

  if (invBodyEl) {
    invBodyEl.innerHTML = cart.map((item, idx) => `
      <tr>
        <td style="color:#718096;font-weight:600;">${idx + 1}</td>
        <td>
          <div class="invoice-item-name">${item.name}</div>
          <div class="invoice-item-sub">100% Traditional &bull; Farm Fresh</div>
        </td>
        <td>${item.unit}</td>
        <td style="text-align:center;font-weight:700;">${item.qty}</td>
        <td style="text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="text-align:right;font-weight:700;color:var(--dark-green);">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');
  }

  if (invSubtotalEl) invSubtotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  if (invGrandTotalEl) invGrandTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  if (invWordsEl) invWordsEl.textContent = numberToWords(total);

  // Close checkout modal
  closeCheckoutModal();

  // Reset cart
  cart = [];
  saveCart();
  updateCartUI();

  // Open invoice modal
  const invoiceModal = document.getElementById("invoiceModal");
  if (invoiceModal) invoiceModal.classList.add("active");
  document.body.style.overflow = "hidden";

  showToast("Order Placed Successfully! 🎉", `Invoice #${invoiceNumber} generated.`);
}

function closeInvoiceModal() {
  const modal = document.getElementById("invoiceModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function printInvoiceDoc() {
  window.print();
}

function sendInvoiceToWhatsApp() {
  if (!lastConfirmedOrder) return;
  const itemsText = lastConfirmedOrder.items
    .map(i => `• ${i.name} (${i.unit}) x ${i.qty} = ₹${i.price * i.qty}`)
    .join('\n');

  const text = `*BRUNDAVAN NATURAL FARMS — ORDER CONFIRMATION*\n` +
    `---------------------------------------\n` +
    `*Invoice No:* ${lastConfirmedOrder.invoiceNumber}\n` +
    `*Date:* ${lastConfirmedOrder.date}\n` +
    `*Customer:* ${lastConfirmedOrder.customerName}\n` +
    `*Phone:* ${lastConfirmedOrder.phone}\n` +
    `*Delivery Address:* ${lastConfirmedOrder.address}\n` +
    `*Payment Mode:* ${lastConfirmedOrder.paymentMode}\n` +
    `---------------------------------------\n` +
    `*ORDERED ITEMS:*\n${itemsText}\n` +
    `---------------------------------------\n` +
    `*Grand Total:* ₹${lastConfirmedOrder.total.toLocaleString('en-IN')} (Free Delivery)\n\n` +
    `_Thank you for supporting natural, traditional Gir cow farming!_`;

  const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// ============================================================================
// 5. PRODUCT QUICK VIEW MODAL
// ============================================================================
let currentModalProductId = 1;
let currentModalQty = 1;

function openProductModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;
  currentModalQty = 1;

  document.getElementById("modalProductImg").src = product.image;
  document.getElementById("modalProductImg").alt = product.name;
  document.getElementById("modalProductBadge").textContent = product.badge;
  document.getElementById("modalProductCategory").textContent = `Category: ${product.categoryLabel}`;
  document.getElementById("modalProductTitle").textContent = product.name;
  document.getElementById("modalProductPrice").textContent = product.price.toLocaleString('en-IN');
  document.getElementById("modalProductUnit").textContent = product.unit;
  document.getElementById("modalProductDesc").textContent = product.description;
  document.getElementById("modalQtyVal").textContent = "1";

  // Features List
  const featuresContainer = document.getElementById("modalProductFeatures");
  if (featuresContainer) {
    featuresContainer.innerHTML = product.features.map(f => `
      <div class="modal-feature-item">${f}</div>
    `).join('');
  }

  // Setup Add Button
  const addBtn = document.getElementById("modalAddCartBtn");
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(product.id, product.name, product.price, product.image, product.unit, currentModalQty);
      closeProductModal();
      openCart();
    };
  }

  const modal = document.getElementById("productModal");
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function changeModalQty(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  const qtyEl = document.getElementById("modalQtyVal");
  if (qtyEl) qtyEl.textContent = currentModalQty;
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

// ============================================================================
// 6. LIVE SEARCH MODAL
// ============================================================================
function openSearchModal() {
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");
  if (modal) modal.classList.add("active");
  if (input) {
    input.value = "";
    input.focus();
    renderSearchResults("");
  }
  document.body.style.overflow = "hidden";
}

function closeSearchModal() {
  const modal = document.getElementById("searchModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function renderSearchResults(query) {
  const resultsContainer = document.getElementById("searchResults");
  if (!resultsContainer) return;

  const q = query.trim().toLowerCase();
  if (!q) {
    resultsContainer.innerHTML = `
      <p class="search-hint">Type to search among our 6 traditional farm harvest categories...</p>
      <div class="quick-tags" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
        <span class="badge-pill" style="cursor:pointer;" onclick="setSearchTerm('milk')">Milk</span>
        <span class="badge-pill" style="cursor:pointer;" onclick="setSearchTerm('curd')">Curd</span>
        <span class="badge-pill" style="cursor:pointer;" onclick="setSearchTerm('ghee')">Ghee</span>
        <span class="badge-pill" style="cursor:pointer;" onclick="setSearchTerm('oil')">Oil</span>
        <span class="badge-pill" style="cursor:pointer;" onclick="setSearchTerm('dry fruits')">Dry Fruits</span>
        <span class="badge-pill" style="cursor:pointer;" onclick="setSearchTerm('dryfruits powder')">Dryfruits Powder</span>
      </div>
    `;
    return;
  }

  const matches = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.categoryLabel.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <p class="search-hint">No products matching "<strong>${escapeHtml(query)}</strong>". We specialize in: Milk, Curd, Ghee, Oils, Dry Fruits, and Dryfruits Powder.</p>
    `;
  } else {
    resultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="closeSearchModal(); openProductModal(${p.id})">
        <img src="${p.image}" alt="${p.name}" class="search-thumb">
        <div style="flex-grow:1;">
          <h4 style="font-size:0.95rem;color:var(--dark-green);margin:0;">${p.name}</h4>
          <span style="font-size:0.75rem;color:var(--text-muted);">${p.categoryLabel} &bull; ₹${p.price} ${p.unit}</span>
        </div>
        <button class="btn btn-outline-green btn-sm" style="padding:4px 10px;font-size:0.75rem;">View</button>
      </div>
    `).join('');
  }
}

function setSearchTerm(term) {
  const input = document.getElementById("searchInput");
  if (input) {
    input.value = term;
    renderSearchResults(term);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// ============================================================================
// 7. GALLERY LIGHTBOX & MODALS
// ============================================================================
function openLightbox(imgSrc, title, desc) {
  const lightbox = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  const titleEl = document.getElementById("lightboxTitle");
  const descEl = document.getElementById("lightboxDesc");

  if (img) img.src = imgSrc;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  if (lightbox) lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox(e) {
  if (e && e.target && e.target.id !== "lightboxModal" && !e.target.classList.contains("lightbox-close")) {
    return;
  }
  const lightbox = document.getElementById("lightboxModal");
  if (lightbox) lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function openProcessDeepModal() {
  const modal = document.getElementById("processDeepModal");
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProcessDeepModal() {
  const modal = document.getElementById("processDeepModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function openStoryModal() {
  const titleEl = document.getElementById("policyModalTitle");
  const bodyEl = document.getElementById("policyModalBody");
  if (titleEl) titleEl.textContent = "Our Story — Brundavan Natural Farms";
  if (bodyEl) {
    bodyEl.innerHTML = `
      <p style="margin-bottom:16px;line-height:1.7;">
        <strong>Brundavan Natural Farms</strong> is a family initiative to bring you pure and nutritious dairy products from our naturally grown, grass-fed Gir cows. Spread across fertile landscapes, our Gaushala provides peaceful sanctuary to hundreds of indigenous Indian Gir cattle.
      </p>
      <h4 style="font-family:var(--font-serif);color:var(--dark-green);margin-bottom:8px;">The Vedic Philosophy of Ahimsa &amp; Health</h4>
      <p style="margin-bottom:16px;line-height:1.7;">
        We practice non-violent, ethical dairy farming. Calves are nourished with their mother’s milk first before collection. Our cows graze openly on lush organic pastures, drink sweet borewell water, and are gently cared for each day.
      </p>
      <h4 style="font-family:var(--font-serif);color:var(--dark-green);margin-bottom:8px;">Small-Batch Integrity</h4>
      <p style="line-height:1.7;">
        Every earthen pot of curd, bottle of cold-pressed oil, and jar of golden Vedic Bilona Ghee is prepared in limited artisanal batches to ensure absolute freshness. From our farm to your family, we guarantee uncompromised purity.
      </p>
    `;
  }
  const modal = document.getElementById("policyModal");
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function openPolicyModal(type) {
  const titleEl = document.getElementById("policyModalTitle");
  const bodyEl = document.getElementById("policyModalBody");

  if (type === "privacy") {
    titleEl.textContent = "Privacy Policy — Brundavan Natural Farms";
    bodyEl.innerHTML = `
      <p style="margin-bottom:12px;">At <strong>Brundavan Natural Farms</strong>, we hold customer confidentiality and trust in the highest regard. Personal information shared during order placement—such as customer names, delivery addresses, contact numbers, and payment preferences—is encrypted and used exclusively for packing, billing, and dispatching your orders.</p>
      <p style="margin-bottom:12px;">We never sell, rent, or distribute personal information to external marketing agencies or third parties. All transactions adhere to stringent security protocols to ensure complete safety and peace of mind.</p>
    `;
  } else if (type === "terms") {
    titleEl.textContent = "Terms & Conditions — Brundavan Natural Farms";
    bodyEl.innerHTML = `
      <p style="margin-bottom:12px;">Welcome to <strong>Brundavan Natural Farms</strong>. By browsing our farm store and placing an order, you agree to purchase authentic, small-batch farm produce harvested according to ethical Vedic standards.</p>
      <p style="margin-bottom:12px;">All prices listed on our platform are in Indian Rupees (INR) and inclusive of statutory taxes. Because our products are 100% natural with zero artificial preservatives or chemical stabilizers, slight variations in natural color, batch aroma, and seasonal consistency reflect authentic artisanal preparation.</p>
    `;
  } else if (type === "shipping") {
    titleEl.textContent = "Shipping & Delivery Policy";
    bodyEl.innerHTML = `
      <p style="margin-bottom:12px;"><strong>Direct Farm Fresh Dispatch:</strong> All orders are packed in sanitized, food-grade glass, earthenware, and insulated sustainable containers directly at our Gaushala in Warangal, Telangana.</p>
      <p style="margin-bottom:12px;">Fresh milk and curd are dispatched daily in temperature-controlled early morning delivery routes. Vedic Bilona Ghee, wood cold-pressed oils, dry fruits, and dry powders are delivered nationwide via premium express couriers within 2-4 business days.</p>
      <p style="margin-bottom:12px;font-weight:600;color:var(--forest-green);">Enjoy FREE Delivery on all orders across India above ₹999.</p>
    `;
  } else if (type === "refund") {
    titleEl.textContent = "100% Purity & Replacement Policy";
    bodyEl.innerHTML = `
      <p style="margin-bottom:12px;"><strong>Our Guarantee to Your Family:</strong> If any product from Brundavan Natural Farms reaches you damaged, broken in transit, or fails to meet our strict purity standards, please contact our helpline on WhatsApp (+91 98765 43210) within 24 hours of delivery.</p>
      <p style="margin-bottom:12px;">We will immediately arrange a hassle-free fresh replacement or process a full refund to your original payment mode without complicated procedures.</p>
    `;
  }

  const modal = document.getElementById("policyModal");
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePolicyModal() {
  const modal = document.getElementById("policyModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function highlightCategory(cat) {
  const card = document.querySelector(`.product-card[data-category="${cat}"]`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'all 0.3s ease';
    card.style.transform = 'scale(1.04)';
    card.style.borderColor = 'var(--golden-yellow)';
    card.style.boxShadow = '0 12px 35px rgba(212, 167, 44, 0.35)';
    setTimeout(() => {
      card.style.transform = '';
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 1800);
  }
}

// ============================================================================
// 8. TOAST SYSTEM
// ============================================================================
let toastTimeout = null;

function showToast(title, msg) {
  const toast = document.getElementById("toastBox");
  const titleEl = document.getElementById("toastTitle");
  const msgEl = document.getElementById("toastMsg");

  if (!toast || !titleEl || !msgEl) return;

  titleEl.textContent = title;
  msgEl.textContent = msg;

  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ============================================================================
// 9. GLOBAL EVENT LISTENERS & INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Sticky Header Scroll Listener
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // Search Modal Trigger
  const searchBtn = document.getElementById("searchTriggerBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", openSearchModal);
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // Cart Drawer Trigger
  const cartBtn = document.getElementById("cartTriggerBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeSearchModal();
      closeProductModal();
      closeLightbox();
      closeProcessDeepModal();
      closePolicyModal();
      closeCheckoutModal();
      closeInvoiceModal();
    }
  });

  // Highlight current nav section on scroll (for home page anchors)
  const currentPath = window.location.pathname;
  const isHomePage = currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath === "" || (!currentPath.includes(".html"));
  if (isHomePage) {
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 140;
        const sectionId = current.getAttribute("id");
        const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);
        if (navLink) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            navLink.classList.add("active");
          }
        }
      });
    });
  }

  // Initialize UI
  updateCartUI();
  console.log("Brundavan Natural Farms — Official Multi-Page Store Active.");
});

// ============================================================================
// 10. PRODUCT CATEGORY FILTER (FOR PRODUCTS.HTML)
// ============================================================================
function filterProductCategory(category) {
  const buttons = document.querySelectorAll(".product-filter-btn");
  buttons.forEach(btn => {
    if (btn.getAttribute("data-category") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    const cardCat = card.getAttribute("data-category");
    if (category === "all" || cardCat === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// ============================================================================
// 11. GALLERY CATEGORY FILTER (FOR GALLERY.HTML)
// ============================================================================
function filterGalleryCategory(category) {
  const buttons = document.querySelectorAll(".gallery-filter-btn");
  buttons.forEach(btn => {
    if (btn.getAttribute("data-filter") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const items = document.querySelectorAll(".gallery-grid-card");
  items.forEach(item => {
    const itemCat = item.getAttribute("data-category");
    if (category === "all" || itemCat === category) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// ============================================================================
// 12. CONTACT FORM SUBMISSION HANDLER
// ============================================================================
function handleContactSubmit(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById("contactName");
  const phoneInput = document.getElementById("contactPhone");
  const msgInput = document.getElementById("contactMessage");

  const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Friend";
  showToast("Message Received! 🌿", `Thank you, ${name}. Our farm care team will contact you shortly.`);

  if (nameInput) nameInput.value = "";
  if (phoneInput) phoneInput.value = "";
  if (msgInput) msgInput.value = "";
  const emailInput = document.getElementById("contactEmail");
  if (emailInput) emailInput.value = "";
}

