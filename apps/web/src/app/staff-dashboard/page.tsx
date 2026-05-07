'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { LogOut, ChefHat, Package } from 'lucide-react';
import type { Order } from '@shared';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  // Check if user has staff access (admin or moderator)
  const userRole = (user as any)?.role || 'user';
  const hasStaffAccess = userRole === 'admin' || userRole === 'moderator' || userRole === 'staff';

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  if (!hasStaffAccess) {
    router.push('/dashboard');
    return null;
  }

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    setActionError('');

    try {
      const response = await fetch('/api/orders?all=true', {
        headers: {
          'x-user-id': user?.uid || '',
          'x-user-email': user?.email || '',
          'x-user-role': userRole,
        },
      });

      const data = await response.json();
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to load orders.' : 'Siparişler yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setActionError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.uid || '',
          'x-user-email': user?.email || '',
          'x-user-role': userRole,
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to update order status.' : 'Sipariş durumu güncellenemedi.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const statusColumns = [
    { id: 'pending', label: language === 'en' ? 'Pending Payment' : 'Ödeme Bekleniyor', color: 'bg-yellow-500' },
    { id: 'confirmed', label: language === 'en' ? 'Ready to Prepare' : 'Hazırlanmaya Hazır', color: 'bg-blue-500' },
    { id: 'preparing', label: language === 'en' ? 'Preparing' : 'Hazırlanıyor', color: 'bg-purple-500' },
    { id: 'ready', label: language === 'en' ? 'Ready' : 'Hazır', color: 'bg-green-500' },
    { id: 'completed', label: language === 'en' ? 'Completed' : 'Tamamlandı', color: 'bg-gray-500' },
  ];

  const getOrdersForStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-mardo-dark via-gray-900 to-gray-800 text-white border-b-2 border-mardo-yellow/30 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-mardo-yellow to-mardo-beige rounded-full flex items-center justify-center shadow-lg">
                <ChefHat className="w-7 h-7 text-mardo-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-mardo-yellow to-mardo-beige bg-clip-text text-transparent">
                  {language === 'en' ? 'Staff Kitchen Board' : 'Personel Mutfak Panosu'}
                </h1>
                <p className="text-mardo-yellow/80 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              {language === 'en' ? 'Logout' : 'Çıkış'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {actionError && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {actionError}
          </div>
        )}

        {isLoading ? (
          <div className="text-white text-center py-12">
            {language === 'en' ? 'Loading orders...' : 'Siparişler yükleniyor...'}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {statusColumns.map((col) => {
                const count = getOrdersForStatus(col.id).length;
                return (
                  <div key={col.id} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                    <p className="text-white/70 text-sm mb-2">{col.label}</p>
                    <p className={`text-3xl font-bold ${col.color.replace('bg-', 'text-')}`}>
                      {count}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {statusColumns.map((col) => (
                <div key={col.id} className="bg-white/5 border border-white/20 rounded-2xl p-4 min-h-[600px]">
                  {/* Column Header */}
                  <div className={`${col.color} text-white rounded-xl p-3 mb-4 font-semibold text-center text-sm`}>
                    {col.label}
                  </div>

                  {/* Orders */}
                  <div className="space-y-3">
                    {getOrdersForStatus(col.id).map((order) => (
                      <div
                        key={order.id}
                        className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg p-3 hover:border-mardo-yellow/50 transition-all cursor-move"
                      >
                        {/* Order Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-white">
                              {language === 'en' ? 'Order' : 'Sipariş'} #{order.orderNumber || order.id.slice(-4).toUpperCase()}
                            </p>
                            <p className="text-xs text-white/60">
                              {new Date(order.createdAt).toLocaleTimeString(language === 'en' ? 'en-US' : 'tr-TR')}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white/5 rounded p-2 mb-3 text-xs text-white/80 space-y-1 max-h-20 overflow-y-auto">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name[language as 'en' | 'tr']}</span>
                              <span className="text-white/60">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Status Controls */}
                        <div className="space-y-2">
                          {statusColumns.map((nextCol) => {
                            if (nextCol.id === col.id) return null;
                            return (
                              <button
                                key={nextCol.id}
                                onClick={() => handleStatusChange(order.id, nextCol.id)}
                                className="w-full px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                              >
                                {language === 'en' ? '→' : '→'} {nextCol.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getOrdersForStatus(col.id).length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-8 h-8 text-white/30 mx-auto mb-2" />
                      <p className="text-white/50 text-sm">
                        {language === 'en' ? 'No orders' : 'Sipariş yok'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
