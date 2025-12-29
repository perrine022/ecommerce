/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de paiement Stripe avec intégration Stripe Elements
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { paymentApi } from '@/services/api';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    const secret = searchParams.get('clientSecret');
    const order = searchParams.get('orderId');
    const intent = searchParams.get('paymentIntentId');

    if (!secret || !order || !intent) {
      router.push('/panier');
      return;
    }

    setClientSecret(secret);
    setOrderId(order);
    setPaymentIntentId(intent);
  }, [searchParams, router]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#172867' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'stripe',
    },
  };

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#172867' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8" style={{ color: '#172867' }}>
            Paiement
          </h1>
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm orderId={orderId!} paymentIntentId={paymentIntentId!} clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#172867' }}>Chargement...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentForm({ orderId, paymentIntentId, clientSecret }: { orderId: string; paymentIntentId: string; clientSecret: string }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Erreur de chargement du formulaire de paiement');
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Erreur lors du paiement');
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirmer le paiement côté backend
        try {
          await paymentApi.confirmPayment(paymentIntentId);
        } catch (error) {
          console.error('Failed to confirm payment:', error);
        }
        router.push(`/checkout/success?orderId=${orderId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-gray-100 p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#172867' }}>
          Informations de carte
        </label>
        <div className="p-4 border-2 rounded-lg" style={{ borderColor: '#172867' }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#172867',
                  '::placeholder': {
                    color: '#a0aec0',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#172867' }}
      >
        {loading ? 'Traitement...' : 'Payer'}
      </button>
    </form>
  );
}

