/**
 * Yakkasaroy Family Restaurant - Boshliq / Admin Paneli Javascript Logikasi (admin.js)
 * Taomlarni tahrirlash, o'chirish, qo'shish, telefon raqam va sozlamalarni yangilash.
 * Real-time Firebase bulutli baza integratsiyasi va 1-klikda faylga eksport qilish.
 */

const STORAGE_KEYS = {
  CONFIG: 'yakkasaroy_config',
  MENU: 'yakkasaroy_menu',
  GALLERY: 'yakkasaroy_gallery',
  BOOKINGS: 'yakkasaroy_bookings',
  AUTH: 'yakkasaroy_admin_auth'
};

// Xavfsiz Shifrlangan Kirish Hashlari (SHA-256)
const ADMIN_SECURITY = {
  loginHash: "c44cc5121d2477ec702548de2420da5e49c0544b6e88b749cbf36f31dc9dd355", // aa775278286
  passwordHash: "8266498d969081c29737b8daeb5b51d60e56d008fff243a39d16c3032d42f6cf" // 1988
};

async function computeSha256(str) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return str;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

/**
 * Kirish (Autentifikatsiya)
 */
function initAuth() {
  const loginModal = document.getElementById('login-modal');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('login-form');
  const loginInput = document.getElementById('admin-login');
  const passwordInput = document.getElementById('admin-password');
  const errorMsg = document.getElementById('login-error-msg');
  const btnLogout = document.getElementById('btn-logout');

  // Tekshirish: Oldin kirganmi?
  if (sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true') {
    loginModal.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadDashboard();
  } else {
    loginModal.classList.remove('hidden');
    dashboard.classList.add('hidden');
  }

  // Kirish formasi
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    const [loginH, passH] = await Promise.all([computeSha256(login), computeSha256(password)]);

    if (loginH === ADMIN_SECURITY.loginHash && passH === ADMIN_SECURITY.passwordHash) {
      if (errorMsg) errorMsg.classList.add('hidden');
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      loginModal.classList.add('hidden');
      dashboard.classList.remove('hidden');
      loadDashboard();
    } else {
      if (errorMsg) errorMsg.classList.remove('hidden');
      passwordInput.value = "";
    }
  });

  // Chiqish
  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    window.location.reload();
  });
}

/**
 * Asosiy Dashboardni yuklash
 */
function loadDashboard() {
  initTabs();
  loadMenuManager();
  loadSettingsManager();
  loadGalleryManager();
  loadBookingsManager();
  loadCloudManager();

  // Bulutli bazani tinglash
  if (window.CloudDB) {
    window.CloudDB.init((type, data) => {
      console.log(`Cloud update received: ${type}`);
    });
  }
}

/**
 * Tablar o'rtasida o'tish
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Tugmalar ko'rinishi
      tabBtns.forEach(b => {
        if (b.dataset.tab === targetTab) {
          b.className = 'tab-btn px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-[#0f5132] text-white shadow-sm';
        } else {
          b.className = 'tab-btn px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-white text-stone-700 hover:bg-stone-100 border border-stone-200';
        }
      });

      // Kontentni ochish
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.remove('hidden');
          content.classList.add('block');
        } else {
          content.classList.add('hidden');
          content.classList.remove('block');
        }
      });
    });
  });
}

/**
 * 1. Taomlar Menyu boshqaruvi
 */
