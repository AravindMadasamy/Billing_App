// Shared UI interactions for dashboard pages
const body = document.body;
const appShell = document.querySelector(".app-shell");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
const themeToggle = document.getElementById("themeToggle");
const profileTrigger = document.getElementById("profileTrigger");
const profileDropdown = document.getElementById("profileDropdown");
let languageSwitch = null;

// ── App Settings System ──
const defaultSettings = {
  shopName: "SRI AYYAN",
  shopTagline: "Furniture Billing",
  phone: "+91 90000 44556",
  address: "221 Artisan Avenue, Bengaluru, India",
  gstRate: 18,
  primaryColor: "#1f6feb",
  receiptFooter: "Thank you for your business!"
};

function getSettings() {
  const saved = localStorage.getItem("pos_settings");
  return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
}

function applySettings() {
  const s = getSettings();
  
  // 1. Update Brand Text (Sidebar & Header)
  document.querySelectorAll(".brand__text strong, .navbar .brand").forEach(el => {
    // For landing page brand, we want to keep the "SRI AYYAN" part but update it
    if (el.classList.contains("brand") && !el.classList.contains("brand__text")) {
      const subtitle = el.querySelector("span");
      el.childNodes[0].textContent = s.shopName + " ";
      if (subtitle) subtitle.textContent = s.shopTagline;
    } else {
      el.textContent = s.shopName;
    }
  });
  
  document.querySelectorAll(".brand__text span").forEach(el => el.textContent = s.shopTagline);
  document.querySelectorAll(".brand__mark").forEach(el => {
    el.textContent = s.shopName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  });

  // 2. Apply Custom Theme Color
  document.documentElement.style.setProperty("--primary", s.primaryColor);
  document.documentElement.style.setProperty("--accent-color", s.primaryColor); // For landing page
  
  // Update theme color meta for mobile browser chrome
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = "theme-color";
    document.head.appendChild(metaTheme);
  }
  metaTheme.content = s.primaryColor;

  // 3. Update Page Titles if they contain the brand name
  if (document.title.includes("|")) {
    const parts = document.title.split("|");
    document.title = `${s.shopName} | ${parts[1].trim()}`;
  } else if (document.body.dataset.page === "landing" || !document.body.dataset.page) {
     // If it's the landing page (often no data-page or explicitly 'landing')
     const parts = document.title.split("|");
     if (parts.length > 1) {
       document.title = `${s.shopName} | ${parts[1].trim()}`;
     }
  }

  // 4. Landing Page Specific Blocks (Footer Contacts)
  const footerEmail = document.querySelector('footer .footer-links li:nth-child(1) a');
  const footerPhone = document.querySelector('footer .footer-links li:nth-child(2) a');
  const footerAddr  = document.querySelector('footer .footer-links li:nth-child(3) a');
  
  if (footerPhone) footerPhone.textContent = s.phone;
  if (footerAddr) footerAddr.textContent = s.address;
  // Auto-generate email based on shop name if it looks like a placeholder
  if (footerEmail && (footerEmail.textContent.includes("hello@") || footerEmail.textContent.includes("example.com"))) {
    footerEmail.textContent = `contact@${s.shopName.toLowerCase().replace(/\s+/g, '')}.com`;
  }

  // 5. Update Global Metrics (Sidebar Balance)
  const invoices = getInvoices();
  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const money = (v) => `Rs. ${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  
  document.querySelectorAll(".sidebar-metric strong").forEach(el => {
    el.textContent = money(totalSales);
  });
}

function saveSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem("pos_settings", JSON.stringify(updated));
  applySettings();
}

// ── Product Inventory System ──
const defaultProducts = [
  { barcode: "890100100001", name: "Royal Sofa Set", price: 32000, tag: "SO", category: "Seating", stock: 14, desc: "3 seater premium sofa" },
  { barcode: "890100100002", name: "Oak Dining Table", price: 24500, tag: "TB", category: "Tables", stock: 9, desc: "6 seat wooden dining" },
  { barcode: "890100100003", name: "Classic Wardrobe", price: 28900, tag: "WR", category: "Storage", stock: 6, desc: "2 door storage unit" },
  { barcode: "890100100004", name: "King Bed Frame", price: 39000, tag: "BD", category: "Bedroom", stock: 4, desc: "Solid wood bedroom piece" },
  { barcode: "890100100005", name: "Accent Chair", price: 8600, tag: "CH", category: "Seating", stock: 12, desc: "Durable velvet chair" },
  { barcode: "890100100006", name: "Coffee Table", price: 11200, tag: "CF", category: "Tables", stock: 8, desc: "Minimalist glass top" },
  { barcode: "890100100007", name: "TV Unit", price: 15750, tag: "TV", category: "Storage", stock: 5, desc: "Modern wall unit" }
];

function getProducts() {
  const saved = localStorage.getItem("pos_products");
  return saved ? JSON.parse(saved) : defaultProducts;
}

function saveProducts(list) {
  localStorage.setItem("pos_products", JSON.stringify(list));
}

// ── Customer Management System ──
const defaultCustomers = [
  { id: 1, name: "Sneha Verma", phone: "+91 98765 43210", address: "12 Lake View Road, Pune" },
  { id: 2, name: "Amit Joshi", phone: "+91 99887 66554", address: "44 Green Park, Jaipur" },
  { id: 3, name: "Karan Malhotra", phone: "+91 98111 22003", address: "22 Palm Avenue, Delhi" },
  { id: 4, name: "Riya Kapoor", phone: "+91 99000 11223", address: "7 Cedar Street, Chandigarh" }
];

function getCustomers() {
  const saved = localStorage.getItem("pos_customers");
  return saved ? JSON.parse(saved) : defaultCustomers;
}

function saveCustomers(list) {
  localStorage.setItem("pos_customers", JSON.stringify(list));
}

// ── Category Management System ──
const defaultCategories = [
  { id: 1, name: "Seating", desc: "Sofas, chairs, recliners", tag: "SE" },
  { id: 2, name: "Tables", desc: "Dining, coffee, office", tag: "TB" },
  { id: 3, name: "Storage", desc: "Wardrobes and cabinets", tag: "ST" },
  { id: 4, name: "Bedroom", desc: "Beds and nightstands", tag: "BD" }
];

function getCategories() {
  const saved = localStorage.getItem("pos_categories");
  return saved ? JSON.parse(saved) : defaultCategories;
}

function saveCategories(list) {
  localStorage.setItem("pos_categories", JSON.stringify(list));
}

function getCategoryArt(catName, catTag) {
  const name = (catName || "").toLowerCase();
  const tag = (catTag || "").toLowerCase();
  const known = ["sofa", "table", "storage", "bed"];
  
  // 1. Check if tag matches known art
  if (known.includes(tag)) return tag + "-art";
  if (tag === "se") return "sofa-art";
  if (tag === "tb") return "table-art";
  if (tag === "st") return "storage-art";
  if (tag === "bd") return "bed-art";

  // 2. Keyword matching in name
  if (name.includes("sofa") || name.includes("seating") || name.includes("chair")) return "sofa-art";
  if (name.includes("table") || name.includes("desk")) return "table-art";
  if (name.includes("storage") || name.includes("wardrobe") || name.includes("cabinet")) return "storage-art";
  if (name.includes("bed") || name.includes("bedroom") || name.includes("mattress")) return "bed-art";
  
  return "default-art";
}

// ── Invoice / Sales Persistence System ──
function getInvoices() {
  const saved = localStorage.getItem("pos_invoices");
  return saved ? JSON.parse(saved) : [];
}

function saveInvoices(list) {
  localStorage.setItem("pos_invoices", JSON.stringify(list));
}

// Global Sync across Tabs
window.addEventListener("storage", (e) => {
  if (e.key === "pos_settings") {
    applySettings();
  }
});

// Run app initialization on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/** ── App Logic Router ── **/
function initApp() {
  applySettings();
  const page = document.body.dataset.page;
  
  if (page === "dashboard") initDashboardPage();
  else if (page === "products") initProductsPage();
  else if (page === "customers") initCustomersPage();
  else if (page === "billing") initBillingPage();
  else if (page === "invoice") initReportsPage();
  else if (page === "categories") initCategoriesPage();
  else if (page === "settings") initSettingsPage();
}

/** ── Global Utilities ── **/
function showToast(message, type = "success") {
  const toast = document.getElementById("posToast");
  const toastMsg = document.getElementById("posToastMsg");
  if (!toast || !toastMsg) return;
  
  toastMsg.textContent = message;
  toast.className = `pos-toast ${type} open`;
  
  setTimeout(() => {
    toast.classList.remove("open");
  }, 3000);
}

function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

function flashSuccess() {
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed; inset:0; background:rgba(20,154,98,0.1); pointer-events:none; z-index:9999; animation: flash 0.3s ease-out forwards;";
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 300);
}

function initChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  const invoices = getInvoices();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesData = new Array(12).fill(0);
  
  invoices.forEach(inv => {
    const d = new Date(inv.date);
    salesData[d.getMonth()] += inv.total;
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Sales (Rs.)',
        data: salesData,
        backgroundColor: '#1f6feb',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } }
      }
    }
  });
}

const translations = {
  en: {
    nav_dashboard: "Dashboard",
    nav_products: "Products",
    nav_customers: "Customers",
    nav_billing: "Billing",
    nav_reports: "Reports",
    nav_settings: "Settings",
    theme: "Theme",
    top_search_dashboard: "Search bill no, customer, product...",
    top_search_products: "Search products, category, stock...",
    top_search_customers: "Search customers, phone, city...",
    top_search_billing: "Search invoice, customer, item...",
    top_search_invoice: "Search invoice, customer, amount...",
    top_search_settings: "Search setting, preference, tax...",
    sale_billing: "Sale Billing",
    create_invoice: "Create Furniture Invoice",
    hero_desc: "Use picture-led item choices, review the bill table, then generate a clean invoice.",
    invoice_preview: "Invoice Preview",
    generate_bill: "Generate Bill",
    cat_sofa: "Sofa",
    cat_table: "Table",
    cat_wardrobe: "Wardrobe",
    cat_bed: "Bed",
    party_details: "Party Details",
    party_details_desc: "Select customer and sale information",
    phone: "Phone",
    balance: "Balance",
    choose_item: "Choose a furniture item",
    add_product_bill: "Add Product To Bill",
    billing_tip: "Billing Tip",
    billing_tip_desc: "Tap a furniture picture above or choose from the list here to add items quickly.",
    item_details: "Item Details",
    live_bill_table: "Live bill table",
    retail_sale: "Retail Sale",
    product_name: "Product Name",
    quantity: "Qnty",
    price: "Price",
    total: "Total",
    bill_summary: "Bill Summary",
    payment_tax_details: "Payment and tax details",
    subtotal: "Subtotal",
    gst: "GST (18%)",
    discount: "Discount",
    grand_total: "Grand Total",
    payment_mode: "Payment Mode",
    cash: "Cash",
    upi: "UPI",
    card: "Card",
    dashboard_overview: "Business Overview",
    dashboard_title: "SRI AYYAN Business Dashboard",
    dashboard_desc: "Track sales, inventory, furniture categories and daily billing with a more visual workspace anyone can follow.",
    create_sale_bill: "Create Sale Bill",
    record_payment: "Record Payment",
    customers_title: "Customers",
    products_title: "Products",
    invoice_title: "Invoice Preview",
    settings_title: "Business Preferences"
  },
  ta: {
    nav_dashboard: "முகப்பு",
    nav_products: "பொருட்கள்",
    nav_customers: "வாடிக்கையாளர்கள்",
    nav_billing: "பில்லிங்",
    nav_reports: "அறிக்கைகள்",
    nav_settings: "அமைப்புகள்",
    theme: "தீம்",
    top_search_dashboard: "பில் எண், வாடிக்கையாளர், பொருள் தேடு...",
    top_search_products: "பொருட்கள், வகை, ஸ்டாக் தேடு...",
    top_search_customers: "வாடிக்கையாளர், போன், ஊர் தேடு...",
    top_search_billing: "ரசீது, வாடிக்கையாளர், பொருள் தேடு...",
    top_search_invoice: "ரசீது, வாடிக்கையாளர், தொகை தேடு...",
    top_search_settings: "அமைப்புகள், வரி தேடு...",
    sale_billing: "விற்பனை பில்லிங்",
    create_invoice: "பர்னிச்சர் ரசீது உருவாக்கு",
    hero_desc: "படங்களுடன் பொருட்களைத் தேர்வு செய்யவும், பில் டேபிளை சரிபார்த்து, புதிய ரசீதை உருவாக்கவும்.",
    invoice_preview: "ரசீது முன்னோட்டம்",
    generate_bill: "பில் உருவாக்கு",
    cat_sofa: "சோபா",
    cat_table: "டேபிள்",
    cat_wardrobe: "வார்ட்ரோப்",
    cat_bed: "கட்டில்",
    party_details: "நபர் விவரங்கள்",
    party_details_desc: "வாடிக்கையாளர் மற்றும் விற்பனை விவரங்களைத் தேர்ந்தெடுக்கவும்",
    phone: "போன்",
    balance: "மீதம்",
    choose_item: "பர்னிச்சர் பொருளைத் தேர்ந்தெடுக்கவும்",
    add_product_bill: "பில்லில் பொருளைச் சேர்",
    billing_tip: "பில்லிங் குறிப்பு",
    billing_tip_desc: "பொருட்களை விரைவாக சேர்க்க மேலே உள்ள பர்னிச்சர் படத்தை தட்டவும் அல்லது பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்.",
    item_details: "பொருள் விவரங்கள்",
    live_bill_table: "நேரடி பில் டேபிள்",
    retail_sale: "சில்லறை விற்பனை",
    product_name: "பொருள் பெயர்",
    quantity: "அளவு",
    price: "விலை",
    total: "மொத்தம்",
    bill_summary: "பில் சுருக்கம்",
    payment_tax_details: "பணம் மற்றும் வரி விவரங்கள்",
    subtotal: "சப்டோட்டல்",
    gst: "ஜிஎஸ்டி (18%)",
    discount: "தள்ளுபடி",
    grand_total: "மொத்த தொகை",
    payment_mode: "பணம் செலுத்தும் முறை",
    cash: "ரொக்கம்",
    upi: "யுபிஐ",
    card: "கார்டு",
    dashboard_overview: "வணிக மேலோட்டம்",
    dashboard_title: "SRI AYYAN வணிக டேஷ்போர்டு",
    dashboard_desc: "விற்பனை, இருப்பு, பர்னிச்சர் வகைகள் மற்றும் தினசரி பில்லிங்கை எளிதான முறையில் கண்காணிக்கவும்.",
    create_sale_bill: "விற்பனை பில் உருவாக்கு",
    record_payment: "பேமெண்ட் பதிவு செய்",
    customers_title: "வாடிக்கையாளர்கள்",
    products_title: "பொருட்கள்",
    invoice_title: "ரசீது முன்னோட்டம்",
    settings_title: "வணிக விருப்பங்கள்"
  },
  hi: {
    nav_dashboard: "डैशबोर्ड",
    nav_products: "उत्पाद",
    nav_customers: "ग्राहक",
    nav_billing: "बिलिंग",
    nav_reports: "रिपोर्ट",
    nav_settings: "सेटिंग्स",
    theme: "थीम",
    top_search_dashboard: "बिल नंबर, ग्राहक, उत्पाद खोजें...",
    top_search_products: "उत्पाद, श्रेणी, स्टॉक खोजें...",
    top_search_customers: "ग्राहक, फोन, शहर खोजें...",
    top_search_billing: "चालान, ग्राहक, आइटम खोजें...",
    top_search_invoice: "चालान, ग्राहक, राशि खोजें...",
    top_search_settings: "सेटिंग्स, प्राथमिकता, कर खोजें...",
    sale_billing: "सेल बिलिंग",
    create_invoice: "फर्नीचर इनवॉइस बनाएं",
    hero_desc: "चित्र-आधारित आइटम चुनें, बिल तालिका की समीक्षा करें, और एक चालान जेनरेट करें।",
    invoice_preview: "इनवॉइस पूर्वावलोकन",
    generate_bill: "बिल जेनरेट करें",
    cat_sofa: "सोफा",
    cat_table: "टेबल",
    cat_wardrobe: "वार्डरोब",
    cat_bed: "बेड",
    party_details: "पार्टी विवरण",
    party_details_desc: "ग्राहक और बिक्री की जानकारी चुनें",
    phone: "फ़ोन",
    balance: "बकाया",
    choose_item: "फर्नीचर आइटम चुनें",
    add_product_bill: "बिल में उत्पाद जोड़ें",
    billing_tip: "बिलिंग टिप",
    billing_tip_desc: "जल्दी से आइटम जोड़ने के लिए ऊपर दिए गए फर्नीचर चित्र पर टैप करें या यहाँ सूची से चुनें।",
    item_details: "आइटम विवरण",
    live_bill_table: "लाइव बिल टेबल",
    retail_sale: "खुदरा बिक्री",
    product_name: "उत्पाद का नाम",
    quantity: "मात्रा",
    price: "मूल्य",
    total: "कुल",
    bill_summary: "बिल सारांश",
    payment_tax_details: "भुगतान और कर विवरण",
    subtotal: "उप-कुल",
    gst: "जीएसटी (18%)",
    discount: "छूट",
    grand_total: "कुल योग",
    payment_mode: "भुगतान का प्रकार",
    cash: "नकद",
    upi: "यूपीआई",
    card: "कार्ड",
    dashboard_overview: "व्यवसाय अवलोकन",
    dashboard_title: "SRI AYYAN बिजनेस डैशबोर्ड",
    dashboard_desc: "बिक्री, इन्वेंट्री, फर्नीचर श्रेणियों और दैनिक बिलिंग को अधिक दृश्यमान रूप से ट्रैक करें।",
    create_sale_bill: "सेल बिल बनाएं",
    record_payment: "भुगतान रिकॉर्ड करें",
    customers_title: "ग्राहक",
    products_title: "उत्पाद",
    invoice_title: "इनवॉइस पूर्वावलोकन",
    settings_title: "व्यावसायिक प्राथमिकताएं"
  }
};

function ensureLanguageSwitch() {
  const topbarActions = document.querySelector(".topbar .topbar__actions");
  if (!topbarActions) return null;

  let select = document.getElementById("languageSwitch");
  if (!select) {
    select = document.createElement("select");
    select.id = "languageSwitch";
    select.className = "select-control language-switch";
    select.setAttribute("aria-label", "Language switch");
    select.innerHTML = `
      <option value="en">English</option>
      <option value="ta">Tamil</option>
      <option value="hi">Hindi</option>
    `;
    topbarActions.prepend(select);
  }

  return select;
}

function applyMappedTranslations(dict) {
  const map = [
    { selector: '.sidebar .nav-link[href="index.html"] span:last-child', key: 'nav_dashboard' },
    { selector: '.sidebar .nav-link[href="products.html"] span:last-child', key: 'nav_products' },
    { selector: '.sidebar .nav-link[href="customers.html"] span:last-child', key: 'nav_customers' },
    { selector: '.sidebar .nav-link[href="billing.html"] span:last-child', key: 'nav_billing' },
    { selector: '.sidebar .nav-link[href="invoice.html"] span:last-child', key: 'nav_reports' },
    { selector: '.sidebar .nav-link[href="settings.html"] span:last-child', key: 'nav_settings' },
    { selector: '.theme-switch span', key: 'theme' }
  ];

  const page = document.body?.dataset?.page || '';
  if (page === 'dashboard') {
    map.push(
      { selector: '.topbar .searchbar input', key: 'top_search_dashboard', attr: 'placeholder' },
      { selector: '.hero-band .eyebrow', key: 'dashboard_overview' },
      { selector: '.hero-band h1', key: 'dashboard_title' },
      { selector: '.hero-band .muted', key: 'dashboard_desc' },
      { selector: '.hero-band__actions .btn.btn-primary', key: 'create_sale_bill' },
      { selector: '.hero-band__actions .btn.btn-secondary', key: 'record_payment' }
    );
  }

  if (page === 'products') {
    map.push(
      { selector: '.topbar .searchbar input', key: 'top_search_products', attr: 'placeholder' },
      { selector: '.page-heading h1', key: 'products_title' }
    );
  }

  if (page === 'customers') {
    map.push(
      { selector: '.topbar .searchbar input', key: 'top_search_customers', attr: 'placeholder' },
      { selector: '.page-heading h1', key: 'customers_title' }
    );
  }

  if (page === 'billing') {
    map.push({ selector: '.topbar .searchbar input', key: 'top_search_billing', attr: 'placeholder' });
  }

  if (page === 'invoice') {
    map.push(
      { selector: '.topbar .searchbar input', key: 'top_search_invoice', attr: 'placeholder' },
      { selector: '.hero-band h1', key: 'invoice_title' }
    );
  }

  if (page === 'settings') {
    map.push(
      { selector: '.topbar .searchbar input', key: 'top_search_settings', attr: 'placeholder' },
      { selector: '.hero-band h1', key: 'settings_title' }
    );
  }

  map.forEach((item) => {
    const value = dict[item.key];
    if (!value) return;
    document.querySelectorAll(item.selector).forEach((el) => {
      if (item.attr === 'placeholder') el.setAttribute('placeholder', value);
      else el.textContent = value;
    });
  });
}

function applyLanguage(langCode) {
  const lang = translations[langCode] ? langCode : 'en';
  const dict = translations[lang];

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-option]').forEach((el) => {
    const key = el.dataset.i18nOption;
    if (dict[key]) el.textContent = dict[key];
  });

  applyMappedTranslations(dict);

  document.querySelectorAll('.sidebar .nav-link').forEach((link) => {
    const label = link.querySelector('span:last-child')?.textContent?.trim() || link.textContent.trim();
    if (label) link.setAttribute('title', label);
  });

  localStorage.setItem('SRI AYYAN-language', lang);
  if (languageSwitch) languageSwitch.value = lang;
}

function initLanguageSwitch() {
  languageSwitch = ensureLanguageSwitch();
  const savedLang = localStorage.getItem('SRI AYYAN-language') || 'en';
  applyLanguage(savedLang);

  languageSwitch?.addEventListener('change', (event) => {
    applyLanguage(event.target.value);
  });
}

const currency = (value) =>
  `Rs. ${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function restoreTheme() {
  const savedTheme = localStorage.getItem("SRI AYYAN-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  }
}

function closeMobileSidebar() {
  if (window.innerWidth <= 920) {
    sidebar?.classList.remove("open");
  }
}

function initSidebar() {
  const navLinks = document.querySelectorAll(".sidebar .nav-link");

  navLinks.forEach((link) => {
    const label = link.querySelector("span:last-child")?.textContent?.trim() || link.textContent.trim();
    if (label) link.setAttribute("title", label);
  });

  sidebarToggle?.addEventListener("click", () => {
    if (window.innerWidth > 920) {
      appShell?.classList.toggle("sidebar-collapsed");
    }
  });

  mobileSidebarToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (window.innerWidth <= 920) {
      sidebar?.classList.toggle("open");
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileSidebar();
    });
  });

  document.addEventListener("click", (event) => {
    if (!sidebar || !mobileSidebarToggle) return;
    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedToggle = mobileSidebarToggle.contains(event.target);

    if (window.innerWidth <= 920 && !clickedInsideSidebar && !clickedToggle) {
      sidebar.classList.remove("open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      sidebar?.classList.remove("open");
    }
  });
}

