'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isWebGLSupported } from '@/lib/utils';

// Lazy load 3D component
const Newsletter3D = lazy(() => import('@/components/3d/Newsletter3D'));

export default function Newsletter() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(isWebGLSupported());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-mardo-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-mardo-yellow to-mardo-orange rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative coffee bean pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse
                cx="50"
                cy="50"
                rx="40"
                ry="25"
                fill="currentColor"
                className="text-mardo-dark"
              />
            </svg>
          </div>

          <div className="relative z-10 text-center">
            {/* 3D Envelope - replaces static icon on desktop */}
            {use3D ? (
              <div className="hidden md:flex justify-center mb-6">
                <Suspense fallback={<div className="h-[160px] w-[160px] bg-mardo-dark/10 animate-pulse rounded-full" />}>
                  <Newsletter3D subscribed={subscribed} />
                </Suspense>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-14 h-14 bg-mardo-dark rounded-full mb-6">
                <Mail className="w-7 h-7 text-mardo-yellow" />
              </div>
            )}
            
            {/* Static icon for mobile */}
            <div className={use3D ? "md:hidden inline-flex items-center justify-center w-14 h-14 bg-mardo-dark rounded-full mb-6" : "hidden"}>
              <Mail className="w-7 h-7 text-mardo-yellow" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-mardo-dark mb-2 font-serif">
              {t('newsletter.title')}
            </h3>
            <p className="text-mardo-dark/70 mb-8">
              {t('newsletter.subtitle')}
            </p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-mardo-dark font-semibold">
                <div className="w-8 h-8 bg-mardo-dark rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-mardo-yellow" />
                </div>
                {t('newsletter.success')}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  required
                  className="flex-1 h-12 bg-white border-0 rounded-full px-6 text-mardo-dark placeholder:text-mardo-gray"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 bg-mardo-dark hover:bg-mardo-dark/90 text-white font-semibold rounded-full px-8"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('newsletter.subscribe')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
