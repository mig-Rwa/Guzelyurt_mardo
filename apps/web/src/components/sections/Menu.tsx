'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { menuItems } from '@shared/data';
import type { MenuItem } from '@shared/types';

export default function Menu() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const categories = [
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
  ];

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

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
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name[language]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mardo-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-mardo-yellow text-mardo-dark px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  ₺{item.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-xl font-bold text-mardo-dark mb-2 group-hover:text-mardo-brown transition-colors">
                  {item.name[language]}
                </h3>
                <p className="text-mardo-gray text-sm mb-4 line-clamp-2">
                  {item.description[language]}
                </p>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(item)}
                  variant="secondary"
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    addedItems[item.id]
                      ? 'bg-green-500 hover:bg-green-500 text-white'
                      : ''
                  }`}
                >
                  {addedItems[item.id] ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      {t('menu.added')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      {t('menu.addToCart')}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
