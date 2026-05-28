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
  DollarSign,
  Clock,
  Activity,
  ChefHat,
  ArrowUpRight,
  Sparkles,
  Globe2,
} from 'lucide-react';
import MenuManagementTab from '@/components/admin/MenuManagementTab';
import { getAuthHeaders } from '@/lib/client/authHeaders';

type TabType = 'overview' | 'photos' | 'orders' | 'reservations' | 'users' | 'menu' | 'analytics' | 'notifications' | 'settings';

export default function AdminDashboard() {
  const { user, userProfile, loading, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Check if user has admin role. Firebase user objects do not carry the app role;
  // the role lives on the local user profile, so prefer that before falling back.
  const userRole = (userProfile as any)?.role || (user as any)?.role || 'user';
  const ownerEmail = 'miguelmbabatunga31@gmail.com';
  const hasAdminAccess = userRole === 'admin' || user?.email?.toLowerCase() === ownerEmail;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
      return;
    }

    if (!loading && user && !hasAdminAccess) {
      router.replace('/dashboard');
    }
  }, [loading, user, hasAdminAccess, router]);

  if (loading || !user || !hasAdminAccess) {
    return null;
  }

  const tabs = [
    { id: 'overview' as TabType, icon: BarChart3, label: language === 'en' ? 'Overview' : 'Genel Bakış' },
    { id: 'orders' as TabType, icon: Package, label: language === 'en' ? 'Orders' : 'Siparişler' },
    { id: 'menu' as TabType, icon: Utensils, label: language === 'en' ? 'Menu' : 'Menü' },
    { id: 'reservations' as TabType, icon: Calendar, label: language === 'en' ? 'Reservations' : 'Rezervasyonlar' },
    { id: 'users' as TabType, icon: Users, label: language === 'en' ? 'Customers' : 'Müşteriler' },
    { id: 'photos' as TabType, icon: Camera, label: language === 'en' ? 'Photo Moderation' : 'Fotoğraf Moderasyonu' },
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-mardo-beige to-mardo-yellow bg-clip-text text-transparent">
                  {language === 'en' ? 'Mardo Admin Command Center' : 'Mardo Yönetici Komuta Merkezi'}
                </h1>
                <p className="text-mardo-yellow/80 text-sm">{user.email} · {language === 'en' ? 'Owner operations' : 'İşletme operasyonları'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-1 sm:flex">
                <button
                  onClick={() => setLanguage('en')}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    language === 'en'
                      ? 'bg-mardo-yellow text-mardo-dark shadow-lg shadow-mardo-yellow/20'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    language === 'tr'
                      ? 'bg-mardo-yellow text-mardo-dark shadow-lg shadow-mardo-yellow/20'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-pressed={language === 'tr'}
                >
                  TR
                </button>
              </div>
              <button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="flex items-center gap-2 rounded-xl border border-mardo-yellow/30 bg-mardo-yellow/10 px-4 py-2 text-sm font-semibold text-mardo-yellow transition hover:bg-mardo-yellow/20"
                title={language === 'en' ? 'Translate admin portal to Turkish' : 'Yönetici portalını İngilizceye çevir'}
              >
                <Globe2 className="h-4 w-4" />
                {language === 'en' ? 'Türkçe' : 'English'}
              </button>
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
            <div className="bg-gradient-to-br from-white/10 via-white/[0.06] to-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl p-8 min-h-[640px] border border-white/20">
              {activeTab === 'overview' && <OverviewTab language={language} user={user} onSelectTab={setActiveTab} />}
              {activeTab === 'photos' && <PhotoModerationTab language={language} />}
              {activeTab === 'orders' && <OrdersManagementTab language={language} user={user} />}
              {activeTab === 'menu' && <MenuManagementTab language={language} user={user} />}
              {activeTab === 'reservations' && <ReservationsManagementTab language={language} user={user} />}
              {activeTab === 'users' && <UsersManagementTab language={language} user={user} />}
              {activeTab === 'analytics' && <AnalyticsTab language={language} user={user} />}
              {activeTab === 'notifications' && <NotificationsTab language={language} />}
              {activeTab === 'settings' && <AdminSettingsTab language={language} setLanguage={setLanguage} user={user} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ADMIN TAB COMPONENTS =====

type OverviewStats = {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingPayments: number;
  pendingPrep: number;
  reservationsToday: number;
  upcomingReservations: number;
  customers: number;
  lowStock: number;
  recentOrders: any[];
  lowStockItems: any[];
};

function OverviewTab({
  language,
  user,
  onSelectTab,
}: {
  language: string;
  user: any;
  onSelectTab: (tab: TabType) => void;
}) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadOverview = async () => {
      setIsLoading(true);

      try {
        const headers = await getAuthHeaders(user);
        const [ordersResult, reservationsResult, menuResult, usersResult] = await Promise.allSettled([
          fetch('/api/orders?all=true', { headers }).then((res) => res.json()),
          fetch('/api/reservations?all=true', { headers }).then((res) => res.json()),
          fetch('/api/menu').then((res) => res.json()),
          fetch('/api/users', { headers }).then((res) => res.json()),
        ]);

        if (!active) return;

        const orders = ordersResult.status === 'fulfilled' && Array.isArray(ordersResult.value.data) ? ordersResult.value.data : [];
        const reservations = reservationsResult.status === 'fulfilled' && Array.isArray(reservationsResult.value.data) ? reservationsResult.value.data : [];
        const menuItems = menuResult.status === 'fulfilled' && Array.isArray(menuResult.value.data) ? menuResult.value.data : [];
        const users = usersResult.status === 'fulfilled' && Array.isArray(usersResult.value.data) ? usersResult.value.data : [];

        const today = new Date().toDateString();
        const isToday = (value?: string) => Boolean(value) && new Date(value as string).toDateString() === today;
        const verifiedOrders = orders.filter((order: any) => order.paymentStatus === 'verified');
        const todayVerifiedOrders = verifiedOrders.filter((order: any) => isToday(order.createdAt));
        const lowStockItems = menuItems.filter((item: any) => Number(item.stock ?? 0) <= 5 || item.available === false);

        setStats({
          totalRevenue: verifiedOrders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0),
          todayRevenue: todayVerifiedOrders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0),
          totalOrders: orders.length,
          todayOrders: orders.filter((order: any) => isToday(order.createdAt)).length,
          pendingPayments: orders.filter((order: any) => order.paymentStatus === 'pending').length,
          pendingPrep: orders.filter((order: any) => ['pending', 'preparing', 'ready'].includes(order.status)).length,
          reservationsToday: reservations.filter((reservation: any) => isToday(reservation.reservationDate)).length,
          upcomingReservations: reservations.filter((reservation: any) => reservation.status !== 'cancelled').length,
          customers: users.length,
          lowStock: lowStockItems.length,
          recentOrders: orders.slice(0, 4),
          lowStockItems: lowStockItems.slice(0, 4),
        });
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadOverview();

    return () => {
      active = false;
    };
  }, [user]);

  const metricCards = [
    {
      label: language === 'en' ? 'Today Revenue' : 'Bugünkü Gelir',
      value: `₺${(stats?.todayRevenue || 0).toFixed(2)}`,
      detail: language === 'en' ? `${stats?.todayOrders || 0} orders today` : `Bugün ${stats?.todayOrders || 0} sipariş`,
      icon: DollarSign,
      accent: 'from-emerald-400/25 to-emerald-500/5 text-emerald-300 border-emerald-400/30',
    },
    {
      label: language === 'en' ? 'Pending Payments' : 'Bekleyen Ödemeler',
      value: String(stats?.pendingPayments || 0),
      detail: language === 'en' ? 'Need owner verification' : 'Yönetici onayı bekliyor',
      icon: AlertCircle,
      accent: 'from-amber-300/25 to-amber-500/5 text-amber-200 border-amber-300/30',
    },
    {
      label: language === 'en' ? 'Live Kitchen Queue' : 'Canlı Mutfak Sırası',
      value: String(stats?.pendingPrep || 0),
      detail: language === 'en' ? 'Open order workflow' : 'Açık sipariş akışı',
      icon: ChefHat,
      accent: 'from-violet-400/25 to-violet-500/5 text-violet-200 border-violet-300/30',
    },
    {
      label: language === 'en' ? 'Reservations Today' : 'Bugünkü Rezervasyonlar',
      value: String(stats?.reservationsToday || 0),
      detail: language === 'en' ? `${stats?.upcomingReservations || 0} active bookings` : `${stats?.upcomingReservations || 0} aktif rezervasyon`,
      icon: Calendar,
      accent: 'from-sky-400/25 to-sky-500/5 text-sky-200 border-sky-300/30',
    },
  ];

  const quickActions = [
    { tab: 'orders' as TabType, icon: Package, label: language === 'en' ? 'Verify payments' : 'Ödemeleri onayla', detail: language === 'en' ? 'Review manual order payments' : 'Manuel sipariş ödemelerini incele' },
    { tab: 'menu' as TabType, icon: Utensils, label: language === 'en' ? 'Update menu' : 'Menüyü güncelle', detail: language === 'en' ? 'Prices, stock, availability' : 'Fiyat, stok, kullanılabilirlik' },
    { tab: 'reservations' as TabType, icon: Clock, label: language === 'en' ? 'Confirm bookings' : 'Rezervasyonları onayla', detail: language === 'en' ? 'Today and upcoming tables' : 'Bugünkü ve yaklaşan masalar' },
    { tab: 'analytics' as TabType, icon: TrendingUp, label: language === 'en' ? 'View reports' : 'Raporları görüntüle', detail: language === 'en' ? 'Revenue and product movement' : 'Gelir ve ürün hareketleri' },
  ];

  if (isLoading) {
    return <div className="text-white/70">{language === 'en' ? 'Loading command center...' : 'Komuta merkezi yükleniyor...'}</div>;
  }

  return (
    <div className="text-white space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-mardo-yellow/20 via-white/[0.06] to-white/[0.02] p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-mardo-yellow/20 blur-3xl" />
        <div className="absolute right-24 bottom-0 h-32 w-32 rounded-full bg-mardo-purple/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mardo-yellow/30 bg-mardo-yellow/10 px-3 py-1 text-sm font-semibold text-mardo-yellow">
              <Sparkles className="h-4 w-4" />
              {language === 'en' ? 'Executive overview' : 'Yönetici özeti'}
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              {language === 'en' ? 'Today at Mardo Café' : 'Bugün Mardo Café'}
            </h2>
            <p className="mt-3 max-w-2xl text-white/60">
              {language === 'en'
                ? 'A polished operations view for payments, kitchen flow, reservations, inventory and customer activity.'
                : 'Ödemeler, mutfak akışı, rezervasyonlar, stok ve müşteri hareketleri için zarif operasyon görünümü.'}
            </p>
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-mardo-yellow px-5 py-3 font-semibold text-mardo-dark shadow-lg shadow-mardo-yellow/20 transition hover:bg-mardo-beige"
          >
            {language === 'en' ? 'Open orders' : 'Siparişleri aç'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-2xl border bg-gradient-to-br ${card.accent} p-5 shadow-xl`}>
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <Activity className="h-4 w-4 opacity-40" />
              </div>
              <p className="text-sm font-semibold text-white/55">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-xs text-white/45">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{language === 'en' ? 'Priority actions' : 'Öncelikli işlemler'}</h3>
              <p className="text-sm text-white/50">{language === 'en' ? 'Fast paths to the work admins do most.' : 'Yöneticilerin en çok yaptığı işler için hızlı yollar.'}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.tab}
                  onClick={() => onSelectTab(action.tab)}
                  className="group rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-mardo-yellow/40 hover:bg-mardo-yellow/10"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-white/10 p-2 text-mardo-yellow">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white/30 transition group-hover:text-mardo-yellow" />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                  <p className="mt-1 text-sm text-white/45">{action.detail}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-bold">{language === 'en' ? 'Inventory watch' : 'Stok takibi'}</h3>
          <p className="mb-5 text-sm text-white/50">{stats?.lowStock || 0} {language === 'en' ? 'items need attention' : 'öğe ilgi bekliyor'}</p>
          <div className="space-y-3">
            {(stats?.lowStockItems || []).length === 0 ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                {language === 'en' ? 'All visible menu stock looks healthy.' : 'Görünen menü stokları sağlıklı.'}
              </div>
            ) : (
              stats?.lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div>
                    <p className="font-semibold">{item.name?.[language as 'en' | 'tr'] || item.name?.en || (language === 'en' ? 'Menu item' : 'Menü öğesi')}</p>
                    <p className="text-xs text-white/45">{item.category}</p>
                  </div>
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    {item.available === false ? (language === 'en' ? 'Off' : 'Kapalı') : language === 'en' ? `${item.stock ?? 0} left` : `${item.stock ?? 0} kaldı`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{language === 'en' ? 'Recent order stream' : 'Son sipariş akışı'}</h3>
            <p className="text-sm text-white/50">{language === 'en' ? 'Latest activity from the order system.' : 'Sipariş sisteminden son hareketler.'}</p>
          </div>
          <button onClick={() => onSelectTab('orders')} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:border-mardo-yellow/40 hover:text-mardo-yellow">
            {language === 'en' ? 'View all' : 'Tümünü gör'}
          </button>
        </div>
        <div className="space-y-3">
          {(stats?.recentOrders || []).length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/50">
              {language === 'en' ? 'No orders yet.' : 'Henüz sipariş yok.'}
            </div>
          ) : (
            stats?.recentOrders.map((order: any) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber || `#${String(order.id).slice(-4).toUpperCase()}`}</p>
                  <p className="text-sm text-white/45">{order.customer?.name || (language === 'en' ? 'Unknown customer' : 'Bilinmeyen müşteri')} · {new Date(order.createdAt).toLocaleString(language === 'en' ? 'en-US' : 'tr-TR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">{order.status}</span>
                  <span className="font-bold text-mardo-yellow">₺{Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

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
                    {new Date(photo.uploadedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR')} {new Date(photo.uploadedAt).toLocaleTimeString(language === 'en' ? 'en-US' : 'tr-TR')}
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
        headers: await getAuthHeaders(user),
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
        headers: await getAuthHeaders(user, { json: true }),
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
                  <p className="text-sm text-white/60">{order.customer?.name || (language === 'en' ? 'Unknown customer' : 'Bilinmeyen müşteri')}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(order.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR')} {new Date(order.createdAt).toLocaleTimeString(language === 'en' ? 'en-US' : 'tr-TR')}
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

function ReservationsManagementTab({ language, user }: { language: string; user: any }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReservations = async () => {
    setIsLoading(true);
    setActionError('');

    try {
      const response = await fetch('/api/reservations?all=true', {
        headers: await getAuthHeaders(user),
      });

      const data = await response.json();
      setReservations(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to load reservations.' : 'Rezervasyonlar yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string) => {
    setUpdatingId(reservationId);
    setActionError('');

    try {
      const response = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: await getAuthHeaders(user, { json: true }),
        body: JSON.stringify({
          id: reservationId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }

      await loadReservations();
    } catch (error) {
      setActionError(language === 'en' ? 'Could not update reservation.' : 'Rezervasyon güncellenemedi.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteReservation = async (reservationId: string) => {
    if (!confirm(language === 'en' ? 'Delete this reservation?' : 'Bu rezervasyonu silmek istiyor musunuz?')) {
      return;
    }

    setUpdatingId(reservationId);
    setActionError('');

    try {
      const response = await fetch(`/api/reservations?id=${reservationId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(user),
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      await loadReservations();
    } catch (error) {
      setActionError(language === 'en' ? 'Could not delete reservation.' : 'Rezervasyon silinemedi.');
    } finally {
      setUpdatingId('');
    }
  };

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

      {actionError && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="text-white/70">{language === 'en' ? 'Loading reservations...' : 'Rezervasyonlar yükleniyor...'}</div>
      ) : reservations.length === 0 ? (
        <div className="text-white/70">{language === 'en' ? 'No reservations yet.' : 'Henüz rezervasyon yok.'}</div>
      ) : (
        <div className="space-y-3">
          {reservations.map((res) => (
            <div key={res.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-mardo-purple/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-mardo-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{res.customerName || (language === 'en' ? 'Unknown' : 'Bilinmiyor')}</p>
                    <p className="text-sm text-white/60">{res.email}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(res.reservationDate || '').toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR')} {language === 'en' ? 'at' : 'saat'} {res.time || (language === 'en' ? 'N/A' : 'Yok')}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{res.guestCount || '?'} {language === 'en' ? 'Guests' : 'Misafir'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    res.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    res.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                    'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  }`}>
                    {res.status === 'confirmed' ? (language === 'en' ? 'Confirmed' : 'Onaylandı') :
                     res.status === 'cancelled' ? (language === 'en' ? 'Cancelled' : 'İptal Edildi') :
                     (language === 'en' ? 'Pending' : 'Beklemede')}
                  </span>
                </div>
                <div className="flex gap-2 ml-4">
                  {res.status !== 'confirmed' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'confirmed')}
                      disabled={updatingId === res.id}
                      className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {language === 'en' ? 'Confirm' : 'Onayla'}
                    </button>
                  )}
                  <button
                    onClick={() => deleteReservation(res.id)}
                    disabled={updatingId === res.id}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {language === 'en' ? 'Delete' : 'Sil'}
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

function UsersManagementTab({ language, user }: { language: string; user: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setActionError('');

    try {
      const response = await fetch('/api/users', {
        headers: await getAuthHeaders(user),
      });

      const data = await response.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to load users.' : 'Kullanıcılar yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setActionError('');

    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: await getAuthHeaders(user, { json: true }),
        body: JSON.stringify({
          id: userId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      await loadUsers();
    } catch (error) {
      setActionError(language === 'en' ? 'Could not update user role.' : 'Kullanıcı rolü güncellenemedi.');
    } finally {
      setUpdatingId('');
    }
  };

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

      {actionError && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="text-white/70">{language === 'en' ? 'Loading users...' : 'Kullanıcılar yükleniyor...'}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'User' : 'Kullanıcı'}</th>
                <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Email' : 'E-posta'}</th>
                <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Role' : 'Rol'}</th>
                <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Joined' : 'Katıldı'}</th>
                <th className="text-left py-3 px-4 text-white/70 font-semibold">{language === 'en' ? 'Actions' : 'İşlemler'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-semibold">{u.displayName || (language === 'en' ? 'User' : 'Kullanıcı')}</td>
                  <td className="py-3 px-4 text-white/60">{u.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      disabled={updatingId === u.id}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer disabled:opacity-50 ${
                        u.role === 'admin' ? 'bg-mardo-yellow/20 text-mardo-yellow border-mardo-yellow/50' :
                        u.role === 'moderator' ? 'bg-mardo-purple/20 text-mardo-purple border-mardo-purple/50' :
                        'bg-white/10 text-white/70 border-white/20'
                      }`}
                    >
                      <option value="user">{language === 'en' ? 'User' : 'Kullanıcı'}</option>
                      <option value="moderator">{language === 'en' ? 'Moderator' : 'Moderatör'}</option>
                      <option value="admin">{language === 'en' ? 'Admin' : 'Yönetici'}</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-white/60 text-sm">
                    {new Date(u.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR')}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title={language === 'en' ? 'View details' : 'Detayları görüntüle'}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ language, user }: { language: string; user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/orders?all=true', {
        headers: await getAuthHeaders(user),
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

  const translateOrderStatus = (status: string) => {
    if (language === 'en') return status;
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      preparing: 'Hazırlanıyor',
      ready: 'Hazır',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    };
    return labels[status] || status;
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
                <p className="font-semibold capitalize">{translateOrderStatus(status)}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-white/60">{String(count)} {language === 'en' ? 'orders' : 'sipariş'}</p>
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
    {
      id: '1',
      type: 'order',
      message: { en: 'New order received - ORD-042', tr: 'Yeni sipariş alındı - ORD-042' },
      time: { en: 'Just now', tr: 'Az önce' },
    },
    {
      id: '2',
      type: 'user',
      message: { en: 'New user registration - ali.yildiz@example.com', tr: 'Yeni kullanıcı kaydı - ali.yildiz@example.com' },
      time: { en: '5 minutes ago', tr: '5 dakika önce' },
    },
    {
      id: '3',
      type: 'photo',
      message: { en: 'Photo uploaded for moderation', tr: 'Moderasyon için fotoğraf yüklendi' },
      time: { en: '1 hour ago', tr: '1 saat önce' },
    },
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
                <p className="font-semibold">{n.message[language as 'en' | 'tr']}</p>
                <p className="text-sm text-white/50">{n.time[language as 'en' | 'tr']}</p>
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

function AdminSettingsTab({ language, setLanguage, user }: { language: string; setLanguage: (language: 'en' | 'tr') => void; user: any }) {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings', {
        headers: await getAuthHeaders(user),
      });

      const data = await response.json();
      setSettings(data.data || {});
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (key: string, value: any) => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updates = { ...settings, [key]: value };
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: await getAuthHeaders(user, { json: true }),
        body: JSON.stringify({ [key]: value }),
      });

      if (response.ok) {
        setSettings(updates);
        setSaveMessage(language === 'en' ? '✓ Settings saved' : '✓ Ayarlar kaydedildi');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveMessage(language === 'en' ? '✗ Failed to save' : '✗ Kaydetme başarısız');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-white">{language === 'en' ? 'Loading settings...' : 'Ayarlar yükleniyor...'}</div>;
  }

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-8">
        {language === 'en' ? '⚙️ Admin Settings' : '⚙️ Yönetici Ayarları'}
      </h2>

      {saveMessage && (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
          saveMessage.includes('✓') 
            ? 'border-green-500/40 bg-green-500/10 text-green-200'
            : 'border-red-500/40 bg-red-500/10 text-red-200'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-mardo-yellow/10 to-white/[0.03] border border-mardo-yellow/30 rounded-xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-lg">{language === 'en' ? 'Admin Portal Language' : 'Yönetici Portalı Dili'}</p>
              <p className="text-white/60 text-sm mt-1">
                {language === 'en'
                  ? 'Translate the whole admin portal and keep your choice for future visits.'
                  : 'Tüm yönetici portalını çevirin ve seçiminizi sonraki ziyaretler için saklayın.'}
              </p>
            </div>
            <div className="flex rounded-2xl border border-white/15 bg-black/20 p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${language === 'en' ? 'bg-mardo-yellow text-mardo-dark' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${language === 'tr' ? 'bg-mardo-yellow text-mardo-dark' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                Türkçe
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{language === 'en' ? 'Email Notifications' : 'E-posta Bildirimleri'}</p>
              <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Receive alerts for important events' : 'Önemli olaylar için uyarı alın'}</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.emailNotifications || false}
              onChange={(e) => updateSettings('emailNotifications', e.target.checked)}
              disabled={isSaving}
              className="w-6 h-6 cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">{language === 'en' ? 'Auto-Moderation' : 'Otomatik Moderasyon'}</p>
              <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Enable AI-powered content filtering' : 'AI destekli içerik filtrelemeyi etkinleştir'}</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.autoModeration || false}
              onChange={(e) => updateSettings('autoModeration', e.target.checked)}
              disabled={isSaving}
              className="w-6 h-6 cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div>
            <p className="font-semibold text-lg">{language === 'en' ? 'Business Hours' : 'İş Saatleri'}</p>
            <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Set restaurant opening and closing times' : 'Restoranın açılış ve kapanış saatlerini ayarlayın'}</p>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label className="text-white/70 text-sm">{language === 'en' ? 'Open at' : 'Açılış'}</label>
                <input
                  type="time"
                  value={settings?.businessHours?.open || '09:00'}
                  onChange={(e) => updateSettings('businessHours', { ...settings?.businessHours, open: e.target.value })}
                  className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-white/70 text-sm">{language === 'en' ? 'Close at' : 'Kapanış'}</label>
                <input
                  type="time"
                  value={settings?.businessHours?.close || '22:00'}
                  onChange={(e) => updateSettings('businessHours', { ...settings?.businessHours, close: e.target.value })}
                  className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div>
            <p className="font-semibold text-lg">{language === 'en' ? 'Minimum Order Value' : 'Minimum Sipariş Değeri'}</p>
            <p className="text-white/60 text-sm mt-1">{language === 'en' ? 'Minimum amount required to place an order' : 'Sipariş vermek için gereken minimum tutar'}</p>
            <input
              type="number"
              value={settings?.minOrderValue || 50}
              onChange={(e) => updateSettings('minOrderValue', parseFloat(e.target.value))}
              className="w-full mt-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
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
