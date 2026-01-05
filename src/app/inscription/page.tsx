/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page d'inscription avec design moderne
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff, Mail, Lock, User, Phone, Gift, Truck, Award, Heart, Building2, Loader2 } from 'lucide-react';
import { authApi } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    siret: '',
    vatNumber: '',
    rcs: '',
    legalForm: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validatingSiret, setValidatingSiret] = useState(false);
  const [siretValid, setSiretValid] = useState<boolean | null>(null);
  const [siretError, setSiretError] = useState('');

  const validateSiret = useCallback(async (siret: string) => {
    setValidatingSiret(true);
    setSiretError('');
    setSiretValid(null);

    try {
      const data = await authApi.validateSirene(siret);
      // Remplir automatiquement les champs
      setFormData(prev => ({
        ...prev,
        companyName: data.name || prev.companyName,
      }));
      setSiretValid(true);
      setSiretError('');
    } catch (err: any) {
      setSiretValid(false);
      // Afficher un message générique pour les erreurs 400/404 (entreprise non trouvée ou invalide)
      if (err.status === 400 || err.status === 404) {
        setSiretError('L\'entreprise n\'est pas valide');
      } else {
        setSiretError('Erreur lors de la validation du SIRET');
      }
    } finally {
      setValidatingSiret(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Vérifier que le SIRET est valide (14 chiffres)
    const siretDigits = formData.siret.replace(/\D/g, '');
    if (siretDigits.length !== 14) {
      setError('Le SIRET doit contenir 14 chiffres');
      return;
    }

    if (siretValid === false) {
      setError('Impossible de s\'inscrire : la société n\'existe pas dans la base SIRENE');
      return;
    }

    if (siretValid === null || validatingSiret) {
      setError('Veuillez attendre la validation du SIRET');
      return;
    }

    if (!formData.companyName.trim()) {
      setError('Le nom de la société est obligatoire');
      return;
    }

    if (!formData.vatNumber.trim()) {
      setError('Le numéro TVA est obligatoire');
      return;
    }

    if (formData.vatNumber.trim().length !== 15) {
      setError('Le numéro TVA doit contenir exactement 15 caractères');
      return;
    }

    if (!formData.rcs.trim()) {
      setError('Le RCS est obligatoire');
      return;
    }

    if (!formData.legalForm.trim()) {
      setError('La forme juridique est obligatoire');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.companyName, // On utilise companyName comme firstName pour le backend
        lastName: '', // Pas de lastName pour une société
        phone: formData.phone || undefined,
        type: 'COMPANY',
        companyName: formData.companyName,
        siret: formData.siret,
        vatNumber: formData.vatNumber,
        rcs: formData.rcs,
        legalForm: formData.legalForm,
      });
      router.push('/inscription/confirmation');
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
            <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in-left animation-delay-100">
                <div className="space-y-6">
                  <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#172867' }}>
                      Rejoignez <span style={{ color: '#A0A12F' }}>TradeFood</span>
                    </h1>
                    <p className="text-lg leading-relaxed" style={{ color: '#172867', opacity: 0.8 }}>
                      Créez votre compte en quelques secondes et accédez à notre sélection exclusive de produits rares et authentiques.
                    </p>
                  </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-200 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Gift className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Offres exclusives</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Recevez des promotions personnalisées, des nouveautés en avant-première et des offres réservées aux membres.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-300 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Truck className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Livraison rapide</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Suivez vos commandes en temps réel et bénéficiez d'une livraison gratuite dès 50€ d'achat.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-400 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                      <Award className="w-6 h-6" style={{ color: '#A0A12F' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: '#172867' }}>Qualité garantie</h3>
                      <p className="text-sm" style={{ color: '#172867', opacity: 0.7 }}>
                        Tous nos produits sont sélectionnés avec soin, tracés jusqu'à leur origine et garantis authentiques.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 animate-fade-in-up animation-delay-500 hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
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
            <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-right animation-delay-200">
              <div className="bg-white rounded-xl shadow-lg border p-8 lg:p-10 transition-all duration-500 hover:shadow-xl" style={{ borderColor: '#A0A12F' }}>
                <div className="mb-8 animate-fade-in-up">
                  <h2 className="text-2xl font-semibold mb-1.5" style={{ color: '#172867' }}>
                    Inscription
                  </h2>
                  <div className="mt-2 h-1 w-16 rounded-full transition-all duration-500 hover:w-24" style={{ backgroundColor: '#A0A12F' }}></div>
                </div>

                {error && (
                  <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Champ SIRET */}
                  <div className="animate-fade-in-up animation-delay-300">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      SIRET <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'siret' ? '#A0A12F' : '#172867', opacity: focusedField === 'siret' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.siret}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 14);
                          setFormData({ ...formData, siret: value });
                        }}
                        onFocus={() => setFocusedField('siret')}
                        onBlur={(e) => {
                          setFocusedField(null);
                          // Valider le SIRET si 14 chiffres sont saisis
                          const siretDigits = formData.siret.replace(/\D/g, '');
                          if (siretDigits.length === 14) {
                            validateSiret(siretDigits);
                          } else {
                            setSiretValid(null);
                            setSiretError('');
                          }
                        }}
                        className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: siretValid === false 
                            ? '#ef4444' 
                            : siretValid === true 
                            ? '#10b981' 
                            : focusedField === 'siret' 
                            ? '#A0A12F' 
                            : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="12345678901234"
                        maxLength={14}
                      />
                      {validatingSiret && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#A0A12F' }} />
                        </div>
                      )}
                      {!validatingSiret && siretValid === true && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-4 h-4" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      {!validatingSiret && siretValid === false && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-4 h-4" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {siretError && (
                      <p className="mt-1 text-xs text-red-600">{siretError}</p>
                    )}
                    {siretValid === true && (
                      <p className="mt-1 text-xs" style={{ color: '#10b981' }}>Société validée</p>
                    )}
                    <p className="mt-1 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
                      14 chiffres requis
                    </p>
                  </div>

                  {/* Champ Numéro TVA */}
                  <div className="animate-fade-in-up animation-delay-350">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Numéro TVA <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'vatNumber' ? '#A0A12F' : '#172867', opacity: focusedField === 'vatNumber' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.vatNumber}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 15);
                          setFormData({ ...formData, vatNumber: value });
                        }}
                        onFocus={() => setFocusedField('vatNumber')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'vatNumber' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="FR12345678901"
                        maxLength={15}
                      />
                    </div>
                    <p className="mt-1 text-xs" style={{ color: '#172867', opacity: 0.5 }}>
                      15 caractères requis
                    </p>
                  </div>

                  {/* Champ RCS */}
                  <div className="animate-fade-in-up animation-delay-400">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      RCS <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'rcs' ? '#A0A12F' : '#172867', opacity: focusedField === 'rcs' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.rcs}
                        onChange={(e) => setFormData({ ...formData, rcs: e.target.value })}
                        onFocus={() => setFocusedField('rcs')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'rcs' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="RCS Paris B 123 456 789"
                      />
                    </div>
                  </div>

                  {/* Champ Forme juridique */}
                  <div className="animate-fade-in-up animation-delay-450">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Forme juridique <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'legalForm' ? '#A0A12F' : '#172867', opacity: focusedField === 'legalForm' ? 0.8 : 0.4 }} />
                      </div>
                      <select
                        required
                        value={formData.legalForm}
                        onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
                        onFocus={() => setFocusedField('legalForm')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white appearance-none cursor-pointer"
                        style={{ 
                          borderColor: focusedField === 'legalForm' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                      >
                        <option value="">Sélectionner une forme juridique</option>
                        <option value="SARL">SARL</option>
                        <option value="SAS">SAS</option>
                        <option value="SA">SA</option>
                        <option value="EURL">EURL</option>
                        <option value="SNC">SNC</option>
                        <option value="SCI">SCI</option>
                        <option value="SASU">SASU</option>
                        <option value="AUTRE">Autre</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4" style={{ color: '#172867', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Nom de société */}
                  <div className="animate-fade-in-up animation-delay-400">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Nom de la société <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Building2 className="w-4 h-4 transition-colors" style={{ color: focusedField === 'companyName' ? '#A0A12F' : '#172867', opacity: focusedField === 'companyName' ? 0.8 : 0.4 }} />
                      </div>
                      <input
                        type="text"
                        required
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

                  <div className="animate-fade-in-up animation-delay-500">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Adresse email <span className="text-red-500">*</span>
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

                  <div className="animate-fade-in-up animation-delay-600">
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
                        className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white"
                        style={{ 
                          borderColor: focusedField === 'phone' ? '#A0A12F' : 'rgba(160, 161, 47, 0.3)',
                          color: '#172867',
                        }}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>

                  <div className="animate-fade-in-up animation-delay-700">
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
                      Mot de passe <span className="text-red-500">*</span>
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

                  <div className="animate-fade-in-up animation-delay-800">
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
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-6 animate-fade-in-up animation-delay-900"
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

