/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Section produits avec recherche, filtres et pagination
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import { categories } from '@/lib/products';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { productApi } from '@/services/api';

export default function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    order: 'asc' as 'asc' | 'desc',
  });

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: 1,
        limit: 20,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (filters.minPrice) {
        params.minPrice = parseFloat(filters.minPrice);
      }

      if (filters.maxPrice) {
        params.maxPrice = parseFloat(filters.maxPrice);
      }

      params.sortBy = filters.sortBy;
      params.order = filters.order;

      const response = await productApi.getAll(params);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-white" id="produits">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#172867' }}>
            Nos <span style={{ color: '#A0A12F' }}>Produits</span>
          </h2>
          <p className="text-lg" style={{ color: '#172867', opacity: 0.7 }}>
            Découvrez notre sélection de produits rares et authentiques du monde entier
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#172867', opacity: 0.5 }} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1"
                style={{ borderColor: '#172867', color: '#172867' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-lg font-semibold border transition-all hover:opacity-80 flex items-center gap-2"
              style={{ borderColor: '#A0A12F', color: '#A0A12F' }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg border p-6 grid md:grid-cols-4 gap-4" style={{ borderColor: '#A0A12F', opacity: 0.2 }}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Prix min (€)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1"
                  style={{ borderColor: '#172867', color: '#172867' }}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Prix max (€)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1"
                  style={{ borderColor: '#172867', color: '#172867' }}
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1"
                  style={{ borderColor: '#172867', color: '#172867' }}
                >
                  <option value="name">Nom</option>
                  <option value="price">Prix</option>
                  <option value="rating">Note</option>
                  <option value="createdAt">Date</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                  Ordre
                </label>
                <select
                  value={filters.order}
                  onChange={(e) => setFilters({ ...filters, order: e.target.value as 'asc' | 'desc' })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1"
                  style={{ borderColor: '#172867', color: '#172867' }}
                >
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedCategory === 'all'
                ? 'text-white'
                : 'border'
            }`}
            style={
              selectedCategory === 'all'
                ? { backgroundColor: '#A0A12F' }
                : { borderColor: '#A0A12F', color: '#A0A12F' }
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
                  : 'border'
              }`}
              style={
                selectedCategory === category.slug
                  ? { backgroundColor: '#A0A12F' }
                  : { borderColor: '#A0A12F', color: '#A0A12F' }
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: '#172867', opacity: 0.7 }}>Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: '#172867', opacity: 0.7 }}>
              Aucun produit trouvé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Link href={`/produit/${product.id}`} className="group">
      <div className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:border-[#A0A12F]" style={{ borderColor: '#A0A12F' }}>
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
              style={{ backgroundColor: '#A0A12F', color: 'white' }}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
