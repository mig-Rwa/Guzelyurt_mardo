'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, Shield, User } from 'lucide-react';
import Link from 'next/link';

interface UserEntry {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt?: string;
}

export default function AdminManagerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Only allow access to specific email
  const ADMIN_MANAGER_EMAIL = 'miguelmbabatunga31@gmail.com';

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.email !== ADMIN_MANAGER_EMAIL) {
      router.push('/dashboard');
      return;
    }

    loadUsers();
  }, [user, router]);

  const loadUsers = () => {
    try {
      setLoading(true);
      const allUsers: UserEntry[] = [];

      // Get all users from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('user-profile-')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const profile = JSON.parse(data) as UserEntry;
              allUsers.push(profile);
            } catch {
              // Skip invalid entries
            }
          }
        }
      }

      // Sort by email
      allUsers.sort((a, b) => a.email.localeCompare(b.email));
      setUsers(allUsers);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = (uid: string, newRole: 'user' | 'admin' | 'moderator') => {
    try {
      const key = `user-profile-${uid}`;
      const data = localStorage.getItem(key);
      
      if (!data) {
        showMessage('error', language === 'en' ? 'User not found' : 'Kullanıcı bulunamadı');
        return;
      }

      const profile = JSON.parse(data) as UserEntry;
      profile.role = newRole;
      
      localStorage.setItem(key, JSON.stringify(profile));
      
      // Update local state
      setUsers(users.map(u => 
        u.uid === uid ? { ...u, role: newRole } : u
      ));

      showMessage('success', 
        language === 'en' 
          ? `${profile.email} is now a ${newRole}` 
          : `${profile.email} artık bir ${newRole}`
      );
    } catch (error) {
      showMessage('error', language === 'en' ? 'Failed to update user' : 'Kullanıcı güncellenemedi');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mardo-dark via-mardo-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mardo-yellow mx-auto mb-4"></div>
          <p>{language === 'en' ? 'Loading...' : 'Yükleniyor...'}</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_MANAGER_EMAIL) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mardo-dark via-mardo-dark to-black text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-mardo-yellow" />
            <h1 className="text-3xl font-bold">
              {language === 'en' ? 'Admin Manager' : 'Yönetici Yönetimi'}
            </h1>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500' 
              : 'bg-red-500/20 text-red-400 border border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-mardo-yellow">
                    {language === 'en' ? 'Email' : 'E-posta'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-mardo-yellow">
                    {language === 'en' ? 'Name' : 'İsim'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-mardo-yellow">
                    {language === 'en' ? 'Current Role' : 'Mevcut Rol'}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-mardo-yellow">
                    {language === 'en' ? 'Actions' : 'İşlemler'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      {language === 'en' ? 'No users found' : 'Kullanıcı bulunamadı'}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{u.displayName || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' 
                            ? 'bg-mardo-yellow/20 text-mardo-yellow'
                            : u.role === 'moderator'
                            ? 'bg-mardo-purple/20 text-mardo-purple'
                            : 'bg-white/10 text-gray-300'
                        }`}>
                          {u.role === 'admin' 
                            ? (language === 'en' ? 'Admin' : 'Yönetici')
                            : u.role === 'moderator'
                            ? (language === 'en' ? 'Moderator' : 'Moderatör')
                            : (language === 'en' ? 'User' : 'Kullanıcı')
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => updateUserRole(u.uid, 'admin')}
                              className="px-3 py-1 bg-mardo-yellow/20 hover:bg-mardo-yellow/30 text-mardo-yellow text-xs rounded transition-colors flex items-center gap-1"
                            >
                              <Shield className="w-3 h-3" />
                              {language === 'en' ? 'Make Admin' : 'Yönetici Yap'}
                            </button>
                          )}
                          {u.role === 'admin' && (
                            <button
                              onClick={() => updateUserRole(u.uid, 'user')}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors flex items-center gap-1"
                            >
                              <User className="w-3 h-3" />
                              {language === 'en' ? 'Revoke Admin' : 'Yöneticiyi İptal Et'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-mardo-purple/10 border border-mardo-purple/30 rounded-lg p-4 text-sm text-gray-300">
          <p className="font-semibold text-mardo-purple mb-2">
            {language === 'en' ? 'ℹ️ How to use:' : 'ℹ️ Nasıl kullanılır:'}
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>{language === 'en' 
              ? 'Click "Make Admin" to promote a user to admin role' 
              : 'Bir kullanıcıyı yönetici rolüne yükseltmek için "Yönetici Yap"ı tıklayın'}
            </li>
            <li>{language === 'en' 
              ? 'Click "Revoke Admin" to demote an admin back to user role' 
              : 'Bir yöneticiyi kullanıcı rolüne indirmek için "Yöneticiyi İptal Et"i tıklayın'}
            </li>
            <li>{language === 'en' 
              ? 'Changes are saved immediately to localStorage' 
              : 'Değişiklikler hemen localStorage\'a kaydedilir'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
