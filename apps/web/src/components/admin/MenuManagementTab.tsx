'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { MenuItem } from '@shared';

interface MenuFormData {
  id?: string;
  name: { en: string; tr: string };
  description: { en: string; tr: string };
  price: number;
  category: string;
  image: string;
  available: boolean;
  stock: number;
}

export default function MenuManagementTab({ language, user }: { language: string; user: any }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [formData, setFormData] = useState<MenuFormData>({
    name: { en: '', tr: '' },
    description: { en: '', tr: '' },
    price: 0,
    category: 'hotDrinks',
    image: '',
    available: true,
    stock: 50,
  });

  // Load menu items
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    setActionError('');

    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to load menu items.' : 'Menü öğeleri yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'hotDrinks', name: language === 'en' ? 'Hot Drinks' : 'Sıcak İçecekler' },
    { id: 'hotCoffee', name: language === 'en' ? 'Hot Coffee' : 'Sıcak Kahveler' },
    { id: 'coldCoffee', name: language === 'en' ? 'Cold Coffee' : 'Soğuk Kahveler' },
    { id: 'coldDrinks', name: language === 'en' ? 'Cold Drinks' : 'Soğuk İçecekler' },
    { id: 'waffles', name: language === 'en' ? 'Waffles' : 'Waffleler' },
    { id: 'cakes', name: language === 'en' ? 'Cakes' : 'Pastalar' },
    { id: 'milkDesserts', name: language === 'en' ? 'Milk Desserts' : 'Sütlü Tatlılar' },
    { id: 'breakfast', name: language === 'en' ? 'Breakfast' : 'Kahvaltı' },
    { id: 'burgers', name: language === 'en' ? 'Burgers' : 'Burgerler' },
    { id: 'cheesecake', name: language === 'en' ? 'Cheesecake' : 'Cheesecake' },
  ];

  const handleSaveItem = async () => {
    setIsSaving(true);
    setActionError('');

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch('/api/menu', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.uid || 'admin',
          'x-user-email': user?.email || '',
          'x-user-role': user?.role || 'admin',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      await loadItems();
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        name: { en: '', tr: '' },
        description: { en: '', tr: '' },
        price: 0,
        category: 'hotDrinks',
        image: '',
        available: true,
        stock: 50,
      });
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to save menu item.' : 'Menü öğesi kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm(language === 'en' ? 'Delete this item?' : 'Bu öğeyi sil?')) {
      return;
    }

    setActionError('');

    try {
      const response = await fetch('/api/menu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.uid || 'admin',
          'x-user-email': user?.email || '',
          'x-user-role': user?.role || 'admin',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      await loadItems();
    } catch (error) {
      setActionError(language === 'en' ? 'Failed to delete menu item.' : 'Menü öğesi silinemedi.');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setFormData(item);
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: { en: '', tr: '' },
      description: { en: '', tr: '' },
      price: 0,
      category: 'hotDrinks',
      image: '',
      available: true,
      stock: 50,
    });
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          {language === 'en' ? '🍽️ Menu Management' : '🍽️ Menü Yönetimi'}
        </h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-mardo-yellow text-mardo-dark rounded-lg hover:bg-mardo-beige transition-colors font-semibold"
        >
          <Plus className="w-4 h-4" />
          {language === 'en' ? 'New Item' : 'Yeni Öğe'}
        </button>
      </div>

      {actionError && (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="text-white/70">{language === 'en' ? 'Loading items...' : 'Öğeler yükleniyor...'}</div>
      ) : (
        <div className="space-y-3 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
              <div className="flex-1">
                <p className="font-semibold">{item.name[language as 'en' | 'tr']}</p>
                <p className="text-sm text-white/60">₺{item.price} • {item.category} • Stock: {item.stock}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditItem(item)}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {editingId
                  ? language === 'en'
                    ? 'Edit Item'
                    : 'Öğeyi Düzenle'
                  : language === 'en'
                    ? 'New Item'
                    : 'Yeni Öğe'}
              </h3>
              <button onClick={closeForm} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* English Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Name (English)' : 'Ad (İngilizce)'}
                </label>
                <Input
                  value={formData.name.en}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                  placeholder="Item name in English"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Turkish Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Name (Turkish)' : 'Ad (Türkçe)'}
                </label>
                <Input
                  value={formData.name.tr}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name, tr: e.target.value } })}
                  placeholder="Türkçe ad"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* English Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Description (English)' : 'Açıklama (İngilizce)'}
                </label>
                <Textarea
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  placeholder="Item description in English"
                  rows={2}
                  className="rounded-xl resize-none"
                />
              </div>

              {/* Turkish Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Description (Turkish)' : 'Açıklama (Türkçe)'}
                </label>
                <Textarea
                  value={formData.description.tr}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, tr: e.target.value } })}
                  placeholder="Türkçe açıklama"
                  rows={2}
                  className="rounded-xl resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Price (₺)' : 'Fiyat (₺)'}
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Category' : 'Kategori'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-12 rounded-xl bg-white/10 border border-white/20 text-white px-3"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Image URL' : 'Görsel URL'}
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {language === 'en' ? 'Stock' : 'Stok'}
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  placeholder="50"
                  className="h-12 rounded-xl"
                />
              </div>

              {/* Available Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <label className="text-sm font-semibold">
                  {language === 'en' ? 'Available' : 'Kullanılabilir'}
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={closeForm}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-semibold"
                >
                  {language === 'en' ? 'Cancel' : 'İptal'}
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-mardo-yellow text-mardo-dark hover:bg-mardo-beige disabled:opacity-50 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? (language === 'en' ? 'Saving...' : 'Kaydediliyor...') : language === 'en' ? 'Save' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
