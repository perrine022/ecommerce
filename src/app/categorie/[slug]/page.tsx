'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { getProductsByCategory, categories } from '@/lib/products';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = categories.find(c => c.slug === slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#172867' }}>Catégorie non trouvée</h1>
            <Link href="/" className="text-lg" style={{ color: '#A0A12F' }}>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
          style={{ color: '#172867' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#172867' }}>
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg" style={{ color: '#172867', opacity: 0.7 }}>
              {category.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#172867', opacity: 0.7 }}>
              Aucun produit dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Link href={`/produit/${product.id}`} className="group">
      <div className="bg-white rounded-lg border-2 border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2" style={{ color: '#172867' }}>
            {product.title}
          </h3>
          <p className="text-sm mb-4 flex-1 line-clamp-2" style={{ color: '#172867', opacity: 0.7 }}>
            {product.description}
          </p>
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

