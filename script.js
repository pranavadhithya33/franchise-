/* ==========================================================================
   GUS ENTERPRISE PORTAL ENGINE (B2B & B2C DUAL SYSTEM)
   ========================================================================== */

const INITIAL_FRANCHISES = [
  { id: 'FRAN-SIVAGANGAI', name: 'Vinoth (Master Partner)', location: 'Sivagangai', pin: '9842', type: 'Master' },
  { id: 'FRAN-CHENNAI', name: 'Rajesh Kumar', location: 'Chennai Central', pin: '1234', type: 'Micro' },
  { id: 'FRAN-MADURAI', name: 'Karthik Raja', location: 'Madurai West', pin: '2345', type: 'Micro' },
  { id: 'FRAN-COIMBATORE', name: 'Anitha Ramesh', location: 'Coimbatore RS Puram', pin: '3456', type: 'Micro' },
  { id: 'FRAN-SALEM', name: 'Selvam Subramanian', location: 'Salem Junction', pin: '4567', type: 'Micro' },
  { id: 'FRAN-TRICHY', name: 'Manikandan P', location: 'Trichy Cantt', pin: '5678', type: 'Micro' }
];

const INITIAL_ORDERS = [
  { id: 'ORD-1001', franchiseId: 'FRAN-SIVAGANGAI', customer: 'Saul Goodman', item: 'iPhone 15 Pro Max 256GB', amount: 125000, status: 'Finished' },
  { id: 'ORD-1002', franchiseId: 'FRAN-SIVAGANGAI', customer: 'Gustavo Fring', item: 'Samsung Galaxy S24 Ultra', amount: 110000, status: 'Finished' },
  { id: 'ORD-1003', franchiseId: 'FRAN-CHENNAI', customer: 'Walter White', item: 'MacBook Pro 14 M3', amount: 165000, status: 'Finished' },
  { id: 'ORD-1004', franchiseId: 'FRAN-MADURAI', customer: 'Jesse Pinkman', item: 'iPad Pro 12.9 M2', amount: 95000, status: 'Finished' },
  { id: 'ORD-1005', franchiseId: 'FRAN-COIMBATORE', customer: 'Mike Ehrmantraut', item: 'OnePlus 12 512GB', amount: 65000, status: 'Processing' },
  { id: 'ORD-1006', franchiseId: 'FRAN-SALEM', customer: 'Hank Schrader', item: 'Sony WH-1000XM5', amount: 28000, status: 'Pending' }
];

const INITIAL_B2C_ORDERS = [
  { id: 'B2C-9001', customerName: 'Ramesh Kumar', phone: '9876543210', item: 'iPhone 15 128GB (Blue)', amount: 64900, status: 'Delivered', tracking: 'TRK-GUS-8801', date: '2026-08-20' },
  { id: 'B2C-9002', customerName: 'Priya Sharma', phone: '9876543210', item: 'AirPods Pro 2nd Gen', amount: 22900, status: 'Dispatched', tracking: 'TRK-GUS-8802', date: '2026-08-22' },
  { id: 'B2C-9003', customerName: 'Arun Prakash', phone: '9123456789', item: 'Samsung Galaxy Watch 6', amount: 28900, status: 'Processing', tracking: 'TRK-GUS-8803', date: '2026-08-23' }
];

let appState = {
  franchises: JSON.parse(localStorage.getItem('bb_franchises')) || INITIAL_FRANCHISES,
  orders: JSON.parse(localStorage.getItem('bb_orders')) || INITIAL_ORDERS,
  b2cOrders: JSON.parse(localStorage.getItem('gus_b2c_orders')) || INITIAL_B2C_ORDERS,
  currentUser: JSON.parse(localStorage.getItem('bb_current_user')) || null,
  activeAdminModule: 'b2b' // 'b2b' or 'b2c'
};

function saveState() {
  localStorage.setItem('bb_franchises', JSON.stringify(appState.franchises));
  localStorage.setItem('bb_orders', JSON.stringify(appState.orders));
  localStorage.setItem('gus_b2c_orders', JSON.stringify(appState.b2cOrders));
  localStorage.setItem('bb_current_user', JSON.stringify(appState.currentUser));
}

