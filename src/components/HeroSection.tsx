'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { getFeaturedProduct } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

export default function HeroSection() {
  const featuredProduct = getFeaturedProduct();
  const { addItem } = useCart();

  if (!featuredProduct) return null;

  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                Produit en vedette
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight" style={{ color: '#172867' }}>
              {featuredProduct.title}
            </h1>
            
            {/* Description */}
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#172867', opacity: 0.75 }}>
              {featuredProduct.description}
            </p>

            {/* Rating */}
            {featuredProduct.rating && (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(featuredProduct.rating || 0)
                          ? 'fill-[#A0A12F] text-[#A0A12F]'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#172867', opacity: 0.65 }}>
                  {featuredProduct.rating} ({featuredProduct.reviews} avis)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl md:text-5xl font-bold" style={{ color: '#A0A12F' }}>
                {featuredProduct.price.toFixed(2)} €
              </span>
              {featuredProduct.originalPrice && (
                <span className="text-lg font-medium line-through" style={{ color: '#172867', opacity: 0.45 }}>
                  {featuredProduct.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/produit/${featuredProduct.id}`}
                className="group inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#172867' }}
              >
                Voir le produit
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => featuredProduct && addItem(featuredProduct)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2 hover:opacity-90"
                style={{ borderColor: '#A0A12F', color: '#A0A12F', backgroundColor: 'transparent' }}
              >
                <ShoppingCart className="mr-2 w-4 h-4" />
                Ajouter au panier
              </button>
            </div>

            {/* Product details */}
            {featuredProduct.origin && (
              <div className="pt-4 space-y-1 text-sm" style={{ color: '#172867', opacity: 0.65 }}>
                <p><span className="font-medium">Origine:</span> {featuredProduct.origin}</p>
                {featuredProduct.weight && (
                  <p><span className="font-medium">Poids:</span> {featuredProduct.weight}</p>
                )}
              </div>
            )}
          </div>

          {/* Right side - Promotional Image */}
          <div className="relative h-[550px] lg:h-[650px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop&q=80"
              alt="Produits exotiques TradeFood"
              fill
              className="object-cover"
              priority
            />
            
            {/* Discount badge */}
            {featuredProduct.originalPrice && (
              <div className="absolute top-5 right-5 px-4 py-2 rounded-full text-white font-bold text-sm shadow-md" style={{ backgroundColor: '#A0A12F' }}>
                -{Math.round((1 - featuredProduct.price / featuredProduct.originalPrice) * 100)}%
              </div>
            )}
            
            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold tracking-wider uppercase text-white/90">
                  Produit du moment
                </p>
                <p className="text-xl font-bold text-white">
                  {featuredProduct.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
