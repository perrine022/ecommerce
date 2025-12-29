/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de détail d'un produit
 */

'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Check, Truck, Shield, RotateCcw } from 'lucide-react';
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
              <div className="relative h-[500px] w-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold" style={{ backgroundColor: '#A0A12F' }}>
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-[#A0A12F]' : 'border-transparent'
                      }`}
                    >
                      <Image src={img} alt={`${product.title} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4" style={{ color: '#172867' }}>
                  {product.title}
                </h1>
                
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
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
                    <span style={{ color: '#172867', opacity: 0.7 }}>
                      {product.rating} ({product.reviews} avis)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold" style={{ color: '#A0A12F' }}>
                  {product.price.toFixed(2)} €
                </span>
                {product.originalPrice && (
                  <span className="text-2xl line-through opacity-50" style={{ color: '#172867' }}>
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-2" style={{ color: '#172867' }}>
                  Description
                </h2>
                <p className="leading-relaxed" style={{ color: '#172867', opacity: 0.8 }}>
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              {product.details && product.details.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#172867' }}>
                    Informations produit
                  </h2>
                  <div className="space-y-2">
                    {product.details.map((detail, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium" style={{ color: '#172867', opacity: 0.7 }}>
                          {detail.label}
                        </span>
                        <span style={{ color: '#172867' }}>{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5" style={{ color: '#A0A12F' }} />
                    <span style={{ color: '#172867' }}>
                      En stock{product.stock ? ` (${product.stock} disponibles)` : ''}
                    </span>
                  </>
                ) : (
                  <span style={{ color: '#172867', opacity: 0.7 }}>Rupture de stock</span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium" style={{ color: '#172867' }}>Quantité:</span>
                  <div className="flex items-center gap-2 border-2 rounded-lg" style={{ borderColor: '#172867' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:opacity-80 transition-opacity"
                      style={{ color: '#172867' }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold" style={{ color: '#172867' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:opacity-80 transition-opacity"
                      style={{ color: '#172867' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => product && addItem(product, quantity)}
                  disabled={!product.inStock}
                  className="w-full py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#172867' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2" style={{ color: '#A0A12F' }} />
                  <p className="text-sm font-medium" style={{ color: '#172867' }}>Livraison</p>
                  <p className="text-xs" style={{ color: '#172867', opacity: 0.7 }}>Gratuite dès 50€</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: '#A0A12F' }} />
                  <p className="text-sm font-medium" style={{ color: '#172867' }}>Paiement</p>
                  <p className="text-xs" style={{ color: '#172867', opacity: 0.7 }}>Sécurisé</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 mx-auto mb-2" style={{ color: '#A0A12F' }} />
                  <p className="text-sm font-medium" style={{ color: '#172867' }}>Retours</p>
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
