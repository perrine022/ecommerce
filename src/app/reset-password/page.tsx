/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de réinitialisation de mot de passe
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, CheckCircle } from 'lucide-react';
import { authApi } from '@/services/api';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await authApi.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la demande de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg border-2 border-gray-100 p-8 shadow-sm">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#172867' }}>
              Réinitialiser le mot de passe
            </h1>
            <p className="text-sm mb-8" style={{ color: '#172867', opacity: 0.7 }}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#A0A12F' }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: '#172867' }}>
                  Email envoyé !
                </h2>
                <p className="text-sm mb-6" style={{ color: '#172867', opacity: 0.7 }}>
                  Vérifiez votre boîte de réception pour le lien de réinitialisation.
                </p>
                <Link
                  href="/connexion"
                  className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#172867' }}
                >
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#172867' }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#172867', opacity: 0.5 }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: '#172867', color: '#172867' }}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#172867' }}
                >
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/connexion"
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#A0A12F' }}
              >
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

