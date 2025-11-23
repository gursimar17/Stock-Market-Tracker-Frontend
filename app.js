// Application State - All in-memory, no localStorage
let currentUser = null;
let currentPage = 'login';
let currentStock = null;
let marketData = {};
let portfolioHoldings = [];
let watchlist = [];
let newsData = [];
let priceUpdateInterval = null;
let charts = {};
let selectedStockForAdd = null;
let selectedHoldingForSell = null;

// User database - stored in memory
let users = [
  {
    id: 'user1',
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'Demo@123',
    portfolios: [
      {
        id: 'portfolio1',
        name: 'My Portfolio',
        holdings: [
          {
id: 'holding1',
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            shares: 30,
            purchasePrice: 255.00,
            purchaseDate: '2025-09-01'
          },
          {
            id: 'holding2',
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            shares: 25,
            purchasePrice: 350.00,
            purchaseDate: '2025-07-20'
          }
        ]
      }
],
    watchlist: [
      { symbol: 'GOOGL', name: 'Alphabet Inc.', addedAt: '2025-10-20' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', addedAt: '2025-10-18' }
    ],
    transactions: []
  },
  {
    id: 'user2',
    username: 'investor',
    email: 'investor@example.com',
    password: 'Invest@456',
    portfolios: [
      {
        id: 'portfolio2',
        name: 'My Portfolio',
holdings: []
      }
    ],
    watchlist: [],
    transactions: []
  }
];

// Sample data initialization
const initializeMarketData = () => {
  marketData = {
    indices: {
      'SPX': { name: 'S&P 500', symbol: 'SPX', value: 4550.50, change: 12.35, changePercent: 0.27, openValue: 4538.15 },
      'IXIC': { name: 'NASDAQ', symbol: 'IXIC', value: 14200.80, change: -25.40, changePercent: -0.18, openValue: 14226.20 },
      'DJI': { name: 'DOW JONES', symbol: 'DJI', value: 35400.20, change: 85.60, changePercent: 0.24, openValue: 35314.60 },
      'RUT': { name: 'RUSSELL 2000', symbol: 'RUT', value: 1850.30, change: 5.20, changePercent: 0.28, openValue: 1845.10 }
    },

    stocks: {
      'AAPL': { 
        symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.35, changePercent: 1.36, 
        volume: 55234000, marketCap: 2750000000000, pe: 28.5, eps: 6.16, 
        high52: 198.23, low52: 124.17, sector: 'Technology', industry: 'Consumer Electronics',
        openPrice: 173.15, high: 176.80, low: 172.90, beta: 1.2, avgVolume: 52000000
      },
      'MSFT': { 
        symbol: 'MSFT', name: 'Microsoft Corporation', price: 370.20, change: -1.80, changePercent: -0.48, 
        volume: 22100000, marketCap: 2750000000000, pe: 35.2, eps: 10.51, 
        high52: 384.30, low52: 213.43, sector: 'Technology', industry: 'Software',
        openPrice: 372.00, high: 373.45, low: 369.20, beta: 0.9, avgVolume: 25000000
      },
      'GOOGL': { 
        symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.35, change: 0.95, changePercent: 0.68, 
        volume: 28500000, marketCap: 1800000000000, pe: 27.1, eps: 5.18, 
        high52: 151.55, low52: 83.34, sector: 'Technology', industry: 'Internet Services',
        openPrice: 139.40, high: 141.20, low: 138.95, beta: 1.1, avgVolume: 30000000
      },
      'AMZN': { 
        symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.80, change: 1.25, changePercent: 0.86, 
        volume: 41200000, marketCap: 1500000000000, pe: 42.3, eps: 3.45, 
        high52: 170.00, low52: 81.43, sector: 'Consumer Cyclical', industry: 'E-commerce',
        openPrice: 144.55, high: 146.70, low: 144.10, beta: 1.3, avgVolume: 38000000
      },
      'TSLA': { 
        symbol: 'TSLA', name: 'Tesla Inc.', price: 245.60, change: -3.20, changePercent: -1.29, 
        volume: 118500000, marketCap: 780000000000, pe: 65.2, eps: 3.77, 
        high52: 299.29, low52: 138.80, sector: 'Automotive', industry: 'Electric Vehicles',
        openPrice: 248.80, high: 250.15, low: 244.30, beta: 2.1, avgVolume: 95000000
      },
      'NVDA': { 
        symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.30, change: 8.75, changePercent: 1.80, 
        volume: 44300000, marketCap: 1220000000000, pe: 71.4, eps: 6.94, 
        high52: 502.66, low52: 108.13, sector: 'Technology', industry: 'Semiconductors',
        openPrice: 486.55, high: 497.20, low: 485.90, beta: 1.7, avgVolume: 42000000
      },
      'META': { 
        symbol: 'META', name: 'Meta Platforms Inc.', price: 330.45, change: 4.20, changePercent: 1.29, 
        volume: 18900000, marketCap: 850000000000, pe: 24.8, eps: 13.33, 
        high52: 384.33, low52: 88.09, sector: 'Technology', industry: 'Social Media',
        openPrice: 326.25, high: 332.10, low: 325.80, beta: 1.2, avgVolume: 20000000
      },
      'NFLX': { 
        symbol: 'NFLX', name: 'Netflix Inc.', price: 450.80, change: -2.10, changePercent: -0.46, 
        volume: 8500000, marketCap: 195000000000, pe: 28.1, eps: 16.04, 
        high52: 485.00, low52: 162.71, sector: 'Communication Services', industry: 'Streaming',
        openPrice: 452.90, high: 454.20, low: 449.50, beta: 1.1, avgVolume: 9000000
      },
      'JPM': { 
        symbol: 'JPM', name: 'JPMorgan Chase', price: 150.25, change: 0.85, changePercent: 0.57, 
        volume: 12400000, marketCap: 435000000000, pe: 12.4, eps: 12.12, 
        high52: 172.27, low52: 104.40, sector: 'Financial Services', industry: 'Banking',
        openPrice: 149.40, high: 151.10, low: 148.95, beta: 1.1, avgVolume: 13000000
      },
      'V': { 
        symbol: 'V', name: 'Visa Inc.', price: 245.90, change: 1.15, changePercent: 0.47, 
        volume: 6800000, marketCap: 520000000000, pe: 32.1, eps: 7.66, 
        high52: 271.49, low52: 184.60, sector: 'Financial Services', industry: 'Payment Processing',
        openPrice: 244.75, high: 246.85, low: 244.20, beta: 0.98, avgVolume: 7500000
      }
    }
  };

// Initialize availableStocks from main stocks data
  marketData.availableStocks = Object.values(marketData.stocks).map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price
  }));
  
  // Initialize transactions array
  if (!currentUser) {
    // Will be initialized when user logs in
  }
  
  // Portfolio and watchlist will be loaded from currentUser data
  portfolioHoldings = [];
  watchlist = [];

  // Initialize news data
  newsData = [
    {
      headline: 'Tech Stocks Rally on AI Optimism, NVIDIA Leads Gains',
      source: 'Financial Times',
      time: '2 hours ago',
      excerpt: 'Technology stocks surged today as investors bet on artificial intelligence growth potential, with NVIDIA leading the charge after strong quarterly results.'
    },
    {
      headline: 'Federal Reserve Signals Potential Rate Cut in Q4',
      source: 'Bloomberg',
      time: '4 hours ago',
      excerpt: 'The Federal Reserve indicated a possible shift in monetary policy stance as inflation pressures continue to ease across major economic indicators.'
    },
    {
      headline: 'Apple Unveils New iPhone 16 with Advanced AI Features',
      source: 'Reuters',
      time: '6 hours ago',
      excerpt: 'Apple announced its latest flagship smartphone with groundbreaking AI capabilities, including enhanced Siri functionality and real-time translation features.'
    },
    {
      headline: 'Tesla Reports Record Q3 Deliveries, Stock Dips on Margin Concerns',
      source: 'CNBC',
      time: '8 hours ago',
      excerpt: 'Tesla delivered a record number of vehicles in the third quarter, but investors remain cautious about profit margins amid increased competition in the EV market.'
    },
    {
      headline: 'Microsoft Cloud Revenue Surges 28% Year-Over-Year',
      source: 'Wall Street Journal',
      time: '1 day ago',
      excerpt: 'Microsoft\'s Azure cloud computing division continues its strong growth trajectory, driven by enterprise adoption of AI and machine learning services.'
    }
  ];
};

// DOM Elements
const elements = {
  hamburgerBtn: document.getElementById('hamburgerBtn'),
  mobileMenu: document.getElementById('mobileMenu'),
  loginModal: document.getElementById('login-modal'),
  loginForm: document.getElementById('login-form'),
  loginClose: document.getElementById('login-close'),
  registerModal: document.getElementById('register-modal'),
  registerForm: document.getElementById('register-form'),
  registerClose: document.getElementById('register-close'),
  showRegister: document.getElementById('show-register'),
  showLogin: document.getElementById('show-login'),
  buyStockModal: document.getElementById('buy-stock-modal'),
  buyStockForm: document.getElementById('buy-stock-form'),
  buyStockClose: document.getElementById('buy-stock-close'),
  cancelBuyStock: document.getElementById('cancel-buy-stock'),
  addStockModal: document.getElementById('add-stock-modal'),
  addStockForm: document.getElementById('add-stock-form'),
  addStockClose: document.getElementById('add-stock-close'),
  cancelAddStock: document.getElementById('cancel-add-stock'),
  userAvatar: document.getElementById('user-avatar'),
  userName: document.getElementById('user-name'),
  userWelcome: document.getElementById('user-welcome'),
  logoutBtn: document.getElementById('logout-btn'),
  themeToggle: document.getElementById('theme-toggle'),
  searchInput: document.getElementById('search-input'),
  searchResults: document.getElementById('search-results'),
  navLinks: document.querySelectorAll('.nav-link'),
  pages: document.querySelectorAll('.page')
};

// Initialize Application
function init() {
  initializeMarketData();
  setupEventListeners();
  checkAuthenticationState();
  updateTheme();
}

