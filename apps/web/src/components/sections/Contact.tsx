'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  const contactInfo = [
    { icon: MapPin, label: t('contact.address') },
    { icon: Phone, label: t('contact.phone') },
    { icon: Mail, label: t('contact.email') },
    { icon: Clock, label: t('contact.hours') },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 bg-mardo-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif">
            {t('contact.title')}
          </h2>
          <p className="text-mardo-beige text-lg">{t('contact.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
              >
                <div className="w-12 h-12 bg-mardo-yellow rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-mardo-dark" />
                </div>
                <span className="text-white text-lg">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="bg-white/5 rounded-2xl overflow-hidden h-[300px] md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.5697838861183!2d32.99138777498777!3d35.19227387274902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ddfeac04294aed%3A0xd10594d28abb1c19!2sMardo%20Terminal!5e0!3m2!1sen!2s!4v1769812324269!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
