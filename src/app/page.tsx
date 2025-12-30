/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page d'accueil principale
 */

'use client';

import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import ProductsSection from '@/components/ProductsSection';
import Footer from '@/components/Footer';
import { Truck, Shield, RotateCcw, Award, Heart, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Promo Banner */}
        <PromoBanner />

        {/* Products Section */}
        <ProductsSection />

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#172867' }}>
                Pourquoi choisir <span style={{ color: '#A0A12F' }}>TradeFood</span> ?
              </h2>
              <p className="text-base" style={{ color: '#172867', opacity: 0.7 }}>
                Des avantages qui font la différence
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, rgba(160, 161, 47, 0.05) 0%, rgba(160, 161, 47, 0.02) 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#172867' }}>
              Restez informé de nos <span style={{ color: '#A0A12F' }}>nouveautés</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: '#172867', opacity: 0.7 }}>
              Recevez nos offres exclusives et découvrez nos nouveaux produits en avant-première
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-6 py-3 rounded-lg border focus:outline-none focus:ring-1"
                style={{ borderColor: '#A0A12F', color: '#172867' }}
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#A0A12F' }}
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
    <div className="group relative p-6 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-md" style={{ backgroundColor: 'rgba(160, 161, 47, 0.02)' }}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
          <Icon className="w-6 h-6" style={{ color: '#A0A12F' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#172867' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: '#172867', opacity: 0.7 }}>
            {description}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#A0A12F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
