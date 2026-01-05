/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Espace client avec gestion du profil, commandes, adresses
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { User, Package, MapPin, LogOut, Mail, Phone, Building2, Lock, Eye, EyeOff, Users, Briefcase } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, orderApi, addressApi, authApi } from '@/services/api';
import { Order } from '@/types/order';
import { Address, CompanyAddress, CreateCompanyAddressData } from '@/types/address';
import { UserRole, Client } from '@/types/user';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading: authLoading, refreshUser, updateUser } = useAuth();
  
  // Calculer si l'utilisateur est commercial
  const isCommercial = useMemo(() => {
    if (!user) return false;
    const userRoles = Array.isArray(user?.role) ? user.role : user?.role ? [user.role] : [];
    return userRoles.includes('ROLE_COMMERCIAL') || userRoles.includes('ROLE_ADMIN');
  }, [user]);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<CompanyAddress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attendre que l'authentification soit chargée avant de rediriger
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/connexion');
    }
  }, [isAuthenticated, authLoading, router]);

  // Définir l'onglet actif par défaut pour les commerciaux une fois l'utilisateur chargé
  useEffect(() => {
    if (!authLoading && isAuthenticated && isCommercial) {
      // Si l'utilisateur est commercial et essaie d'accéder à des onglets non autorisés, rediriger vers commercial
      if (activeTab === 'addresses' || activeTab === 'orders') {
        setActiveTab('commercial');
      } else if (activeTab === 'profile') {
        setActiveTab('commercial');
      }
    }
  }, [authLoading, isAuthenticated, isCommercial, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      loadOrders();
    }
    if (isAuthenticated && activeTab === 'addresses') {
      console.log('🔍 [COMPTE] Loading addresses for tab:', activeTab);
      loadAddresses();
    }
  }, [isAuthenticated, activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAll();
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      // Utiliser le nouvel endpoint GET /api/v1/users/addresses (sans userId)
      const addressesList = await addressApi.getUserAddresses();
      console.log('🔍 [COMPTE] Addresses received from API:', addressesList);
      console.log('🔍 [COMPTE] Is array?', Array.isArray(addressesList));
      
      // Gérer différents formats de réponse
      let addressesArray: CompanyAddress[] = [];
      if (Array.isArray(addressesList)) {
        addressesArray = addressesList;
      } else if ((addressesList as any)?.data && Array.isArray((addressesList as any).data)) {
        addressesArray = (addressesList as any).data;
      } else if ((addressesList as any)?.addresses && Array.isArray((addressesList as any).addresses)) {
        addressesArray = (addressesList as any).addresses;
      }
      
      console.log('🔍 [COMPTE] Final addresses array:', addressesArray);
      console.log('🔍 [COMPTE] Number of addresses:', addressesArray.length);
      setAddresses(addressesArray);
    } catch (error) {
      console.error('❌ [COMPTE] Failed to load addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      router.push('/');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#172867' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Pour les commerciaux : Dashboard Commercial, Mon Profil
  // Pour les autres : Mon Profil, Mes Commandes, Mes Adresses
  const tabs = isCommercial
    ? [
        { id: 'commercial', label: 'Dashboard Commercial', icon: Briefcase },
        { id: 'profile', label: 'Mon Profil', icon: User },
      ]
    : [
        { id: 'profile', label: 'Mon Profil', icon: User },
        { id: 'orders', label: 'Mes Commandes', icon: Package },
        { id: 'addresses', label: 'Mes Adresses', icon: MapPin },
      ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#172867' }}>
              {isCommercial ? (
                <>Mon Espace <span style={{ color: '#A0A12F' }}>Commercial</span></>
              ) : (
                <>Mon Espace <span style={{ color: '#A0A12F' }}>Client</span></>
              )}
            </h1>
            <p className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>
              {isCommercial
                ? 'Gérez vos clients, commandes et suivez vos performances commerciales'
                : 'Gérez vos informations personnelles, commandes et préférences'}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1.5 bg-white rounded-xl border p-2" style={{ borderColor: '#A0A12F' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      activeTab === tab.id ? 'text-white shadow-md' : 'hover:bg-gray-50'
                    }`}
                    style={
                      activeTab === tab.id
                        ? { backgroundColor: '#A0A12F' }
                        : { color: '#172867' }
                    }
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-red-50 text-sm"
                    style={{ color: '#A0A12F' }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && <ProfileTab user={user} />}
              {activeTab === 'orders' && <OrdersTab orders={orders} loading={loading} />}
              {activeTab === 'addresses' && <AddressesTab addresses={addresses} loading={loading} onRefresh={loadAddresses} user={user} />}
              {activeTab === 'commercial' && isCommercial && <CommercialDashboard />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    companyName: user?.firstName || user?.companyName || '', // firstName contient le nom de société pour les entreprises
    siren: user?.siren || '',
    phone: user?.mobileNumber || user?.phone || '', // Utiliser mobileNumber en priorité
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Mettre à jour le formulaire quand l'utilisateur change (après refreshUser)
  useEffect(() => {
    setFormData({
      email: user?.email || '',
      companyName: user?.firstName || user?.companyName || '',
      siren: user?.siren || '',
      phone: user?.mobileNumber || user?.phone || '', // Utiliser mobileNumber en priorité
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // PUT /api/v1/users/profile accepte firstName, lastName, phoneNumber, mobileNumber, civility, website
      // Le nom de la société ne peut pas être modifié, on envoie uniquement le mobileNumber
      await userApi.updateProfile({
        mobileNumber: formData.phone || undefined, // Envoyer mobileNumber au backend
      });
      // Rafraîchir les données utilisateur pour afficher le mobileNumber mis à jour
      await refreshUser();
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setSavingPassword(true);

    try {
      await authApi.changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || 'Erreur lors de la modification du mot de passe' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de profil */}
      <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
            <User className="w-5 h-5" style={{ color: '#A0A12F' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
            Mon Profil
          </h2>
        </div>
        {message && (
          <div className={`mb-5 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {message.text}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Adresse email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="w-4 h-4 transition-colors" style={{ color: focusedField === 'email' ? '#A0A12F' : '#172867', opacity: focusedField === 'email' ? 0.8 : 0.4 }} />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                disabled
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-gray-50 cursor-not-allowed"
                style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
              L'email ne peut pas être modifié
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              SIREN
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'siren' ? '#A0A12F' : '#172867', opacity: focusedField === 'siren' ? 0.8 : 0.4 }} />
              </div>
              <input
                type="text"
                value={formData.siren}
                disabled
                onFocus={() => setFocusedField('siren')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-gray-50 cursor-not-allowed"
                style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                placeholder="123456789"
                maxLength={9}
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
              Le SIREN ne peut pas être modifié
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Nom de la société
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building2 className="w-4 h-4 transition-colors" style={{ color: '#172867', opacity: 0.4 }} />
              </div>
              <input
                type="text"
                value={formData.companyName}
                disabled
                onFocus={() => setFocusedField('companyName')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-gray-50 cursor-not-allowed"
                style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
                placeholder="Nom de votre entreprise"
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
              Le nom de la société ne peut pas être modifié
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Téléphone
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Phone className="w-4 h-4 transition-colors" style={{ color: focusedField === 'phone' ? '#A0A12F' : '#172867', opacity: focusedField === 'phone' ? 0.8 : 0.4 }} />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // Ne garder que les chiffres
                  const numericValue = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, phone: numericValue });
                }}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                style={{
                  borderColor: focusedField === 'phone' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                  color: '#172867',
                }}
                placeholder="0612345678"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: '#A0A12F' }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>

      {/* Bloc pour modifier le mot de passe */}
      <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
            <Lock className="w-5 h-5" style={{ color: '#A0A12F' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
            Modifier le mot de passe
          </h2>
        </div>
        {passwordMessage && (
          <div className={`mb-5 p-3 rounded-lg ${
            passwordMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {passwordMessage.text}
            </p>
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Ancien mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 transition-colors" style={{ color: focusedField === 'oldPassword' ? '#A0A12F' : '#172867', opacity: focusedField === 'oldPassword' ? 0.8 : 0.4 }} />
              </div>
              <input
                type={showOldPassword ? 'text' : 'password'}
                required
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                onFocus={() => setFocusedField('oldPassword')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                style={{
                  borderColor: focusedField === 'oldPassword' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                  color: '#172867',
                }}
                placeholder="Votre mot de passe actuel"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#172867', opacity: 0.5 }}
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Nouveau mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 transition-colors" style={{ color: focusedField === 'newPassword' ? '#A0A12F' : '#172867', opacity: focusedField === 'newPassword' ? 0.8 : 0.4 }} />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                onFocus={() => setFocusedField('newPassword')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                style={{
                  borderColor: focusedField === 'newPassword' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                  color: '#172867',
                }}
                placeholder="Au moins 8 caractères"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#172867', opacity: 0.5 }}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Confirmer le nouveau mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock className="w-4 h-4 transition-colors" style={{ color: focusedField === 'confirmPassword' ? '#A0A12F' : '#172867', opacity: focusedField === 'confirmPassword' ? 0.8 : 0.4 }} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                style={{
                  borderColor: focusedField === 'confirmPassword' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                  color: '#172867',
                }}
                placeholder="Confirmez votre nouveau mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#172867', opacity: 0.5 }}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: '#A0A12F' }}
          >
            {savingPassword ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}

function OrdersTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate || a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.orderDate || b.createdAt || b.updatedAt || 0).getTime();
    return dateB - dateA; // Ordre décroissant (plus récent en premier)
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 si on change de nombre de commandes
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

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
      <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
        <p style={{ color: '#172867' }}>Chargement des commandes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
          <Package className="w-5 h-5" style={{ color: '#A0A12F' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
          Mes Commandes
        </h2>
      </div>
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: '#A0A12F' }}>
          <Package className="w-12 h-12 mx-auto mb-4" style={{ color: '#A0A12F', opacity: 0.5 }} />
          <p style={{ color: '#172867', opacity: 0.7 }}>
            Vous n'avez pas encore de commandes.
          </p>
        </div>
      ) : (
        <>
          {paginatedOrders.map((order) => {
          // Calculer le total si non disponible
          const orderTotal = order.total ?? order.totalAmount ?? 
            (order.items?.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0) || 0);
          const orderNumber = order.orderNumber || order.number || order.id.substring(0, 8);
          
          return (
            <div key={order.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow" style={{ borderColor: '#A0A12F' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold" style={{ color: '#172867' }}>
                    Commande #{orderNumber}
                  </p>
                <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                  {new Date(order.orderDate || order.createdAt || order.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg" style={{ color: '#A0A12F' }}>
                    {typeof orderTotal === 'number' ? orderTotal.toFixed(2) : '0.00'} €
                  </p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 text-white"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              {order.trackingNumber && (
                <div className="mb-4">
                  <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                    Suivi: {order.trackingNumber}
                  </p>
                </div>
              )}
              <a
                href={`/compte/commande/${order.id}`}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#172867' }}
              >
                Voir les détails →
              </a>
            </div>
          );
        })}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: currentPage === 1 ? '#e5e7eb' : '#A0A12F',
                  color: currentPage === 1 ? '#6b7280' : 'white'
                }}
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-sm" style={{ color: '#172867' }}>
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: currentPage === totalPages ? '#e5e7eb' : '#A0A12F',
                  color: currentPage === totalPages ? '#6b7280' : 'white'
                }}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AddressesTab({ addresses, loading, onRefresh, user }: { addresses: CompanyAddress[]; loading: boolean; onRefresh: () => void; user: any }) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CompanyAddress | null>(null);

  // Log pour déboguer
  useEffect(() => {
    console.log('🔍 [AddressesTab] Addresses received:', addresses);
    console.log('🔍 [AddressesTab] Number of addresses:', addresses?.length);
    console.log('🔍 [AddressesTab] Loading:', loading);
  }, [addresses, loading]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
        <p style={{ color: '#172867' }}>Chargement des adresses...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#A0A12F' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
            <MapPin className="w-5 h-5" style={{ color: '#A0A12F' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
            Mes Adresses
          </h2>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-md text-sm"
          style={{ backgroundColor: '#A0A12F' }}
        >
          + Ajouter
        </button>
      </div>
      {showForm && (
        <AddressForm
          address={editingAddress}
          allAddresses={addresses}
          user={user}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingAddress(null);
            onRefresh();
          }}
        />
      )}
      {!addresses || addresses.length === 0 ? (
        <p style={{ color: '#172867', opacity: 0.7 }}>
          Vous n'avez pas encore d'adresse enregistrée.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <div key={address.id || `address-${index}`} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#A0A12F' }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold" style={{ color: '#172867' }}>
                  {address.name}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {address.is_default_address && (
                    <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                      Défaut
                    </span>
                  )}
                  {address.is_invoicing_address && (
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#172867', color: 'white' }}>
                      Facturation
                    </span>
                  )}
                  {address.is_delivery_address && (
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                      Livraison
                    </span>
                  )}
                </div>
              </div>
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
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditingAddress(address);
                    setShowForm(true);
                  }}
                  className="text-sm font-medium hover:opacity-80 transition-opacity px-3 py-1.5 rounded"
                  style={{ color: '#172867', border: '1px solid rgba(23, 40, 103, 0.3)' }}
                >
                  Modifier
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
                      try {
                        // Utiliser le nouvel endpoint DELETE /api/v1/users/addresses/{addressId}
                        await addressApi.deleteUserAddress(address.id);
                        onRefresh();
                      } catch (error) {
                        console.error('Failed to delete address:', error);
                        alert('Erreur lors de la suppression');
                      }
                    }
                  }}
                  className="text-sm font-medium hover:opacity-80 transition-opacity px-3 py-1.5 rounded text-red-600"
                  style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ address, allAddresses, onClose, onSuccess, user }: { address: CompanyAddress | null; allAddresses: CompanyAddress[]; onClose: () => void; onSuccess: () => void; user: any }) {
  const { user: currentUser, refreshUser, updateUser } = useAuth();
  const [formData, setFormData] = useState<CreateCompanyAddressData>({
    name: address?.name || '',
    address_line_1: address?.address_line_1 || '',
    address_line_2: address?.address_line_2 || '',
    address_line_3: address?.address_line_3 || '',
    address_line_4: address?.address_line_4 || '',
    postal_code: address?.postal_code || '',
    city: address?.city || '',
    country_code: address?.country_code || 'FR',
    is_invoicing_address: address?.is_invoicing_address || false,
    is_delivery_address: address?.is_delivery_address || false,
    is_default_address: address?.is_default_address || false,
    geocode: address?.geocode && address.geocode.lat !== null && address.geocode.lng !== null 
      ? { lat: address.geocode.lat, lng: address.geocode.lng }
      : undefined,
  });
  const [saving, setSaving] = useState(false);

  // Vérifier s'il existe déjà une adresse par défaut (en excluant l'adresse actuelle si on est en mode édition)
  const hasDefaultAddress = allAddresses.some(addr => 
    addr.id !== address?.id && addr.is_default_address === true
  );

  // Logique pour les checkboxes :
  // - Si aucune adresse par défaut n'existe (ni ailleurs, ni dans celle qu'on édite), 
  //   on ne peut cocher que "défaut" (facturation/livraison désactivées)
  // - Si une adresse par défaut existe ailleurs, on ne peut pas cocher "défaut" 
  //   mais on peut cocher facturation/livraison
  // - Si cette adresse est elle-même en défaut, on peut cocher facturation/livraison
  const canCheckDefault = !hasDefaultAddress;
  // On peut cocher facturation/livraison SEULEMENT si :
  // 1. Il existe une adresse par défaut ailleurs, OU
  // 2. Cette adresse est elle-même cochée comme défaut
  const canCheckInvoicingOrDelivery = hasDefaultAddress || formData.is_default_address === true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [COMPTE] handleSaveAddress called');
    console.log('🚀 [COMPTE] Form data:', formData);
    
    setSaving(true);
    try {
      // Récupérer l'ID utilisateur - essayer d'abord depuis le contexte, sinon depuis l'API
      let userId = currentUser?.id || user?.id;
      console.log('🔍 [COMPTE] Initial userId from user:', userId);
      
      if (!userId) {
        console.log('🔄 [COMPTE] Refreshing user...');
        // Rafraîchir l'utilisateur depuis le contexte
        await refreshUser();
        // Attendre un court instant pour que le state se mette à jour
        await new Promise(resolve => setTimeout(resolve, 300));
        // Re-récupérer l'utilisateur depuis le contexte après refresh
        userId = currentUser?.id || user?.id;
        console.log('🔍 [COMPTE] UserId after refresh:', userId);
      }
      
      if (!userId) {
        console.log('🔄 [COMPTE] Fetching user directly from API...');
        // Si toujours pas d'userId, récupérer directement depuis l'API
        try {
          const userResponse = await authApi.getCurrentUser();
          const freshUser = userResponse.user || userResponse;
          
          userId = freshUser?.id || freshUser?.userId;
          
          console.log('🔍 [COMPTE] User data from API:', freshUser);
          console.log('🔍 [COMPTE] UserId found:', userId);
          console.log('🔍 [COMPTE] Available user fields:', Object.keys(freshUser || {}));
          
          // Mettre à jour l'utilisateur dans le contexte avec les données fraîches
          if (freshUser && !currentUser?.id && userId && currentUser) {
            updateUser({ ...currentUser, id: userId });
          }
          
          if (!userId) {
            console.error('❌ [COMPTE] No userId found in user data:', freshUser);
            alert('Erreur : Impossible de récupérer votre identifiant utilisateur. Veuillez vous déconnecter et vous reconnecter, ou contacter le support.');
            setSaving(false);
            return;
          }
        } catch (error) {
          console.error('❌ [COMPTE] Failed to get user:', error);
          alert('Erreur : Impossible de récupérer les informations de votre compte. Veuillez réessayer.');
          setSaving(false);
          return;
        }
      }

      // S'assurer que tous les champs texte optionnels sont initialisés à "" comme requis par Sellsy
      // Le backend gère maintenant is_invoicing_address, is_delivery_address et is_default_address localement
      const payload: CreateCompanyAddressData = {
        name: formData.name,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2 || "",
        address_line_3: formData.address_line_3 || "",
        address_line_4: formData.address_line_4 || "",
        postal_code: formData.postal_code,
        city: formData.city,
        country_code: formData.country_code,
        is_invoicing_address: formData.is_invoicing_address,
        is_delivery_address: formData.is_delivery_address,
        is_default_address: formData.is_default_address || false,
        ...(formData.geocode && { geocode: formData.geocode }),
      };

      console.log('📝 [COMPTE] Address data:', payload);
      console.log('📝 [COMPTE] Calling API...');

      if (address) {
        // Utiliser le nouvel endpoint PUT /api/v1/users/addresses/{addressId} (sans userId)
        const updatedAddress = await addressApi.updateUserAddress(address.id, payload);
        console.log('✅ [COMPTE] Address updated successfully:', updatedAddress);
      } else {
        // Utiliser le nouvel endpoint POST /api/v1/users/addresses (sans userId)
        const newAddress = await addressApi.createUserAddress(payload);
        console.log('✅ [COMPTE] Address created successfully:', newAddress);
      }
      
      console.log('✅ [COMPTE] Address saved successfully');
      onSuccess();
    } catch (error: any) {
      console.error('❌ [COMPTE] Failed to save address:', error);
      console.error('❌ [COMPTE] Error details:', {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        stack: error?.stack
      });
      const errorMessage = error?.message || error?.data?.message || 'Erreur lors de la sauvegarde de l\'adresse';
      alert(`Erreur : ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-5 border rounded-xl space-y-4 bg-gray-50" style={{ borderColor: '#A0A12F' }}>
      <h3 className="font-semibold text-lg mb-4" style={{ color: '#172867' }}>
        {address ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
      </h3>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Nom de l'adresse *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
          placeholder="Ex: Siège social, Entrepôt, Bureau..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Adresse ligne 1 *
        </label>
        <input
          type="text"
          required
          value={formData.address_line_1}
          onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Adresse ligne 2 (optionnel)
        </label>
        <input
          type="text"
          value={formData.address_line_2 || ''}
          onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Adresse ligne 3 (optionnel)
        </label>
        <input
          type="text"
          value={formData.address_line_3 || ''}
          onChange={(e) => setFormData({ ...formData, address_line_3: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Adresse ligne 4 (optionnel)
        </label>
        <input
          type="text"
          value={formData.address_line_4 || ''}
          onChange={(e) => setFormData({ ...formData, address_line_4: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Code postal *
          </label>
          <input
            type="text"
            required
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Ville *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Code pays *
        </label>
        <input
          type="text"
          required
          value={formData.country_code}
          onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
          onFocus={(e) => e.target.style.borderColor = '#A0A12F'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(160, 161, 47, 0.3)'}
          placeholder="FR"
          maxLength={2}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <label className={`flex items-center gap-2 ${canCheckDefault ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
            <input
              type="checkbox"
              checked={formData.is_default_address || false}
              disabled={!canCheckDefault}
              onChange={(e) => {
                const newValue = e.target.checked;
                setFormData({ 
                  ...formData, 
                  is_default_address: newValue,
                  // Si on décoche "défaut", décocher aussi facturation et livraison
                  ...(newValue === false ? { is_invoicing_address: false, is_delivery_address: false } : {})
                });
              }}
              className="w-5 h-5"
              style={{ accentColor: '#A0A12F' }}
            />
            <span className="text-sm font-medium" style={{ color: '#172867' }}>
              Adresse par défaut
            </span>
          </label>
          <label className={`flex items-center gap-2 ${canCheckInvoicingOrDelivery ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
            <input
              type="checkbox"
              checked={formData.is_invoicing_address}
              disabled={!canCheckInvoicingOrDelivery}
              onChange={(e) => setFormData({ ...formData, is_invoicing_address: e.target.checked })}
              className="w-5 h-5"
              style={{ accentColor: '#A0A12F' }}
            />
            <span className="text-sm" style={{ color: '#172867' }}>
              Adresse de facturation
            </span>
          </label>
          <label className={`flex items-center gap-2 ${canCheckInvoicingOrDelivery ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
            <input
              type="checkbox"
              checked={formData.is_delivery_address}
              disabled={!canCheckInvoicingOrDelivery}
              onChange={(e) => setFormData({ ...formData, is_delivery_address: e.target.checked })}
              className="w-5 h-5"
              style={{ accentColor: '#A0A12F' }}
            />
            <span className="text-sm" style={{ color: '#172867' }}>
              Adresse de livraison
            </span>
          </label>
        </div>
        {!canCheckDefault && (
          <p className="text-xs" style={{ color: '#172867', opacity: 0.6 }}>
            Une adresse par défaut existe déjà. Vous devez d'abord retirer le statut "défaut" de l'autre adresse.
          </p>
        )}
        {!canCheckInvoicingOrDelivery && (
          <p className="text-xs" style={{ color: '#172867', opacity: 0.6 }}>
            Vous devez d'abord définir une adresse par défaut avant de pouvoir cocher facturation ou livraison.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: '#A0A12F' }}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-lg font-semibold border transition-all hover:opacity-80"
          style={{ borderColor: 'rgba(160, 161, 47, 0.3)', color: '#172867' }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// Dashboard Commercial
function CommercialDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [clientAddresses, setClientAddresses] = useState<CompanyAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const ordersPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          (client) =>
            client.firstName?.toLowerCase().includes(query) ||
            client.lastName?.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query) ||
            client.companyName?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clients]);

  const loadClients = async () => {
    setLoading(true);
    try {
      // L'API retourne directement un tableau de clients
      const clientsList = await userApi.getCommercialClients();
      // Mapper les données pour convertir phoneNumber en phone si nécessaire
      const mappedClients = Array.isArray(clientsList) 
        ? clientsList.map((client: any) => ({
            ...client,
            phone: client.phoneNumber || client.phone, // Utiliser phoneNumber de l'API ou phone si déjà présent
          }))
        : [];
      setClients(mappedClients);
      setFilteredClients(mappedClients);
    } catch (error) {
      console.error('Failed to load clients:', error);
      setClients([]);
      setFilteredClients([]);
    } finally {
      setLoading(false);
    }
  };

  const loadClientOrders = async (clientId: string) => {
    setLoadingOrders(true);
    try {
      // Utiliser le nouvel endpoint GET /api/v1/orders/user/{userId}
      const orders = await orderApi.getUserOrders(clientId);
      setClientOrders(Array.isArray(orders) ? orders : []);
      setCurrentOrdersPage(1); // Réinitialiser à la page 1 lors du chargement
    } catch (error) {
      console.error('Failed to load client orders:', error);
      setClientOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const sortedClientOrders = [...clientOrders].sort((a, b) => {
    const dateA = new Date((a as any).date || a.orderDate || a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date((b as any).date || b.orderDate || b.createdAt || b.updatedAt || 0).getTime();
    return dateB - dateA; // Ordre décroissant (plus récent en premier)
  });

  const totalOrdersPages = Math.ceil(sortedClientOrders.length / ordersPerPage);
  const ordersStartIndex = (currentOrdersPage - 1) * ordersPerPage;
  const ordersEndIndex = ordersStartIndex + ordersPerPage;
  const paginatedClientOrders = sortedClientOrders.slice(ordersStartIndex, ordersEndIndex);

  const loadClientAddresses = async (clientId: string) => {
    setLoadingAddresses(true);
    try {
      const addressesList = await addressApi.getUserAddresses(clientId);
      // Gérer différents formats de réponse
      const addressesArray = Array.isArray(addressesList) 
        ? addressesList 
        : (addressesList as any)?.data || [];
      setClientAddresses(addressesArray);
    } catch (error) {
      console.error('Failed to load client addresses:', error);
      setClientAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    loadClientOrders(client.id);
    loadClientAddresses(client.id);
  };

  const handleCreateOrderForClient = (client: Client) => {
    // Stocker le client sélectionné dans le localStorage pour le checkout
    localStorage.setItem('selectedClientId', client.id);
    router.push('/panier');
  };

  if (selectedClient) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedClient(null);
            setClientOrders([]);
            setClientAddresses([]);
          }}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#A0A12F' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des clients
        </button>

        {/* Informations du client */}
        <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F' }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#172867' }}>
                {selectedClient.companyName || `${selectedClient.firstName} ${selectedClient.lastName}`}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#172867', opacity: 0.6 }}>
                    Email
                  </p>
                  <p className="text-sm" style={{ color: '#172867' }}>
                    {selectedClient.email}
                  </p>
                </div>
                {selectedClient.phone && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#172867', opacity: 0.6 }}>
                      Téléphone
                    </p>
                    <p className="text-sm" style={{ color: '#172867' }}>
                      {selectedClient.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Adresses du client */}
              {loadingAddresses ? (
                <div className="mt-4">
                  <p className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>Chargement des adresses...</p>
                </div>
              ) : clientAddresses.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#172867', opacity: 0.6 }}>
                    Adresses
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {clientAddresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-3 rounded-lg border"
                        style={{ borderColor: 'rgba(160, 161, 47, 0.3)', backgroundColor: 'rgba(160, 161, 47, 0.02)' }}
                      >
                        <p className="font-medium text-sm mb-1" style={{ color: '#172867' }}>
                          {address.name}
                        </p>
                        <p className="text-xs" style={{ color: '#172867', opacity: 0.7 }}>
                          {address.address_line_1}
                          {address.address_line_2 && <><br />{address.address_line_2}</>}
                          {address.address_line_3 && <><br />{address.address_line_3}</>}
                          {address.address_line_4 && <><br />{address.address_line_4}</>}
                          <br />
                          {address.postal_code} {address.city}
                          <br />
                          {address.country_code}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {address.is_default_address && (
                            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                              Défaut
                            </span>
                          )}
                          {address.is_invoicing_address && (
                            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#172867', color: 'white' }}>
                              Facturation
                            </span>
                          )}
                          {address.is_delivery_address && (
                            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                              Livraison
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="ml-6">
              <button
                onClick={() => handleCreateOrderForClient(selectedClient)}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-md whitespace-nowrap"
                style={{ backgroundColor: '#A0A12F' }}
              >
                Créer une commande
              </button>
            </div>
          </div>
        </div>

        {/* Historique des commandes */}
        <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#172867' }}>
            Historique des commandes
          </h3>
          {loadingOrders ? (
            <div className="text-center py-8">
              <p style={{ color: '#172867', opacity: 0.6 }}>Chargement des commandes...</p>
            </div>
          ) : clientOrders.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: '#172867', opacity: 0.6 }}>Aucune commande pour ce client</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedClientOrders.map((order) => {
                const orderDate = (order as any).date || order.orderDate || order.createdAt || order.updatedAt;
                const orderNumber = order.number || order.orderNumber || order.id.substring(0, 8);
                const orderTotal = order.totalAmount || order.total || 0;
                const orderStatus = order.status || 'UNKNOWN';
                
                return (
                  <div
                    key={order.id}
                    className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                    style={{ borderColor: 'rgba(160, 161, 47, 0.3)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-lg" style={{ color: '#172867' }}>
                            Commande #{orderNumber}
                          </p>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                orderStatus === 'VALIDATED' || orderStatus === 'delivered'
                                  ? '#10b981'
                                  : orderStatus === 'processing' || orderStatus === 'shipped'
                                  ? '#3b82f6'
                                  : orderStatus === 'PENDING' || orderStatus === 'pending'
                                  ? '#f59e0b'
                                  : '#6b7280',
                              color: 'white',
                            }}
                          >
                            {orderStatus === 'VALIDATED'
                              ? 'Validée'
                              : orderStatus === 'PENDING'
                              ? 'En attente'
                              : orderStatus === 'processing'
                              ? 'En traitement'
                              : orderStatus === 'shipped'
                              ? 'Expédiée'
                              : orderStatus === 'delivered'
                              ? 'Livrée'
                              : orderStatus}
                          </span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: '#172867', opacity: 0.7 }}>
                          {orderDate ? new Date(orderDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'Date non disponible'}
                        </p>
                        
                        {/* Détails des articles */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(160, 161, 47, 0.2)' }}>
                            <p className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.6 }}>
                              Articles ({order.items.length})
                            </p>
                            <div className="space-y-1">
                              {order.items.map((item: any, index: number) => {
                                // Essayer plusieurs champs possibles pour le nom du produit
                                const productName = 
                                  item.product?.name || 
                                  item.productName || 
                                  item.name || 
                                  item.description || 
                                  item.title || 
                                  'Produit';
                                
                                return (
                                  <div key={item.id || index} className="flex justify-between text-sm">
                                    <span style={{ color: '#172867', opacity: 0.8 }}>
                                      {productName} x {item.quantity}
                                    </span>
                                    <span style={{ color: '#172867' }}>
                                      {((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)} €
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Lien PDF si disponible */}
                        {(order as any).pdfLink && (
                          <div className="mt-3">
                            <a
                              href={(order as any).pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                              style={{ color: '#A0A12F' }}
                            >
                              Voir le PDF →
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-xl mb-2" style={{ color: '#A0A12F' }}>
                          {orderTotal.toFixed(2)} €
                        </p>
                        {(order as any).currency && (order as any).currency !== 'eur' && (
                          <p className="text-xs" style={{ color: '#172867', opacity: 0.6 }}>
                            {(order as any).currency.toUpperCase()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              {totalOrdersPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentOrdersPage(prev => Math.max(1, prev - 1))}
                    disabled={currentOrdersPage === 1}
                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: currentOrdersPage === 1 ? '#e5e7eb' : '#A0A12F',
                      color: currentOrdersPage === 1 ? '#6b7280' : 'white'
                    }}
                  >
                    Précédent
                  </button>
                  <span className="px-4 py-2 text-sm" style={{ color: '#172867' }}>
                    Page {currentOrdersPage} sur {totalOrdersPages}
                  </span>
                  <button
                    onClick={() => setCurrentOrdersPage(prev => Math.min(totalOrdersPages, prev + 1))}
                    disabled={currentOrdersPage === totalOrdersPages}
                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: currentOrdersPage === totalOrdersPages ? '#e5e7eb' : '#A0A12F',
                      color: currentOrdersPage === totalOrdersPages ? '#6b7280' : 'white'
                    }}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
              <Users className="w-6 h-6" style={{ color: '#A0A12F' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                Total Clients
              </p>
              <p className="text-2xl font-bold" style={{ color: '#172867' }}>
                {clients.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
            <Briefcase className="w-5 h-5" style={{ color: '#A0A12F' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
            Mes Clients
          </h2>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher un client (nom, email, entreprise)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ borderColor: '#A0A12F', color: '#172867' }}
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p style={{ color: '#172867', opacity: 0.6 }}>Chargement des clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <p style={{ color: '#172867', opacity: 0.6 }}>
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleClientClick(client)}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                style={{ borderColor: 'rgba(160, 161, 47, 0.3)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#172867' }}>
                      {client.companyName || `${client.firstName} ${client.lastName}`}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: '#172867', opacity: 0.7 }}>
                      {client.email}
                    </p>
                    {client.phone && (
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>
                        {client.phone}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateOrderForClient(client);
                    }}
                    className="ml-4 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 text-sm"
                    style={{ backgroundColor: '#A0A12F' }}
                  >
                    Commande
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