function initTheme() {
  restoreTheme();

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    localStorage.setItem(
      "SRI AYYAN-theme",
      body.classList.contains("dark-theme") ? "dark" : "light"
    );
  });
}

function initProfileDropdown() {
  profileTrigger?.addEventListener("click", () => {
    profileDropdown?.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!profileTrigger || !profileDropdown) return;
    if (!profileTrigger.contains(event.target) && !profileDropdown.contains(event.target)) {
      profileDropdown.classList.remove("open");
    }
  });
}

function initModals() {
  const openers = document.querySelectorAll("[data-modal-target]");
  const closers = document.querySelectorAll("[data-modal-close]");

  openers.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById(button.dataset.modalTarget);
      modal?.classList.add("open");
    });
  });

  closers.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".modal")?.classList.remove("open");
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("open");
      }
    });
  });
}

function initTableSearch() {
  const searchInputs = document.querySelectorAll('input[type="search"], .pos-barcode-input');
  searchInputs.forEach(input => {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      // Find the closest container to filter (panel, table-wrap, or the whole main area)
      const container = input.closest(".panel") || input.closest(".main-panel") || input.closest("main") || document.body;
      
      // Target rows in tables, category cards, or POS quick cards
      const rows = container.querySelectorAll("table tbody tr, .category-card, .pos-quick-card, .mini-card");
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        // Exception: If we are in POS, the barcode input shouldn't hide items in the cart, 
        // only items in the quick grid or search results.
        if (input.id === "posBarcodeInput" && row.closest(".pos-cart-container")) return;
        
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  });
}

