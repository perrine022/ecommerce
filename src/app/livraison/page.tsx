/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page Livraison
 */

'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Truck, Package, Clock, MapPin, Shield, Gift } from 'lucide-react';

export default function LivraisonPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A0A12F]/5 via-transparent to-transparent"></div>
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#172867] to-[#A0A12F] bg-clip-text text-transparent">
                Livraison & <span className="text-[#A0A12F]">Expédition</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Des options de livraison adaptées à vos besoins
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Options de Livraison */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
                <span className="text-[#172867]">Options de </span>
                <span className="text-[#A0A12F]">Livraison</span>
              </h2>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScrollReveal delay={0}>
                <DeliveryOption
                  icon={Truck}
                  title="Livraison Standard"
                  duration="3-5 jours ouvrés"
                  price="5,90 €"
                  freeFrom="Gratuite dès 50€"
                  description="Livraison à domicile ou en point relais"
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <DeliveryOption
                  icon={Clock}
                  title="Livraison Express"
                  duration="24-48h"
                  price="9,90 €"
                  freeFrom="Gratuite dès 100€"
                  description="Pour recevoir vos produits rapidement"
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <DeliveryOption
                  icon={Package}
                  title="Livraison Point Relais"
                  duration="3-5 jours ouvrés"
                  price="4,90 €"
                  freeFrom="Gratuite dès 40€"
                  description="Retrait dans un point relais près de chez vous"
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Zones de Livraison */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A0A12F]/5 to-transparent"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                <span className="text-[#172867]">Zones de </span>
                <span className="text-[#A0A12F]">Livraison</span>
              </h2>
            </ScrollReveal>
            
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <div className="group">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#A0A12F]/30">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center group-hover:from-[#A0A12F]/20 group-hover:to-[#A0A12F]/10 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-[#A0A12F]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-[#172867]">
                          France Métropolitaine
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Nous livrons dans toute la France métropolitaine. Les délais de livraison peuvent varier 
                          selon votre localisation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="group">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#A0A12F]/30">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center group-hover:from-[#A0A12F]/20 group-hover:to-[#A0A12F]/10 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-[#A0A12F]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-[#172867]">
                          Corse et DOM-TOM
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Pour la Corse et les DOM-TOM, des frais de livraison supplémentaires peuvent s'appliquer. 
                          Contactez-nous pour un devis personnalisé.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Suivi de Commande */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                <span className="text-[#172867]">Suivi de Votre </span>
                <span className="text-[#A0A12F]">Commande</span>
              </h2>
            </ScrollReveal>
            
            <div className="space-y-6">
              <ScrollReveal delay={0}>
                <InfoCard
                  icon={Shield}
                  title="Numéro de Suivi"
                  description="Dès l'expédition de votre commande, vous recevrez un email avec votre numéro de suivi. 
                  Vous pourrez ainsi suivre votre colis en temps réel jusqu'à sa livraison."
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <InfoCard
                  icon={Gift}
                  title="Emballage Soigné"
                  description="Tous nos produits sont emballés avec soin pour garantir leur fraîcheur et leur intégrité 
                  lors du transport. Les produits fragiles bénéficient d'un emballage renforcé."
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <InfoCard
                  icon={Clock}
                  title="Délais de Préparation"
                  description="Vos commandes sont préparées sous 24-48h (hors week-end et jours fériés). 
                  Vous serez informé par email dès l'expédition de votre colis."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Retours */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A0A12F]/5 to-transparent"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                <span className="text-[#172867]">Retours et </span>
                <span className="text-[#A0A12F]">Remboursements</span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#A0A12F]/20 to-[#172867]/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100">
                  <p className="text-lg mb-6 leading-relaxed text-gray-700">
                    Vous disposez d'un délai de <strong className="text-[#A0A12F]">14 jours</strong> à compter de la réception de votre commande 
                    pour nous retourner un produit qui ne vous conviendrait pas.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Les produits doivent être retournés dans leur emballage d'origine, non ouverts et en parfait état. 
                    Les frais de retour sont à votre charge, sauf en cas d'erreur de notre part ou de produit défectueux.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function DeliveryOption({ 
  icon: Icon, 
  title, 
  duration, 
  price, 
  freeFrom, 
  description 
}: { 
  icon: any; 
  title: string; 
  duration: string; 
  price: string; 
  freeFrom: string; 
  description: string;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A0A12F]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      <div className="relative bg-white rounded-xl p-6 border border-gray-100 hover:border-[#A0A12F]/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 group-hover:from-[#A0A12F]/20 group-hover:to-[#A0A12F]/10 transition-all duration-300">
          <Icon className="w-7 h-7 text-[#A0A12F]" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-[#172867]">
          {title}
        </h3>
        <p className="text-sm mb-4 leading-relaxed text-gray-600">
          {description}
        </p>
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Délai :</span>
            <span className="font-bold text-[#172867]">{duration}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Prix :</span>
            <span className="font-bold text-lg text-[#A0A12F]">{price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Gratuit :</span>
            <span className="font-bold text-sm text-[#A0A12F]">{freeFrom}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A0A12F]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      <div className="relative flex gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-[#A0A12F]/40 hover:shadow-lg transition-all duration-300">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center group-hover:from-[#A0A12F]/20 group-hover:to-[#A0A12F]/10 transition-all duration-300">
          <Icon className="w-6 h-6 text-[#A0A12F]" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-[#172867]">
            {title}
          </h3>
          <p className="text-base leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
