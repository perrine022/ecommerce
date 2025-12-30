/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Espace client avec gestion du profil, commandes, adresses
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, CreditCard, MapPin, LogOut, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, orderApi, addressApi } from '@/services/api';
import { Order } from '@/types/order';
import { Address } from '@/types/address';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
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
      const response = await addressApi.getAll();
      setAddresses(response.addresses);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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
              <nav className="space-y-1.5 bg-white rounded-xl border p-2" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
                {[
                  { id: 'profile', label: 'Mon Profil', icon: User },
                  { id: 'orders', label: 'Mes Commandes', icon: Package },
                  { id: 'favorites', label: 'Mes Favoris', icon: Heart },
                  { id: 'addresses', label: 'Mes Adresses', icon: MapPin },
                  { id: 'payment', label: 'Moyens de Paiement', icon: CreditCard },
                  { id: 'settings', label: 'Paramètres', icon: Settings },
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
              {activeTab === 'favorites' && <FavoritesTab />}
              {activeTab === 'addresses' && <AddressesTab addresses={addresses} loading={loading} onRefresh={loadAddresses} />}
              {activeTab === 'payment' && <PaymentTab />}
              {activeTab === 'settings' && <SettingsTab />}
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
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // PUT /api/v1/users/profile n'accepte que firstName et lastName selon la doc
      await userApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la mise à jour' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Prénom
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
              Nom
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            disabled
            className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 cursor-not-allowed"
            style={{ borderColor: '#A0A12F', opacity: 0.2, color: '#172867' }}
          />
          <p className="mt-1.5 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
            L'email ne peut pas être modifié
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
            style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
            placeholder="06 12 34 56 78"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#A0A12F' }}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
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
        <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
          <Package className="w-12 h-12 mx-auto mb-4" style={{ color: '#A0A12F', opacity: 0.5 }} />
          <p style={{ color: '#172867', opacity: 0.7 }}>
            Vous n'avez pas encore de commandes.
          </p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
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

function FavoritesTab() {
  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
          <Heart className="w-5 h-5" style={{ color: '#A0A12F' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
          Mes Favoris
        </h2>
      </div>
      <div className="text-center py-8">
        <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: '#A0A12F', opacity: 0.3 }} />
        <p style={{ color: '#172867', opacity: 0.7 }}>
          Vous n'avez pas encore de produits favoris.
        </p>
      </div>
    </div>
  );
}

function AddressesTab({ addresses, loading, onRefresh }: { addresses: Address[]; loading: boolean; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
        <p style={{ color: '#172867' }}>Chargement des adresses...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
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
            <div key={address.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold" style={{ color: '#172867' }}>
                  {address.type === 'billing' ? 'Facturation' : 'Livraison'}
                </h3>
                {address.isDefault && (
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                    Par défaut
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                {address.firstName} {address.lastName}
                {address.company && <><br />{address.company}</>}
                <br />
                {address.addressLine1}
                {address.addressLine2 && <><br />{address.addressLine2}</>}
                <br />
                {address.postalCode} {address.city}
                <br />
                {address.country}
                {address.phone && <><br />{address.phone}</>}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditingAddress(address);
                    setShowForm(true);
                  }}
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#172867' }}
                >
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ address, onClose, onSuccess }: { address: Address | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    type: (address?.type || 'shipping') as 'billing' | 'shipping',
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    company: address?.company || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'France',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (address) {
        await addressApi.update(address.id, formData);
      } else {
        await addressApi.create(formData);
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
    <form onSubmit={handleSubmit} className="mb-6 p-5 border rounded-xl space-y-4 bg-gray-50" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
      <h3 className="font-semibold text-lg mb-4" style={{ color: '#172867' }}>
        {address ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
      </h3>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'billing' | 'shipping' })}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        >
          <option value="shipping">Livraison</option>
          <option value="billing">Facturation</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Prénom
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Nom
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Entreprise (optionnel)
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Adresse
        </label>
        <input
          type="text"
          required
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Complément d'adresse (optionnel)
        </label>
        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Ville
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Code postal
          </label>
          <input
            type="text"
            required
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Pays
        </label>
        <input
          type="text"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
          Téléphone (optionnel)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all"
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="w-5 h-5"
          style={{ accentColor: '#172867' }}
        />
        <label className="text-sm" style={{ color: '#172867' }}>
          Définir comme adresse par défaut
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
          style={{ borderColor: '#A0A12F', opacity: 0.3, color: '#172867' }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function PaymentTab() {
  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
          <CreditCard className="w-5 h-5" style={{ color: '#A0A12F' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
          Moyens de Paiement
        </h2>
      </div>
      <button
        className="px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-md text-sm"
        style={{ backgroundColor: '#A0A12F' }}
      >
        + Ajouter une carte
      </button>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
          <Settings className="w-5 h-5" style={{ color: '#A0A12F' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: '#172867' }}>
          Paramètres
        </h2>
      </div>
      <div className="space-y-4">
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <input type="checkbox" className="w-5 h-5" style={{ accentColor: '#A0A12F' }} />
          <span style={{ color: '#172867' }}>Recevoir les newsletters</span>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <input type="checkbox" className="w-5 h-5" style={{ accentColor: '#A0A12F' }} />
          <span style={{ color: '#172867' }}>Notifications par email</span>
        </label>
      </div>
    </div>
  );
}