// Check authentication state on app load
function checkAuthenticationState() {
  if (!currentUser) {
    showAuthenticationRequired();
  } else {
    showApp();
  }
}

function showAuthenticationRequired() {
  // Hide all app content
  document.querySelector('.navbar').style.display = 'none';
  document.querySelector('.main-content').style.display = 'none';
  
  // Close mobile menu if open
  if (elements.mobileMenu && elements.mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
  
  // Show login modal
  showLoginModal();
}

function showApp() {
  // Show app content
  document.querySelector('.navbar').style.display = 'block';
  document.querySelector('.main-content').style.display = 'block';
  
  // Load user data
  loadUserData();
  
  // Navigate to dashboard
  navigateTo('dashboard');
  
  // Start price updates
  startPriceSimulation();
}

// Event Listeners
function setupEventListeners() {
  // Hamburger menu
  if (elements.hamburgerBtn) {
    elements.hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Mobile menu links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      closeMobileMenu();
      navigateTo(page);
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (elements.mobileMenu && elements.hamburgerBtn) {
      if (!elements.mobileMenu.contains(e.target) && 
          !elements.hamburgerBtn.contains(e.target) &&
          elements.mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });
  
  // Mobile search functionality
  const mobileSearchInput = document.getElementById('mobile-search-input');
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', handleMobileSearch);
    mobileSearchInput.addEventListener('focus', () => {
      const query = mobileSearchInput.value.toLowerCase();
      if (query.length > 0) {
        handleMobileSearch({ target: mobileSearchInput });
      }
    });
  }
  
  // Authentication
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.loginClose.addEventListener('click', hideLoginModal);
  elements.registerForm.addEventListener('submit', handleRegister);
  elements.registerClose.addEventListener('click', hideRegisterModal);
  elements.showRegister.addEventListener('click', showRegisterModal);
  elements.showLogin.addEventListener('click', showLoginModal);
  elements.logoutBtn.addEventListener('click', handleLogout);
  
  // Password visibility toggles
  document.getElementById('login-password-toggle').addEventListener('click', () => togglePasswordVisibility('login-password'));
  document.getElementById('register-password-toggle').addEventListener('click', () => togglePasswordVisibility('register-password'));
  
  // Real-time validation for registration form
  document.getElementById('register-username').addEventListener('input', function() {
    validateUsername();
    updateRegisterButton();
  });
  document.getElementById('register-email').addEventListener('input', function() {
    validateEmail();
    updateRegisterButton();
  });
  document.getElementById('register-password').addEventListener('input', function() {
    validatePassword();
    updateRegisterButton();
  });
  document.getElementById('register-confirm-password').addEventListener('input', function() {
    validatePasswordMatch();
    updateRegisterButton();
  });
  
  // Buy Stock
  elements.buyStockForm.addEventListener('submit', handleBuyStock);
  elements.buyStockClose.addEventListener('click', hideBuyStockModal);
  elements.cancelBuyStock.addEventListener('click', hideBuyStockModal);
  
  // Add Stock
  elements.addStockForm.addEventListener('submit', handleAddStock);
  elements.addStockClose.addEventListener('click', hideAddStockModal);
  elements.cancelAddStock.addEventListener('click', hideAddStockModal);
  
  // Sell Stock
  document.getElementById('sell-stock-form').addEventListener('submit', handleSellStock);
  document.getElementById('sell-stock-close').addEventListener('click', hideSellStockModal);
  document.getElementById('cancel-sell-stock').addEventListener('click', hideSellStockModal);
  document.getElementById('sell-all-btn').addEventListener('click', handleSellAll);
  document.getElementById('sell-shares').addEventListener('input', updateSellSummary);
  
  // Navigation
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });
  
  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Desktop Search
  elements.searchInput.addEventListener('input', handleSearch);
  elements.searchInput.addEventListener('focus', () => {
    const query = elements.searchInput.value.toLowerCase();
    if (query.length > 0) {
      handleSearch({ target: elements.searchInput });
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && !e.target.closest('.desktop-search')) {
      hideSearchResults();
    }
    if (!e.target.closest('.mobile-search-container')) {
      hideMobileSearchResults();
    }
  });
  
  // Portfolio actions
  document.addEventListener('click', (e) => {
    if (e.target.id === 'add-stock-btn') {
      showAddStockModal();
    }
    if (e.target.classList.contains('buy-holding')) {
      const symbol = e.target.dataset.symbol;
      const holding = portfolioHoldings.find(h => h.symbol === symbol);
      if (holding) showBuyFromPortfolioModal(holding);
    }
    if (e.target.classList.contains('sell-holding')) {
      const symbol = e.target.dataset.symbol;
      const holding = portfolioHoldings.find(h => h.symbol === symbol);
      if (holding) showSellStockModal(holding);
    }
    if (e.target.classList.contains('stock-item') || e.target.closest('.stock-item')) {
      const symbol = e.target.dataset.symbol || e.target.closest('.stock-item').dataset.symbol;
      if (symbol) showStockDetail(symbol);
    }
    if (e.target.id === 'add-watchlist-btn') {
      addToWatchlist();
    }
    if (e.target.classList.contains('remove-watchlist')) {
      removeFromWatchlist(e.target.dataset.symbol);
    }
    if (e.target.id === 'watchlist-btn') {
      toggleWatchlist();
    }
    if (e.target.classList.contains('time-button')) {
      updateChartPeriod(e.target.dataset.period);
    }
    if (e.target.id === 'buy-btn') {
      showBuyStockModal();
    }
  });
  
  // Real-time cost calculation for buy modal
  document.getElementById('buy-shares').addEventListener('input', updateTotalCost);
  document.getElementById('buy-price').addEventListener('input', updateTotalCost);
  
  // Stock search functionality for add stock modal
  document.getElementById('stock-search').addEventListener('input', handleStockSearch);
  document.getElementById('stock-search').addEventListener('focus', showStockDropdown);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#add-stock-modal .form-group')) {
      hideStockDropdown();
    }
  });
  
  // Add stock modal cost calculation (only shares since price is locked)
  document.getElementById('add-shares').addEventListener('input', updateAddStockTotalCost);
  // Note: add-price is locked and doesn't need event listener
  
  // Modal close on outside click
  elements.loginModal.addEventListener('click', (e) => {
    if (e.target === elements.loginModal) hideLoginModal();
  });
  elements.registerModal.addEventListener('click', (e) => {
    if (e.target === elements.registerModal) hideRegisterModal();
  });
  elements.buyStockModal.addEventListener('click', (e) => {
    if (e.target === elements.buyStockModal) hideBuyStockModal();
  });
  elements.addStockModal.addEventListener('click', (e) => {
    if (e.target === elements.addStockModal) hideAddStockModal();
  });
}

// Authentication System
function showLoginModal() {
  hideRegisterModal();
  clearAuthErrors();
  elements.loginForm.reset();
  elements.loginModal.classList.remove('hidden');
}

function hideLoginModal() {
  elements.loginModal.classList.add('hidden');
}

function showRegisterModal() {
  hideLoginModal();
  clearAuthErrors();
  elements.registerForm.reset();
  resetPasswordRequirements();
  elements.registerModal.classList.remove('hidden');
}

function hideRegisterModal() {
  elements.registerModal.classList.add('hidden');
}

function clearAuthErrors() {
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('register-error').classList.add('hidden');
  document.getElementById('register-success').classList.add('hidden');
}

function handleLogin(e) {
  e.preventDefault();
  
  const usernameOrEmail = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  
  console.log('Login attempt:', { usernameOrEmail, passwordLength: password.length });
  
  // Validate required fields
  if (!usernameOrEmail || !password) {
    showAuthError('login-error', 'Please fill in all fields');
    return;
  }
  
  // Find user by username or email
  const user = users.find(u => 
    u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
    u.email.toLowerCase() === usernameOrEmail.toLowerCase()
  );
  
  console.log('User found:', !!user);
  
  if (!user) {
    showAuthError('login-error', 'Account not found');
    document.getElementById('login-password').value = ''; // Clear password
    return;
  }
  
  if (user.password !== password) {
    showAuthError('login-error', 'Invalid username or password');
    document.getElementById('login-password').value = ''; // Clear password
    return;
  }
  
  console.log('Login successful for user:', user.username);
  
  // Successful login
  currentUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.username.charAt(0).toUpperCase(),
    portfolios: user.portfolios,
    watchlist: user.watchlist
  };
  
  updateUserInterface();
  hideLoginModal();
  showApp();
  showToast(`Welcome back, ${currentUser.username}!`, 'success');
}

function handleRegister(e) {
  e.preventDefault();
  
  console.log('Create Account button clicked!');
  
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  console.log('Registration attempt:', {
    username: username,
    email: email,
    passwordLength: password.length,
    confirmPasswordLength: confirmPassword.length
  });
  
  // Final validation check
  if (!updateRegisterButton()) {
    console.log('Validation failed - button should be disabled');
    showAuthError('register-error', 'Please fill all fields correctly');
    return;
  }
  
  // Check if username already exists
  const existingUserByUsername = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase()
  );
  
  if (existingUserByUsername) {
    console.log('Username already exists:', username);
    showAuthError('register-error', 'Username already exists');
    return;
  }
  
  // Check if email already exists
  const existingUserByEmail = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (existingUserByEmail) {
    console.log('Email already exists:', email);
    showAuthError('register-error', 'Email already registered');
    return;
  }
  
  console.log('Users array before creation:', users.length);
  
  // Create new user object
  const newUser = {
    id: 'user_' + Date.now(),
    username: username,
    email: email,
    password: password,
    createdAt: new Date().toISOString(),
    portfolios: [{
      id: 'portfolio_' + Date.now(),
      name: 'My Portfolio',
      holdings: []
    }],
    watchlist: []
  };
  
  // Add to users array
  users.push(newUser);
  
  console.log('Users array after creation:', users.length);
  console.log('New user created:', newUser);
  
  // Show success message
  showAuthSuccess('register-success', 'Account created successfully! Please login.');
  
  // Clear form
  clearRegistrationForm();
  
  // Redirect to login page after 1.5 seconds
  setTimeout(() => {
    hideRegisterModal();
    showLoginModal();
    document.getElementById('login-username').value = username;
    showToast('Account created! You can now login.', 'success');
  }, 1500);
}

