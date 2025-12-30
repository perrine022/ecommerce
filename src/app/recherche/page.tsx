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
                  <div className="bg-white rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-[#A0A12F] hover:-translate-y-1" style={{ borderColor: '#A0A12F', opacity: 0.3 }}>
                    <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg" style={{ backgroundColor: '#A0A12F' }}>
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg" style={{ backgroundColor: '#172867' }}>
                          ⭐ Vedette
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:opacity-80 transition-opacity" style={{ color: '#172867' }}>
                        {product.title}
                      </h3>
                      <p className="text-sm mb-4 flex-1 line-clamp-2 leading-relaxed" style={{ color: '#172867', opacity: 0.7 }}>
                        {product.description}
                      </p>
                      {product.rating && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 0)
                                    ? 'fill-[#A0A12F] text-[#A0A12F]'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium" style={{ color: '#172867', opacity: 0.6 }}>
                            {product.rating.toFixed(1)} ({product.reviews})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold" style={{ color: '#A0A12F' }}>
                            {product.price.toFixed(2)} €
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs line-through mt-0.5 opacity-50" style={{ color: '#172867' }}>
                              {product.originalPrice.toFixed(2)} €
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                          }}
                          disabled={!product.inStock}
                          className="p-3 rounded-full hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