function updateBillSummary() {
  const rows = document.querySelectorAll("#billingBody tr");
  const subtotalElement = document.getElementById("subtotalAmount");
  const gstElement = document.getElementById("gstAmount");
  const grandTotalElement = document.getElementById("grandTotalAmount");

  if (!rows.length || !subtotalElement || !gstElement || !grandTotalElement) return;

  let subtotal = 0;

  rows.forEach((row) => {
    const price = Number(row.dataset.price || 0);
    const qtyInput = row.querySelector(".qty-input");
    const quantity = Math.max(1, Number(qtyInput?.value || 1));
    const lineTotal = price * quantity;
    const totalCell = row.querySelector(".line-total");

    if (qtyInput) qtyInput.value = quantity;
    if (totalCell) totalCell.textContent = currency(lineTotal);
    subtotal += lineTotal;
  });

  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  subtotalElement.textContent = currency(subtotal);
  gstElement.textContent = currency(gst);
  grandTotalElement.textContent = currency(grandTotal);
}


function addProductByName(name) {
  const productSelector = document.getElementById("productSelector");
  const addBillItem = document.getElementById("addBillItem");
  if (!productSelector || !addBillItem || !name) return;

  const option = Array.from(productSelector.options).find((item) => item.value === name);
  if (!option) return;

  productSelector.value = name;
  addBillItem.click();
}