function handleLogout() {
  currentUser = null;
  portfolioHoldings = [];
  watchlist = [];
  
  // Clear intervals
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
    priceUpdateInterval = null;
  }
  
  // Reset UI
  elements.userAvatar.textContent = '?';
  elements.userWelcome.classList.add('hidden');
  elements.logoutBtn.style.display = 'none';
  
  showAuthenticationRequired();
  showToast('Logged out successfully', 'success');
}

function updateUserInterface() {
  elements.userAvatar.textContent = currentUser.avatar;
  elements.userName.textContent = currentUser.username;
  elements.userWelcome.classList.remove('hidden');
  elements.logoutBtn.style.display = 'inline-flex';
  
  // Update mobile menu links active state
  updateMobileMenuActiveState();
}

// Mobile Menu Functions
function toggleMobileMenu() {
  const isOpen = elements.mobileMenu.classList.contains('open');
  
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  elements.mobileMenu.classList.add('open');
  elements.hamburgerBtn.querySelector('.hamburger-icon').classList.add('hidden');
  elements.hamburgerBtn.querySelector('.close-icon').classList.remove('hidden');
  elements.hamburgerBtn.setAttribute('aria-expanded', 'true');
  
  // Update active state
  updateMobileMenuActiveState();
}

function closeMobileMenu() {
  elements.mobileMenu.classList.remove('open');
  elements.hamburgerBtn.querySelector('.hamburger-icon').classList.remove('hidden');
  elements.hamburgerBtn.querySelector('.close-icon').classList.add('hidden');
  elements.hamburgerBtn.setAttribute('aria-expanded', 'false');
  
  // Clear mobile search
  const mobileSearchInput = document.getElementById('mobile-search-input');
  if (mobileSearchInput) {
    mobileSearchInput.value = '';
  }
  hideMobileSearchResults();
}

function updateMobileMenuActiveState() {
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });
}

function loadUserData() {
  if (!currentUser) return;
  
  // Load portfolio holdings
  portfolioHoldings = currentUser.portfolios[0]?.holdings?.map(h => ({
    symbol: h.symbol,
    name: h.name,
    shares: h.shares,
    avgCost: h.purchasePrice,
    purchaseDate: h.purchaseDate
  })) || [];
  
  // Load watchlist
  watchlist = currentUser.watchlist || [];
}

function showAuthError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
}

function showAuthSuccess(elementId, message) {
  const successEl = document.getElementById(elementId);
  successEl.textContent = message;
  successEl.classList.remove('hidden');
}

// Password validation
function validatePassword() {
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  
  // Update requirement indicators
  updateRequirement('req-length', requirements.length);
  updateRequirement('req-uppercase', requirements.uppercase);
  updateRequirement('req-lowercase', requirements.lowercase);
  updateRequirement('req-number', requirements.number);
  updateRequirement('req-special', requirements.special);
  
  // Add passwords match indicator if confirm password field has content
  if (confirmPassword.length > 0) {
    const matchElement = document.getElementById('req-match');
    if (!matchElement) {
      // Create the match requirement element if it doesn't exist
      const passwordReqs = document.getElementById('password-requirements');
      const matchDiv = document.createElement('div');
      matchDiv.id = 'req-match';
      matchDiv.className = 'requirement';
      matchDiv.textContent = '❌ Passwords match';
      passwordReqs.appendChild(matchDiv);
    }
    updateRequirement('req-match', passwordsMatch);
  }
  
  const allValid = Object.values(requirements).every(req => req);
  updateRegisterButton();
  
  return allValid;
}

function updateRequirement(id, isValid) {
  const element = document.getElementById(id);
  const icon = isValid ? '✅' : '❌';
  const text = element.textContent.substring(2); // Remove existing icon
  element.textContent = `${icon} ${text}`;
  element.className = `requirement ${isValid ? 'valid' : 'invalid'}`;
}

function resetPasswordRequirements() {
  ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
    updateRequirement(id, false);
  });
  
  // Remove passwords match indicator if it exists
  const matchElement = document.getElementById('req-match');
  if (matchElement) {
    matchElement.remove();
  }
}

function validatePasswordMatch() {
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  // Update passwords match requirement if both fields have content
  if (password.length > 0 && confirmPassword.length > 0) {
    const passwordsMatch = password === confirmPassword;
    const matchElement = document.getElementById('req-match');
    if (!matchElement) {
      // Create the match requirement element if it doesn't exist
      const passwordReqs = document.getElementById('password-requirements');
      const matchDiv = document.createElement('div');
      matchDiv.id = 'req-match';
      matchDiv.className = 'requirement';
      matchDiv.textContent = '❌ Passwords match';
      passwordReqs.appendChild(matchDiv);
    }
    updateRequirement('req-match', passwordsMatch);
  }
  
  return updateRegisterButton();
}

function validateUsername() {
  const username = document.getElementById('register-username').value.trim();
  const usernameField = document.getElementById('register-username');
  
  // Visual feedback for username field
  if (username.length === 0) {
    usernameField.style.borderColor = '';
  } else if (username.length >= 3 && /^[a-zA-Z0-9]+$/.test(username)) {
    usernameField.style.borderColor = 'var(--color-success)';
  } else {
    usernameField.style.borderColor = 'var(--color-error)';
  }
  
  return updateRegisterButton();
}

function validateEmail() {
  const email = document.getElementById('register-email').value.trim();
  const emailField = document.getElementById('register-email');
  
  // Visual feedback for email field
  if (email.length === 0) {
    emailField.style.borderColor = '';
  } else if (email.includes('@') && email.includes('.')) {
    emailField.style.borderColor = 'var(--color-success)';
  } else {
    emailField.style.borderColor = 'var(--color-error)';
  }
  
  return updateRegisterButton();
}

function clearRegistrationForm() {
  document.getElementById('register-form').reset();
  resetPasswordRequirements();
  document.getElementById('register-submit').disabled = true;
  document.getElementById('register-submit').style.backgroundColor = 'var(--color-gray-300)';
  document.getElementById('register-submit').style.cursor = 'not-allowed';
  document.getElementById('register-submit').style.opacity = '0.6';
}

function updateRegisterButton() {
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  // Clear any existing errors
  clearAuthErrors();
  
  // Validation checks
  const isUsernameValid = username.length >= 3 && /^[a-zA-Z0-9]+$/.test(username);
  const isEmailValid = email.includes('@') && email.includes('.');
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const allFieldsFilled = username && email && password && confirmPassword;
  
  const canSubmit = allFieldsFilled && isUsernameValid && isEmailValid && isPasswordValid && doPasswordsMatch;
  
  // Update button state
  const button = document.getElementById('register-submit');
  button.disabled = !canSubmit;
  
  // Update button styling
  if (canSubmit) {
    button.style.backgroundColor = 'var(--color-primary)';
    button.style.cursor = 'pointer';
    button.style.opacity = '1';
  } else {
    button.style.backgroundColor = 'var(--color-gray-300)';
    button.style.cursor = 'not-allowed';
    button.style.opacity = '0.6';
  }
  
  // Console logging for debugging
  console.log('Registration Validation:', {
    username: username,
    email: email,
    isUsernameValid: isUsernameValid,
    isEmailValid: isEmailValid,
    isPasswordValid: isPasswordValid,
    doPasswordsMatch: doPasswordsMatch,
    allFieldsFilled: allFieldsFilled,
    canSubmit: canSubmit
  });
  
  return canSubmit;
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(inputId + '-toggle');
  
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}



// Dashboard Rendering
function renderDashboard() {
  renderIndices();
  renderTrendingStocks();
  renderFeaturedStocks();
}

function renderIndices() {
  const container = document.getElementById('indices-grid');
  container.innerHTML = '';
  
  Object.values(marketData.indices).forEach(index => {
    const changeClass = index.change >= 0 ? 'positive' : 'negative';
    const changeSign = index.change >= 0 ? '+' : '';
    
    const indexCard = document.createElement('div');
    indexCard.className = 'index-card';
    indexCard.innerHTML = `
      <div class="index-name">${index.name}</div>
      <div class="index-value">${formatCurrency(index.value, false)}</div>
      <div class="index-change ${changeClass}">
        <span>${changeSign}${formatCurrency(index.change, false)} (${changeSign}${index.changePercent.toFixed(2)}%)</span>
      </div>
    `;
    container.appendChild(indexCard);
  });
}

