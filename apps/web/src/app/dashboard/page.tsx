'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { getAuthHeaders } from '@/lib/client/authHeaders';
import {
  Camera,
  Package,
  Award,
  MapPin,
  Calendar,
  Settings,
  Heart,
  LogOut,
  User,
  Clock,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Save,
} from 'lucide-react';
import Image from 'next/image';

type TabType = 'photos' | 'orders' | 'loyalty' | 'addresses' | 'reservations' | 'favorites' | 'settings';

type LocalizedString = {
  en: string;
  tr: string;
};

type DashboardOrder = {
  id: string;
  orderNumber?: string;
  items?: Array<{
    id: string;
    name: LocalizedString;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total?: number;
  orderType?: 'delivery' | 'pickup';
  paymentStatus?: 'pending' | 'verified' | 'rejected';
  status?: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
  createdAt?: string;
  estimatedTime?: number;
};

type DashboardReservation = {
  id: string;
  date?: string;
  reservationDate?: string;
  time?: string;
  guests?: number;
  guestCount?: number;
  name?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
};

type DashboardPhoto = {
  id: string;
  orderId: string;
  customerName: string;
  imageUrl: string;
  caption?: string;
  status?: 'pending' | 'approved' | 'rejected';
  isFeatured?: boolean;
  uploadedAt?: string;
  likes?: number;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

function formatDate(value?: string, locale: 'en' | 'tr' = 'en') {
  if (!value) return locale === 'en' ? 'Not set' : 'Ayarlanmadı';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function statusClasses(status?: string) {
  switch (status) {
    case 'verified':
    case 'confirmed':
    case 'ready':
    case 'delivered':
    case 'approved':
      return 'bg-green-100 text-green-700';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'preparing':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
}

function money(value?: number) {
  return `₺${(value ?? 0).toFixed(2)}`;
}

export default function UserDashboard() {
  const { user, loading, logout } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  const tabs = [
    { id: 'photos' as TabType, icon: Camera, label: language === 'en' ? 'My Photos' : 'Fotoğraflarım' },
    { id: 'orders' as TabType, icon: Package, label: language === 'en' ? 'Orders' : 'Siparişler' },
    { id: 'loyalty' as TabType, icon: Award, label: language === 'en' ? 'Loyalty' : 'Sadakat' },
    { id: 'addresses' as TabType, icon: MapPin, label: language === 'en' ? 'Addresses' : 'Adresler' },
    { id: 'reservations' as TabType, icon: Calendar, label: language === 'en' ? 'Reservations' : 'Rezervasyonlar' },
    { id: 'favorites' as TabType, icon: Heart, label: language === 'en' ? 'Favorites' : 'Favoriler' },
    { id: 'settings' as TabType, icon: Settings, label: language === 'en' ? 'Settings' : 'Ayarlar' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mardo-beige/20 to-white">
      <div className="bg-mardo-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 bg-mardo-yellow rounded-full flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-mardo-dark" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold truncate">
                  {language === 'en' ? 'Welcome back' : 'Tekrar hoş geldiniz'}, {user.email?.split('@')[0]}!
                </h1>
                <p className="text-mardo-beige truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
              {language === 'en' ? 'Logout' : 'Çıkış'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-mardo-yellow text-mardo-dark font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[600px]">
              {activeTab === 'photos' && <MyPhotosTab />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'loyalty' && <LoyaltyTab />}
              {activeTab === 'addresses' && <AddressesTab />}
              {activeTab === 'reservations' && <ReservationsTab />}
              {activeTab === 'favorites' && <FavoritesTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
      <RefreshCw className="h-5 w-5 animate-spin" />
      {label}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
      <AlertCircle className="mx-auto mb-3 h-8 w-8" />
      <p className="font-semibold">{message}</p>
      <button onClick={onRetry} className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
        Try again
      </button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
      <p className="text-lg font-semibold text-mardo-dark">{title}</p>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}

function MyPhotosTab() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<DashboardPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPhotos = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/photos?mine=true', {
        headers: await getAuthHeaders(user),
      });
      const payload = (await response.json()) as ApiResponse<DashboardPhoto[]>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to load photos');
      }
      setPhotos(payload.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'My Photos' : 'Fotoğraflarım'}
      </h2>
      {isLoading && <LoadingState label={language === 'en' ? 'Loading your photos...' : 'Fotoğraflarınız yükleniyor...'} />}
      {!isLoading && error && <ErrorState message={error} onRetry={loadPhotos} />}
      {!isLoading && !error && photos.length === 0 && (
        <EmptyState
          title={language === 'en' ? 'No photos uploaded yet' : 'Henüz fotoğraf yüklenmedi'}
          description={language === 'en' ? 'Upload a photo after an order and it will appear here for moderation tracking.' : 'Bir siparişten sonra fotoğraf yüklediğinizde moderasyon takibi için burada görünür.'}
        />
      )}
      {!isLoading && !error && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="relative h-48 w-full bg-gray-100">
                <Image src={photo.imageUrl} alt={photo.caption || photo.customerName} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(photo.status)}`}>
                    {photo.status || 'pending'}
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(photo.uploadedAt, language)}</span>
                </div>
                <p className="font-semibold text-mardo-dark">{photo.caption || (language === 'en' ? 'Mardo moment' : 'Mardo anı')}</p>
                <p className="mt-1 text-sm text-gray-500">Order: {photo.orderId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        headers: await getAuthHeaders(user),
      });
      const payload = (await response.json()) as ApiResponse<DashboardOrder[]>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to load orders');
      }
      setOrders(payload.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Order History' : 'Sipariş Geçmişi'}
      </h2>
      {isLoading && <LoadingState label={language === 'en' ? 'Loading your orders...' : 'Siparişleriniz yükleniyor...'} />}
      {!isLoading && error && <ErrorState message={error} onRetry={loadOrders} />}
      {!isLoading && !error && orders.length === 0 && (
        <EmptyState
          title={language === 'en' ? 'No orders yet' : 'Henüz sipariş yok'}
          description={language === 'en' ? 'Orders submitted from checkout will sync here automatically.' : 'Ödeme ekranından verilen siparişler otomatik olarak burada görünür.'}
        />
      )}
      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt, language)}</p>
                  <h3 className="text-lg font-bold text-mardo-dark">{order.orderNumber || order.id}</h3>
                  <p className="mt-1 text-sm text-gray-600 capitalize">{order.orderType || 'pickup'} · {order.estimatedTime || 20} min</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(order.status)}`}>
                    {order.status || 'pending'}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(order.paymentStatus)}`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {(order.items || []).map((item) => (
                  <div key={`${order.id}-${item.id}`} className="flex items-center justify-between text-sm">
                    <span>{item.quantity}× {item.name?.[language] || item.name?.en || item.id}</span>
                    <span className="font-semibold">{money(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="flex items-center gap-2 text-sm text-gray-500"><CreditCard className="h-4 w-4" /> Manual payment</span>
                <span className="text-lg font-bold text-mardo-dark">{money(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoyaltyTab() {
  const { language } = useLanguage();
  const { userProfile } = useAuth();
  const stamps = Number((userProfile as any)?.loyaltyStamps || 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Loyalty Program' : 'Sadakat Programı'}
      </h2>
      <div className="bg-gradient-to-r from-mardo-yellow to-mardo-beige rounded-2xl p-8 text-center">
        <Award className="w-16 h-16 text-mardo-dark mx-auto mb-4" />
        <p className="text-3xl font-bold text-mardo-dark mb-2">{stamps} / 10</p>
        <p className="text-mardo-dark/80">
          {language === 'en' ? 'Stamps collected' : 'Toplanan pul'}
        </p>
        <p className="mt-4 text-sm text-mardo-dark/70">
          {language === 'en'
            ? 'Loyalty stamps are ready to connect once the loyalty backend endpoint is added.'
            : 'Sadakat pulları, sadakat backend endpointi eklendiğinde bağlanmaya hazırdır.'}
        </p>
      </div>
    </div>
  );
}

function AddressesTab() {
  const { language } = useLanguage();
  const { userProfile } = useAuth();
  const addresses = ((userProfile as any)?.addresses || []) as Array<{ id: string; label: string; address: string; isDefault?: boolean }>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Saved Addresses' : 'Kayıtlı Adresler'}
      </h2>
      {addresses.length === 0 ? (
        <EmptyState
          title={language === 'en' ? 'No saved addresses' : 'Kayıtlı adres yok'}
          description={language === 'en' ? 'Delivery addresses can be stored here once profile persistence is enabled.' : 'Profil kalıcılığı etkinleştirildiğinde teslimat adresleri burada saklanabilir.'}
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-gray-100 p-4">
              <p className="font-semibold text-mardo-dark">{address.label}</p>
              <p className="text-gray-600">{address.address}</p>
              {address.isDefault && <span className="mt-2 inline-block rounded-full bg-mardo-yellow/20 px-3 py-1 text-xs font-semibold text-mardo-dark">Default</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationsTab() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<DashboardReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReservations = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/reservations', {
        headers: await getAuthHeaders(user),
      });
      const payload = (await response.json()) as ApiResponse<DashboardReservation[]>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to load reservations');
      }
      setReservations(payload.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'My Reservations' : 'Rezervasyonlarım'}
      </h2>
      {isLoading && <LoadingState label={language === 'en' ? 'Loading your reservations...' : 'Rezervasyonlarınız yükleniyor...'} />}
      {!isLoading && error && <ErrorState message={error} onRetry={loadReservations} />}
      {!isLoading && !error && reservations.length === 0 && (
        <EmptyState
          title={language === 'en' ? 'No reservations yet' : 'Henüz rezervasyon yok'}
          description={language === 'en' ? 'Reservations submitted from the homepage will sync here automatically.' : 'Ana sayfadan yapılan rezervasyonlar otomatik olarak burada görünür.'}
        />
      )}
      {!isLoading && !error && reservations.length > 0 && (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(reservation.reservationDate || reservation.date, language)}</p>
                  <h3 className="text-lg font-bold text-mardo-dark">{reservation.customerName || reservation.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" /> {reservation.time} · {reservation.guestCount || reservation.guests} {language === 'en' ? 'guests' : 'misafir'}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(reservation.status)}`}>
                  {reservation.status || 'pending'}
                </span>
              </div>
              {reservation.notes && <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{reservation.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FavoritesTab() {
  const { language } = useLanguage();
  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Favorite Items' : 'Favori Ürünler'}
      </h2>
      <EmptyState
        title={language === 'en' ? 'No favorites yet' : 'Henüz favori yok'}
        description={language === 'en' ? 'Favorite menu items can be connected after the favorites endpoint is added.' : 'Favori menü ürünleri, favoriler endpointi eklendikten sonra bağlanabilir.'}
      />
    </div>
  );
}

function SettingsTab() {
  const { language, setLanguage } = useLanguage();
  const { user, userProfile, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState((userProfile as any)?.phone || '');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'tr'>(language);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleSave = async () => {
    setSaveMessage('');
    await updateUserProfile({
      displayName: displayName || undefined,
      phone: phone || undefined,
      language: selectedLanguage,
    } as any);
    setLanguage(selectedLanguage);
    setSaveMessage(language === 'en' ? 'Settings saved on this device.' : 'Ayarlar bu cihazda kaydedildi.');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Account Settings' : 'Hesap Ayarları'}
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Email' : 'E-posta'}
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Display name' : 'Görünen ad'}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Phone' : 'Telefon'}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+90 5XX XXX XXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'Language' : 'Dil'}
          </label>
          <select
            value={selectedLanguage}
            onChange={(event) => setSelectedLanguage(event.target.value as 'en' | 'tr')}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          >
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-mardo-yellow px-5 py-3 font-semibold text-mardo-dark hover:bg-mardo-beige"
        >
          <Save className="h-4 w-4" />
          {language === 'en' ? 'Save settings' : 'Ayarları kaydet'}
        </button>
        {saveMessage && (
          <p className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
            <CheckCircle className="h-4 w-4" />
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}