window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="bb-periodic-badge" style="width: 26px; height: 26px; font-size: 0.55rem;"><span class="sym">GUS</span></span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};

// Client-side Router
window.navigateRoute = function(path, event) {
  if (event) event.preventDefault();
  window.history.pushState({}, '', path);
  renderCurrentRoute();
};

window.addEventListener('popstate', () => {
  renderCurrentRoute();
});

document.addEventListener('DOMContentLoaded', async () => {
  initForms();
  if (window.dbHelper) {
    appState.franchises = await window.dbHelper.fetchFranchises(appState.franchises);
    appState.orders = await window.dbHelper.fetchOrders(appState.orders);
  }
  renderCurrentRoute();
});

/* ==========================================================================
   ROUTE RENDERER & ROLE PROTECTION
   ========================================================================== */

function renderCurrentRoute() {
  const path = window.location.pathname.toLowerCase();
  updateNavbarState(path);

  if (path === '/admin') {
    if (appState.currentUser && appState.currentUser.role === 'Admin') {
      showSection('route-admin');
    } else {
      window.history.replaceState({}, '', '/admin-login');
      showSection('route-admin-login');
    }
  } else if (path === '/admin-login') {
    showSection('route-admin-login');
  } else if (path === '/dashboard' || path === '/b2b-dashboard') {
    if (appState.currentUser && appState.currentUser.role === 'Franchise') {
      showSection('route-dashboard');
    } else {
      window.history.replaceState({}, '', '/login');
      showSection('route-login');
    }
  } else if (path === '/b2c-portal') {
    if (appState.currentUser && appState.currentUser.role === 'B2C') {
      showSection('route-b2c-portal');
    } else {
      window.history.replaceState({}, '', '/login');
      showSection('route-login');
    }
  } else if (path === '/leaderboard') {
    showSection('route-leaderboard');
  } else if (path === '/directory') {
    showSection('route-directory');
  } else {
    // Default Home Page -> B2B & B2C Dual Login
    showSection('route-login');
  }

  renderAllViews();
}

function showSection(sectionId) {
  document.querySelectorAll('.tab-pane').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
}

function updateNavbarState(currentPath) {
  const navMenu = document.getElementById('main-nav-menu');
  const userPill = document.getElementById('user-status-text');
  const logoutBtn = document.getElementById('btn-logout');

  if (!appState.currentUser) {
    navMenu.style.display = 'none';
    logoutBtn.style.display = 'none';
    userPill.textContent = '🔒 Logged Out';
    userPill.style.color = 'var(--text-muted)';
  } else if (appState.currentUser.role === 'Franchise') {
    navMenu.style.display = 'flex';
    logoutBtn.style.display = 'block';
    userPill.textContent = `🏬 B2B: ${appState.currentUser.name} (${appState.currentUser.id})`;
    userPill.style.color = 'var(--emerald-green)';

    navMenu.innerHTML = `
      <li><a href="/b2b-dashboard" class="nav-link ${currentPath === '/b2b-dashboard' || currentPath === '/dashboard' ? 'active' : ''}" onclick="navigateRoute('/b2b-dashboard', event)">📊 B2B Dashboard</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Empire Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Network Directory</a></li>
    `;
  } else if (appState.currentUser.role === 'B2C') {
    navMenu.style.display = 'flex';
    logoutBtn.style.display = 'block';
    userPill.textContent = `🛍️ B2C Customer: ${appState.currentUser.phone}`;
    userPill.style.color = 'var(--gold-accent)';

    navMenu.innerHTML = `
      <li><a href="/b2c-portal" class="nav-link ${currentPath === '/b2c-portal' ? 'active' : ''}" onclick="navigateRoute('/b2c-portal', event)">🛍️ My Retail Orders</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Store Directory</a></li>
    `;
  } else if (appState.currentUser.role === 'Admin') {
    navMenu.style.display = 'flex';
    logoutBtn.style.display = 'block';
    userPill.textContent = `👑 Executive Admin (${appState.currentUser.id})`;
    userPill.style.color = 'var(--crystal-cyan)';

    navMenu.innerHTML = `
      <li><a href="/admin" class="nav-link ${currentPath === '/admin' ? 'active' : ''}" onclick="navigateRoute('/admin', event)">🛡️ Executive Admin Hub</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Empire Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Network Directory</a></li>
    `;
  }
}