function loadMenuManager() {
  const tbody = document.getElementById('admin-food-tbody');
  const btnAddFood = document.getElementById('btn-add-food');
  const btnResetMenu = document.getElementById('btn-reset-menu');
  const modal = document.getElementById('food-form-modal');
  const form = document.getElementById('food-edit-form');
  const modalClose = document.getElementById('food-form-close');
  const modalCancel = document.getElementById('food-form-cancel');

  // Ma'lumotlarni olish
  function getMenuItems() {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return window.MENU_DATA ? window.MENU_DATA.items : [];
  }

  function saveMenuItems(items) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    if (window.CloudDB) window.CloudDB.saveMenu(items);
    renderTable();
  }

  function renderTable() {
    const items = getMenuItems();
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-stone-400 text-sm">Hozircha hech qanday taom mavjud emas.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map((item, index) => `
      <tr class="hover:bg-stone-50 transition-colors">
        <td class="p-4">
          <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'" />
        </td>
        <td class="p-4">
          <strong class="text-stone-900 font-semibold block">${item.name}</strong>
          <span class="text-xs text-stone-500 line-clamp-1">${item.description}</span>
        </td>
        <td class="p-4">
          <span class="px-2.5 py-1 text-xs rounded-md bg-stone-100 text-stone-700 font-medium">${item.categoryName || item.category}</span>
        </td>
        <td class="p-4 font-mono text-xs font-bold ${item.price === 'TBC' ? 'text-amber-700' : 'text-[#0f5132]'}">
          ${item.price}
        </td>
        <td class="p-4">
          ${item.badge ? `<span class="px-2.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-semibold">${item.badge}</span>` : '<span class="text-stone-300 text-xs">—</span>'}
        </td>
        <td class="p-4 text-right">
          <div class="inline-flex items-center gap-2">
            <button class="btn-edit px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold" data-index="${index}">
              Tahrirlash
            </button>
            <button class="btn-delete px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold" data-index="${index}">
              O‘chirish
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderTable();

  // O'chirish va Tahrirlash tugmalari hodisalari
  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const delBtn = e.target.closest('.btn-delete');

    if (delBtn) {
      const idx = parseInt(delBtn.dataset.index, 10);
      const items = getMenuItems();
      const foodName = items[idx]?.name || "Ushbu taom";
      if (confirm(`Haqiqatan ham "${foodName}" taomini menyudan o‘chirib tashlamoqchimisiz?`)) {
        items.splice(idx, 1);
        saveMenuItems(items);
      }
    }

    if (editBtn) {
      const idx = parseInt(editBtn.dataset.index, 10);
      const items = getMenuItems();
      const item = items[idx];
      openFoodModal(item, idx);
    }
  });

  // Yangi qo'shish
  btnAddFood.addEventListener('click', () => {
    openFoodModal(null, -1);
  });

  function openFoodModal(item, index) {
    document.getElementById('food-form-title').textContent = item ? "Taomni Tahrirlash" : "Yangi Taom Qo‘shish";
    document.getElementById('edit-food-id').value = index !== undefined ? index : -1;
    document.getElementById('edit-food-name').value = item ? item.name : "";
    document.getElementById('edit-food-category').value = item ? item.category : "vaguri";
    document.getElementById('edit-food-price').value = item ? item.price : "TBC";
    document.getElementById('edit-food-desc').value = item ? item.description : "";
    document.getElementById('edit-food-image').value = item ? item.image : "";
    document.getElementById('edit-food-badge').value = item && item.badge ? item.badge : "";

    modal.classList.remove('opacity-0', 'pointer-events-none');
  }

  function closeFoodModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    form.reset();
  }

  modalClose.addEventListener('click', closeFoodModal);
  modalCancel.addEventListener('click', closeFoodModal);

  // Formani saqlash
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('edit-food-id').value, 10);
    const categorySelect = document.getElementById('edit-food-category');
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

    const newItem = {
      id: idx >= 0 ? getMenuItems()[idx].id : `custom-${Date.now()}`,
      name: document.getElementById('edit-food-name').value.trim(),
      category: categorySelect.value,
      categoryName: categoryName,
      price: document.getElementById('edit-food-price').value.trim() || 'TBC',
      description: document.getElementById('edit-food-desc').value.trim() || 'Mazali milliy taom',
      image: document.getElementById('edit-food-image').value.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      badge: document.getElementById('edit-food-badge').value.trim() || null
    };

    const items = getMenuItems();
    if (idx >= 0) {
      items[idx] = newItem;
    } else {
      items.unshift(newItem);
    }

    saveMenuItems(items);
    closeFoodModal();
    alert("Taom muvaffaqiyatli saqlandi! Bulutli bazaga va saytga yangilandi.");
  });

  // Boshlang'ich holatga qaytarish
  btnResetMenu.addEventListener('click', () => {
    if (confirm("Haqiqatan ham menyuni standart holatga qaytarmoqchimisiz? Barcha kiritilgan o'zgarishlar o'chiriladi.")) {
      localStorage.removeItem(STORAGE_KEYS.MENU);
      if (window.CloudDB && window.MENU_DATA) {
        window.CloudDB.saveMenu(window.MENU_DATA.items);
      }
      renderTable();
      alert("Menyu standart holatiga qaytarildi.");
    }
  });
}

