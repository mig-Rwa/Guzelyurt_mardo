'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { Camera, Package, Award, MapPin, Calendar, Settings, Heart, LogOut, User } from 'lucide-react';
import Image from 'next/image';

type TabType = 'photos' | 'orders' | 'loyalty' | 'addresses' | 'reservations' | 'favorites' | 'settings';

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
      {/* Header */}
      <div className="bg-mardo-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-mardo-yellow rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-mardo-dark" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'en' ? 'Welcome back' : 'Tekrar hoş geldiniz'}, {user.email?.split('@')[0]}!
                </h1>
                <p className="text-mardo-beige">{user.email}</p>
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

          {/* Content Area */}
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

// Tab Components (placeholders for now)
function MyPhotosTab() {
  const { language } = useLanguage();
  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'My Photos' : 'Fotoğraflarım'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
      <p className="text-center text-gray-500 mt-8">
        {language === 'en' ? 'Your uploaded photos will appear here' : 'Yüklediğiniz fotoğraflar burada görünecek'}
      </p>
    </div>
  );
}

function OrdersTab() {
  const { language } = useLanguage();
  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Order History' : 'Sipariş Geçmişi'}
      </h2>
      <p className="text-center text-gray-500 mt-8">
        {language === 'en' ? 'No orders yet' : 'Henüz sipariş yok'}
      </p>
    </div>
  );
}

function LoyaltyTab() {
  const { language } = useLanguage();
  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Loyalty Program' : 'Sadakat Programı'}
      </h2>
      <div className="bg-gradient-to-r from-mardo-yellow to-mardo-beige rounded-2xl p-8 text-center">
        <Award className="w-16 h-16 text-mardo-dark mx-auto mb-4" />
        <p className="text-3xl font-bold text-mardo-dark mb-2">0 / 10</p>
        <p className="text-mardo-dark/80">
          {language === 'en' ? 'Stamps collected' : 'Toplanan pul'}
        </p>
      </div>
    </div>
  );
}

function AddressesTab() {
  const { language } = useLanguage();
  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'Saved Addresses' : 'Kayıtlı Adresler'}
      </h2>
      <p className="text-center text-gray-500 mt-8">
        {language === 'en' ? 'No saved addresses' : 'Kayıtlı adres yok'}
      </p>
    </div>
  );
}

function ReservationsTab() {
  const { language } = useLanguage();
  return (
    <div>
      <h2 className="text-2xl font-bold text-mardo-dark mb-6">
        {language === 'en' ? 'My Reservations' : 'Rezervasyonlarım'}
      </h2>
      <p className="text-center text-gray-500 mt-8">
        {language === 'en' ? 'No reservations yet' : 'Henüz rezervasyon yok'}
      </p>
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
      <p className="text-center text-gray-500 mt-8">
        {language === 'en' ? 'No favorites yet' : 'Henüz favori yok'}
      </p>
    </div>
  );
}

function SettingsTab() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
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
            {language === 'en' ? 'Language' : 'Dil'}
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-xl">
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
      </div>
    </div>
  );
}
