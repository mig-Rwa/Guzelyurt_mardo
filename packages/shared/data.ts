// Static data for Mardo Café
import type { MenuItem, DailySpecial, Testimonial, FortuneMessages, LoyaltyConfig } from './types';

export const menuItems: MenuItem[] = [
  // ==================== HOT DRINKS ====================
  {
    id: '1',
    name: { en: 'Turkish Coffee', tr: 'Türk Kahvesi' },
    description: { en: 'Traditional Turkish coffee', tr: 'Geleneksel Türk kahvesi' },
    price: 45,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/2102818/pexels-photo-2102818.jpeg',
    available: true
  },
  {
    id: '2',
    name: { en: 'Turkish Coffee (Medium Sugar)', tr: 'Türk Kahvesi (Orta)' },
    description: { en: 'Medium sweetness', tr: 'Orta şekerli' },
    price: 45,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/2102818/pexels-photo-2102818.jpeg',
    available: true
  },
  {
    id: '3',
    name: { en: 'Small Tea', tr: 'İnce Belli Küçük Çay' },
    description: { en: 'Traditional thin-waist tea glass', tr: 'Geleneksel ince belli bardakta' },
    price: 15,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg',
    available: true
  },
  {
    id: '4',
    name: { en: 'Large Tea', tr: 'Büyük Çay' },
    description: { en: 'Large serving of Turkish tea', tr: 'Büyük boy Türk çayı' },
    price: 20,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg',
    available: true
  },
  {
    id: '5',
    name: { en: 'Milk Tea', tr: 'Sütlü Çay' },
    description: { en: 'Tea with steamed milk', tr: 'Buğulanmış sütle çay' },
    price: 25,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg',
    available: true
  },
  {
    id: '6',
    name: { en: 'Salep', tr: 'Sahlep' },
    description: { en: 'Traditional hot orchid root drink', tr: 'Geleneksel sıcak orkide içeceği' },
    price: 40,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/6413579/pexels-photo-6413579.jpeg',
    available: true
  },
  // ==================== HOT COFFEE ====================
  {
    id: '10',
    name: { en: 'Single Espresso', tr: 'Single Espresso' },
    description: { en: 'Rich single shot espresso', tr: 'Zengin tek shot espresso' },
    price: 40,
    category: 'hotCoffee',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    available: true
  },
  {
    id: '11',
    name: { en: 'Double Espresso', tr: 'Double Espresso' },
    description: { en: 'Bold double shot', tr: 'Güçlü çift shot' },
    price: 50,
    category: 'hotCoffee',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    available: true
  },
  {
    id: '17',
    name: { en: 'Cappuccino', tr: 'Cappuccino' },
    description: { en: 'Espresso with velvety milk foam', tr: 'Kadifemsi süt köpüklü espresso' },
    price: 55,
    category: 'hotCoffee',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    available: true
  },
  {
    id: '18',
    name: { en: 'Latte', tr: 'Latte' },
    description: { en: 'Smooth espresso with steamed milk', tr: 'Buğulanmış sütle yumuşak espresso' },
    price: 55,
    category: 'hotCoffee',
    image: 'https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg',
    available: true
  },
  {
    id: '19',
    name: { en: 'Mocha', tr: 'Mocha' },
    description: { en: 'Espresso, chocolate & steamed milk', tr: 'Espresso, çikolata ve buğulanmış süt' },
    price: 60,
    category: 'hotCoffee',
    image: 'https://images.pexels.com/photos/4264049/pexels-photo-4264049.jpeg',
    available: true
  },
  // ==================== COLD COFFEE ====================
  {
    id: '30',
    name: { en: 'Iced Americano', tr: 'Iced Americano' },
    description: { en: 'Chilled espresso with cold water', tr: 'Soğuk suyla buzlu espresso' },
    price: 50,
    category: 'coldCoffee',
    image: 'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg',
    available: true
  },
  {
    id: '31',
    name: { en: 'Iced Latte', tr: 'Iced Latte' },
    description: { en: 'Chilled espresso with cold milk', tr: 'Soğuk sütle buzlu espresso' },
    price: 55,
    category: 'coldCoffee',
    image: 'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg',
    available: true
  },
  {
    id: '34',
    name: { en: 'Iced Frappe', tr: 'Iced Frappe' },
    description: { en: 'Blended iced coffee', tr: 'Karıştırılmış buzlu kahve' },
    price: 55,
    category: 'coldCoffee',
    image: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg',
    available: true
  },
  // ==================== COLD DRINKS ====================
  {
    id: '50',
    name: { en: 'Homemade Lemonade', tr: 'Ev Yapımı Limonata' },
    description: { en: 'Fresh squeezed lemonade', tr: 'Taze sıkılmış limonata' },
    price: 40,
    category: 'coldDrinks',
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg',
    available: true
  },
  {
    id: '56',
    name: { en: 'Milkshake', tr: 'Milkshake' },
    description: { en: 'With 2 scoops of ice cream', tr: '2 top dondurma ile' },
    price: 60,
    category: 'coldDrinks',
    image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg',
    available: true
  },
  // ==================== WAFFLES ====================
  {
    id: '100',
    name: { en: 'Plain Nutella Waffle', tr: 'Sade Nutellalı Waffle' },
    description: { en: 'Belgian waffle with Nutella', tr: 'Nutellalı Belçika waffleı' },
    price: 70,
    category: 'waffles',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    available: true
  },
  {
    id: '103',
    name: { en: 'Mardo Mix Waffle', tr: 'Mardo Mix Waffle' },
    description: { en: 'Ice cream + Nutella + Fresh fruit', tr: 'Dondurma + Nutella + Taze meyve' },
    price: 100,
    category: 'waffles',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    available: true
  },
  // ==================== CAKES ====================
  {
    id: '90',
    name: { en: 'Chocolate Cake', tr: 'Çikolatalı Pasta' },
    description: { en: 'Rich chocolate layer cake', tr: 'Zengin çikolatalı katlı pasta' },
    price: 75,
    category: 'cakes',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    available: true
  },
  {
    id: '82',
    name: { en: 'Tiramisu', tr: 'Tiramisu' },
    description: { en: 'Classic Italian dessert', tr: 'Klasik İtalyan tatlısı' },
    price: 70,
    category: 'milkDesserts',
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg',
    available: true
  },
  // ==================== CHEESECAKE ====================
  {
    id: '153',
    name: { en: 'San Sebastian Cheesecake', tr: 'San Sebastian Cheesecake' },
    description: { en: 'Basque burnt cheesecake slice', tr: 'Bask usulü yanık cheesecake dilimi' },
    price: 90,
    category: 'cheesecake',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    available: true
  },
  // ==================== BREAKFAST ====================
  {
    id: '111',
    name: { en: 'Eggs with Sausage', tr: 'Sucuklu Yumurta' },
    description: { en: 'Eggs with Turkish sausage', tr: 'Sucuklu sahanda yumurta' },
    price: 60,
    category: 'breakfast',
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    available: true
  },
  {
    id: '113',
    name: { en: 'Menemen', tr: 'Menemen' },
    description: { en: 'Turkish scrambled eggs with tomatoes', tr: 'Domatesli Türk usulü yumurta' },
    price: 55,
    category: 'breakfast',
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    available: true
  },
  // ==================== BURGERS ====================
  {
    id: '140',
    name: { en: 'Mardo Burger', tr: 'Mardo Burger' },
    description: { en: 'Homemade burger with fries', tr: 'Patates kızartması ile ev yapımı burger' },
    price: 95,
    category: 'burgers',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    available: true
  }
];

