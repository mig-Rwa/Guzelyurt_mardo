'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { language, t } = useLanguage();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-mardo-dark z-50 shadow-2xl transform transition-transform duration-500 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-mardo-yellow" />
            <h2 className="text-xl font-bold text-white">{t('cart.title')}</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-white/60 text-lg">{t('cart.empty')}</p>
              <Button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 rounded-full px-6"
              >
                {t('cart.continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name[language]}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {item.name[language]}
                    </h3>
                    <p className="text-mardo-yellow font-bold mt-1">
                      ₺{item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 h-fit hover:bg-red-500/20 rounded-full transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-white/60 group-hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-lg">{t('cart.total')}</span>
              <span className="text-2xl font-bold text-mardo-yellow">
                ₺{cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-mardo-yellow/25"
            >
              {t('cart.checkout')}
            </Button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-center text-white/60 hover:text-red-400 text-sm transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
