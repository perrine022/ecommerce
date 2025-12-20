'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logotrade.png"
              alt="TradeFood"
              width={150}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Catégories Dropdown */}
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
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
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
              )}
            </div>

            <Link 
              href="/societe" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Société
            </Link>

            <Link 
              href="/contact" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Contact
            </Link>

            <Link 
              href="/promotions" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Promotions
            </Link>

            <Link 
              href="/nouveautes" 
              className="text-sm font-medium hover:opacity-80 transition-colors"
              style={{ color: '#172867' }}
            >
              Nouveautés
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5" style={{ color: '#172867' }} />
            </button>

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
            <Link 
              href="/compte"
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5" style={{ color: '#172867' }} />
            </Link>

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
            {/* Catégories */}
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

            <Link 
              href="/societe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Société
            </Link>

            <Link 
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Contact
            </Link>

            <Link 
              href="/promotions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Promotions
            </Link>

            <Link 
              href="/nouveautes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium"
              style={{ color: '#172867' }}
            >
              Nouveautés
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
              <Link 
                href="/compte"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium"
                style={{ color: '#172867' }}
              >
                <User className="w-5 h-5" />
                Mon Compte
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
