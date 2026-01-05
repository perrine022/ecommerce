/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page de confirmation d'inscription
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';

export default function InscriptionConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border p-8 lg:p-12 text-center" style={{ borderColor: '#A0A12F' }}>
            {/* Icône de succès */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
                <CheckCircle className="w-12 h-12" style={{ color: '#A0A12F' }} />
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#172867' }}>
              Merci pour votre inscription !
            </h1>

            {/* Message principal */}
            <div className="space-y-4 mb-8">
              <p className="text-lg leading-relaxed" style={{ color: '#172867', opacity: 0.8 }}>
                Votre demande d'inscription a bien été enregistrée.
              </p>
              <div className="bg-blue-50 rounded-lg p-6 border" style={{ borderColor: '#A0A12F', backgroundColor: 'rgba(160, 161, 47, 0.05)' }}>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#A0A12F' }} />
                  <div className="text-left">
                    <p className="font-semibold mb-2" style={{ color: '#172867' }}>
                      Validation en cours
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#172867', opacity: 0.7 }}>
                      Nous allons prochainement valider votre profil. Vous recevrez un email de confirmation une fois votre compte activé.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="border-t pt-6 mb-8" style={{ borderColor: 'rgba(160, 161, 47, 0.2)' }}>
              <p className="text-sm" style={{ color: '#172867', opacity: 0.6 }}>
                En attendant, vous pouvez explorer notre catalogue de produits.
              </p>
            </div>

            {/* Bouton continuer */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:scale-[1.02]"
              style={{ backgroundColor: '#A0A12F' }}
            >
              Continuer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


