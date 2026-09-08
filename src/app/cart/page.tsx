"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity } = useShop();

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = 2000;
  const grandTotal = cartTotal + shippingFee;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-8">Votre Panier</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="rounded-full bg-sand-50 p-8 border border-sand-100">
              <ShoppingBagIcon />
            </div>
            <div>
              <h2 className="font-serif text-xl font-medium text-charcoal-900">Votre panier est vide</h2>
              <p className="text-xs text-charcoal-400 mt-1 max-w-xs">
                Découvrez nos pièces crochetées à la main et notre sélection beauté pour trouver votre bonheur !
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-sm bg-charcoal-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-colors"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Cart Items list */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-sm">
                <strong>Attention :</strong> Certains de nos articles faits main ont un stock limité. Un article reste disponible pour les autres acheteurs tant que la commande n&apos;est pas entièrement réglée.
              </div>

              <div className="border border-sand-100 rounded-sm bg-white divide-y divide-sand-100 shadow-3xs">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      {/* Image */}
                      <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-sand-200 bg-sand-50">
                        {(() => {
                          const imgSrc = item.selectedImage || item.product.images[0];
                          if (imgSrc?.match(/\.(mp4|mov|webm)$/i) || imgSrc?.startsWith("data:video")) {
                            return <video src={imgSrc} className="object-cover w-full h-full" muted />;
                          }
                          return (
                            <Image
                              src={imgSrc}
                              alt={item.product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          );
                        })()}
                      </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600">
                          {item.product.brand}
                        </span>
                      </div>
                      <Link href={`/product/${item.product.id}`} className="block mt-1">
                        <h3 className="font-serif text-base font-semibold text-charcoal-900 hover:text-terracotta-600 transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-charcoal-400">
                        <span>Taille : <strong className="text-charcoal-700 font-semibold">{item.selectedSize || item.product.size}</strong></span>
                        <span className="h-3 w-px bg-sand-200"></span>
                        <span>État : <strong className="text-charcoal-700 font-semibold">{item.product.condition}</strong></span>
                      </div>
                      <span className="text-sm font-bold text-charcoal-950 block mt-2">{item.product.price} FCFA</span>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-sand-50 mt-4 sm:mt-0 gap-4">
                      <div className="flex items-center border border-sand-200 rounded-sm">
                        <button
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-charcoal-500 hover:bg-sand-50 disabled:opacity-50 transition-colors text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold px-2 min-w-[24px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.product.stockCount || 1)}
                          className={`px-3 border-l border-sand-200 transition-colors ${item.quantity >= (item.product.stockCount || 1) ? 'text-sand-300 cursor-not-allowed' : 'text-charcoal-400 hover:bg-sand-50 hover:text-charcoal-900'}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-charcoal-400 hover:text-red-500 transition-colors flex items-center gap-1 p-1.5"
                      >
                        <Trash2 className="h-4 w-4" /> <span className="sm:hidden">Retirer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Back to Shop link */}
              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-500 hover:text-terracotta-600 transition-colors mt-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Continuer à chiner
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-sand-100 rounded-sm p-6 shadow-2xs space-y-4">
                <h2 className="font-serif text-lg font-semibold text-charcoal-900 border-b border-sand-100 pb-3">Récapitulatif</h2>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-charcoal-500">
                    <span>Sous-total panier</span>
                    <span>{cartTotal} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-charcoal-500 font-medium">
                    <span>Livraison</span>
                    <span className="text-right max-w-[120px]">{shippingFee} FCFA</span>
                  </div>
                  <div className="border-t border-sand-150 pt-3 flex justify-between text-sm font-bold text-charcoal-950">
                    <span className="font-serif">Total Général</span>
                    <span>{grandTotal} FCFA</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 rounded-sm bg-charcoal-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-all shadow-xs"
                  >
                    Valider la commande <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Guarantees card */}
              <div className="bg-[#FAF7F2] border border-sand-200 rounded-sm p-5 space-y-3">
                <div className="flex gap-3 text-xs text-charcoal-600">
                  <ShieldCheck className="h-5 w-5 text-olive-600 flex-shrink-0" />
                  <div>
                    <strong className="font-semibold text-charcoal-900 block mb-0.5">Paiement Sécurisé</strong>
                    Toutes les transactions sont chiffrées et sécurisées.
                  </div>
                </div>
                <div className="text-[10px] text-charcoal-400 pl-8 leading-normal font-light">
                  Les vêtements d&apos;occasion sont vendus sans retour. Nous garantissons l&apos;authenticité de tous nos modèles et la précision des mesures à plat.
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Simple bag SVG icon
function ShoppingBagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-charcoal-350"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}
