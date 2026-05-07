'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Package,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Shield,
  Bell,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Eye,
  Edit,
  Link as LinkIcon,
  Utensils,
} from 'lucide-react';
import MenuManagementTab from '@/components/admin/MenuManagementTab';

type TabType = 'photos' | 'orders' | 'reservations' | 'users' | 'menu' | 'analytics' | 'notifications' | 'settings';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  // Check if user has admin role
  const userRole = (user as any)?.role || 'user';
  const hasAdminAccess = userRole === 'admin';

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (!hasAdminAccess) {
    router.push('/dashboard');
    return null;
  }

  const tabs = [
    { id: 'photos' as TabType, icon: Camera, label: language === 'en' ? 'Photo Moderation' : 'Fotoğraf Moderasyonu' },
    { id: 'orders' as TabType, icon: Package, label: language === 'en' ? 'Orders' : 'Siparişler' },
    { id: 'menu' as TabType, icon: Utensils, label: language === 'en' ? 'Menu' : 'Menü' },
    { id: 'reservations' as TabType, icon: Calendar, label: language === 'en' ? 'Reservations' : 'Rezervasyonlar' },
    { id: 'users' as TabType, icon: Users, label: language === 'en' ? 'Users' : 'Kullanıcılar' },
    { id: 'analytics' as TabType, icon: TrendingUp, label: language === 'en' ? 'Analytics' : 'Analitik' },
    { id: 'notifications' as TabType, icon: Bell, label: language === 'en' ? 'Notifications' : 'Bildirimler' },
    { id: 'settings' as TabType, icon: Settings, label: language === 'en' ? 'Settings' : 'Ayarlar' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-mardo-dark via-gray-900 to-gray-800 text-white border-b-2 border-mardo-yellow/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-mardo-yellow to-mardo-beige rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-mardo-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-mardo-yellow to-mardo-beige bg-clip-text text-transparent">
                  {language === 'en' ? 'Admin Control Center' : 'Yönetici Kontrol Merkezi'}
                </h1>
                <p className="text-mardo-yellow/80 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LinkIcon className="w-5 h-5 text-mardo-yellow" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                {language === 'en' ? 'Logout' : 'Çıkış'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-4 sticky top-24 border border-white/20">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-mardo-yellow to-mardo-beige text-mardo-dark shadow-lg'
                          : 'text-white/70 hover:bg-white/10 border border-transparent hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 min-h-[600px] border border-white/20">
              {activeTab === 'photos' && <PhotoModerationTab language={language} />}
              {activeTab === 'orders' && <OrdersManagementTab language={language} user={user} />}
              {activeTab === 'menu' && <MenuManagementTab language={language} user={user} />}
              {activeTab === 'reservations' && <ReservationsManagementTab language={language} />}
              {activeTab === 'users' && <UsersManagementTab language={language} />}
              {activeTab === 'analytics' && <AnalyticsTab language={language} />}
              {activeTab === 'notifications' && <NotificationsTab language={language} />}
              {activeTab === 'settings' && <AdminSettingsTab language={language} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ADMIN TAB COMPONENTS =====

function PhotoModerationTab({ language }: { language: string }) {
  const [photos] = useState([
    {
      id: '1',
      customerName: 'Ali Yıldız',
      email: 'ali@example.com',
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      featured: false,
    },
    {
      id: '2',
      customerName: 'Ayşe Kaya',
      email: 'ayse@example.com',
      status: 'pending',
      uploadedAt: new Date().toISOString(),
      featured: false,
    },
    {
      id: '3',
      customerName: 'Mehmet Demir',
      email: 'mehmet@example.com',
      status: 'approved',
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      featured: true,
    },
  ]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          {language === 'en' ? '📸 Photo Moderation' : '📸 Fotoğraf Moderasyonu'}
        </h2>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-semibold border border-orange-500/50">
            {photos.filter(p => p.status === 'pending').length} {language === 'en' ? 'Pending' : 'Bekliyor'}
          </div>
          <div className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold border border-green-500/50">
            {photos.filter(p => p.status === 'approved').length} {language === 'en' ? 'Approved' : 'Onaylanmış'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-mardo-yellow/40 to-mardo-purple/40 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-mardo-yellow" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{photo.customerName}</p>
                  <p className="text-sm text-white/60">{photo.email}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(photo.uploadedAt).toLocaleDateString()} {new Date(photo.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  photo.status === 'approved'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                }`}>
                  {photo.status === 'approved' ? (
                    <>
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      {language === 'en' ? 'Approved' : 'Onaylandı'}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      {language === 'en' ? 'Pending' : 'Beklemede'}
                    </>
                  )}
                </span>
                {photo.featured && (
                  <span className="px-3 py-1 bg-mardo-yellow/20 text-mardo-yellow rounded-full text-xs font-semibold border border-mardo-yellow/50">
                    ⭐ {language === 'en' ? 'Featured' : 'Öne Çıkarılmış'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              {photo.status === 'pending' && (
                <>
                  <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'en' ? 'Approve' : 'Onayla'}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {language === 'en' ? 'Reject' : 'Reddet'}
                  </button>
                </>
              )}
              {photo.status === 'approved' && (
                <button className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border ${
                  photo.featured
                    ? 'bg-mardo-yellow/20 text-mardo-yellow border-mardo-yellow/50'
                    : 'bg-mardo-yellow/10 hover:bg-mardo-yellow/20 text-mardo-yellow/70 border-mardo-yellow/30'
                }`}>
                  ⭐ {language === 'en' ? 'Featured' : 'Öne Çıkar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: { name: string };
  total: number;
  orderType: 'delivery' | 'pickup';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{ quantity: number }>;
};

function OrdersManagementTab({ language, user }: { language: string; user: any }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setIsLoading(true);
      setActionError('');

      try {
        const response = await fetch('/api/orders?all=true', {
          headers: {
            'x-user-id': user?.uid || 'admin',
            'x-user-email': user?.email || '',
            'x-user-role': user?.role || 'admin',
          },
        });

        const data = await response.json();
        if (!active) return;

        setOrders(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        if (active) {
          setActionError(language === 'en' ? 'Failed to load orders.' : 'Siparişler yüklenemedi.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [language, user]);

  const updatePaymentStatus = async (orderId: string, paymentStatus: 'verified' | 'rejected') => {
    setUpdatingId(orderId);
    setActionError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.uid || 'admin',
          'x-user-email': user?.email || '',
          'x-user-role': user?.role || 'admin',
        },
        body: JSON.stringify({
          id: orderId,
          paymentStatus,
          status: paymentStatus === 'rejected' ? 'cancelled' : 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const data = await response.json();
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.data : order))
      );
    } catch (error) {
      setActionError(language === 'en' ? 'Could not update payment state.' : 'Ödeme durumu güncellenemedi.');
    } finally {
      setUpdatingId('');
    }
  };

  const pendingPayments = orders.filter((order) => order.paymentStatus === 'pending').length;

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          {language === 'en' ? '📦 Order Management' : '📦 Sipariş Yönetimi'}
        </h2>
        <div className="px-4 py-2 bg-mardo-yellow/20 text-mardo-yellow rounded-full text-sm font-semibold border border-mardo-yellow/50">
          {pendingPayments} {language === 'en' ? 'Pending payments' : 'Bekleyen ödemeler'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-400/80 text-sm font-semibold">{language === 'en' ? 'Total Orders' : 'Toplam Siparişler'}</p>
          <p className="text-4xl font-bold text-blue-300 mt-2">{orders.length}</p>
          <p className="text-xs text-blue-400/60 mt-1">{language === 'en' ? 'All time' : 'Her zaman'}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl p-6">
          <p className="text-orange-400/80 text-sm font-semibold">{language === 'en' ? 'Pending Payments' : 'Bekleyen Ödemeler'}</p>
          <p className="text-4xl font-bold text-orange-300 mt-2">{pendingPayments}</p>
          <p className="text-xs text-orange-400/60 mt-1">{language === 'en' ? 'Need admin validation' : 'Yönetici doğrulaması gerekir'}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-6">
          <p className="text-green-400/80 text-sm font-semibold">{language === 'en' ? 'Revenue' : 'Gelir'}</p>
          <p className="text-4xl font-bold text-green-300 mt-2">₺{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
          <p className="text-xs text-green-400/60 mt-1">{language === 'en' ? 'From manual orders' : 'Manuel siparişlerden'}</p>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="text-white/70">{language === 'en' ? 'Loading orders...' : 'Siparişler yükleniyor...'}</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-mardo-yellow/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-mardo-yellow" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-white/60">{order.customer?.name || 'Unknown customer'}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold">₺{order.total.toFixed(2)}</p>
                  <p className="text-xs text-white/50">{order.items.length} {language === 'en' ? 'items' : 'ürün'}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                    order.paymentStatus === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {order.paymentStatus === 'pending' ? (language === 'en' ? 'Payment pending' : 'Ödeme beklemede') :
                     order.paymentStatus === 'verified' ? (language === 'en' ? 'Payment verified' : 'Ödeme onaylandı') :
                     (language === 'en' ? 'Payment rejected' : 'Ödeme reddedildi')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'pending' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                    order.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                    order.status === 'ready' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                    'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {order.status === 'pending' ? (language === 'en' ? 'Pending' : 'Beklemede') :
                     order.status === 'preparing' ? (language === 'en' ? 'Preparing' : 'Hazırlanıyor') :
                     order.status === 'ready' ? (language === 'en' ? 'Ready' : 'Hazır') :
                     order.status === 'delivered' ? (language === 'en' ? 'Delivered' : 'Teslim Edildi') :
                     (language === 'en' ? 'Cancelled' : 'İptal Edildi')}
                  </span>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => updatePaymentStatus(order.id, 'verified')}
                    disabled={updatingId === order.id || order.paymentStatus === 'verified'}
                    className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {language === 'en' ? 'Verify' : 'Onayla'}
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(order.id, 'rejected')}
                    disabled={updatingId === order.id || order.paymentStatus === 'rejected'}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {language === 'en' ? 'Reject' : 'Reddet'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationsManagementTab({ language }: { language: string }) {
  const [reservations] = useState([
    { id: 'RES-001', customer: 'Ali Yıldız', date: '2026-05-15', time: '19:30', guests: 4, status: 'confirmed' },
    { id: 'RES-002', customer: 'Ayşe Kaya', date: '2026-05-16', time: '20:00', guests: 2, status: 'pending' },
  ]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          {language === 'en' ? '📅 Reservation Management' : '📅 Rezervasyon Yönetimi'}
        </h2>
        <div className="px-4 py-2 bg-mardo-yellow/20 text-mardo-yellow rounded-full text-sm font-semibold border border-mardo-yellow/50">
          {reservations.length} {language === 'en' ? 'Reservations' : 'Rezervasyon'}
        </div>
      </div>

      <div className="space-y-3">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-mardo-purple/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-mardo-purple" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{res.customer}</p>
                <p className="text-sm text-white/60">{res.date} at {res.time}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{res.guests} {language === 'en' ? 'Guests' : 'Misafir'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                res.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                'bg-orange-500/20 text-orange-400 border border-orange-500/50'
              }`}>
                {res.status === 'confirmed' ? language === 'en' ? 'Confirmed' : 'Onaylandı' : language === 'en' ? 'Pending' : 'Beklemede'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersManagementTab({ language }: { language: string }) {
  const [users] = useState([
    { id: '1', email: 'ali@example.com', name: 'Ali Yıldız', role: 'user', joined: '2026-01-15', status: 'active' },
    { id: '2', email: 'ayse@example.com', name: 'Ayşe Kaya', role: 'user', joined: '2026-02-20', status: 'active' },
    { id: '3', email: 'mehmet@example.com', name: 'Mehmet Demir', role: 'moderator', joined: '2025-12-10', status: 'active' },
  ]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          {language === 'en' ? '👥 User Management' : '👥 Kullanıcı Yönetimi'}
        </h2>
        <div className="px-4 py-2 bg-mardo-purple/20 text-mardo-purple rounded-full text-sm font-semibold border border-mardo-purple/50">
          {users.length} {language === 'en' ? 'Total' : 'Toplam'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'User' : 'Kullanıcı'}</th>
              <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Email' : 'E-posta'}</th>
              <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Role' : 'Rol'}</th>
              <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Status' : 'Durum'}</th>
              <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Actions' : 'İşlemler'}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 font-semibold">{u.name}</td>
                <td className="py-3 px-4 text-white/60">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.role === 'admin' ? 'bg-mardo-yellow/20 text-mardo-yellow border border-mardo-yellow/50' :
                    u.role === 'moderator' ? 'bg-mardo-purple/20 text-mardo-purple border border-mardo-purple/50' :
                    'bg-white/10 text-white/70 border border-white/20'
                  }`}>
                    {u.role === 'admin' ? language === 'en' ? 'Admin' : 'Yönetici' :
                     u.role === 'moderator' ? language === 'en' ? 'Moderator' : 'Moderatör' :
                     language === 'en' ? 'User' : 'Kullanıcı'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/50">
                    {language === 'en' ? 'Active' : 'Aktif'}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab({ language }: { language: string }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/orders?all=true', {
        headers: {
          'x-user-role': 'admin',
        },
      });
      const data = await response.json();
      const orders = Array.isArray(data.data) ? data.data : [];

      // Calculate stats
      let totalRevenue = 0;
      const itemSales: { [key: string]: { name: any; count: number; total: number } } = {};
      const statusBreakdown: { [key: string]: number } = {};
      let verifiedOrderCount = 0;

      orders.forEach((order: any) => {
        // Only count verified orders in revenue
        if (order.paymentStatus === 'verified') {
          totalRevenue += order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
          verifiedOrderCount++;
        }

        // Status breakdown
        statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;

        // Item sales
        order.items.forEach((item: any) => {
          if (!itemSales[item.id]) {
            itemSales[item.id] = { name: item.name, count: 0, total: 0 };
          }
          itemSales[item.id].count += item.quantity;
          itemSales[item.id].total += item.price * item.quantity;
        });
      });

      const topItems = Object.values(itemSales)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);

      const avgOrderValue = verifiedOrderCount > 0 ? totalRevenue / verifiedOrderCount : 0;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        verifiedOrders: verifiedOrderCount,
        avgOrderValue,
        topItems,
        statusBreakdown,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white">
        <p>{language === 'en' ? 'Loading analytics...' : 'Analitik yükleniyor...'}</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-8">
        {language === 'en' ? '📊 Sales Analytics & Reports' : '📊 Satış Analitikleri ve Raporlar'}
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-mardo-yellow/10 to-mardo-yellow/5 border border-mardo-yellow/30 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-mardo-yellow mb-2" />
          <p className="text-white/60 text-sm">{language === 'en' ? 'Total Revenue' : 'Toplam Gelir'}</p>
          <p className="text-2xl font-bold text-mardo-yellow mt-2">₺{stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
          <Package className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-white/60 text-sm">{language === 'en' ? 'Total Orders' : 'Toplam Siparişler'}</p>
          <p className="text-2xl font-bold text-blue-300 mt-2">{stats.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-6">
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-white/60 text-sm">{language === 'en' ? 'Verified Orders' : 'Doğrulanmış Siparişler'}</p>
          <p className="text-2xl font-bold text-green-300 mt-2">{stats.verifiedOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-6">
          <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-white/60 text-sm">{language === 'en' ? 'Avg Order Value' : 'Ort. Sipariş Değeri'}</p>
          <p className="text-2xl font-bold text-purple-300 mt-2">₺{stats.avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Items */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">
            {language === 'en' ? '🏆 Top 5 Items' : '🏆 En Çok Satılan 5 Öğe'}
          </h3>
          <div className="space-y-3">
            {stats.topItems.map((item: any, idx: number) => (
              <div key={item.name.en} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="font-semibold">{idx + 1}. {item.name[language as 'en' | 'tr'] || item.name.en}</p>
                  <p className="text-sm text-white/60">{item.count} {language === 'en' ? 'sold' : 'satıldı'}</p>
                </div>
                <p className="font-bold text-mardo-yellow">₺{item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">
            {language === 'en' ? '📋 Order Status Breakdown' : '📋 Sipariş Durumu Dağılımı'}
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.statusBreakdown).map(([status, count]: [string, unknown]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <p className="font-semibold capitalize">{status}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-white/60">{String(count)} orders</p>
                  <p className="font-bold text-lg">{String(count)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ language }: { language: string }) {
  const [notifs] = useState([
    { id: '1', type: 'order', message: 'New order received - ORD-042', time: 'Just now' },
    { id: '2', type: 'user', message: 'New user registration - ali.yildiz@example.com', time: '5 minutes ago' },
    { id: '3', type: 'photo', message: 'Photo uploaded for moderation', time: '1 hour ago' },
  ]);

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-8">
        {language === 'en' ? '🔔 System Notifications' : '🔔 Sistem Bildirimleri'}
      </h2>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div key={n.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-3 h-3 rounded-full ${
                n.type === 'order' ? 'bg-blue-400' :
                n.type === 'user' ? 'bg-green-400' :
                'bg-mardo-yellow'
              }`} />
              <div>
                <p className="font-semibold">{n.message}</p>
                <p className="text-sm text-white/50">{n.time}</p>
              </div>
            </div>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettingsTab({ language }: { language: string }) {
  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-8">
        {language === 'en' ? '⚙️ Admin Settings' : '⚙️ Yönetici Ayarları'}
      </h2>

      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{language === 'en' ? 'Email Notifications' : 'E-posta Bildirimleri'}</p>
              <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Receive alerts for important events' : 'Önemli olaylar için uyarı alın'}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-6 h-6 cursor-pointer" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{language === 'en' ? 'Auto-Moderation' : 'Otomatik Moderasyon'}</p>
              <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Enable AI-powered content filtering' : 'AI destekli içerik filtrelemeyi etkinleştir'}</p>
            </div>
            <input type="checkbox" className="w-6 h-6 cursor-pointer" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{language === 'en' ? 'Dark Mode' : 'Koyu Mod'}</p>
              <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Always enabled for admin panel' : 'Yönetici paneli için her zaman etkin'}</p>
            </div>
            <input type="checkbox" defaultChecked disabled className="w-6 h-6 cursor-not-allowed opacity-50" />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-orange-500/10 border border-orange-500/30 rounded-xl">
        <p className="text-orange-400 font-semibold">{language === 'en' ? '⚠️ Danger Zone' : '⚠️ Tehlikeli Bölge'}</p>
        <p className="text-white/60 text-sm mt-2">{language === 'en' ? 'Irreversible actions' : 'Geri alınamaz eylemler'}</p>
        <button className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors">
          {language === 'en' ? 'Reset All Data' : 'Tüm Verileri Sıfırla'}
        </button>
      </div>
    </div>
  );
}
