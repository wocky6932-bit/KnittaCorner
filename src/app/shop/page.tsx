"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SlidersHorizontal, ArrowUpDown, RotateCcw, Search, X } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, BRANDS, SIZES, TARGETS } from "@/data/initialData";
import { motion, AnimatePresence } from "framer-motion";

function ShopContent() {
  const { products, isLoaded } = useShop();
  const searchParams = useSearchParams();
  const router = useRouter();

  const router = useRouter();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [selectedSize, setSelectedSize] = useState("Tout");
  const [selectedBrand, setSelectedBrand] = useState("Tout");
  const [selectedTarget, setSelectedTarget] = useState("Tout");
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync initial filters with URL parameters if present
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const target = searchParams.get("target");

    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
    if (brand) setSelectedBrand(brand);
    if (size) setSelectedSize(size);
    if (target) setSelectedTarget(target);
  }, [searchParams]);

  // Clean filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Tout");
    setSelectedSize("Tout");
    setSelectedBrand("Tout");
    setSelectedTarget("Tout");
    setPriceRange(50000);
    setSortBy("newest");
    router.replace("/shop");
  };

  // Filter and Sort execution
  const filteredProducts = products.filter((product) => {
    // Only display items that are in stock for normal shoppers
    if (!product.inStock) return false;

    // Search Query match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    // Category match
    const matchesCategory = selectedCategory === "Tout" || product.category === selectedCategory;

    // Size match
    const matchesSize = selectedSize === "Tout" || product.size === selectedSize;

    // Brand match
    const matchesBrand = selectedBrand === "Tout" || product.brand === selectedBrand;

    // Target match
    const matchesTarget = selectedTarget === "Tout" || product.target === selectedTarget;

    // Price match
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesSize && matchesBrand && matchesPrice && matchesTarget;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    
    // Default or "newest" sorting (using ID or position)
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <Navbar />

      {/* Page Header */}
      <section className="bg-sand-50 border-b border-sand-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            {selectedCategory === "Tout" ? "La Boutique" : `${selectedCategory}`}
          </h1>
          <p className="text-xs text-charcoal-400 uppercase tracking-widest">
            Pièces streetwear, mode & vintage ({filteredProducts.length} articles)
          </p>
        </div>
      </section>

      {/* Main Shop Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <div className="flex gap-10">
          
          {/* LEFT SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <span className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5" /> Filtres
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 hover:text-terracotta-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Réinitialiser
              </button>
            </div>

            {/* Search Filter */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-bold tracking-wider text-charcoal-800">Rechercher</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tapez un mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-sm border border-sand-200 bg-white py-2 pl-3 pr-8 text-xs text-charcoal-900 focus:border-terracotta-600 focus:outline-none"
                />
                <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-charcoal-400" />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-bold tracking-wider text-charcoal-800">Catégories</label>
              <div className="flex flex-col space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs py-1.5 transition-colors hover:text-terracotta-600 ${
                      selectedCategory === cat ? "text-terracotta-600 font-semibold" : "text-charcoal-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience Filter */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-bold tracking-wider text-charcoal-800">Public cible</label>
              <div className="flex flex-col space-y-1">
                {TARGETS.map((targ) => (
                  <button
                    key={targ}
                    onClick={() => setSelectedTarget(targ)}
                    className={`text-left text-xs py-1.5 transition-colors hover:text-terracotta-600 ${
                      selectedTarget === targ ? "text-terracotta-600 font-semibold" : "text-charcoal-500"
                    }`}
                  >
                    {targ}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-bold tracking-wider text-charcoal-800">Tailles</label>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`border py-1.5 text-[10px] font-bold uppercase rounded-sm transition-colors text-center ${
                      selectedSize === sz
                        ? "bg-charcoal-900 border-charcoal-900 text-white"
                        : "border-sand-200 bg-white text-charcoal-500 hover:border-charcoal-800 hover:text-charcoal-900"
                    }`}
                  >
                    {sz === "Tout" ? "TOUT" : sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-bold tracking-wider text-charcoal-800">Marques</label>
              <div className="flex flex-col space-y-1">
                {BRANDS.map((br) => (
                  <button
                    key={br}
                    onClick={() => setSelectedBrand(br)}
                    className={`text-left text-xs py-1.5 transition-colors hover:text-terracotta-600 ${
                      selectedBrand === br ? "text-terracotta-600 font-semibold" : "text-charcoal-500"
                    }`}
                  >
                    {br}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs uppercase font-bold tracking-wider text-charcoal-800">
                <span>Prix max</span>
                <span className="font-bold text-terracotta-600">{priceRange} FCFA</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-terracotta-600 bg-sand-200 rounded-lg appearance-none cursor-pointer h-1.5"
              />
              <div className="flex items-center justify-between text-[10px] text-charcoal-400">
                <span>0 FCFA</span>
                <span>50 000 FCFA</span>
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE PRODUCT GRID */}
          <main className="flex-1 space-y-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-sand-100 pb-4">
              {/* Mobile Filter toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 border border-sand-200 bg-white py-2 px-4 rounded-sm text-xs font-semibold text-charcoal-800 shadow-3xs"
              >
                <Filter className="h-4 w-4" /> Filtres
              </button>

              <span className="hidden sm:inline text-xs text-charcoal-400">
                Affichage de <strong className="text-charcoal-800">{sortedProducts.length}</strong> pièces uniques
              </span>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs text-charcoal-400 flex items-center gap-1 font-light">
                  <ArrowUpDown className="h-3.5 w-3.5 text-charcoal-500" /> Tri :
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-sand-200 py-1.5 px-3 rounded-sm text-xs font-semibold text-charcoal-800 focus:outline-none focus:border-terracotta-600 cursor-pointer"
                >
                  <option value="newest">Nouveautés</option>
                  <option value="price-low">Prix : Du - au +</option>
                  <option value="price-high">Prix : Du + au -</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
            </div>

            {/* Products catalog grid */}
            {!isLoaded ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4">
                <div className="h-8 w-8 border-4 border-sand-200 border-t-terracotta-600 rounded-full animate-spin"></div>
                <p className="font-serif text-charcoal-500 font-bold">Chargement de la collection...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-4">
                <div className="rounded-full bg-sand-50 p-6 border border-sand-100">
                  <SlidersHorizontal className="h-10 w-10 text-charcoal-300" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-charcoal-900">Aucun vêtement ne correspond</h3>
                  <p className="text-sm text-charcoal-400 mt-1 max-w-md">
                    Essayez d&apos;ajuster vos filtres, de modifier votre recherche ou de réinitialiser vos paramètres.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="rounded-sm bg-charcoal-900 py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-terracotta-600 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
            />

            {/* Slide-up bottom or side drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-[#FCFAF7] shadow-xl border-r border-sand-100 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-sand-100 px-6 py-5">
                <span className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5" /> Filtres
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="rounded-full p-1.5 hover:bg-sand-100 transition-colors text-charcoal-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-charcoal-850">Rechercher</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tapez un mot-clé..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-sm border border-sand-200 bg-white py-2 pl-3 pr-8 text-xs focus:outline-none"
                    />
                    <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-charcoal-400" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-charcoal-850">Catégories</label>
                  <div className="flex flex-col space-y-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left text-xs py-1 transition-colors ${
                          selectedCategory === cat ? "text-terracotta-600 font-bold" : "text-charcoal-500"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Group */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-charcoal-850">Public cible</label>
                  <div className="flex flex-col space-y-1.5">
                    {TARGETS.map((targ) => (
                      <button
                        key={targ}
                        onClick={() => setSelectedTarget(targ)}
                        className={`text-left text-xs py-1 transition-colors ${
                          selectedTarget === targ ? "text-terracotta-600 font-bold" : "text-charcoal-500"
                        }`}
                      >
                        {targ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-charcoal-850">Tailles</label>
                  <div className="grid grid-cols-4 gap-2">
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`border py-1.5 text-[10px] font-bold rounded-sm text-center ${
                          selectedSize === sz
                            ? "bg-charcoal-900 border-charcoal-900 text-white"
                            : "border-sand-200 bg-white text-charcoal-500"
                        }`}
                      >
                        {sz === "Tout" ? "TOUT" : sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-charcoal-850">Marques</label>
                  <div className="flex flex-col space-y-1.5">
                    {BRANDS.map((br) => (
                      <button
                        key={br}
                        onClick={() => setSelectedBrand(br)}
                        className={`text-left text-xs py-1 transition-colors ${
                          selectedBrand === br ? "text-terracotta-600 font-bold" : "text-charcoal-500"
                        }`}
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase font-bold tracking-wider text-charcoal-850">
                    <span>Prix max</span>
                    <span className="font-bold text-terracotta-600">{priceRange} FCFA</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-terracotta-600 bg-sand-200 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-charcoal-400 mt-1">
                    <span>0 FCFA</span>
                    <span>50 000 FCFA</span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-sand-100 bg-sand-50 p-4 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full rounded-sm bg-charcoal-900 py-3 text-xs font-bold uppercase tracking-wider text-white text-center hover:bg-terracotta-600 transition-colors"
                >
                  Voir les {filteredProducts.length} articles
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full rounded-sm border border-sand-200 bg-white py-3 text-xs font-bold uppercase tracking-wider text-charcoal-800 text-center hover:bg-sand-100 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-between bg-[#FCFAF7]">
        <div className="h-20 bg-white border-b border-sand-100 flex items-center justify-center font-serif font-bold text-lg text-charcoal-500">Chargement du catalogue...</div>
        <div className="flex-1 flex items-center justify-center font-serif text-sm italic text-charcoal-400">Veuillez patienter pendant la récupération de notre catalogue...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
