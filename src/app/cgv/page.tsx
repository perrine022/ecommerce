/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page Conditions Générales de Vente
 */

'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { FileText, ShoppingCart, CreditCard, Shield, AlertCircle } from 'lucide-react';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A0A12F]/5 via-transparent to-transparent"></div>
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#172867] to-[#A0A12F] bg-clip-text text-transparent">
                Conditions Générales de <span className="text-[#A0A12F]">Vente</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Contenu CGV */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <ScrollReveal delay={0}>
              <ArticleSection
                icon={FileText}
                number="1"
                title="Objet et Champ d'Application"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les présentes Conditions Générales de Vente (CGV) régissent les relations entre <strong className="text-[#A0A12F]">TradeFood</strong>, 
                      société de vente en ligne de produits alimentaires rares et authentiques, et tout client effectuant 
                      un achat sur le site www.tradefood.fr.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Toute commande passée sur le site implique l'acceptation sans réserve des présentes CGV. 
                      Ces conditions prévalent sur tout autre document, sauf accord écrit contraire.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <ArticleSection
                icon={ShoppingCart}
                number="2"
                title="Commandes"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les produits proposés à la vente sont ceux qui figurent sur le site au jour de la consultation, 
                      dans la limite des stocks disponibles.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Toute commande vaut acceptation des prix et des descriptions des produits. Nous nous réservons 
                      le droit de modifier nos prix à tout moment, étant toutefois entendu que le prix figurant au 
                      catalogue le jour de la commande sera le seul applicable à l'acheteur.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      La validation de votre commande entraîne l'acceptation des présentes CGV, la reconnaissance 
                      d'en avoir parfaitement connaissance et la renonciation à se prévaloir de vos propres conditions 
                      d'achat.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <ArticleSection
                icon={CreditCard}
                number="3"
                title="Prix et Modalités de Paiement"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les prix de nos produits sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison. 
                      Les frais de livraison sont indiqués avant la validation finale de la commande.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Le paiement s'effectue par carte bancaire (CB, Visa, Mastercard) ou via PayPal. 
                      Le paiement est exigible immédiatement à la commande.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      En cas de paiement par carte bancaire, les informations sont transmises de manière sécurisée 
                      via notre prestataire de paiement. Aucune information bancaire n'est conservée sur nos serveurs.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <ArticleSection
                icon={Shield}
                number="4"
                title="Livraison"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les délais de livraison sont indiqués à titre indicatif et correspondent au délai moyen de traitement 
                      et d'acheminement. Ils courent à compter de la validation de votre commande.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      En cas de retard de livraison, vous serez informé par email. Si le retard excède 7 jours ouvrés, 
                      vous pouvez annuler votre commande et être intégralement remboursé.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Les risques de perte ou d'endommagement des produits sont transférés au client au moment de la 
                      livraison. Il appartient au client de vérifier l'état des produits à la réception et de signaler 
                      tout problème dans les 48 heures.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <ArticleSection
                icon={AlertCircle}
                number="5"
                title="Droit de Rétractation"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de 
                      <strong className="text-[#A0A12F]"> 14 jours calendaires</strong> à compter de la réception de votre commande pour exercer 
                      votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalité.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Pour exercer ce droit, vous devez nous notifier votre décision de rétractation par email à 
                      contact@tradefood.fr ou par courrier à l'adresse indiquée dans les mentions légales.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Les produits doivent être retournés dans leur emballage d'origine, non ouverts et en parfait état. 
                      Les frais de retour sont à votre charge, sauf si les produits livrés ne correspondent pas à votre 
                      commande ou sont défectueux.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <ArticleSection
                icon={Shield}
                number="6"
                title="Garanties et Responsabilité"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, 
                      conformément aux articles L.217-4 et suivants du Code de la consommation.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      En cas de non-conformité d'un produit vendu, vous disposez d'un délai de 2 ans à compter de la 
                      livraison du bien pour agir. Vous pouvez choisir entre la réparation ou le remplacement du bien, 
                      sauf si l'un de ces choix entraîne un coût manifestement disproportionné.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Notre responsabilité ne saurait être engagée en cas de dommages indirects résultant de l'utilisation 
                      ou de l'impossibilité d'utiliser le produit, sauf faute lourde ou dolosive de notre part.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <ArticleSection
                icon={FileText}
                number="7"
                title="Propriété Intellectuelle"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      L'ensemble des éléments du site www.tradefood.fr, qu'ils soient visuels ou sonores, y compris la 
                      technologie sous-jacente, sont protégés par le droit d'auteur, des marques ou des brevets.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des 
                      éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation 
                      écrite préalable de TradeFood.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={700}>
              <ArticleSection
                icon={FileText}
                number="8"
                title="Données Personnelles"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les données personnelles collectées lors de votre commande sont nécessaires au traitement de celle-ci 
                      et à l'établissement des factures. Elles sont conservées de manière sécurisée et ne sont en aucun cas 
                      transmises à des tiers à des fins commerciales.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Conformément à la loi "Informatique et Libertés" et au RGPD, vous disposez d'un droit d'accès, de 
                      rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer 
                      ce droit, contactez-nous à contact@tradefood.fr.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={800}>
              <ArticleSection
                icon={FileText}
                number="9"
                title="Droit Applicable et Juridiction Compétente"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les présentes CGV sont régies par le droit français. En cas de litige et à défaut d'accord amiable, 
                      le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Conformément à l'article L.612-1 du Code de la consommation, vous pouvez recourir gratuitement à un 
                      médiateur de la consommation en vue de la résolution amiable du litige qui nous oppose. 
                      Le médiateur compétent est celui dont dépend notre entreprise.
                    </p>
                  </>
                }
              />
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ArticleSection({ 
  icon: Icon, 
  number, 
  title, 
  content 
}: { 
  icon: any; 
  number: string; 
  title: string; 
  content: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A0A12F]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      <div className="relative bg-white rounded-xl p-6 border border-gray-100 hover:border-[#A0A12F]/40 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center group-hover:from-[#A0A12F]/20 group-hover:to-[#A0A12F]/10 transition-all duration-300">
            <Icon className="w-6 h-6 text-[#A0A12F]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl font-bold text-[#A0A12F]">Article {number}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#172867]">
              {title}
            </h2>
          </div>
        </div>
        <div className="pl-16">
          {content}
        </div>
      </div>
    </div>
  );
}
