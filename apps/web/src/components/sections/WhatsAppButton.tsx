'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905555550123';

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <div className="relative">
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white rounded-lg text-mardo-dark text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          {t('whatsapp.tooltip')}
        </span>
        
        {/* Button */}
        <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        
        {/* Ping animation */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-mardo-orange rounded-full animate-ping" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-mardo-orange rounded-full" />
      </div>
    </a>
  );
}
