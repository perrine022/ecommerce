/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page Mentions Légales
 */

'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Building2, Mail, Phone, MapPin, FileText, Shield } from 'lucide-react';

export default function MentionsLegalesPage() {
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
                Mentions <span className="text-[#A0A12F]">Légales</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                Informations légales et réglementaires
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Contenu Mentions Légales */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <ScrollReveal delay={0}>
              <LegalSection
                icon={Building2}
                title="Éditeur du Site"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Le site <strong className="text-[#A0A12F]">www.tradefood.fr</strong> est édité par :
                    </p>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 space-y-3">
                      <p className="text-gray-700"><strong className="text-[#172867]">Raison sociale :</strong> TradeFood</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">Capital social :</strong> À définir</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">Siège social :</strong> À définir</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">SIRET :</strong> À définir</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">RCS :</strong> À définir</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">TVA Intracommunautaire :</strong> À définir</p>
                    </div>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <LegalSection
                icon={FileText}
                title="Directeur de Publication"
                content={
                  <p className="text-gray-700 leading-relaxed">
                    Le directeur de la publication est le représentant légal de TradeFood.
                  </p>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <LegalSection
                icon={Shield}
                title="Hébergement"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Le site www.tradefood.fr est hébergé par :
                    </p>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 space-y-3">
                      <p className="text-gray-700"><strong className="text-[#172867]">Hébergeur :</strong> À définir</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">Adresse :</strong> À définir</p>
                      <p className="text-gray-700"><strong className="text-[#172867]">Téléphone :</strong> À définir</p>
                    </div>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <LegalSection
                icon={Mail}
                title="Contact"
                content={
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#A0A12F]/30 transition-all duration-300">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#A0A12F]" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-[#172867]">Email</p>
                        <a 
                          href="mailto:contact@tradefood.fr" 
                          className="text-[#A0A12F] hover:opacity-80 transition-opacity"
                        >
                          contact@tradefood.fr
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#A0A12F]/30 transition-all duration-300">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#A0A12F]" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-[#172867]">Téléphone</p>
                        <a 
                          href="tel:0123456789" 
                          className="text-[#A0A12F] hover:opacity-80 transition-opacity"
                        >
                          01 23 45 67 89
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#A0A12F]/30 transition-all duration-300">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#A0A12F]" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-[#172867]">Adresse</p>
                        <p className="text-gray-700">
                          À définir
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <LegalSection
                icon={FileText}
                title="Propriété Intellectuelle"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                      et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les 
                      documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                      formellement interdite sauf autorisation expresse du directeur de la publication.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      La reproduction des textes de ce site sur un support papier est autorisée, notamment dans un 
                      cadre pédagogique, sous réserve du respect des trois conditions suivantes :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                      <li>Gratuité de la diffusion</li>
                      <li>Respect de l'intégrité des documents reproduits (pas de modification ni d'altération)</li>
                      <li>Citation claire et lisible de la source sous la forme : "Document issu du site www.tradefood.fr. 
                      Droits de reproduction réservés et strictement limités."</li>
                    </ul>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <LegalSection
                icon={Shield}
                title="Protection des Données Personnelles"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général 
                      sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression 
                      et d'opposition aux données personnelles vous concernant.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les données personnelles collectées sur ce site sont destinées à TradeFood. Elles sont utilisées pour 
                      le traitement de vos commandes, la gestion de votre compte client et l'envoi d'informations commerciales 
                      (si vous y avez consenti).
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Pour exercer vos droits, vous pouvez nous contacter :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 mb-4">
                      <li>Par email : <a href="mailto:contact@tradefood.fr" className="text-[#A0A12F] hover:opacity-80 transition-opacity">contact@tradefood.fr</a></li>
                      <li>Par courrier : À l'adresse du siège social</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale de 
                      l'Informatique et des Libertés (CNIL) si vous estimez que vos droits ne sont pas respectés.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={600}>
              <LegalSection
                icon={FileText}
                title="Cookies"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Le site www.tradefood.fr utilise des cookies pour améliorer votre expérience de navigation et 
                      analyser le trafic du site.
                    </p>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. 
                      Ils permettent au site de mémoriser vos préférences et d'améliorer ses performances.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur. 
                      Cependant, cela peut affecter certaines fonctionnalités du site.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={700}>
              <LegalSection
                icon={FileText}
                title="Liens Externes"
                content={
                  <>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      Le site www.tradefood.fr peut contenir des liens vers d'autres sites. TradeFood n'exerce aucun 
                      contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      La création de liens hypertextes vers le site www.tradefood.fr est autorisée sous réserve de ne pas 
                      utiliser de technique de "framing" ou de "inlining" et de mentionner clairement la source.
                    </p>
                  </>
                }
              />
            </ScrollReveal>

            <ScrollReveal delay={800}>
              <LegalSection
                icon={FileText}
                title="Droit Applicable"
                content={
                  <p className="text-gray-700 leading-relaxed">
                    Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord 
                    amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
                  </p>
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

function LegalSection({ 
  icon: Icon, 
  title, 
  content 
}: { 
  icon: any; 
  title: string; 
  content: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A0A12F]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
      <div className="relative bg-white rounded-xl p-6 border border-gray-100 hover:border-[#A0A12F]/40 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#A0A12F]/10 to-[#A0A12F]/5 flex items-center justify-center group-hover:from-[#A0A12F]/20 group-hover:to-[#A0A12F]/10 transition-all duration-300">
            <Icon className="w-6 h-6 text-[#A0A12F]" />
          </div>
          <h2 className="text-2xl font-bold text-[#172867]">
            {title}
          </h2>
        </div>
        <div>
          {content}
        </div>
      </div>
    </div>
  );
}
