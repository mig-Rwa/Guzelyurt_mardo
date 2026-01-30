'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { galleryImages } from '@shared/data';
import { isWebGLSupported } from '@/lib/utils';

// Lazy load 3D gallery to avoid blocking initial render
const Gallery3D = lazy(() => import('@/components/3d/Gallery3D'));

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(isWebGLSupported());
  }, []);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-mardo-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mardo-dark mb-4 font-serif">
            {t('gallery.title')}
          </h2>
          <p className="text-mardo-gray text-lg">{t('gallery.subtitle')}</p>
        </div>

        {/* 3D Gallery or Fallback */}
        {use3D ? (
          <Suspense fallback={<div className="h-[400px] w-full bg-mardo-dark/10 animate-pulse rounded-xl" />}>
            <Gallery3D
              images={galleryImages}
              onImageClick={(url) => setSelectedImage(url)}
            />
          </Suspense>
        ) : (
          /* Fallback 2D Gallery Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`relative ${index === 0 ? 'h-64 md:h-full md:min-h-[400px]' : 'h-48 md:h-64'}`}>
                  <Image
                    src={`${image}?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1`}
                    alt={`Gallery ${index + 1}`}
                    fill
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-mardo-dark/0 group-hover:bg-mardo-dark/40 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-mardo-yellow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <span className="text-mardo-dark text-2xl font-light">+</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-mardo-dark/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 text-white hover:text-mardo-yellow transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`${selectedImage}?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2`}
              alt="Gallery"
              fill
              sizes="100vw"
              className="object-contain rounded-xl"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
