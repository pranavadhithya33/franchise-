/* ==========================================================================
   HEISENBERG FRANCHISE PORTAL ENGINE & CLIENT URL ROUTER
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

let appState = {
  franchises: JSON.parse(localStorage.getItem('bb_franchises')) || INITIAL_FRANCHISES,
  orders: JSON.parse(localStorage.getItem('bb_orders')) || INITIAL_ORDERS,
  currentUser: JSON.parse(localStorage.getItem('bb_current_user')) || null
};

function saveState() {
  localStorage.setItem('bb_franchises', JSON.stringify(appState.franchises));
  localStorage.setItem('bb_orders', JSON.stringify(appState.orders));
  localStorage.setItem('bb_current_user', JSON.stringify(appState.currentUser));
}

window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="bb-periodic-badge" style="width: 28px; height: 28px; font-size: 0.6rem;"><span class="sym">OK</span></span> ${message}`;
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
      // Unauthenticated trying to access /admin -> redirect to /admin-login
      window.history.replaceState({}, '', '/admin-login');
      showSection('route-admin-login');
    }
  } else if (path === '/admin-login') {
    showSection('route-admin-login');
  } else if (path === '/dashboard') {
    if (appState.currentUser && appState.currentUser.role === 'Franchise') {
      showSection('route-dashboard');
    } else {
      window.history.replaceState({}, '', '/login');
      showSection('route-login');
    }
  } else if (path === '/leaderboard') {
    showSection('route-leaderboard');
  } else if (path === '/directory') {
    showSection('route-directory');
  } else {
    // Default Home Page -> Franchise Owner Login
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
    userPill.textContent = `👤 ${appState.currentUser.name} (${appState.currentUser.id})`;
    userPill.style.color = 'var(--emerald-green)';

    navMenu.innerHTML = `
      <li><a href="/dashboard" class="nav-link ${currentPath === '/dashboard' ? 'active' : ''}" onclick="navigateRoute('/dashboard', event)">📊 My Dashboard</a></li>
      <li><a href="/leaderboard" class="nav-link ${currentPath === '/leaderboard' ? 'active' : ''}" onclick="navigateRoute('/leaderboard', event)">🏆 Empire Leaderboard</a></li>
      <li><a href="/directory" class="nav-link ${currentPath === '/directory' ? 'active' : ''}" onclick="navigateRoute('/directory', event)">🌐 Network Directory</a></li>
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
   AUTHENTICATION & FORMS
   ========================================================================== */

function initForms() {
  // Franchise Owner Login Form (Home Page /login)
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
        showToast(`Welcome back, ${match.name}!`);
        navigateRoute('/dashboard');
      } else {
        alert('❌ Invalid Franchise ID or PIN!');
      }
    });
  }

  // Executive Admin Login Form (Dedicated /admin-login)
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
        alert('❌ Invalid Admin PIN! (Demo PIN: 7777)');
      }
    });
  }

  // Form: Add New Franchise (Admin)
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
        alert(`❌ Franchise ID ${id} already exists! Please choose a unique ID.`);
        return;
      }

      const newFranchise = { id, name, location, pin, type };
      appState.franchises.push(newFranchise);
      saveState();

      if (window.dbHelper) {
        await window.dbHelper.createFranchise(newFranchise);
      }

      showToast(`Franchise ${id} (${name}) created successfully!`);
      formAddFranchise.reset();
      renderAllViews();
    });
  }

  // Form: Add New Order (Admin)
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

      showToast(`Order ${newOrder.id} assigned to ${franchiseId}`);
      formAddOrder.reset();
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
  tbody.innerHTML = '';

  if (myOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: var(--text-muted);">No assigned orders found.</td></tr>`;
    return;
  }

  myOrders.forEach(ord => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    const statusClass = `status-${ord.status.toLowerCase()}`;

    tr.innerHTML = `
      <td style="padding: 14px; font-family: var(--font-mono); color: var(--emerald-green); font-weight: 700;">${ord.id}</td>
      <td style="padding: 14px; font-weight: 600;">${ord.customer}</td>
      <td style="padding: 14px;">${ord.item}</td>
      <td style="padding: 14px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 14px;"><span class="status-pill ${statusClass}">${ord.status}</span></td>
    `;
    tbody.appendChild(tr);
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
        <div style="font-weight: 700; font-size: 1.15rem; color: var(--text-primary);">${item.name} ${rankNum === 1 ? '👑 [Heisenberg Top Rank]' : ''}</div>
        <div style="font-size: 0.88rem; color: var(--text-muted);">📍 ${item.location} • ID: ${item.id}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.4rem; color: var(--crystal-cyan);">₹${item.revenue.toLocaleString('en-IN')}</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">${item.completedOrderCount} Orders Finished</div>
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
      <td style="padding: 10px; font-size: 0.88rem;">${owner ? owner.name : ord.franchiseId}</td>
      <td style="padding: 10px; font-family: var(--font-mono); color: var(--crystal-cyan); font-weight: 700;">₹${Number(ord.amount).toLocaleString('en-IN')}</td>
      <td style="padding: 10px;">
        <select onchange="updateOrderStatus('${ord.id}', this.value)" style="background: var(--bg-dark); color: var(--text-primary); border: 1.5px solid var(--smoke-border); border-radius: 4px; padding: 6px 10px; font-size: 0.85rem; font-family: var(--font-mono);">
          <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending ⏳</option>
          <option value="Processing" ${ord.status === 'Processing' ? 'selected' : ''}>Processing ⚙️</option>
          <option value="Finished" ${ord.status === 'Finished' ? 'selected' : ''}>Finished ✅</option>
        </select>
      </td>
    `;

    tbodyAdmin.appendChild(tr);
  });
};

window.updateOrderStatus = async function(orderId, newStatus) {
  const ord = appState.orders.find(o => o.id === orderId);
  if (ord) {
    ord.status = newStatus;
    saveState();

    if (window.dbHelper) {
      await window.dbHelper.updateOrderStatus(orderId, newStatus);
    }

    showToast(`Order ${orderId} updated to ${newStatus}`);
    renderAllViews();
  }
};

function renderDirectory() {
  const container = document.getElementById('grid-directory');
  container.innerHTML = '';

  appState.franchises.forEach(f => {
    const card = document.createElement('div');
    card.className = 'glass-card';

    card.innerHTML = `
      <div class="card-title" style="margin-bottom: 8px;">
        <span class="bb-periodic-badge"><span class="num">11</span><span class="sym">Na</span><span class="mass">22.989</span></span>
        ${f.location}
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
