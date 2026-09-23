/* ==========================================================================
   GUS ENTERPRISE DUAL FRANCHISE NETWORK ENGINE (B2B & B2C FRANCHISE OWNERS)
   ========================================================================== */

// Initial B2B Wholesale Franchise Partners
const INITIAL_B2B_FRANCHISES = [
  { id: 'FRAN-SIVAGANGAI', name: 'Vinoth (B2B Master Partner)', location: 'Sivagangai Wholesale Hub', pin: '9842', type: 'Master' },
  { id: 'FRAN-CHENNAI', name: 'Rajesh Kumar', location: 'Chennai Central Wholesale', pin: '1234', type: 'Micro' },
  { id: 'FRAN-MADURAI', name: 'Karthik Raja', location: 'Madurai West Hub', pin: '2345', type: 'Micro' },
  { id: 'FRAN-COIMBATORE', name: 'Anitha Ramesh', location: 'Coimbatore RS Puram Hub', pin: '3456', type: 'Micro' },
  { id: 'FRAN-SALEM', name: 'Selvam Subramanian', location: 'Salem Junction Hub', pin: '4567', type: 'Micro' },
  { id: 'FRAN-TRICHY', name: 'Manikandan P', location: 'Trichy Cantt Hub', pin: '5678', type: 'Micro' }
];

// Initial B2B Wholesale Orders
const INITIAL_B2B_ORDERS = [
  { id: 'ORD-1001', franchiseId: 'FRAN-SIVAGANGAI', customer: 'Saul Goodman', item: 'iPhone 15 Pro Max 256GB (5x Bulk)', amount: 625000, status: 'Finished' },
  { id: 'ORD-1002', franchiseId: 'FRAN-SIVAGANGAI', customer: 'Gustavo Fring', item: 'Samsung Galaxy S24 Ultra (3x Bulk)', amount: 330000, status: 'Finished' },
  { id: 'ORD-1003', franchiseId: 'FRAN-CHENNAI', customer: 'Walter White', item: 'MacBook Pro 14 M3 (2x Bulk)', amount: 330000, status: 'Finished' },
  { id: 'ORD-1004', franchiseId: 'FRAN-MADURAI', customer: 'Jesse Pinkman', item: 'iPad Pro 12.9 M2 (4x Bulk)', amount: 380000, status: 'Finished' },
  { id: 'ORD-1005', franchiseId: 'FRAN-COIMBATORE', customer: 'Mike Ehrmantraut', item: 'OnePlus 12 512GB (3x Bulk)', amount: 195000, status: 'Processing' },
  { id: 'ORD-1006', franchiseId: 'FRAN-SALEM', customer: 'Hank Schrader', item: 'Sony WH-1000XM5 (5x Bulk)', amount: 140000, status: 'Pending' }
];

// Initial B2C Retail Store Franchise Partners
const INITIAL_B2C_FRANCHISES = [
  { id: 'RETAIL-TRICHY', name: 'Senthil Nathan (B2C Retail Owner)', location: 'Trichy Main Road Outlet', pin: '8811', type: 'Retail Store' },
  { id: 'RETAIL-MADURAI', name: 'Meenakshi Sundaram', location: 'Madurai Temple View Outlet', pin: '7722', type: 'Retail Store' },
  { id: 'RETAIL-CHENNAI', name: 'Praveen V', location: 'Chennai T.Nagar Outlet', pin: '6633', type: 'Retail Store' },
  { id: 'RETAIL-COIMBATORE', name: 'Deepa Lakshmi', location: 'Coimbatore Brookefields Outlet', pin: '5544', type: 'Retail Store' }
];

// Initial B2C Retail Store Orders
const INITIAL_B2C_ORDERS = [
  { id: 'B2C-9001', franchiseId: 'RETAIL-TRICHY', customer: 'Ramesh Kumar (Retail)', item: 'iPhone 15 128GB (Blue)', amount: 64900, status: 'Finished' },
  { id: 'B2C-9002', franchiseId: 'RETAIL-TRICHY', customer: 'Priya Sharma (Retail)', item: 'AirPods Pro 2nd Gen', amount: 22900, status: 'Finished' },
  { id: 'B2C-9003', franchiseId: 'RETAIL-MADURAI', customer: 'Arun Prakash (Retail)', item: 'Samsung Galaxy Watch 6', amount: 28900, status: 'Processing' },
  { id: 'B2C-9004', franchiseId: 'RETAIL-CHENNAI', customer: 'Kavitha M (Retail)', item: 'iPad Air 5th Gen', amount: 59900, status: 'Pending' }
];

