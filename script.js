// ===== MENU DATA (from poster only) =====
const menuItems = [
  {
    id: 'single-dagwood',
    name: 'Single Patty Dagwood & Chips',
    desc: 'Single patty, egg, cheese, lettuce, tomato & BBQ onions',
    price: 45,
    category: 'dagwood',
    image: 'assets/dagwood.jpg'
  },
  {
    id: 'double-dagwood',
    name: 'Double Patty Dagwood & Chips',
    desc: 'Double patty, egg, cheese, lettuce, tomato & BBQ onions',
    price: 65,
    category: 'dagwood',
    image: 'assets/dagwood.jpg'
  },
  {
    id: 'single-dagwood-wings',
    name: 'Single Patty Dagwood + 2 Wings with Chips',
    desc: 'Single patty, egg, cheese, lettuce, tomato & BBQ onions + 2 wings',
    price: 75,
    category: 'dagwood',
    image: 'assets/dagwood.jpg'
  },
  {
    id: 'double-dagwood-wings',
    name: 'Double Patty Dagwood + 2 Wings with Chips',
    desc: 'Double patty, egg, cheese, lettuce, tomato & BBQ onions + 2 wings',
    price: 85,
    category: 'dagwood',
    image: 'assets/dagwood.jpg'
  },
  {
    id: 'wings-4',
    name: '4 Wings with Chips',
    desc: 'Crispy wings served with chips',
    price: 45,
    category: 'wings',
    image: 'assets/wings.jpg'
  },
  {
    id: 'wings-8',
    name: '8 Wings with Chips',
    desc: 'Crispy wings served with chips',
    price: 85,
    category: 'wings',
    image: 'assets/wings.jpg'
  }
];

// ===== CART STATE =====
let cart = [];

// ===== DOM ELEMENTS =====
const dagwoodMenu = document.getElementById('dagwoodMenu');
const wingsMenu = document.getElementById('wingsMenu');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalWrap = document.getElementById('cartTotalWrap');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');
const orderFormWrap = document.getElementById('orderFormWrap');
const orderForm = document.getElementById('orderForm');
const confirmModal = document.getElementById('confirmModal');
const confirmDetails = document.getElementById('confirmDetails');
const cartDrawer = document.getElementById('cartDrawer');
const drawerItems = document.getElementById('drawerItems');
const drawerTotal = document.getElementById('drawerTotal');
const overlay = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// WhatsApp number from poster (081 653 1070 → international)
const WHATSAPP_NUMBER = '27816531070';

// ===== RENDER MENU =====
function renderMenu() {
  const dagwood = menuItems.filter(i => i.category === 'dagwood');
  const wings = menuItems.filter(i => i.category === 'wings');

  dagwoodMenu.innerHTML = dagwood.map(item => menuCardHTML(item)).join('');
  wingsMenu.innerHTML = wings.map(item => menuCardHTML(item)).join('');

  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      addToCart(id);
    });
  });
}

function menuCardHTML(item) {
  return `
    <article class="menu-card">
      <div class="menu-card-img">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="price">R${item.price}</span>
          <button class="btn-add" data-id="${item.id}">ADD TO ORDER</button>
        </div>
      </div>
    </article>
  `;
}

// ===== CART FUNCTIONS =====
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
  // Brief feedback
  const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
  if (btn) {
    const original = btn.textContent;
    btn.textContent = 'ADDED ✓';
    btn.style.background = '#25d366';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 800);
  }
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartUI() {
  const total = getTotal();
  const count = cart.reduce((s, i) => s + i.qty, 0);

  cartCountEl.textContent = count;

  // Main order section
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Add items from the menu above.</p>';
    cartTotalWrap.style.display = 'none';
    orderFormWrap.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="item-price">R${item.price} each</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')" aria-label="Remove">×</button>
      </div>
    `).join('');
    cartTotalWrap.style.display = 'flex';
    cartTotalEl.textContent = `R${total}`;
    orderFormWrap.style.display = 'block';
  }

  // Drawer
  if (cart.length === 0) {
    drawerItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    drawerItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="item-price">R${item.price} × ${item.qty}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');
  }
  drawerTotal.textContent = `R${total}`;
}

// ===== ORDER FORM & CONFIRMATION =====
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (cart.length === 0) return;

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const time = document.getElementById('collectionTime').value.trim();
  const instructions = document.getElementById('specialInstructions').value.trim();

  if (!name || !phone || !time) {
    alert('Please fill in all required fields.');
    return;
  }

  // Build confirmation view
  let itemsHTML = cart.map(i => `<p>${i.name} × ${i.qty} — R${i.price * i.qty}</p>`).join('');
  confirmDetails.innerHTML = `
    <p><strong>Customer Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Collection Time:</strong> ${time}</p>
    ${instructions ? `<p><strong>Special Instructions:</strong> ${instructions}</p>` : ''}
    <hr style="border-color:#2a2a2a;margin:0.75rem 0;">
    ${itemsHTML}
    <p class="total-line">TOTAL: R${getTotal()}</p>
  `;

  // Store for WhatsApp
  window._orderData = { name, phone, time, instructions };

  confirmModal.classList.add('open');
  document.body.style.overflow = 'hidden';
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('editOrderBtn').addEventListener('click', closeModal);

function closeModal() {
  confirmModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('confirmWhatsAppBtn').addEventListener('click', () => {
  const data = window._orderData;
  if (!data) return;

  let orderLines = cart.map(i => `${i.name} × ${i.qty}`).join('\n');
  const message = `New Order – Moloko's Dagwood & Wings

Customer Name:
${data.name}

Phone:
${data.phone}

Order:
${orderLines}

Collection Time:
${data.time}

Special Instructions:
${data.instructions || 'None'}

TOTAL:
R${getTotal()}`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, '_blank');
  closeModal();
});

// ===== CART DRAWER =====
document.getElementById('cartBtn').addEventListener('click', () => {
  cartDrawer.classList.add('open');
  overlay.classList.add('open');
});
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
document.getElementById('goToCheckout').addEventListener('click', () => {
  closeDrawer();
});

function closeDrawer() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('open');
}

// ===== MOBILE NAV =====
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== INIT =====
renderMenu();
updateCartUI();

// Make functions global for inline onclick
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
