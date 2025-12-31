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
import { addressApi, shippingApi, orderApi, cartApi } from '@/services/api';
import { Address, CreateAddressData, CompanyAddress, CreateCompanyAddressData } from '@/types/address';
import { ShippingMethod } from '@/types/shipping';
import { ArrowLeft, Plus, MapPin, Truck, X } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(1); // 1: Adresses, 2: Livraison, 3: Paiement
  const [addresses, setAddresses] = useState<CompanyAddress[]>([]);
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
      if (!user?.companyId) {
        console.error('No companyId found for user');
        return;
      }
      const response = await addressApi.getCompanyAddresses(user.companyId);
      setAddresses(response.data || []);
      // Sélectionner la première adresse de facturation et de livraison par défaut
      const firstBilling = response.data?.find(a => a.is_invoicing_address);
      const firstShipping = response.data?.find(a => a.is_delivery_address);
      if (firstBilling) setBillingAddressId(firstBilling.id);
      if (firstShipping) setShippingAddressId(firstShipping.id);
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

  // Convertir le format d'adresse du formulaire vers le format entreprise
  // Tous les champs texte optionnels sont initialisés à "" comme requis par Sellsy
  const convertToCompanyAddress = (formData: CreateAddressData, type: 'billing' | 'shipping'): CreateCompanyAddressData => {
    return {
      name: `${formData.firstName} ${formData.lastName}${formData.company ? ` - ${formData.company}` : ''}`,
      address_line_1: formData.addressLine1,
      address_line_2: formData.addressLine2 || "", // Initialisé à "" si non fourni
      address_line_3: "", // Toujours initialisé à "" (non utilisé dans le formulaire actuel)
      address_line_4: "", // Toujours initialisé à "" (non utilisé dans le formulaire actuel)
      postal_code: formData.postalCode,
      city: formData.city,
      country_code: formData.country === 'France' ? 'FR' : formData.country.substring(0, 2).toUpperCase(),
      is_invoicing_address: type === 'billing',
      is_delivery_address: type === 'shipping',
      // geocode est optionnel et n'est pas inclus si non fourni
    };
  };

  const handleSaveAddress = async () => {
    if (!user?.companyId) {
      alert('Erreur : Aucune entreprise associée à votre compte');
      return;
    }

    setSavingAddress(true);
    try {
      const companyAddressData = convertToCompanyAddress(addressFormData, addressFormType);
      const newAddress = await addressApi.createCompanyAddress(user.companyId, companyAddressData);
      await loadAddresses(); // Recharger les adresses
      
      // Sélectionner automatiquement la nouvelle adresse
      const addressId = newAddress.address?.id || newAddress.id;
      if (addressFormType === 'billing') {
        setBillingAddressId(addressId);
      } else {
        setShippingAddressId(addressId);
        await handleShippingAddressChange(addressId);
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
      // Étape 1: Préparer le panier en ajoutant tous les produits
      // Le backend récupère automatiquement le panier de l'utilisateur connecté
      // On s'assure que le panier backend est à jour en ajoutant tous les produits
      for (const item of items) {
        try {
          await cartApi.addItem(item.product.id, item.quantity);
        } catch (error) {
          console.error(`Failed to add product ${item.product.id} to cart:`, error);
          // Continue même si un produit échoue (peut-être déjà dans le panier)
        }
      }

      // Étape 2: Initialiser le checkout et obtenir le clientSecret et orderId
      const { clientSecret, orderId } = await orderApi.checkout();
      
      // Étape 3: Définir les adresses de facturation et de livraison
      if (!billingAddressId || !shippingAddressId) {
        alert('Veuillez sélectionner une adresse de facturation et une adresse de livraison');
        setLoading(false);
        return;
      }

      // Convertir les IDs en nombres (le backend Sellsy attend des nombres)
      // Les IDs peuvent être des strings ou des nombres selon la réponse de l'API
      const invoicingAddressId = typeof billingAddressId === 'string' 
        ? (isNaN(Number(billingAddressId)) ? billingAddressId : Number(billingAddressId))
        : billingAddressId;
      const deliveryAddressId = typeof shippingAddressId === 'string'
        ? (isNaN(Number(shippingAddressId)) ? shippingAddressId : Number(shippingAddressId))
        : shippingAddressId;

      await orderApi.setAddresses(orderId, {
        invoicingAddressId: invoicingAddressId as number,
        deliveryAddressId: deliveryAddressId as number,
      });

      // Étape 4: Pour le moment, on redirige vers la page de succès
      // Plus tard, on pourra utiliser le clientSecret avec Stripe Elements
      // Stocker le clientSecret et orderId pour le paiement Stripe si nécessaire
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      const errorMessage = error?.message || error?.data?.message || 'Erreur lors de la création de la commande';
      alert(errorMessage);
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
                        {addresses.filter(a => a.is_invoicing_address).map((address) => (
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
                                {address.name}
                              </p>
                              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                                {address.address_line_1}
                                {address.address_line_2 && <><br />{address.address_line_2}</>}
                                {address.address_line_3 && <><br />{address.address_line_3}</>}
                                {address.address_line_4 && <><br />{address.address_line_4}</>}
                                <br />
                                {address.postal_code} {address.city}
                                <br />
                                {address.country_code}
                              </p>
                            </div>
                          </label>
                        ))}
                        {addresses.filter(a => a.is_invoicing_address).length === 0 && (
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
                        {addresses.filter(a => a.is_delivery_address).map((address) => (
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
                                {address.name}
                              </p>
                              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                                {address.address_line_1}
                                {address.address_line_2 && <><br />{address.address_line_2}</>}
                                {address.address_line_3 && <><br />{address.address_line_3}</>}
                                {address.address_line_4 && <><br />{address.address_line_4}</>}
                                <br />
                                {address.postal_code} {address.city}
                                <br />
                                {address.country_code}
                              </p>
                            </div>
                          </label>
                        ))}
                        {addresses.filter(a => a.is_delivery_address).length === 0 && (
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
                    disabled={false}
                    className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#172867' }}
                  >
                    {step === 1 ? 'Continuer' : 'Passer au paiement'}
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={false}
                    className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#172867' }}
                  >
                    {loading ? 'Création de la commande...' : 'Valider la commande'}
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                    onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                    onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                  style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                  onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                  style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                  onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                  style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                  onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                    onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                    onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                    onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                    onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
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
                  className="flex-1 px-6 py-3 rounded-lg font-medium border transition-all hover:opacity-80"
                  style={{ borderColor: 'rgba(23, 40, 103, 0.3)', color: '#172867' }}
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
