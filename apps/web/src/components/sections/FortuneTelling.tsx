'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { Sparkles, RefreshCw, Coffee } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { fortuneMessages } from '@shared/data';
import { Button } from '@/components/ui/button';
import { getRandomItem, isWebGLSupported } from '@/lib/utils';

// Lazy load 3D component
const Fortune3D = lazy(() => import('@/components/3d/Fortune3D'));

export default function FortuneTelling() {
  const { language, t } = useLanguage();
  const [fortune, setFortune] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(isWebGLSupported());
  }, []);

  const revealFortune = () => {
    setIsRevealing(true);
    setTimeout(() => {
      const messages = fortuneMessages[language];
      setFortune(getRandomItem(messages));
      setIsRevealing(false);
    }, 2000);
  };

  const resetFortune = () => {
    setFortune(null);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-mardo-dark to-[#2a2424] relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-mardo-purple rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-mardo-yellow rounded-full blur-[60px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 3D Coffee Cup */}
            {use3D && (
              <div className="hidden md:flex items-center justify-center">
                <Suspense fallback={<div className="h-[200px] w-[200px] bg-mardo-purple/10 animate-pulse rounded-full" />}>
                  <Fortune3D isRevealing={isRevealing} />
                </Suspense>
              </div>
            )}

            {/* Left side - Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-mardo-purple/20 rounded-full mb-4">
                <Coffee className="w-4 h-4 text-mardo-purple" />
                <span className="text-mardo-purple text-sm font-medium">
                  {t('fortune.subtitle')}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-serif">
                {t('fortune.title')}
              </h3>
              <p className="text-mardo-beige text-sm mb-4">
                {t('fortune.description')}
              </p>
              <p className="text-white/40 text-xs">{t('fortune.disclaimer')}</p>
            </div>

            {/* Right side - Fortune card */}
            <div className="w-full md:w-auto">
              {!fortune && !isRevealing && (
                <Button
                  onClick={revealFortune}
                  className="w-full md:w-auto bg-gradient-to-r from-mardo-purple to-[#78286e] hover:from-mardo-purple/90 hover:to-[#78286e]/90 text-white px-8 py-4 font-semibold rounded-full transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t('fortune.cta')}
                </Button>
              )}

              {isRevealing && (
                <div className="flex items-center gap-3 text-mardo-purple">
                  <div className="w-8 h-8 border-2 border-mardo-purple/30 border-t-mardo-purple rounded-full animate-spin" />
                  <span className="animate-pulse">Reading...</span>
                </div>
              )}

              {fortune && !isRevealing && (
                <div className="bg-white/5 rounded-2xl p-5 max-w-sm border border-mardo-purple/20">
                  <p className="text-white italic mb-4">"{fortune}"</p>
                  <Button
                    onClick={resetFortune}
                    variant="ghost"
                    size="sm"
                    className="text-mardo-purple hover:text-white hover:bg-mardo-purple/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    {t('fortune.newReading')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