/**
 * 2. Sozlamalar va Telefon raqamini yangilash
 */
function loadSettingsManager() {
  const form = document.getElementById('settings-form');
  const savedCfg = getEffectiveConfig();
  const statusSpan = document.getElementById('settings-save-status');

  // Maydonlarni to'ldirish
  document.getElementById('cfg-phone').value = savedCfg.phone || "+998 93 964 64 65";
  document.getElementById('cfg-hours').value = savedCfg.workingHours || "Har kuni 09:00 — 23:00";
  document.getElementById('cfg-address').value = savedCfg.addressPlusCode || savedCfg.address || "C6C7+JW7, Urgut, Samarqand Region, Uzbekistan";
  document.getElementById('cfg-map-query').value = savedCfg.mapQuery || "Yakkasaroy family restaurant Urgut";
  document.getElementById('cfg-google-map').value = (savedCfg.maps && savedCfg.maps.googleMapsUrl) || "";
  document.getElementById('cfg-yandex-map').value = (savedCfg.maps && savedCfg.maps.yandexMapsUrl) || "";
  document.getElementById('cfg-tg-user').value = (savedCfg.telegram && savedCfg.telegram.username) || "";
  document.getElementById('cfg-instagram').value = (savedCfg.socials && savedCfg.socials.instagram) || "https://instagram.com/";

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const phoneVal = document.getElementById('cfg-phone').value.trim();
    const phoneRawVal = phoneVal.replace(/[^+\d]/g, '');
    const addressVal = document.getElementById('cfg-address').value.trim();
    const mapQueryVal = document.getElementById('cfg-map-query').value.trim() || addressVal || "Yakkasaroy family restaurant Urgut";
    const googleMapVal = document.getElementById('cfg-google-map').value.trim() || `https://maps.google.com/?q=${encodeURIComponent(mapQueryVal)}`;
    const yandexMapVal = document.getElementById('cfg-yandex-map').value.trim() || `https://yandex.uz/maps/?text=${encodeURIComponent(mapQueryVal)}`;

    const updated = {
      ...savedCfg,
      phone: phoneVal,
      phoneRaw: phoneRawVal,
      workingHours: document.getElementById('cfg-hours').value.trim(),
      addressPlusCode: addressVal,
      address: addressVal,
      mapQuery: mapQueryVal,
      maps: {
        googleMapsUrl: googleMapVal,
        googleReviewUrl: googleMapVal,
        yandexMapsUrl: yandexMapVal,
        yandexNaviUrl: `https://yandex.uz/navi/?text=${encodeURIComponent(mapQueryVal)}`
      },
      telegram: {
        ...(savedCfg.telegram || {}),
        username: document.getElementById('cfg-tg-user').value.trim()
      },
      socials: {
        ...(savedCfg.socials || {}),
        instagram: document.getElementById('cfg-instagram').value.trim()
      }
    };

    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    if (window.CloudDB) window.CloudDB.saveConfig(updated);

    if (statusSpan) {
      statusSpan.classList.remove('hidden');
      setTimeout(() => statusSpan.classList.add('hidden'), 3500);
    }
    alert("Restoran sozlamalari, telefon raqami va manzili saqlandi! Barcha mijozlar uchun yangilandi.");
  });
}

/**
 * 3. Galereya boshqaruvi
 */