function renderTrendingStocks() {
  const stocks = Object.values(marketData.stocks);
  
  // Top gainers
  const gainers = stocks
    .filter(stock => stock.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
  renderStockList(gainers, 'gainers-list');
  
  // Top losers
  const losers = stocks
    .filter(stock => stock.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
  renderStockList(losers, 'losers-list');
  
  // Most active
  const active = stocks
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
  renderStockList(active, 'active-list', 'volume');
}

function renderStockList(stocks, containerId, displayType = 'change') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  stocks.forEach(stock => {
    const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
    const changeSign = stock.changePercent >= 0 ? '+' : '';
    
    let rightContent;
    if (displayType === 'volume') {
      rightContent = `<div class="stock-current">${formatVolume(stock.volume)}</div>`;
    } else {
      rightContent = `
        <div class="stock-current">${formatCurrency(stock.price)}</div>
        <div class="stock-change ${changeClass}">${changeSign}${stock.changePercent.toFixed(2)}%</div>
      `;
    }
    
    const stockItem = document.createElement('div');
    stockItem.className = 'stock-item';
    stockItem.dataset.symbol = stock.symbol;
    stockItem.innerHTML = `
      <div class="stock-info">
        <div class="stock-symbol">${stock.symbol}</div>
        <div class="stock-name">${stock.name}</div>
      </div>
      <div class="stock-price">
        ${rightContent}
      </div>
    `;
    container.appendChild(stockItem);
  });
}

function renderFeaturedStocks() {
  const container = document.getElementById('featured-stocks');
  container.innerHTML = '';
  
  const featured = ['AAPL', 'TSLA', 'MSFT'];
  
  featured.forEach(symbol => {
    const stock = marketData.stocks[symbol];
    const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
    const changeSign = stock.changePercent >= 0 ? '+' : '';
    
    const stockCard = document.createElement('div');
    stockCard.className = 'featured-stock';
    stockCard.dataset.symbol = symbol;
    stockCard.innerHTML = `
      <div class="featured-header">
        <div class="featured-info">
          <h3>${stock.name}</h3>
          <div class="featured-symbol">${stock.symbol}</div>
        </div>
        <div class="featured-price">
          <div class="featured-current">${formatCurrency(stock.price)}</div>
          <div class="stock-change ${changeClass}">
            ${changeSign}${formatCurrency(stock.change)} (${changeSign}${stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div class="chart-container">
        <canvas id="chart-${symbol}"></canvas>
      </div>
    `;
    container.appendChild(stockCard);
    
    // Create mini chart
    setTimeout(() => createMiniChart(symbol), 100);
  });
}

// Stock Detail Page
function showStockDetail(symbol) {
  const stock = marketData.stocks[symbol];
  if (!stock) return;
  
  currentStock = symbol;
  
  // Update stock detail elements
  document.getElementById('detail-company').textContent = stock.name;
  document.getElementById('detail-symbol').textContent = stock.symbol;
  document.getElementById('detail-price').textContent = formatCurrency(stock.price);
  
  const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
  const changeSign = stock.changePercent >= 0 ? '+' : '';
  const changeEl = document.getElementById('detail-change');
  changeEl.textContent = `${changeSign}${formatCurrency(stock.change)} (${changeSign}${stock.changePercent.toFixed(2)}%)`;
  changeEl.className = `stock-change ${changeClass}`;
  
  // Update watchlist button
  const watchlistBtn = document.getElementById('watchlist-btn');
  const isInWatchlist = watchlist.some(item => item.symbol === symbol);
  watchlistBtn.classList.toggle('active', isInWatchlist);
  
  // Update stats
  renderStockStats(stock);
  
  // Show page
  navigateToStockDetail();
  
  // Create main chart
  setTimeout(() => createMainChart(symbol), 100);
}

function navigateToStockDetail() {
  elements.pages.forEach(page => page.classList.add('hidden'));
  document.getElementById('stock-detail-page').classList.remove('hidden');
  
  elements.navLinks.forEach(link => link.classList.remove('active'));
  currentPage = 'stock-detail';
}

function renderStockStats(stock) {
  const statsContainer = document.getElementById('stock-stats');
  statsContainer.innerHTML = `
    <div class="stat-item"><span class="stat-label">Market Cap</span><span class="stat-value">${formatMarketCap(stock.marketCap)}</span></div>
    <div class="stat-item"><span class="stat-label">P/E Ratio</span><span class="stat-value">${stock.pe}</span></div>
    <div class="stat-item"><span class="stat-label">EPS</span><span class="stat-value">${formatCurrency(stock.eps)}</span></div>
    <div class="stat-item"><span class="stat-label">52W High</span><span class="stat-value">${formatCurrency(stock.high52)}</span></div>
    <div class="stat-item"><span class="stat-label">52W Low</span><span class="stat-value">${formatCurrency(stock.low52)}</span></div>
    <div class="stat-item"><span class="stat-label">Volume</span><span class="stat-value">${formatVolume(stock.volume)}</span></div>
    <div class="stat-item"><span class="stat-label">Avg Volume</span><span class="stat-value">${formatVolume(stock.avgVolume)}</span></div>
    <div class="stat-item"><span class="stat-label">Beta</span><span class="stat-value">${stock.beta}</span></div>
  `;
  
  const companyContainer = document.getElementById('company-info');
  companyContainer.innerHTML = `
    <div class="stat-item"><span class="stat-label">Sector</span><span class="stat-value">${stock.sector}</span></div>
    <div class="stat-item"><span class="stat-label">Industry</span><span class="stat-value">${stock.industry}</span></div>
    <div class="stat-item"><span class="stat-label">Exchange</span><span class="stat-value">NASDAQ</span></div>
    <div class="stat-item"><span class="stat-label">Currency</span><span class="stat-value">USD</span></div>
  `;
}

// Portfolio Management
function renderPortfolio() {
  updatePortfolioSummary();
  renderPortfolioHoldings();
}

function updatePortfolioSummary() {
  let totalValue = 0;
  let totalCost = 0;
  
  portfolioHoldings.forEach(holding => {
    const stock = marketData.stocks[holding.symbol];
    if (stock) {
      const marketValue = holding.shares * stock.price;
      const costBasis = holding.shares * holding.avgCost;
      totalValue += marketValue;
      totalCost += costBasis;
    }
  });
  
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  document.getElementById('portfolio-value').textContent = formatCurrency(totalValue, false);
  document.getElementById('portfolio-count').textContent = portfolioHoldings.length;
  
  const changeEl = document.getElementById('portfolio-change');
  const changeClass = totalGainLoss >= 0 ? 'positive' : 'negative';
  const changeSign = totalGainLoss >= 0 ? '+' : '';
  changeEl.textContent = `${changeSign}${formatCurrency(totalGainLoss, false)} (${changeSign}${totalGainLossPercent.toFixed(2)}%)`;
  changeEl.style.color = totalGainLoss >= 0 ? 'var(--color-success)' : 'var(--color-error)';
}

function renderPortfolioHoldings() {
  const tbody = document.getElementById('portfolio-tbody');
  tbody.innerHTML = '';
  
  if (portfolioHoldings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--color-text-secondary);">No holdings yet. Add your first stock to get started.</td></tr>';
    return;
  }
  
  portfolioHoldings.forEach(holding => {
    const stock = marketData.stocks[holding.symbol];
    if (!stock) return;
    
    const marketValue = holding.shares * stock.price;
    const costBasis = holding.shares * holding.avgCost;
    const gainLoss = marketValue - costBasis;
    const gainLossPercent = (gainLoss / costBasis) * 100;
    
    const changeClass = gainLoss >= 0 ? 'positive' : 'negative';
    const changeSign = gainLoss >= 0 ? '+' : '';
    
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid var(--color-card-border)';
    row.innerHTML = `
      <td style="padding: 12px; font-weight: 600;">${holding.symbol}</td>
      <td style="padding: 12px;">${holding.name}</td>
      <td style="padding: 12px; text-align: right;">${holding.shares}</td>
      <td style="padding: 12px; text-align: right;">${formatCurrency(holding.avgCost)}</td>
      <td style="padding: 12px; text-align: right;">${formatCurrency(stock.price)}</td>
      <td style="padding: 12px; text-align: right;">${formatCurrency(marketValue, false)}</td>
      <td style="padding: 12px; text-align: right; color: var(--color-${changeClass === 'positive' ? 'success' : 'error'});">
        ${changeSign}${formatCurrency(gainLoss, false)}<br>
        <small>(${changeSign}${gainLossPercent.toFixed(2)}%)</small>
      </td>
      <td style="padding: 12px; text-align: center;">
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="btn btn--sm buy-holding" data-symbol="${holding.symbol}" style="background: #10B981; color: white; border: none;">📈 Buy</button>
          <button class="btn btn--sm sell-holding" data-symbol="${holding.symbol}" style="background: #F97316; color: white; border: none;">📉 Sell</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Add Stock Modal with Stock Selection
function showAddStockModal() {
  if (!currentUser) {
    showToast('Please login to add stocks', 'error');
    return;
  }
  
  // Set automatic date (today) - LOCKED
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const todayDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
  
  document.getElementById('add-date').value = todayISO;
  document.getElementById('add-date-display').value = todayDisplay;
  
  resetAddStockModal();
  elements.addStockModal.classList.remove('hidden');
  document.getElementById('stock-search').focus();
}

function hideAddStockModal() {
  elements.addStockModal.classList.add('hidden');
  resetAddStockModal();
}

function resetAddStockModal() {
  elements.addStockForm.reset();
  selectedStockForAdd = null;
  document.getElementById('selected-stock-info').classList.add('hidden');
  document.getElementById('add-total-cost-display').classList.add('hidden');
  document.getElementById('confirm-add-stock').disabled = true;
  document.getElementById('confirm-add-stock').textContent = 'Add to Portfolio';
  hideStockDropdown();
  
  // Reset date display to today
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const todayDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('add-date').value = todayISO;
  document.getElementById('add-date-display').value = todayDisplay;
}

function handleStockSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (query.length === 0) {
    hideStockDropdown();
    return;
  }
  
  const availableStocks = marketData.availableStocks || Object.values(marketData.stocks);
  const results = availableStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query) ||
    stock.name.toLowerCase().includes(query)
  ).slice(0, 8);
  
  showStockDropdown(results);
}

function showStockDropdown(results = null) {
  const dropdown = document.getElementById('stock-dropdown');
  dropdown.innerHTML = '';
  
  if (!results) {
    // Show all stocks when no search query
    const availableStocks = marketData.availableStocks || Object.values(marketData.stocks);
    results = availableStocks.slice(0, 10);
  }
  
  if (results.length === 0) {
    dropdown.innerHTML = '<div style="padding: 12px; color: var(--color-text-secondary); text-align: center;">No stocks found</div>';
    dropdown.classList.remove('hidden');
    return;
  }
  
  results.forEach(stock => {
    const stockData = marketData.stocks[stock.symbol] || stock;
    const stockOption = document.createElement('div');
    stockOption.className = 'stock-option';
    stockOption.innerHTML = `
      <div class="stock-option-info">
        <div class="stock-option-symbol">${stockData.symbol}</div>
        <div class="stock-option-name">${stockData.name}</div>
      </div>
      <div class="stock-option-price">${formatCurrency(stockData.price || stockData.currentPrice)}</div>
    `;
    
    stockOption.addEventListener('click', () => selectStock(stockData));
    dropdown.appendChild(stockOption);
  });
  
  dropdown.classList.remove('hidden');
}

function hideStockDropdown() {
  document.getElementById('stock-dropdown').classList.add('hidden');
}

function selectStock(stock) {
  selectedStockForAdd = stock;
  
  // Update search input
  document.getElementById('stock-search').value = `${stock.symbol} - ${stock.name}`;
  
  // Show selected stock info
  document.getElementById('selected-symbol').textContent = stock.symbol;
  document.getElementById('selected-name').textContent = stock.name;
  document.getElementById('selected-price').textContent = formatCurrency(stock.price);
  document.getElementById('selected-stock-info').classList.remove('hidden');
  
  // LOCK price field at current market price
  const priceField = document.getElementById('add-price');
  priceField.value = stock.price.toFixed(2);
  
  // Ensure date is set to today (automatic)
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const todayDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('add-date').value = todayISO;
  document.getElementById('add-date-display').value = todayDisplay;
  
  hideStockDropdown();
  updateAddStockTotalCost();
  
  // Focus on shares input since it's the only editable field
  setTimeout(() => document.getElementById('add-shares').focus(), 100);
}

function updateAddStockTotalCost() {
  if (!selectedStockForAdd) return;
  
  const shares = parseInt(document.getElementById('add-shares').value) || 0;
  const lockedPrice = parseFloat(document.getElementById('add-price').value) || 0; // This is locked at market price
  const totalCost = shares * lockedPrice;
  
  if (shares > 0 && lockedPrice > 0) {
    document.getElementById('add-total-amount').textContent = formatCurrency(totalCost, false);
    document.getElementById('add-calculation').textContent = `${shares} shares × ${formatCurrency(lockedPrice)}`;
    document.getElementById('add-total-cost-display').classList.remove('hidden');
    document.getElementById('confirm-add-stock').disabled = false;
    document.getElementById('confirm-add-stock').textContent = `Add to Portfolio - ${formatCurrency(totalCost, false)}`;
  } else {
    document.getElementById('add-total-cost-display').classList.add('hidden');
    document.getElementById('confirm-add-stock').disabled = true;
    document.getElementById('confirm-add-stock').textContent = 'Add to Portfolio';
  }
}

function handleAddStock(e) {
  e.preventDefault();
  
  if (!selectedStockForAdd) {
    showToast('Please select a stock first', 'error');
    return;
  }
  
  const shares = parseInt(document.getElementById('add-shares').value);
  const lockedPrice = parseFloat(document.getElementById('add-price').value); // This is locked at current market price
  const lockedDate = document.getElementById('add-date').value; // This is today's date (locked)
  
  if (shares <= 0) {
    showToast('Please enter a valid number of shares', 'error');
    return;
  }
  
  if (!lockedPrice || lockedPrice <= 0) {
    showToast('Invalid price - please try again', 'error');
    return;
  }
  
  const symbol = selectedStockForAdd.symbol;
  const name = selectedStockForAdd.name;
  
  // Check if stock already exists in portfolio
  const existingIndex = portfolioHoldings.findIndex(h => h.symbol === symbol);
  
  if (existingIndex >= 0) {
    // Stock already owned - UPDATE existing holding with weighted average
    const existing = portfolioHoldings[existingIndex];
    
    // Calculate weighted average cost
    const totalShares = existing.shares + shares;
    const totalCost = (existing.shares * existing.avgCost) + (shares * lockedPrice);
    const avgCost = totalCost / totalShares;
    
    // Update existing holding
    existing.shares = totalShares;
    existing.avgCost = avgCost;
    existing.purchaseDate = lockedDate; // Update to latest purchase date
    
    showToast(`Updated ${symbol}: Now ${totalShares} shares @ avg cost ${formatCurrency(avgCost)}`, 'success');
  } else {
    // Stock not owned - ADD new holding
    portfolioHoldings.push({
      symbol,
      name,
      shares,
      avgCost: lockedPrice, // Using locked price
      purchaseDate: lockedDate // Using locked date (today)
    });
    
    showToast(`Added ${shares} shares of ${symbol} to portfolio!`, 'success');
  }
  
  // Update user data in memory
  if (currentUser && currentUser.portfolios[0]) {
    currentUser.portfolios[0].holdings = portfolioHoldings.map(h => ({
      id: 'holding_' + h.symbol,
      symbol: h.symbol,
      name: h.name,
      shares: h.shares,
      purchasePrice: h.avgCost,
      purchaseDate: h.purchaseDate
    }));
  }
  
  hideAddStockModal();
  
  if (currentPage === 'portfolio') {
    renderPortfolio();
  }
}

// Sell Stock Modal Functions
function showSellStockModal(holding) {
  if (!currentUser) {
    showToast('Please login to sell stocks', 'error');
    return;
  }
  
  selectedHoldingForSell = holding;
  const stock = marketData.stocks[holding.symbol];
  
  if (!stock) {
    showToast('Stock data not available', 'error');
    return;
  }
  
  // Update modal with stock info
  document.getElementById('sell-stock-symbol-large').textContent = holding.symbol;
  document.getElementById('sell-stock-company-name').textContent = holding.name;
  document.getElementById('sell-current-market-price').textContent = formatCurrency(stock.price);
  
  // Update price change indicator
  const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
  const changeSign = stock.changePercent >= 0 ? '▲' : '▼';
  const priceChangeEl = document.getElementById('sell-price-change');
  priceChangeEl.textContent = `${changeSign} ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
  priceChangeEl.style.color = stock.changePercent >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  // Update holdings info
  const currentValue = holding.shares * stock.price;
  const totalCost = holding.shares * holding.avgCost;
  const totalGainLoss = currentValue - totalCost;
  const totalGainLossPercent = (totalGainLoss / totalCost) * 100;
  
  document.getElementById('sell-total-shares').textContent = holding.shares;
  document.getElementById('sell-avg-cost').textContent = formatCurrency(holding.avgCost);
  document.getElementById('sell-current-value').textContent = formatCurrency(currentValue, false);
  
  const gainLossEl = document.getElementById('sell-total-gain-loss');
  const gainLossSign = totalGainLoss >= 0 ? '+' : '';
  gainLossEl.textContent = `${gainLossSign}${formatCurrency(totalGainLoss, false)} (${gainLossSign}${totalGainLossPercent.toFixed(2)}%)`;
  gainLossEl.style.color = totalGainLoss >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  // Set locked sell price
  document.getElementById('sell-price').value = stock.price.toFixed(2);
  document.getElementById('sell-max-shares').textContent = holding.shares;
  
  // Set automatic date (today)
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const todayDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('sell-date').value = todayISO;
  document.getElementById('sell-date-display').value = todayDisplay;
  
  // Clear shares input
  document.getElementById('sell-shares').value = '';
  
  // Reset summary
  updateSellSummary();
  
  document.getElementById('sell-stock-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('sell-shares').focus(), 100);
}

function hideSellStockModal() {
  document.getElementById('sell-stock-modal').classList.add('hidden');
  document.getElementById('sell-stock-form').reset();
  selectedHoldingForSell = null;
  document.getElementById('remaining-after-sale').style.display = 'none';
}

function handleSellAll() {
  if (!selectedHoldingForSell) return;
  document.getElementById('sell-shares').value = selectedHoldingForSell.shares;
  updateSellSummary();
}

function updateSellSummary() {
  if (!selectedHoldingForSell) return;
  
  const sharesToSell = parseInt(document.getElementById('sell-shares').value) || 0;
  const sellPrice = parseFloat(document.getElementById('sell-price').value) || 0;
  const avgCost = selectedHoldingForSell.avgCost;
  const maxShares = selectedHoldingForSell.shares;
  
  // Validate shares
  const confirmBtn = document.getElementById('confirm-sale');
  if (sharesToSell <= 0 || sharesToSell > maxShares) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Confirm Sale';
    document.getElementById('remaining-after-sale').style.display = 'none';
    return;
  }
  
  // Calculate sale summary
  const proceeds = sharesToSell * sellPrice;
  const cost = sharesToSell * avgCost;
  const gainLoss = proceeds - cost;
  const gainLossPercent = (gainLoss / cost) * 100;
  
  // Update summary display
  document.getElementById('summary-shares').textContent = sharesToSell;
  document.getElementById('summary-price-calc').textContent = `${formatCurrency(sellPrice)} × ${sharesToSell}`;
  document.getElementById('summary-proceeds').textContent = formatCurrency(proceeds, false);
  document.getElementById('summary-cost-calc').textContent = `${formatCurrency(avgCost)} × ${sharesToSell}`;
  document.getElementById('summary-cost').textContent = formatCurrency(cost, false);
  
  const gainLossEl = document.getElementById('summary-gain-loss');
  const gainLossSign = gainLoss >= 0 ? '+' : '';
  gainLossEl.textContent = `${gainLossSign}${formatCurrency(gainLoss, false)} (${gainLossSign}${gainLossPercent.toFixed(2)}%)`;
  gainLossEl.style.color = gainLoss >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  
  // Update remaining shares info
  const remainingShares = maxShares - sharesToSell;
  if (remainingShares > 0) {
    const stock = marketData.stocks[selectedHoldingForSell.symbol];
    const remainingValue = remainingShares * stock.price;
    
    document.getElementById('remaining-shares').textContent = remainingShares;
    document.getElementById('remaining-avg-cost').textContent = formatCurrency(avgCost);
    document.getElementById('remaining-value').textContent = formatCurrency(remainingValue, false);
    document.getElementById('remaining-after-sale').style.display = 'block';
  } else {
    document.getElementById('remaining-after-sale').style.display = 'none';
  }
  
  // Enable confirm button
  confirmBtn.disabled = false;
  confirmBtn.textContent = `Confirm Sale - ${formatCurrency(proceeds, false)}`;
}

function handleSellStock(e) {
  e.preventDefault();
  
  if (!selectedHoldingForSell) {
    showToast('No holding selected', 'error');
    return;
  }
  
  const sharesToSell = parseInt(document.getElementById('sell-shares').value);
  const sellPrice = parseFloat(document.getElementById('sell-price').value);
  const sellDate = document.getElementById('sell-date').value;
  
  if (sharesToSell <= 0 || sharesToSell > selectedHoldingForSell.shares) {
    showToast('Invalid number of shares', 'error');
    return;
  }
  
  // Calculate realized gain/loss
  const avgCost = selectedHoldingForSell.avgCost;
  const proceeds = sharesToSell * sellPrice;
  const cost = sharesToSell * avgCost;
  const realizedGainLoss = proceeds - cost;
  const gainLossPercent = (realizedGainLoss / cost) * 100;
  
  // Record transaction
  const transaction = {
    id: 'txn_' + Date.now(),
    type: 'SELL',
    symbol: selectedHoldingForSell.symbol,
    name: selectedHoldingForSell.name,
    shares: sharesToSell,
    price: sellPrice,
    date: sellDate,
    proceeds: proceeds,
    cost: cost,
    gainLoss: realizedGainLoss,
    gainLossPercent: gainLossPercent
  };
  
  // Add to transaction history
  if (!currentUser.transactions) {
    currentUser.transactions = [];
  }
  currentUser.transactions.push(transaction);
  
  // Update or remove holding
  if (sharesToSell === selectedHoldingForSell.shares) {
    // Selling all shares - remove holding
    portfolioHoldings = portfolioHoldings.filter(h => h.symbol !== selectedHoldingForSell.symbol);
    
    const gainLossSign = realizedGainLoss >= 0 ? '+' : '';
    showToast(
      `Sold all ${sharesToSell} shares of ${selectedHoldingForSell.symbol} for ${formatCurrency(proceeds, false)}. Realized ${gainLossSign}${formatCurrency(realizedGainLoss, false)}`,
      realizedGainLoss >= 0 ? 'success' : 'error'
    );
  } else {
    // Selling partial - update holding
    const holding = portfolioHoldings.find(h => h.symbol === selectedHoldingForSell.symbol);
    if (holding) {
      holding.shares -= sharesToSell;
    }
    
    const gainLossSign = realizedGainLoss >= 0 ? '+' : '';
    showToast(
      `Sold ${sharesToSell} shares of ${selectedHoldingForSell.symbol}. ${holding.shares} shares remaining. Realized ${gainLossSign}${formatCurrency(realizedGainLoss, false)}`,
      'success'
    );
  }
  
  // Update user data in memory
  if (currentUser && currentUser.portfolios[0]) {
    currentUser.portfolios[0].holdings = portfolioHoldings.map(h => ({
      id: 'holding_' + h.symbol,
      symbol: h.symbol,
      name: h.name,
      shares: h.shares,
      purchasePrice: h.avgCost,
      purchaseDate: h.purchaseDate
    }));
  }
  
  hideSellStockModal();
  
  if (currentPage === 'portfolio') {
    renderPortfolio();
  }
}

// Buy Stock Modal Functions
function showBuyFromPortfolioModal(holding) {
  if (!currentUser) {
    showToast('Please login to buy stocks', 'error');
    return;
  }
  
  const stock = marketData.stocks[holding.symbol];
  if (!stock) {
    showToast('Stock data not available', 'error');
    return;
  }
  
  // Update modal content with current stock info
  document.getElementById('buy-modal-title').textContent = `Buy More ${stock.symbol}`;
  
  // Update FIRST info section
  document.getElementById('buy-stock-name').textContent = stock.name;
  document.getElementById('buy-stock-symbol').textContent = stock.symbol;
  document.getElementById('buy-current-price').textContent = formatCurrency(stock.price);
  
  // Update SECOND info section  
  document.getElementById('buy-stock-symbol-large').textContent = stock.symbol;
  document.getElementById('buy-stock-company-name').textContent = stock.name;
  document.getElementById('buy-current-market-price').textContent = formatCurrency(stock.price);
  
  // Add current holdings display before the form
  const modalBody = document.querySelector('#buy-stock-modal .modal-body');
  let holdingsSection = document.getElementById('current-holdings-section');
  
  if (!holdingsSection) {
    holdingsSection = document.createElement('div');
    holdingsSection.id = 'current-holdings-section';
    modalBody.insertBefore(holdingsSection, document.getElementById('buy-stock-form'));
  }
  
  const currentValue = holding.shares * stock.price;
  const costBasis = holding.shares * holding.avgCost;
  const unrealizedGainLoss = currentValue - costBasis;
  const unrealizedGainLossPercent = (unrealizedGainLoss / costBasis) * 100;
  const gainLossClass = unrealizedGainLoss >= 0 ? 'success' : 'error';
  const gainLossSign = unrealizedGainLoss >= 0 ? '+' : '';
  
  holdingsSection.innerHTML = `
    <div style="margin-bottom: 24px; padding: 16px; background: var(--color-bg-2); border-radius: var(--radius-base); border: 1px solid rgba(var(--color-warning-rgb), 0.3);">
      <h4 style="margin: 0 0 12px 0; font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Current Holdings</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: var(--font-size-sm);">
        <div>
          <div style="color: var(--color-text-secondary); margin-bottom: 4px;">You own</div>
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-lg);">${holding.shares} shares</div>
        </div>
        <div>
          <div style="color: var(--color-text-secondary); margin-bottom: 4px;">Average cost</div>
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-lg);">${formatCurrency(holding.avgCost)}</div>
        </div>
        <div>
          <div style="color: var(--color-text-secondary); margin-bottom: 4px;">Current value</div>
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-lg);">${formatCurrency(currentValue, false)}</div>
        </div>
        <div>
          <div style="color: var(--color-text-secondary); margin-bottom: 4px;">Unrealized gain/loss</div>
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-lg); color: var(--color-${gainLossClass});">${gainLossSign}${formatCurrency(unrealizedGainLoss, false)}</div>
        </div>
      </div>
    </div>
  `;
  
  // Set LOCKED purchase price (current market price)
  const lockedPrice = stock.price.toFixed(2);
  document.getElementById('buy-price').value = lockedPrice;
  
  // Set AUTOMATIC purchase date (today)
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  const todayDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  document.getElementById('buy-date').value = todayISO;
  document.getElementById('buy-date-display').value = todayDisplay;
  
  // Clear shares input
  document.getElementById('buy-shares').value = '';
  
  // Store holding reference for later use
  document.getElementById('buy-stock-modal').dataset.existingHolding = holding.symbol;
  
  // Add after purchase preview section
  let previewSection = document.getElementById('after-purchase-preview');
  if (!previewSection) {
    previewSection = document.createElement('div');
    previewSection.id = 'after-purchase-preview';
    previewSection.style.display = 'none';
    const totalCostDisplay = document.getElementById('total-cost-display');
    totalCostDisplay.parentNode.insertBefore(previewSection, totalCostDisplay.nextSibling);
  }
  
  // Update cost calculation function to show preview
  updateTotalCost();
  
  elements.buyStockModal.classList.remove('hidden');
  
  // Focus on shares input since it's the only editable field
  setTimeout(() => document.getElementById('buy-shares').focus(), 100);
}

function showBuyStockModal() {
  if (!currentStock) {
    showToast('Please select a stock first', 'error');
    return;
  }
  
  const stock = marketData.stocks[currentStock];
  if (!stock) {
    showToast('Stock data not available', 'error');
    return;
  }
  
  // Update modal content with current stock info
  document.getElementById('buy-modal-title').textContent = `Buy ${stock.symbol}`;
  
  // Update FIRST info section (was showing hardcoded AAPL)
  document.getElementById('buy-stock-name').textContent = stock.name;
  document.getElementById('buy-stock-symbol').textContent = stock.symbol;
  document.getElementById('buy-current-price').textContent = formatCurrency(stock.price);
  
  // Update SECOND info section  
  document.getElementById('buy-stock-symbol-large').textContent = stock.symbol;
  document.getElementById('buy-stock-company-name').textContent = stock.name;
  document.getElementById('buy-current-market-price').textContent = formatCurrency(stock.price);
  
  // Set LOCKED purchase price (current market price)
  const lockedPrice = stock.price.toFixed(2);
  document.getElementById('buy-price').value = lockedPrice;
  
  // Set AUTOMATIC purchase date (today)
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0]; // 2025-10-24
  const todayDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }); // "October 24, 2025"
  
  document.getElementById('buy-date').value = todayISO;
  document.getElementById('buy-date-display').value = todayDisplay;
  
  // Clear shares input
  document.getElementById('buy-shares').value = '';
  
  // Reset form state
  updateTotalCost();
  
  elements.buyStockModal.classList.remove('hidden');
  
  // Focus on shares input since it's the only editable field
  setTimeout(() => document.getElementById('buy-shares').focus(), 100);
}