/* ==========================================================================
   HOMEPAGE DUAL TAB SWITCHER (B2B vs B2C)
   ========================================================================== */

window.switchHomeLoginTab = function(mode) {
  const tabB2B = document.getElementById('tab-btn-b2b');
  const tabB2C = document.getElementById('tab-btn-b2c');
  const cardB2B = document.getElementById('card-login-b2b');
  const cardB2C = document.getElementById('card-login-b2c');

  if (mode === 'b2b') {
    tabB2B.className = 'portal-tab-btn active-b2b';
    tabB2C.className = 'portal-tab-btn';
    cardB2B.style.display = 'block';
    cardB2C.style.display = 'none';
  } else {
    tabB2B.className = 'portal-tab-btn';
    tabB2C.className = 'portal-tab-btn active-b2c';
    cardB2B.style.display = 'none';
    cardB2C.style.display = 'block';
  }
};

/* ==========================================================================
   ADMIN DUAL MODULE SWITCHER (B2B Module vs B2C Module)
   ========================================================================== */

window.switchAdminModule = function(module) {
  appState.activeAdminModule = module;
  const btnB2B = document.getElementById('admin-tab-b2b');
  const btnB2C = document.getElementById('admin-tab-b2c');
  const modB2B = document.getElementById('admin-module-b2b');
  const modB2C = document.getElementById('admin-module-b2c');

  if (module === 'b2b') {
    btnB2B.className = 'admin-module-btn active-b2b';
    btnB2C.className = 'admin-module-btn';
    modB2B.style.display = 'block';
    modB2C.style.display = 'none';
  } else {
    btnB2B.className = 'admin-module-btn';
    btnB2C.className = 'admin-module-btn active-b2c';
    modB2B.style.display = 'none';
    modB2C.style.display = 'block';
  }
};

/* ==========================================================================
   AUTHENTICATION & FORMS
   ========================================================================== */

