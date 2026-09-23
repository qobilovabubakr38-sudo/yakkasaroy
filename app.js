/**
 * Yakkasaroy Family Restaurant - Asosiy Javascript Logikasi (app.js)
 * To'liq interaktivlik, dinamik admin sozlamalari, menyu filtrlari, galereya lightbox, stol bron qilish va Telegram integratsiyasi.
 */

const STORAGE_KEYS = {
  CONFIG: 'yakkasaroy_config',
  MENU: 'yakkasaroy_menu',
  GALLERY: 'yakkasaroy_gallery',
  BOOKINGS: 'yakkasaroy_bookings'
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dinamik ma'lumotlarni (localStorage yoki standart) yuklash
  const cfg = getEffectiveConfig();
  const menuData = getEffectiveMenuData();

  // 2. DOM elementlariga ma'lumotlarni o'rnatish
  initDynamicConfig(cfg);

  // 3. Modullarni ishga tushirish
  initHeaderNavigation();
  initMenuSection(menuData);
  initGallerySection(menuData);
  initReservationForm(cfg);
  initScrollAnimations();
  initKeyboardA11y();

  // 4. Bulutli Bazani (Firebase Real-Time Cloud Sync) ulash
  if (window.CloudDB) {
    window.CloudDB.init((type, remoteData) => {
      if (type === 'config') {
        initDynamicConfig(remoteData);
      } else if (type === 'menu') {
        const currentData = getEffectiveMenuData();
        currentData.items = remoteData;
        initMenuSection(currentData);
      } else if (type === 'gallery') {
        const currentData = getEffectiveMenuData();
        currentData.gallery = remoteData;
        initGallerySection(currentData);
      }
    });
  }
});

/**
 * Dinamik konfiguratsiyani olish (Agar admin o'zgartirgan bo'lsa localStorage'dan)
 */
function getEffectiveConfig() {
  const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Config JSON parsing error", e);
    }
  }
  return window.RESTAURANT_CONFIG || {};
}

/**
 * Dinamik menyu va galereyani olish (Admin tahrirlagan bo'lsa)
 */
function getEffectiveMenuData() {
  const defaultData = window.MENU_DATA || { categories: [], items: [], galleryCategories: [], gallery: [] };
  
  const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
  const savedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);

  let items = defaultData.items;
  let gallery = defaultData.gallery;

  if (savedMenu) {
    try { items = JSON.parse(savedMenu); } catch (e) {}
  }
  if (savedGallery) {
    try { gallery = JSON.parse(savedGallery); } catch (e) {}
  }

  return {
    categories: defaultData.categories,
    galleryCategories: defaultData.galleryCategories,
    items: items,
    gallery: gallery
  };
}

/**
 * Markaziy konfiguratsiyadagi ma'lumotlarni HTML ga dinamik o'rnatish
 */
