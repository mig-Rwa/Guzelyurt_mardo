import type { AppRole } from './api';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
type PhotoStatus = 'pending' | 'approved' | 'rejected';

export interface StoredOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    id: string;
    name: { en: string; tr: string };
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  orderType: 'delivery' | 'pickup';
  paymentMethod: 'manual';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  createdAt: string;
  estimatedTime?: number;
}

export interface StoredReservation {
  id: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface StoredPhoto {
  id: string;
  orderId: string;
  userId?: string;
  customerName: string;
  imageUrl: string;
  caption?: string;
  status: PhotoStatus;
  isFeatured: boolean;
  uploadedAt: string;
  likes: number;
}

export interface StoredSubscriber {
  email: string;
  language: 'en' | 'tr';
  subscribedAt: string;
}

export interface StoredUser {
  uid: string;
  email: string;
  role: AppRole;
  displayName?: string;
  createdAt: string;
}

export interface StoredMenuItem {
  id: string;
  name: { en: string; tr: string };
  description: { en: string; tr: string };
  price: number;
  category: string;
  image: string;
  available: boolean;
  stock: number;
}

export const db = {
  orders: [] as StoredOrder[],
  reservations: [] as StoredReservation[],
  photos: [] as StoredPhoto[],
  subscribers: [] as StoredSubscriber[],
  users: [] as StoredUser[],
  menuItems: [] as StoredMenuItem[],
};
