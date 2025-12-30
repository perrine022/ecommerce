/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de résultats de recherche
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Search, ArrowLeft } from 'lucide-react';
import { productApi } from '@/services/api';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (query) {
      loadSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const loadSearchResults = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAll({
        search: query,
        limit: 50,
      });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to load search results:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            style={{ color: '#172867' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>

          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#172867' }}>
              Résultats de recherche
            </h1>
            {query && (
              <p className="text-lg" style={{ color: '#172867', opacity: 0.7 }}>
                {loading ? (
                  'Recherche en cours...'
                ) : products.length > 0 ? (
                  <>
                    {products.length} {products.length === 1 ? 'produit trouvé' : 'produits trouvés'} pour "{query}"
                  </>
                ) : (
                  <>Aucun produit trouvé pour "{query}"</>
                )}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#A0A12F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/produit/${product.id}`} className="group">
                  <div className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:border-[#A0A12F]" style={{ borderColor: '#A0A12F' }}>
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
                          style={{ backgroundColor: '#A0A12F', color: 'white' }}
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#172867', opacity: 0.3 }} />
              <p className="text-lg mb-2" style={{ color: '#172867' }}>
                Aucun résultat trouvé
              </p>
              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                Essayez avec d'autres mots-clés
              </p>
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#172867', opacity: 0.3 }} />
              <p className="text-lg mb-2" style={{ color: '#172867' }}>
                Recherchez un produit
              </p>
              <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                Utilisez la barre de recherche dans le header
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#A0A12F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

