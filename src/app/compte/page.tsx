'use client';

import { useState } from 'react';
import { User, Package, Heart, CreditCard, MapPin, LogOut, Settings } from 'lucide-react';
import Header from '@/components/Header';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#172867' }}>
          Mon Espace Client
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}
                  style={
                    activeTab === tab.id
                      ? { backgroundColor: '#172867' }
                      : { color: '#172867', backgroundColor: 'transparent' }
                  }
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:opacity-80"
                style={{ color: '#A0A12F' }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'favorites' && <FavoritesTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'payment' && <PaymentTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#172867' }}>
        Mon Profil
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Nom complet
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
            defaultValue="Jean Dupont"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
            defaultValue="jean.dupont@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
            Téléphone
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#172867', color: '#172867' }}
            defaultValue="+33 6 12 34 56 78"
          />
        </div>
        <button
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#172867' }}
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}

function OrdersTab() {
  const orders = [
    { id: '12345', date: '15/01/2024', total: 89.90, status: 'Livré' },
    { id: '12344', date: '10/01/2024', total: 124.50, status: 'En cours' },
    { id: '12343', date: '05/01/2024', total: 45.80, status: 'Livré' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#172867' }}>
        Mes Commandes
      </h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg border-2 border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold" style={{ color: '#172867' }}>
                Commande #{order.id}
              </p>
              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                {order.date}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg" style={{ color: '#A0A12F' }}>
                {order.total.toFixed(2)} €
              </p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2"
                style={{ backgroundColor: '#A0A12F', color: 'white' }}
              >
                {order.status}
              </span>
            </div>
          </div>
          <button
            className="text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#172867' }}
          >
            Voir les détails →
          </button>
        </div>
      ))}
    </div>
  );
}

function FavoritesTab() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#172867' }}>
        Mes Favoris
      </h2>
      <p style={{ color: '#172867', opacity: 0.7 }}>
        Vous n'avez pas encore de produits favoris.
      </p>
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#172867' }}>
        Mes Adresses
      </h2>
      <button
        className="px-6 py-3 rounded-lg font-semibold border-2 transition-all hover:opacity-80"
        style={{ borderColor: '#172867', color: '#172867' }}
      >
        + Ajouter une adresse
      </button>
    </div>
  );
}

function PaymentTab() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#172867' }}>
        Moyens de Paiement
      </h2>
      <button
        className="px-6 py-3 rounded-lg font-semibold border-2 transition-all hover:opacity-80"
        style={{ borderColor: '#172867', color: '#172867' }}
      >
        + Ajouter une carte
      </button>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#172867' }}>
        Paramètres
      </h2>
      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5" style={{ accentColor: '#172867' }} />
          <span style={{ color: '#172867' }}>Recevoir les newsletters</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5" style={{ accentColor: '#172867' }} />
          <span style={{ color: '#172867' }}>Notifications par email</span>
        </label>
      </div>
    </div>
  );
}

