'use client';

import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Suspense, lazy } from 'react';

// Lazy load 3D component to not block initial render
const Hero3D = lazy(() => import('@/components/3d/Hero3D'));

export default function Hero() {
  const { t } = useLanguage();

  const scrollToMenu = () => {
    const element = document.querySelector('#menu');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
          alt="Mardo Café"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover scale-105"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAABQb/xAAaEQACAwEBAAAAAAAAAAAAAAABAgADBBEh/9oADAMBAAIRAxEAPwCHt3cF3aXsMV5O89rM4SRJQGDA+xnkZqzuzcE9w8kJuJBE6lWCtgMCMEH+0pStM+NRfwDDrVSi5n//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mardo-dark/70 via-mardo-dark/50 to-mardo-dark/90" />
        <div className="absolute inset-0 bg-mardo-brown/20" />
      </div>

      {/* 3D Elements - Lazy loaded */}
      <div className="absolute inset-0 hidden md:block">
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
      </div>

      {/* Floating Elements (fallback/addition to 3D) */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-mardo-yellow/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-16 w-32 h-32 bg-mardo-cyan/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 md:space-y-8">
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 md:w-12 bg-mardo-yellow" />
            <span className="text-mardo-yellow text-sm md:text-base tracking-[0.3em] uppercase font-medium">
              {t('hero.subtitle')}
            </span>
            <span className="h-px w-8 md:w-12 bg-mardo-yellow" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight font-serif">
            {t('hero.title')}
          </h1>

          {/* Description */}
          <p className="max-w-xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={scrollToMenu}
              className="group px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-mardo-yellow/25"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={scrollToMenu}
              variant="outline"
              className="border-2 border-white/30 bg-transparent hover:bg-white/10 text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
            >
              <UtensilsCrossed className="mr-2 w-5 h-5" />
              {t('hero.orderNow')}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-mardo-yellow rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
