/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page d'accueil principale
 */

'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import Footer from '@/components/Footer';
import { Truck, Shield, RotateCcw, Award, Heart, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#172867' }}>
                Pourquoi choisir TradeFood ?
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Truck}
                title="Livraison Rapide"
                description="Livraison gratuite dès 50€ d'achat. Expédition sous 24-48h."
              />
              <FeatureCard
                icon={Shield}
                title="Paiement Sécurisé"
                description="Transactions 100% sécurisées avec cryptage SSL."
              />
              <FeatureCard
                icon={RotateCcw}
                title="Satisfait ou Remboursé"
                description="14 jours pour changer d'avis, retour gratuit."
              />
              <FeatureCard
                icon={Award}
                title="Qualité Premium"
                description="Produits sélectionnés avec soin, qualité garantie."
              />
              <FeatureCard
                icon={Heart}
                title="Origine Traçable"
                description="Tous nos produits sont tracés jusqu'à leur origine."
              />
              <FeatureCard
                icon={Users}
                title="Service Client"
                description="Équipe dédiée disponible pour vous accompagner."
              />
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#172867' }}>
              Restez informé de nos nouveautés
            </h2>
            <p className="text-lg mb-8" style={{ color: '#172867', opacity: 0.7 }}>
              Recevez nos offres exclusives et découvrez nos nouveaux produits en avant-première
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-6 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{ borderColor: '#172867', color: '#172867' }}
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#172867' }}
              >
                S'abonner
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-lg bg-white border-2 border-gray-100 hover:shadow-lg transition-all">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
        <Icon className="w-8 h-8" style={{ color: '#A0A12F' }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: '#172867' }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
        {description}
      </p>
    </div>
  );
}
