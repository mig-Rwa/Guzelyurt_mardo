'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { Coffee, Gift } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { loyaltyConfig } from '@shared';
import { Button } from '@/components/ui/button';
import { isWebGLSupported } from '@/lib/utils';

// Lazy load 3D component
const Loyalty3D = lazy(() => import('@/components/3d/Loyalty3D'));

export default function LoyaltyProgram() {
  const { language, t } = useLanguage();
  const [stamps, setStamps] = useState(3); // Demo: user has 3 stamps
  const [joined, setJoined] = useState(false);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(isWebGLSupported());
  }, []);

  const remainingStamps = loyaltyConfig.stampsRequired - stamps;

  return (
    <section className="py-16 bg-mardo-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-mardo-brown to-mardo-dark rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-mardo-yellow/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-mardo-yellow/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left side - Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-mardo-yellow rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-mardo-dark" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-serif">
                      {t('loyalty.title')}
                    </h3>
                    <p className="text-white/70 text-sm">{t('loyalty.subtitle')}</p>
                  </div>
                </div>

                {joined && (
                  <p className="text-white/80 mt-4">
                    <span className="text-mardo-yellow font-bold">
                      {remainingStamps}
                    </span>{' '}
                    {t('loyalty.stamps')} {t('loyalty.reward')}{' '}
                    <span className="text-mardo-yellow">
                      {loyaltyConfig.reward[language]}
                    </span>
                  </p>
                )}
              </div>

              {/* Right side - Stamps or Join */}
              {joined ? (
                use3D ? (
                  <div className="hidden md:block">
                    <Suspense fallback={<div className="h-[180px] w-[350px] bg-mardo-dark/20 animate-pulse rounded-xl" />}>
                      <Loyalty3D stamps={stamps} totalStamps={loyaltyConfig.stampsRequired} />
                    </Suspense>
                  </div>
                ) : null
              ) : null}
              
              {joined ? (
                <div className={use3D ? "flex md:hidden items-center gap-2" : "flex items-center gap-2"}>
                  {[...Array(loyaltyConfig.stampsRequired)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        i < stamps
                          ? 'bg-mardo-yellow text-mardo-dark'
                          : 'bg-white/10 border-2 border-dashed border-white/30'
                      }`}
                    >
                      {i < stamps ? (
                        <Coffee className="w-6 h-6" />
                      ) : (
                        <span className="text-white/30 text-lg font-bold">
                          {i + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Button
                  onClick={() => setJoined(true)}
                  className="px-8 py-4 rounded-full text-lg font-bold"
                >
                  {t('loyalty.join')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
