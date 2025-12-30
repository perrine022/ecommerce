/**
 * @author Perrine Honoré
 * @date 2025-12-29
 * Page Contact
 */

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // TODO: Câbler avec l'API backend pour envoyer le message
    // Pour l'instant, simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#172867' }}>
              Contactez-<span style={{ color: '#A0A12F' }}>nous</span>
            </h1>
            <p className="text-lg md:text-xl" style={{ color: '#172867' }}>
              Une question ? Un besoin spécifique ? Notre équipe est à votre écoute
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Formulaire de contact */}
              <div className="animate-fade-in-left animation-delay-100">
                <h2 className="text-3xl font-bold mb-8" style={{ color: '#172867' }}>
                  Envoyez-nous un <span style={{ color: '#A0A12F' }}>message</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#172867' }}>
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white transition-all"
                      style={{ 
                        borderColor: '#A0A12F',
                        color: '#172867',
                      }}
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: '#172867' }}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white transition-all"
                      style={{ 
                        borderColor: '#A0A12F',
                        color: '#172867',
                      }}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: '#172867' }}>
                      Téléphone <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white transition-all"
                      style={{ 
                        borderColor: '#A0A12F',
                        color: '#172867',
                      }}
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold mb-2" style={{ color: '#172867' }}>
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white transition-all"
                      style={{ 
                        borderColor: '#A0A12F',
                        color: '#172867',
                      }}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="question">Question générale</option>
                      <option value="commande">Suivi de commande</option>
                      <option value="produit">Question sur un produit</option>
                      <option value="retour">Retour / Remboursement</option>
                      <option value="partenaire">Devenir partenaire</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2" style={{ color: '#172867' }}>
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-1 bg-white transition-all resize-none"
                      style={{ 
                        borderColor: '#A0A12F',
                        color: '#172867',
                      }}
                      placeholder="Votre message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#A0A12F' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#A0A12F', opacity: 0.1, borderColor: '#A0A12F' }}>
                      <p className="text-sm font-medium" style={{ color: '#A0A12F' }}>
                        ✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                      <p className="text-sm text-red-600">
                        Une erreur est survenue. Veuillez réessayer.
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Informations de contact */}
              <div className="space-y-6 animate-fade-in-right animation-delay-200">
                <div>
                  <h2 className="text-3xl font-bold mb-8" style={{ color: '#172867' }}>
                    Nos <span style={{ color: '#A0A12F' }}>coordonnées</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <ContactInfoCard
                    icon={Mail}
                    title="Email"
                    content="contact@tradefood.fr"
                    link="mailto:contact@tradefood.fr"
                    delay={0}
                  />
                  <ContactInfoCard
                    icon={Phone}
                    title="Téléphone"
                    content="01 23 45 67 89"
                    link="tel:0123456789"
                    delay={100}
                  />
                  <ContactInfoCard
                    icon={Clock}
                    title="Horaires"
                    content="Lundi - Vendredi : 9h - 18h"
                    link={null}
                    delay={200}
                  />
                  <ContactInfoCard
                    icon={MapPin}
                    title="Adresse"
                    content="À définir"
                    link={null}
                    delay={300}
                  />
                </div>

                <div className="relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:shadow-xl group" style={{ background: 'linear-gradient(135deg, rgba(160, 161, 47, 0.1) 0%, rgba(23, 40, 103, 0.05) 100%)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(160, 161, 47, 0.05) 0%, rgba(23, 40, 103, 0.02) 100%)' }}></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#172867' }}>
                      Besoin d'aide immédiate ?
                    </h3>
                    <p className="text-base mb-6 leading-relaxed" style={{ color: '#172867', opacity: 0.8 }}>
                      Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à toutes vos questions.
                    </p>
                    <a
                      href="tel:0123456789"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{ backgroundColor: '#A0A12F' }}
                    >
                      <Phone className="w-5 h-5" />
                      Appeler maintenant
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ContactInfoCard({ 
  icon: Icon, 
  title, 
  content, 
  link,
  delay = 0
}: { 
  icon: any; 
  title: string; 
  content: string; 
  link: string | null;
  delay?: number;
}) {
  const contentElement = link ? (
    <a 
      href={link}
      className="hover:text-[#A0A12F] transition-colors duration-200"
      style={{ color: '#172867' }}
    >
      {content}
    </a>
  ) : (
    <span style={{ color: '#172867' }}>{content}</span>
  );

  const delayClass = delay === 0 ? 'animation-delay-100' : delay === 100 ? 'animation-delay-200' : delay === 200 ? 'animation-delay-300' : 'animation-delay-400';

  return (
    <div 
      className={`group flex items-center gap-4 p-5 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg cursor-pointer animate-fade-in-up ${delayClass}`}
      style={{ 
        background: 'linear-gradient(135deg, rgba(160, 161, 47, 0.05) 0%, rgba(23, 40, 103, 0.02) 100%)'
      }}
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md" style={{ backgroundColor: '#A0A12F', opacity: 0.15 }}>
        <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: '#A0A12F' }} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold mb-1 uppercase tracking-wide" style={{ color: '#172867', opacity: 0.7 }}>
          {title}
        </h3>
        <p className="text-base font-medium">
          {contentElement}
        </p>
      </div>
      {link && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
          <ArrowRight className="w-5 h-5" style={{ color: '#A0A12F' }} />
        </div>
      )}
    </div>
  );
}