function hideBuyStockModal() {
  elements.buyStockModal.classList.add('hidden');
  elements.buyStockForm.reset();
  document.getElementById('total-cost-amount').textContent = '$0.00';
  document.getElementById('total-calculation').textContent = '0 shares × $0.00';
  document.getElementById('confirm-purchase').disabled = true;
  document.getElementById('confirm-purchase').textContent = 'Confirm Purchase';
  
  // Remove current holdings section if exists
  const holdingsSection = document.getElementById('current-holdings-section');
  if (holdingsSection) {
    holdingsSection.remove();
  }
  
  // Remove preview section if exists
  const previewSection = document.getElementById('after-purchase-preview');
  if (previewSection) {
    previewSection.style.display = 'none';
  }
  
  // Clear holding reference
  delete document.getElementById('buy-stock-modal').dataset.existingHolding;
}

function updateTotalCost() {
  const shares = parseInt(document.getElementById('buy-shares').value) || 0;
  const price = parseFloat(document.getElementById('buy-price').value) || 0;
  const totalCost = shares * price;
  
  // Update display
  document.getElementById('total-cost-amount').textContent = formatCurrency(totalCost, false);
  document.getElementById('total-calculation').textContent = `${shares} shares × ${formatCurrency(price)}`;
  
  // Enable/disable confirm button (only check shares since price is always locked)
  const confirmBtn = document.getElementById('confirm-purchase');
  confirmBtn.disabled = shares <= 0;
  
  // Update button text based on state
  if (shares > 0) {
    confirmBtn.textContent = `Confirm Purchase - ${formatCurrency(totalCost, false)}`;
  } else {
    confirmBtn.textContent = 'Confirm Purchase';
  }
  
  // If buying from portfolio, show preview of new average
  const existingSymbol = document.getElementById('buy-stock-modal').dataset.existingHolding;
  if (existingSymbol && shares > 0) {
    const holding = portfolioHoldings.find(h => h.symbol === existingSymbol);
    if (holding) {
      const newTotalShares = holding.shares + shares;
      const newTotalCost = (holding.shares * holding.avgCost) + (shares * price);
      const newAvgCost = newTotalCost / newTotalShares;
      
      let previewSection = document.getElementById('after-purchase-preview');
      if (!previewSection) {
        previewSection = document.createElement('div');
        previewSection.id = 'after-purchase-preview';
        const totalCostDisplay = document.getElementById('total-cost-display');
        totalCostDisplay.parentNode.insertBefore(previewSection, totalCostDisplay.nextSibling);
      }
      
      previewSection.style.display = 'block';
      previewSection.innerHTML = `
        <div style="margin: 20px 0; padding: 20px; background: var(--color-bg-3); border-radius: var(--radius-base); border: 2px solid rgba(var(--color-success-rgb), 0.3);">
          <h4 style="margin: 0 0 12px 0; font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">After Purchase</h4>
          <div style="display: grid; gap: 8px; font-size: var(--font-size-sm); margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-secondary);">New total shares:</span>
              <span style="font-weight: var(--font-weight-semibold);">${newTotalShares}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-secondary);">New average cost:</span>
              <span style="font-weight: var(--font-weight-bold); color: var(--color-success);">${formatCurrency(newAvgCost)}</span>
            </div>
          </div>
          <div style="padding: 12px; background: var(--color-surface); border-radius: var(--radius-base); border: 1px solid var(--color-border); font-size: var(--font-size-xs); color: var(--color-text-secondary);">
            <strong>Calculation:</strong><br>
            (${holding.shares} × ${formatCurrency(holding.avgCost)} + ${shares} × ${formatCurrency(price)}) ÷ ${newTotalShares} = ${formatCurrency(newAvgCost)}
          </div>
        </div>
      `;
    }
  } else {
    const previewSection = document.getElementById('after-purchase-preview');
    if (previewSection) {
      previewSection.style.display = 'none';
    }
  }
}

