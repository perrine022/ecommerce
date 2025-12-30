/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Composant Footer réutilisable
 */

'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logotrade.png"
                alt="TradeFood"
                width={150}
                height={50}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm" style={{ color: '#172867' }}>
              Votre spécialiste en produits rares et authentiques du monde entier. Qualité, authenticité et goût garantis.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#172867' }}>Navigation</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#172867' }}>
              <li><a href="/" className="hover:text-[#A0A12F] transition-colors">Accueil</a></li>
              <li><a href="/#produits" className="hover:text-[#A0A12F] transition-colors">Produits</a></li>
              <li><a href="/compte" className="hover:text-[#A0A12F] transition-colors">Mon Compte</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#172867' }}>Informations</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#172867' }}>
              <li><a href="/a-propos" className="hover:text-[#A0A12F] transition-colors">À propos</a></li>
              <li><a href="/livraison" className="hover:text-[#A0A12F] transition-colors">Livraison</a></li>
              <li><a href="/cgv" className="hover:text-[#A0A12F] transition-colors">CGV</a></li>
              <li><a href="/mentions-legales" className="hover:text-[#A0A12F] transition-colors">Mentions légales</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#172867' }}>Contact</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#172867' }}>
              <li>Email: <a href="mailto:contact@tradefood.fr" className="hover:text-[#A0A12F] transition-colors">contact@tradefood.fr</a></li>
              <li>Tél: <a href="tel:0123456789" className="hover:text-[#A0A12F] transition-colors">01 23 45 67 89</a></li>
              <li>Lun-Ven: 9h-18h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-sm" style={{ color: '#172867' }}>
          © 2025 TradeFood. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

