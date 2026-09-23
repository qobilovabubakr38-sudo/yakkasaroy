/**
 * Yakkasaroy Family Restaurant - Bulutli Baza & Sinxronizatsiya Tizimi (cloud-db.js)
 * Firebase Firestore va Real-time Cloud ma'lumotlar boshqaruvi.
 * Boshliq o'zgartirgan ma'lumotlar darhol barcha mijozlar telefonida aks etadi.
 */

const CLOUD_STORAGE_KEYS = {
  CONFIG: 'yakkasaroy_config',
  MENU: 'yakkasaroy_menu',
  GALLERY: 'yakkasaroy_gallery',
  BOOKINGS: 'yakkasaroy_bookings',
  FIREBASE_CFG: 'yakkasaroy_firebase_cfg'
};

const CloudDB = {
  db: null,
  isFirebaseActive: false,
  listeners: [],

  /**
   * Bazani ishga tushirish
   */
  init: function(onDataUpdatedCallback) {
    if (onDataUpdatedCallback) {
      this.listeners.push(onDataUpdatedCallback);
    }

    const fbConfig = this.getFirebaseConfig();

    if (fbConfig && fbConfig.projectId && typeof firebase !== 'undefined') {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(fbConfig);
        }
        this.db = firebase.firestore();
        this.isFirebaseActive = true;
        console.log("🟢 Firebase Cloud Firestore muvaffaqiyatli ulandi!");

        this.listenToCloudChanges();
      } catch (err) {
        console.warn("Firebase ulanishida ogohlantirish:", err);
      }
    } else {
      console.log("ℹ️ Baza hozircha lokal / tayyor rejimda ishlamoqda.");
    }
  },

  getFirebaseConfig: function() {
    const saved = localStorage.getItem(CLOUD_STORAGE_KEYS.FIREBASE_CFG);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return window.FIREBASE_CONFIG || null;
  },

  setFirebaseConfig: function(cfg) {
    localStorage.setItem(CLOUD_STORAGE_KEYS.FIREBASE_CFG, JSON.stringify(cfg));
  },

  /**
   * Bulutdagi o'zgarishlarni real-vaqtda tinglash (Real-time listener)
   */
  listenToCloudChanges: function() {
    if (!this.db) return;

    // 1. Sozlamalar va Aloqa ma'lumotlari
    this.db.collection('restaurant').doc('settings').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        localStorage.setItem(CLOUD_STORAGE_KEYS.CONFIG, JSON.stringify(data));
        this.notifyListeners('config', data);
      }
    }, (err) => console.error("Cloud config error:", err));

    // 2. Taomlar Menyusi
    this.db.collection('restaurant').doc('menu').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.items) {
          localStorage.setItem(CLOUD_STORAGE_KEYS.MENU, JSON.stringify(data.items));
          this.notifyListeners('menu', data.items);
        }
      }
    }, (err) => console.error("Cloud menu error:", err));

    // 3. Galereya
    this.db.collection('restaurant').doc('gallery').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.items) {
          localStorage.setItem(CLOUD_STORAGE_KEYS.GALLERY, JSON.stringify(data.items));
          this.notifyListeners('gallery', data.items);
        }
      }
    }, (err) => console.error("Cloud gallery error:", err));
  },

  notifyListeners: function(type, data) {
    this.listeners.forEach(fn => {
      try { fn(type, data); } catch (e) { console.error(e); }
    });
  },

  /**
   * Sozlamalarni bulutga va lokalga saqlash
   */
  saveConfig: async function(config) {
    localStorage.setItem(CLOUD_STORAGE_KEYS.CONFIG, JSON.stringify(config));
    if (this.db) {
      try {
        await this.db.collection('restaurant').doc('settings').set(config, { merge: true });
        console.log("✅ Sozlamalar Firebase bulutiga saqlandi!");
        return true;
      } catch (err) {
        console.error("Firebase save config error:", err);
      }
    }
    return false;
  },

  /**
   * Taomlarni bulutga va lokalga saqlash
   */
  saveMenu: async function(items) {
    localStorage.setItem(CLOUD_STORAGE_KEYS.MENU, JSON.stringify(items));
    if (this.db) {
      try {
        await this.db.collection('restaurant').doc('menu').set({ items: items, updatedAt: new Date().toISOString() });
        console.log("✅ Menyu Firebase bulutiga saqlandi!");
        return true;
      } catch (err) {
        console.error("Firebase save menu error:", err);
      }
    }
    return false;
  },

  /**
   * Galereyani bulutga va lokalga saqlash
   */
  saveGallery: async function(galleryItems) {
    localStorage.setItem(CLOUD_STORAGE_KEYS.GALLERY, JSON.stringify(galleryItems));
    if (this.db) {
      try {
        await this.db.collection('restaurant').doc('gallery').set({ items: galleryItems, updatedAt: new Date().toISOString() });
        console.log("✅ Galereya Firebase bulutiga saqlandi!");
        return true;
      } catch (err) {
        console.error("Firebase save gallery error:", err);
      }
    }
    return false;
  },

  /**
   * Stol bron qilish arizasini bulutga yuborish
   */
  saveBooking: async function(booking) {
    let list = [];
    const saved = localStorage.getItem(CLOUD_STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) {}
    }
    list.unshift(booking);
    localStorage.setItem(CLOUD_STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

    if (this.db) {
      try {
        await this.db.collection('bookings').doc(booking.id).set(booking);
        console.log("✅ Bron arizasi Firebase bulutiga tushdi!");
      } catch (err) {
        console.error("Firebase booking save error:", err);
      }
    }
  }
};

window.CloudDB = CloudDB;