function initBilling() {
  const billingBody = document.getElementById("billingBody");
  const productSelector = document.getElementById("productSelector");
  const addBillItem = document.getElementById("addBillItem");
  const pickCards = document.querySelectorAll("[data-pick-name]");

  if (pickCards.length) {
    pickCards.forEach((card) => {
      card.addEventListener("click", () => addProductByName(card.dataset.pickName));
    });
  }

  if (!billingBody || !productSelector || !addBillItem) return;

  billingBody.addEventListener("input", (event) => {
    if (event.target.classList.contains("qty-input")) {
      updateBillSummary();
    }
  });

  addBillItem.addEventListener("click", () => {
    const selectedOption = productSelector.options[productSelector.selectedIndex];
    const name = selectedOption.value;
    const price = selectedOption.dataset.price;

    if (!name || !price) return;

    const existingRow = Array.from(billingBody.querySelectorAll("tr")).find((row) =>
      row.innerText.includes(name)
    );

    if (existingRow) {
      const qtyInput = existingRow.querySelector(".qty-input");
      qtyInput.value = Number(qtyInput.value || 1) + 1;
      updateBillSummary();
      return;
    }

    let artClass = "sofa-art";
    if (name.toLowerCase().includes("table")) artClass = "table-art";
    if (name.toLowerCase().includes("wardrobe")) artClass = "storage-art";
    if (name.toLowerCase().includes("bed")) artClass = "bed-art";

    const row = document.createElement("tr");
    row.dataset.price = price;
    row.innerHTML = `
      <td><div class="table-visual"><span class="table-visual__icon ${artClass} mini-art"></span><div><strong>${name}</strong><small>Furniture item</small></div></div></td>
      <td><input class="qty-input" type="number" min="1" value="1"></td>
      <td>${currency(price)}</td>
      <td class="line-total">${currency(price)}</td>
    `;
    billingBody.appendChild(row);
    updateBillSummary();
  });

  updateBillSummary();
}
function initInvoicePrint() {
  document.getElementById("printInvoice")?.addEventListener("click", () => window.print());
}

function initChart(dynamicValues = null) {
  const canvas = document.getElementById("salesChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  
  // Dynamic Data Logic
  let values = dynamicValues;
  if (!values) {
    const invoices = getInvoices();
    const currentYear = new Date().getFullYear();
    values = new Array(12).fill(0);
    invoices.forEach(inv => {
      const date = new Date(inv.date);
      if (date.getFullYear() === currentYear) {
        values[date.getMonth()] += inv.total;
      }
    });
  }

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  const padding = 48;
  const maxVal = Math.max(...values, 1000); // Ensure at least some scale
  const rootStyles = getComputedStyle(document.body);
  const textColor = rootStyles.getPropertyValue("--text-soft").trim();
  const lineColor = rootStyles.getPropertyValue("--primary").trim();
  const fillColor = body.classList.contains("dark-theme")
    ? "rgba(132, 196, 167, 0.18)"
    : "rgba(47, 108, 87, 0.16)";

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(120, 130, 120, 0.18)";
  ctx.fillStyle = textColor;
  ctx.font = "12px Segoe UI";

  for (let i = 0; i <= 5; i += 1) {
    const y = canvas.offsetHeight - padding - (i * (canvas.offsetHeight - 96) / 5);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.offsetWidth - 20, y);
    ctx.stroke();
  }

  const points = values.map((value, index) => {
    const x = padding + (index * ((canvas.offsetWidth - 96) / (values.length - 1)));
    const y = canvas.offsetHeight - padding - ((value / maxVal) * (canvas.offsetHeight - 120));
    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(points[0].x, canvas.offsetHeight - padding);
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(points[points.length - 1].x, canvas.offsetHeight - padding);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 3;
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    ctx.beginPath();
    ctx.fillStyle = lineColor;
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText(labels[index], point.x - 10, canvas.offsetHeight - 18);
  });
}

window.addEventListener("resize", initChart);

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initTheme();
  initProfileDropdown();
  initLanguageSwitch();
  initModals();
  initTableSearch();
  initBilling();
  initBillingPOS();
  initInvoicePrint();
  initChart();
  initSettingsPage();
  initProductsPage();
  initCustomersPage();
  initCategoriesPage();
  if (body.dataset.page === "dashboard") initDashboardPage();
  if (body.dataset.page === "invoice") initReportsPage();
});