let appState = {
  b2bFranchises: JSON.parse(localStorage.getItem('gus_b2b_franchises')) || INITIAL_B2B_FRANCHISES,
  b2bOrders: JSON.parse(localStorage.getItem('gus_b2b_orders')) || INITIAL_B2B_ORDERS,
  b2cFranchises: JSON.parse(localStorage.getItem('gus_b2c_franchises')) || INITIAL_B2C_FRANCHISES,
  b2cOrders: JSON.parse(localStorage.getItem('gus_b2c_orders')) || INITIAL_B2C_ORDERS,
  currentUser: JSON.parse(localStorage.getItem('gus_current_user')) || null,
  activeAdminModule: 'b2b', // 'b2b' or 'b2c'
  homeLeaderboardFilter: 'all' // 'all', 'b2b', or 'b2c'
};

function saveState() {
  localStorage.setItem('gus_b2b_franchises', JSON.stringify(appState.b2bFranchises));
  localStorage.setItem('gus_b2b_orders', JSON.stringify(appState.b2bOrders));
  localStorage.setItem('gus_b2c_franchises', JSON.stringify(appState.b2cFranchises));
  localStorage.setItem('gus_b2c_orders', JSON.stringify(appState.b2cOrders));
  localStorage.setItem('gus_current_user', JSON.stringify(appState.currentUser));
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

// CROSS-TAB REAL-TIME INSTANT SYNCHRONIZATION ENGINE
window.addEventListener('storage', (e) => {
  if (['gus_b2b_franchises', 'gus_b2b_orders', 'gus_b2c_franchises', 'gus_b2c_orders', 'bb_franchises', 'bb_orders'].includes(e.key)) {
    appState.b2bFranchises = JSON.parse(localStorage.getItem('gus_b2b_franchises')) || INITIAL_B2B_FRANCHISES;
    appState.b2bOrders = JSON.parse(localStorage.getItem('gus_b2b_orders')) || INITIAL_B2B_ORDERS;
    appState.b2cFranchises = JSON.parse(localStorage.getItem('gus_b2c_franchises')) || INITIAL_B2C_FRANCHISES;
    appState.b2cOrders = JSON.parse(localStorage.getItem('gus_b2c_orders')) || INITIAL_B2C_ORDERS;
    renderAllViews();
    showToast('⚡ Instant Sync: Data updated from another active tab!');
  }
});


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
    appState.b2bFranchises = await window.dbHelper.fetchB2BFranchises(appState.b2bFranchises);
    appState.b2bOrders = await window.dbHelper.fetchB2BOrders(appState.b2bOrders);
    appState.b2cFranchises = await window.dbHelper.fetchB2CFranchises(appState.b2cFranchises);
    appState.b2cOrders = await window.dbHelper.fetchB2COrders(appState.b2cOrders);
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
  } else if (path === '/b2b-dashboard' || path === '/dashboard') {
    if (appState.currentUser && appState.currentUser.role === 'B2B_Franchise') {
      showSection('route-b2b-dashboard');
    } else {
      window.history.replaceState({}, '', '/login');
      showSection('route-login');
    }
  } else if (path === '/b2c-dashboard') {
    if (appState.currentUser && appState.currentUser.role === 'B2C_Franchise') {
      showSection('route-b2c-dashboard');
    } else {
      window.history.replaceState({}, '', '/login');
      showSection('route-login');
    }
  } else if (path === '/login') {
    showSection('route-login');
  } else if (path === '/leaderboard') {
    showSection('route-leaderboard');
  } else if (path === '/directory') {
    showSection('route-directory');
  } else {
    // Default Home Page -> Public Landing Home Page with Leaderboard & Contact
    showSection('route-home');
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
  const loginBtn = document.getElementById('btn-login-nav');
  const logoutBtn = document.getElementById('btn-logout');

  navMenu.style.display = 'flex';

  const isHomeActive = currentPath === '/' || currentPath === '/home';

  if (!appState.currentUser) {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
    userPill.textContent = '🔒 Logged Out';
    userPill.style.color = 'var(--text-muted)';

    navMenu.innerHTML = `
      <li><a href="/" class="nav-link ${isHomeActive ? 'active' : ''}" onclick="navigateRoute('/', event)">🏠 Home</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Directory</a></li>
    `;
  } else if (appState.currentUser.role === 'B2B_Franchise') {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    userPill.textContent = `🏢 B2B: ${appState.currentUser.name} (${appState.currentUser.id})`;
    userPill.style.color = 'var(--emerald-green)';

    navMenu.innerHTML = `
      <li><a href="/" class="nav-link ${isHomeActive ? 'active' : ''}" onclick="navigateRoute('/', event)">🏠 Home</a></li>
      <li><a href="/b2b-dashboard" class="nav-link ${currentPath === '/b2b-dashboard' || currentPath === '/dashboard' ? 'active' : ''}" onclick="navigateRoute('/b2b-dashboard', event)">📊 B2B Dashboard</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Empire Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Directory</a></li>
    `;
  } else if (appState.currentUser.role === 'B2C_Franchise') {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    userPill.textContent = `🏪 B2C: ${appState.currentUser.name} (${appState.currentUser.id})`;
    userPill.style.color = 'var(--gold-accent)';

    navMenu.innerHTML = `
      <li><a href="/" class="nav-link ${isHomeActive ? 'active' : ''}" onclick="navigateRoute('/', event)">🏠 Home</a></li>
      <li><a href="/b2c-dashboard" class="nav-link ${currentPath === '/b2c-dashboard' ? 'active' : ''}" onclick="navigateRoute('/b2c-dashboard', event)">🏪 B2C Dashboard</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Empire Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Directory</a></li>
    `;
  } else if (appState.currentUser.role === 'Admin') {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    userPill.textContent = `👑 Admin (${appState.currentUser.id})`;
    userPill.style.color = 'var(--crystal-cyan)';

    navMenu.innerHTML = `
      <li><a href="/" class="nav-link ${isHomeActive ? 'active' : ''}" onclick="navigateRoute('/', event)">🏠 Home</a></li>
      <li><a href="/admin" class="nav-link ${currentPath === '/admin' ? 'active' : ''}" onclick="navigateRoute('/admin', event)">🛡️ Admin Hub</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Empire Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Directory</a></li>
    `;
  }
}

