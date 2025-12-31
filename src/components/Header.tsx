/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Composant Header avec navigation et gestion de l'authentification
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingCart, User, Search, X as CloseIcon, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { productApi, categoryApi } from '@/services/api';
import { Product, Category } from '@/types/product';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { getItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Charger les catégories depuis le backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const backendCategories = await categoryApi.getAll();
        // Mapper les catégories du backend vers le format frontend
        const mappedCategories: Category[] = backendCategories.map((c: any) => ({
          id: c.id?.toString() || c.sellsyId?.toString() || '',
          sellsyId: c.sellsyId || c.id,
          name: c.name,
          slug: c.slug || c.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
          description: c.description,
          image: c.image,
          parentId: c.parentId,
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback sur les catégories statiques en cas d'erreur
        try {
          const { categories: staticCategories } = await import('@/lib/products');
          setCategories(staticCategories);
        } catch (importError) {
          console.error('Failed to load static categories:', importError);
        }
      }
    };
    loadCategories();
  }, []);

  // Focus sur le champ de recherche quand il s'ouvre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Fermer le dropdown en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button[aria-label="Rechercher"]')
      ) {
        setIsSearchOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button[aria-label="Menu utilisateur"]')
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isSearchOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isUserMenuOpen]);

  // Recherche avec debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await productApi.getAll({
            search: searchQuery,
            limit: 5,
          });
          setSearchResults(response.products || []);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/produit/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logotrade.png"
              alt="TradeFood"
              width={150}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - Centré */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
            {/* Nouveautés - En premier pour créer de l'urgence (FOMO) */}
            <Link 
              href="/nouveautes" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Nouveautés
            </Link>

            {/* Catégories Dropdown - Navigation principale au centre */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                className="text-sm font-medium hover:opacity-80 transition-colors flex items-center gap-1"
                style={{ color: '#172867' }}
              >
                Catégories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryMenuOpen && (
                <div 
                  className="absolute top-full left-0 pt-2 w-64"
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categorie/${category.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: '#172867' }}
                        onClick={() => setIsCategoryMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact - Support client pour rassurer */}
            <Link 
              href="/contact" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Contact
            </Link>

            {/* Société - Informations en dernier */}
            <Link 
              href="/a-propos" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Société
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search - Integrated in header */}
            <div className="relative flex items-center">
              {!isSearchOpen ? (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5 transition-transform duration-200" style={{ color: '#172867' }} />
                </button>
              ) : (
                <div 
                  ref={searchDropdownRef}
                  className="relative flex items-center animate-in fade-in slide-in-from-right-5 duration-300"
                  style={{ width: '400px' }}
                >
                  <form onSubmit={handleSearchSubmit} className="w-full">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 w-5 h-5 z-10" style={{ color: '#172867', opacity: 0.5 }} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-full border focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white transition-all duration-200"
                        style={{ 
                          borderColor: '#A0A12F',
                          color: '#172867',
                        }}
                        onBlur={(e) => {
                          // Ne fermer que si on clique en dehors du dropdown
                          if (!searchDropdownRef.current?.contains(e.relatedTarget as Node)) {
                            setTimeout(() => {
                              if (!searchQuery && searchResults.length === 0) {
                                setIsSearchOpen(false);
                              }
                            }, 200);
                          }
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            setIsSearchOpen(false);
                          }}
                          className="absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <CloseIcon className="w-4 h-4" style={{ color: '#172867', opacity: 0.5 }} />
                        </button>
                      )}
                    </div>
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {(isSearching || searchResults.length > 0 || (searchQuery.trim().length >= 2 && !isSearching)) && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-8 text-center">
                          <div className="inline-block w-6 h-6 border-2 border-[#A0A12F] border-t-transparent rounded-full animate-spin"></div>
                          <p className="mt-2 text-sm" style={{ color: '#172867', opacity: 0.6 }}>Recherche en cours...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductClick(product.id)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate" style={{ color: '#172867' }}>
                                  {product.title}
                                </h4>
                                <p className="text-sm font-bold mt-1" style={{ color: '#A0A12F' }}>
                                  {product.price.toFixed(2)} €
                                </p>
                              </div>
                            </button>
                          ))}
                          {searchQuery.trim() && (
                            <button
                              onClick={handleSearchSubmit}
                              className="w-full mt-2 p-3 rounded-lg text-sm font-medium transition-colors"
                              style={{ backgroundColor: '#A0A12F', color: 'white' }}
                            >
                              Voir tous les résultats pour "{searchQuery}"
                            </button>
                          )}
                        </div>
                      ) : searchQuery.trim().length >= 2 ? (
                        <div className="p-8 text-center">
                          <p className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>
                            Aucun résultat trouvé
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link 
              href="/panier"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" style={{ color: '#172867' }} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#A0A12F] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menu utilisateur"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0A12F', color: 'white' }}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#172867' }}>
                    {user?.firstName}
                  </span>
                  <svg className="w-4 h-4 transition-transform" style={{ color: '#172867', transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold" style={{ color: '#172867' }}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#172867', opacity: 0.6 }}>
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/compte"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      style={{ color: '#172867' }}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Mon compte</span>
                    </Link>
                    <Link
                      href="/compte"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      style={{ color: '#172867' }}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Paramètres</span>
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          try {
                            await logout();
                            router.push('/');
                          } catch (error) {
                            console.error('Error during logout:', error);
                            router.push('/');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                        style={{ color: '#A0A12F' }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/connexion"
                className="hidden md:flex items-center justify-center px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5" style={{ color: '#172867' }} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: '#172867' }}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-6 space-y-4">
            {/* Nouveautés - En premier pour créer de l'urgence */}
            <Link 
              href="/nouveautes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Nouveautés
            </Link>

            {/* Catégories - Navigation principale */}
            <div className="space-y-2">
              <div className="text-sm font-semibold mb-2" style={{ color: '#A0A12F' }}>
                Catégories
              </div>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorie/${category.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block pl-4 text-base"
                  style={{ color: '#172867' }}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Contact - Support client */}
            <Link 
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Contact
            </Link>

            {/* Société - Informations en dernier */}
            <Link 
              href="/a-propos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Société
            </Link>

            <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
              <Link 
                href="/panier"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium"
                style={{ color: '#172867' }}
              >
                <ShoppingCart className="w-5 h-5" />
                Panier
              </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/compte"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium"
                  style={{ color: '#172867' }}
                >
                  <User className="w-5 h-5" />
                  Mon Compte ({user?.firstName})
                </Link>
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    try {
                      await logout();
                      router.push('/');
                    } catch (error) {
                      console.error('Error during logout:', error);
                      router.push('/');
                    }
                  }}
                  className="flex items-center gap-2 text-base font-medium"
                  style={{ color: '#A0A12F' }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link 
                href="/connexion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium"
                style={{ color: '#172867' }}
              >
                <User className="w-5 h-5" />
                Se connecter
              </Link>
            )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
