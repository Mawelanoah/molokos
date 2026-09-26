/* ===== MENU DATA — from poster only ===== */
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

/* ===== OPENING HOURS (easy to edit) =====
   Format: day 0=Sun … 6=Sat
   open/close as "HH:MM" 24h
   null = closed that day
*/
const OPENING_HOURS = {
  0: { open: '07:00', close: '18:00' }, // Sunday
  1: { open: '07:00', close: '18:00' }, // Monday
  2: { open: '07:00', close: '18:00' }, // Tuesday
  3: { open: '07:00', close: '18:00' }, // Wednesday
  4: { open: '07:00', close: '18:00' }, // Thursday
  5: { open: '07:00', close: '18:00' }, // Friday
  6: { open: '07:00', close: '18:00' }  // Saturday
};

const WHATSAPP_NUMBER = '27816531070'; // 081 653 1070 from poster

/* ===== STATE ===== */
let cart = [];
let orderData = null;

/* ===== DOM ===== */
const dagwoodList = document.getElementById('dagwoodList');
const wingsList = document.getElementById('wingsList');
const cartBar = document.getElementById('cartBar');
const cartBarCount = document.getElementById('cartBarCount');
const cartBarTotal = document.getElementById('cartBarTotal');
const cartBarBtn = document.getElementById('cartBarBtn');
const drawer = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerBody = document.getElementById('drawerBody');
const drawerFoot = document.getElementById('drawerFoot');
const drawerTotal = document.getElementById('drawerTotal');
const drawerClose = document.getElementById('drawerClose');
const continueBtn = document.getElementById('continueBtn');
const detailsScreen = document.getElementById('detailsScreen');
const reviewScreen = document.getElementById('reviewScreen');
const detailsForm = document.getElementById('detailsForm');
const reviewBox = document.getElementById('reviewBox');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

/* ===== OPEN / CLOSED STATUS ===== */
function parseTime(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

function updateOpenStatus() {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const hours = OPENING_HOURS[day];

  if (!hours || !hours.open || !hours.close) {
    statusDot.className = 'status-dot closed';
    statusText.textContent = 'CLOSED';
    return;
  }

  const openM = parseTime(hours.open);
  const closeM = parseTime(hours.close);

  if (mins >= openM && mins < closeM) {
    statusDot.className = 'status-dot open';
    statusText.textContent = 'OPEN NOW · Closes ' + hours.close;
  } else {
    statusDot.className = 'status-dot closed';
    statusText.textContent = 'CLOSED · Opens ' + hours.open;
  }
}

/* ===== RENDER MENU ===== */
function renderMenu() {
  const dag = menuItems.filter(i => i.category === 'dagwood');
  const win = menuItems.filter(i => i.category === 'wings');

  dagwoodList.innerHTML = dag.map(cardHTML).join('');
  wingsList.innerHTML = win.map(cardHTML).join('');

  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
}

function cardHTML(item) {
  return `
    <article class="menu-card">
      <img class="menu-card-img" src="${item.image}" alt="${item.name}" loading="lazy" width="90" height="90">
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="menu-card-row">
          <span class="price">R${item.price}</span>
          <button class="btn-add" data-id="${item.id}" type="button">ADD</button>
        </div>
      </div>
    </article>
  `;
}

/* ===== CART ===== */
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function getTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function getCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartUI() {
  const total = getTotal();
  const count = getCount();

  // Floating bar
  if (count > 0) {
    cartBar.hidden = false;
    cartBarCount.textContent = count + (count === 1 ? ' ITEM' : ' ITEMS');
    cartBarTotal.textContent = 'R' + total;
  } else {
    cartBar.hidden = true;
  }

  // Drawer body
  if (cart.length === 0) {
    drawerBody.innerHTML = '<p class="empty-msg">Your cart is empty</p>';
    drawerFoot.hidden = true;
  } else {
    drawerBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="item-price">R${item.price} each</span>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" type="button" data-action="minus" data-id="${item.id}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" type="button" data-action="plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-btn" type="button" data-action="remove" data-id="${item.id}" aria-label="Remove">×</button>
      </div>
    `).join('');
    drawerFoot.hidden = false;
    drawerTotal.textContent = 'R' + total;
  }
}

/* Event delegation for qty buttons */
drawerBody.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if (action === 'plus') changeQty(id, 1);
  else if (action === 'minus') changeQty(id, -1);
  else if (action === 'remove') removeItem(id);
});

/* ===== DRAWER OPEN / CLOSE ===== */
function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

cartBarBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

/* ===== CONTINUE TO DETAILS ===== */
continueBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  closeDrawer();
  detailsScreen.hidden = false;
  document.body.style.overflow = 'hidden';
});

document.getElementById('detailsBack').addEventListener('click', () => {
  detailsScreen.hidden = true;
  document.body.style.overflow = '';
  openDrawer();
});

/* ===== DETAILS FORM → REVIEW ===== */
detailsForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const time = document.getElementById('custTime').value.trim();
  const notes = document.getElementById('custNotes').value.trim();

  if (!name || !phone || !time) return;

  orderData = { name, phone, time, notes };

  let itemsHtml = cart.map(i =>
    `<p>${i.name} × ${i.qty} — R${i.price * i.qty}</p>`
  ).join('');

  reviewBox.innerHTML = `
    <p><strong>Customer:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Collection Time:</strong> ${time}</p>
    ${notes ? `<p><strong>Instructions:</strong> ${notes}</p>` : ''}
    <hr class="divider">
    ${itemsHtml}
    <p class="total-line">TOTAL: R${getTotal()}</p>
  `;

  detailsScreen.hidden = true;
  reviewScreen.hidden = false;
});

document.getElementById('reviewBack').addEventListener('click', () => {
  reviewScreen.hidden = true;
  detailsScreen.hidden = false;
});

document.getElementById('editOrderBtn').addEventListener('click', () => {
  reviewScreen.hidden = true;
  detailsScreen.hidden = true;
  document.body.style.overflow = '';
  openDrawer();
});

/* ===== CONFIRM → WHATSAPP ===== */
document.getElementById('confirmWaBtn').addEventListener('click', () => {
  if (!orderData || cart.length === 0) return;

  const lines = cart.map(i => `${i.name} × ${i.qty}`).join('\n');
  const msg =
`NEW ORDER — MOLOKO'S DAGWOOD & WINGS

Customer:
${orderData.name}

Phone:
${orderData.phone}

Order:
${lines}

Collection Time:
${orderData.time}

Special Instructions:
${orderData.notes || 'None'}

TOTAL:
R${getTotal()}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  // Optional: clear after send
  // cart = [];
  // updateCartUI();
  reviewScreen.hidden = true;
  document.body.style.overflow = '';
});

/* ===== INIT ===== */
renderMenu();
updateCartUI();
updateOpenStatus();
setInterval(updateOpenStatus, 60000); // refresh every minute
