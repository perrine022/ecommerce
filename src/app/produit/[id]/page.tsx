/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de détail d'un produit
 */

'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Check, Truck, Shield, RotateCcw, Package, Globe, Ruler, Weight, Award, Info } from 'lucide-react';
import { productApi } from '@/services/api';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await productApi.getById(id);
      setProduct(response.product);
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 px-4 flex items-center justify-center min-h-[60vh]">
          <p style={{ color: '#172867' }}>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#172867' }}>Produit non trouvé</h1>
            <Link href="/" className="text-lg" style={{ color: '#A0A12F' }}>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            style={{ color: '#172867' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] md:h-[600px] w-full rounded-xl overflow-hidden bg-gray-100 shadow-lg border" style={{ borderColor: '#A0A12F' }}>
                <Image
                  src={images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                />
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold shadow-lg" style={{ backgroundColor: '#A0A12F' }}>
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-white font-semibold shadow-lg flex items-center gap-2" style={{ backgroundColor: '#172867' }}>
                    <Award className="w-4 h-4" />
                    Vedette
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 md:h-28 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        selectedImage === index 
                          ? 'border-[#A0A12F] shadow-md ring-2 ring-[#A0A12F] ring-opacity-30' 
                          : 'border-gray-200 hover:border-[#A0A12F] hover:border-opacity-50'
                      }`}
                    >
                      <Image 
                        src={img} 
                        alt={`${product.title} ${index + 1}`} 
                        fill 
                        className="object-cover" 
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-[#A0A12F] bg-opacity-10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header with title and rating */}
              <div>
                {product.featured && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-sm font-semibold" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                    <Award className="w-4 h-4" />
                    Produit vedette
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: '#172867' }}>
                  {product.title}
                </h1>
                
                {product.rating && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-[#A0A12F] text-[#A0A12F]'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium" style={{ color: '#172867', opacity: 0.8 }}>
                      {product.rating.toFixed(1)}
                    </span>
                    {product.reviews && (
                      <span className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>
                        ({product.reviews} {product.reviews === 1 ? 'avis' : 'avis'})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-[#A0A12F]/5 to-transparent rounded-xl p-6 border" style={{ borderColor: '#A0A12F' }}>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl md:text-4xl font-bold" style={{ color: '#A0A12F' }}>
                    {product.price.toFixed(2)} €
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg line-through opacity-50" style={{ color: '#172867' }}>
                        {product.originalPrice.toFixed(2)} €
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#A0A12F' }}>
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs mt-2" style={{ color: '#172867', opacity: 0.6 }}>
                  Prix TTC
                </p>
              </div>

              {/* Stock Status */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${product.inStock ? 'bg-green-50' : 'bg-red-50'}`}>
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5" style={{ color: '#A0A12F' }} />
                    <div>
                      <span className="font-semibold block" style={{ color: '#172867' }}>
                        En stock
                      </span>
                      {product.stock && (
                        <span className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                          {product.stock} {product.stock === 1 ? 'article disponible' : 'articles disponibles'}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-red-500 font-semibold">Rupture de stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#172867' }}>
                  <Info className="w-5 h-5" style={{ color: '#A0A12F' }} />
                  Description
                </h2>
                <p className="leading-relaxed text-base whitespace-pre-line" style={{ color: '#172867', opacity: 0.8 }}>
                  {product.description}
                </p>
              </div>

              {/* Product Specifications */}
              {(product.origin || product.weight || product.dimensions || (product.details && product.details.length > 0)) && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#172867' }}>
                    <Package className="w-5 h-5" style={{ color: '#A0A12F' }} />
                    Caractéristiques
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {product.origin && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                        <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#A0A12F' }} />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#172867', opacity: 0.6 }}>
                            Origine
                          </p>
                          <p className="font-medium" style={{ color: '#172867' }}>
                            {product.origin}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                        <Weight className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#A0A12F' }} />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#172867', opacity: 0.6 }}>
                            Poids
                          </p>
                          <p className="font-medium" style={{ color: '#172867' }}>
                            {product.weight}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                        <Ruler className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#A0A12F' }} />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#172867', opacity: 0.6 }}>
                            Dimensions
                          </p>
                          <p className="font-medium" style={{ color: '#172867' }}>
                            {product.dimensions}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Details */}
                  {product.details && product.details.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {product.details.map((detail, index) => (
                        <div key={index} className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50 border border-gray-100">
                          <span className="font-medium text-sm" style={{ color: '#172867', opacity: 0.8 }}>
                            {detail.label}
                          </span>
                          <span className="font-semibold" style={{ color: '#172867' }}>
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                {/* Total Amount - More Visible */}
                {product.inStock && (
                  <div className="bg-gradient-to-br from-[#A0A12F]/10 to-transparent rounded-xl p-6 border-2" style={{ borderColor: '#A0A12F' }}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-semibold" style={{ color: '#172867' }}>Total :</span>
                      <span className="text-3xl md:text-4xl font-bold" style={{ color: '#A0A12F' }}>
                        {(product.price * quantity).toFixed(2)} €
                      </span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#172867', opacity: 0.6 }}>
                      {quantity} {quantity === 1 ? 'article' : 'articles'} × {product.price.toFixed(2)} €
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg" style={{ color: '#172867' }}>Quantité</span>
                  <div className="flex items-center gap-3 border rounded-lg" style={{ borderColor: '#A0A12F' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-[#A0A12F]/10 transition-colors rounded-l-lg"
                      style={{ color: '#172867' }}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-bold text-lg min-w-[60px] text-center" style={{ color: '#172867' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-[#A0A12F]/10 transition-colors rounded-r-lg"
                      style={{ color: '#172867' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => product && addItem(product, quantity)}
                  disabled={!product.inStock}
                  className="w-auto mx-auto px-8 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                  style={{ backgroundColor: '#A0A12F' }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
                    <Truck className="w-6 h-6" style={{ color: '#A0A12F' }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#172867' }}>Livraison</p>
                  <p className="text-xs" style={{ color: '#172867', opacity: 0.7 }}>Gratuite dès 50€</p>
                </div>
                <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
                    <Shield className="w-6 h-6" style={{ color: '#A0A12F' }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#172867' }}>Paiement</p>
                  <p className="text-xs" style={{ color: '#172867', opacity: 0.7 }}>Sécurisé</p>
                </div>
                <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.1 }}>
                    <RotateCcw className="w-6 h-6" style={{ color: '#A0A12F' }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#172867' }}>Retours</p>
                  <p className="text-xs" style={{ color: '#172867', opacity: 0.7 }}>14 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
