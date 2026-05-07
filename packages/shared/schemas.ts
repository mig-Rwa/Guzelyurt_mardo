import { z } from 'zod';

// ==================== Menu Items ====================
export const LocalizedStringSchema = z.object({
  en: z.string(),
  tr: z.string(),
});

export const MenuItemSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  description: LocalizedStringSchema,
  price: z.number().positive(),
  category: z.string(),
  image: z.string().url(),
  available: z.boolean().default(true),
});

export const MenuItemCreateSchema = MenuItemSchema.omit({ id: true });

// ==================== Daily Specials ====================
export const DailySpecialSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  description: LocalizedStringSchema,
  originalPrice: z.number().positive(),
  price: z.number().positive(),
  validTime: LocalizedStringSchema,
  image: z.string().url(),
  active: z.boolean().default(true),
});

// ==================== Testimonials ====================
export const TestimonialSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  role: LocalizedStringSchema,
  text: LocalizedStringSchema,
  rating: z.number().min(1).max(5),
  image: z.string().url(),
});

// ==================== Gallery ====================
export const GalleryItemSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: LocalizedStringSchema.optional(),
  order: z.number().int().default(0),
});

// ==================== Reservations ====================
export const ReservationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(), // ISO date string
  time: z.string(),
  guests: z.number().int().min(1).max(20),
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
  createdAt: z.string(),
});

export const ReservationCreateSchema = z.object({
  date: z.string(),
  time: z.string(),
  guests: z.number().int().min(1).max(20),
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional(),
  notes: z.string().optional(),
});

// ==================== Orders ====================
export const OrderItemSchema = z.object({
  id: z.string(),
  name: LocalizedStringSchema,
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().url().optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  orderNumber: z.string(),
  items: z.array(OrderItemSchema),
  total: z.number().positive(),
  orderType: z.enum(['delivery', 'pickup']),
  paymentMethod: z.enum(['cod', 'card']),
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']).default('pending'),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
  createdAt: z.string(),
  estimatedTime: z.number().int().optional(), // minutes
});

export const OrderCreateSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: LocalizedStringSchema,
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string().url().optional(),
  })),
  orderType: z.enum(['delivery', 'pickup']),
  paymentMethod: z.enum(['cod', 'card']),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
});

// ==================== Newsletter ====================
export const NewsletterSubscriberSchema = z.object({
  email: z.string().email(),
  subscribedAt: z.string(),
  language: z.enum(['en', 'tr']).default('en'),
});

export const NewsletterSubscribeSchema = z.object({
  email: z.string().email(),
  language: z.enum(['en', 'tr']).optional(),
});

// ==================== User Profile ====================
export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  phone: z.string().optional(),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  addresses: z.array(z.object({
    id: z.string(),
    label: z.string(),
    address: z.string(),
    isDefault: z.boolean().default(false),
  })).optional(),
  language: z.enum(['en', 'tr']).default('en'),
  createdAt: z.string(),
});

// ==================== Loyalty Program ====================
export const LoyaltyPointsSchema = z.object({
  userId: z.string(),
  stamps: z.number().int().min(0).default(0),
  totalRedeemed: z.number().int().min(0).default(0),
  lastUpdated: z.string(),
});

// ==================== Customer Photos ====================
export const CustomerPhotoSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  userId: z.string().optional(),
  customerName: z.string().min(2),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  caption: z.string().max(200).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  isFeatured: z.boolean().default(false),
  featuredDate: z.string().optional(),
  uploadedAt: z.string(),
  approvedAt: z.string().optional(),
  likes: z.number().int().min(0).default(0),
});

export const CustomerPhotoCreateSchema = CustomerPhotoSchema.omit({
  id: true,
  uploadedAt: true,
  approvedAt: true,
  thumbnailUrl: true,
  status: true,
  isFeatured: true,
  likes: true,
  featuredDate: true,
});

// ==================== Daily Summary (Cloud Function) ====================
export const DailySummarySchema = z.object({
  id: z.string(),
  date: z.string(),
  totalOrders: z.number().int(),
  totalRevenue: z.number(),
  totalReservations: z.number().int(),
  newSubscribers: z.number().int(),
  createdAt: z.string(),
});

// ==================== API Response Schemas ====================
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
    hasMore: z.boolean(),
  });