function initDynamicConfig(cfg) {
  const phone = cfg.phone || "+998 93 964 64 65";
  const phoneRaw = cfg.phoneRaw || phone.replace(/[^+\d]/g, '') || "+998939646465";
  const address = cfg.addressPlusCode || cfg.address || "C6C7+JW7, Urgut, Samarqand Region, Uzbekistan";
  const hours = cfg.workingHours || "Har kuni 09:00 — 23:00";
  const rating = `${cfg.rating || '4.4'} ⭐ (${cfg.reviewsCount || '37+'} sharh)`;

  // Telefon raqamlari (barcha ko'rinish va linklar)
  document.querySelectorAll('[data-bind="phone"]').forEach(el => {
    el.textContent = phone;
  });
  document.querySelectorAll('[data-bind="phone-link"]').forEach(el => {
    el.setAttribute('href', `tel:${phoneRaw}`);
    // Agar ichida alohida matn bo'lsa va 998 qatnashgan bo'lsa
    if (!el.querySelector('[data-bind="phone"]')) {
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('998')) {
          node.nodeValue = ` ${phone} `;
        }
      });
    }
  });

  // Manzil va Ish vaqti
  document.querySelectorAll('[data-bind="address"]').forEach(el => {
    el.textContent = address;
  });
  document.querySelectorAll('[data-bind="hours"]').forEach(el => {
    el.textContent = hours;
  });
  document.querySelectorAll('[data-bind="rating"]').forEach(el => {
    el.textContent = rating;
  });

  // Xarita havolalari va Iframe dinamik yangilanishi
  const mapQuery = cfg.mapQuery || address || "Yakkasaroy family restaurant Urgut Samarqand";
  const googleMapsUrl = (cfg.maps && cfg.maps.googleMapsUrl) || `https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`;
  const yandexMapsUrl = (cfg.maps && cfg.maps.yandexMapsUrl) || `https://yandex.uz/maps/?text=${encodeURIComponent(mapQuery)}`;
  const googleReviewUrl = (cfg.maps && cfg.maps.googleReviewUrl) || googleMapsUrl;

  document.querySelectorAll('[data-bind="google-maps-link"]').forEach(el => {
    el.setAttribute('href', googleMapsUrl);
  });
  document.querySelectorAll('[data-bind="yandex-maps-link"]').forEach(el => {
    el.setAttribute('href', yandexMapsUrl);
  });
  document.querySelectorAll('[data-bind="google-review-link"]').forEach(el => {
    el.setAttribute('href', googleReviewUrl);
  });

  // Iframe xaritasini ham dinamik yangilash
  const mapIframe = document.getElementById('map-embed-frame') || document.querySelector('#manzil iframe');
  if (mapIframe) {
    mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`;
  }
}

/**
 * Header va Mobil menyu navigatsiyasi
 */
function initHeaderNavigation() {
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.nav-link-item');

  // Scroll hodisasi - header ko'rinishini o'zgartirish
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md', 'bg-white/95');
      header.classList.remove('bg-white/80');
    } else {
      header.classList.remove('shadow-md', 'bg-white/95');
      header.classList.add('bg-white/80');
    }
  }, { passive: true });

  // Mobil menyu ochish/yopish funksiyasi
  const toggleMobileMenu = (open) => {
    const isOpen = open !== undefined ? open : mobileDrawer.classList.contains('translate-x-full');
    if (isOpen) {
      mobileDrawer.classList.remove('translate-x-full');
      mobileBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.add('translate-x-full');
      mobileBackdrop.classList.add('opacity-0', 'pointer-events-none');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Havolalar bosilganda avtomatik yopish
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });
}

/**
 * Menyu bo'limi (Filtrlar, Qidiruv, Kartochkalar, Modal)
 */
function initMenuSection(menuData) {
  const categoriesContainer = document.getElementById('menu-category-filters');
  const menuGrid = document.getElementById('menu-items-grid');
  const searchInput = document.getElementById('menu-search-input');
  const foodModal = document.getElementById('food-detail-modal');
  const foodModalBackdrop = document.getElementById('food-modal-backdrop');
  const foodModalClose = document.getElementById('food-modal-close');

  let activeCategory = 'all';
  let searchQuery = '';

  if (!menuGrid) return;

  // Kategoriyalar tugmalarini chiqarish
  if (categoriesContainer && menuData.categories) {
    categoriesContainer.innerHTML = menuData.categories.map(cat => `
      <button 
        type="button" 
        class="category-btn px-5 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${cat.id === 'all' ? 'bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-lg shadow-emerald-600/30 scale-105' : 'bg-white text-stone-700 hover:bg-stone-50 hover:text-[#059669] border border-stone-200/90 shadow-sm'}"
        data-category="${cat.id}">
        <span>${cat.name}</span>
      </button>
    `).join('');

    categoriesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;

      const catId = btn.dataset.category;
      activeCategory = catId;

      // Tugmalar holatini yangilash
      categoriesContainer.querySelectorAll('.category-btn').forEach(b => {
        if (b.dataset.category === catId) {
          b.className = 'category-btn px-5 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-lg shadow-emerald-600/30 scale-105';
        } else {
          b.className = 'category-btn px-5 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex items-center gap-2 bg-white text-stone-700 hover:bg-stone-50 hover:text-[#059669] border border-stone-200/90 shadow-sm';
        }
      });

      renderFilteredMenu();
    });
  }

  // Qidiruv maydoni
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderFilteredMenu();
    });
  }

  // Taomlarni filtrlash va render qilish
  function renderFilteredMenu() {
    let filtered = menuData.items || [];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery) ||
        (item.description && item.description.toLowerCase().includes(searchQuery)) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(searchQuery))
      );
    }

    if (filtered.length === 0) {
      menuGrid.innerHTML = `
        <div class="col-span-full py-12 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <h4 class="text-lg font-bold text-stone-800">Taom topilmadi</h4>
          <p class="text-stone-500 text-sm mt-1">Boshqa kalit so'z bilan qidirib ko'ring yoki boshqa toifani tanlang.</p>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = filtered.map(item => `
      <div class="menu-card rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group cursor-pointer" data-food-id="${item.id}">
        <div>
          <div class="img-container relative h-48 sm:h-52 w-full bg-stone-100">
            <img 
              src="${item.image}" 
              alt="${item.name}" 
              loading="lazy" 
              class="w-full h-full object-cover"
              onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            
            ${item.badge ? `
              <span class="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md">
                ${item.badge}
              </span>
            ` : ''}

            <span class="absolute bottom-3 left-3 px-2.5 py-0.5 text-xs font-medium rounded-md bg-white/95 text-stone-800 backdrop-blur-md shadow-sm">
              ${item.categoryName || item.category}
            </span>
          </div>

          <div class="p-5">
            <h3 class="text-lg font-bold text-stone-900 group-hover:text-[#0f5132] transition-colors">
              ${item.name}
            </h3>
            <p class="text-stone-600 text-sm mt-2 line-clamp-2 leading-relaxed">
              ${item.description || ''}
            </p>
          </div>
        </div>

        <div class="p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
          <div>
            <span class="text-xs text-stone-400 block font-medium">Narxi:</span>
            <span class="text-base font-bold ${item.price === 'TBC' ? 'text-amber-700 font-mono text-sm' : 'text-[#0f5132]'}">
              ${item.price === 'TBC' ? 'TBC' : item.price}
            </span>
          </div>

          <button 
            type="button" 
            class="open-detail-btn inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f5132] bg-emerald-50 hover:bg-[#0f5132] hover:text-white px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm group-hover:bg-[#0f5132] group-hover:text-white"
            data-food-id="${item.id}">
            <span>Batafsil</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Dastlabki chiqarish
  renderFilteredMenu();

  // Taom modal oynasi hodisalari
  menuGrid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-food-id]');
    if (!card) return;
    const foodId = card.dataset.foodId;
    const item = (menuData.items || []).find(i => i.id === foodId);
    if (item) openFoodDetailModal(item);
  });

  function openFoodDetailModal(item) {
    if (!foodModal) return;
    document.getElementById('food-modal-img').src = item.image;
    document.getElementById('food-modal-img').alt = item.name;
    document.getElementById('food-modal-category').textContent = item.categoryName || item.category;
    document.getElementById('food-modal-title').textContent = item.name;
    document.getElementById('food-modal-desc').textContent = item.description || '';
    document.getElementById('food-modal-price').textContent = item.price === 'TBC' ? 'TBC (Ma’lumot kiritiladi)' : item.price;

    foodModal.classList.remove('opacity-0', 'pointer-events-none');
    foodModalBackdrop.classList.remove('opacity-0');
    document.body.style.overflow = 'hidden';
  }

  function closeFoodModal() {
    if (!foodModal) return;
    foodModal.classList.add('opacity-0', 'pointer-events-none');
    foodModalBackdrop.classList.add('opacity-0');
    document.body.style.overflow = '';
  }

  if (foodModalClose) foodModalClose.addEventListener('click', closeFoodModal);
  if (foodModalBackdrop) foodModalBackdrop.addEventListener('click', closeFoodModal);
}

/**
 * Galereya bo'limi va Lightbox
 */
function initGallerySection(menuData) {
  const galleryFilters = document.getElementById('gallery-category-filters');
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeFilter = 'all';
  let currentImages = [];
  let currentIndex = 0;

  if (!galleryGrid || !menuData.gallery) return;

  // Galereya filtrlarini yaratish
  if (galleryFilters && menuData.galleryCategories) {
    galleryFilters.innerHTML = menuData.galleryCategories.map(cat => `
      <button 
        type="button" 
        class="gallery-filter-btn px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${cat.id === 'all' ? 'bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-md scale-105' : 'bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-50 hover:text-[#059669]'}"
        data-category="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    galleryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.gallery-filter-btn');
      if (!btn) return;
      activeFilter = btn.dataset.category;

      galleryFilters.querySelectorAll('.gallery-filter-btn').forEach(b => {
        if (b.dataset.category === activeFilter) {
          b.className = 'gallery-filter-btn px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-md scale-105';
        } else {
          b.className = 'gallery-filter-btn px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-50 hover:text-[#059669]';
        }
      });

      renderGallery();
    });
  }

  function renderGallery() {
    let list = menuData.gallery;
    if (activeFilter !== 'all') {
      list = list.filter(item => item.category === activeFilter);
    }
    currentImages = list;

    galleryGrid.innerHTML = list.map((item, idx) => `
      <div class="gallery-item group relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-sm border border-stone-200 cursor-pointer" data-index="${idx}">
        <img 
          src="${item.image}" 
          alt="${item.title}" 
          loading="lazy" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'"
        />
        <div class="gallery-overlay absolute inset-0 flex flex-col justify-end p-5 text-white">
          <span class="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">${item.categoryName || item.category}</span>
          <h4 class="font-bold text-base leading-tight">${item.title}</h4>
          <p class="text-xs text-stone-200 mt-1 line-clamp-1">${item.caption || ''}</p>
        </div>
      </div>
    `).join('');
  }

  renderGallery();

  // Lightbox ochish
  galleryGrid.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.gallery-item');
    if (!itemEl) return;
    const idx = parseInt(itemEl.dataset.index, 10);
    openLightbox(idx);
  });

  function openLightbox(idx) {
    if (!currentImages || currentImages.length === 0) return;
    currentIndex = idx;
    const current = currentImages[currentIndex];

    lightboxImg.src = current.image;
    lightboxImg.alt = current.title;
    lightboxTitle.textContent = current.title;
    lightboxCaption.textContent = current.caption || '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    openLightbox(currentIndex);
  }

  function showPrevImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    openLightbox(currentIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Klaviatura strelkalari bilan boshqarish
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });
}

