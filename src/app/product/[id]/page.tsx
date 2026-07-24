"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowLeft, Shield, RotateCcw, Truck } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, addToCart, toggleWishlist, isWishlisted, cart, addReview, isLoaded } = useShop();

  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Re-sync active image when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-8 w-8 border-4 border-sand-200 border-t-terracotta-600 rounded-full animate-spin"></div>
          <p className="font-serif text-charcoal-500 font-bold">Chargement du vêtement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">Vêtement non trouvé</h2>
          <p className="text-sm text-charcoal-505 max-w-sm">Cette pièce a peut-être été vendue ou retirée de notre inventaire.</p>
          <Link href="/shop" className="rounded-sm bg-charcoal-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-terracotta-600 transition-colors">
            Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const favorited = isWishlisted(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);

  // Recommendations: products in same category (excl current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.inStock)
    .slice(0, 4);

  // Handle Review Submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewComment.trim()) {
      addReview(product.id, reviewRating, reviewComment.trim());
      setReviewComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    }
  };

  const conditionDescriptions: Record<string, string> = {
    "Très bon état": "Article vintage impeccable. Aucun signe d'usure notable, tache, trou ou retouche. État comme neuf.",
    "Bon état": "Présente une usure normale, de légères traces d'utilisation ou décoloration. Ajoute du caractère vintage.",
    "Usure naturelle": "Usure visible ou marques esthétiques mineures (ex. petites taches ou décoloration). Vêtement solide et authentique."
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/shop"
            prefetch={true}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-charcoal-500 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>
        </div>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs border border-sand-100 bg-black">
              {(activeImage || product.images[0])?.match(/\.(mp4|mov|webm)$/i) || (activeImage || product.images[0])?.startsWith("data:video") ? (
                <video
                  src={activeImage || product.images[0]}
                  muted
                  playsInline
                  autoPlay
                  loop
                  controls
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={activeImage || (product.images && product.images.length > 0 && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80")}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                  <span className="font-serif text-2xl font-bold tracking-widest text-white border-4 border-white px-6 py-3 uppercase rotate-[-6deg]">
                    Épuisé
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-20 w-16 overflow-hidden rounded-sm border bg-black transition-colors ${
                      activeImage === img ? "border-terracotta-600 scale-103" : "border-sand-200 hover:border-charcoal-400"
                    }`}
                  >
                    {img.match(/\.(mp4|mov|webm)$/i) || img.startsWith("data:video") ? (
                      <video src={img} className="object-cover w-full h-full" muted />
                    ) : (
                      <Image
                        src={img}
                        alt={`${product.name} vue ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Information */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-4">
              {/* Brand & Stars */}
              <div className="flex items-center justify-between">
                <span suppressHydrationWarning className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
                  {product.brand}
                </span>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gold-500 font-medium">
                    <span className="text-base">★</span> {product.rating}
                    <span suppressHydrationWarning className="text-charcoal-400 font-light">({product.reviews.length} avis)</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 suppressHydrationWarning className="font-serif text-3xl font-bold text-charcoal-900 leading-tight">
                {product.name}
              </h1>

              {/* Price & Availability */}
              <div className="flex items-baseline gap-4 pt-1">
                <span suppressHydrationWarning className="text-2xl font-bold text-charcoal-950">{product.price} FCFA</span>
                {product.inStock ? (
                  <span suppressHydrationWarning className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
                    1 seul disponible (Pièce unique)
                  </span>
                ) : (
                  <span suppressHydrationWarning className="text-[10px] text-charcoal-500 bg-sand-100 border border-sand-200 font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Épuisé
                  </span>
                )}
              </div>

              {/* Target & Sizing Info */}
              <div translate="no" className="border-t border-sand-100 pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 block">Public Cible</span>
                  <span className="inline-block bg-charcoal-900 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xs">
                    {product.target === "Enfant" ? "Enfant (Petit)" : product.target}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 block">Taille disponible</span>
                  <span className="inline-block border-2 border-charcoal-900 font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 bg-white rounded-xs">
                    {product.size}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-charcoal-450 font-light mt-2 leading-relaxed">
                Équivaut à une taille {product.size} moderne. Vérifiez attentivement les mesures à plat listées ci-dessous avant d&apos;acheter.
              </p>

              {/* Description Section */}
              <div className="border-t border-sand-100 pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">Description de l'article</h3>
                <div className="p-3 bg-sand-50 border border-sand-100 rounded-sm">
                  <p className="text-xs text-charcoal-600 leading-relaxed font-light whitespace-pre-line">
                    {product.description || "Aucune description fournie pour cet article."}
                  </p>
                </div>
              </div>

            </div>

            {/* Shopping Action Box */}
            <div className="border-t border-sand-100 pt-6 space-y-3">
              <div className="flex gap-4">
                <button
                  onClick={() => product.inStock && addToCart(product)}
                  disabled={!product.inStock || inCart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-sm py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 disabled:bg-charcoal-300 disabled:cursor-not-allowed transition-colors bg-charcoal-900 shadow-sm"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  {inCart ? "Ajouté au panier" : product.inStock ? "Ajouter au panier" : "Épuisé"}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="rounded-sm border border-sand-200 bg-white p-4 text-charcoal-800 hover:bg-sand-50 transition-colors"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart className={`h-5 w-5 ${favorited ? "fill-terracotta-600 text-terracotta-600" : ""}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                <div className="p-3 bg-white border border-sand-100 rounded-sm flex flex-col items-center justify-center space-y-1">
                  <Truck className="h-4 w-4 text-charcoal-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-charcoal-800">Envoi Éco</span>
                  <span className="text-[8px] text-charcoal-400">Carbone Neutre</span>
                </div>
                <div className="p-3 bg-white border border-sand-100 rounded-sm flex flex-col items-center justify-center space-y-1">
                  <Shield className="h-4 w-4 text-charcoal-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-charcoal-800">Inspecté</span>
                  <span className="text-[8px] text-charcoal-400">100% Authentique</span>
                </div>
                <div className="p-3 bg-white border border-sand-100 rounded-sm flex flex-col items-center justify-center space-y-1">
                  <RotateCcw className="h-4 w-4 text-charcoal-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-charcoal-800">Vente Finale</span>
                  <span className="text-[8px] text-charcoal-400">Pas de Retour</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed / Additional Reviews Section */}
        <section className="mt-20 border-t border-sand-200 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews list */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-serif text-xl font-semibold text-charcoal-900 border-b border-sand-100 pb-3">
                Avis Clients ({product.reviews.length})
              </h3>
              
              {product.reviews.length === 0 ? (
                <p className="text-sm italic text-charcoal-400">Aucun avis n&apos;a encore été rédigé pour ce vêtement. Soyez le premier !</p>
              ) : (
                <div className="space-y-6 divide-y divide-sand-100">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-charcoal-900">{rev.user}</span>
                          <span className="text-xs text-charcoal-400">{rev.date}</span>
                        </div>
                        <div className="flex text-gold-500 text-xs">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx}>{idx < rev.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-charcoal-500 leading-relaxed font-light">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5 bg-white border border-sand-100 p-6 rounded-xs space-y-4">
              <h4 className="font-serif text-lg font-semibold text-charcoal-900">Rédiger un avis</h4>
              <p className="text-[11px] text-charcoal-400">Votre avis aide les autres membres de la communauté.</p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-800">Note globale</label>
                  <div className="flex gap-2 text-xl text-gold-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="hover:scale-110 transition-transform focus:outline-none"
                      >
                        {star <= reviewRating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment textarea */}
                <div className="space-y-1.5">
                  <label htmlFor="comment" className="text-xs font-bold uppercase tracking-wider text-charcoal-800">Commentaires</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Dites-nous ce que vous pensez de la taille, de la qualité ou de l'authenticité..."
                    required
                    className="w-full rounded-sm border border-sand-200 bg-sand-50 p-3 text-xs text-charcoal-950 placeholder-charcoal-400 focus:border-terracotta-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-sm bg-charcoal-900 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-colors shadow-2xs"
                >
                  Soumettre l&apos;avis
                </button>

                {reviewSuccess && (
                  <p className="text-xs font-semibold text-emerald-600 text-center animate-fade-in">
                    Merci ! Votre avis a bien été enregistré.
                  </p>
                )}
              </form>
            </div>

          </div>
        </section>

        {/* Related Products drop */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-sand-200 pt-16">
            <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-8 text-center sm:text-left">
              Vous aimerez aussi...
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
