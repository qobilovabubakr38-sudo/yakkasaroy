/**
 * Yakkasaroy Family Restaurant & Oshxona - Asosiy Konfiguratsiya (config.js)
 * Barcha asosiy ma'lumotlar, aloqa, xarita va Telegram Bot / Bulut integratsiyasi.
 */

const RESTAURANT_CONFIG = {
  name: "Yakkasaroy Family Restaurant",
  businessType: "Oshxona & Restoran",
  tagline: "Urgutda 3 qavatli shinam zallar, podval va go‘zal bog‘ bag‘rida mazali milliy taomlar.",
  locationName: "Urgut, Samarqand viloyati, O‘zbekiston",
  addressPlusCode: "C6C7+JW7, Urgut, Samarqand Region, Uzbekistan",
  phone: "+998 93 964 64 65",
  phoneRaw: "+998939646465",
  workingHours: "Har kuni 09:00 — 23:00",
  workingHoursShort: "09:00 — 23:00",
  rating: "4.4",
  reviewsCount: "37+",
  priceRangePerPerson: "UZS 50 000 – 100 000",
  halls: [
    "1-qavat zali (Asosiy keng zal)",
    "2-qavat zali (Oilaviy shinam zal)",
    "3-qavat zali (Yuqori qavat zali)",
    "Podval zali (Sokin va salqin zal)",
    "Restoran bog‘i (Yashil go‘zal bog‘)"
  ],
  services: ["Dine-in (Joyida tanovul)", "Takeout (Olib ketish)", "Tantanalar va oilaviy tadbirlar"],

  // Telegram Integratsiyasi (Bron arizalarini bevosita Boshliqqa yuborish)
  telegram: {
    username: "yakkasaroy_urgut", // Restoran Telegram username (ixtiyoriy)
    botToken: "", // Agar Telegram Bot ulansa
    chatId: "", // Boshliqning Telegram chat ID si
    directUrl: "https://t.me/+998939646465"
  },

  // Xarita va Navigatsiya havolalari (Aniq koordinatalar)
  maps: {
    googleMapsUrl: "https://maps.google.com/?q=C6C7%2BJW7+Urgut+Samarqand+Uzbekistan",
    googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Yakkasaroy+family+restaurant+C6C7%2BJW7+Urgut",
    yandexMapsUrl: "https://yandex.uz/maps/?ll=67.2497%2C39.3954&z=17&text=Yakkasaroy%20family%20restaurant%20Urgut%20Samarqand",
    yandexNaviUrl: "https://yandex.uz/navi/?text=Yakkasaroy%20family%20restaurant%20Urgut"
  },

  // Ijtimoiy tarmoqlar
  socials: {
    instagram: "https://instagram.com/",
    telegram: "https://t.me/+998939646465",
    facebook: ""
  }
};

/**
 * Google Firebase Cloud Firestore sozlamalari (ixtiyoriy)
 */
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

window.RESTAURANT_CONFIG = RESTAURANT_CONFIG;
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