function initBillingPOS() {
  const barcodeInput = document.getElementById("posBarcodeInput");
  if (!barcodeInput) return;

  const scanBtn = document.getElementById("posScanBtn");
  const clearBtn = document.getElementById("posClearBtn");
  const openScannerBtn = document.getElementById("posOpenScannerBtn");
  const closeScannerBtn = document.getElementById("posCloseScannerBtn");
  const simulateScanBtn = document.getElementById("posSimulateScanBtn");
  const scannerModal = document.getElementById("posScannerModal");
  const quickGrid = document.getElementById("posQuickGrid");
  const billBody = document.getElementById("posBillBody");
  const historyList = document.getElementById("posHistoryList");
  const discountInput = document.getElementById("posDiscountInput");
  const subtotalEl = document.getElementById("posSubtotal");
  const gstEl = document.getElementById("posGst");
  const grandEl = document.getElementById("posGrandTotal");
  const toast = document.getElementById("posToast");
  const panel = document.getElementById("posBarcodePanel");
  const scanMessage = document.getElementById("posScanMessage");

  const catalog = getProducts();

  const byBarcode = new Map(catalog.map((p) => [p.barcode, p]));
  const items = new Map();
  const history = [];
  let selectedBarcode = "";

  const money = (v) => `Rs. ${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  function keepFocus() {
    setTimeout(() => barcodeInput.focus(), 0);
  }

  function beep() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  }

  function showToast(msg, type = "success", actionLabel = "", actionFn = null) {
    if (!toast) return;
    toast.className = `pos-toast show ${type}`;
    toast.innerHTML = "";
    const m = document.createElement("div");
    m.textContent = msg;
    toast.appendChild(m);

    if (actionLabel && actionFn) {
      const b = document.createElement("button");
      b.className = "pos-toast-action";
      b.type = "button";
      b.textContent = actionLabel;
      b.addEventListener("click", actionFn);
      toast.appendChild(b);
    }

    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function flashSuccess() {
    panel?.classList.add("success-flash");
    setTimeout(() => panel?.classList.remove("success-flash"), 320);
  }

  function renderQuick() {
    quickGrid.innerHTML = "";
    // Show all products in the quick grid instead of just first 6
    catalog.forEach((p) => {
      const card = document.createElement("button");
      card.className = "pos-quick-card";
      card.type = "button";
      card.innerHTML = `<div class="pos-quick-thumb">${p.tag}</div><strong>${p.name}</strong><span>${p.category}</span><span class="trend">${money(p.price)}</span>`;
      card.addEventListener("click", () => {
        addItem(p, "quick");
        keepFocus();
      });
      quickGrid.appendChild(card);
    });
  }

  function totals() {
    const s = getSettings();
    let subtotal = 0;
    items.forEach((i) => subtotal += i.price * i.qty);
    const gstTotal = subtotal * (s.gstRate / 100);
    const discount = Math.max(0, Math.min(Number(discountInput.value || 0), subtotal + gstTotal));
    const grand = subtotal + gstTotal - discount;

    subtotalEl.textContent = money(subtotal);
    gstEl.textContent = money(gstTotal);
    const gstLabel = document.querySelector(".tot-row span:nth-child(1)"); // Subtotal row label check
    // Try to find the GST label to update the text (e.g. GST 18% -> GST 12%)
    const gstLabelEl = Array.from(document.querySelectorAll('.tot-row span')).find(el => el.textContent.includes('GST'));
    if (gstLabelEl) gstLabelEl.textContent = `GST (${s.gstRate}%)`;

    grandEl.textContent = money(grand);
    if (Number(discountInput.value) !== discount) discountInput.value = discount;
  }

  function qtyControl(barcode, qty) {
    return `<div class="pos-qty-control" data-barcode="${barcode}"><button type="button" class="pos-qty-minus">-</button><input class="pos-qty-input" type="number" min="1" value="${qty}"><button type="button" class="pos-qty-plus">+</button></div>`;
  }

  // ── Cart container (new div-based layout) ──
  const cartContainer = document.getElementById("posCartItems");
  const cartEmpty     = document.getElementById("posCartEmpty");
  const itemCountEl   = document.getElementById("posItemCount");

  function selectRow(barcode) {
    selectedBarcode = barcode || "";
    // Support both old table rows and new div rows
    const rows = (cartContainer || billBody);
    if (!rows) return;
    rows.querySelectorAll("[data-barcode]").forEach((row) => {
      row.classList.toggle("pos-row-selected", row.dataset.barcode === selectedBarcode);
    });
  }

  function firstBarcode() {
    const first = items.keys().next();
    return first.done ? "" : first.value;
  }

  function orderedBarcodes() {
    return Array.from(items.keys());
  }

  function moveSelection(step) {
    if (items.size === 0) { selectRow(""); return; }
    const keys = orderedBarcodes();
    const currentIndex = Math.max(0, keys.indexOf(selectedBarcode));
    const nextIndex = Math.min(keys.length - 1, Math.max(0, currentIndex + step));
    selectRow(keys[nextIndex]);
  }

  function renderBill(highlight = "") {
    // === NEW div-based cart ===
    if (cartContainer) {
      // Remove all .cart-row children (keep .cart-empty)
      [...cartContainer.querySelectorAll(".cart-row")].forEach(r => r.remove());

      const count = items.size;
      if (itemCountEl) itemCountEl.textContent = count + (count === 1 ? " item" : " items");
      if (cartEmpty) cartEmpty.style.display = count === 0 ? "flex" : "none";

      if (count > 0) {
        items.forEach((item, barcode) => {
          const row = document.createElement("div");
          row.className = "cart-row" + (barcode === selectedBarcode ? " pos-row-selected" : "") + (barcode === highlight ? " row-added" : "");
          row.dataset.barcode = barcode;
          row.innerHTML = `
            <span class="cart-row-name">${item.name}</span>
            <span class="cart-row-total" style="text-align:right;">${money(item.price * item.qty)}</span>
            <span class="cart-row-cat">${item.category}</span>
            <button class="remove-btn" data-remove="${barcode}" title="Remove">✕</button>
            <div class="cart-row-controls">
              <button class="qty-btn pos-qty-minus" data-barcode="${barcode}">−</button>
              <input class="pos-qty-input" type="number" min="1" value="${item.qty}" data-barcode="${barcode}">
              <button class="qty-btn pos-qty-plus" data-barcode="${barcode}">+</button>
              <span class="cart-row-unit">× ${money(item.price)}</span>
            </div>
          `;
          cartContainer.appendChild(row);
        });
      }

      totals();
      return;
    }

    // === Fallback: old table-based cart ===
    if (!billBody) return;
    billBody.innerHTML = "";
    if (items.size === 0) {
      const empty = document.createElement("tr");
      empty.innerHTML = `<td colspan="5" class="muted" style="text-align:center;">No items added yet.</td>`;
      billBody.appendChild(empty);
      totals();
      return;
    }
    items.forEach((item, barcode) => {
      const tr = document.createElement("tr");
      tr.dataset.barcode = barcode;
      if (highlight === barcode) tr.classList.add("row-added");
      if (selectedBarcode === barcode) tr.classList.add("pos-row-selected");
      tr.innerHTML = `
        <td><strong>${item.name}</strong><br><small>${item.category}</small></td>
        <td>${qtyControl(barcode, item.qty)}</td>
        <td>${money(item.price)}</td>
        <td>${money(item.price * item.qty)}</td>
        <td><button class="pos-remove-btn" type="button" data-remove="${barcode}">Remove</button></td>
      `;
      billBody.appendChild(tr);
    });
    totals();
  }

  function finalizeSale() {
    if (items.size === 0) {
      showToast("Cart is empty!", "error");
      return false;
    }

    const s = getSettings();
    const sub = Array.from(items.values()).reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Number(discountInput?.value || 0);
    const gstAmt = sub * (s.gstRate / 100);
    const total = sub + gstAmt - discount;
    const customerName = document.getElementById("posCustomerInput")?.value || "Walking Customer";

    // 1. Save Invoice
    const invoices = getInvoices();
    const newInvoice = {
      id: "INV-" + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      customer: customerName,
      itemsCount: Array.from(items.values()).reduce((sum, item) => sum + item.qty, 0),
      subtotal: sub,
      gst: gstAmt,
      discount: discount,
      total: total,
      status: "Paid"
    };
    invoices.unshift(newInvoice);
    saveInvoices(invoices);

    // 2. Update stock levels
    const products = getProducts();
    items.forEach((item, barcode) => {
      const p = products.find(prod => prod.barcode === barcode);
      if (p) {
        p.stock = Math.max(0, p.stock - item.qty);
      }
    });
    saveProducts(products);

    // 3. Clear cart
    items.clear();
    selectedBarcode = "";
    if (discountInput) discountInput.value = 0;
    const customerInput = document.getElementById("posCustomerInput");
    if (customerInput) customerInput.value = "";
    renderBill();

    showToast(`Sale #${newInvoice.id} completed!`, "success");
    return true;
  }

  const clearAllBtn = document.getElementById("posClearBillBtn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      items.clear();
      selectedBarcode = "";
      renderBill();
      selectRow("");
      showToast("Cart Cleared", "success");
    });
  }

  const generateBillBtn = document.getElementById("posGenerateBillBtn");
  if (generateBillBtn) {
    generateBillBtn.addEventListener("click", () => {
      if (items.size === 0) {
        showToast("Cart is empty!", "error");
        return;
      }
      
      const s = getSettings();
      const sub = Array.from(items.values()).reduce((sum, item) => sum + item.price * item.qty, 0);
      const discount = Number(discountInput?.value || 0);
      const gstAmt = sub * (s.gstRate / 100);
      const total = sub + gstAmt - discount;
      const customerInput = document.getElementById("posCustomerInput");

      // ── Generate Thermal Receipt for Printing ──
      let receiptHTML = `
        <div id="printReceipt">
          <div class="receipt-header">
            <h2>${s.shopName.toUpperCase()}</h2>
            <div>${s.shopTagline}</div>
            <div style="font-size:10px; margin-top:4px;">${s.address}</div>
            <div style="font-size:10px;">Ph: ${s.phone}</div>
            <div style="margin-top:8px; border-top:1px dashed #000; padding-top:4px;">Tax Invoice</div>
            <div>Date: ${new Date().toLocaleString()}</div>
            ${customerInput?.value ? `<div>Customer: ${customerInput.value}</div>` : ''}
          </div>
          <table class="receipt-table">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
            </thead>
            <tbody>
      `;
      items.forEach((item) => {
        receiptHTML += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.price * item.qty}</td></tr>`;
      });
      receiptHTML += `
            </tbody>
          </table>
          <div class="receipt-totals">
            <div>Subtotal: ${money(sub)}</div>
            <div>GST (${s.gstRate}%): ${money(gstAmt)}</div>
            ${discount > 0 ? `<div>Discount: -${money(discount)}</div>` : ''}
            <div class="receipt-grand">Total: ${money(total)}</div>
            <div class="receipt-footer">${s.receiptFooter}</div>
          </div>
        </div>
      `;
      
      const modal = document.getElementById("posReceiptModal");
      const paper = document.getElementById("posReceiptPaper");
      if (modal && paper) {
        paper.innerHTML = receiptHTML;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
      }
    });
  }

  const justChargeBtn = document.getElementById("posJustChargeBtn");
  if (justChargeBtn) {
    justChargeBtn.addEventListener("click", () => {
      const sub = Array.from(items.values()).reduce((sum, item) => sum + item.price * item.qty, 0);
      const s = getSettings();
      const gstAmt = sub * (s.gstRate / 100);
      const discount = Number(discountInput?.value || 0);
      const total = sub + gstAmt - discount;
      
      if (items.size > 0 && confirm(`Complete sale for ${money(total)}?`)) {
        finalizeSale();
      } else if (items.size === 0) {
        showToast("Cart is empty!", "error");
      }
    });
  }

  // ── Receipt Modal Actions ──
  const receiptModal = document.getElementById("posReceiptModal");
  function closeReceiptPreview() {
    if (receiptModal) {
      receiptModal.classList.remove("open");
      receiptModal.setAttribute("aria-hidden", "true");
    }
  }

  document.getElementById("posCloseReceiptBtn")?.addEventListener("click", closeReceiptPreview);
  document.getElementById("posCancelReceiptBtn")?.addEventListener("click", closeReceiptPreview);

  document.getElementById("posPrintReceiptBtn")?.addEventListener("click", () => {
    // 1. Print natively
    window.print();
    
    // 2. Finalize Sale
    if (finalizeSale()) {
      closeReceiptPreview();
    }
  });

  function pushHistory(product) {
    const idx = history.findIndex((h) => h.barcode === product.barcode);
    if (idx >= 0) history.splice(idx, 1);
    history.unshift(product);
    if (history.length > 5) history.pop();
    renderHistory();
  }

  function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "";
    if (history.length === 0) {
      historyList.innerHTML = `<div class="pos-hist-item" style="cursor:default; color:var(--text-soft);">No scans yet.</div>`;
      return;
    }
    history.forEach((h) => {
      const n = document.createElement("button");
      n.className = "pos-hist-item";
      n.type = "button";
      n.innerHTML = `<span class="pos-hist-icon">${h.tag || h.barcode.slice(-2)}</span>${h.name} <span style="color:var(--text-soft); margin-left:auto;">${money(h.price)}</span>`;
      n.style.cssText = "display:flex; align-items:center; gap:0.5rem; text-align:left; font-family:inherit; width:100%; border:none; cursor:pointer;";
      n.addEventListener("click", () => { addItem(h, "history"); });
      historyList.appendChild(n);
    });
  }

  function addItem(product, src = "scan") {
    const e = items.get(product.barcode);
    if (e) e.qty += 1;
    else items.set(product.barcode, { ...product, qty: 1 });

    selectedBarcode = product.barcode;
    renderBill(product.barcode);
    pushHistory(product);
    beep();
    flashSuccess();
    scanMessage.textContent = `Added ${product.name} (${src})`;
    showToast(`Added: ${product.name}`, "success");
  }

  function processBarcode() {
    const query = barcodeInput.value.trim().toLowerCase();
    if (!query) {
      showToast("Enter a barcode or product name.", "error");
      keepFocus();
      return;
    }

    // 1. Try Exact Barcode Match
    let p = byBarcode.get(query);
    
    // 2. Try Fuzzy Match (Name or Partial Barcode)
    if (!p) {
      p = catalog.find(item => 
        item.name.toLowerCase().includes(query) || 
        item.barcode.includes(query) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
    }

    if (!p) {
      scanMessage.textContent = "Product not found";
      showToast("No match for: " + query, "error");
      barcodeInput.select();
      keepFocus();
      return;
    }

    addItem(p, "search");
    barcodeInput.value = "";
    keepFocus();
  }

  function openScanner() {
    scannerModal.classList.add("open");
    scannerModal.setAttribute("aria-hidden", "false");
  }

  function closeScanner() {
    scannerModal.classList.remove("open");
    scannerModal.setAttribute("aria-hidden", "true");
    keepFocus();
  }

  function simulateScan() {
    const pick = catalog[Math.floor(Math.random() * catalog.length)];
    barcodeInput.value = pick.barcode;
    processBarcode();
    closeScanner();
  }

  scanBtn?.addEventListener("click", processBarcode);
  clearBtn?.addEventListener("click", () => {
    barcodeInput.value = "";
    scanMessage.textContent = "";
    keepFocus();
  });

  barcodeInput.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      processBarcode();
    }
  });

  openScannerBtn?.addEventListener("click", openScanner);
  closeScannerBtn?.addEventListener("click", closeScanner);
  simulateScanBtn?.addEventListener("click", simulateScan);

  scannerModal?.addEventListener("click", (ev) => {
    if (ev.target === scannerModal) closeScanner();
  });

  discountInput?.addEventListener("input", totals);

  // Unified click handler: works on both div-cart (cartContainer) and table-cart (billBody)
  function handleCartClick(ev) {
    const clickedRow = ev.target.closest("[data-barcode]");
    if (clickedRow && !ev.target.closest("button") && !ev.target.closest("input")) {
      selectRow(clickedRow.dataset.barcode);
    }

    const remove = ev.target.getAttribute("data-remove") || ev.target.closest("[data-remove]")?.getAttribute("data-remove");
    if (remove) {
      items.delete(remove);
      if (selectedBarcode === remove) selectedBarcode = firstBarcode();
      renderBill();
      selectRow(selectedBarcode);
      return;
    }

    // Qty + / — buttons (new div layout: data-barcode on the button itself)
    const barcode = ev.target.getAttribute("data-barcode") ||
                    ev.target.closest(".pos-qty-control")?.getAttribute("data-barcode");
    if (!barcode) return;
    const item = items.get(barcode);
    if (!item) return;

    if (ev.target.classList.contains("pos-qty-plus") || ev.target.classList.contains("pos-qty-plus")) {
      if (ev.target.classList.contains("pos-qty-plus")) {
        item.qty += 1;
        renderBill(); selectRow(barcode);
      } else if (ev.target.classList.contains("pos-qty-minus")) {
        item.qty = Math.max(1, item.qty - 1);
        renderBill(); selectRow(barcode);
      }
    }
  }

  // Unified input handler for qty text boxes
  function handleCartInput(ev) {
    if (!ev.target.classList.contains("pos-qty-input")) return;
    const barcode = ev.target.getAttribute("data-barcode") ||
                    ev.target.closest(".pos-qty-control")?.getAttribute("data-barcode");
    const item = items.get(barcode);
    if (!item) return;
    item.qty = Math.max(1, Number(ev.target.value || 1));
    totals();
  }

  if (cartContainer) {
    cartContainer.addEventListener("click",  handleCartClick);
    cartContainer.addEventListener("input",  handleCartInput);
  }
  billBody?.addEventListener("click",  handleCartClick);
  billBody?.addEventListener("input",  handleCartInput);

  function isTypingTarget(target) {
    const el = target instanceof Element ? target : null;
    if (!el) return false;
    return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
  }

  document.addEventListener("keydown", (ev) => {
    if (!barcodeInput) return;

    const activeElement = document.activeElement;
    const isTyping = isTypingTarget(activeElement);
    const inBarcodeInput = activeElement === barcodeInput;
    const isSystemShortcut = ev.altKey || ev.key === "Escape";

    if (isTyping && !inBarcodeInput && !isSystemShortcut) return;

    if (ev.key === "Escape" && scannerModal?.classList.contains("open")) {
      ev.preventDefault();
      closeScanner();
      return;
    }

    if (ev.altKey && ev.key.toLowerCase() === "s") {
      ev.preventDefault();
      openScanner();
      return;
    }

    if (ev.altKey && ev.key.toLowerCase() === "c") {
      ev.preventDefault();
      barcodeInput.value = "";
      scanMessage.textContent = "";
      keepFocus();
      return;
    }

    if (ev.key === "/" && document.activeElement !== barcodeInput) {
      ev.preventDefault();
      barcodeInput.select();
      keepFocus();
      return;
    }

    if (ev.ctrlKey && !ev.shiftKey && !ev.altKey) {
      const num = Number(ev.key);
      if (!Number.isNaN(num) && num >= 1 && num <= 6) {
        ev.preventDefault();
        const product = catalog[num - 1];
        if (product) addItem(product, `hotkey Ctrl+${num}`);
        keepFocus();
        return;
      }

      if (ev.key === "Backspace") {
        ev.preventDefault();
        const last = orderedBarcodes().at(-1);
        if (!last) return;
        items.delete(last);
        if (selectedBarcode === last) selectedBarcode = firstBarcode();
        renderBill();
        selectRow(selectedBarcode);
        keepFocus();
      }
      return;
    }

    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      if (!selectedBarcode) selectedBarcode = firstBarcode();
      moveSelection(1);
      keepFocus();
      return;
    }

    if (ev.key === "ArrowUp") {
      ev.preventDefault();
      if (!selectedBarcode) selectedBarcode = firstBarcode();
      moveSelection(-1);
      keepFocus();
      return;
    }

    if ((ev.key === "+" || ev.key === "=") && selectedBarcode && items.has(selectedBarcode)) {
      ev.preventDefault();
      items.get(selectedBarcode).qty += 1;
      renderBill();
      selectRow(selectedBarcode);
      keepFocus();
      return;
    }

    if (ev.key === "-" && selectedBarcode && items.has(selectedBarcode)) {
      ev.preventDefault();
      const current = items.get(selectedBarcode);
      current.qty = Math.max(1, current.qty - 1);
      renderBill();
      selectRow(selectedBarcode);
      keepFocus();
      return;
    }

    if ((ev.key === "Delete" || ev.key === "Backspace") && selectedBarcode && items.has(selectedBarcode) && document.activeElement !== barcodeInput) {
      ev.preventDefault();
      items.delete(selectedBarcode);
      selectedBarcode = firstBarcode();
      renderBill();
      selectRow(selectedBarcode);
      keepFocus();
    }
  });

  renderQuick();
  renderBill();
  selectRow(firstBarcode());
  renderHistory();
}

function initSettingsPage() {
  const page = document.body.dataset.page;
  if (page !== "settings") return;

  const s = getSettings();

  // 1. Populate current values
  const fields = {
    setShopName: s.shopName,
    setShopTagline: s.shopTagline,
    setPhone: s.phone,
    setAddress: s.address,
    setPrimaryColor: s.primaryColor,
    setGstRate: s.gstRate,
    setReceiptFooter: s.receiptFooter
  };

  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  // 2. Handle Save
  const saveBtn = document.querySelector('.hero-band__actions .btn-primary');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newSettings = {
        shopName: document.getElementById('setShopName').value,
        shopTagline: document.getElementById('setShopTagline').value,
        phone: document.getElementById('setPhone').value,
        address: document.getElementById('setAddress').value,
        primaryColor: document.getElementById('setPrimaryColor').value,
        gstRate: Number(document.getElementById('setGstRate').value),
        receiptFooter: document.getElementById('setReceiptFooter').value
      };

      saveSettings(newSettings);
      
      // Visual feedback
      saveBtn.disabled = true;
      saveBtn.textContent = "Saved!";
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
      }, 2000);
      
      // Use showToast if on a page with toast (settings has no pos-toast usually, but let's check or add)
      const toast = document.getElementById("posToast");
      if (toast) {
        // ... showToast would work here if we had one
      } else {
        alert("Settings Saved Successfully!");
      }
    });
  }
}

function initProductsPage() {
  const page = document.body.dataset.page;
  if (page !== "products") return;

  const tableBody = document.querySelector("#productsTable tbody");
  const productForm = document.getElementById("productForm");
  const modal = document.getElementById("productModal");
  const productFilter = document.getElementById("productFilter");
  const productSearch = document.getElementById("productSearch");

  let activeFilter = "all";

  function renderTable() {
    const products = getProducts();
    const searchTerm = productSearch?.value.toLowerCase() || "";
    const filtered = products.filter(p => {
      const matchesCat = activeFilter === "all" || p.category === activeFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.barcode.toLowerCase().includes(searchTerm);
      return matchesCat && matchesSearch;
    });
    if (!tableBody) return;
    tableBody.innerHTML = "";
    
    const cats = getCategories();
    // 1. Modal Category Dropdown (Adding/Editing Products)
    const catSelect = document.getElementById("prodCategory");
    if (catSelect) {
      catSelect.innerHTML = `<option value="" disabled selected>Select Category</option>` + 
                            cats.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
    }
    // 2. Toolbar Filter Dropdown
    if (productFilter) {
      const currentVal = productFilter.value;
      productFilter.innerHTML = `<option value="all">All Categories</option>` + 
                                cats.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
      if (Array.from(productFilter.options).some(opt => opt.value === currentVal)) {
        productFilter.value = currentVal;
      }
    }

    filtered.forEach(p => {
      const row = document.createElement("tr");
      const stockPercent = Math.min(100, Math.max(0, (p.stock / 20) * 100)); 
      const cat = (p.category || "").toLowerCase();
      const artClass = getCategoryArt(p.category, "");

      row.innerHTML = `
        <td><div class="table-visual"><span class="table-visual__icon ${artClass} mini-art"></span><div><strong>${p.name}</strong><small>${p.desc || p.barcode}</small></div></div></td>
        <td><span class="category-pill">${p.category}</span></td>
        <td>Rs. ${p.price.toLocaleString("en-IN")}</td>
        <td><div class="stock-indicator"><strong>${p.stock}</strong><span class="stock-indicator__bar"><i style="width:${stockPercent}%"></i></span></div></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-icon edit-prod-btn" data-barcode="${p.barcode}">Edit</button>
            <button class="btn btn-danger btn-icon delete-prod-btn" data-barcode="${p.barcode}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Dynamic Top Category Cards
    const visualCatGrid = document.querySelector(".visual-category-grid");
    if (visualCatGrid && document.body.dataset.page === "products") {
       const cats = getCategories();
       
       const allCard = `
         <article class="furniture-card compact-card ${activeFilter === "all" ? 'active-card' : ''}" data-cat="all" style="cursor:pointer">
           <div class="furniture-card__art all-art"></div>
           <strong>All Products</strong>
           <span>${products.length} items total</span>
         </article>
       `;

       visualCatGrid.innerHTML = allCard + cats.map(c => `
         <article class="furniture-card compact-card ${activeFilter === c.name ? 'active-card' : ''}" data-cat="${c.name}" style="cursor:pointer">
           <div class="furniture-card__art ${getCategoryArt(c.name, c.tag)}"></div>
           <strong>${c.name}</strong>
           <span>${products.filter(p => p.category === c.name).length} items</span>
         </article>
       `).join("");

       // Card click listeners
       visualCatGrid.querySelectorAll(".furniture-card").forEach(card => {
         card.addEventListener("click", () => {
           activeFilter = card.dataset.cat;
           if (productFilter) productFilter.value = activeFilter === "all" ? "all" : activeFilter;
           renderTable();
         });
       });
    }

    // Wire up dynamic buttons
    document.querySelectorAll(".edit-prod-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const products = getProducts();
        const p = products.find(prod => prod.barcode === btn.dataset.barcode);
        if (p) {
          document.getElementById("editBarcode").value = p.barcode;
          document.getElementById("prodBarcode").value = p.barcode;
          document.getElementById("prodName").value = p.name;
          document.getElementById("prodCategory").value = p.category;
          document.getElementById("prodPrice").value = p.price;
          document.getElementById("prodStock").value = p.stock;
          document.getElementById("prodDesc").value = p.desc || "";
          document.querySelector(".modal__header h2").textContent = "Edit Product";
          modal.classList.add("open");
        }
      });
    });

    document.querySelectorAll(".delete-prod-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this product?")) {
          const filtered = getProducts().filter(prod => prod.barcode !== btn.dataset.barcode);
          saveProducts(filtered);
          renderTable();
        }
      });
    });
  }

  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const barcode = document.getElementById("prodBarcode").value;
      const isEdit = document.getElementById("editBarcode").value;
      
      const products = getProducts();
      const newProd = {
        barcode: barcode,
        name: document.getElementById("prodName").value,
        category: document.getElementById("prodCategory").value,
        price: Number(document.getElementById("prodPrice").value),
        stock: Number(document.getElementById("prodStock").value),
        desc: document.getElementById("prodDesc").value,
        tag: document.getElementById("prodName").value.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
      };

      if (isEdit) {
        const idx = products.findIndex(p => p.barcode === isEdit);
        if (idx > -1) products[idx] = newProd;
      } else {
        if (products.some(p => p.barcode === barcode)) {
          alert("Barcode already exists!");
          return;
        }
        products.push(newProd);
      }

      saveProducts(products);
      renderTable();
      modal.classList.remove("open");
      productForm.reset();
      document.getElementById("editBarcode").value = "";
      document.querySelector(".modal__header h2").textContent = "Add Product";
    });
  }

  document.querySelector('[data-modal-target="productModal"]')?.addEventListener("click", () => {
     productForm.reset();
     document.getElementById("editBarcode").value = "";
     document.querySelector(".modal__header h2").textContent = "Add Product";
  });

  if (productFilter) {
    productFilter.addEventListener("change", (e) => {
      activeFilter = e.target.value;
      renderTable();
    });
  }
  if (productSearch) {
    productSearch.addEventListener("input", () => renderTable());
  }

  renderTable();
}

