"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, INITIAL_PRODUCTS, Review } from "@/data/initialData";
import { getProducts, addProductAction, updateProductAction, deleteProductAction } from "@/actions/productActions";
import { getOrders, placeOrderAction, updateOrderStatusAction } from "@/actions/orderActions";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  address: string;
  customerAddr?: string;
  city: string;
  zipCode: string;
  status: "Pending" | "Shipped" | "Delivered";
  date: string;
}

export interface User {
  name: string;
  email: string;
  wishlist: string[]; // product IDs
}

interface ShopContextProps {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentUser: User | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  placeOrder: (shippingInfo: { firstName: string; lastName: string; phone: string; address: string }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: "Pending" | "Shipped" | "Delivered") => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "reviews" | "rating" | "inStock">) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  login: (email: string) => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  isLoaded: boolean;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydration-safe initial state loading
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch products first so the shop can render immediately
        const dbProducts = await getProducts();
        
        if (dbProducts) {
          const formattedProducts = dbProducts.map((p: any) => ({
            ...p,
            images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : p.images?.images || []),
            details: Array.isArray(p.details) ? p.details : (typeof p.details === 'string' ? JSON.parse(p.details) : p.details?.details || []),
            reviews: p.reviews || [] 
          }));
          setProducts(formattedProducts as unknown as Product[]);
        }

        try {
          const savedCart = localStorage.getItem("kc_cart");
          if (savedCart) setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("localStorage error:", e);
        }

        const storedWishlist = localStorage.getItem("kc_wishlist");
        const storedUser = localStorage.getItem("kc_user");

        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
        
        // We set loaded to true here so the storefront is unblocked immediately!
        setIsLoaded(true);

        // Fetch orders in the background (only needed for admin panel)
        getOrders().then((dbOrders) => {
          if (dbOrders) {
            const formattedOrders = dbOrders.map((o: any) => ({
              ...o,
              items: o.items ? o.items.map((i: any) => {
                const p = i.product || { name: "Produit supprimé", price: 0, images: '[]', details: '[]' };
                return { 
                  product: { 
                    ...p, 
                    images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'), 
                    details: Array.isArray(p.details) ? p.details : JSON.parse(p.details || '[]') 
                  },
                  quantity: i.quantity 
                };
              }) : []
            }));
            setOrders(formattedOrders as unknown as Order[]);
          }
        }).catch(e => console.error("Could not fetch orders:", e));

      } catch (e) {
        console.error("Could not load initial data:", e);
        setIsLoaded(true); // Always unblock
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kc_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("kc_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("kc_user");
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("kc_cart", JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  // Auth Operations
  const login = (email: string) => {
    // For high-fidelity simulation, we allow logging in with any email.
    // If user existed in order history or we just seed a basic name:
    const name = email.split("@")[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const newUser: User = {
      name: capitalizedName,
      email: email,
      wishlist: wishlist
    };
    setCurrentUser(newUser);
    return true;
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      name: name,
      email: email,
      wishlist: []
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock || product.stockCount <= 0) return;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        const newQuantity = Math.min(newCart[existingIndex].quantity + quantity, product.stockCount);
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQuantity };
        return newCart;
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockCount) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.min(Math.max(1, quantity), item.product.stockCount) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      if (currentUser) {
        setCurrentUser({ ...currentUser, wishlist: updated });
      }
      return updated;
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Shopper checkout order placement
  const placeOrder = async (shippingInfo: { firstName: string; lastName: string; phone: string; address: string }) => {
    const shippingFee = 2000;
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + shippingFee;
    const newOrderData = {
      customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      customerPhone: shippingInfo.phone,
      customerAddr: shippingInfo.address,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      total,
      items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
    };

    const res = await placeOrderAction(newOrderData);

    if (res.success && res.order) {
      // Record order
      const formattedOrder: Order = {
        ...res.order,
        items: [...cart],
        address: res.order.customerAddr,
        city: "Dakar",
        zipCode: "",
      } as any;
      setOrders((prev) => [formattedOrder, ...prev]);

      // Clear shopper cart
      setCart([]);
      
      // Optimistically decrement stockCount in products state
      setProducts((prev) => prev.map((p) => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stockCount - cartItem.quantity);
          return { ...p, stockCount: newStock, inStock: newStock > 0 };
        }
        return p;
      }));
      
      return formattedOrder;
    }
    throw new Error("Failed to place order");
  };

  // Review Operations
  const addReview = (productId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: "rev-" + Math.floor(1000 + Math.random() * 9000),
      user: currentUser ? currentUser.name : "Anonymous Buyer",
      rating,
      date: new Date().toISOString().split("T")[0],
      comment
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [...p.reviews, newReview];
        const avgRating = parseFloat(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...p,
          reviews: updatedReviews,
          rating: avgRating
        };
      })
    );
  };

  // Administrative actions
  const updateOrderStatus = async (orderId: string, status: "Pending" | "Shipped" | "Delivered") => {
    const res = await updateOrderStatusAction(orderId, status);
    if (res.success) {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
      );
    }
  };

  const addProduct = async (pInfo: Omit<Product, "id" | "reviews" | "rating" | "inStock">) => {
    const res = await addProductAction({
      name: pInfo.name,
      description: pInfo.description,
      price: pInfo.price,
      category: pInfo.category,
      size: pInfo.size,
      brand: pInfo.brand,
      condition: pInfo.condition,
      target: pInfo.target,
      images: pInfo.images,
      details: pInfo.details,
      isNewArrival: pInfo.isNewArrival,
      isBestSeller: pInfo.isBestSeller,
      inStock: pInfo.stockCount! > 0,
      stockCount: pInfo.stockCount,
    });

    if (res.success && res.product) {
      const newProduct: Product = {
        ...res.product,
        images: Array.isArray(res.product.images) ? res.product.images : JSON.parse(res.product.images as string),
        details: Array.isArray(res.product.details) ? res.product.details : JSON.parse(res.product.details as string),
        reviews: [],
      } as any;
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const editProduct = async (updatedProduct: Product) => {
    const res = await updateProductAction(updatedProduct.id, {
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      category: updatedProduct.category,
      size: updatedProduct.size,
      brand: updatedProduct.brand,
      condition: updatedProduct.condition,
      target: updatedProduct.target,
      images: updatedProduct.images,
      details: updatedProduct.details,
      isNewArrival: updatedProduct.isNewArrival,
      isBestSeller: updatedProduct.isBestSeller,
      inStock: updatedProduct.stockCount! > 0,
      stockCount: updatedProduct.stockCount,
    });

    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    
    try {
      const res = await deleteProductAction(productId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
      } else {
        alert("Impossible de supprimer ce produit. " + res.error + "\n(S'il a déjà été commandé, vous ne pouvez pas le supprimer pour conserver l'historique des commandes.)");
      }
    } catch (err: any) {
      alert("Erreur de connexion : " + err.message);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currentUser,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        placeOrder,
        updateOrderStatus,
        addProduct,
        editProduct,
        deleteProduct,
        login,
        register,
        logout,
        addReview,
        isLoaded
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
