'use client';

import { Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { dailySpecials } from '@shared';
import { Button } from '@/components/ui/button';

export default function DailySpecials() {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  return (
    <section className="py-12 bg-gradient-to-r from-mardo-brown to-mardo-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mardo-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-mardo-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sparkles className="w-6 h-6 text-mardo-yellow" />
          <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">
            {t('specials.title')}
          </h2>
          <Sparkles className="w-6 h-6 text-mardo-yellow" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {dailySpecials.map((special) => (
            <div
              key={special.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:border-mardo-yellow/50 transition-all duration-300 group"
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={`${special.image}?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1`}
                    alt={special.name[language]}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-mardo-orange text-white text-xs font-bold rounded-full mb-2">
                        {t('specials.badge')}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        {special.name[language]}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {special.description[language]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 line-through text-sm">
                        ₺{special.originalPrice}
                      </span>
                      <span className="text-mardo-yellow font-bold text-xl">
                        ₺{special.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <Clock className="w-3 h-3" />
                      {special.validTime[language]}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() =>
                  addToCart({
                    id: special.id,
                    name: special.name,
                    description: special.description,
                    price: special.price,
                    image: special.image,
                    category: 'specials',
                    available: true,
                  })
                }
                className="w-full mt-4 rounded-xl py-2.5"
              >
                {t('menu.addToCart')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