/**
 * Stol band qilish (Reservation) formasi va Telegram integratsiyasi
 */
function initReservationForm(cfg) {
  const form = document.getElementById('reservation-form');
  const confirmModal = document.getElementById('reservation-confirm-modal');
  const confirmDetails = document.getElementById('confirm-booking-details');
  const sendTelegramBtn = document.getElementById('btn-send-telegram');
  const copyMessageBtn = document.getElementById('btn-copy-booking');
  const modalCloseBtn = document.getElementById('confirm-modal-close');

  // Sanani minimal bugungi sana qilib belgilash
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (!form) return;

  let currentFormattedMessage = '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('res-name').value.trim();
    const phone = document.getElementById('res-phone').value.trim();
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const place = document.getElementById('res-place').value;
    const notes = document.getElementById('res-notes').value.trim() || 'Mavjud emas';

    // Validatsiya
    if (!name || !phone || !guests || !date || !time || !place) {
      showToast('Iltimos, barcha majburiy maydonlarni to‘ldiring!', 'warning');
      return;
    }

    if (phone.length < 9) {
      showToast('Telefon raqamini to‘liq va to‘g‘ri kiriting!', 'warning');
      return;
    }

    const bookingObj = {
      id: `b-${Date.now()}`,
      name, phone, guests, date, time, place, notes,
      createdAt: new Date().toISOString()
    };

    // 1. Bronni Bulutli Bazaga va localStorage ga saqlash
    if (window.CloudDB) {
      window.CloudDB.saveBooking(bookingObj);
    } else {
      saveBookingToStorage(bookingObj);
    }

    // 2. Netlify Forms backendiga avtomatik yuborish (Serverless saqlash)
    try {
      const formData = new FormData(form);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      }).catch(err => console.log("Netlify form submission note:", err));
    } catch (e) {}

    // 3. Agar Telegram Bot sozlangan bo'lsa, to'g'ridan-to'g'ri Boshliqning telefoniga yuborish
    if (cfg.telegram && cfg.telegram.botToken && cfg.telegram.chatId) {
      const tgApiUrl = `https://api.telegram.org/bot${cfg.telegram.botToken}/sendMessage`;
      fetch(tgApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cfg.telegram.chatId,
          text: `🔔 *Yangi Bron — Yakkasaroy Restorani*\n━━━━━━━━━━━━━━━━━\n👤 *Mehmon:* ${name}\n📞 *Telefon:* ${phone}\n👥 *Soni:* ${guests} kishi\n📅 *Sana:* ${date}\n⏰ *Vaqt:* ${time}\n📍 *Zal:* ${place}\n📝 *Izoh:* ${notes}`,
          parse_mode: 'Markdown'
        })
      }).catch(e => console.log("Telegram Bot direct notify note:", e));
    }

    // Telegram uchun formatlangan xabar
    currentFormattedMessage = 
