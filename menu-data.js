/**
 * Yakkasaroy Family Restaurant - Haqiqiy Taomlar Menyusi va Galereya Ma'lumotlari (menu-data.js)
 * Barcha narxlar Urgut va Samarqand milliy oshxonalari bozor narxlarida to'liq kiritilgan.
 */

const MENU_DATA = {
  categories: [
    { id: "all", name: "Barchasi" },
    { id: "vaguri", name: "Urgut Vaguri" },
    { id: "yakkasaroy-maxsus", name: "Maxsus Taomlar" },
    { id: "kabob-shashlik", name: "Kabob & Shashlik" },
    { id: "tandir-somsa", name: "Tandir & Pishiriqlar" },
    { id: "salatlar", name: "Salatlar & Gazaklar" },
    { id: "ichimliklar", name: "Ichimliklar & Choy" }
  ],

  items: [
    // 1. VAGURI
    {
      id: "v-01",
      name: "Urgut Vaguri (Katta porsiya)",
      category: "vaguri",
      categoryName: "Urgut Vaguri",
      price: "140 000 UZS",
      description: "Urgutning mashhur an'anaviy qovurma go‘shti. Sarxil barra qo‘y go‘shti maxsus ziravorlar va dumba yog‘ida tillarang qilib pishiriladi.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      badge: "Mashhur · Urgut Imzosi"
    },
    {
      id: "v-02",
      name: "Urgut Vaguri (Standart porsiya)",
      category: "vaguri",
      categoryName: "Urgut Vaguri",
      price: "75 000 UZS",
      description: "Yakkaxon va kichik davralar uchun mo‘ljallangan barra go‘shtli qarsildoq va sersuv Urgut vaguri.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      badge: "Eng ko‘p sotilgan"
    },

    // 2. YAKKASAROY MAXSUS
    {
      id: "m-01",
      name: "Yakkasaroy Maxsus Assorti",
      category: "yakkasaroy-maxsus",
      categoryName: "Maxsus Taomlar",
      price: "190 000 UZS",
      description: "Oilaviy davralar va tantanalar uchun maxsus lagan: Vaguri go‘shti, 4 xil kabob, tandir kartoshka va maxsus souslar jamlanmasi.",
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
      badge: "Oila uchun maxsus"
    },
    {
      id: "m-02",
      name: "Tandir Go‘shti (Urgutcha)",
      category: "yakkasaroy-maxsus",
      categoryName: "Maxsus Taomlar",
      price: "120 000 UZS",
      description: "Archa shoxlari va maxsus tog‘ giyohlari bilan tandirda dimlab pishirilgan yumshoq go‘sht.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      badge: "Tavsiya etiladi"
    },

    // 3. KABOB VA SHASHLIK
    {
      id: "k-01",
      name: "Qo‘y go‘shti shashlik (Lula / Kuskovoy)",
      category: "kabob-shashlik",
      categoryName: "Kabob & Shashlik",
      price: "18 000 UZS / six",
      description: "Yangi so‘yilgan qo‘y go‘shti va sarxil dumba bo‘laklari terilgan sersuv shashlik.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      badge: "Klassik"
    },
    {
      id: "k-02",
      name: "Qiyma kabob (Maxsus)",
      category: "kabob-shashlik",
      categoryName: "Kabob & Shashlik",
      price: "16 000 UZS / six",
      description: "Mayin tortilgan mol va qo‘y go‘shti aralashmasidan tayyorlangan xushbo‘y qiyma shashlik.",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
      badge: null
    },
    {
      id: "k-03",
      name: "Jigar va Dumba kabob",
      category: "kabob-shashlik",
      categoryName: "Kabob & Shashlik",
      price: "16 000 UZS / six",
      description: "Yangi mol jigari va barra dumba bo‘laklari terilgan tansiq kabob.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      badge: null
    },
    {
      id: "k-04",
      name: "Tovuq shashlik (File)",
      category: "kabob-shashlik",
      categoryName: "Kabob & Shashlik",
      price: "15 000 UZS / six",
      description: "Yumshoq marinadlangan tovuq filesidan tayyorlangan parhezbop shashlik.",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
      badge: null
    },

    // 4. TANDIR & PISHIRIQLAR
    {
      id: "t-01",
      name: "Katta Tandir Somsa (Go‘shtli)",
      category: "tandir-somsa",
      categoryName: "Tandir & Pishiriqlar",
      price: "12 000 UZS / dona",
      description: "Tandir devorida pishirilgan qarsildoq qatlama somsa. To‘g‘ralgan go‘sht va piyozli ichlik.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
      badge: "Issiq tandirdan"
    },
    {
      id: "t-02",
      name: "Urgutcha Yog‘li Patir Non",
      category: "tandir-somsa",
      categoryName: "Tandir & Pishiriqlar",
      price: "15 000 UZS / dona",
      description: "Qat-qat yog‘li xamirdan tayyorlangan an'anaviy Urgut patiri.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      badge: "Milliy"
    },
    {
      id: "t-03",
      name: "Samarqandcha Obi Non",
      category: "tandir-somsa",
      categoryName: "Tandir & Pishiriqlar",
      price: "6 000 UZS / dona",
      description: "Yumshoq va xushbo‘y issiq tandir noni.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      badge: null
    },

    // 5. SALATLAR & GAZAKLAR
    {
      id: "s-01",
      name: "Achichiq-Chuchuk (Shamol salat)",
      category: "salatlar",
      categoryName: "Salatlar & Gazaklar",
      price: "20 000 UZS",
      description: "Yupqa to‘g‘ralgan Yulduz pomidori, shirin piyoz, qalampir va rayhon barglari.",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      badge: "Klassik"
    },
    {
      id: "s-02",
      name: "Suzma & Ko‘katlar assortisi",
      category: "salatlar",
      categoryName: "Salatlar & Gazaklar",
      price: "15 000 UZS",
      description: "Qishloqcha barra suzma, sarxil ko‘katlar, rediska va sarimsoq.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      badge: null
    },

    // 6. ICHIMLIKLAR & CHOY
    {
      id: "i-01",
      name: "Yakkasaroy Maxsus Zafaronli Choy",
      category: "ichimliklar",
      categoryName: "Ichimliklar & Choy",
      price: "12 000 UZS / choynak",
      description: "Tog‘ giyohlari, zafaron, novvot va limon bilan damlangan xushbo‘y choy.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      badge: "Maxsus ta'm"
    },
    {
      id: "i-02",
      name: "Limonli Ko‘k / Qora Choy",
      category: "ichimliklar",
      categoryName: "Ichimliklar & Choy",
      price: "8 000 UZS / choynak",
      description: "Samarqandcha ko‘k 95 choyi, yangi limon bo‘laklari va novvot.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      badge: null
    },
    {
      id: "i-03",
      name: "Muzdek Qatiq / Ayron",
      category: "ichimliklar",
      categoryName: "Ichimliklar & Choy",
      price: "10 000 UZS / ko‘za",
      description: "Yalpizli va rayhonli orombaxsh muzdek ayron.",
      image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
      badge: "Salqinlik"
    }
  ],

  galleryCategories: [
    { id: "all", name: "Barchasi" },
    { id: "floors", name: "3 ta qavat zallari" },
    { id: "basement", name: "Podval zali" },
    { id: "garden", name: "Restoran bog‘i" },
    { id: "food", name: "Taomlar" }
  ],

  gallery: [
    {
      id: "g-01",
      title: "1-Qavat Asosiy Keng Zal",
      category: "floors",
      categoryName: "3 ta qavat zallari",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
      caption: "Keng, yorug' va bayramona oilaviy dasturxonlar uchun mo‘ljallangan zal."
    },
    {
      id: "g-02",
      title: "2-Qavat Shinam Oilaviy Zal",
      category: "floors",
      categoryName: "3 ta qavat zallari",
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80",
      caption: "Do‘stona va oilaviy uchrashuvlar uchun qulay va shinam muhit."
    },
    {
      id: "g-03",
      title: "3-Qavat Yuqori Panoramik Zal",
      category: "floors",
      categoryName: "3 ta qavat zallari",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80",
      caption: "Yuqori qavatdagi sokin va hashamatli zal."
    },
    {
      id: "g-04",
      title: "Sokin va Salqin Podval Zali",
      category: "basement",
      categoryName: "Podval zali",
      image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80",
      caption: "Issiq kunlarda salqin, sokin va samimiy suhbatlar maskani."
    },
    {
      id: "g-05",
      title: "Restoranning Yashil Bog‘ Qismi",
      category: "garden",
      categoryName: "Restoran bog‘i",
      image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1000&q=80",
      caption: "Yashil daraxtlar, toza havo va tabiat qo'ynidagi go'zal hudud."
    },
    {
      id: "g-06",
      title: "Urgut Vaguri Tortilishi",
      category: "food",
      categoryName: "Taomlar",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
      caption: "Issiq va tillarang qilib pishirilgan maxsus Urgut Vaguri."
    }
  ]
};

window.MENU_DATA = MENU_DATA;
