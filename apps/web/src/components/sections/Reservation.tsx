'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAuthHeaders } from '@/lib/client/authHeaders';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Reservation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '2',
    name: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: await getAuthHeaders(user, { json: true }),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Reservation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="py-20 md:py-28 bg-mardo-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-mardo-dark mb-4 font-serif">
            {t('reservation.title')}
          </h2>
          <p className="text-mardo-gray text-lg">{t('reservation.subtitle')}</p>
        </div>

        {/* Reservation Form */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-mardo-dark mb-2">
                {t('reservation.success')}
              </h3>
              <p className="text-mardo-gray">
                {formData.date} at {formData.time} for {formData.guests}{' '}
                {t('reservation.guestLabel')}
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ date: '', time: '', guests: '2', name: '', phone: '' });
                }}
                variant="secondary"
                className="mt-6 rounded-full"
              >
                Make Another Reservation
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-mardo-dark font-medium mb-2">
                    {t('checkout.name')}
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-mardo-dark font-medium mb-2">
                    {t('checkout.phone')}
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="h-12 rounded-xl"
                    placeholder="+90 5XX XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-mardo-dark font-medium mb-2">
                    <Calendar className="w-4 h-4 text-mardo-brown" />
                    {t('reservation.date')}
                  </label>
                  <Input
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                    className="h-12 border-mardo-brown/20 focus:border-mardo-brown rounded-xl"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="flex items-center gap-2 text-mardo-dark font-medium mb-2">
                    <Clock className="w-4 h-4 text-mardo-brown" />
                    {t('reservation.time')}
                  </label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) =>
                      setFormData({ ...formData, time: value })
                    }
                  >
                    <SelectTrigger className="h-12 border-mardo-brown/20 focus:border-mardo-brown rounded-xl">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guests */}
                <div>
                  <label className="flex items-center gap-2 text-mardo-dark font-medium mb-2">
                    <Users className="w-4 h-4 text-mardo-brown" />
                    {t('reservation.guests')}
                  </label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) =>
                      setFormData({ ...formData, guests: value })
                    }
                  >
                    <SelectTrigger className="h-12 border-mardo-brown/20 focus:border-mardo-brown rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {t('reservation.guestLabel')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.date || !formData.time}
                variant="secondary"
                className="w-full h-14 rounded-xl text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t('reservation.book')
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
