'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { galleryImages } from '@shared/data';
import { Gallery3D } from '@/components/3d';
import { isWebGLSupported } from '@/lib/utils';
import { useEffect } from 'react';

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
          <Gallery3D
            images={galleryImages}
            onImageClick={(url) => setSelectedImage(url)}
          />
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
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                    index === 0 ? 'h-64 md:h-full' : 'h-48 md:h-64'
                  }`}
                />
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
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
