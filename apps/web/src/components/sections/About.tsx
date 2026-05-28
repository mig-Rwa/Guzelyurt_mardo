'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Coffee, Award, Heart } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: Coffee, title: 'Quality', desc: 'Premium ingredients always' },
    { icon: Award, title: 'Variety', desc: 'Something for everyone' },
    { icon: Heart, title: 'Warmth', desc: 'A cozy space for all' },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-mardo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden relative">
              <Image
                src="https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1"
                alt="Mardo Café"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mardo-yellow rounded-2xl -z-10" />
          </div>

          {/* Right - Content */}
          <div>
            <span className="text-mardo-yellow text-sm tracking-[0.3em] uppercase font-medium">
              {t('about.subtitle')}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6 font-serif">
              {t('about.title')}
            </h2>
            <p className="text-mardo-beige text-lg leading-relaxed mb-8">
              {t('about.story')}
            </p>

            {/* Values */}
            <div className="grid grid-cols-3 gap-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white/5 rounded-xl"
                >
                  <value.icon className="w-8 h-8 text-mardo-yellow mx-auto mb-2" />
                  <h4 className="text-white font-semibold text-sm">
                    {value.title}
                  </h4>
                  <p className="text-mardo-beige text-xs mt-1">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
