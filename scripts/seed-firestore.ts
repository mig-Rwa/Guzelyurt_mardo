/**
 * Seed Firestore with sample data for Mardo Café
 *
 * Usage:
 *   cd scripts
 *   npx ts-node seed-firestore.ts
 *
 * Note: Requires GOOGLE_APPLICATION_CREDENTIALS environment variable
 * pointing to your service account key JSON file, or run against emulator.
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin
// For emulator: Set FIRESTORE_EMULATOR_HOST=localhost:8080
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'mardo-2025',
  });
}

const db = admin.firestore();

// Sample data
const menuItems = [
  {
    id: '1',
    name: { en: 'Turkish Coffee', tr: 'Türk Kahvesi' },
    description: { en: 'Traditional Turkish coffee', tr: 'Geleneksel Türk kahvesi' },
    price: 45,
    category: 'hotDrinks',
    image: 'https://images.pexels.com/photos/2102818/pexels-photo-2102818.jpeg',
    available: true,
  },
  {
    id: '17',
    name: { en: 'Cappuccino', tr: 'Cappuccino' },
    description: { en: 'Espresso with velvety milk foam', tr: 'Kadifemsi süt köpüklü espresso' },
    price: 55,
    category: 'hotCoffee',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    available: true,
  },
  {
    id: '50',
    name: { en: 'Homemade Lemonade', tr: 'Ev Yapımı Limonata' },
    description: { en: 'Fresh squeezed lemonade', tr: 'Taze sıkılmış limonata' },
    price: 40,
    category: 'coldDrinks',
    image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg',
    available: true,
  },
  {
    id: '100',
    name: { en: 'Plain Nutella Waffle', tr: 'Sade Nutellalı Waffle' },
    description: { en: 'Belgian waffle with Nutella', tr: 'Nutellalı Belçika waffle' },
    price: 70,
    category: 'waffles',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    available: true,
  },
  {
    id: '153',
    name: { en: 'San Sebastian Cheesecake', tr: 'San Sebastian Cheesecake' },
    description: { en: 'Basque burnt cheesecake slice', tr: 'Bask usulü yanık cheesecake dilimi' },
    price: 90,
    category: 'cheesecake',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    available: true,
  },
];

const dailySpecials = [
  {
    id: '201',
    name: { en: 'Breakfast Combo', tr: 'Kahvaltı Kombosu' },
    description: { en: 'Menemen + Tea + Toast', tr: 'Menemen + Çay + Tost' },
    originalPrice: 110,
    price: 79,
    validTime: { en: '8AM - 11AM', tr: '08:00 - 11:00' },
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    active: true,
  },
  {
    id: '202',
    name: { en: 'Afternoon Delight', tr: 'Öğleden Sonra Keyfi' },
    description: { en: 'Any cake + Coffee of choice', tr: 'Herhangi bir pasta + Seçeceğiniz kahve' },
    originalPrice: 130,
    price: 95,
    validTime: { en: '2PM - 5PM', tr: '14:00 - 17:00' },
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    active: true,
  },
];

const testimonials = [
  {
    id: '1',
    name: { en: 'Ayşe Yılmaz', tr: 'Ayşe Yılmaz' },
    role: { en: 'Food Blogger', tr: 'Yemek Bloggeri' },
    text: {
      en: 'The waffles here are incredible! Mardo Mix Waffle is my absolute favorite.',
      tr: "Buradaki waffle'lar inanılmaz! Mardo Mix Waffle kesinlikle favorim.",
    },
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  },
  {
    id: '2',
    name: { en: 'Mehmet Kaya', tr: 'Mehmet Kaya' },
    role: { en: 'Local Regular', tr: 'Düzenli Müşteri' },
    text: {
      en: 'Best breakfast spot in the area! The sucuklu yumurta brings back childhood memories.',
      tr: 'Bölgedeki en iyi kahvaltı mekanı! Sucuklu yumurta çocukluk anılarımı canlandırıyor.',
    },
    rating: 5,
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
];

const galleryItems = [
  { id: '1', url: 'https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg', order: 0 },
  { id: '2', url: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg', order: 1 },
  { id: '3', url: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', order: 2 },
  { id: '4', url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', order: 3 },
  { id: '5', url: 'https://images.pexels.com/photos/1352281/pexels-photo-1352281.jpeg', order: 4 },
  { id: '6', url: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg', order: 5 },
];

async function seedCollection(collectionName: string, items: any[]) {
  console.log(`Seeding ${collectionName}...`);
  const batch = db.batch();
  
  for (const item of items) {
    const docRef = db.collection(collectionName).doc(item.id);
    batch.set(docRef, item);
  }
  
  await batch.commit();
  console.log(`✓ ${collectionName}: ${items.length} items added`);
}

async function main() {
  console.log('\n🌱 Seeding Mardo Café Firestore Database\n');
  console.log('Project:', process.env.FIREBASE_PROJECT_ID || 'mardo-2025');
  console.log('Emulator:', process.env.FIRESTORE_EMULATOR_HOST || 'Not using emulator');
  console.log('');

  try {
    await seedCollection('menuItems', menuItems);
    await seedCollection('specials', dailySpecials);
    await seedCollection('testimonials', testimonials);
    await seedCollection('galleryItems', galleryItems);

    console.log('\n✅ Database seeded successfully!\n');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