function handleBuyStock(e) {
  e.preventDefault();
  
  // Check if buying from portfolio (buying more of existing holding)
  const existingSymbol = document.getElementById('buy-stock-modal').dataset.existingHolding;
  let stock;
  
  if (existingSymbol) {
    // Buying from portfolio
    stock = marketData.stocks[existingSymbol];
  } else if (currentStock) {
    // Buying from stock detail page
    stock = marketData.stocks[currentStock];
  } else {
    showToast('No stock selected', 'error');
    return;
  }
  const shares = parseInt(document.getElementById('buy-shares').value);
  const lockedPrice = parseFloat(document.getElementById('buy-price').value); // This is the locked current market price
  const lockedDate = document.getElementById('buy-date').value; // This is today's date (locked)
  
  if (shares <= 0) {
    showToast('Please enter a valid number of shares', 'error');
    return;
  }
  
  if (!lockedPrice || lockedPrice <= 0) {
    showToast('Invalid price - please try again', 'error');
    return;
  }
  
  // Check if stock already exists in portfolio
  const existingIndex = portfolioHoldings.findIndex(h => h.symbol === stock.symbol);
  
  if (existingIndex >= 0) {
    // Stock already owned - UPDATE existing holding with weighted average
    const existing = portfolioHoldings[existingIndex];
    
    // Calculate weighted average cost
    const totalShares = existing.shares + shares;
    const totalCost = (existing.shares * existing.avgCost) + (shares * lockedPrice);
    const avgCost = totalCost / totalShares;
    
    // Update existing holding
    existing.shares = totalShares;
    existing.avgCost = avgCost;
    existing.purchaseDate = lockedDate; // Update to latest purchase date
    
    showToast(`Updated ${stock.symbol}: Now ${totalShares} shares @ avg cost ${formatCurrency(avgCost)}`, 'success');
  } else {
    // Stock not owned - ADD new holding
    portfolioHoldings.push({
      symbol: stock.symbol,
      name: stock.name,
      shares,
      avgCost: lockedPrice, // Using locked price
      purchaseDate: lockedDate // Using locked date (today)
    });
    
    showToast(`Added ${shares} shares of ${stock.symbol} to portfolio!`, 'success');
  }
  
  // Update user data in memory
  if (currentUser && currentUser.portfolios[0]) {
    currentUser.portfolios[0].holdings = portfolioHoldings.map(h => ({
      id: 'holding_' + h.symbol,
      symbol: h.symbol,
      name: h.name,
      shares: h.shares,
      purchasePrice: h.avgCost,
      purchaseDate: h.purchaseDate
    }));
  }
  
  hideBuyStockModal();
  
  // Update portfolio if on portfolio page
  if (currentPage === 'portfolio') {
    renderPortfolio();
  }
}