function initCustomersPage() {
  const page = document.body.dataset.page;
  if (page !== "customers") return;

  const tableBody = document.querySelector("#customersTable tbody");
  const customerForm = document.getElementById("customerForm");
  const modal = document.getElementById("customerModal");

  function renderTable() {
    const customers = getCustomers();
    if (!tableBody) return;
    tableBody.innerHTML = "";

    customers.forEach(c => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>${c.phone}</td>
        <td>${c.address}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-icon edit-cust-btn" data-id="${c.id}">Edit</button>
            <button class="btn btn-danger btn-icon delete-cust-btn" data-id="${c.id}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Dynamic Top Stats
    const statsGrid = document.querySelector(".card-grid");
    if (statsGrid && document.body.dataset.page === "customers") {
      const invoices = getInvoices();
      const uniqueBuyers = new Set(invoices.map(i => i.customer)).size;
      statsGrid.innerHTML = `
        <article class="mini-card"><span>Total Registry</span><strong>${customers.length}</strong></article>
        <article class="mini-card"><span>Active Buyers</span><strong>${uniqueBuyers}</strong></article>
        <article class="mini-card"><span>New This Month</span><strong>${customers.length}</strong></article>
      `;
    }

    // Edit/Delete listeners
    document.querySelectorAll(".edit-cust-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const c = getCustomers().find(cust => cust.id === id);
        if (c) {
          document.getElementById("editCustomerId").value = c.id;
          document.getElementById("custName").value = c.name;
          document.getElementById("custPhone").value = c.phone;
          document.getElementById("custAddress").value = c.address;
          document.querySelector("#customerModal h2").textContent = "Edit Customer";
          modal.classList.add("open");
        }
      });
    });

    document.querySelectorAll(".delete-cust-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this customer?")) {
          const id = Number(btn.dataset.id);
          const filtered = getCustomers().filter(cust => cust.id !== id);
          saveCustomers(filtered);
          renderTable();
        }
      });
    });
  }

  if (customerForm) {
    customerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("editCustomerId").value;
      const customers = getCustomers();

      const newCust = {
        id: id ? Number(id) : Date.now(),
        name: document.getElementById("custName").value,
        phone: document.getElementById("custPhone").value,
        address: document.getElementById("custAddress").value
      };

      if (id) {
        const idx = customers.findIndex(c => c.id === Number(id));
        if (idx > -1) customers[idx] = newCust;
      } else {
        customers.push(newCust);
      }

      saveCustomers(customers);
      renderTable();
      modal.classList.remove("open");
      customerForm.reset();
      document.getElementById("editCustomerId").value = "";
    });
  }

  renderTable();
}