function loadGalleryManager() {
  const grid = document.getElementById('admin-gallery-grid');
  const btnAdd = document.getElementById('btn-add-gallery');
  const modal = document.getElementById('gallery-form-modal');
  const form = document.getElementById('gallery-edit-form');
  const closeBtn = document.getElementById('gallery-form-close');
  const cancelBtn = document.getElementById('gallery-form-cancel');

  function getGallery() {
    const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return window.MENU_DATA ? window.MENU_DATA.gallery : [];
  }

  function saveGallery(items) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
    if (window.CloudDB) window.CloudDB.saveGallery(items);
    renderGallery();
  }

  function renderGallery() {
    const items = getGallery();
    if (items.length === 0) {
      grid.innerHTML = `<div class="col-span-full p-8 text-center text-stone-400 text-sm">Galereyada rasm yo'q.</div>`;
      return;
    }

    grid.innerHTML = items.map((item, index) => `
      <div class="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between hover-lift">
        <div class="relative h-44 w-full bg-stone-100">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'" />
          <span class="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-black/60 text-white uppercase">${item.categoryName || item.category}</span>
        </div>
        <div class="p-4">
          <h4 class="font-bold text-sm text-stone-900">${item.title}</h4>
          <p class="text-xs text-stone-500 mt-1 line-clamp-1">${item.caption || ''}</p>
          <div class="mt-4 pt-3 border-t border-stone-100 flex justify-end">
            <button class="btn-del-gal px-3 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-600" data-index="${index}">
              Rasmni o‘chirish
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderGallery();

  grid.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-del-gal');
    if (!delBtn) return;
    const idx = parseInt(delBtn.dataset.index, 10);
    const items = getGallery();
    if (confirm("Ushbu rasmni galereyadan o‘chirmoqchimisiz?")) {
      items.splice(idx, 1);
      saveGallery(items);
    }
  });

  btnAdd.addEventListener('click', () => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
  });

  function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    form.reset();
  }

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const catSelect = document.getElementById('gal-category');
    const newGal = {
      id: `g-custom-${Date.now()}`,
      title: document.getElementById('gal-title').value.trim(),
      category: catSelect.value,
      categoryName: catSelect.options[catSelect.selectedIndex].text,
      image: document.getElementById('gal-image').value.trim(),
      caption: document.getElementById('gal-caption').value.trim()
    };

    const items = getGallery();
    items.unshift(newGal);
    saveGallery(items);
    closeModal();
    alert("Yangi rasm galereyaga qo‘shildi!");
  });
}

/**
 * 4. Stol band qilish arizalari (Bookings)
 */
function loadBookingsManager() {
  const container = document.getElementById('admin-bookings-list');
  const btnClear = document.getElementById('btn-clear-bookings');

  function renderBookings() {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    let bookings = [];
    if (saved) {
      try { bookings = JSON.parse(saved); } catch (e) {}
    }

    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-400 text-sm">
          Hozircha yangi stol band qilish arizalari yo'q.
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map((b, i) => `
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h4 class="font-bold text-stone-900 text-base">${b.name}</h4>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#0f5132]">${b.guests} kishi</span>
            <span class="text-xs text-stone-400 font-mono">${b.date} / ${b.time}</span>
          </div>
          <p class="text-xs text-stone-600 mt-1">
            📞 <strong>${b.phone}</strong> · Joy: <em>${b.place}</em>
          </p>
          ${b.notes && b.notes !== 'Mavjud emas' ? `<p class="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded mt-2 inline-block">Izoh: ${b.notes}</p>` : ''}
        </div>

        <div class="flex items-center gap-2">
          <a href="tel:${b.phone}" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-[#0f5132] hover:bg-emerald-100">
            Qo‘ng‘iroq
          </a>
        </div>
      </div>
    `).join('');
  }

  renderBookings();

  btnClear.addEventListener('click', () => {
    if (confirm("Barcha bron tarixini tozalashni xohlaysizmi?")) {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      renderBookings();
    }
  });
}

/**
 * 5. Bulutli Baza (Firebase) va Eksport Boshqaruvi
 */
function loadCloudManager() {
  const badge = document.getElementById('cloud-status-badge');
  const fbForm = document.getElementById('firebase-form');
  const btnExportMenu = document.getElementById('btn-export-menu-js');
  const btnExportConfig = document.getElementById('btn-export-config-js');

  // Firebase holati
  if (window.CloudDB && window.CloudDB.isFirebaseActive) {
    if (badge) {
      badge.textContent = "🟢 Firebase Bulutga Ulangan";
      badge.className = "px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
    }
  }

  // Firebase formani to'ldirish
  const currentFb = (window.CloudDB && window.CloudDB.getFirebaseConfig()) || {};
  if (document.getElementById('fb-project-id')) document.getElementById('fb-project-id').value = currentFb.projectId || "";
  if (document.getElementById('fb-api-key')) document.getElementById('fb-api-key').value = currentFb.apiKey || "";
  if (document.getElementById('fb-auth-domain')) document.getElementById('fb-auth-domain').value = currentFb.authDomain || "";
  if (document.getElementById('fb-app-id')) document.getElementById('fb-app-id').value = currentFb.appId || "";

  if (fbForm) {
    fbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cfg = {
        projectId: document.getElementById('fb-project-id').value.trim(),
        apiKey: document.getElementById('fb-api-key').value.trim(),
        authDomain: document.getElementById('fb-auth-domain').value.trim(),
        appId: document.getElementById('fb-app-id').value.trim()
      };
      if (window.CloudDB) {
        window.CloudDB.setFirebaseConfig(cfg);
        alert("Firebase konfiguratsiyasi saqlandi! Sahifa yangilanmoqda...");
        window.location.reload();
      }
    });
  }

  // 1-Klikda menu-data.js ni yuklab olish
  if (btnExportMenu) {
    btnExportMenu.addEventListener('click', () => {
      const items = localStorage.getItem(STORAGE_KEYS.MENU) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU)) : (window.MENU_DATA?.items || []);
      const gallery = localStorage.getItem(STORAGE_KEYS.GALLERY) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY)) : (window.MENU_DATA?.gallery || []);
      const categories = window.MENU_DATA?.categories || [];
      const galleryCategories = window.MENU_DATA?.galleryCategories || [];

      const fullContent = `/**
 * Yakkasaroy Family Restaurant - Yangilangan Menyu va Galereya Ma'lumotlari (menu-data.js)
 * Avtomatik eksport qilingan sana: ${new Date().toLocaleString('uz-UZ')}
 */
const MENU_DATA = {
  categories: ${JSON.stringify(categories, null, 2)},
  items: ${JSON.stringify(items, null, 2)},
  galleryCategories: ${JSON.stringify(galleryCategories, null, 2)},
  gallery: ${JSON.stringify(gallery, null, 2)}
};

window.MENU_DATA = MENU_DATA;
`;
      downloadFile(fullContent, 'menu-data.js', 'application/javascript');
    });
  }

  // 1-Klikda config.js ni yuklab olish
  if (btnExportConfig) {
    btnExportConfig.addEventListener('click', () => {
      const cfg = getEffectiveConfig();
      const fb = (window.CloudDB && window.CloudDB.getFirebaseConfig()) || {};

      const fullContent = `/**
 * Yakkasaroy Family Restaurant - Yangilangan Konfiguratsiya (config.js)
 * Avtomatik eksport qilingan sana: ${new Date().toLocaleString('uz-UZ')}
 */
const RESTAURANT_CONFIG = ${JSON.stringify(cfg, null, 2)};

const FIREBASE_CONFIG = ${JSON.stringify(fb, null, 2)};

window.RESTAURANT_CONFIG = RESTAURANT_CONFIG;
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
`;
      downloadFile(fullContent, 'config.js', 'application/javascript');
    });
  }
}

function downloadFile(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

function getEffectiveConfig() {
  const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return window.RESTAURANT_CONFIG || {};
}