// Watchlist Management
function renderWatchlist() {
  const container = document.getElementById('watchlist-grid');
  container.innerHTML = '';
  
  if (watchlist.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 48px; color: var(--color-text-secondary);">No stocks in watchlist. Add some stocks to get started.</div>';
    return;
  }
  
  watchlist.forEach(item => {
    const stock = marketData.stocks[item.symbol];
    if (!stock) return;
    
    const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
    const changeSign = stock.changePercent >= 0 ? '+' : '';
    
    const watchlistItem = document.createElement('div');
    watchlistItem.className = 'card stock-item';
    watchlistItem.dataset.symbol = stock.symbol;
    watchlistItem.innerHTML = `
      <div class="card__body">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <h4 style="margin: 0; margin-bottom: 4px;">${stock.symbol}</h4>
            <p style="margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm);">${stock.name}</p>
          </div>
          <button class="btn btn--sm btn--secondary remove-watchlist" data-symbol="${stock.symbol}">Remove</button>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${formatCurrency(stock.price)}</div>
          <div class="stock-change ${changeClass}" style="font-weight: var(--font-weight-medium);">
            ${changeSign}${formatCurrency(stock.change)} (${changeSign}${stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
    `;
    container.appendChild(watchlistItem);
  });
}

function addToWatchlist() {
  const symbol = document.getElementById('watchlist-search').value.toUpperCase().trim();
  if (!symbol) return;
  
  const stock = marketData.stocks[symbol];
  if (!stock) {
    showToast(`Stock ${symbol} not found`, 'error');
    return;
  }
  
  if (watchlist.some(item => item.symbol === symbol)) {
    showToast(`${symbol} is already in your watchlist`, 'error');
    return;
  }
  
  watchlist.push({
    symbol: stock.symbol,
    name: stock.name
  });
  
  document.getElementById('watchlist-search').value = '';
  showToast(`Added ${symbol} to watchlist`, 'success');
  renderWatchlist();
}

function removeFromWatchlist(symbol) {
  watchlist = watchlist.filter(item => item.symbol !== symbol);
  showToast(`Removed ${symbol} from watchlist`, 'success');
  renderWatchlist();
}

function toggleWatchlist() {
  if (!currentStock) return;
  
  const isInWatchlist = watchlist.some(item => item.symbol === currentStock);
  const watchlistBtn = document.getElementById('watchlist-btn');
  
  if (isInWatchlist) {
    removeFromWatchlist(currentStock);
    watchlistBtn.classList.remove('active');
  } else {
    const stock = marketData.stocks[currentStock];
    watchlist.push({
      symbol: stock.symbol,
      name: stock.name
    });
    watchlistBtn.classList.add('active');
    showToast(`Added ${currentStock} to watchlist`, 'success');
  }
}

// Markets Page
function renderMarkets() {
  renderGlobalIndices();
  renderMarketMovers();
}

function renderGlobalIndices() {
  const container = document.getElementById('global-indices');
  container.innerHTML = '';
  
  // Add international indices (simulated)
  const globalIndices = [
    { name: 'FTSE 100', value: 7456.20, change: 23.45, changePercent: 0.32 },
    { name: 'DAX', value: 15234.80, change: -45.60, changePercent: -0.30 },
    { name: 'Nikkei 225', value: 32145.67, change: 123.45, changePercent: 0.39 },
    { name: 'Shanghai Composite', value: 3156.78, change: -12.34, changePercent: -0.39 }
  ];
  
  [...Object.values(marketData.indices), ...globalIndices].forEach(index => {
    const changeClass = index.change >= 0 ? 'positive' : 'negative';
    const changeSign = index.change >= 0 ? '+' : '';
    
    const indexCard = document.createElement('div');
    indexCard.className = 'index-card';
    indexCard.innerHTML = `
      <div class="index-name">${index.name}</div>
      <div class="index-value">${formatCurrency(index.value, false)}</div>
      <div class="index-change ${changeClass}">
        <span>${changeSign}${formatCurrency(index.change, false)} (${changeSign}${index.changePercent.toFixed(2)}%)</span>
      </div>
    `;
    container.appendChild(indexCard);
  });
}

function renderMarketMovers() {
  const stocks = Object.values(marketData.stocks);
  
  const gainers = stocks
    .filter(stock => stock.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 8);
  renderStockList(gainers, 'market-gainers');
  
  const losers = stocks
    .filter(stock => stock.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 8);
  renderStockList(losers, 'market-losers');
  
  const active = stocks
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 8);
  renderStockList(active, 'market-volume', 'volume');
}

// News Page
function renderNews() {
  const container = document.getElementById('news-grid');
  container.innerHTML = '';
  
  newsData.forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'card';
    newsCard.innerHTML = `
      <div class="card__body">
        <h3 style="margin-bottom: 12px; font-size: var(--font-size-lg);">${article.headline}</h3>
        <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: var(--font-size-sm); color: var(--color-text-secondary);">
          <span>${article.source}</span>
          <span>${article.time}</span>
        </div>
        <p style="margin: 0; color: var(--color-text-secondary); line-height: 1.5;">${article.excerpt}</p>
      </div>
    `;
    container.appendChild(newsCard);
  });
}

