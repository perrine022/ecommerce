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
import { addressApi, shippingApi, orderApi, cartApi, userApi, paymentApi } from '@/services/api';
import { Address, CreateAddressData, CompanyAddress, CreateCompanyAddressData } from '@/types/address';
import { ShippingMethod } from '@/types/shipping';
import { ArrowLeft, Plus, MapPin, Truck, X, Users, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Client } from '@/types/user';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCart();
  const { isAuthenticated, user, refreshUser, updateUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Adresses, 2: Livraison, 3: Récapitulatif, 4: Paiement
  const [addresses, setAddresses] = useState<CompanyAddress[]>([]);
  const [billingAddressId, setBillingAddressId] = useState<string>('');
  const [shippingAddressId, setShippingAddressId] = useState<string>('');
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentSheetData, setPaymentSheetData] = useState<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
    publishableKey: string;
  } | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // État pour les commerciaux
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientAddresses, setClientAddresses] = useState<CompanyAddress[]>([]);
  
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

  // Vérifier si l'utilisateur est commercial
  const userRoles = Array.isArray(user?.role) ? user.role : user?.role ? [user.role] : [];
  const isCommercial = userRoles.includes('ROLE_COMMERCIAL') || userRoles.includes('ROLE_ADMIN');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/connexion?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      router.push('/panier');
      return;
    }

    if (isCommercial) {
      loadClients();
      // Vérifier si un client a été sélectionné depuis le dashboard
      const storedClientId = localStorage.getItem('selectedClientId');
      if (storedClientId) {
        setSelectedClientId(storedClientId);
        localStorage.removeItem('selectedClientId');
      }
    } else {
      loadAddresses();
    }
  }, [isAuthenticated, items.length, router, user, isCommercial]);

  useEffect(() => {
    if (isCommercial && selectedClientId) {
      loadClientAddresses(selectedClientId);
    }
  }, [selectedClientId, isCommercial]);

  const loadAddresses = async () => {
    try {
      // Rafraîchir l'utilisateur pour s'assurer d'avoir l'ID à jour
      let currentUser = user;
      if (!currentUser?.id) {
        await refreshUser();
        await new Promise(resolve => setTimeout(resolve, 200));
        currentUser = user;
      }
      
      if (!currentUser?.id) {
        console.error('No user ID found');
        return;
      }
      
      // Utiliser le nouvel endpoint basé sur userId
      const addressesList = await addressApi.getUserAddresses();
      // Gérer différents formats de réponse
      const addressesArray = Array.isArray(addressesList) 
        ? addressesList 
        : (addressesList as any)?.data || [];
      setAddresses(addressesArray);
      // Sélectionner la première adresse de facturation et de livraison par défaut
      const firstBilling = addressesArray.find((a: CompanyAddress) => a.is_invoicing_address);
      const firstShipping = addressesArray.find((a: CompanyAddress) => a.is_delivery_address);
      if (firstBilling) setBillingAddressId(firstBilling.id);
      if (firstShipping) setShippingAddressId(firstShipping.id);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const loadClients = async () => {
    try {
      // L'API retourne directement un tableau de clients
      const clientsList = await userApi.getCommercialClients();
      setClients(Array.isArray(clientsList) ? clientsList : []);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const loadClientAddresses = async (clientId: string) => {
    try {
      const addressesList = await addressApi.getUserAddresses(clientId);
      // Gérer différents formats de réponse
      const addressesArray = Array.isArray(addressesList) 
        ? addressesList 
        : (addressesList as any)?.data || [];
      setClientAddresses(addressesArray);
      // Sélectionner la première adresse de facturation et de livraison par défaut
      const firstBilling = addressesArray.find((a: CompanyAddress) => a.is_invoicing_address);
      const firstShipping = addressesArray.find((a: CompanyAddress) => a.is_delivery_address);
      if (firstBilling) setBillingAddressId(firstBilling.id);
      if (firstShipping) setShippingAddressId(firstShipping.id);
    } catch (error) {
      console.error('Failed to load client addresses:', error);
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
    console.log('🚀 [CHECKOUT] handleSaveAddress called');
    console.log('🚀 [CHECKOUT] Form data:', addressFormData);
    console.log('🚀 [CHECKOUT] Address type:', addressFormType);
    
    setSavingAddress(true);
    try {
      // Récupérer l'ID utilisateur - essayer d'abord depuis le contexte, sinon depuis l'API
      let userId = user?.id;
      console.log('🔍 [CHECKOUT] Initial userId from user:', userId);
      
      if (!userId) {
        console.log('🔄 [CHECKOUT] Refreshing user...');
        // Rafraîchir l'utilisateur depuis le contexte
        await refreshUser();
        // Attendre un court instant pour que le state se mette à jour
        await new Promise(resolve => setTimeout(resolve, 300));
        // Re-récupérer l'utilisateur depuis le contexte après refresh
        userId = user?.id;
        console.log('🔍 [CHECKOUT] UserId after refresh:', userId);
      }
      
      if (!userId) {
        console.log('🔄 [CHECKOUT] Fetching user directly from API...');
        // Si toujours pas d'userId, récupérer directement depuis l'API
        try {
          const { authApi } = await import('@/services/api');
          const userResponse = await authApi.getCurrentUser();
          const freshUser = userResponse.user || userResponse;
          
          userId = freshUser?.id || freshUser?.userId;
          
          console.log('🔍 [CHECKOUT] User data from API:', freshUser);
          console.log('🔍 [CHECKOUT] UserId found:', userId);
          console.log('🔍 [CHECKOUT] Available user fields:', Object.keys(freshUser || {}));
          
          // Mettre à jour l'utilisateur dans le contexte avec les données fraîches
          if (freshUser && !user?.id && userId && user) {
            updateUser({ ...user, id: userId });
          }
          
          if (!userId) {
            console.error('❌ [CHECKOUT] No userId found in user data:', freshUser);
            alert('Erreur : Impossible de récupérer votre identifiant utilisateur. Veuillez vous déconnecter et vous reconnecter, ou contacter le support.');
            setSavingAddress(false);
            return;
          }
        } catch (error) {
          console.error('❌ [CHECKOUT] Failed to get user:', error);
          alert('Erreur : Impossible de récupérer les informations de votre compte. Veuillez réessayer.');
          setSavingAddress(false);
          return;
        }
      }

      // Créer l'adresse avec le userId récupéré
      console.log('📝 [CHECKOUT] Converting address data...');
      const companyAddressData = convertToCompanyAddress(addressFormData, addressFormType);
      console.log('📝 [CHECKOUT] Address data:', companyAddressData);
      console.log('📝 [CHECKOUT] Calling API with userId:', userId);
      
      // Utiliser le nouvel endpoint basé sur userId
      const newAddress = await addressApi.createUserAddress(companyAddressData);
      console.log('✅ [CHECKOUT] Address created successfully:', newAddress);
      
      await loadAddresses(); // Recharger les adresses
      
      // Sélectionner automatiquement la nouvelle adresse
      const addressId = newAddress.address?.id || newAddress.id || newAddress.data?.id;
      console.log('📍 [CHECKOUT] New address ID:', addressId);
      
      if (addressFormType === 'billing') {
        setBillingAddressId(addressId);
      } else {
        setShippingAddressId(addressId);
        await handleShippingAddressChange(addressId);
      }
      
      setShowAddressForm(false);
      console.log('✅ [CHECKOUT] Address saved and form closed');
    } catch (error: any) {
      console.error('❌ [CHECKOUT] Failed to save address:', error);
      console.error('❌ [CHECKOUT] Error details:', {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        stack: error?.stack
      });
      const errorMessage = error?.message || error?.data?.message || 'Erreur lors de la sauvegarde de l\'adresse';
      alert(`Erreur : ${errorMessage}`);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (isCommercial) {
        // Pour les commerciaux, vérifier qu'un client est sélectionné
        if (!selectedClientId) {
          alert('Veuillez sélectionner un client');
          return;
        }
      }
      // À l'étape 1, si les adresses sont sélectionnées, créer la commande
      if (billingAddressId && shippingAddressId) {
        handleCreateOrder();
      } else {
        alert('Veuillez sélectionner une adresse de facturation et une adresse de livraison');
      }
    } else if (step === 2) {
      if (selectedShippingMethod) {
        setStep(3);
      }
    }
  };

  // Fonction pour créer la commande (sans paiement)
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      // Étape 1: Vérifier que le panier n'est pas vide
      if (items.length === 0) {
        alert('Votre panier est vide');
        setLoading(false);
        return;
      }

      // Étape 2: Vérifier que les adresses sont sélectionnées
      if (!billingAddressId || !shippingAddressId) {
        alert('Veuillez sélectionner une adresse de facturation et une adresse de livraison');
        setLoading(false);
        return;
      }

      // Étape 3: Convertir les IDs d'adresses en nombres (Long pour Sellsy)
      const invoicingAddressId = typeof billingAddressId === 'string' 
        ? Number(billingAddressId)
        : billingAddressId;
      const deliveryAddressId = typeof shippingAddressId === 'string'
        ? Number(shippingAddressId)
        : shippingAddressId;

      // Vérifier que les IDs sont valides
      if (isNaN(invoicingAddressId) || isNaN(deliveryAddressId)) {
        alert('Erreur : Les identifiants d\'adresse ne sont pas valides');
        setLoading(false);
        return;
      }

      // Étape 4: Préparer les items pour la payload
      // Format attendu : [{ productId: "uuid", quantity: number }]
      const orderItems = items.map(item => ({
        productId: item.product.id, // UUID du produit
        quantity: item.quantity, // Integer
      }));

      // Étape 5: Construire la payload selon les spécifications
      const orderData: {
        invoicingAddressId: number;
        deliveryAddressId: number;
        items: Array<{ productId: string; quantity: number }>;
        clientId?: string;
      } = {
        invoicingAddressId: invoicingAddressId as number,
        deliveryAddressId: deliveryAddressId as number,
        items: orderItems,
      };
      
      // Pour les commerciaux, ajouter le clientId (UUID)
      if (isCommercial && selectedClientId) {
        orderData.clientId = selectedClientId;
      }
      
      // Étape 6: Créer la commande
      const order = await orderApi.createOrder(orderData);
      setCreatedOrderId(order.id);
      setOrderCreated(true);
      
      // Passer à l'étape 3 (récapitulatif) après création de la commande
      setStep(3);
    } catch (error: any) {
      console.error('Failed to create order:', error);
      const errorMessage = error?.message || error?.data?.message || 'Erreur lors de la création de la commande';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour initier le paiement Stripe
  const handlePayWithStripe = async () => {
    if (!createdOrderId) {
      alert('Veuillez d\'abord créer la commande');
      return;
    }

    setLoading(true);
    try {
      // Calculer le montant total en centimes pour Stripe
      const amountInCents = Math.round(total * 100);
      
      // Créer le Payment Sheet Stripe
      const paymentSheet = await paymentApi.createPaymentSheet({
        amount: amountInCents,
        currency: 'eur',
        description: `Commande TradeFood #${createdOrderId.substring(0, 8)}`,
        userId: user?.id,
      });
      
      setPaymentSheetData(paymentSheet);
      setShowPaymentForm(true);
      setStep(4); // Passer à l'étape de paiement
    } catch (error: any) {
      console.error('Failed to create payment sheet:', error);
      alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
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
              {/* Step 1: Adresses ou Clients (pour commerciaux) */}
              {step === 1 && (
                <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#172867' }}>
                    {isCommercial ? 'Sélectionner un client' : 'Adresses'}
                  </h2>
                  
                  {isCommercial ? (
                    <div className="space-y-6">
                      {!selectedClientId ? (
                        <div>
                          <p className="text-sm mb-4" style={{ color: '#172867', opacity: 0.7 }}>
                            Sélectionnez le client pour lequel vous passez cette commande
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clients.map((client) => (
                              <div
                                key={client.id}
                                onClick={() => setSelectedClientId(client.id)}
                                className="border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                                style={{ 
                                  borderColor: selectedClientId === client.id ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                                  backgroundColor: selectedClientId === client.id ? 'rgba(160, 161, 47, 0.05)' : 'white'
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
                                    <Users className="w-5 h-5" style={{ color: '#A0A12F' }} />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1" style={{ color: '#172867' }}>
                                      {client.companyName || `${client.firstName} ${client.lastName}`}
                                    </h3>
                                    <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                                      {client.email}
                                    </p>
                                    {client.phone && (
                                      <p className="text-sm mt-1" style={{ color: '#172867', opacity: 0.6 }}>
                                        {client.phone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Afficher les adresses du client sélectionné */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold" style={{ color: '#172867' }}>
                                Client sélectionné : {clients.find(c => c.id === selectedClientId)?.companyName || clients.find(c => c.id === selectedClientId)?.firstName}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedClientId('');
                                setClientAddresses([]);
                                setBillingAddressId('');
                                setShippingAddressId('');
                              }}
                              className="text-sm font-medium hover:opacity-80 transition-opacity"
                              style={{ color: '#A0A12F' }}
                            >
                              Changer de client
                            </button>
                          </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: '#172867' }}>
                        Adresse de facturation
                      </label>
                      <div className="space-y-2">
                        {(isCommercial ? clientAddresses : addresses).filter(a => a.is_invoicing_address).map((address) => (
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
                        {(isCommercial ? clientAddresses : addresses).filter(a => a.is_invoicing_address).length === 0 && (
                          <p className="text-sm text-gray-500 italic">Aucune adresse de facturation</p>
                        )}
                      </div>
                      {!isCommercial && (
                        <button
                          onClick={() => openAddressForm('billing')}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity px-4 py-2 rounded-lg border-2"
                          style={{ color: '#A0A12F', borderColor: '#A0A12F' }}
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter une adresse de facturation
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: '#172867' }}>
                        Adresse de livraison
                      </label>
                      <div className="space-y-2">
                        {(isCommercial ? clientAddresses : addresses).filter(a => a.is_delivery_address).map((address) => (
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
                        {(isCommercial ? clientAddresses : addresses).filter(a => a.is_delivery_address).length === 0 && (
                          <p className="text-sm text-gray-500 italic">Aucune adresse de livraison</p>
                        )}
                      </div>
                      {!isCommercial && (
                        <button
                          onClick={() => openAddressForm('shipping')}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity px-4 py-2 rounded-lg border-2"
                          style={{ color: '#A0A12F', borderColor: '#A0A12F' }}
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter une adresse de livraison
                        </button>
                      )}
                    </div>
                  </div>
                        </div>
                      )}
                    </div>
                  ) : (
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
                  )}
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

              {/* Step 4: Paiement Stripe */}
              {step === 4 && paymentSheetData && showPaymentForm && (
                <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#172867' }}>
                    <CreditCard className="w-5 h-5" style={{ color: '#A0A12F' }} />
                    Paiement sécurisé
                  </h2>
                  {paymentSheetData.publishableKey && (
                    <StripePaymentForm
                      paymentIntent={paymentSheetData.paymentIntent}
                      orderId={createdOrderId!}
                      publishableKey={paymentSheetData.publishableKey}
                      total={total}
                    />
                  )}
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
                ) : step === 3 ? (
                  <div className="space-y-3">
                    {!orderCreated ? (
                      <button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#172867' }}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Création de la commande...
                          </>
                        ) : (
                          'Continuer'
                        )}
                      </button>
                    ) : (
                      <>
                        <div className="text-center mb-3 p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-sm font-medium" style={{ color: '#059669' }}>
                            Commande créée avec succès
                          </p>
                        </div>
                        <button
                          onClick={handlePayWithStripe}
                          disabled={loading}
                          className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#A0A12F' }}
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Initialisation du paiement...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5" />
                              Payer
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ) : step === 4 && orderCreated ? (
                  <div className="text-center">
                    <p className="text-sm mb-2" style={{ color: '#172867', opacity: 0.7 }}>
                      Commande créée avec succès
                    </p>
                    <p className="text-xs" style={{ color: '#A0A12F' }}>
                      Procédez au paiement ci-contre
                    </p>
                  </div>
                ) : null}
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
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('🖱️ [CHECKOUT] Button clicked!');
                    console.log('🖱️ [CHECKOUT] Button disabled?', savingAddress || !addressFormData.firstName || !addressFormData.lastName || !addressFormData.addressLine1 || !addressFormData.city || !addressFormData.postalCode || !addressFormData.country);
                    handleSaveAddress();
                  }}
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

// Composant de paiement Stripe avec Payment Element
function StripePaymentForm({ 
  paymentIntent, 
  orderId, 
  publishableKey,
  total
}: { 
  paymentIntent: string; 
  orderId: string; 
  publishableKey: string;
  total: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const stripePromise = loadStripe(publishableKey);

  if (!stripePromise) {
    return (
      <div className="text-center py-8">
        <p style={{ color: '#172867', opacity: 0.7 }}>Chargement du formulaire de paiement...</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: paymentIntent,
        appearance: {
          theme: 'stripe' as const,
        },
      }}
    >
      <PaymentFormContent
        orderId={orderId}
        total={total}
        onSuccess={() => {
          clearCart();
          router.push(`/checkout/success?orderId=${orderId}`);
        }}
      />
    </Elements>
  );
}

function PaymentFormContent({
  orderId,
  total,
  onSuccess
}: {
  orderId: string;
  total: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirmer le paiement avec Stripe
      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout/success?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Erreur lors du paiement');
        setLoading(false);
        return;
      }

      if (confirmedIntent?.status === 'succeeded') {
        // Vérifier le statut du paiement côté backend
        try {
          const paymentIntentId = confirmedIntent.id;
          const statusResponse = await paymentApi.verifyStatus(paymentIntentId);
          
          if (statusResponse.status === 'succeeded' || statusResponse.paymentIntent?.status === 'succeeded') {
            onSuccess();
          } else {
            setError('Le paiement n\'a pas été confirmé. Veuillez réessayer.');
            setLoading(false);
          }
        } catch (error: any) {
          console.error('Failed to verify payment status:', error);
          // Même si la vérification échoue, on redirige car le paiement Stripe a réussi
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: '#A0A12F' }}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement du paiement...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Payer {total.toFixed(2)} €
          </>
        )}
      </button>
    </form>
  );
}