/* ==========================================================================
   HOMEPAGE DUAL TAB SWITCHER (B2B Franchise vs B2C Franchise)
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
   ADMIN DUAL MODULE SWITCHER (B2B Operations vs B2C Operations)
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
  // B2B Wholesale Franchise Owner Login Form
  const formB2B = document.getElementById('form-login-b2b');
  if (formB2B) {
    formB2B.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('login-b2b-id').value.trim().toUpperCase();
      const pin = document.getElementById('login-b2b-pin').value.trim();

      const match = appState.b2bFranchises.find(f => f.id === id && f.pin === pin);
      if (match) {
        appState.currentUser = { ...match, role: 'B2B_Franchise' };
        saveState();
        showToast(`B2B Authenticated: Welcome, ${match.name}!`);
        navigateRoute('/b2b-dashboard');
      } else {
        alert('❌ Invalid B2B Franchise ID or PIN!');
      }
    });
  }

  // B2C Retail Store Franchise Owner Login Form
  const formB2C = document.getElementById('form-login-b2c');
  if (formB2C) {
    formB2C.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('login-b2c-id').value.trim().toUpperCase();
      const pin = document.getElementById('login-b2c-pin').value.trim();

      const match = appState.b2cFranchises.find(f => f.id === id && f.pin === pin);
      if (match) {
        appState.currentUser = { ...match, role: 'B2C_Franchise' };
        saveState();
        showToast(`B2C Retail Authenticated: Welcome, ${match.name}!`);
        navigateRoute('/b2c-dashboard');
      } else {
        alert('❌ Invalid B2C Retail Franchise ID or PIN!');
      }
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
        showToast('Authenticated as Executive Admin');
        navigateRoute('/admin');
      } else {
        alert('❌ Invalid Admin PIN!');
      }
    });
  }

  // Form: Add New B2B Franchise (Admin B2B)
  const formAddB2BFranchise = document.getElementById('form-admin-add-b2b-franchise');
  if (formAddB2BFranchise) {
    formAddB2BFranchise.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('input-b2b-franchise-id').value.trim().toUpperCase();
      const name = document.getElementById('input-b2b-franchise-name').value.trim();
      const location = document.getElementById('input-b2b-franchise-location').value.trim();
      const pin = document.getElementById('input-b2b-franchise-pin').value.trim();
      const type = document.getElementById('select-b2b-franchise-type').value;

      if (appState.b2bFranchises.some(f => f.id === id)) {
        alert(`❌ B2B Franchise ID ${id} already exists!`);
        return;
      }

      const newFranchise = { id, name, location, pin, type };
      appState.b2bFranchises.push(newFranchise);
      saveState();
      if (window.dbHelper) window.dbHelper.createB2BFranchise(newFranchise);

      showToast(`B2B Franchise ${id} created!`);
      formAddB2BFranchise.reset();
      renderAllViews();
    });
  }

  // Form: Add New B2C Retail Franchise (Admin B2C)
  const formAddB2CFranchise = document.getElementById('form-admin-add-b2c-franchise');
  if (formAddB2CFranchise) {
    formAddB2CFranchise.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('input-b2c-franchise-id').value.trim().toUpperCase();
      const name = document.getElementById('input-b2c-franchise-name').value.trim();
      const location = document.getElementById('input-b2c-franchise-location').value.trim();
      const pin = document.getElementById('input-b2c-franchise-pin').value.trim();
      const type = document.getElementById('select-b2c-franchise-type').value;

      if (appState.b2cFranchises.some(f => f.id === id)) {
        alert(`❌ B2C Retail Franchise ID ${id} already exists!`);
        return;
      }

      const newFranchise = { id, name, location, pin, type };
      appState.b2cFranchises.push(newFranchise);
      saveState();
      if (window.dbHelper) window.dbHelper.createB2CFranchise(newFranchise);

      showToast(`B2C Retail Franchise ${id} created!`);
      formAddB2CFranchise.reset();
      renderAllViews();
    });
  }

  // Form: Assign B2B Wholesale Order (Admin B2B)
  const formAddB2BOrder = document.getElementById('form-admin-add-b2b-order');
  if (formAddB2BOrder) {
    formAddB2BOrder.addEventListener('submit', async (e) => {
      e.preventDefault();
      const franchiseId = document.getElementById('select-admin-b2b-franchise').value;
      const customer = document.getElementById('input-b2b-customer').value.trim();
      const item = document.getElementById('input-b2b-item').value.trim();
      const amount = Number(document.getElementById('input-b2b-amount').value);
      const status = document.getElementById('select-b2b-status').value;

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        franchiseId,
        customer,
        item,
        amount,
        status
      };

      appState.b2bOrders.push(newOrder);
      saveState();
      if (window.dbHelper) window.dbHelper.createB2BOrder(newOrder);

      showToast(`B2B Order ${newOrder.id} assigned to ${franchiseId}`);
      formAddB2BOrder.reset();
      renderAllViews();
    });
  }

  // Form: Assign B2C Retail Store Order (Admin B2C)
  const formAddB2COrder = document.getElementById('form-admin-add-b2c-order');
  if (formAddB2COrder) {
    formAddB2COrder.addEventListener('submit', (e) => {
      e.preventDefault();
      const franchiseId = document.getElementById('select-admin-b2c-franchise').value;
      const customer = document.getElementById('input-b2c-customer').value.trim();
      const item = document.getElementById('input-b2c-item').value.trim();
      const amount = Number(document.getElementById('input-b2c-amount').value);
      const status = document.getElementById('select-b2c-status').value;

      const newOrder = {
        id: `B2C-${Math.floor(9000 + Math.random() * 1000)}`,
        franchiseId,
        customer,
        item,
        amount,
        status
      };

      appState.b2cOrders.push(newOrder);
      saveState();
      if (window.dbHelper) window.dbHelper.createB2COrder(newOrder);

      showToast(`B2C Order ${newOrder.id} assigned to ${franchiseId}`);
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
  renderHomeStatsAndLeaderboard();
  renderB2BDashboard();
  renderB2CDashboard();
  renderLeaderboard();
  renderAdminHub();
  renderDirectory();
}

window.setHomeLeaderboardFilter = function(filterMode) {
  appState.homeLeaderboardFilter = filterMode;
  ['all', 'b2b', 'b2c'].forEach(mode => {
    const btn = document.getElementById(`home-filter-${mode}`);
    if (btn) {
      if (mode === filterMode) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  renderHomeStatsAndLeaderboard();
};

function renderHomeStatsAndLeaderboard() {
  const container = document.getElementById('home-leaderboard-container');
  if (!container) return;

  // Calculate total network metrics
  const finishedB2B = appState.b2bOrders.filter(o => o.status === 'Finished');
  const finishedB2C = appState.b2cOrders.filter(o => o.status === 'Finished');
  
  const revB2B = finishedB2B.reduce((sum, o) => sum + Number(o.amount), 0);
  const revB2C = finishedB2C.reduce((sum, o) => sum + Number(o.amount), 0);
  const totalRev = revB2B + revB2C;
  
  const totalOutlets = appState.b2bFranchises.length + appState.b2cFranchises.length;
  const totalOrders = finishedB2B.length + finishedB2C.length;

  const statRevEl = document.getElementById('home-stat-total-rev');
  const statHubsEl = document.getElementById('home-stat-total-hubs');
  const statOrdersEl = document.getElementById('home-stat-total-orders');

  if (statRevEl) statRevEl.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  if (statHubsEl) statHubsEl.textContent = totalOutlets;
  if (statOrdersEl) statOrdersEl.textContent = totalOrders;

  // Build combined leaderboard list
  const b2bList = calculateLeaderboard(appState.b2bFranchises, appState.b2bOrders).map(item => ({
    ...item,
    category: 'b2b',
    categoryLabel: '🏢 B2B Wholesale'
  }));

  const b2cList = calculateLeaderboard(appState.b2cFranchises, appState.b2cOrders).map(item => ({
    ...item,
    category: 'b2c',
    categoryLabel: '🏪 B2C Retail Outlet'
  }));

  let combined = [...b2bList, ...b2cList].sort((a, b) => b.revenue - a.revenue);

  const maxRevenue = combined.length > 0 ? Math.max(...combined.map(p => p.revenue), 1) : 1;
  const currentFilter = appState.homeLeaderboardFilter || 'all';
  const searchQuery = (document.getElementById('search-home-leaderboard')?.value || '').toLowerCase();

  if (currentFilter === 'b2b') {
    combined = combined.filter(p => p.category === 'b2b');
  } else if (currentFilter === 'b2c') {
    combined = combined.filter(p => p.category === 'b2c');
  }

  if (searchQuery) {
    combined = combined.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.location.toLowerCase().includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery)
    );
  }

  container.innerHTML = '';

  if (combined.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-family: var(--font-mono);">No matching franchise partners found.</div>`;
    return;
  }

  combined.forEach((item, index) => {
    const rankNum = index + 1;
    const isCurrentUser = appState.currentUser && appState.currentUser.id === item.id;
    const progressPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 6);

    let rankIcon = `#${rankNum}`;
    let crown = '';
    let badgeClass = item.category === 'b2b' ? 'b2b-card' : 'b2c-card';
    if (rankNum === 1) {
      rankIcon = '👑 #1';
      crown = '<span class="rank-crown">👑</span>';
      badgeClass += ' rank-1-card';
    } else if (rankNum === 2) rankIcon = '🥇 #2';
    else if (rankNum === 3) rankIcon = '🥈 #3';

    if (isCurrentUser) badgeClass += ' is-current-user';

    const card = document.createElement('div');
    card.className = `leaderboard-card ${badgeClass}`;

    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1;">
        <div class="rank-badge ${rankNum === 1 ? 'rank-1' : ''}">${rankIcon}</div>
        <div style="flex-grow: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">${crown}${item.name}</span>
            <span class="status-pill ${item.category === 'b2b' ? 'status-finished' : 'status-pending'}" style="font-size: 0.68rem;">${item.categoryLabel}</span>
            ${isCurrentUser ? '<span class="status-pill status-processing" style="font-size: 0.68rem; background: rgba(0, 229, 255, 0.2); border-color: var(--crystal-cyan); color: var(--crystal-cyan);">⭐ YOUR FRANCHISE</span>' : ''}
          </div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            📍 ${item.location} • ID: <span style="font-family: var(--font-mono); color: var(--text-primary);">${item.id}</span>
          </div>

          <!-- Progress Bar -->
          <div class="leaderboard-progress-bar">
            <div class="progress-fill ${rankNum === 1 ? 'gold' : ''}" style="width: ${progressPercent}%;"></div>
          </div>
        </div>
      </div>

      <div style="text-align: right; flex-shrink: 0;">
        <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.3rem; color: ${item.category === 'b2b' ? 'var(--crystal-cyan)' : 'var(--gold-accent)'};">
          ₹${item.revenue.toLocaleString('en-IN')}
        </div>
        <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">
          ${item.completedOrderCount} Orders Finished
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderB2BDashboard() {
  if (!appState.currentUser || appState.currentUser.role !== 'B2B_Franchise') return;

  const myOrders = appState.b2bOrders.filter(o => o.franchiseId === appState.currentUser.id);
  const finishedOrders = myOrders.filter(o => o.status === 'Finished');
  const totalRevenue = finishedOrders.reduce((sum, o) => sum + Number(o.amount), 0);

  document.getElementById('b2b-dash-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('b2b-dash-finished-count').textContent = finishedOrders.length;

  const leaderboard = calculateLeaderboard(appState.b2bFranchises, appState.b2bOrders);
  const rankIndex = leaderboard.findIndex(item => item.id === appState.currentUser.id);
  document.getElementById('b2b-dash-rank').textContent = rankIndex !== -1 ? `#${rankIndex + 1}` : '#--';

  const tbody = document.getElementById('tbl-b2b-my-orders');
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

function renderB2CDashboard() {
  if (!appState.currentUser || appState.currentUser.role !== 'B2C_Franchise') return;

  const myOrders = appState.b2cOrders.filter(o => o.franchiseId === appState.currentUser.id);
  const finishedOrders = myOrders.filter(o => o.status === 'Finished');
  const totalRevenue = finishedOrders.reduce((sum, o) => sum + Number(o.amount), 0);

  document.getElementById('b2c-dash-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('b2c-dash-finished-count').textContent = finishedOrders.length;

  const leaderboard = calculateLeaderboard(appState.b2cFranchises, appState.b2cOrders);
  const rankIndex = leaderboard.findIndex(item => item.id === appState.currentUser.id);
  document.getElementById('b2c-dash-rank').textContent = rankIndex !== -1 ? `#${rankIndex + 1}` : '#--';

  const tbody = document.getElementById('tbl-b2c-my-orders');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (myOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No assigned B2C retail store orders found.</td></tr>`;
    return;
  }

  myOrders.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    const statusClass = `status-${ord.status.toLowerCase()}`;

    tr.innerHTML = `
      <td style="padding: 12px; font-family: var(--font-mono); color: var(--gold-accent); font-weight: 700;">${ord.id}</td>
      <td style="padding: 12px; font-weight: 600;">${ord.customer}</td>
      <td style="padding: 12px;">${ord.item}</td>
      <td style="padding: 12px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 12px;"><span class="status-pill ${statusClass}">${ord.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateLeaderboard(franchisesList, ordersList) {
  return franchisesList.map(franchise => {
    const finishedOrders = ordersList.filter(o => o.franchiseId === franchise.id && o.status === 'Finished');
    const revenue = finishedOrders.reduce((sum, o) => sum + Number(o.amount), 0);
    return {
      ...franchise,
      revenue,
      completedOrderCount: finishedOrders.length
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

function renderLeaderboard() {
  const containerB2B = document.getElementById('leaderboard-b2b-container');
  const containerB2C = document.getElementById('leaderboard-b2c-container');

  if (containerB2B) {
    const sortedB2B = calculateLeaderboard(appState.b2bFranchises, appState.b2bOrders);
    containerB2B.innerHTML = '';
    sortedB2B.forEach((item, index) => {
      const rankNum = index + 1;
      const div = document.createElement('div');
      div.className = `leaderboard-row ${rankNum === 1 ? 'rank-1' : ''}`;
      div.innerHTML = `
        <div class="rank-badge">${rankNum}</div>
        <div style="flex-grow: 1;">
          <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${item.name} ${rankNum === 1 ? '👑 [Top B2B Master]' : ''}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">📍 ${item.location} • ID: ${item.id}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.3rem; color: var(--crystal-cyan);">₹${item.revenue.toLocaleString('en-IN')}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${item.completedOrderCount} Wholesale Finished</div>
        </div>
      `;
      containerB2B.appendChild(div);
    });
  }

  if (containerB2C) {
    const sortedB2C = calculateLeaderboard(appState.b2cFranchises, appState.b2cOrders);
    containerB2C.innerHTML = '';
    sortedB2C.forEach((item, index) => {
      const rankNum = index + 1;
      const div = document.createElement('div');
      div.className = `leaderboard-row ${rankNum === 1 ? 'rank-1' : ''}`;
      div.style.borderColor = 'var(--gold-accent)';
      div.innerHTML = `
        <div class="rank-badge" style="border-color: var(--gold-accent); color: var(--gold-accent);">${rankNum}</div>
        <div style="flex-grow: 1;">
          <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${item.name} ${rankNum === 1 ? '👑 [Top B2C Store]' : ''}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">📍 ${item.location} • ID: ${item.id}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.3rem; color: var(--gold-accent);">₹${item.revenue.toLocaleString('en-IN')}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${item.completedOrderCount} Retail Sales Finished</div>
        </div>
      `;
      containerB2C.appendChild(div);
    });
  }
}

function renderAdminHub() {
  if (!appState.currentUser || appState.currentUser.role !== 'Admin') return;

  // Populate B2B Select Dropdown
  const selectB2B = document.getElementById('select-admin-b2b-franchise');
  if (selectB2B) {
    selectB2B.innerHTML = '';
    appState.b2bFranchises.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.name} (${f.location})`;
      selectB2B.appendChild(opt);
    });
  }

  // Populate B2C Select Dropdown
  const selectB2C = document.getElementById('select-admin-b2c-franchise');
  if (selectB2C) {
    selectB2C.innerHTML = '';
    appState.b2cFranchises.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.name} (${f.location})`;
      selectB2C.appendChild(opt);
    });
  }

  renderAdminB2BFranchiseRoster();
  filterAdminB2BOrders();
  renderAdminB2CFranchiseRoster();
  filterAdminB2COrders();
}

function renderAdminB2BFranchiseRoster() {
  const tbody = document.getElementById('tbl-admin-b2b-franchises');
  if (!tbody) return;
  tbody.innerHTML = '';

  appState.b2bFranchises.forEach(f => {
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

window.filterAdminB2BOrders = function() {
  const query = (document.getElementById('search-admin-b2b-orders')?.value || '').toLowerCase();
  const tbodyAdmin = document.getElementById('tbl-admin-b2b-orders');
  if (!tbodyAdmin) return;
  tbodyAdmin.innerHTML = '';

  const filtered = appState.b2bOrders.filter(o => 
    o.id.toLowerCase().includes(query) ||
    o.customer.toLowerCase().includes(query) ||
    o.item.toLowerCase().includes(query)
  );

  filtered.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    const owner = appState.b2bFranchises.find(f => f.id === ord.franchiseId);

    tr.innerHTML = `
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--emerald-green); font-weight: 700;">${ord.id}</td>
      <td style="padding: 10px; font-size: 0.85rem;">${owner ? owner.name : ord.franchiseId}</td>
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 10px;">
        <select onchange="updateB2BOrderStatus('${ord.id}', this.value)" style="background: var(--bg-dark); color: var(--text-primary); border: 1.5px solid var(--smoke-border); border-radius: 4px; padding: 6px; font-size: 0.82rem; font-family: var(--font-mono);">
          <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending ⏳</option>
          <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing ⚙️</option>
          <option value="Finished" ${ord.status === 'Finished' ? 'selected' : ''}>Finished ✅</option>
        </select>
      </td>
    `;
    tbodyAdmin.appendChild(tr);
  });
};

function renderAdminB2CFranchiseRoster() {
  const tbody = document.getElementById('tbl-admin-b2c-franchises');
  if (!tbody) return;
  tbody.innerHTML = '';

  appState.b2cFranchises.forEach(f => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    tr.innerHTML = `
      <td style="padding: 8px; font-family: var(--font-mono); color: var(--gold-accent); font-weight: 700;">${f.id}</td>
      <td style="padding: 8px; font-weight: 600;">${f.name}</td>
      <td style="padding: 8px; font-size: 0.85rem; color: var(--text-muted);">${f.location}</td>
      <td style="padding: 8px; font-family: var(--font-mono); color: var(--gold-accent); font-weight: 700;">${f.pin}</td>
    `;
    tbody.appendChild(tr);
  });
}

window.filterAdminB2COrders = function() {
  const query = (document.getElementById('search-admin-b2c-orders')?.value || '').toLowerCase();
  const tbodyB2C = document.getElementById('tbl-admin-b2c-orders');
  if (!tbodyB2C) return;
  tbodyB2C.innerHTML = '';

  const filtered = appState.b2cOrders.filter(o => 
    o.id.toLowerCase().includes(query) ||
    o.customer.toLowerCase().includes(query) ||
    o.item.toLowerCase().includes(query)
  );

  filtered.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    const owner = appState.b2cFranchises.find(f => f.id === ord.franchiseId);

    tr.innerHTML = `
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--gold-accent); font-weight: 700;">${ord.id}</td>
      <td style="padding: 10px; font-size: 0.85rem;">${owner ? owner.name : ord.franchiseId}</td>
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 10px;">
        <select onchange="updateB2COrderStatus('${ord.id}', this.value)" style="background: var(--bg-dark); color: var(--text-primary); border: 1.5px solid var(--gold-accent); border-radius: 4px; padding: 6px; font-size: 0.82rem; font-family: var(--font-mono);">
          <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending ⏳</option>
          <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing ⚙️</option>
          <option value="Finished" ${ord.status === 'Finished' ? 'selected' : ''}>Finished ✅</option>
        </select>
      </td>
    `;
    tbodyB2C.appendChild(tr);
  });
};

window.updateB2BOrderStatus = function(orderId, newStatus) {
  const ord = appState.b2bOrders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveState();
    if (window.dbHelper) window.dbHelper.updateB2BOrderStatus(orderId, newStatus);
    showToast(`B2B Order ${orderId} updated to ${newStatus}`);
    renderAllViews();
  }
};

window.updateB2COrderStatus = function(orderId, newStatus) {
  const ord = appState.b2cOrders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveState();
    if (window.dbHelper) window.dbHelper.updateB2COrderStatus(orderId, newStatus);
    showToast(`B2C Order ${orderId} updated to ${newStatus}`);
    renderAllViews();
  }
};

function renderDirectory() {
  const container = document.getElementById('grid-directory');
  if (!container) return;
  container.innerHTML = '';

  // Render B2B Master & Wholesale Franchises
  appState.b2bFranchises.forEach(f => {
    const card = document.createElement('div');
    card.className = 'glass-card';

    card.innerHTML = `
      <div class="card-title" style="margin-bottom: 8px;">
        <span class="bb-periodic-badge badge-b2b"><span class="num">31</span><span class="sym">Ga</span><span class="mass">69.723</span></span>
        <span>${f.location}</span>
      </div>
      <div style="font-weight: 700; color: var(--emerald-green); font-size: 1.15rem; margin-bottom: 6px;">${f.name}</div>
      <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">ID: ${f.id}</div>
      <div style="margin-top: 14px;">
        <span class="status-pill status-finished">🏢 B2B Wholesale Partner</span>
      </div>
    `;
    container.appendChild(card);
  });

  // Render B2C Retail Store Franchises
  appState.b2cFranchises.forEach(f => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.borderColor = 'var(--gold-accent)';

    card.innerHTML = `
      <div class="card-title" style="margin-bottom: 8px; color: var(--gold-accent);">
        <span class="bb-periodic-badge badge-b2c"><span class="num">79</span><span class="sym">Au</span><span class="mass">196.96</span></span>
        <span>${f.location}</span>
      </div>
      <div style="font-weight: 700; color: var(--gold-accent); font-size: 1.15rem; margin-bottom: 6px;">${f.name}</div>
      <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-mono);">ID: ${f.id}</div>
      <div style="margin-top: 14px;">
        <span class="status-pill status-pending" style="background: rgba(212,175,55,0.15); color: var(--gold-accent); border-color: var(--gold-accent);">🏪 B2C Retail Store Outlet</span>
      </div>
    `;
    container.appendChild(card);
  });
}
