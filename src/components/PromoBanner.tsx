/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Bannière promotionnelle hero pour les promotions et nouveautés
 */

'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="relative pt-28 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #A0A12F 0%, #172867 100%)' }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>

          <div className="relative z-10 px-8 py-10 md:py-12 lg:py-14">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-sm text-white">
                  Nouvel An 2026
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
                Promotions exceptionnelles
                <br />
                <span className="text-white/90">pour bien commencer l'année</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg mb-6 leading-relaxed text-white/90">
                Découvrez nos offres spéciales et profitez de réductions exclusives sur une sélection de produits rares et authentiques. 
                L'occasion parfaite pour découvrir de nouvelles saveurs !
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/promotions"
                  className="group inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl text-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
                >
                  <Gift className="mr-2 w-4 h-4" />
                  Voir les promotions
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/nouveautes"
                  className="group inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-white text-[#172867] transition-all duration-200 hover:opacity-90 hover:shadow-xl text-sm"
                >
                  Découvrir les nouveautés
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Features */}
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span className="text-sm font-medium">Jusqu'à -30%</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span className="text-sm font-medium">Livraison gratuite dès 50€</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span className="text-sm font-medium">Produits sélectionnés</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
            <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-20 right-40 w-24 h-24 rounded-full bg-white blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