function initForms() {
  // B2B Franchise Owner Login Form
  const formFranchise = document.getElementById('form-login-franchise');
  if (formFranchise) {
    formFranchise.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('login-franchise-id').value.trim().toUpperCase();
      const pin = document.getElementById('login-pin').value.trim();

      const match = appState.franchises.find(f => f.id === id && f.pin === pin);
      if (match) {
        appState.currentUser = { ...match, role: 'Franchise' };
        saveState();
        showToast(`B2B Authenticated: Welcome back, ${match.name}!`);
        navigateRoute('/b2b-dashboard');
      } else {
        alert('❌ Invalid B2B Franchise ID or PIN!');
      }
    });
  }

  // B2C Customer Retail Login Form
  const formB2C = document.getElementById('form-login-b2c');
  if (formB2C) {
    formB2C.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('login-b2c-phone').value.trim();
      const orderId = document.getElementById('login-b2c-order').value.trim().toUpperCase();

      appState.currentUser = { role: 'B2C', phone, orderId };
      saveState();
      showToast(`B2C Consumer Portal Unlocked for ${phone}`);
      navigateRoute('/b2c-portal');
    });
  }

  // Executive Admin Login Form
  const formAdmin = document.getElementById('form-login-admin');
  if (formAdmin) {
    formAdmin.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = document.getElementById('login-admin-pin').value.trim();

      if (pin === '7777') {
        appState.currentUser = { id: 'ADMIN-01', name: 'Gustavo Fring (Executive Admin)', role: 'Admin' };
        saveState();
        showToast('Authenticated as Master Executive Admin');
        navigateRoute('/admin');
      } else {
        alert('❌ Invalid Admin PIN! (Demo PIN: 7777)');
      }
    });
  }

  // Form: Add New Franchise (Admin B2B)
  const formAddFranchise = document.getElementById('form-admin-add-franchise');
  if (formAddFranchise) {
    formAddFranchise.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('input-franchise-id').value.trim().toUpperCase();
      const name = document.getElementById('input-franchise-name').value.trim();
      const location = document.getElementById('input-franchise-location').value.trim();
      const pin = document.getElementById('input-franchise-pin').value.trim();
      const type = document.getElementById('select-franchise-type').value;

      if (appState.franchises.some(f => f.id === id)) {
        alert(`❌ Franchise ID ${id} already exists!`);
        return;
      }

      const newFranchise = { id, name, location, pin, type };
      appState.franchises.push(newFranchise);
      saveState();

      if (window.dbHelper) {
        await window.dbHelper.createFranchise(newFranchise);
      }

      showToast(`B2B Franchise ${id} created!`);
      formAddFranchise.reset();
      renderAllViews();
    });
  }

  // Form: Add Wholesale Order (Admin B2B)
  const formAddOrder = document.getElementById('form-admin-add-order');
  if (formAddOrder) {
    formAddOrder.addEventListener('submit', async (e) => {
      e.preventDefault();
      const franchiseId = document.getElementById('select-admin-franchise').value;
      const customer = document.getElementById('input-customer').value.trim();
      const item = document.getElementById('input-item').value.trim();
      const amount = Number(document.getElementById('input-amount').value);
      const status = document.getElementById('select-status').value;

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        franchiseId,
        customer,
        item,
        amount,
        status
      };

      appState.orders.push(newOrder);
      saveState();

      if (window.dbHelper) {
        await window.dbHelper.createOrder(newOrder);
      }

      showToast(`Wholesale Order ${newOrder.id} assigned to ${franchiseId}`);
      formAddOrder.reset();
      renderAllViews();
    });
  }

  // Form: Add Direct B2C Retail Order (Admin B2C)
  const formAddB2COrder = document.getElementById('form-admin-add-b2c-order');
  if (formAddB2COrder) {
    formAddB2COrder.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('input-b2c-name').value.trim();
      const phone = document.getElementById('input-b2c-phone').value.trim();
      const item = document.getElementById('input-b2c-item').value.trim();
      const amount = Number(document.getElementById('input-b2c-amount').value);
      const status = document.getElementById('select-b2c-status').value;

      const newB2COrder = {
        id: `B2C-${Math.floor(9000 + Math.random() * 1000)}`,
        customerName,
        phone,
        item,
        amount,
        status,
        tracking: `TRK-GUS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0]
      };

      appState.b2cOrders.push(newB2COrder);
      saveState();
      showToast(`B2C Retail Order ${newB2COrder.id} created for ${customerName}`);
      formAddB2COrder.reset();
      renderAllViews();
    });
  }
}

window.logoutUser = function() {
  appState.currentUser = null;
  saveState();
  showToast('Logged out successfully');
  navigateRoute('/login');
};

/* ==========================================================================
   RENDER VIEWS DATA
   ========================================================================== */

function renderAllViews() {
  renderDashboard();
  renderB2CPortal();
  renderLeaderboard();
  renderAdminHub();
  renderDirectory();
}

function renderDashboard() {
  if (!appState.currentUser || appState.currentUser.role !== 'Franchise') return;

  const myOrders = appState.orders.filter(o => o.franchiseId === appState.currentUser.id);
  const finishedOrders = myOrders.filter(o => o.status === 'Finished');
  const totalRevenue = finishedOrders.reduce((sum, o) => sum + Number(o.amount), 0);

  document.getElementById('dash-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('dash-finished-count').textContent = finishedOrders.length;

  const leaderboard = calculateLeaderboard();
  const rankIndex = leaderboard.findIndex(item => item.id === appState.currentUser.id);
  document.getElementById('dash-rank').textContent = rankIndex !== -1 ? `#${rankIndex + 1}` : '#--';

  const tbody = document.getElementById('tbl-my-orders');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (myOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No assigned B2B wholesale orders found.</td></tr>`;
    return;
  }

  myOrders.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    const statusClass = `status-${ord.status.toLowerCase()}`;

    tr.innerHTML = `
      <td style="padding: 12px; font-family: var(--font-mono); color: var(--emerald-green); font-weight: 700;">${ord.id}</td>
      <td style="padding: 12px; font-weight: 600;">${ord.customer}</td>
      <td style="padding: 12px;">${ord.item}</td>
      <td style="padding: 12px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 12px;"><span class="status-pill ${statusClass}">${ord.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderB2CPortal() {
  if (!appState.currentUser || appState.currentUser.role !== 'B2C') return;

  const container = document.getElementById('b2c-orders-container');
  if (!container) return;
  container.innerHTML = '';

  const userPhone = appState.currentUser.phone;
  const userOrder = appState.currentUser.orderId;

  const filtered = appState.b2cOrders.filter(o => 
    (userPhone && o.phone === userPhone) || 
    (userOrder && o.id === userOrder)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <h3>No retail orders found for phone number ${userPhone || userOrder}</h3>
        <p>Showing sample B2C store order for demonstration:</p>
      </div>
    `;
    // Show sample B2C order if none match
    filtered.push(appState.b2cOrders[0]);
  }

  filtered.forEach(ord => {
    const statusClass = ord.status === 'Delivered' ? 'status-finished' : (ord.status === 'Dispatched' ? 'status-processing' : 'status-pending');
    const div = document.createElement('div');
    div.className = 'glass-card';
    div.style.marginBottom = '16px';
    div.style.borderColor = 'var(--gold-accent)';

    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <div>
          <span style="font-family: var(--font-mono); color: var(--gold-accent); font-weight: 800; font-size: 1.2rem;">${ord.id}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 10px;">📅 Date: ${ord.date}</span>
        </div>
        <span class="status-pill ${statusClass}">${ord.status}</span>
      </div>

      <div style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">📱 Product: ${ord.item}</div>
      <div style="font-family: var(--font-mono); font-size: 1.4rem; color: var(--crystal-cyan); font-weight: 800; margin-bottom: 12px;">Total Paid: ₹${Number(ord.amount).toLocaleString('en-IN')}</div>
      <div style="background: rgba(8,10,14,0.8); padding: 10px 14px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);">
        🚚 GUS Logistics Tracking No: <strong style="color: var(--emerald-green);">${ord.tracking}</strong>
      </div>
    `;

    container.appendChild(div);
  });
}

function calculateLeaderboard() {
  return appState.franchises.map(franchise => {
    const finishedOrders = appState.orders.filter(o => o.franchiseId === franchise.id && o.status === 'Finished');
    const revenue = finishedOrders.reduce((sum, o) => sum + Number(o.amount), 0);
    return {
      ...franchise,
      revenue,
      completedOrderCount: finishedOrders.length
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  const sorted = calculateLeaderboard();

  container.innerHTML = '';

  sorted.forEach((item, index) => {
    const rankNum = index + 1;
    const rankClass = rankNum === 1 ? 'rank-1' : '';

    const div = document.createElement('div');
    div.className = `leaderboard-row ${rankClass}`;

    div.innerHTML = `
      <div class="rank-badge">${rankNum}</div>
      <div style="flex-grow: 1;">
        <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${item.name} ${rankNum === 1 ? '👑 [Top B2B Partner]' : ''}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">📍 ${item.location} • ID: ${item.id}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.3rem; color: var(--crystal-cyan);">₹${item.revenue.toLocaleString('en-IN')}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${item.completedOrderCount} Wholesale Finished</div>
      </div>
    `;

    container.appendChild(div);
  });
}

function renderAdminHub() {
  if (!appState.currentUser || appState.currentUser.role !== 'Admin') return;

  const selectFranchise = document.getElementById('select-admin-franchise');
  if (selectFranchise) {
    selectFranchise.innerHTML = '';
    appState.franchises.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.name} (${f.location})`;
      selectFranchise.appendChild(opt);
    });
  }

  renderAdminFranchiseRoster();
  filterAdminOrders();
  renderAdminB2COrders();
}

function renderAdminFranchiseRoster() {
  const tbody = document.getElementById('tbl-admin-franchises');
  if (!tbody) return;

  tbody.innerHTML = '';

  appState.franchises.forEach(f => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';

    tr.innerHTML = `
      <td style="padding: 8px; font-family: var(--font-mono); color: var(--emerald-green); font-weight: 700;">${f.id}</td>
      <td style="padding: 8px; font-weight: 600;">${f.name}</td>
      <td style="padding: 8px; font-size: 0.85rem; color: var(--text-muted);">${f.location}</td>
      <td style="padding: 8px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">${f.pin}</td>
    `;

    tbody.appendChild(tr);
  });
}

window.filterAdminOrders = function() {
  const query = (document.getElementById('search-admin-orders')?.value || '').toLowerCase();
  const tbodyAdmin = document.getElementById('tbl-admin-orders');
  if (!tbodyAdmin) return;

  tbodyAdmin.innerHTML = '';

  const filtered = appState.orders.filter(o => 
    o.id.toLowerCase().includes(query) ||
    o.customer.toLowerCase().includes(query) ||
    o.item.toLowerCase().includes(query)
  );

  filtered.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    const owner = appState.franchises.find(f => f.id === ord.franchiseId);

    tr.innerHTML = `
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--emerald-green); font-weight: 700;">${ord.id}</td>
      <td style="padding: 10px; font-size: 0.85rem;">${owner ? owner.name : ord.franchiseId}</td>
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 10px;">
        <select onchange="updateOrderStatus('${ord.id}', this.value)" style="background: var(--bg-dark); color: var(--text-primary); border: 1.5px solid var(--smoke-border); border-radius: 4px; padding: 6px; font-size: 0.82rem; font-family: var(--font-mono);">
          <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending ⏳</option>
          <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing ⚙️</option>
          <option value="Finished" ${ord.status === 'Finished' ? 'selected' : ''}>Finished ✅</option>
        </select>
      </td>
    `;

    tbodyAdmin.appendChild(tr);
  });
};

function renderAdminB2COrders() {
  const tbodyB2C = document.getElementById('tbl-admin-b2c-orders');
  if (!tbodyB2C) return;
  tbodyB2C.innerHTML = '';

  appState.b2cOrders.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';

    tr.innerHTML = `
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--gold-accent); font-weight: 700;">${ord.id}</td>
      <td style="padding: 10px;">
        <div style="font-weight: 600;">${ord.customerName}</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono);">📞 ${ord.phone}</div>
      </td>
      <td style="padding: 10px; font-size: 0.85rem;">${ord.item}</td>
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 10px;">
        <select onchange="updateB2COrderStatus('${ord.id}', this.value)" style="background: var(--bg-dark); color: var(--text-primary); border: 1.5px solid var(--gold-accent); border-radius: 4px; padding: 6px; font-size: 0.82rem; font-family: var(--font-mono);">
          <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing ⚙️</option>
          <option value="Dispatched" ${ord.status === 'Dispatched' ? 'selected' : ''}>Dispatched 🚚</option>
          <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered ✅</option>
        </select>
      </td>
    `;

    tbodyB2C.appendChild(tr);
  });
}

window.updateOrderStatus = async function(orderId, newStatus) {
  const ord = appState.orders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveState();

    if (window.dbHelper) {
      await window.dbHelper.updateOrderStatus(orderId, newStatus);
    }

    showToast(`B2B Order ${orderId} updated to ${newStatus}`);
    renderAllViews();
  }
};

window.updateB2COrderStatus = function(orderId, newStatus) {
  const ord = appState.b2cOrders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveState();
    showToast(`B2C Order ${orderId} status updated to ${newStatus}`);
    renderAllViews();
  }
};

function renderDirectory() {
  const container = document.getElementById('grid-directory');
  if (!container) return;
  container.innerHTML = '';

  appState.franchises.forEach(f => {
    const card = document.createElement('div');
    card.className = 'glass-card';

    card.innerHTML = `
      <div class="card-title" style="margin-bottom: 8px;">
        <span class="bb-periodic-badge"><span class="num">11</span><span class="sym">Na</span><span class="mass">22.989</span></span>
        <span>${f.location}</span>
      </div>
      <div style="font-weight: 700; color: var(--emerald-green); font-size: 1.15rem; margin-bottom: 6px;">${f.name}</div>
      <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">ID: ${f.id} • PIN: ${f.pin}</div>
      <div style="margin-top: 16px;">
        <span class="status-pill status-finished">${f.type} Partner</span>
      </div>
    `;

    container.appendChild(card);
  });
}
