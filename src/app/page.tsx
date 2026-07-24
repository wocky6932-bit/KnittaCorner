"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shirt, Sparkles, Truck, Leaf, Star } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const { products, isLoaded } = useShop();

  // Dynamic filter of first 4 new arrivals in stock
  const newArrivals = products.filter((p) => p.isNewArrival && p.inStock).slice(0, 4);
  // Dynamic filter of first 4 best sellers / editor picks in stock
  const bestSellers = products.filter((p) => p.isBestSeller && p.inStock).slice(0, 4);

  // Categories Editorial Cards
  const collectionsList = [
    {
      title: "Vêtements & Streetwear",
      description: "Des pièces de mode uniques et streetwear sélectionnées avec soin.",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=V%C3%AAtements+%26+Streetwear"
    },
    {
      title: "Archives & Vintage",
      description: "Des trésors vintage et des pièces d'archives uniques",
      image: "https://images.unsplash.com/photo-1550614000-4b95d466f28b?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=Archives+%26+Vintage"
    },
    {
      title: "Accessoires & Sneakers",
      description: "Des accessoires tendance et des sneakers rares",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
      href: "/shop?category=Accessoires+%26+Sneakers"
    }
  ];

  // Sourcing steps
  const sourcingSteps = [
    {
      num: "01",
      title: "Sélection Mode",
      description: "Curation rigoureuse de pièces streetwear et vintage à Dakar."
    },
    {
      num: "02",
      title: "Sélection Pointue",
      description: "Choix minutieux de pièces mode rares (matière, coupe, état)."
    },
    {
      num: "03",
      title: "Contrôle Qualité",
      description: "Vérification minutieuse des packagings et de l'état des vêtements."
    },
    {
      num: "04",
      title: "Envoi Soigné",
      description: "Emballage cadeau délicat et envoi rapide partout au Sénégal."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Les pièces streetwear dénichées par Binta sont sublimes, je ne reçois que des compliments ! La sélection est top.",
      author: "Mariama D.",
      role: "Dakar",
      rating: 5
    },
    {
      quote: "Une sélection dingue ! J'ai pu dénicher une veste vintage introuvable ailleurs, la qualité est impeccable.",
      author: "Awa N.",
      role: "Dakar",
      rating: 5
    },
    {
      quote: "Les sneakers et accessoires sont dans un état irréprochable. La livraison a été super rapide et le colis était soigné !",
      author: "Khady J.",
      role: "Saint-Louis",
      rating: 5
    }
  ];

  // Lifestyle lookbook gallery images (matches real Instagram feed style)
  const lifestyleLooks = [
    {
      src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80", // slippers
      alt: "Mules Cozy"
    },
    {
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80", // fashion item
      alt: "Pièce Mode"
    },
    {
      src: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80", // setting spray
      alt: "Revolution Fixing Spray"
    },
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80", // fashion item
      alt: "Accessoire Mode"
    },
    {
      src: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format&fit=crop&q=80", // streetwear
      alt: "Pièce Streetwear"
    },
    {
      src: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=600&auto=format&fit=crop&q=80", // another fashion item
      alt: "Pièce Designer"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] overflow-x-hidden font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section
        className="relative w-full flex items-center overflow-hidden bg-charcoal-900"
        style={{
          height: '100svh',
          minHeight: '600px',
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#40271D', /* Chocolate brown fallback background color */
          }}
        >
          {/* Use CSS media queries to handle the background image and size */}
          <style dangerouslySetInnerHTML={{__html: `
            .hero-bg-container {
              background-image: url('/tel.png');
              background-size: cover;
              background-position: center center;
              background-repeat: no-repeat;
            }
            @media (min-width: 768px) {
              .hero-bg-container {
                background-image: url('/hero-bg.png');
                background-size: cover;
              }
            }
          `}} />
          <div className="absolute inset-0 w-full h-full hero-bg-container"></div>
        </div>
        
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        </div>
      </section>

      {/* 2. ENGAGEMENTS */}
      <section className="bg-white border-y border-sand-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="flex gap-4 items-start">
              <div className="rounded-full bg-sand-50 p-3 border border-sand-100 text-charcoal-800">
                <Shirt className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900">Pièces Uniques</h4>
                <p className="text-[10px] text-charcoal-450 font-light leading-snug">Chaque pièce est méticuleusement choisie pour son style unique.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="rounded-full bg-sand-50 p-3 border border-sand-100 text-charcoal-800">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900">Authenticité</h4>
                <p className="text-[10px] text-charcoal-450 font-light leading-snug">Pièces de créateurs 100% authentiques.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="rounded-full bg-sand-50 p-3 border border-sand-100 text-charcoal-800">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900">Envoi Rapide</h4>
                <p className="text-[10px] text-charcoal-450 font-light leading-snug">Livraison express à Dakar et partout au Sénégal.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="rounded-full bg-sand-50 p-3 border border-sand-100 text-charcoal-800">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900">Versatile Brand</h4>
                <p className="text-[10px] text-charcoal-450 font-light leading-snug">Une curation mode streetwear d'exception.</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 4. NEW ARRIVALS (Drop de la semaine) */}
      <section className="bg-white border-y border-sand-100 py-28 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Title Block Left */}
            <div className="lg:col-span-3 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta-600 block">Dernières créations</span>
                <h2 className="font-serif text-3xl font-bold text-charcoal-900 leading-tight">Nouveautés Atterries</h2>
                <div className="h-0.5 w-12 bg-terracotta-600 mx-auto lg:mx-0 mt-4" />
              </div>
              
              <p className="text-xs text-charcoal-450 leading-relaxed font-light">
                Découvrez nos derniers arrivages de pièces streetwear rares, d'accessoires et de sneakers à Dakar. Des pièces souvent uniques !
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-sm bg-charcoal-950 hover:bg-terracotta-600 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors w-full sm:w-auto text-center justify-center"
              >
                Voir toutes les nouveautés →
              </Link>
            </div>

            {/* Grid Right */}
            <div className="lg:col-span-9">
              {!isLoaded ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="h-8 w-8 border-4 border-sand-200 border-t-terracotta-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 5. EDITOR PICKS (Les coups de cœur KC) */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 sm:py-32">
        <div className="text-center space-y-2 mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta-600">Sélection</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">Les coups de cœur KC</h2>
          <div className="h-0.5 w-12 bg-terracotta-600 mx-auto mt-4" />
        </div>

        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 border-4 border-sand-200 border-t-terracotta-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. SOURCING PROCESS */}
      <section className="bg-sand-50 text-charcoal-900 py-28 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-4 mb-20">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta-600 block">Notre Curation</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Notre processus de création</h2>
            <p className="text-xs text-charcoal-500 font-light leading-relaxed">
              De la sélection minutieuse de pièces streetwear de qualité au choix rigoureux d'accessoires rares et pointus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sourcingSteps.map((step, idx) => (
              <div key={idx} className="border-t border-sand-200 pt-6 space-y-3 relative group">
                <span className="font-serif text-5xl font-light text-terracotta-100 absolute -top-8 left-0 select-none group-hover:text-terracotta-600 transition-colors duration-500">{step.num}</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-900 pt-2">{step.title}</h3>
                <p className="text-xs text-charcoal-500 leading-relaxed font-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ABOUT BLOCK */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta-600 block">À Propos de KC</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 leading-tight">Plus qu&apos;une marque, une passion.</h2>
            <p className="text-xs text-charcoal-450 leading-relaxed font-light">
              KnittaCorner est un concept store basé à Dakar, Sénégal. Fondé par Binta, notre univers associe une curation pointue de vêtements streetwear, des pièces d&apos;exception et une sélection de sneakers et accessoires tendance. Chaque article est choisi pour affirmer votre style au quotidien.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-charcoal-950 hover:text-terracotta-600 transition-colors pb-1 border-b border-charcoal-900 hover:border-terracotta-600"
            >
              En savoir plus →
            </Link>
          </div>

          {/* Right images lookbook grid (4 square styling) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xs border border-sand-100 bg-sand-50">
              <Image
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80"
                alt="Mules et slippers tendance"
                fill
                className="object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xs border border-sand-100 bg-sand-50">
              <Image
                src="https://images.unsplash.com/photo-1550614000-4b95d466f28b?w=500&auto=format&fit=crop&q=80"
                alt="Sélection Vintage"
                fill
                className="object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xs border border-sand-100 bg-sand-50">
              <Image
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=80"
                alt="Vêtement streetwear"
                fill
                className="object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xs border border-sand-100 bg-sand-50">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80"
                alt="Accessoires Streetwear"
                fill
                className="object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>



      {/* 9. TESTIMONIALS AVIS CLIENTS */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 sm:py-32">
        <div className="text-center space-y-2 mb-20">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta-600 block">Témoignages</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">Ce que disent nos collectionneuses</h2>
          <div className="h-0.5 w-12 bg-terracotta-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-sand-100 p-8 rounded-sm shadow-3xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-0.5 text-gold-500 text-xs">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-xs text-charcoal-500 leading-relaxed font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-sand-50 pt-4 flex items-center justify-between text-[10px]">
                <strong className="text-charcoal-900 uppercase tracking-wider">{t.author}</strong>
                <span className="text-charcoal-400 font-light uppercase tracking-wider">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. PREMIUM NEWSLETTER CARD */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8 sm:pb-32">
        <div className="relative rounded-sm overflow-hidden bg-sand-50 border border-sand-100 flex flex-col md:flex-row items-stretch min-h-[320px] shadow-3xs">
          
          {/* Decorative image side */}
          <div className="w-full md:w-1/3 relative h-64 md:h-auto bg-sand-200">
            <Image
              src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80"
              alt="Lifestyle drop"
              fill
              className="object-cover"
            />
          </div>

          {/* Form side */}
          <div className="w-full md:w-2/3 p-8 sm:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-terracotta-600 block">Newsletter</span>
              <h2 className="font-serif text-3xl font-bold text-charcoal-900">Ne manquez aucun arrivage</h2>
              <p className="text-xs text-charcoal-550 leading-relaxed font-light max-w-md">
                Inscrivez-vous pour recevoir les aperçus exclusifs de nos prochains drops mode avant leur mise en ligne.
              </p>
            </div>

            {/* Newsletter input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Inscription enregistrée avec succès !");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Votre adresse e-mail"
                className="flex-1 rounded-sm border border-sand-200 bg-white px-4 py-3 text-xs text-charcoal-950 placeholder-charcoal-400 focus:border-terracotta-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-sm bg-charcoal-900 py-3 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-terracotta-600 transition-colors text-center"
              >
                Rejoindre le club
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
