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
    /* Mobile overlay sidebar */
    '@media (max-width: 768px) {' +
    '  #nexpos-sidebar {' +
    '    width: 16rem !important;' +
    '    transform: translateX(-100%);' +
    '    transition: transform 0.3s cubic-bezier(0.25,1,0.5,1), width 0.3s cubic-bezier(0.25,1,0.5,1);' +
    '  }' +
    '  #nexpos-sidebar.mobile-open {' +
    '    transform: translateX(0);' +
    '  }' +
    '  #nexpos-sidebar.mobile-open .nav-text,' +
    '  #nexpos-sidebar.mobile-open .header-text,' +
    '  #nexpos-sidebar.mobile-open .footer-text { display: block; }' +
    '  #nexpos-sidebar.mobile-open .nav-item { justify-content: flex-start; padding-left: 0.75rem; padding-right: 0.75rem; }' +
    '  #nexpos-sidebar.mobile-open .sidebar-header { justify-content: flex-start; padding-left: 1rem; padding-right: 1rem; }' +
    '  .main-content { margin-left: 0 !important; }' +
    '  #nexpos-sidebar.collapsed { width: 16rem !important; }' +
    '  .sidebar-backdrop {' +
    '    display: block; position: fixed; inset: 0;' +
    '    background: rgba(0,0,0,0.5); z-index: 9997; left: 16rem;' +
    '    opacity: 0; visibility: hidden; transition: all 0.3s ease;' +
    '  }' +
    '  .sidebar-backdrop.active { opacity: 1; visibility: visible; }' +
    '  .sidebar-mobile-btn {' +
    '    display: flex !important;' +
    '  }' +
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
    { href: 'settings.html', icon: 'settings', label: 'Configuraci\u00f3n' }
  ];

  function isActive(href) { return currentPage === href; }

  var sidebarHTML =
    '<div id="nexpos-sidebar" class="fixed left-0 top-0 h-full bg-slate-900 text-white z-[10000] flex flex-col shadow-2xl overflow-y-auto custom-scrollbar">' +
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
    linkClass += active ? ' bg-white/10 text-white shadow-sm' : ' text-slate-300 hover:bg-white/5 hover:text-white';
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
    '</div>' +
    '<div id="sidebar-backdrop" class="sidebar-backdrop" onclick="toggleSidebar()"></div>';

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Restore collapsed state (desktop only)
  var wasCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
  var sidebar = document.getElementById('nexpos-sidebar');
  if (wasCollapsed && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
    var icon = sidebar.querySelector('.sidebar-toggle-btn i');
    if (icon) icon.setAttribute('data-lucide', 'chevron-right');
  }

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // Global toggleSidebar — desktop = collapse, mobile = drawer
  window.toggleSidebar = function () {
    var s = document.getElementById('nexpos-sidebar');
    var isMobile = window.innerWidth <= 768;
    if (isMobile) {
      var isOpen = s.classList.toggle('mobile-open');
      var backdrop = document.getElementById('sidebar-backdrop');
      if (backdrop) backdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    } else {
      var collapsed = s.classList.toggle('collapsed');
      localStorage.setItem(STORAGE_KEY, collapsed);
      var icon = s.querySelector('.sidebar-toggle-btn i');
      if (icon) {
        icon.setAttribute('data-lucide', collapsed ? 'chevron-right' : 'chevron-left');
      }
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  };

  // Inject mobile hamburger button into each page's header
  var mainContent = document.querySelector('.main-content');
  if (mainContent) {
    var header = mainContent.querySelector('header');
    if (header) {
      var leftSection = header.querySelector('.flex.items-center.gap-4') || header.querySelector('.flex.items-center.space-x-4');
      if (leftSection) {
        var menuBtn = document.createElement('button');
        menuBtn.setAttribute('onclick', 'toggleSidebar()');
        menuBtn.className = 'sidebar-mobile-btn';
        menuBtn.style.cssText = 'display:none;flex-shrink:0;';
        menuBtn.setAttribute('aria-label', 'Men\u00fa');
        menuBtn.innerHTML = '<i data-lucide="menu" class="w-5 h-5 text-slate-900"></i>';
        leftSection.insertBefore(menuBtn, leftSection.firstChild);
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
      }
    }
  }

  // Close mobile sidebar on nav link click
  document.querySelectorAll('#nexpos-sidebar .nav-item').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
        var backdrop = document.getElementById('sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close mobile sidebar on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('mobile-open');
      var backdrop = document.getElementById('sidebar-backdrop');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();
