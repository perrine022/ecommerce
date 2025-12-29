/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Contexte de gestion du panier d'achat avec synchronisation backend
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types/product';
import { cartApi } from '@/services/api';

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger le panier depuis le backend si l'utilisateur est connecté
  useEffect(() => {
    const checkAuthAndLoadCart = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        loadCart();
      } else {
        setItems([]);
      }
    };

    checkAuthAndLoadCart();

    // Écouter les changements de localStorage pour le token
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        checkAuthAndLoadCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await cartApi.getCart();
      // Convertir les items du backend en CartItem
      const cartItems: CartItem[] = response.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
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
          if (existingItem) {
            return prevItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prevItems, { product, quantity }];
        });
      }
    } else {
      // Panier local si non connecté
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.product.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { product, quantity }];
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
        setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      }
    } else {
      setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
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
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      try {
        await cartApi.clearCart();
        setItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

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
