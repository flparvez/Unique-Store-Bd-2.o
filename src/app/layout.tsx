import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://landig-store.vercel.app'),
title: "Unique Store BD - Best Online Shopping in Bangladesh",
  description: "Buy authentic Products - Table Lamps, TWS earbuds, smart watches, home appliances & tech gadgets in Bangladesh. Best prices with warranty, fast delivery & easy returns.",
  keywords: [
    "Unique Store BD",
    "Online Shopping Bangladesh",
    "Original TWS Earbuds",
    "Smart Watches BD",
    "Home Appliances",
    "Tech Gadgets Bangladesh",
    "Table Lamp Price Bd",
    "Authentic Products BD",
    "Online Store Bangladesh",
    "Rechargeable Fan"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
 
    }
  },
  openGraph: {
    title: "Unique Store BD - Best Online Shopping in Bangladesh",
    description: "Shop original TWS earbuds, smart watches, home appliances & tech gadgets at best prices in Bangladesh with warranty & fast delivery.",
    url: "https://landig-store.vercel.app",
    siteName: "Unique Store BD",
    images: [
      {
        url: "https://res.cloudinary.com/dxmvrhcjx/image/upload/v1736267263/hm8yhv7pehnbxw4klxym.png",
        width: 1200,
        height: 630,
        alt: "Unique Store BD - Best Online Shopping in Bangladesh",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unique Store BD - Authentic Gadgets & Electronics",
    description: "Shop 100% original tech products at best prices in Bangladesh",
    creator: "@UniqueStoreBD",
    images: [
      "https://res.cloudinary.com/dxmvrhcjx/image/upload/v1736267263/hm8yhv7pehnbxw4klxym.png"
    ],
  },
  verification: {
    google: "VKVgwIwR97h-QBA0tBfEcxu6axUU2O7JXp9wYRtqh9M",
   
  },
  alternates: {
    canonical: "https://landig-store.vercel.app",
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers >
  
        {children}
        </Providers>
   
      </body>
    </html>
  );
}