function initCategoriesPage() {
  const page = document.body.dataset.page;
  if (page !== "categories") return;

  const tableBody = document.querySelector("#categoriesTable tbody");
  const categoryForm = document.getElementById("categoryForm");
  const modal = document.getElementById("categoryModal");

  function renderTable() {
    const categories = getCategories();
    if (!tableBody) return;
    tableBody.innerHTML = "";

    categories.forEach(c => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td><span class="category-pill">${c.tag || '-'}</span></td>
        <td>${c.desc || '-'}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-icon edit-cat-btn" data-id="${c.id}">Edit</button>
            <button class="btn btn-danger btn-icon delete-cat-btn" data-id="${c.id}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const c = getCategories().find(cat => cat.id === id);
        if (c) {
          document.getElementById("editCategoryId").value = id;
          document.getElementById("catName").value = c.name;
          document.getElementById("catTag").value = c.tag || "";
          document.getElementById("catDesc").value = c.desc || "";
          document.querySelector("#categoryModal h2").textContent = "Edit Category";
          modal.classList.add("open");
        }
      });
    });

    document.querySelectorAll(".delete-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure? Items in this category will remains but category choice disappears.")) {
          const id = Number(btn.dataset.id);
          const filtered = getCategories().filter(cat => cat.id !== id);
          saveCategories(filtered);
          renderTable();
        }
      });
    });
  }

  if (categoryForm) {
    categoryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("editCategoryId").value;
      const categories = getCategories();

      const newCat = {
        id: id ? Number(id) : Date.now(),
        name: document.getElementById("catName").value,
        tag: document.getElementById("catTag").value.toUpperCase(),
        desc: document.getElementById("catDesc").value
      };

      if (id) {
        const idx = categories.findIndex(c => c.id === Number(id));
        if (idx > -1) categories[idx] = newCat;
      } else {
        categories.push(newCat);
      }

      saveCategories(categories);
      renderTable();
      modal.classList.remove("open");
      categoryForm.reset();
      document.getElementById("editCategoryId").value = "";
    });
  }

  renderTable();
}

