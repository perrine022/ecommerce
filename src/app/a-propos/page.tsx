/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page À propos
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Heart, Award, Users, Globe, Target, Shield } from 'lucide-react';

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section avec animation */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A0A12F]/5 via-transparent to-transparent"></div>
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#172867] to-[#A0A12F] bg-clip-text text-transparent">
                À propos de <span className="text-[#A0A12F]">TradeFood</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Votre spécialiste en produits rares et authentiques du monde entier
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Notre Histoire */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                <span className="text-[#172867]">Notre </span>
                <span className="text-[#A0A12F]">Histoire</span>
              </h2>
            </ScrollReveal>
            
            <div className="space-y-8">
              <ScrollReveal delay={100}>
                <div className="group">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#A0A12F]/30">
                    <p className="text-lg leading-relaxed text-gray-700">
                      Fondée avec passion pour les saveurs authentiques, <strong className="text-[#A0A12F]">TradeFood</strong> est née de la volonté 
                      de partager les trésors culinaires du monde entier. Nous parcourons la planète pour dénicher les 
                      produits les plus rares et les plus savoureux, garantissant à nos clients une expérience gustative unique.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="group">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#A0A12F]/30">
                    <p className="text-lg leading-relaxed text-gray-700">
                      Notre engagement envers la qualité et l'authenticité nous guide dans chaque sélection. Nous travaillons 
                      directement avec des producteurs locaux et des artisans passionnés, assurant ainsi la traçabilité et 
                      la fraîcheur de chaque produit.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="group">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#A0A12F]/30">
                    <p className="text-lg leading-relaxed text-gray-700">
                      Chez <strong className="text-[#A0A12F]">TradeFood</strong>, nous croyons que chaque produit raconte une histoire. C'est pourquoi nous mettons un 
                      point d'honneur à vous faire découvrir l'origine, les méthodes de production et les traditions qui 
                      entourent chacun de nos produits.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A0A12F]/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
                <span className="text-[#172867]">Nos </span>
                <span className="text-[#A0A12F]">Valeurs</span>
              </h2>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScrollReveal delay={0}>
                <ValueCard
                  icon={Heart}
                  title="Passion"
                  description="Notre amour pour les produits authentiques guide chaque sélection et chaque décision."
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <ValueCard
                  icon={Award}
                  title="Qualité"
                  description="Nous ne proposons que des produits de la plus haute qualité, rigoureusement sélectionnés."
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <ValueCard
                  icon={Shield}
                  title="Traçabilité"
                  description="Chaque produit est tracé jusqu'à son origine, garantissant authenticité et fraîcheur."
                />
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <ValueCard
                  icon={Users}
                  title="Service Client"
                  description="Votre satisfaction est notre priorité. Notre équipe est toujours à votre écoute."
                />
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <ValueCard
                  icon={Globe}
                  title="Durabilité"
                  description="Nous privilégions des pratiques respectueuses de l'environnement et des producteurs."
                />
              </ScrollReveal>
              <ScrollReveal delay={500}>
                <ValueCard
                  icon={Target}
                  title="Excellence"
                  description="Nous visons l'excellence dans chaque aspect de notre activité, de la sélection à la livraison."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Notre Mission */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                <span className="text-[#172867]">Notre </span>
                <span className="text-[#A0A12F]">Mission</span>
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#A0A12F]/20 to-[#172867]/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100">
                  <p className="text-lg leading-relaxed text-center text-gray-700">
                    Notre mission est de rendre accessibles les saveurs les plus rares et authentiques du monde entier, 
                    tout en respectant les producteurs et l'environnement. Nous souhaitons vous faire voyager à travers 
                    les saveurs et découvrir des produits exceptionnels qui enrichiront votre quotidien.
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

function ValueCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
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
        <p className="text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
