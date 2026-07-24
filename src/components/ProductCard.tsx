"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, ShoppingCart, Check, X } from "lucide-react";
import { Product } from "@/data/initialData";
import { useShop } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isWishlisted, addToCart, cart } = useShop();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const favorited = isWishlisted(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inStock) {
      addToCart(product);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  const getStars = (rating: number) => {
    const rounded = Math.round(rating || 5);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col bg-white border border-sand-100/60 overflow-hidden shadow-2xs hover:shadow-sm transition-all duration-300"
      >
        {/* Product Image Panel */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand-50">
          <Link href={`/product/${product.id}`}>
            {product.images && product.images.length > 0 && product.images[0] ? (
              product.images[0].match(/\.(mp4|mov|webm)$/i) || product.images[0].startsWith("data:video") ? (
                <video
                  src={product.images[0]}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                />
              ) : (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                />
              )
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
            )}
          </Link>

          {/* Sold out overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-charcoal-950/40 backdrop-blur-3xs flex items-center justify-center">
              <span className="font-serif text-sm font-bold tracking-widest text-white border-2 border-white px-4 py-2 uppercase rotate-[-6deg]">
                Épuisé
              </span>
            </div>
          )}

          {/* Wishlist Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute right-3.5 top-3.5 rounded-full bg-white/90 p-2 text-charcoal-800 shadow-3xs transition-all hover:scale-105 active:scale-95 hover:text-terracotta-600 hover:bg-white"
            aria-label="Ajouter aux favoris"
          >
            <Heart className={`h-4 w-4 ${favorited ? "fill-terracotta-600 text-terracotta-600" : ""}`} />
          </button>

          {/* Sizing Tags */}
          <div className="absolute left-3.5 top-3.5 flex flex-col gap-1 items-start">
            <span className="bg-charcoal-950 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
              {product.target}
            </span>
          </div>

          {/* Hover Quick Actions */}
          {product.inStock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full flex items-center justify-center p-3 bg-gradient-to-t from-black/50 to-transparent gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={() => setIsQuickViewOpen(true)}
                className="flex items-center justify-center rounded-sm bg-white p-2 text-charcoal-900 shadow-2xs hover:bg-sand-50 transition-colors"
                title="Aperçu rapide"
              >
                <Eye className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-sm bg-charcoal-950 py-2 px-3 text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs hover:bg-terracotta-600 disabled:bg-charcoal-500 transition-colors"
              >
                {addedAnimation ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : inCart ? (
                  "Panier"
                ) : (
                  "Ajouter"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Product Info Block */}
        <div className="p-4 flex flex-col flex-1 space-y-1 bg-white">
          {/* Brand Tag in Red Uppercase */}
          <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-terracotta-600">
            <span>{product.brand}</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-sm font-semibold text-charcoal-900 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Sizing & Condition Subtext */}
          <p className="text-[10px] text-charcoal-450 font-light">
            Taille {product.size} • {product.condition}
          </p>

          {/* Price & Rating Row */}
          <div className="flex items-center justify-between pt-1.5 mt-auto">
            <span className="text-sm font-bold text-charcoal-950 font-sans">{product.price} FCFA</span>
            {product.rating > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-gold-500 font-serif leading-none tracking-tighter">
                  {getStars(product.rating)}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <>
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Content container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-3xl overflow-hidden rounded-xs bg-[#FCFAF7] shadow-2xl border border-sand-100 flex flex-col md:flex-row"
              >
                {/* Close button */}
                <button
                  onClick={() => setIsQuickViewOpen(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-charcoal-800 hover:bg-sand-100 transition-colors shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Left Side: Image */}
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-black min-h-[300px]">
                  {product.images[0]?.match(/\.(mp4|mov|webm)$/i) || product.images[0]?.startsWith("data:video") ? (
                    <video
                      src={product.images[0]}
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={product.images[0] || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute left-4 top-4 flex flex-col gap-1 items-start">
                    <span className="bg-charcoal-950 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider rounded-xs">
                      {product.target}
                    </span>
                    <span className="bg-sand-100 text-charcoal-900 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs">
                      Taille {product.size}
                    </span>
                  </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600 block mb-1">
                      {product.brand}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-charcoal-900 leading-snug">
                      {product.name}
                    </h2>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-lg font-bold text-charcoal-950">{product.price} FCFA</span>
                      <span className="text-[10px] font-semibold text-terracotta-600">
                        {getStars(product.rating)} {product.condition}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-500 mt-4 leading-relaxed line-clamp-4 font-light">
                      {product.description}
                    </p>

                    {/* Sizing and Details */}
                    <div className="mt-4 border-t border-sand-100 pt-4 space-y-1.5">
                      <div className="text-[10px] font-bold text-charcoal-800 uppercase tracking-wider">Fiche technique :</div>
                      {product.details.slice(0, 3).map((detail, index) => (
                        <div key={index} className="text-[11px] text-charcoal-500 flex items-center gap-1.5 font-light">
                          <span className="h-1 w-1 rounded-full bg-sand-300"></span>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 space-y-2.5">
                    <button
                      onClick={(e) => {
                        handleAddToCart(e);
                        setIsQuickViewOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-sm bg-charcoal-900 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-colors shadow-xs"
                    >
                      {inCart ? "Déjà au panier" : "Ajouter au panier"}
                    </button>
                    
                    <button
                      onClick={() => {
                        toggleWishlist(product.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-sm border border-sand-200 bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-charcoal-800 hover:bg-sand-50 transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${favorited ? "fill-terracotta-600 text-terracotta-600" : ""}`} />
                      {favorited ? "Dans les favoris" : "Ajouter aux favoris"}
                    </button>

                    <Link
                      href={`/product/${product.id}`}
                      onClick={() => setIsQuickViewOpen(false)}
                      className="block text-center text-xs text-charcoal-400 hover:text-terracotta-600 underline font-medium pt-1"
                    >
                      Voir tous les détails et mesures
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
