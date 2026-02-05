'use client';

import { useState } from 'react';
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
  MessageSquare,
  Bell,
} from 'lucide-react';

type TabType = 'photos' | 'orders' | 'reservations' | 'users' | 'analytics' | 'notifications' | 'settings';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  // Check if user is admin (in production, check role from database)
  const isAdmin = user?.email?.includes('admin'); // Simple check for demo

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (!isAdmin) {
    router.push('/dashboard');
    return null;
  }

  const tabs = [
    { id: 'photos' as TabType, icon: Camera, label: language === 'en' ? 'Photo Moderation' : 'Fotoğraf Moderasyonu' },
    { id: 'orders' as TabType, icon: Package, label: language === 'en' ? 'Orders' : 'Siparişler' },
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-mardo-dark to-gray-900 text-white border-b border-mardo-yellow/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-mardo-yellow rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-mardo-dark" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'en' ? 'Admin Dashboard' : 'Yönetici Paneli'}
                </h1>
                <p className="text-mardo-beige text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {language === 'en' ? 'Logout' : 'Çıkış'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/5 backdrop-blur rounded-2xl shadow-lg p-4 sticky top-4 border border-white/10">
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
                          : 'text-white/80 hover:bg-white/10'
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
            <div className="bg-white/5 backdrop-blur rounded-2xl shadow-lg p-6 min-h-[600px] border border-white/10">
              {activeTab === 'photos' && <PhotoModerationTab />}
              {activeTab === 'orders' && <OrdersManagementTab />}
              {activeTab === 'reservations' && <ReservationsManagementTab />}
              {activeTab === 'users' && <UsersManagementTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'settings' && <AdminSettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function PhotoModerationTab() {
  const { language } = useLanguage();
  const [photos] = useState([
    { id: '1', customerName: 'John Doe', status: 'pending', uploadedAt: new Date().toISOString() },
    { id: '2', customerName: 'Jane Smith', status: 'pending', uploadedAt: new Date().toISOString() },
  ]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Photo Moderation' : 'Fotoğraf Moderasyonu'}
        </h2>
        <div className="px-3 py-1 bg-mardo-yellow text-mardo-dark rounded-full text-sm font-semibold">
          {photos.length} {language === 'en' ? 'Pending' : 'Bekliyor'}
        </div>
      </div>

      <div className="space-y-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-600 rounded-lg" />
              <div>
                <p className="font-semibold">{photo.customerName}</p>
                <p className="text-sm text-white/60">
                  {new Date(photo.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                {language === 'en' ? 'Approve' : 'Onayla'}
              </button>
              <button className="px-4 py-2 bg-mardo-yellow text-mardo-dark rounded-lg hover:bg-mardo-beige transition-colors">
                {language === 'en' ? 'Feature' : 'Öne Çıkar'}
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                {language === 'en' ? 'Reject' : 'Reddet'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersManagementTab() {
  const { language } = useLanguage();
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Orders Management' : 'Sipariş Yönetimi'}
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-white/60 text-sm">{language === 'en' ? 'Today' : 'Bugün'}</p>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-white/60 text-sm">{language === 'en' ? 'Pending' : 'Bekliyor'}</p>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-white/60 text-sm">{language === 'en' ? 'Revenue' : 'Gelir'}</p>
          <p className="text-3xl font-bold">₺1,240</p>
        </div>
      </div>
      <p className="text-center text-white/60 mt-8">
        {language === 'en' ? 'Recent orders will appear here' : 'Son siparişler burada görünecek'}
      </p>
    </div>
  );
}

function ReservationsManagementTab() {
  const { language } = useLanguage();
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Reservations' : 'Rezervasyonlar'}
      </h2>
      <p className="text-center text-white/60 mt-8">
        {language === 'en' ? 'No reservations today' : 'Bugün rezervasyon yok'}
      </p>
    </div>
  );
}

function UsersManagementTab() {
  const { language } = useLanguage();
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Users' : 'Kullanıcılar'}
      </h2>
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <p className="text-white/60 text-sm">{language === 'en' ? 'Total Users' : 'Toplam Kullanıcı'}</p>
        <p className="text-3xl font-bold">156</p>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const { language } = useLanguage();
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Analytics' : 'Analitik'}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-mardo-yellow mb-2" />
          <p className="text-white/60 text-sm">{language === 'en' ? 'Total Revenue' : 'Toplam Gelir'}</p>
          <p className="text-3xl font-bold">₺45,230</p>
        </div>
        <div className="bg-white/10 rounded-xl p-6">
          <Package className="w-8 h-8 text-mardo-yellow mb-2" />
          <p className="text-white/60 text-sm">{language === 'en' ? 'Total Orders' : 'Toplam Sipariş'}</p>
          <p className="text-3xl font-bold">1,247</p>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const { language } = useLanguage();
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Notifications' : 'Bildirimler'}
      </h2>
      <p className="text-center text-white/60 mt-8">
        {language === 'en' ? 'No new notifications' : 'Yeni bildirim yok'}
      </p>
    </div>
  );
}

function AdminSettingsTab() {
  const { language } = useLanguage();
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'Admin Settings' : 'Yönetici Ayarları'}
      </h2>
      <div className="space-y-4">
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-2">
            {language === 'en' ? 'Store Hours' : 'Çalışma Saatleri'}
          </h3>
          <p className="text-white/60 text-sm">
            {language === 'en' ? 'Configure opening and closing times' : 'Açılış ve kapanış saatlerini ayarlayın'}
          </p>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-2">
            {language === 'en' ? 'Delivery Settings' : 'Teslimat Ayarları'}
          </h3>
          <p className="text-white/60 text-sm">
            {language === 'en' ? 'Manage delivery zones and fees' : 'Teslimat bölgelerini ve ücretlerini yönetin'}
          </p>
        </div>
      </div>
    </div>
  );
}
