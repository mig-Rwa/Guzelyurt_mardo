'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { testimonials } from '@shared/data';

export default function Testimonials() {
  const { language, t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-mardo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif">
            {t('testimonials.title')}
          </h2>
          <p className="text-mardo-beige text-lg">{t('testimonials.subtitle')}</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-mardo-yellow/30 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-mardo-yellow text-mardo-yellow"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/90 mb-6 italic">
                "{testimonial.text[language]}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={`${testimonial.image}?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`}
                    alt={testimonial.name[language]}
                    fill
                    sizes="48px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {testimonial.name[language]}
                  </p>
                  <p className="text-mardo-beige text-sm">
                    {testimonial.role[language]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
