(function () {
  var STORAGE_KEY = 'nexpos_sidebar_collapsed';

  // Sidebar CSS
  var style = document.createElement('style');
  style.textContent =
    '#nexpos-sidebar { transition: width 0.3s cubic-bezier(0.25,1,0.5,1); overflow: hidden; }' +
    '#nexpos-sidebar.collapsed { width: 4.5rem !important; }' +
    '#nexpos-sidebar.collapsed .nav-text,' +
    '#nexpos-sidebar.collapsed .header-text,' +
    '#nexpos-sidebar.collapsed .footer-text { display: none; }' +
    '#nexpos-sidebar.collapsed .nav-item { justify-content: center; padding-left: 0; padding-right: 0; }' +
    '#nexpos-sidebar.collapsed .sidebar-header { justify-content: center; padding-left: 0; padding-right: 0; }' +
    '.sidebar-toggle-btn {' +
    '  position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);' +
    '  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);' +
    '  border-radius: 0.375rem; padding: 0.375rem; cursor: pointer;' +
    '  transition: all 0.15s ease; display: flex; align-items: center; justify-content: center;' +
    '}' +
    '.sidebar-toggle-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }' +
    '.sidebar-toggle-btn i { transition: transform 0.2s ease; }' +
    '#nexpos-sidebar.collapsed .sidebar-toggle-btn i { transform: rotate(180deg); }' +
    '.main-content { transition: margin-left 0.3s cubic-bezier(0.25,1,0.5,1); margin-left: 14rem; }' +
    '#nexpos-sidebar.collapsed ~ .main-content { margin-left: 4.5rem; }' +
    '@media (max-width: 768px) {' +
    '  #nexpos-sidebar { width: 4.5rem !important; }' +
    '  .main-content { margin-left: 4.5rem !important; }' +
    '}';
  document.head.appendChild(style);

  var currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  var navItems = [
    { href: 'dashboard.html', icon: 'layout-dashboard', label: 'Dashboard' },
    { href: 'pos.html', icon: 'shopping-cart', label: 'Punto de Venta' },
    { href: 'sales.html', icon: 'clipboard-list', label: 'Ventas' },
    { href: 'inventory.html', icon: 'package', label: 'Inventario' },
    { href: 'cash-register.html', icon: 'dollar-sign', label: 'Caja' },
    { href: 'users.html', icon: 'users', label: 'Usuarios' },
    { href: 'roles.html', icon: 'shield', label: 'Roles' },
    { href: 'reports.html', icon: 'bar-chart-3', label: 'Reportes' },
    { href: 'billing.html', icon: 'file-check', label: 'CFDI' },
    { href: 'surveys.html', icon: 'message-square', label: 'Encuestas' },
    { href: 'settings.html', icon: 'settings', label: 'Configuración' }
  ];

  function isActive(href) {
    return currentPage === href;
  }

  var sidebarHTML =
    '<div id="nexpos-sidebar" class="fixed left-0 top-0 h-full bg-slate-900 text-white z-[9999] flex flex-col shadow-2xl overflow-y-auto custom-scrollbar">' +
    '  <div class="sidebar-header p-4 border-b border-slate-700 flex items-center gap-3 flex-shrink-0 relative">' +
    '    <div class="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">' +
    '      <span class="text-white text-xs font-black tracking-tighter">N:</span>' +
    '    </div>' +
    '    <div class="header-text overflow-hidden whitespace-nowrap transition-all flex-1">' +
    '      <p class="text-sm font-bold tracking-tight">NexPoS</p>' +
    '      <p class="text-[10px] text-slate-400 font-semibold">Sistema PoS</p>' +
    '    </div>' +
    '    <button onclick="toggleSidebar()" class="sidebar-toggle-btn" title="Contraer/Expandir men\u00fa">' +
    '      <i data-lucide="chevron-left" class="w-4 h-4 text-white/80"></i>' +
    '    </button>' +
    '  </div>' +
    '  <nav class="flex-1 p-2 space-y-1">';

  for (var i = 0; i < navItems.length; i++) {
    var item = navItems[i];
    var active = isActive(item.href);
    var linkClass = 'nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all';
    if (active) {
      linkClass += ' bg-white/10 text-white shadow-sm';
    } else {
      linkClass += ' text-slate-300 hover:bg-white/5 hover:text-white';
    }
    sidebarHTML +=
      '<a href="' + item.href + '" class="' + linkClass + '">' +
      '  <i data-lucide="' + item.icon + '" class="w-4 h-4 flex-shrink-0"></i><span class="nav-text">' + item.label + '</span>' +
      '</a>';
  }

  sidebarHTML +=
    '  </nav>' +
    '  <div class="sidebar-footer p-4 border-t border-slate-700 flex-shrink-0">' +
    '    <a href="login.html" class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-400 hover:bg-white/5 hover:text-rose-400">' +
    '      <i data-lucide="log-out" class="w-4 h-4 flex-shrink-0"></i><span class="footer-text">Cerrar Sesi\u00f3n</span>' +
    '    </a>' +
    '  </div>' +
    '</div>';

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Restore collapsed state
  var wasCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
  if (wasCollapsed) {
    var sidebar = document.getElementById('nexpos-sidebar');
    sidebar.classList.add('collapsed');
    var icon = sidebar.querySelector('.sidebar-toggle-btn i');
    if (icon) {
      icon.setAttribute('data-lucide', 'chevron-right');
    }
  }

  // Re-initialize lucide icons for the navbar
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // Global toggleSidebar
  window.toggleSidebar = function () {
    var s = document.getElementById('nexpos-sidebar');
    var collapsed = s.classList.toggle('collapsed');
    localStorage.setItem(STORAGE_KEY, collapsed);
    var icon = s.querySelector('.sidebar-toggle-btn i');
    if (icon) {
      icon.setAttribute('data-lucide', collapsed ? 'chevron-right' : 'chevron-left');
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  };
})();
