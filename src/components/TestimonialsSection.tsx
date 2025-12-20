'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location?: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "En 3 mois, ma facture de chauffage a diminué de 60%. Serena Energie a installé une pompe à chaleur et isolé mes combles. Le confort est incomparable et les économies sont réelles. L'accompagnement pour MaPrimeRénov' a été parfait, j'ai obtenu toutes les aides. Je recommande vivement !",
    name: "Marie D.",
    role: "Propriétaire",
    location: "Lyon",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    quote: "Installation de panneaux photovoltaïques impeccable. L'équipe de Serena Energie est professionnelle, ponctuelle et très à l'écoute. Je produis maintenant 80% de mon électricité et je revends le surplus. L'investissement est rentabilisé en 7 ans grâce aux aides. Excellent rapport qualité-prix.",
    name: "Pierre L.",
    role: "Propriétaire",
    location: "Marseille",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    quote: "Rénovation complète de notre maison : isolation, pompe à chaleur et photovoltaïque. Serena Energie a géré tous les travaux de A à Z. Résultat : factures divisées par 2, confort amélioré, et valeur de la maison en hausse. L'accompagnement MaPrimeRénov' nous a permis d'obtenir 85% d'aides. Parfait !",
    name: "Sophie M.",
    role: "Propriétaire",
    location: "Toulouse",
    avatar: "https://i.pravatar.cc/150?img=45"
  },
  {
    quote: "Isolation des murs et des combles réalisée avec soin. L'équipe est venue à l'heure, a travaillé proprement et a nettoyé après les travaux. Ma facture de chauffage a baissé de 45% et la maison est beaucoup plus agréable à vivre. Service client au top, je recommande sans hésiter.",
    name: "Marc B.",
    role: "Propriétaire",
    location: "Paris",
    avatar: "https://i.pravatar.cc/150?img=13"
  }
];

function TestimonialCard({ testimonial, isActive }: { testimonial: Testimonial; isActive: boolean }) {
  return (
    <div className="flex-shrink-0 w-full px-1 sm:px-2 md:px-4 transition-all duration-500">
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 shadow-lg sm:shadow-xl border border-gold-100 sm:border-2 hover:border-gold-300 transition-all duration-300">
        {/* Star Rating - Compact mobile */}
        <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4 md:mb-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>
        
        {/* Quote - Texte plus compact mobile */}
        <p className="text-gray-700 font-light leading-snug sm:leading-relaxed mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg lg:text-xl italic line-clamp-6 sm:line-clamp-none">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        
        {/* User Info - Compact mobile */}
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-6 border-t border-gold-100">
          {testimonial.avatar ? (
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border border-gold-200 sm:border-2 shadow-sm sm:shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-sm sm:shadow-md flex-shrink-0">
              {testimonial.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 font-medium text-sm sm:text-base md:text-lg truncate">
              {testimonial.name}
            </p>
            <p className="text-gold-600 text-[10px] sm:text-xs md:text-sm font-medium truncate">
              {testimonial.role}
              {testimonial.location && <span className="text-gray-500 hidden sm:inline"> • {testimonial.location}</span>}
            </p>
            {testimonial.location && (
              <p className="text-gray-500 text-[10px] sm:hidden mt-0.5">
                {testimonial.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section id="temoignages" className="py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 bg-white relative overflow-hidden">
      {/* Background decoration - Réduit sur mobile */}
      <div className="absolute inset-0 opacity-30 sm:opacity-100">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gold-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-cream-50 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header - Compact sur mobile */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gold-50 rounded-full mb-3 sm:mb-4 md:mb-6 border border-gold-200">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-500 fill-gold-500" />
            <span className="text-gold-600 font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-sm uppercase tracking-wider leading-tight">94% recommandent • 4,9/5</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extralight text-gray-700 sm:text-gray-400 mb-2 sm:mb-3 md:mb-4 tracking-tight px-2">
            <span className="text-gold-600 font-medium">Ils ont réduit leurs factures</span> jusqu'à <span className="text-gold-600 font-medium">-60%</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl text-gray-500 sm:text-gray-400 font-light max-w-3xl mx-auto px-2 sm:px-4 leading-snug sm:leading-relaxed">
            <strong className="text-gray-600 sm:text-gray-500 font-medium">850+ foyers</strong> font confiance à notre expertise
          </p>
        </div>

        {/* Carousel - Design épuré mobile */}
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-xl sm:rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index} 
                  testimonial={testimonial} 
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>

          {/* Navigation - En bas sur mobile, sur les côtés sur desktop */}
          <div className="flex items-center justify-between mt-4 sm:mt-6">
            {/* Navigation Arrows - Mobile en bas */}
            <div className="flex items-center gap-3 sm:hidden w-full justify-center">
              <button
                onClick={goToPrevious}
                className="w-9 h-9 bg-white hover:bg-gold-50 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 z-20 border border-gold-200"
                aria-label="Avis précédent"
              >
                <ChevronLeft className="w-4 h-4 text-gold-600" />
              </button>

              {/* Dots Indicator - Mobile */}
              <div className="flex justify-center gap-1.5">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-gold-500 w-6'
                        : 'bg-gray-300 w-1.5'
                    }`}
                    aria-label={`Aller à l'avis ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="w-9 h-9 bg-white hover:bg-gold-50 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 z-20 border border-gold-200"
                aria-label="Avis suivant"
              >
                <ChevronRight className="w-4 h-4 text-gold-600" />
              </button>
            </div>

            {/* Navigation Desktop - Sur les côtés */}
            <div className="hidden sm:flex items-center absolute inset-0 pointer-events-none">
              <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-4 w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-gold-50 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-20 border-2 border-gold-200 pointer-events-auto"
                aria-label="Avis précédent"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gold-600" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-2 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-gold-50 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-20 border-2 border-gold-200 pointer-events-auto"
                aria-label="Avis suivant"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gold-600" />
              </button>
            </div>

            {/* Dots Indicator - Desktop */}
            <div className="hidden sm:flex justify-center gap-2 w-full mt-6 md:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gold-500 w-8'
                      : 'bg-gray-300 hover:bg-gold-300'
                  }`}
                  aria-label={`Aller à l'avis ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
