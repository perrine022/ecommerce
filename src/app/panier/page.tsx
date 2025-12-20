'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const cartItems = items;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
          style={{ color: '#172867' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Continuer mes achats
        </Link>

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#172867' }}>
          Mon Panier
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto mb-4" style={{ color: '#172867', opacity: 0.3 }} />
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#172867' }}>
              Votre panier est vide
            </h2>
            <p className="mb-8" style={{ color: '#172867', opacity: 0.7 }}>
              Découvrez nos produits exotiques et remplissez votre panier !
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#172867' }}
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-white border-2 border-gray-100 rounded-lg p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2" style={{ color: '#172867' }}>
                        {item.product.title}
                      </h3>
                      <p className="text-sm mb-4" style={{ color: '#172867', opacity: 0.7 }}>
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" style={{ color: '#172867' }} />
                          </button>
                          <span className="px-4 font-semibold" style={{ color: '#172867' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" style={{ color: '#172867' }} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold" style={{ color: '#A0A12F' }}>
                            {(item.product.price * item.quantity).toFixed(2)} €
                          </span>
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-5 h-5" style={{ color: '#A0A12F' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-100 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6" style={{ color: '#172867' }}>
                  Récapitulatif
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: '#172867', opacity: 0.7 }}>Sous-total</span>
                    <span style={{ color: '#172867' }}>{getTotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#172867', opacity: 0.7 }}>Livraison</span>
                    <span style={{ color: '#172867' }}>{getTotal() >= 50 ? 'Gratuite' : '5.00 €'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold text-lg" style={{ color: '#172867' }}>Total</span>
                    <span className="font-bold text-xl" style={{ color: '#A0A12F' }}>
                      {(getTotal() + (getTotal() >= 50 ? 0 : 5)).toFixed(2)} €
                    </span>
                  </div>
                </div>
                <button
                  className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#172867' }}
                >
                  Passer la commande
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

