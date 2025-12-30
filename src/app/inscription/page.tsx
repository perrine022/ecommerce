/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page d'inscription avec design moderne
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Gift, Truck, Award, Heart } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [userType, setUserType] = useState<'INDIVIDUAL' | 'COMPANY'>('INDIVIDUAL');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (userType === 'COMPANY' && !formData.companyName.trim()) {
      setError('Le nom de l\'entreprise est obligatoire pour une société');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        type: userType,
        companyName: userType === 'COMPANY' ? formData.companyName : undefined,
      });
      router.push('/compte');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
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
            <div className="hidden lg:flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#172867' }}>
                    Rejoignez <span style={{ color: '#A0A12F' }}>TradeFood</span>
                  </h1>
                  <p className="text-lg leading-relaxed" style={{ color: '#172867', opacity: 0.8 }}>
                    Créez votre compte en quelques secondes et accédez à notre sélection exclusive de produits rares et authentiques.
                  </p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Gift className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Offres exclusives</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Recevez des promotions personnalisées, des nouveautés en avant-première et des offres réservées aux membres.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Truck className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Livraison rapide</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Suivez vos commandes en temps réel et bénéficiez d'une livraison gratuite dès 50€ d'achat.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Award className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Qualité garantie</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Tous nos produits sont sélectionnés avec soin, tracés jusqu'à leur origine et garantis authentiques.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Heart className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Service client dédié</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Une équipe à votre écoute pour vous accompagner dans vos achats et répondre à toutes vos questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-xl shadow-lg border p-8 lg:p-10" style={{ borderColor: '#A0A12F' }}>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-1.5" style={{ color: '#172867' }}>
                    Inscription
                  </h2>
                  <div className="mt-2 h-1 w-16 rounded-full" style={{ backgroundColor: '#A0A12F' }}></div>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type de compte */}
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Type de compte
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType('INDIVIDUAL')}
                        className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                          userType === 'INDIVIDUAL'
                            ? 'border-[#A0A12F] bg-[#A0A12F]/10'
                            : 'border-[#A0A12F]/30 bg-[#A0A12F]/5 hover:border-[#A0A12F]/50'
                        }`}
                      >
                        <User className={`w-4 h-4 ${userType === 'INDIVIDUAL' ? 'text-[#A0A12F]' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${userType === 'INDIVIDUAL' ? 'text-[#A0A12F]' : 'text-gray-600'}`}>
                          Particulier
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('COMPANY')}
                        className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${
                          userType === 'COMPANY'
                            ? 'border-[#A0A12F] bg-[#A0A12F]/10'
                            : 'border-[#A0A12F]/30 bg-[#A0A12F]/5 hover:border-[#A0A12F]/50'
                        }`}
                      >
                        <Building2 className={`w-4 h-4 ${userType === 'COMPANY' ? 'text-[#A0A12F]' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${userType === 'COMPANY' ? 'text-[#A0A12F]' : 'text-gray-600'}`}>
                          Société
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Nom de l'entreprise (si société) */}
                  {userType === 'COMPANY' && (
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                        Nom de l'entreprise <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'companyName' ? '#A0A12F' : '#172867', opacity: focusedField === 'companyName' ? 0.8 : 0.4 }} />
                        </div>
                        <input
                          type="text"
                          required={userType === 'COMPANY'}
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          onFocus={() => setFocusedField('companyName')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                          style={{ 
                            borderColor: focusedField === 'companyName' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                            color: '#172867',
                          }}
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                        {userType === 'INDIVIDUAL' ? 'Prénom' : 'Prénom du contact'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="w-4 h-4 transition-colors" style={{ color: focusedField === 'firstName' ? '#A0A12F' : '#172867', opacity: focusedField === 'firstName' ? 0.8 : 0.4 }} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                          style={{ 
                            borderColor: focusedField === 'firstName' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                            color: '#172867',
                          }}
                          placeholder="Jean"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                        {userType === 'INDIVIDUAL' ? 'Nom' : 'Nom du contact'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="w-4 h-4 transition-colors" style={{ color: focusedField === 'lastName' ? '#A0A12F' : '#172867', opacity: focusedField === 'lastName' ? 0.8 : 0.4 }} />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                          style={{ 
                            borderColor: focusedField === 'lastName' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                            color: '#172867',
                          }}
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                  </div>

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
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white"
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
                      Téléphone <span className="normal-case font-normal opacity-50">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Phone className="w-4 h-4 transition-colors" style={{ color: focusedField === 'phone' ? '#A0A12F' : '#172867', opacity: focusedField === 'phone' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'phone' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="06 12 34 56 78"
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
                    <p className="mt-1 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
                      Minimum 8 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-4 h-4 transition-colors" style={{ color: focusedField === 'confirmPassword' ? '#A0A12F' : '#172867', opacity: focusedField === 'confirmPassword' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'confirmPassword' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100/50 transition-colors"
                        style={{ color: '#172867', opacity: 0.5 }}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    style={{ backgroundColor: '#A0A12F' }}
                  >
                    {loading ? 'Inscription...' : 'S\'inscrire'}
                  </button>
                </form>

                <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(160, 161, 47, 0.2)' }}>
                  <p className="text-center text-xs" style={{ color: '#172867', opacity: 0.6 }}>
                    Déjà un compte ?{' '}
                    <Link
                      href="/connexion"
                      className="font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: '#A0A12F' }}
                    >
                      Se connecter
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