`🔔 *Yangi bron — Yakkasaroy Family Restaurant*
━━━━━━━━━━━━━━━━━
👤 *Ism:* ${name}
📞 *Telefon:* ${phone}
👥 *Mehmonlar soni:* ${guests} kishi
📅 *Sana:* ${date}
⏰ *Vaqt:* ${time}
📍 *Joy:* ${place}
📝 *Izoh:* ${notes}
━━━━━━━━━━━━━━━━━
Yuborilgan vaqt: ${new Date().toLocaleTimeString('uz-UZ')}`;

    // Modal oynada ko'rsatish
    if (confirmDetails) {
      confirmDetails.innerHTML = `
        <div class="space-y-2 text-sm text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div class="flex justify-between"><span class="text-stone-500">Mehmon:</span> <strong class="text-stone-900">${name}</strong></div>
          <div class="flex justify-between"><span class="text-stone-500">Telefon:</span> <strong class="text-stone-900">${phone}</strong></div>
          <div class="flex justify-between"><span class="text-stone-500">Mehmonlar soni:</span> <strong>${guests} kishi</strong></div>
          <div class="flex justify-between"><span class="text-stone-500">Sana & Vaqt:</span> <strong>${date} / ${time}</strong></div>
          <div class="flex justify-between"><span class="text-stone-500">Tanlangan joy:</span> <strong class="text-[#0f5132]">${place}</strong></div>
          ${notes !== 'Mavjud emas' ? `<div class="pt-2 border-t border-stone-200 text-xs text-stone-600"><em>Izoh: ${notes}</em></div>` : ''}
        </div>
      `;
    }

    // Modalni ochish
    if (confirmModal) {
      confirmModal.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    }
  });

  // Telegram orqali yuborish
  if (sendTelegramBtn) {
    sendTelegramBtn.addEventListener('click', () => {
      const encodedMsg = encodeURIComponent(currentFormattedMessage);
      
      let tgUrl = `https://t.me/share/url?url=${encodedMsg}`;
      if (cfg.telegram && cfg.telegram.username) {
        tgUrl = `https://t.me/${cfg.telegram.username}?text=${encodedMsg}`;
      }
      
      window.open(tgUrl, '_blank');
      showToast('Telegram ochilmoqda...', 'success');
      closeConfirmModal();
      form.reset();
    });
  }

  // Xabarni nusxalash
  if (copyMessageBtn) {
    copyMessageBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(currentFormattedMessage).then(() => {
          showToast('Bron ma’lumotlari nusxalandi!', 'success');
        });
      } else {
        showToast('Nusxalash imkoni bo‘lmadi', 'warning');
      }
    });
  }

  function closeConfirmModal() {
    if (confirmModal) {
      confirmModal.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeConfirmModal);
}

