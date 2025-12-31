/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Espace client avec gestion du profil, commandes, adresses
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, Mail, Phone, Building2, Lock, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, orderApi, addressApi, authApi } from '@/services/api';
import { Order } from '@/types/order';
import { Address, CompanyAddress, CreateCompanyAddressData } from '@/types/address';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<CompanyAddress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      loadOrders();
    }
    if (isAuthenticated && activeTab === 'addresses') {
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
      if (!user?.companyId) {
        console.error('No companyId found for user');
        setAddresses([]);
        return;
      }
      const response = await addressApi.getCompanyAddresses(user.companyId);
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#172867' }}>
              Mon Espace <span style={{ color: '#A0A12F' }}>Client</span>
            </h1>
            <p className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>
              Gérez vos informations personnelles, commandes et préférences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1.5 bg-white rounded-xl border p-2" style={{ borderColor: '#A0A12F' }}>
                {[
                  { id: 'profile', label: 'Mon Profil', icon: User },
                  { id: 'orders', label: 'Mes Commandes', icon: Package },
                  { id: 'addresses', label: 'Mes Adresses', icon: MapPin },
                ].map((tab) => (
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProfileTab({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    companyName: user?.firstName || user?.companyName || '', // firstName contient le nom de société pour les entreprises
    siren: user?.siren || '',
    phone: user?.phone || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // PUT /api/v1/users/profile n'accepte que firstName et lastName selon la doc
      // Pour les entreprises, on utilise firstName pour le nom de société
      await userApi.updateProfile({
        firstName: formData.companyName,
        lastName: '', // Pas de lastName pour une société
      });
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
              Nom de la société <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'companyName' ? '#A0A12F' : '#172867', opacity: focusedField === 'companyName' ? 0.8 : 0.4 }} />
              </div>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                onFocus={() => setFocusedField('companyName')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                style={{
                  borderColor: focusedField === 'companyName' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                  color: '#172867',
                }}
                placeholder="Nom de votre entreprise"
              />
            </div>
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
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                style={{
                  borderColor: focusedField === 'phone' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                  color: '#172867',
                }}
                placeholder="06 12 34 56 78"
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
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow" style={{ borderColor: '#A0A12F' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold" style={{ color: '#172867' }}>
                  Commande #{order.orderNumber}
                </p>
                <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg" style={{ color: '#A0A12F' }}>
                  {order.total.toFixed(2)} €
                </p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 text-white"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm mb-2" style={{ color: '#172867', opacity: 0.7 }}>
                {order.items.length} article{order.items.length > 1 ? 's' : ''}
              </p>
              {order.trackingNumber && (
                <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                  Suivi: {order.trackingNumber}
                </p>
              )}
            </div>
            <a
              href={`/compte/commande/${order.id}`}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#172867' }}
            >
              Voir les détails →
            </a>
          </div>
        ))
      )}
    </div>
  );
}

function AddressesTab({ addresses, loading, onRefresh, user }: { addresses: CompanyAddress[]; loading: boolean; onRefresh: () => void; user: any }) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CompanyAddress | null>(null);

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
      {addresses.length === 0 ? (
        <p style={{ color: '#172867', opacity: 0.7 }}>
          Vous n'avez pas encore d'adresse enregistrée.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#A0A12F' }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold" style={{ color: '#172867' }}>
                  {address.name}
                </h3>
                <div className="flex gap-2">
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
                        if (user?.companyId) {
                          await addressApi.deleteCompanyAddress(user.companyId, address.id);
                          onRefresh();
                        }
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

function AddressForm({ address, onClose, onSuccess, user }: { address: CompanyAddress | null; onClose: () => void; onSuccess: () => void; user: any }) {
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
    geocode: address?.geocode,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.companyId) {
      alert('Erreur : Aucune entreprise associée à votre compte');
      return;
    }

    setSaving(true);

    try {
      // S'assurer que tous les champs texte optionnels sont initialisés à "" comme requis par Sellsy
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
        ...(formData.geocode && { geocode: formData.geocode }),
      };

      if (address) {
        await addressApi.updateCompanyAddress(user.companyId, address.id, payload);
      } else {
        await addressApi.createCompanyAddress(user.companyId, payload);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Erreur lors de la sauvegarde');
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
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_invoicing_address}
            onChange={(e) => setFormData({ ...formData, is_invoicing_address: e.target.checked })}
            className="w-5 h-5"
            style={{ accentColor: '#A0A12F' }}
          />
          <span className="text-sm" style={{ color: '#172867' }}>
            Adresse de facturation
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_delivery_address}
            onChange={(e) => setFormData({ ...formData, is_delivery_address: e.target.checked })}
            className="w-5 h-5"
            style={{ accentColor: '#A0A12F' }}
          />
          <span className="text-sm" style={{ color: '#172867' }}>
            Adresse de livraison
          </span>
        </label>
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