// ── Dashboard Page Logic ──
function initDashboardPage() {
  const invoices = getInvoices();
  const products = getProducts();
  const customers = getCustomers();
  const today = new Date().toISOString().split('T')[0];
  
  const todayInvoices = invoices.filter(inv => inv.date.startsWith(today));
  const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const money = (v) => `Rs. ${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  // Update Sidebar & Header Balance (Cash in Hand)
  const cashEls = document.querySelectorAll(".sidebar-metric strong, .due-box strong");
  cashEls.forEach(el => el.textContent = money(totalSales));

  // Update Dynamic Category Grid (Dashboard Top)
  const dashboardCatGrid = document.querySelector(".content > .visual-category-grid");
  if (dashboardCatGrid && body.dataset.page === "dashboard") {
     const cats = getCategories();
     dashboardCatGrid.innerHTML = cats.slice(0, 4).map(c => {
       const count = products.filter(p => p.category === c.name).length;
       return `
         <article class="furniture-card">
           <div class="furniture-card__art ${getCategoryArt(c.name, c.tag)}"></div>
           <strong>${c.name}</strong>
           <span>${count} items in stock</span>
         </article>
       `;
     }).join("");
  }

  // Update Quick Stats
  const todaySaleEl = document.querySelector(".quick-card.active-quick strong");
  if (todaySaleEl) todaySaleEl.textContent = money(todaySales);
  
  const todayCountEl = document.querySelector(".quick-card.active-quick small");
  if (todayCountEl) todayCountEl.textContent = `${todayInvoices.length} invoices generated today`;

  const payInEl = document.querySelectorAll(".quick-card strong")[1]; // Payment In
  if (payInEl) payInEl.textContent = money(todaySales);
  
  const payInSmall = document.querySelectorAll(".quick-card small")[1];
  if (payInSmall) payInSmall.textContent = `${todayInvoices.length} collections received`;

  const payOutEl = document.querySelectorAll(".quick-card strong")[2]; // Payment Out
  if (payOutEl) payOutEl.textContent = `Rs. 0`; // No expense tracker yet
  
  const payOutSmall = document.querySelectorAll(".quick-card small")[2];
  if (payOutSmall) payOutSmall.textContent = `0 expenses recorded`;

  const lowStockEl = document.querySelector(".warning-card strong");
  if (lowStockEl) lowStockEl.textContent = String(lowStockCount).padStart(2, '0');

  // Update Bottom Stats (Total Sales, Total Products, Customer Count)
  const statsList = document.querySelectorAll(".stats-grid--compact .stat-card strong");
  if (statsList.length >= 3) {
    statsList[0].textContent = money(totalSales);
    statsList[1].textContent = products.length;
    statsList[2].textContent = customers.length.toLocaleString();
    if (statsList[3]) statsList[3].textContent = money(todaySales);
  }

  // Update Trend Captions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisMonthSales = invoices.filter(inv => {
    const d = new Date(inv.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, inv) => sum + inv.total, 0);

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthSales = invoices.filter(inv => {
    const d = new Date(inv.date);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  }).reduce((sum, inv) => sum + inv.total, 0);

  let salesTrendText = "Starting fresh this month";
  if (lastMonthSales > 0) {
    const diff = ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;
    salesTrendText = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% vs last month`;
  }

  const activeThisWeek = new Set(invoices.filter(inv => new Date(inv.date) >= oneWeekAgo).map(inv => inv.customer)).size;
  const productsWithStock = products.filter(p => p.stock > 0).length;

  const trendEls = document.querySelectorAll(".stats-grid--compact .stat-card .trend");
  if (trendEls.length >= 3) {
    trendEls[0].textContent = salesTrendText;
    trendEls[1].textContent = `${productsWithStock} products with stock`;
    trendEls[2].textContent = `${activeThisWeek} active buyers this week`;
  }

  const avgBillEl = document.querySelector(".stat-card.accent-card .trend");
  if (avgBillEl && todayInvoices.length > 0) {
    avgBillEl.textContent = `Average bill ${money(todaySales / todayInvoices.length)}`;
  }

  // Update Recent Transactions Table
  const recentTableBody = document.querySelector(".panel .table-wrap tbody");
  if (recentTableBody) {
    if (invoices.length === 0) {
      recentTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-soft);">No transactions yet. Start billing to see data!</td></tr>`;
    } else {
      recentTableBody.innerHTML = invoices.slice(0, 5).map(inv => `
        <tr>
          <td>#${inv.id}</td>
          <td>${inv.customer}</td>
          <td>${inv.itemsCount}</td>
          <td>${money(inv.total)}</td>
          <td><span class="badge badge-success">${inv.status}</span></td>
        </tr>
      `).join("");
    }
  }

  // Refresh Chart with real data
  initChart();
}

// ── Reports / Invoices Page Logic ──
function initReportsPage() {
  const invoices = getInvoices();
  const tableBody = document.querySelector(".table-wrap table tbody");
  if (!tableBody) return;

  const money = (v) => `Rs. ${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  if (invoices.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 3rem; color: var(--text-soft);">No invoices found. Generate a bill first!</td></tr>`;
    return;
  }

  tableBody.innerHTML = invoices.map(inv => `
    <tr>
      <td>#${inv.id}</td>
      <td>${new Date(inv.date).toLocaleDateString()}</td>
      <td>${inv.customer}</td>
      <td>${inv.itemsCount} items</td>
      <td>${money(inv.total)}</td>
      <td><span class="badge badge-success">Paid</span></td>
    </tr>
  `).join("");
}





