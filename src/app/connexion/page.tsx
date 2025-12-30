/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de connexion avec design moderne
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, Shield, Zap, Star, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Marketing content */}
            <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in-left animation-delay-100">
                <div className="space-y-6">
                  <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#172867' }}>
                      Bienvenue sur <span style={{ color: '#A0A12F' }}>TradeFood</span>
                    </h1>
                    <p className="text-lg leading-relaxed" style={{ color: '#172867', opacity: 0.8 }}>
                      Reconnectez-vous à votre compte et accédez à tous vos avantages exclusifs en quelques clics.
                    </p>
                  </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-200 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Zap className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Accès instantané</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Retrouvez toutes vos commandes, suivez vos livraisons en temps réel et gérez votre profil en toute simplicité.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-300 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Shield className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Sécurité garantie</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Vos données sont protégées par un cryptage de niveau bancaire. Vos informations sont en sécurité.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-400 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Star className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Expérience premium</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Bénéficiez d'offres exclusives, de promotions personnalisées et d'un service client dédié.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-right animation-delay-200">
              <div className="bg-white rounded-xl shadow-lg border p-8 lg:p-10 transition-all duration-500 hover:shadow-xl" style={{ borderColor: '#A0A12F' }}>
                <div className="mb-8 animate-fade-in-up">
                  <h2 className="text-2xl font-semibold mb-1.5" style={{ color: '#172867' }}>
                    Connexion
                  </h2>
                  <div className="mt-2 h-1 w-16 rounded-full transition-all duration-500 hover:w-24" style={{ backgroundColor: '#A0A12F' }}></div>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-4 h-4 transition-colors" style={{ color: focusedField === 'email' ? '#A0A12F' : '#172867', opacity: focusedField === 'email' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'email' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-4 h-4 transition-colors" style={{ color: focusedField === 'password' ? '#A0A12F' : '#172867', opacity: focusedField === 'password' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'password' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100/50 transition-colors"
                        style={{ color: '#172867', opacity: 0.5 }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-end">
                      <Link
                        href="/reset-password"
                        className="text-xs font-medium hover:opacity-80 transition-opacity"
                        style={{ color: '#A0A12F' }}
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-6 animate-fade-in-up animation-delay-500"
                    style={{ backgroundColor: '#A0A12F' }}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </button>
                </form>

                <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(160, 161, 47, 0.2)' }}>
                  <p className="text-center text-xs" style={{ color: '#172867', opacity: 0.6 }}>
                    Pas encore de compte ?{' '}
                    <Link
                      href="/inscription"
                      className="font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: '#A0A12F' }}
                    >
                      S'inscrire
                    </Link>
                  </p>
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

