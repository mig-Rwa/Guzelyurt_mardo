import { z } from 'zod';
import {
  MenuItemSchema,
  MenuItemCreateSchema,
  DailySpecialSchema,
  TestimonialSchema,
  GalleryItemSchema,
  ReservationSchema,
  ReservationCreateSchema,
  OrderSchema,
  OrderCreateSchema,
  OrderItemSchema,
  NewsletterSubscriberSchema,
  NewsletterSubscribeSchema,
  UserProfileSchema,
  LoyaltyPointsSchema,
  DailySummarySchema,
  LocalizedStringSchema,
} from './schemas';

// Infer types from schemas
export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuItemCreate = z.infer<typeof MenuItemCreateSchema>;
export type DailySpecial = z.infer<typeof DailySpecialSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type Reservation = z.infer<typeof ReservationSchema>;
export type ReservationCreate = z.infer<typeof ReservationCreateSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type NewsletterSubscriber = z.infer<typeof NewsletterSubscriberSchema>;
export type NewsletterSubscribe = z.infer<typeof NewsletterSubscribeSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type LoyaltyPoints = z.infer<typeof LoyaltyPointsSchema>;
export type DailySummary = z.infer<typeof DailySummarySchema>;

// Language type
export type Language = 'en' | 'tr';

// Category type
export type MenuCategory = 
  | 'hotDrinks'
  | 'hotCoffee'
  | 'coldCoffee'
  | 'coldDrinks'
  | 'herbalTea'
  | 'icecream'
  | 'snacks'
  | 'milkDesserts'
  | 'cakes'
  | 'waffles'
  | 'breakfast'
  | 'toasts'
  | 'salads'
  | 'burgers'
  | 'cheesecake';

// Cart Item (extends MenuItem with quantity)
export interface CartItem extends MenuItem {
  quantity: number;
}

// Fortune message type
export interface FortuneMessages {
  en: string[];
  tr: string[];
}

// Loyalty program config
export interface LoyaltyConfig {
  stampsRequired: number;
  reward: LocalizedString;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
