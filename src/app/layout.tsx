import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import { ShopProvider } from "@/context/ShopContext";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: "400",
});

export const metadata: Metadata = {
  title: "KnittaCorner | Un Univers Mode & Streetwear",
  description: "Plongez dans l'univers de KnittaCorner : une sélection pointue de vêtements streetwear, pièces uniques de seconde main, accessoires tendance et sneakers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KnittaCorner",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "theme-color": "#AB4E61",
    "msapplication-TileColor": "#AB4E61",
    "msapplication-TileImage": "/logo.png",
  },
};

import { getProducts } from "@/actions/productActions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch products on the server side during SSR!
  // This completely eliminates the 2-5 second client-side fetch waterfall.
  const dbProducts = await getProducts();
  const initialProducts = dbProducts ? dbProducts.map((p: any) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : p.images?.images || []),
    details: Array.isArray(p.details) ? p.details : (typeof p.details === 'string' ? JSON.parse(p.details) : p.details?.details || []),
    reviews: p.reviews || [] 
  })) : [];

  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} antialiased`}
      >
        <ShopProvider initialProducts={initialProducts as any}>
          <SplashScreen />
          {children}
        </ShopProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
