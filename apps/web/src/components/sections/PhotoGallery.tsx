'use client';

import { useState, useEffect } from 'react';
import { Camera, Heart, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

interface Photo {
  id: string;
  customerName: string;
  imageUrl: string;
  caption?: string;
  uploadedAt: string;
  likes: number;
  isFeatured: boolean;
}

export default function PhotoGallery() {
  const { language } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [featuredPhoto, setFeaturedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      // Fetch approved photos
      const response = await fetch('/api/photos?status=approved');
      const data = await response.json();
      
      if (data.success) {
        const allPhotos = data.data || [];
        setPhotos(allPhotos.slice(0, 6)); // Show top 6 recent photos
        
        // Find featured photo
        const featured = allPhotos.find((p: Photo) => p.isFeatured);
        setFeaturedPhoto(featured || null);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-mardo-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-mardo-yellow/30 border-t-mardo-yellow rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if no photos
  if (photos.length === 0) return null;

  return (
    <section id="photo-gallery" className="py-20 md:py-28 bg-gradient-to-b from-white to-mardo-beige/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-mardo-yellow/20 px-4 py-2 rounded-full mb-4">
            <Camera className="w-5 h-5 text-mardo-brown" />
            <span className="text-mardo-brown font-medium">
              {language === 'en' ? 'Customer Photos' : 'Müşteri Fotoğrafları'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mardo-dark mb-4 font-serif">
            {language === 'en' ? 'Picture of the Day' : 'Günün Fotoğrafı'}
          </h2>
          <p className="text-mardo-gray text-lg max-w-2xl mx-auto">
            {language === 'en'
              ? 'Share your Mardo Café moments and get featured!'
              : 'Mardo Café anılarınızı paylaşın ve öne çıkın!'}
          </p>
        </div>

        {/* Featured Photo */}
        {featuredPhoto && (
          <div className="mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
              <div className="absolute top-4 left-4 z-10 bg-mardo-yellow px-4 py-2 rounded-full font-bold text-mardo-dark flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {language === 'en' ? 'Featured' : 'Öne Çıkan'}
              </div>
              
              <Image
                src={featuredPhoto.imageUrl}
                alt={`Photo by ${featuredPhoto.customerName}`}
                width={1200}
                height={800}
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8 text-white">
                <p className="font-bold text-xl md:text-2xl mb-2">
                  {featuredPhoto.customerName}
                </p>
                {featuredPhoto.caption && (
                  <p className="text-white/90 mb-3 italic">
                    "{featuredPhoto.caption}"
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPhoto.uploadedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current" />
                    {featuredPhoto.likes}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Photos Grid */}
        {photos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-mardo-dark mb-6 text-center">
              {language === 'en' ? 'Recent Photos' : 'Son Fotoğraflar'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Image
                    src={photo.imageUrl}
                    alt={`Photo by ${photo.customerName}`}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-semibold mb-1">{photo.customerName}</p>
                      {photo.caption && (
                        <p className="text-sm text-white/90 line-clamp-2 italic">
                          "{photo.caption}"
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(photo.uploadedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {photo.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-mardo-gray mb-4">
            {language === 'en'
              ? 'Order now and share your Mardo moment to get featured!'
              : 'Şimdi sipariş verin ve Mardo anınızı paylaşarak öne çıkın!'}
          </p>
          <a
            href="#menu"
            className="inline-block px-8 py-3 bg-mardo-yellow text-mardo-dark font-bold rounded-full hover:bg-mardo-beige transition-colors"
          >
            {language === 'en' ? 'Order Now' : 'Sipariş Ver'}
          </a>
        </div>
      </div>
    </section>
  );
}
