/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de détail d'une commande
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { orderApi } from '@/services/api';
import { Order } from '@/types/order';
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderApi.getById(id);
      setOrder(response.order);
    } catch (error) {
      console.error('Failed to load order:', error);
      router.push('/compte');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      processing: '#8B5CF6',
      shipped: '#10B981',
      delivered: '#059669',
      cancelled: '#EF4444',
      refunded: '#6B7280',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      refunded: 'Remboursée',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#172867' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg mb-4" style={{ color: '#172867' }}>Commande non trouvée</p>
            <Link href="/compte" className="text-sm" style={{ color: '#A0A12F' }}>
              Retour à mon compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/compte"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            style={{ color: '#172867' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à mes commandes
          </Link>

          <div className="bg-white rounded-lg border-2 border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: '#172867' }}>
                  Commande #{order.orderNumber}
                </h1>
                <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                  Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span
                className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            {order.trackingNumber && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5" style={{ color: '#A0A12F' }} />
                  <span className="font-semibold" style={{ color: '#172867' }}>Numéro de suivi</span>
                </div>
                <p className="font-mono text-sm" style={{ color: '#172867' }}>{order.trackingNumber}</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Adresse de livraison */}
            <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5" style={{ color: '#A0A12F' }} />
                <h2 className="font-semibold" style={{ color: '#172867' }}>Adresse de livraison</h2>
              </div>
              <div className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>

            {/* Adresse de facturation */}
            <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" style={{ color: '#A0A12F' }} />
                <h2 className="font-semibold" style={{ color: '#172867' }}>Adresse de facturation</h2>
              </div>
              <div className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                <p className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                {order.billingAddress.company && <p>{order.billingAddress.company}</p>}
                <p>{order.billingAddress.addressLine1}</p>
                {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                <p>{order.billingAddress.postalCode} {order.billingAddress.city}</p>
                <p>{order.billingAddress.country}</p>
                {order.billingAddress.phone && <p>{order.billingAddress.phone}</p>}
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="bg-white rounded-lg border-2 border-gray-100 p-6 mb-6">
            <h2 className="font-semibold mb-4" style={{ color: '#172867' }}>Articles commandés</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  {item.productImage && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>
                      {item.productName}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: '#172867', opacity: 0.7 }}>
                      Quantité: {item.quantity}
                    </p>
                    <p className="font-semibold" style={{ color: '#A0A12F' }}>
                      {item.totalPrice.toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
            <h2 className="font-semibold mb-4" style={{ color: '#172867' }}>Récapitulatif</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#172867', opacity: 0.7 }}>Sous-total</span>
                <span style={{ color: '#172867' }}>{order.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#172867', opacity: 0.7 }}>Livraison</span>
                <span style={{ color: '#172867' }}>
                  {order.shippingCost === 0 ? 'Gratuite' : `${order.shippingCost.toFixed(2)} €`}
                </span>
              </div>
              {order.tax && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#172867', opacity: 0.7 }}>TVA</span>
                  <span style={{ color: '#172867' }}>{order.tax.toFixed(2)} €</span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <span className="font-bold text-lg" style={{ color: '#172867' }}>Total</span>
              <span className="font-bold text-xl" style={{ color: '#A0A12F' }}>
                {order.total.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

