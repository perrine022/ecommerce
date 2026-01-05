/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Contexte de gestion du panier d'achat avec synchronisation backend
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, Product } from '@/types/product';
import { cartApi } from '@/services/api';

// Fonction de mapping pour les produits du panier (identique à celle de l'API)
function mapBackendProductToFrontend(backendProduct: any): Product {
  const cleanDescription = backendProduct.description
    ? backendProduct.description.replace(/<br\s*\/?>/gi, '\n').trim()
    : '';

  return {
    id: backendProduct.id || backendProduct.sellsyId?.toString(),
    title: backendProduct.name || backendProduct.title || 'Produit sans nom',
    description: cleanDescription || backendProduct.description || '',
    price: parseFloat(
      backendProduct.referencePrice ||
        backendProduct.referencePriceTaxesInc ||
        backendProduct.price ||
        '0'
    ),
    originalPrice: undefined,
    image:
      backendProduct.imageUrl ||
      backendProduct.image ||
      'https://via.placeholder.com/400',
    images:
      backendProduct.images ||
      (backendProduct.imageUrl ? [backendProduct.imageUrl] : []),
    category:
      backendProduct.categoryId?.toString() || backendProduct.category || '1',
    inStock: !backendProduct.isArchived && !backendProduct.isDeclined,
    stock: backendProduct.stock || undefined,
    rating: backendProduct.rating || undefined,
    reviews: backendProduct.reviews || undefined,
    featured: backendProduct.featured || backendProduct.isFeatured || false,
    origin: backendProduct.origin || undefined,
    weight: backendProduct.weight || undefined,
    dimensions: backendProduct.dimensions || undefined,
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tradfood_cart';

// Fonction pour sauvegarder le panier dans localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
};

// Fonction pour charger le panier depuis localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }
  return [];
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger le panier au démarrage
  useEffect(() => {
    const checkAuthAndLoadCart = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        // Utilisateur connecté : charger depuis le backend
        await loadCart();
      } else {
        // Utilisateur non connecté : charger depuis localStorage
        const localCart = loadCartFromStorage();
        setItems(localCart);
      }
    };

    checkAuthAndLoadCart();

    // Écouter les changements de localStorage pour le token
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        await checkAuthAndLoadCart();
      }
    };

    // Écouter l'événement de déconnexion personnalisé
    const handleLogout = () => {
      // Vider le panier et localStorage
      setItems([]);
      saveCartToStorage([]);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_logout', handleLogout);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_logout', handleLogout);
    };
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await cartApi.getCart();
      // Vérifier que la réponse contient des items
      if (!response || !response.items || !Array.isArray(response.items)) {
        console.warn('Cart response is invalid or empty:', response);
        setItems([]);
        saveCartToStorage([]);
        return;
      }
      
      // Convertir les items du backend en CartItem
      // Les produits du backend doivent être mappés vers le format frontend
      const cartItems: CartItem[] = response.items.map((item: any) => {
        // Mapper le produit du backend vers le format frontend
        const product = item.product?.name 
          ? mapBackendProductToFrontend(item.product) 
          : item.product; // Si déjà au format frontend, on l'utilise tel quel
        return {
          product: product,
          quantity: item.quantity || 1,
        };
      });
      setItems(cartItems);
      // Sauvegarder aussi dans localStorage pour la persistance
      saveCartToStorage(cartItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
      // En cas d'erreur, essayer de charger depuis localStorage
      const localCart = loadCartFromStorage();
      setItems(localCart);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: Product, quantity: number = 1) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      try {
        await cartApi.addItem(product.id, quantity);
        await loadCart();
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        // Fallback local en cas d'erreur
        setItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.product.id === product.id);
          let updatedItems: CartItem[];
          if (existingItem) {
            updatedItems = prevItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedItems = [...prevItems, { product, quantity }];
          }
          saveCartToStorage(updatedItems);
          return updatedItems;
        });
      }
    } else {
      // Panier local si non connecté - sauvegarder dans localStorage
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.product.id === product.id);
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedItems = [...prevItems, { product, quantity }];
        }
        saveCartToStorage(updatedItems);
        return updatedItems;
      });
    }
  };

  const removeItem = async (productId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      try {
        await cartApi.removeItem(productId);
        await loadCart();
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        // Fallback local
        setItems((prevItems) => {
          const updatedItems = prevItems.filter((item) => item.product.id !== productId);
          saveCartToStorage(updatedItems);
          return updatedItems;
        });
      }
    } else {
      setItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.product.id !== productId);
        saveCartToStorage(updatedItems);
        return updatedItems;
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      try {
        await cartApi.updateQuantity(productId, quantity);
        await loadCart();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        // Fallback local
        setItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          saveCartToStorage(updatedItems);
          return updatedItems;
        });
      }
    } else {
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        saveCartToStorage(updatedItems);
        return updatedItems;
      });
    }
  };

  const clearCart = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      try {
        await cartApi.clearCart();
        setItems([]);
        saveCartToStorage([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        setItems([]);
        saveCartToStorage([]);
      }
    } else {
      setItems([]);
      saveCartToStorage([]);
    }
  }, []);

  const getTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
