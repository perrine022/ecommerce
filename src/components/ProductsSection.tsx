'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { products, categories } from '@/lib/products';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#172867' }}>
            Nos Produits Exotiques
          </h2>
          <p className="text-lg" style={{ color: '#172867', opacity: 0.7 }}>
            Découvrez notre sélection de produits rares et authentiques du monde entier
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === 'all'
                ? 'text-white'
                : 'border-2'
            }`}
            style={
              selectedCategory === 'all'
                ? { backgroundColor: '#172867' }
                : { borderColor: '#172867', color: '#172867' }
            }
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.slug
                  ? 'text-white'
                  : 'border-2'
              }`}
              style={
                selectedCategory === category.slug
                  ? { backgroundColor: '#172867' }
                  : { borderColor: '#172867', color: '#172867' }
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Link href={`/produit/${product.id}`} className="group">
      <div className="bg-white rounded-lg border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: '#A0A12F' }}>
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Rupture de stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: '#172867' }}>
            {product.title}
          </h3>
          
          <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: '#172867', opacity: 0.7 }}>
            {product.description}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-[#A0A12F] text-[#A0A12F]'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: '#172867', opacity: 0.6 }}>
                ({product.reviews})
              </span>
            </div>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div>
              <span className="text-xl font-bold" style={{ color: '#A0A12F' }}>
                {product.price.toFixed(2)} €
              </span>
              {product.originalPrice && (
                <span className="text-sm line-through ml-2 opacity-50" style={{ color: '#172867' }}>
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="p-2 rounded-full hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#172867', color: 'white' }}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

