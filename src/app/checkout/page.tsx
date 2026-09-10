"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { useShop, Order } from "@/context/ShopContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, placeOrder } = useShop();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = 2000;
  const grandTotal = cartTotal + shippingFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    try {
      const order = await placeOrder(shippingInfo);
      
      let text = `Bonjour KnittaCorner !%0AJe souhaite valider ma commande :%0A%0A`;
      text += `*Destinataire:* ${shippingInfo.firstName} ${shippingInfo.lastName}%0A`;
      text += `*Téléphone:* ${shippingInfo.phone}%0A`;
      text += `*Adresse:* ${shippingInfo.address}%0A%0A`;
      text += `*Articles:*%0A`;
      cart.forEach(item => {
        text += `- ${item.quantity}x ${item.product.name} (Taille: ${item.selectedSize || item.product.size}) - ${item.product.price} FCFA%0A`;
      });
      text += `%0A*Sous-total:* ${cartTotal} FCFA%0A`;
      text += `*Livraison:* ${shippingFee} FCFA%0A`;
      text += `*Total à payer:* ${grandTotal} FCFA%0A%0A`;
      text += `Merci !`;

      const whatsappUrl = `https://wa.me/221771704895?text=${text}`;
      window.open(whatsappUrl, '_blank');

      setPlacedOrder(order);
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
        <Navbar />
        
        <main className="flex-1 mx-auto max-w-xl w-full px-4 py-16 text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="rounded-full bg-emerald-50 p-6 border border-emerald-100 text-emerald-600">
              <CheckCircle className="h-14 w-14" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">Commande validée avec succès !</h1>
          </motion.div>

          <div className="bg-white border border-sand-100 rounded-sm p-6 text-left space-y-4 shadow-3xs">
            <h2 className="font-serif text-sm font-semibold text-charcoal-900 border-b border-sand-100 pb-2">Détails de la commande</h2>
            
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-charcoal-400">Référence de commande :</span>
              <strong className="text-charcoal-900 text-right">{placedOrder.id}</strong>
              
              <span className="text-charcoal-400">Date :</span>
              <span className="text-charcoal-900 text-right">{placedOrder.date}</span>

              <span className="text-charcoal-400">Montant (hors livraison) :</span>
              <strong className="text-charcoal-955 text-right">{placedOrder.total} FCFA</strong>

              <span className="text-charcoal-400">Destinataire :</span>
              <span className="text-charcoal-900 text-right">{placedOrder.customerName}</span>

              <span className="text-charcoal-400">Adresse de livraison :</span>
              <span className="text-charcoal-900 text-right font-light leading-normal">
                {placedOrder.address}, {placedOrder.city}, {placedOrder.zipCode}
              </span>
            </div>

            <div className="p-3 bg-sand-50 border border-sand-100 text-[10px] text-charcoal-500 rounded-sm text-center">
              Un SMS de confirmation a été envoyé au <strong>{placedOrder.customerPhone}</strong>.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/account"
              className="flex-1 rounded-sm bg-charcoal-900 py-3 text-xs font-bold uppercase tracking-wider text-white text-center hover:bg-terracotta-600 transition-colors"
            >
              Suivre la commande (Compte)
            </Link>
            <Link
              href="/shop"
              className="flex-1 rounded-sm border border-charcoal-900 bg-transparent py-3 text-xs font-bold uppercase tracking-wider text-charcoal-800 text-center hover:bg-sand-50 transition-colors"
            >
              Continuer à chiner
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-charcoal-500 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au panier
          </Link>
        </div>

        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mb-8">Paiement</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-charcoal-500 mb-4">Votre panier est vide. Veuillez ajouter des articles avant de passer au paiement.</p>
            <Link href="/shop" className="rounded-sm bg-charcoal-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-terracotta-600 transition-colors">
              Retour au catalogue
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Shipping & Payment Info */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address card */}
              <div className="bg-white border border-sand-100 rounded-sm p-6 sm:p-8 space-y-4 shadow-3xs">
                <h2 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-terracotta-600" /> Adresse de livraison
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ship-firstname" className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800">Prénom *</label>
                    <input
                      id="ship-firstname"
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      placeholder="ex. Jean"
                      className="w-full rounded-sm border border-sand-200 bg-[#FCFAF7] px-3.5 py-2.5 text-xs text-charcoal-950 focus:border-terracotta-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="ship-lastname" className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800">Nom *</label>
                    <input
                      id="ship-lastname"
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      placeholder="ex. Dupont"
                      className="w-full rounded-sm border border-sand-200 bg-[#FCFAF7] px-3.5 py-2.5 text-xs text-charcoal-950 focus:border-terracotta-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="ship-phone" className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800">Numéro de téléphone *</label>
                    <input
                      id="ship-phone"
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      placeholder="ex. 77 123 45 67"
                      className="w-full rounded-sm border border-sand-200 bg-[#FCFAF7] px-3.5 py-2.5 text-xs text-charcoal-950 focus:border-terracotta-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="ship-address" className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800">Adresse de livraison *</label>
                    <input
                      id="ship-address"
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="ex. Sicap Baobab, Dakar"
                      className="w-full rounded-sm border border-sand-200 bg-[#FCFAF7] px-3.5 py-2.5 text-xs text-charcoal-950 focus:border-terracotta-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details card */}
              <div className="bg-white border border-sand-100 rounded-sm p-6 sm:p-8 space-y-4 shadow-3xs">
                <h2 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-terracotta-600" /> Paiement à la livraison
                </h2>

                <div className="p-4 bg-sand-50 border border-sand-100 text-xs text-charcoal-600 rounded-sm leading-relaxed">
                  <strong>Paiement sécurisé à la réception :</strong> Vous réglerez votre commande en espèces (ou via Wave/Orange Money) directement au livreur lors de la réception de votre colis. <strong>Délai de livraison estimé : 3 à 5 jours.</strong>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Review */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-sand-100 rounded-sm p-6 shadow-2xs space-y-4">
                <h2 className="font-serif text-lg font-semibold text-charcoal-900 border-b border-sand-100 pb-3 flex items-center gap-2">
                  <ShoppingBag className="h-4.5 w-4.5 text-terracotta-600" /> Vos articles ({cart.length})
                </h2>

                {/* Items list */}
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {cart.map((item) => {
                    const imgSrc = item.selectedImage || item.product.images[0];
                    return (
                      <div key={item.product.id + (item.selectedSize || '') + (item.selectedImage || '')} className="flex gap-3 items-center">
                        <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden rounded-xs border border-sand-200 bg-sand-50">
                          {imgSrc?.match(/\.(mp4|mov|webm)$/i) || imgSrc?.startsWith("data:video") ? (
                            <video src={imgSrc} className="object-cover w-full h-full" muted />
                          ) : (
                            <Image
                              src={imgSrc}
                              alt={item.product.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-xs font-semibold text-charcoal-900 line-clamp-1">{item.product.name}</h4>
                          <p className="text-[10px] text-charcoal-400 mt-0.5">Qté : {item.quantity} | Taille : {item.selectedSize || item.product.size} | Marque : {item.product.brand}</p>
                        </div>
                        <span className="text-xs font-bold text-charcoal-950 text-right">{item.product.price * item.quantity} FCFA</span>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing Summary */}
                <div className="border-t border-sand-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-charcoal-500">
                    <span>Sous-total</span>
                    <span>{cartTotal} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-charcoal-500 font-medium">
                    <span>Frais de livraison</span>
                    <span className="text-right max-w-[120px]">{shippingFee} FCFA</span>
                  </div>
                  <div className="border-t border-sand-155 pt-3 flex justify-between text-sm font-bold text-charcoal-950">
                    <span className="font-serif">Total Général</span>
                    <span>{grandTotal} FCFA</span>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-sm bg-charcoal-900 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 disabled:bg-charcoal-350 disabled:cursor-not-allowed transition-all shadow-xs"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        {/* Simple Spinner */}
                        <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Ouverture WhatsApp...
                      </span>
                    ) : (
                      `Valider sur WhatsApp • ${grandTotal} FCFA`
                    )}
                  </button>
                </div>
              </div>
            </div>

          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
