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
  const productSearch = document.getElementById("productSearch");
  const productFilter = document.getElementById("productFilter");
  const rows = document.querySelectorAll("#productsTable tbody tr");

  if (!productSearch || !rows.length) return;

  const applyFilters = () => {
    const keyword = productSearch.value.trim().toLowerCase();
    const category = productFilter?.value || "all";

    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      const rowCategory = row.querySelector("[data-category]")?.dataset.category || "";
      const keywordMatch = text.includes(keyword);
      const categoryMatch = category === "all" || rowCategory === category;
      row.style.display = keywordMatch && categoryMatch ? "" : "none";
    });
  };

  productSearch.addEventListener("input", applyFilters);
  productFilter?.addEventListener("change", applyFilters);
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

function initChart() {
  const canvas = document.getElementById("salesChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const values = [18, 28, 22, 34, 38, 31, 45, 41, 49, 52, 47, 58];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  const padding = 48;
  const maxValue = Math.max(...values) + 10;
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
    const y = canvas.offsetHeight - padding - ((value / maxValue) * (canvas.offsetHeight - 120));
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

  const catalog = [
    { barcode: "890100100001", name: "Royal Sofa Set", price: 32000, tag: "SO", category: "Living Room" },
    { barcode: "890100100002", name: "Oak Dining Table", price: 24500, tag: "TB", category: "Dining" },
    { barcode: "890100100003", name: "Classic Wardrobe", price: 28900, tag: "WR", category: "Storage" },
    { barcode: "890100100004", name: "King Bed Frame", price: 39000, tag: "BD", category: "Bedroom" },
    { barcode: "890100100005", name: "Accent Chair", price: 8600, tag: "CH", category: "Seating" },
    { barcode: "890100100006", name: "Coffee Table", price: 11200, tag: "CF", category: "Living Room" },
    { barcode: "890100100007", name: "TV Unit", price: 15750, tag: "TV", category: "Living Room" }
  ];

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
    catalog.slice(0, 6).forEach((p) => {
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
    let subtotal = 0;
    items.forEach((i) => subtotal += i.price * i.qty);
    const gst = subtotal * 0.18;
    const discount = Math.max(0, Math.min(Number(discountInput.value || 0), subtotal + gst));
    const grand = subtotal + gst - discount;

    subtotalEl.textContent = money(subtotal);
    gstEl.textContent = money(gst);
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
    const code = barcodeInput.value.trim();
    if (!code) {
      showToast("Enter a barcode first.", "error");
      keepFocus();
      return;
    }

    const p = byBarcode.get(code);
    if (!p) {
      scanMessage.textContent = "Product not found";
      showToast("Product not found", "error", "Add new product", () => showToast("Open Products page to add it.", "success"));
      barcodeInput.select();
      keepFocus();
      return;
    }

    addItem(p, "barcode");
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





