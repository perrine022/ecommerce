/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de confirmation de commande après paiement réussi
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      clearCart();
    } else {
      router.push('/');
    }
  }, [orderId, clearCart, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg border-2 border-gray-100 p-8 text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-6" style={{ color: '#A0A12F' }} />
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#172867' }}>
              Commande confirmée !
            </h1>
            <p className="text-lg mb-2" style={{ color: '#172867', opacity: 0.7 }}>
              Merci pour votre achat.
            </p>
            <p className="text-sm mb-8" style={{ color: '#172867', opacity: 0.6 }}>
              Un email de confirmation a été envoyé à votre adresse.
            </p>

            <div className="space-y-4">
              <Link
                href={`/compte/commande/${orderId}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#172867' }}
              >
                <Package className="w-5 h-5" />
                Voir ma commande
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#A0A12F' }}
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#A0A12F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