function saveBookingToStorage(booking) {
  let list = [];
  const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  if (saved) {
    try { list = JSON.parse(saved); } catch (e) {}
  }
  list.unshift(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
}

/**
 * Scroll bo'yicha animatsiya (IntersectionObserver) - Tezkor va Snappy
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.04,
      rootMargin: '0px 0px 60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/**
 * Toast Bildirishnoma Tizimi
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-notification-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-[#0f5132] text-white' : type === 'warning' ? 'bg-amber-600 text-white' : 'bg-stone-900 text-white';

  toast.className = `toast px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium ${bgClass}`;
  toast.innerHTML = `
    <div class="flex-1">${message}</div>
    <button type="button" class="text-white/80 hover:text-white text-base leading-none">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector('button').addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
}

/**
 * Klaviatura va A11y yordamchilari
 */
function initKeyboardA11y() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const foodModal = document.getElementById('food-detail-modal');
      const confirmModal = document.getElementById('reservation-confirm-modal');
      const mobileDrawer = document.getElementById('mobile-drawer');

      if (foodModal && !foodModal.classList.contains('pointer-events-none')) {
        foodModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      }
      if (confirmModal && !confirmModal.classList.contains('pointer-events-none')) {
        confirmModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      }
      if (mobileDrawer && !mobileDrawer.classList.contains('translate-x-full')) {
        mobileDrawer.classList.add('translate-x-full');
        document.getElementById('mobile-backdrop')?.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
      }
    }
  });
}
