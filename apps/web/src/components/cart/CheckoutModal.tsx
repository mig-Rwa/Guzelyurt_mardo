'use client';

import { useState } from 'react';
import {
  X,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateOrderNumber } from '@/lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { language, t } = useLanguage();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          orderType,
          paymentMethod,
          customer: formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderNumber(data.orderNumber || generateOrderNumber());
        setOrderComplete(true);
        clearCart();
      }
    } catch (error) {
      console.error('Order error:', error);
      // Fallback for demo
      setOrderNumber(generateOrderNumber());
      setOrderComplete(true);
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  const generateWhatsAppOrder = () => {
    let message = `🧳 *${language === 'en' ? 'New Order' : 'Yeni Sipariş'}* - ${orderNumber}\n\n`;
    message += `👤 ${formData.name}\n📞 ${formData.phone}\n`;
    if (orderType === 'delivery') {
      message += `📍 ${formData.address}\n`;
    }
    message += `\n*${language === 'en' ? 'Items' : 'Ürünler'}:*\n`;
    cartItems.forEach((item) => {
      message += `• ${item.name[language]} x${item.quantity}\n`;
    });
    message += `\n💰 *${language === 'en' ? 'Total' : 'Toplam'}:* ₺${cartTotal.toFixed(2)}`;
    if (formData.notes) {
      message += `\n\n📝 ${formData.notes}`;
    }
    return encodeURIComponent(message);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setOrderComplete(false);
      setFormData({ name: '', phone: '', address: '', notes: '' });
    }, 300);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-3xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {step > 1 && !orderComplete && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-mardo-dark" />
            </button>
          )}
          <h2 className="text-xl font-bold text-mardo-dark flex-1 text-center">
            {orderComplete ? t('checkout.orderSuccess') : t('checkout.title')}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-mardo-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderComplete ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-mardo-gray mb-2">
                {t('checkout.orderNumber')}
              </p>
              <p className="text-2xl font-bold text-mardo-dark mb-6">
                {orderNumber}
              </p>
              <p className="text-mardo-gray mb-2">
                {t('checkout.estimatedTime')}
              </p>
              <p className="text-xl font-semibold text-mardo-dark">
                {orderType === 'delivery' ? '30-45' : '15-20'}{' '}
                {t('checkout.minutes')}
              </p>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905555550123'}?text=${generateWhatsAppOrder()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#25D366]/90 transition-colors"
              >
                {t('checkout.whatsappConfirm')}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Order Type */}
              {step === 1 && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('delivery');
                      setStep(2);
                    }}
                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      orderType === 'delivery'
                        ? 'border-mardo-brown bg-mardo-brown/5'
                        : 'border-gray-200 hover:border-mardo-brown/50'
                    }`}
                  >
                    <div className="w-14 h-14 bg-mardo-yellow rounded-full flex items-center justify-center">
                      <Truck className="w-7 h-7 text-mardo-dark" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-mardo-dark text-lg">
                        {t('checkout.delivery')}
                      </h3>
                      <p className="text-mardo-gray text-sm">
                        30-45 {t('checkout.minutes')}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('pickup');
                      setStep(2);
                    }}
                    className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      orderType === 'pickup'
                        ? 'border-mardo-brown bg-mardo-brown/5'
                        : 'border-gray-200 hover:border-mardo-brown/50'
                    }`}
                  >
                    <div className="w-14 h-14 bg-mardo-cyan rounded-full flex items-center justify-center">
                      <Store className="w-7 h-7 text-mardo-dark" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-mardo-dark text-lg">
                        {t('checkout.pickup')}
                      </h3>
                      <p className="text-mardo-gray text-sm">
                        15-20 {t('checkout.minutes')}
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-mardo-dark">
                    {t('checkout.details')}
                  </h3>

                  <div>
                    <label className="block text-sm text-mardo-gray mb-1.5">
                      {t('checkout.name')}
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-mardo-gray mb-1.5">
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

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-sm text-mardo-gray mb-1.5">
                        {t('checkout.address')}
                      </label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        required
                        rows={2}
                        className="rounded-xl resize-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-mardo-gray mb-1.5">
                      {t('checkout.notes')}
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={2}
                      className="rounded-xl resize-none"
                      placeholder={t('checkout.notesPlaceholder')}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={
                      !formData.name ||
                      !formData.phone ||
                      (orderType === 'delivery' && !formData.address)
                    }
                    variant="secondary"
                    className="w-full h-12 rounded-xl font-semibold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-mardo-dark">
                    {t('checkout.payment')}
                  </h3>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        paymentMethod === 'cod'
                          ? 'border-mardo-brown bg-mardo-brown/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <Banknote className="w-6 h-6 text-mardo-brown" />
                      <span className="font-medium text-mardo-dark">
                        {t('checkout.cod')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        paymentMethod === 'card'
                          ? 'border-mardo-brown bg-mardo-brown/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 text-mardo-brown" />
                      <span className="font-medium text-mardo-dark">
                        {t('checkout.card')}
                      </span>
                      <span className="text-xs text-mardo-gray ml-auto">
                        Coming soon
                      </span>
                    </button>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mt-6">
                    <div className="space-y-2 mb-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-mardo-gray">
                            {item.name[language]} x{item.quantity}
                          </span>
                          <span className="text-mardo-dark">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-semibold text-mardo-dark">
                        {t('cart.total')}
                      </span>
                      <span className="font-bold text-mardo-yellow text-xl">
                        ₺{cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-14 rounded-xl font-bold text-lg"
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-mardo-dark/30 border-t-mardo-dark rounded-full animate-spin" />
                    ) : (
                      t('checkout.placeOrder')
                    )}
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