export const dailySpecials: DailySpecial[] = [
  {
    id: '201',
    name: { en: 'Breakfast Combo', tr: 'Kahvaltı Kombosu' },
    description: { en: 'Menemen + Tea + Toast', tr: 'Menemen + Çay + Tost' },
    originalPrice: 110,
    price: 79,
    validTime: { en: '8AM - 11AM', tr: '08:00 - 11:00' },
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    active: true
  },
  {
    id: '202',
    name: { en: 'Afternoon Delight', tr: 'Öğleden Sonra Keyfi' },
    description: { en: 'Any cake + Coffee of choice', tr: 'Herhangi bir pasta + Seçeceğiniz kahve' },
    originalPrice: 130,
    price: 95,
    validTime: { en: '2PM - 5PM', tr: '14:00 - 17:00' },
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    active: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: { en: 'Ayşe Yılmaz', tr: 'Ayşe Yılmaz' },
    role: { en: 'Food Blogger', tr: 'Yemek Bloggeri' },
    text: {
      en: 'The waffles here are incredible! Mardo Mix Waffle is my absolute favorite. Perfect with a latte.',
      tr: "Buradaki waffle'lar inanılmaz! Mardo Mix Waffle kesinlikle favorim. Latte ile mükemmel."
    },
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
  },
  {
    id: '2',
    name: { en: 'Mehmet Kaya', tr: 'Mehmet Kaya' },
    role: { en: 'Local Regular', tr: 'Düzenli Müşteri' },
    text: {
      en: 'Best breakfast spot in the area! The sucuklu yumurta brings back childhood memories. Highly recommend!',
      tr: "Bölgedeki en iyi kahvaltı mekanı! Sucuklu yumurta çocukluk anılarımı canlandırıyor. Kesinlikle tavsiye ederim!"
    },
    rating: 5,
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: '3',
    name: { en: 'Sophie Laurent', tr: 'Sophie Laurent' },
    role: { en: 'Tourist from France', tr: 'Fransız Turist' },
    text: {
      en: 'Amazing variety! Had the San Sebastian cheesecake and Turkish coffee - both were exceptional. The cozy atmosphere is a bonus.',
      tr: "Harika çeşitlilik! San Sebastian cheesecake ve Türk kahvesi denedim - ikisi de olağanüstüydü. Samimi atmosfer de cabası."
    },
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  }
];

export const galleryImages = [
  'https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg',
  'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
  'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
  'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
  'https://images.pexels.com/photos/1352281/pexels-photo-1352281.jpeg',
  'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg'
];

export const fortuneMessages: FortuneMessages = {
  en: [
    'A new opportunity awaits you this week. Keep your eyes open!',
    'Someone from your past will bring unexpected joy.',
    'Your patience will soon be rewarded with success.',
    'A journey is in your near future - embrace the adventure.',
    'Good news about finances is coming your way.',
    'Trust your instincts, they will guide you right.',
    'A meaningful conversation will change your perspective.',
    'Love surrounds you more than you realize.'
  ],
  tr: [
    'Bu hafta yeni bir fırsat sizi bekliyor. Gözlerinizi açık tutun!',
    'Geçmişinizden biri beklenmedik bir mutluluk getirecek.',
    'Sabrınız yakında başarıyla ödüllendirilecek.',
    'Yakın gelecekte bir yolculuk var - maceraya kucak açın.',
    'Finansal konularda iyi haberler geliyor.',
    'İçgüdülerinize güvenin, sizi doğru yönlendirecekler.',
    'Anlamlı bir sohbet bakış açınızı değiştirecek.',
    'Aşk sizi fark ettiğinizden daha fazla sarıyor.'
  ]
};

export const loyaltyConfig: LoyaltyConfig = {
  stampsRequired: 6,
  reward: { en: 'Free Drink of Choice', tr: 'Ücretsiz İstediğiniz İçecek' }
};
