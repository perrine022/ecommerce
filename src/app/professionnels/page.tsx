'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MessageCircle, CheckCircle2, TrendingUp, FileText, Sun, Thermometer, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Composant pour les animations au scroll
function ScrollReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

export default function ProfessionnelsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi - à remplacer par votre logique d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const services = [
    {
      icon: FileText,
      title: 'Audit énergétique',
      description: 'Analyse complète pour réduire vos dépenses énergétiques professionnelles.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      features: [
        'Diagnostic complet de vos consommations',
        'Identification des postes énergivores',
        'Recommandations personnalisées',
        'Estimation des économies potentielles'
      ]
    },
    {
      icon: Sun,
      title: 'Photovoltaïque pro',
      subtitle: 'Photovoltaïque en toiture',
      description: 'Valorisez votre toiture avec du solaire rentable.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      features: [
        'Installation sur toiture professionnelle',
        'Dimensionnement optimisé',
        'Autoconsommation ou revente',
        'Maintenance et suivi inclus'
      ]
    },
    {
      icon: Thermometer,
      title: 'Rénovation thermique',
      description: 'Optimisez le chauffage de vos locaux grâce à des destratificateurs performants.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      features: [
        'Installation de destratificateurs',
        'Optimisation de la distribution de chaleur',
        'Réduction des déperditions',
        'Amélioration du confort des collaborateurs'
      ]
    },
    {
      icon: Shield,
      title: 'CEE Professionnels',
      description: 'Nous vous accompagnons dans l\'obtention des aides CEE pour financer vos travaux. Serena Énergie s\'occupe de toutes les démarches administratives.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: [
        'Accompagnement complet CEE',
        'Gestion de toutes les démarches',
        'Optimisation des aides obtenues',
        'Suivi jusqu\'à l\'obtention'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-screen z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 w-full">
            {/* Logo avec image */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                <Image
                  src="/serena.jpg"
                  alt="Serena Energie"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-extralight text-gray-700 tracking-tight leading-none">
                  Serena Energie
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 font-light tracking-wider uppercase mt-0.5">
                  Professionnels
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-shrink-0">
              <Link 
                href="/#services" 
                className="text-sm font-light text-gray-600 hover:text-gray-700 transition-colors tracking-wide"
              >
                Services
              </Link>
              <Link 
                href="/#contact" 
                className="text-sm font-light text-gray-600 hover:text-gray-700 transition-colors tracking-wide"
              >
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <a 
                href="tel:+33612345678" 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                aria-label="Appeler"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-light tracking-wide">06 12 34 56 78</span>
              </a>
              <a 
                href="https://wa.me/33612345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 bg-white/60 backdrop-blur-sm border border-gray-300/50 rounded-xl text-gray-600 hover:text-gray-700 hover:bg-white/80 transition-all shadow-sm flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-4" style={{ backgroundColor: '#aac527' }}>
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 sm:mb-6 tracking-tight">
                Solutions énergétiques pour <span className="font-medium">les professionnels</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-8">
                Réduisez vos coûts énergétiques et optimisez la performance de vos locaux professionnels
              </p>
              <a 
                href="#services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-light text-base sm:text-lg tracking-wide hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform"
              >
                Découvrir nos solutions
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-12 sm:py-16 md:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-gray-900 mb-4 tracking-tight">
                Nos <span style={{ color: '#aac527' }}>services</span> professionnels
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto">
                Des solutions sur mesure pour optimiser la performance énergétique de vos locaux professionnels
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 ${service.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    {service.subtitle && (
                      <p className="text-sm sm:text-base text-gray-500 font-medium mb-3">
                        {service.subtitle}
                      </p>
                    )}
                    <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 ${service.iconColor} flex-shrink-0 mt-0.5`} />
                          <span className="text-sm sm:text-base text-gray-700 font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a 
                      href="#contact"
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${service.color} text-white rounded-xl font-medium text-sm sm:text-base hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
                    >
                      Demander un devis
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-16 sm:py-20 md:py-32 px-4" style={{ backgroundColor: '#aac527' }}>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16 md:mb-20">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white tracking-tight mb-4">
                Contactez-nous
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">
                Une question ? Un projet professionnel ? Notre équipe vous répond sous <strong className="font-medium">2 heures</strong>
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start">
            {/* Formulaire */}
            <ScrollReveal delay={200}>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-xs font-light text-gray-500 uppercase tracking-wider">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 border-0 border-b border-gray-300 rounded-none bg-transparent focus:ring-0 focus:border-gray-600 transition-colors text-gray-800 placeholder-gray-400 font-light"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="company" className="block text-xs font-light text-gray-500 uppercase tracking-wider">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-0 py-4 border-0 border-b border-gray-300 rounded-none bg-transparent focus:ring-0 focus:border-gray-600 transition-colors text-gray-800 placeholder-gray-400 font-light"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-light text-gray-500 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 border-0 border-b border-gray-300 rounded-none bg-transparent focus:ring-0 focus:border-gray-600 transition-colors text-gray-800 placeholder-gray-400 font-light"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-xs font-light text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-0 py-4 border-0 border-b border-gray-300 rounded-none bg-transparent focus:ring-0 focus:border-gray-600 transition-colors text-gray-800 placeholder-gray-400 font-light"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-xs font-light text-gray-500 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-0 py-4 border-0 border-b border-gray-300 rounded-none bg-transparent focus:ring-0 focus:border-gray-600 transition-colors resize-none text-gray-800 placeholder-gray-400 font-light"
                      placeholder="Décrivez-nous votre projet professionnel..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-0 py-5 bg-white border-2 border-white text-gray-700 rounded-full font-light tracking-wider uppercase text-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: '#aac527', color: '#aac527' }}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                  </button>
                  {submitStatus === 'success' && (
                    <div className="bg-white border-l-4 p-4" style={{ borderColor: '#aac527' }}>
                      <p className="text-gray-700 font-light">✓ Message envoyé avec succès</p>
                      <p className="text-gray-500 text-sm mt-1 font-light">Réponse sous 2h</p>
                    </div>
                  )}
                </form>
              </div>
            </ScrollReveal>

            {/* Informations de contact */}
            <ScrollReveal delay={400}>
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl">
                  <h4 className="text-xl sm:text-2xl font-extralight text-gray-700 mb-6 sm:mb-8 tracking-wide">Contact direct</h4>
                  <div className="space-y-4 sm:space-y-6">
                    <a 
                      href="tel:+33612345678" 
                      className="flex items-start gap-6 group border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 flex items-center justify-center border border-gray-400 group-hover:border-gray-700 transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light text-gray-500 uppercase tracking-wider mb-1">Téléphone</p>
                        <p className="text-lg font-light text-gray-700 group-hover:text-gray-900 transition-colors">06 12 34 56 78</p>
                      </div>
                    </a>
                    <a 
                      href="mailto:contact@serena-energie.fr" 
                      className="flex items-start gap-6 group border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 flex items-center justify-center border border-gray-400 group-hover:border-gray-700 transition-colors">
                        <Mail className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light text-gray-500 uppercase tracking-wider mb-1">Email</p>
                        <p className="text-lg font-light text-gray-700 group-hover:text-gray-900 transition-colors break-all">contact@serena-energie.fr</p>
                      </div>
                    </a>
                    <a 
                      href="https://wa.me/33612345678" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-6 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center border border-gray-400 group-hover:border-gray-700 transition-colors">
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light text-gray-500 uppercase tracking-wider mb-1">WhatsApp</p>
                        <p className="text-lg font-light text-gray-700 group-hover:text-gray-900 transition-colors">Réponse immédiate</p>
                        <p className="text-xs text-gray-500 font-light mt-1">Disponible 7j/7</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/serena.jpg"
                    alt="Serena Energie"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <h5 className="text-lg sm:text-xl font-light">Serena Energie</h5>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 italic font-light">
                Votre confort, notre expertise
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs font-light">
                Solutions énergétiques pour les professionnels
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Nos Services</h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400 font-light">
                <li className="hover:text-white transition-colors cursor-pointer">Audit énergétique</li>
                <li className="hover:text-white transition-colors cursor-pointer">Photovoltaïque pro</li>
                <li className="hover:text-white transition-colors cursor-pointer">Rénovation thermique</li>
                <li className="hover:text-white transition-colors cursor-pointer">CEE Professionnels</li>
              </ul>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h5 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Contactez-nous</h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400 font-light">
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                  <span>06 12 34 56 78</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                  <span className="break-all">contact@serena-energie.fr</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0 text-center md:text-left">
              <p className="text-xs sm:text-sm text-gray-400 font-light">
                &copy; {new Date().getFullYear()} Serena Energie. Tous droits réservés.
              </p>
            </div>
          </div>
          {/* Bande crédit codyxo.com */}
          <div className="border-t border-gray-800 mt-6 pt-4">
            <p className="text-center text-gray-500 text-xs font-light">
              Site réalisé par{' '}
              <a 
                href="https://codyxo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors underline decoration-gray-600 hover:decoration-gray-500"
              >
                codyxo.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

