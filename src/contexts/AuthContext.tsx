/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Contexte d'authentification pour gérer l'état de l'utilisateur connecté
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/user';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      // GET /api/v1/users/me retourne directement l'objet User
      setUser(response.user || response);
    } catch (error) {
      console.error('Failed to get current user:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('auth_token', response.token);
    // Récupérer les infos utilisateur après connexion
    const userResponse = await authApi.getCurrentUser();
    setUser(userResponse.user || userResponse);
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    localStorage.setItem('auth_token', response.token);
    // Récupérer les infos utilisateur après inscription
    const userResponse = await authApi.getCurrentUser();
    setUser(userResponse.user || userResponse);
  };

  const logout = async () => {
    try {
      // Vider le panier côté backend avant de déconnecter (si connecté)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token) {
        try {
          const { cartApi } = await import('@/services/api');
          await cartApi.clearCart();
        } catch (error) {
          console.error('Failed to clear cart on logout:', error);
          // Continue même si la suppression du panier échoue
        }
      }
    } catch (error) {
      console.error('Error during logout cart clearing:', error);
    } finally {
      // Supprimer les tokens
      authApi.logout();
      // Réinitialiser l'état utilisateur
      setUser(null);
      // Nettoyer le localStorage complètement
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        // Déclencher un événement personnalisé pour que le CartContext vide le panier
        window.dispatchEvent(new CustomEvent('auth_logout'));
      }
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

