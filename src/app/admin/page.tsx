"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package,
  AlertCircle,
  Edit,
  Eye,
  X
} from "lucide-react";
import { useShop, Order } from "@/context/ShopContext";
import { Product, CATEGORIES, BRANDS, SIZES, CONDITIONS, TARGETS } from "@/data/initialData";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const ADMIN_PASSWORD = "Ma12344321";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const auth = localStorage.getItem("kc_admin_auth");
        if (auth === "true") {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("localStorage error:", e);
      } finally {
        setIsAuthLoaded(true);
      }
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      try { localStorage.setItem("kc_admin_auth", "true"); } catch (e) {}
      setLoginError("");
    } else {
      setLoginError("Mot de passe incorrect. Veuillez réessayer.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try { localStorage.removeItem("kc_admin_auth"); } catch (e) {}
  };

  const {
    products,
    orders,
    updateOrderStatus,
    addProduct,
    deleteProduct,
    editProduct
  } = useShop();

  // Tabs: "dashboard", "products", "orders", "customers"
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // New Product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Vestes",
    size: "M",
    brand: "Indépendant",
    condition: "Bon état" as "Très bon état" | "Bon état" | "Usure naturelle",
    target: "Unisexe" as "Homme" | "Femme" | "Enfant" | "Unisexe",
    image1: "",
    image2: "",
    material: "100% Coton",
    chest: "22 in",
    length: "26 in",
    sleeves: "24 in",
    origin: "Fabriqué aux États-Unis",
    stockCount: 1
  });

  const [formSuccess, setFormSuccess] = useState(false);

  // CALCULATED METRICS
  const totalSales = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const soldOutCount = products.filter((p) => !p.inStock).length;

  // DYNAMIC CUSTOMERS LIST
  // Build a unique customer dictionary from placed orders
  const customersMap: Record<string, { name: string; phone: string; ordersCount: number; totalSpent: number }> = {};
  orders.forEach((order) => {
    const phoneKey = (order?.customerPhone || "").trim();
    if (!phoneKey) return;
    if (!customersMap[phoneKey]) {
      customersMap[phoneKey] = {
        name: order.customerName,
        phone: order.customerPhone,
        ordersCount: 0,
        totalSpent: 0
      };
    }
    customersMap[phoneKey].ordersCount += 1;
    customersMap[phoneKey].totalSpent += order.total;
  });
  const customersList = Object.values(customersMap);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // IMAGE COMPRESSION HELPER
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70% quality JPEG
          } else {
            resolve(event.target?.result as string); // fallback
          }
        };
        img.onerror = (error) => reject(error);
      };
    });
  };

  // FORM SUBMIT HANDLER
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Set standard Unsplash fallback if no image url provided
    const img1 = newProduct.image1.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
    const imagesArray = [img1];
    if (newProduct.image2.trim() && !newProduct.image2.startsWith("data:") && newProduct.image2 !== "https://images.unsplash.com/...") {
       imagesArray.push(newProduct.image2.trim());
    } else if (newProduct.image2.startsWith("data:")) {
       imagesArray.push(newProduct.image2);
    }

    const detailsArray = [
      `Matière : ${newProduct.material}`,
      `Mesures : Poitrine : ${newProduct.chest} | Longueur : ${newProduct.length} ${newProduct.sleeves ? `| Manches : ${newProduct.sleeves}` : ""}`,
      `Origine : ${newProduct.origin}`,
      "Entretien : Nettoyage à sec recommandé"
    ];

    let attempt = 0;
    const maxAttempts = 3;
    let saved = false;

    while (attempt < maxAttempts && !saved) {
      try {
        if (editingProductId) {
          // Find existing product to preserve fields not in form
          const existingProduct = products.find(p => p.id === editingProductId);
          if (existingProduct) {
            await editProduct({
              ...existingProduct,
              name: newProduct.name,
              description: newProduct.description,
              price: Number(newProduct.price),
              category: newProduct.category,
              size: newProduct.size,
              brand: newProduct.brand,
              condition: newProduct.condition,
              images: imagesArray,
              details: detailsArray,
              target: newProduct.target as "Homme" | "Femme" | "Enfant" | "Unisexe",
              stockCount: newProduct.stockCount
            });
          }
        } else {
          await addProduct({
            name: newProduct.name,
            description: newProduct.description,
            price: Number(newProduct.price),
            category: newProduct.category,
            size: newProduct.size,
            brand: newProduct.brand,
            condition: newProduct.condition as any,
            images: imagesArray,
            isNewArrival: true,
            isBestSeller: false,
            details: detailsArray,
            target: newProduct.target as any,
            stockCount: newProduct.stockCount
          });
        }
        saved = true;
      } catch (error) {
        attempt++;
        console.error(`Save attempt ${attempt} failed:`, error);
        if (attempt >= maxAttempts) {
          alert("Erreur de connexion au serveur (Délai dépassé). Veuillez réessayer.");
          setIsSubmitting(false);
          return;
        }
        // Wait 1.5 seconds before retrying to allow server to wake up
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    if (saved) {
      setFormSuccess(true);
      // Reset Form
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "Vestes",
        size: "M",
        brand: "Indépendant",
        condition: "Bon état",
        target: "Unisexe",
        image1: "",
        image2: "",
        material: "100% Coton",
        chest: "22 in",
        length: "26 in",
        sleeves: "24 in",
        origin: "Fabriqué aux États-Unis",
        stockCount: 1
      });

      setTimeout(() => {
        setFormSuccess(false);
        setIsAddFormOpen(false);
        setEditingProductId(null);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleEditClick = (p: Product) => {
    setEditingProductId(p.id);
    
    // Attempt to extract values from details array if possible, otherwise use defaults
    const matMatch = p.details[0]?.match(/Matière : (.*)/);
    const chestMatch = p.details[1]?.match(/Poitrine : (.*?) \|/);
    const lengthMatch = p.details[1]?.match(/Longueur : (.*?)(?: \||$)/);
    const sleevesMatch = p.details[1]?.match(/Manches : (.*)/);
    const originMatch = p.details[2]?.match(/Origine : (.*)/);

    setNewProduct({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      size: p.size,
      brand: p.brand,
      condition: p.condition as any,
      target: p.target as any,
      image1: p.images[0] || "",
      image2: p.images[1] || "",
      material: matMatch ? matMatch[1] : "100% Coton",
      chest: chestMatch ? chestMatch[1] : "22 in",
      length: lengthMatch ? lengthMatch[1] : "26 in",
      sleeves: sleevesMatch ? sleevesMatch[1] : "",
      origin: originMatch ? originMatch[1] : "Fabriqué aux États-Unis",
      stockCount: p.stockCount || 1
    });
    
    setIsAddFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <Navbar />

      {!isAuthLoaded ? (
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-charcoal-400 animate-pulse font-serif text-lg">Chargement de l'administration...</div>
        </main>
      ) : !isAuthenticated ? (
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white border border-sand-100 rounded-sm shadow-3xs p-8 space-y-6"
          >
            <div className="text-center space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-widest text-terracotta-600 block">Administration</span>
              <h1 className="font-serif text-2xl font-bold text-charcoal-900">Portail Knitta Corner</h1>
              <p className="text-xs text-charcoal-400 font-light">Accès réservé à l&apos;administratrice.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-sand-200 bg-[#FCFAF7] px-3.5 py-2.5 text-xs text-charcoal-950 focus:border-terracotta-600 focus:outline-none"
                />
              </div>

              {loginError && (
                <p className="text-[10px] text-red-500 font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-sm bg-charcoal-900 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-colors"
              >
                Se connecter
              </button>
            </form>
          </motion.div>
        </main>
      ) : (

      <>
      {/* Main Admin Section */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
        
        {/* SIDE BAR NAVIGATION */}
        <aside className="w-full lg:w-60 flex-shrink-0">
          <div className="bg-white border border-sand-100 p-6 rounded-sm shadow-3xs space-y-6">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-gold-500 block">Administration</span>
              <h2 className="font-serif text-lg font-bold text-charcoal-900">KC Storefront</h2>
            </div>
            
            <nav className="flex flex-col space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
                { id: "products", label: "Products (CRUD)", icon: <Shirt className="h-4.5 w-4.5" /> },
                { id: "orders", label: "Orders Manager", icon: <ShoppingBag className="h-4.5 w-4.5" /> },
                { id: "customers", label: "Customers Log", icon: <Users className="h-4.5 w-4.5" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsAddFormOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left text-xs font-semibold px-4 py-3 rounded-xs transition-colors ${
                    activeTab === item.id
                      ? "bg-charcoal-900 text-white"
                      : "text-charcoal-500 hover:bg-sand-50 hover:text-charcoal-900"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>

            {/* Back to home */}
            <div className="pt-2 border-t border-sand-100 flex flex-col">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left text-xs font-semibold px-4 py-3 rounded-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                Se déconnecter
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 w-full text-left text-xs font-semibold px-4 py-3 rounded-xs text-charcoal-500 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
              >
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </aside>

        {/* ADMIN WORKSPACE PANEL */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 border-b border-sand-100 pb-3">Performance Overview</h2>
              
              {/* Scorecard Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-sand-100 rounded-sm p-5 shadow-3xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Total Sales</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">{totalSales} FCFA</h3>
                  </div>
                  <div className="rounded-full bg-[#FAF7F2] p-3 text-olive-600"><DollarSign className="h-5 w-5" /></div>
                </div>

                <div className="bg-white border border-sand-100 rounded-sm p-5 shadow-3xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Orders Received</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">{totalOrders}</h3>
                  </div>
                  <div className="rounded-full bg-[#FAF7F2] p-3 text-olive-600"><Package className="h-5 w-5" /></div>
                </div>

                <div className="bg-white border border-sand-100 rounded-sm p-5 shadow-3xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Avg Order Value</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">{avgOrderValue} FCFA</h3>
                  </div>
                  <div className="rounded-full bg-[#FAF7F2] p-3 text-olive-600"><TrendingUp className="h-5 w-5" /></div>
                </div>

                <div className="bg-white border border-sand-100 rounded-sm p-5 shadow-3xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">Sold Out (1-of-1)</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-950">{soldOutCount}</h3>
                  </div>
                  <div className="rounded-full bg-amber-50 p-3 text-amber-700 border border-amber-100"><AlertCircle className="h-5 w-5" /></div>
                </div>
              </div>

              {/* Two Column details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Left: Recent Activity orders */}
                <div className="bg-white border border-sand-100 rounded-sm p-6 shadow-3xs space-y-4">
                  <h3 className="font-serif text-base font-semibold text-charcoal-900 border-b border-sand-100 pb-2">Recent Orders</h3>
                  
                  {orders.length === 0 ? (
                    <p className="text-xs italic text-charcoal-400">No transactions recorded yet in this session.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="flex justify-between items-center text-xs">
                          <div>
                            <strong className="text-charcoal-900 font-semibold">{ord.customerName}</strong>
                            <span className="text-charcoal-400 block font-light">Ref: {ord.id} | {ord.date}</span>
                          </div>
                          <div className="text-right">
                            <strong className="text-charcoal-900 font-bold">{ord.total} FCFA</strong>
                            <span className="text-[9px] block text-amber-600 font-semibold uppercase">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Sold Out Alert list */}
                <div className="bg-white border border-sand-100 rounded-sm p-6 shadow-3xs space-y-4">
                  <h3 className="font-serif text-base font-semibold text-charcoal-900 border-b border-sand-100 pb-2">Out of Stock Warnings</h3>
                  
                  {products.filter((p) => !p.inStock).length === 0 ? (
                    <p className="text-xs italic text-charcoal-400">All inventory items are currently in stock.</p>
                  ) : (
                    <div className="space-y-3">
                      {products.filter((p) => !p.inStock).slice(0, 5).map((p) => (
                        <div key={p.id} className="flex justify-between items-center text-xs">
                          <div className="flex gap-2 items-center">
                            <div className="relative h-9 w-7 overflow-hidden bg-sand-50 border border-sand-200">
                              {p?.images?.[0] ? <Image src={p.images[0]} alt={p.name || "Produit"} fill className="object-cover" /> : <Shirt className="w-4 h-4 m-auto text-sand-300" />}
                            </div>
                            <span className="line-clamp-1 font-serif font-semibold text-charcoal-900 max-w-[200px]">{p?.name}</span>
                          </div>
                          <button
                            onClick={() => editProduct({ ...p, inStock: true })}
                            className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-sm flex items-center gap-1.5"
                          >
                            <RefreshCw className="h-3 w-3" /> Restock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER (CRUD) */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-sand-100 pb-3">
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">Inventory Catalog</h2>
                <button
                  onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                  className="rounded-sm bg-charcoal-900 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 hover:bg-terracotta-600 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>

              {/* Add form Modal/Expandable panel */}
              <AnimatePresence>
                {isAddFormOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white border border-sand-100 rounded-sm p-6 sm:p-8 shadow-3xs overflow-hidden"
                  >
                    <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-4 pb-2 border-b border-sand-50">
                      {editingProductId ? "Modifier le vêtement" : "Ajouter un nouveau vêtement"}
                    </h3>
                    
                    <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-charcoal-800 uppercase">Garment Name</label>
                          <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="e.g. 1992 Ralph Lauren Polo Bear Knit"
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Prix (FCFA)</label>
                          <input
                            type="number"
                            required
                            min={5}
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Qté Dispo</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={newProduct.stockCount}
                            onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Category</label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs cursor-pointer"
                          >
                            {CATEGORIES.filter((c) => c !== "Tout").map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Taille</label>
                          <select
                            value={newProduct.size}
                            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs cursor-pointer"
                          >
                            {SIZES.filter((s) => s !== "Tout").map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Marque</label>
                          <select
                            value={newProduct.brand}
                            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs cursor-pointer"
                          >
                            {BRANDS.filter((b) => b !== "Tout").map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Public Cible</label>
                          <select
                            value={newProduct.target}
                            onChange={(e) => setNewProduct({ ...newProduct, target: e.target.value as "Homme" | "Femme" | "Enfant" | "Unisexe" })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs cursor-pointer"
                          >
                            {TARGETS.filter((t) => t !== "Tout").map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">État</label>
                          <select
                            value={newProduct.condition}
                            onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value as "Très bon état" | "Bon état" | "Usure naturelle" })}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs cursor-pointer"
                          >
                            {CONDITIONS.filter((k) => k !== "Tout").map((k) => (
                              <option key={k} value={k}>{k}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-charcoal-800 uppercase">Description de l&apos;article</label>
                        <textarea
                          rows={3}
                          required
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Description de l'article (origine, coupe, délavage...)"
                          className="w-full border border-sand-200 bg-[#FCFAF7] p-2 rounded-xs"
                        />
                      </div>

                      {/* Image URLs and measurements specs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Photo Principale</label>
                          {newProduct.image1 && (
                            <div className="relative w-16 h-20 mb-2 border border-sand-200 rounded-xs overflow-hidden">
                              <Image src={newProduct.image1} alt="Photo principale" fill className="object-cover" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedDataUrl = await compressImage(file);
                                  setNewProduct({ ...newProduct, image1: compressedDataUrl });
                                } catch (error) {
                                  console.error("Image compression failed", error);
                                }
                              }
                            }}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-1.5 rounded-xs text-xs file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-charcoal-900 file:text-white hover:file:bg-terracotta-600 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-charcoal-800 uppercase">Photo de Détail</label>
                          {newProduct.image2 && (
                            <div className="relative w-16 h-20 mb-2 border border-sand-200 rounded-xs overflow-hidden">
                              <Image src={newProduct.image2} alt="Photo de détail" fill className="object-cover" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedDataUrl = await compressImage(file);
                                  setNewProduct({ ...newProduct, image2: compressedDataUrl });
                                } catch (error) {
                                  console.error("Image compression failed", error);
                                }
                              }
                            }}
                            className="w-full border border-sand-200 bg-[#FCFAF7] p-1.5 rounded-xs text-xs file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-charcoal-900 file:text-white hover:file:bg-terracotta-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-sm bg-charcoal-900 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-terracotta-600 transition-colors shadow-2xs disabled:bg-charcoal-400"
                      >
                        {isSubmitting ? "Enregistrement en cours..." : "Ajouter au catalogue"}
                      </button>

                      {formSuccess && (
                        <p className="text-xs font-semibold text-emerald-600 text-center flex items-center justify-center gap-1">
                          <Check className="h-4 w-4" /> Item added successfully! Catalog updated.
                        </p>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Table log */}
              <div className="bg-white border border-sand-100 rounded-sm overflow-x-auto shadow-3xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-sand-50 border-b border-sand-100 font-serif text-charcoal-850">
                      <th className="p-4 font-bold">Image</th>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Size</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Stock</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-sand-50/50">
                        <td className="p-4">
                          <div className="relative h-12 w-9 overflow-hidden border border-sand-200 bg-sand-50 flex items-center justify-center">
                            {p?.images?.[0] ? <Image src={p.images[0]} alt={p.name || "Produit"} fill className="object-cover" /> : <Shirt className="w-4 h-4 text-sand-300" />}
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-charcoal-950 max-w-[180px] truncate">
                          <div>
                            <span className="text-[9px] text-terracotta-600 font-bold block uppercase">{p.brand}</span>
                            {p.name}
                          </div>
                        </td>
                        <td className="p-4 text-charcoal-500">{p.category}</td>
                        <td className="p-4 text-charcoal-800 font-bold">{p.size}</td>
                        <td className="p-4 font-bold text-charcoal-900">{p.price} FCFA</td>
                        <td className="p-4 font-bold text-charcoal-800">{p.stockCount}</td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                               // Reset to 1 if sold out, or 0 if in stock (to toggle)
                               const newStock = p.inStock ? 0 : 1;
                               editProduct({ ...p, stockCount: newStock, inStock: newStock > 0 });
                            }}
                            className={`px-2 py-0.5 rounded-full font-semibold text-[9px] uppercase border ${
                              p.inStock
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200"
                            }`}
                          >
                            {p.inStock ? "In Stock" : "Sold"}
                          </button>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="text-charcoal-400 hover:text-charcoal-900 transition-colors p-1 mr-1"
                            title="Edit garment"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-charcoal-400 hover:text-red-500 transition-colors p-1"
                            title="Delete garment"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGER */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 border-b border-sand-100 pb-3">Transactions & Orders</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-white border border-sand-100 rounded-sm shadow-3xs p-6">
                  <p className="text-xs italic text-charcoal-400">No checkout transactions logged in this session.</p>
                </div>
              ) : (
                <div className="bg-white border border-sand-100 rounded-sm overflow-x-auto shadow-3xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-sand-50 border-b border-sand-100 font-serif text-charcoal-850">
                        <th className="p-4 font-bold">Réf.</th>
                        <th className="p-4 font-bold">Client</th>
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Articles</th>
                        <th className="p-4 font-bold">Montant</th>
                        <th className="p-4 font-bold">Statut</th>
                        <th className="p-4 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-sand-50/50">
                          <td className="p-4 font-bold text-charcoal-900 uppercase">#{ord.id.slice(0, 8)}</td>
                          <td className="p-4">
                            <div>
                              <strong className="text-charcoal-900 block font-semibold">{ord.customerName}</strong>
                              <span className="text-[10px] text-charcoal-400 block font-light">{ord.customerPhone}</span>
                            </div>
                          </td>
                          <td className="p-4 text-charcoal-500">{ord.date}</td>
                          <td className="p-4 text-charcoal-800 font-medium">{ord.items.length} {ord.items.length > 1 ? 'articles' : 'article'}</td>
                          <td className="p-4 font-bold text-charcoal-950">{ord.total} FCFA</td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as "Pending" | "Shipped" | "Delivered")}
                              className="bg-transparent border border-sand-250 rounded-sm py-1 px-2 text-[10px] font-semibold text-charcoal-800 cursor-pointer focus:outline-none"
                            >
                              <option value="Pending">En attente</option>
                              <option value="Shipped">Expédié</option>
                              <option value="Delivered">Livré</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setViewOrder(ord)}
                              className="p-1 text-charcoal-400 hover:text-charcoal-900 transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOMERS LOG */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-charcoal-900 border-b border-sand-100 pb-3">Registered Customers Directory</h2>
              
              {customersList.length === 0 ? (
                <div className="text-center py-20 bg-white border border-sand-100 rounded-sm shadow-3xs p-6">
                  <p className="text-xs italic text-charcoal-400">No customer profiles registered yet. Place orders to seed accounts.</p>
                </div>
              ) : (
                <div className="bg-white border border-sand-100 rounded-sm overflow-x-auto shadow-3xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-sand-50 border-b border-sand-100 font-serif text-charcoal-850">
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Téléphone</th>
                        <th className="p-4 font-bold">Orders Count</th>
                        <th className="p-4 font-bold">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {customersList.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-sand-50/50">
                          <td className="p-4 font-semibold text-charcoal-900">{cust.name}</td>
                          <td className="p-4 text-charcoal-500">{cust.phone}</td>
                          <td className="p-4 text-charcoal-800 font-bold">{cust.ordersCount}</td>
                          <td className="p-4 font-bold text-charcoal-950">{cust.totalSpent} FCFA</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>

      </div>
      </> )} {/* end isAuthenticated ternary */}

      {/* Order Details Modal */}
      <AnimatePresence>
        {viewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-sand-100 px-6 py-4 bg-sand-50">
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">Détails de la commande</h3>
                  <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">{viewOrder.id}</p>
                </div>
                <button
                  onClick={() => setViewOrder(null)}
                  className="p-2 text-charcoal-400 hover:text-charcoal-900 transition-colors rounded-full hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-2">Client</h4>
                    <p className="text-sm font-semibold text-charcoal-900">{viewOrder.customerName}</p>
                    <p className="text-xs text-charcoal-600 mt-1">{viewOrder.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-2">Adresse de livraison</h4>
                    <p className="text-sm text-charcoal-900 whitespace-pre-line leading-relaxed">{viewOrder.address || viewOrder.customerAddr}</p>
                  </div>
                </div>

                {/* Order Meta */}
                <div className="flex items-center justify-between py-4 border-y border-sand-100">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">Date</h4>
                    <p className="text-sm font-medium text-charcoal-900">{viewOrder.date}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">Statut</h4>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-sand-100 text-charcoal-800">
                      {viewOrder.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1">Total</h4>
                    <p className="text-lg font-bold text-charcoal-900">{viewOrder.total} FCFA</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-4">Articles ({viewOrder.items?.length || 0})</h4>
                  <div className="space-y-3">
                    {viewOrder.items && viewOrder.items.length > 0 ? (
                      viewOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-sand-50/50 p-3 rounded-sm border border-sand-100">
                          <div className="relative w-16 h-20 bg-sand-100 rounded-xs overflow-hidden shrink-0">
                            {item.product?.images?.[0] ? (
                              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Shirt className="w-6 h-6 text-sand-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-terracotta-600 uppercase tracking-wider block mb-0.5">{item.product?.brand || "Inconnu"}</span>
                            <h5 className="text-sm font-semibold text-charcoal-900 truncate">{item.product?.name || "Article indisponible"}</h5>
                            <p className="text-xs text-charcoal-500 mt-1">Taille: {item.product?.size || "-"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-charcoal-900">{item.product?.price || 0} FCFA</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-charcoal-500 italic">Aucun détail d'article disponible pour cette commande (ancienne version).</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
