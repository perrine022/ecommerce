/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de checkout multi-étapes
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { addressApi, shippingApi, orderApi } from '@/services/api';
import { Address, CreateAddressData } from '@/types/address';
import { ShippingMethod } from '@/types/shipping';
import { ArrowLeft, Plus, MapPin, Truck, X } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1); // 1: Adresses, 2: Livraison, 3: Paiement
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [billingAddressId, setBillingAddressId] = useState<string>('');
  const [shippingAddressId, setShippingAddressId] = useState<string>('');
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // État pour le formulaire d'adresse
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormType, setAddressFormType] = useState<'billing' | 'shipping'>('shipping');
  const [addressFormData, setAddressFormData] = useState<CreateAddressData>({
    type: 'shipping',
    firstName: '',
    lastName: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/connexion?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/panier');
      return;
    }

    loadAddresses();
  }, [isAuthenticated, items.length, router]);

  const loadAddresses = async () => {
    try {
      const response = await addressApi.getAll();
      setAddresses(response.addresses);
      const defaultBilling = response.addresses.find(a => a.type === 'billing' && a.isDefault);
      const defaultShipping = response.addresses.find(a => a.type === 'shipping' && a.isDefault);
      if (defaultBilling) setBillingAddressId(defaultBilling.id);
      if (defaultShipping) setShippingAddressId(defaultShipping.id);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleShippingAddressChange = async (addressId: string) => {
    setShippingAddressId(addressId);
    try {
      const address = addresses.find(a => a.id === addressId);
      if (address) {
        const response = await shippingApi.calculate({
          addressId,
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        });
        setShippingMethods(response.methods);
        if (response.methods.length > 0) {
          setSelectedShippingMethod(response.methods[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to calculate shipping:', error);
    }
  };

  const openAddressForm = (type: 'billing' | 'shipping') => {
    setAddressFormType(type);
    setAddressFormData({
      type,
      firstName: '',
      lastName: '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
      isDefault: false,
    });
    setShowAddressForm(true);
  };

  const handleAddressFormChange = (field: keyof CreateAddressData, value: any) => {
    setAddressFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      const newAddress = await addressApi.create(addressFormData);
      await loadAddresses(); // Recharger les adresses
      
      // Sélectionner automatiquement la nouvelle adresse
      if (addressFormType === 'billing') {
        setBillingAddressId(newAddress.address.id);
      } else {
        setShippingAddressId(newAddress.address.id);
        await handleShippingAddressChange(newAddress.address.id);
      }
      
      setShowAddressForm(false);
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Erreur lors de la sauvegarde de l\'adresse');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (billingAddressId && shippingAddressId) {
        handleShippingAddressChange(shippingAddressId);
        setStep(2);
      }
    } else if (step === 2) {
      if (selectedShippingMethod) {
        setStep(3);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Créer la commande et obtenir les informations de paiement
      const { clientSecret, orderId } = await orderApi.checkout();
      
      // TODO: Remplacer par le lien Stripe fourni par l'utilisateur
      // Pour l'instant, on redirige vers une page de paiement Stripe
      const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || 'https://checkout.stripe.com';
      
      // Rediriger vers Stripe avec les paramètres nécessaires
      router.push(`${stripeUrl}?orderId=${orderId}&clientSecret=${encodeURIComponent(clientSecret)}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotal();
  const selectedShipping = shippingMethods.find(m => m.id === selectedShippingMethod);
  const shippingCost = selectedShipping?.cost || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            style={{ color: '#172867' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au panier
          </Link>

          <h1 className="text-3xl font-bold mb-8" style={{ color: '#172867' }}>
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Adresses */}
              {step === 1 && (
                <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#172867' }}>
                    Adresses
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: '#172867' }}>
                        Adresse de facturation
                      </label>
                      <div className="space-y-2">
                        {addresses.filter(a => a.type === 'billing').map((address) => (
                          <label
                            key={address.id}
                            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              billingAddressId === address.id ? 'border-[#172867] bg-[#172867]/5' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="billing"
                              value={address.id}
                              checked={billingAddressId === address.id}
                              onChange={(e) => setBillingAddressId(e.target.value)}
                              className="mt-1"
                              style={{ accentColor: '#172867' }}
                            />
                            <div className="flex-1">
                              <p className="font-medium" style={{ color: '#172867' }}>
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                                {address.addressLine1}
                                {address.addressLine2 && <><br />{address.addressLine2}</>}
                                <br />
                                {address.postalCode} {address.city}
                                <br />
                                {address.country}
                              </p>
                            </div>
                          </label>
                        ))}
                        {addresses.filter(a => a.type === 'billing').length === 0 && (
                          <p className="text-sm text-gray-500 italic">Aucune adresse de facturation</p>
                        )}
                      </div>
                      <button
                        onClick={() => openAddressForm('billing')}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity px-4 py-2 rounded-lg border-2"
                        style={{ color: '#A0A12F', borderColor: '#A0A12F' }}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter une adresse de facturation
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: '#172867' }}>
                        Adresse de livraison
                      </label>
                      <div className="space-y-2">
                        {addresses.filter(a => a.type === 'shipping').map((address) => (
                          <label
                            key={address.id}
                            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              shippingAddressId === address.id ? 'border-[#172867] bg-[#172867]/5' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={address.id}
                              checked={shippingAddressId === address.id}
                              onChange={(e) => handleShippingAddressChange(e.target.value)}
                              className="mt-1"
                              style={{ accentColor: '#172867' }}
                            />
                            <div className="flex-1">
                              <p className="font-medium" style={{ color: '#172867' }}>
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                                {address.addressLine1}
                                {address.addressLine2 && <><br />{address.addressLine2}</>}
                                <br />
                                {address.postalCode} {address.city}
                                <br />
                                {address.country}
                              </p>
                            </div>
                          </label>
                        ))}
                        {addresses.filter(a => a.type === 'shipping').length === 0 && (
                          <p className="text-sm text-gray-500 italic">Aucune adresse de livraison</p>
                        )}
                      </div>
                      <button
                        onClick={() => openAddressForm('shipping')}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity px-4 py-2 rounded-lg border-2"
                        style={{ color: '#A0A12F', borderColor: '#A0A12F' }}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter une adresse de livraison
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Livraison */}
              {step === 2 && (
                <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#172867' }}>
                    Méthode de livraison
                  </h2>
                  
                  <div className="space-y-3">
                    {shippingMethods.length === 0 ? (
                      <p className="text-gray-500">Calcul des options de livraison...</p>
                    ) : (
                      shippingMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedShippingMethod === method.id ? 'border-[#172867] bg-[#172867]/5' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShippingMethod === method.id}
                            onChange={(e) => setSelectedShippingMethod(e.target.value)}
                            className="mt-1"
                            style={{ accentColor: '#172867' }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium" style={{ color: '#172867' }}>
                                  {method.name}
                                </p>
                                <p className="text-sm mt-1" style={{ color: '#172867', opacity: 0.7 }}>
                                  {method.description}
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#172867', opacity: 0.6 }}>
                                  Délai estimé: {method.estimatedDays} jour{method.estimatedDays > 1 ? 's' : ''}
                                </p>
                              </div>
                              <p className="font-bold" style={{ color: '#A0A12F' }}>
                                {method.isFree ? 'Gratuit' : `${method.cost.toFixed(2)} €`}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Récapitulatif */}
              {step === 3 && (
                <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#172867' }}>
                    Récapitulatif
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3" style={{ color: '#172867' }}>
                        Articles
                      </h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.product.id} className="flex justify-between text-sm">
                            <span style={{ color: '#172867', opacity: 0.7 }}>
                              {item.product.title} x {item.quantity}
                            </span>
                            <span style={{ color: '#172867' }}>
                              {(item.product.price * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span style={{ color: '#172867', opacity: 0.7 }}>Sous-total</span>
                        <span style={{ color: '#172867' }}>{subtotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: '#172867', opacity: 0.7 }}>Livraison</span>
                        <span style={{ color: '#172867' }}>
                          {selectedShipping?.isFree ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}
                        </span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-gray-200">
                        <span className="font-bold text-lg" style={{ color: '#172867' }}>Total</span>
                        <span className="font-bold text-xl" style={{ color: '#A0A12F' }}>
                          {total.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-gray-100 p-6 sticky top-24">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: '#172867', opacity: 0.7 }}>Sous-total</span>
                    <span style={{ color: '#172867' }}>{subtotal.toFixed(2)} €</span>
                  </div>
                  {step >= 2 && selectedShipping && (
                    <div className="flex justify-between">
                      <span style={{ color: '#172867', opacity: 0.7 }}>Livraison</span>
                      <span style={{ color: '#172867' }}>
                        {selectedShipping.isFree ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold text-lg" style={{ color: '#172867' }}>Total</span>
                    <span className="font-bold text-xl" style={{ color: '#A0A12F' }}>
                      {step >= 2 ? total.toFixed(2) : subtotal.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!billingAddressId || !shippingAddressId)) ||
                      (step === 2 && !selectedShippingMethod)
                    }
                    className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#172867' }}
                  >
                    {step === 1 ? 'Continuer' : 'Passer au paiement'}
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#172867' }}
                  >
                    {loading ? 'Traitement...' : 'Continuer vers le paiement'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter une adresse */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold" style={{ color: '#172867' }}>
                Nouvelle adresse {addressFormType === 'billing' ? 'de facturation' : 'de livraison'}
              </h3>
              <button
                onClick={() => setShowAddressForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" style={{ color: '#172867' }} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.firstName}
                    onChange={(e) => handleAddressFormChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#A0A12F', color: '#172867' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.lastName}
                    onChange={(e) => handleAddressFormChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#A0A12F', color: '#172867' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Entreprise (optionnel)
                </label>
                <input
                  type="text"
                  value={addressFormData.company || ''}
                  onChange={(e) => handleAddressFormChange('company', e.target.value)}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#A0A12F', color: '#172867' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Adresse ligne 1 *
                </label>
                <input
                  type="text"
                  value={addressFormData.addressLine1}
                  onChange={(e) => handleAddressFormChange('addressLine1', e.target.value)}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#A0A12F', color: '#172867' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Adresse ligne 2 (optionnel)
                </label>
                <input
                  type="text"
                  value={addressFormData.addressLine2 || ''}
                  onChange={(e) => handleAddressFormChange('addressLine2', e.target.value)}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#A0A12F', color: '#172867' }}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.postalCode}
                    onChange={(e) => handleAddressFormChange('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#A0A12F', color: '#172867' }}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.city}
                    onChange={(e) => handleAddressFormChange('city', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#A0A12F', color: '#172867' }}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Pays *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.country}
                    onChange={(e) => handleAddressFormChange('country', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#A0A12F', color: '#172867' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    value={addressFormData.phone || ''}
                    onChange={(e) => handleAddressFormChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#A0A12F', color: '#172867' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressFormData.isDefault || false}
                  onChange={(e) => handleAddressFormChange('isDefault', e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: '#A0A12F' }}
                />
                <label htmlFor="isDefault" className="text-sm" style={{ color: '#172867' }}>
                  Définir comme adresse par défaut
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium border-2 transition-all hover:opacity-80"
                  style={{ borderColor: '#172867', color: '#172867' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveAddress}
                  disabled={savingAddress || !addressFormData.firstName || !addressFormData.lastName || !addressFormData.addressLine1 || !addressFormData.city || !addressFormData.postalCode || !addressFormData.country}
                  className="flex-1 px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#A0A12F' }}
                >
                  {savingAddress ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
