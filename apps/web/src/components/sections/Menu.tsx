'use client';

import { useState, memo, useCallback, useMemo, useEffect } from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@shared';

// Memoized menu item card for better performance
const MenuItemCard = memo(function MenuItemCard({
  item,
  language,
  isAdded,
  onAddToCart,
  addedText,
  addToCartText,
  isSoldOut,
}: {
  item: MenuItem;
  language: 'en' | 'tr';
  isAdded: boolean;
  onAddToCart: () => void;
  addedText: string;
  addToCartText: string;
  isSoldOut: boolean;
}) {
  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${isSoldOut ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={`${item.image}?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`}
          alt={item.name[language]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover group-hover:scale-110 transition-transform duration-700 ${isSoldOut ? 'grayscale' : ''}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mardo-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price Badge or Sold Out Badge */}
        {isSoldOut ? (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {language === 'en' ? 'Sold Out' : 'Tükendi'}
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-mardo-yellow text-mardo-dark px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ₺{item.price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <h3 className="text-xl font-bold text-mardo-dark mb-2 group-hover:text-mardo-brown transition-colors">
          {item.name[language]}
        </h3>
        <p className="text-mardo-gray text-sm mb-4 line-clamp-2">
          {item.description[language]}
        </p>

        {/* Stock Info */}
        {!isSoldOut && (item.stock || 0) < 10 && (
          <p className="text-xs text-orange-600 mb-3 font-semibold">
            {language === 'en' ? `Only ${item.stock} left!` : `Sadece ${item.stock} kaldı!`}
          </p>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={onAddToCart}
          disabled={isSoldOut}
          variant="secondary"
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            isSoldOut ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isAdded ? 'bg-green-500 hover:bg-green-500 text-white' : ''
          }`}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              {addedText}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              {isSoldOut ? (language === 'en' ? 'Sold Out' : 'Tükendi') : addToCartText}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
});

export default function Menu() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu items on mount
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuItems(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  const categories = useMemo(() => [
    { id: 'all', label: t('menu.categories.all') },
    { id: 'hotDrinks', label: t('menu.categories.hotDrinks') },
    { id: 'hotCoffee', label: t('menu.categories.hotCoffee') },
    { id: 'coldCoffee', label: t('menu.categories.coldCoffee') },
    { id: 'coldDrinks', label: t('menu.categories.coldDrinks') },
    { id: 'waffles', label: t('menu.categories.waffles') },
    { id: 'cakes', label: t('menu.categories.cakes') },
    { id: 'milkDesserts', label: t('menu.categories.milkDesserts') },
    { id: 'breakfast', label: t('menu.categories.breakfast') },
    { id: 'burgers', label: t('menu.categories.burgers') },
    { id: 'cheesecake', label: t('menu.categories.cheesecake') },
  ], [t]);

  const filteredItems = useMemo(() =>
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory, menuItems]
  );

  const handleAddToCart = useCallback((item: MenuItem) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  }, [addToCart]);

  if (isLoading) {
    return (
      <section id="menu" className="py-20 md:py-28 bg-mardo-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-mardo-gray">{language === 'en' ? 'Loading menu...' : 'Menü yükleniyor...'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 md:py-28 bg-mardo-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mardo-dark mb-4 font-serif">
            {t('menu.title')}
          </h2>
          <p className="text-mardo-gray text-lg max-w-xl mx-auto">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-mardo-brown text-white shadow-lg'
                  : 'bg-white text-mardo-gray hover:bg-mardo-brown/10 border border-mardo-brown/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              language={language}
              isAdded={addedItems[item.id] || false}
              onAddToCart={() => handleAddToCart(item)}
              addedText={t('menu.added')}
              addToCartText={t('menu.addToCart')}
              isSoldOut={(item.stock || 0) === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
