"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart, User, Search, X, Trash2, ArrowRight, Menu } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { cart, wishlist, currentUser, removeFromCart, updateCartItemQuantity } = useShop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const isHome = pathname === "/";
  const scrolledStyle = "bg-[#FCFAF7]/95 backdrop-blur-md border-b border-sand-100 shadow-2xs text-charcoal-900";
  const transparentStyle = "bg-transparent border-transparent text-white";

  return (
    <>
      <header
        className={`top-0 left-0 w-full z-45 transition-all duration-300 ${
          isHome ? "fixed" : "sticky"
        } ${isHome && !isScrolled ? transparentStyle : scrolledStyle}`}
      >


        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Menu Hamburger */}
          <nav className="flex items-center w-1/3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`transition-colors relative p-2 rounded-full -ml-2 ${
                isHome && !isScrolled ? "text-white hover:bg-white/10" : "text-charcoal-800 hover:bg-sand-50"
              }`}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </nav>

          {/* Logo */}
          <div className="flex items-center justify-center w-1/3">
            <Link href="/" className="flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="KnittaCorner" 
                width={50} 
                height={50} 
                className="object-contain h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Icon Shortcuts */}
          <div className="flex items-center justify-end space-x-3.5 w-1/3">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`transition-colors relative p-2 rounded-full ${
                isHome && !isScrolled ? "text-white hover:bg-white/10" : "text-charcoal-800 hover:bg-sand-50"
              }`}
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/account?tab=wishlist"
              className={`transition-colors relative p-2 rounded-full ${
                isHome && !isScrolled ? "text-white hover:bg-white/10" : "text-charcoal-800 hover:bg-sand-50"
              }`}
              aria-label="Favoris"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta-600 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`transition-colors relative p-2 rounded-full ${
                isHome && !isScrolled ? "text-white hover:bg-white/10" : "text-charcoal-800 hover:bg-sand-50"
              }`}
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal-900 text-[9px] font-bold text-white border border-[#FCFAF7]">
                  {cart.length}
                </span>
              )}
            </button>


          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-sand-100 bg-[#FCFAF7] overflow-hidden"
            >
              <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher dans notre vintage sélectionné (ex. Levi's, veste, cuir...)"
                    className="w-full border-b border-sand-200 bg-transparent py-3 pl-4 pr-10 text-charcoal-900 placeholder-charcoal-400 focus:border-terracotta-600 focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-3 text-charcoal-800 hover:text-terracotta-600">
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed top-0 left-0 h-full w-72 max-w-[85vw] z-50 bg-[#FCF9FA] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-sand-100">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image src="/logo.png" alt="KnittaCorner" width={80} height={40} className="object-contain h-10 w-auto" />
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-sand-100 text-charcoal-800 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
                {[
                  { href: "/shop", label: "Boutique" },
                  { href: "/shop?isNewArrival=true", label: "Nouveautés" },
                  { href: "/shop?isBestSeller=true", label: "Meilleures Ventes" },
                  { href: "/about", label: "À Propos" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 text-sm font-semibold text-charcoal-800 hover:text-terracotta-600 border-b border-sand-100 transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="px-6 py-5 border-t border-sand-100 text-[10px] text-charcoal-400 space-y-1">
                <p>Instagram: <a href="https://www.instagram.com/knitta_corner/" target="_blank" rel="noopener noreferrer" className="text-terracotta-600 hover:underline">@knitta_corner</a></p>
                <p>Email: <a href="mailto:bintaandoy@gmail.com" className="text-terracotta-600 hover:underline">bintaandoy@gmail.com</a></p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Side Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#FCFAF7] shadow-xl border-l border-sand-100"
            >
              <div className="flex items-center justify-between border-b border-sand-100 px-6 py-5">
                <h2 className="font-serif text-xl font-semibold text-charcoal-900 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-terracotta-600" /> Votre Panier
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1.5 hover:bg-sand-100 transition-colors text-charcoal-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-sand-50 p-6 border border-sand-100">
                      <ShoppingBag className="h-10 w-10 text-charcoal-400" />
                    </div>
                    <div>
                      <p className="font-serif text-lg font-medium text-charcoal-900">Votre panier est vide</p>
                      <p className="text-sm text-charcoal-400 mt-1">Découvrez des pièces uniques 1-of-1 dans notre catalogue.</p>
                    </div>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-flex items-center justify-center rounded-sm bg-charcoal-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-terracotta-600 transition-colors"
                    >
                      Découvrir les nouveautés
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-sm mb-4">
                      <strong>Note :</strong> Certains de nos articles faits main ont un stock limité.
                    </div>
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 border-b border-sand-100 pb-4"
                      >
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-sm border border-sand-200 bg-black">
                          {item.product.images[0]?.match(/\.(mp4|mov|webm)$/i) || item.product.images[0]?.startsWith("data:video") ? (
                            <video src={item.product.images[0]} className="object-cover w-full h-full" muted />
                          ) : (
                            <Image
                              src={item.product.images[0] || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-600">
                            {item.product.brand}
                          </span>
                          <h3 className="font-serif text-sm font-semibold text-charcoal-900 line-clamp-1">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-charcoal-400">Taille : {item.product.size}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-sand-100 text-charcoal-800">
                              {item.product.condition}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-charcoal-950 block mt-1">
                            {item.product.price} FCFA
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-charcoal-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                          <div className="flex items-center border border-sand-200 rounded-sm">
                            <button
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-1.5 text-charcoal-500 hover:bg-sand-50 disabled:opacity-50 transition-colors text-xs"
                            >
                              -
                            </button>
                            <span className="text-[10px] font-semibold px-1 min-w-[16px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= (item.product.stockCount || 1)}
                              className={`p-1 transition-colors ${item.quantity >= (item.product.stockCount || 1) ? 'text-sand-300 cursor-not-allowed' : 'text-charcoal-400 hover:text-charcoal-900'}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="border-t border-sand-100 bg-sand-50 px-6 py-6 space-y-4">
                  <div className="flex items-center justify-between text-base font-semibold text-charcoal-900">
                    <span className="font-serif">Sous-total</span>
                    <span className="font-bold">{cartTotal} FCFA</span>
                  </div>
                  <p className="text-xs text-charcoal-400">
                    Livraison et taxes calculées lors du paiement. Les articles d&apos;occasion sont en vente finale.
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-sm bg-charcoal-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-all shadow-sm"
                    >
                      Passer au paiement <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="flex w-full items-center justify-center rounded-sm border border-charcoal-900 bg-transparent py-3.5 text-xs font-bold uppercase tracking-widest text-charcoal-900 hover:bg-sand-100 transition-colors"
                    >
                      Voir le panier
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