// Search Functionality
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  if (query.length === 0) {
    hideSearchResults();
    return;
  }
  
  const results = Object.values(marketData.stocks)
    .filter(stock => 
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    )
    .slice(0, 5);
  
  showSearchResults(results);
}

function handleMobileSearch(e) {
  const query = e.target.value.toLowerCase();
  if (query.length === 0) {
    hideMobileSearchResults();
    return;
  }
  
  const results = Object.values(marketData.stocks)
    .filter(stock => 
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    )
    .slice(0, 5);
  
  showMobileSearchResults(results);
}

function showSearchResults(results = []) {
  const container = elements.searchResults;
  container.innerHTML = '';
  
  if (results.length === 0) {
    container.classList.add('hidden');
    return;
  }
  
  results.forEach(stock => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result';
    resultItem.innerHTML = `
      <div style="font-weight: var(--font-weight-medium);">${stock.symbol}</div>
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${stock.name}</div>
    `;
    resultItem.addEventListener('click', () => {
      showStockDetail(stock.symbol);
      elements.searchInput.value = '';
      hideSearchResults();
    });
    container.appendChild(resultItem);
  });
  
  container.classList.remove('hidden');
}

function hideSearchResults() {
  elements.searchResults.classList.add('hidden');
}

function showMobileSearchResults(results = []) {
  const container = document.getElementById('mobile-search-results');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (results.length === 0) {
    container.classList.add('hidden');
    return;
  }
  
  results.forEach(stock => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result';
    resultItem.innerHTML = `
      <div style="font-weight: var(--font-weight-medium);">${stock.symbol}</div>
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${stock.name}</div>
    `;
    resultItem.addEventListener('click', () => {
      showStockDetail(stock.symbol);
      document.getElementById('mobile-search-input').value = '';
      hideMobileSearchResults();
      closeMobileMenu();
    });
    container.appendChild(resultItem);
  });
  
  container.classList.remove('hidden');
}

function hideMobileSearchResults() {
  const container = document.getElementById('mobile-search-results');
  if (container) {
    container.classList.add('hidden');
  }
}

// Theme Management
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  updateThemeIcon(newTheme);
}

function updateTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  
  if (!currentTheme) {
    document.documentElement.setAttribute('data-color-scheme', prefersDark ? 'dark' : 'light');
  }
  
  updateThemeIcon(document.documentElement.getAttribute('data-color-scheme'));
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggle.querySelector('svg');
  if (theme === 'dark') {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  } else {
    icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  }
}

// Price Simulation
function startPriceSimulation() {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
  }
  
  priceUpdateInterval = setInterval(() => {
    updatePrices();
    
    // Only update if user is authenticated
    if (!currentUser) return;
    
    if (currentPage === 'dashboard') {
      renderDashboard();
    } else if (currentPage === 'portfolio') {
      renderPortfolio();
    } else if (currentPage === 'watchlist') {
      renderWatchlist();
    } else if (currentPage === 'markets') {
      renderMarketMovers();
    } else if (currentPage === 'stock-detail' && currentStock) {
      updateStockDetail();
    }
  }, 5000); // Update every 5 seconds
}

function updatePrices() {
  // Update stock prices
  Object.values(marketData.stocks).forEach(stock => {
    const changePercent = (Math.random() - 0.5) * 0.04; // -2% to +2%
    const oldPrice = stock.price;
    stock.price = Math.max(0.01, stock.price * (1 + changePercent));
    
    // Update change from open
    stock.change = stock.price - stock.openPrice;
    stock.changePercent = (stock.change / stock.openPrice) * 100;
    
    // Flash price change animation
    flashPriceChange(stock.symbol, stock.price > oldPrice);
  });
  
  // Sync availableStocks with current stock prices
  marketData.availableStocks = Object.values(marketData.stocks).map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price
  }));
  
  // Update indices
  Object.values(marketData.indices).forEach(index => {
    const changePercent = (Math.random() - 0.5) * 0.02; // -1% to +1%
    index.value = Math.max(0.01, index.value * (1 + changePercent));
    
    // Update change from open
    index.change = index.value - index.openValue;
    index.changePercent = (index.change / index.openValue) * 100;
  });
}

function flashPriceChange(symbol, isPositive) {
  const elements = document.querySelectorAll(`[data-symbol="${symbol}"]`);
  elements.forEach(el => {
    el.classList.remove('price-flash', 'positive', 'negative');
    el.classList.add('price-flash', isPositive ? 'positive' : 'negative');
    setTimeout(() => {
      el.classList.remove('price-flash', 'positive', 'negative');
    }, 500);
  });
}

function updateStockDetail() {
  if (!currentStock) return;
  
  const stock = marketData.stocks[currentStock];
  if (!stock) return;
  
  document.getElementById('detail-price').textContent = formatCurrency(stock.price);
  
  const changeClass = stock.changePercent >= 0 ? 'positive' : 'negative';
  const changeSign = stock.changePercent >= 0 ? '+' : '';
  const changeEl = document.getElementById('detail-change');
  changeEl.textContent = `${changeSign}${formatCurrency(stock.change)} (${changeSign}${stock.changePercent.toFixed(2)}%)`;
  changeEl.className = `stock-change ${changeClass}`;
  
  renderStockStats(stock);
}

// Chart Management
function createMiniChart(symbol) {
  const ctx = document.getElementById(`chart-${symbol}`);
  if (!ctx) return;
  
  const stock = marketData.stocks[symbol];
  const data = generateChartData(stock);
  
  charts[`mini-${symbol}`] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.prices,
        borderColor: stock.changePercent >= 0 ? '#10B981' : '#EF4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: () => '',
            label: (context) => formatCurrency(context.parsed.y)
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

function createMainChart(symbol) {
  const ctx = document.getElementById('detail-chart');
  if (!ctx) return;
  
  // Destroy existing chart
  if (charts.main) {
    charts.main.destroy();
  }
  
  const stock = marketData.stocks[symbol];
  const data = generateDetailedChartData(stock);
  
  charts.main = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Price',
        data: data.prices,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#1FB8CD',
          borderWidth: 1,
          callbacks: {
            title: (context) => data.labels[context[0].dataIndex],
            label: (context) => `Price: ${formatCurrency(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: {
            maxTicksLimit: 8,
            color: 'var(--color-text-secondary)'
          }
        },
        y: {
          display: true,
          position: 'right',
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: (value) => formatCurrency(value),
            color: 'var(--color-text-secondary)'
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

function updateChartPeriod(period) {
  // Update active button
  document.querySelectorAll('.time-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });
  
  // Recreate chart with new period data
  if (currentStock) {
    createMainChart(currentStock);
  }
}

function generateChartData(stock) {
  const points = 20;
  const labels = [];
  const prices = [];
  
  // Generate time labels (last 20 periods)
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 15); // 15-minute intervals
    labels.push(date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  }
  
  // Generate price data with some volatility
  let currentPrice = stock.openPrice;
  for (let i = 0; i < points; i++) {
    const volatility = (Math.random() - 0.5) * 0.02; // ±1%
    currentPrice = Math.max(0.01, currentPrice * (1 + volatility));
    prices.push(Number(currentPrice.toFixed(2)));
  }
  
  // Ensure last price matches current price
  prices[prices.length - 1] = Number(stock.price.toFixed(2));
  
  return { labels, prices };
}

function generateDetailedChartData(stock) {
  const points = 50;
  const labels = [];
  const prices = [];
  
  // Generate time labels
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 10); // 10-minute intervals
    labels.push(date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  }
  
  // Generate more detailed price data
  let currentPrice = stock.openPrice;
  for (let i = 0; i < points; i++) {
    const volatility = (Math.random() - 0.5) * 0.015; // ±0.75%
    currentPrice = Math.max(0.01, currentPrice * (1 + volatility));
    prices.push(Number(currentPrice.toFixed(2)));
  }
  
  // Ensure last price matches current price
  prices[prices.length - 1] = Number(stock.price.toFixed(2));
  
  return { labels, prices };
}

// Utility Functions
function formatCurrency(value, showDollar = true) {
  if (typeof value !== 'number') return '$0.00';
  const formatted = value.toFixed(2);
  return showDollar ? `$${formatted}` : formatted;
}

function formatVolume(volume) {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(1) + 'B';
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K';
  }
  return volume.toString();
}

function formatMarketCap(marketCap) {
  if (marketCap >= 1000000000000) {
    return '$' + (marketCap / 1000000000000).toFixed(2) + 'T';
  } else if (marketCap >= 1000000000) {
    return '$' + (marketCap / 1000000000).toFixed(1) + 'B';
  } else if (marketCap >= 1000000) {
    return '$' + (marketCap / 1000000).toFixed(1) + 'M';
  }
  return '$' + marketCap.toString();
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-message">${message}</div>
      <button class="toast-close">&times;</button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto hide after 3 seconds
  const hideTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
  
  // Manual close
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(hideTimeout);
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

// Prevent navigation without authentication
function requireAuth() {
  if (!currentUser) {
    showAuthenticationRequired();
    return false;
  }
  return true;
}

// Navigation with Authentication Check
function navigateTo(page) {
  if (page !== 'login' && !requireAuth()) {
    return;
  }
  
  currentPage = page;
  
  // Update desktop nav active state
  elements.navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  
  // Update mobile nav active state
  updateMobileMenuActiveState();
  
  // Show/hide pages
  elements.pages.forEach(pageEl => {
    pageEl.classList.toggle('hidden', pageEl.id !== `${page}-page`);
  });
  
  // Load page content
  switch(page) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'markets':
      renderMarkets();
      break;
    case 'portfolio':
      renderPortfolio();
      break;
    case 'watchlist':
      renderWatchlist();
      break;
    case 'news':
      renderNews();
      break;
  }
}