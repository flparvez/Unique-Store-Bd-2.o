import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import BottomBar from "@/components/shared/header/Bottom";
import { GoogleTagManager } from "@next/third-parties/google";


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
  metadataBase: new URL('https://uniquestorebd.store/'),
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
    url: "https://uniquestorebd.store/",
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
    google: "H1QKSH2SYxJ7TemokhY7BFgKgZN-iJT1B51u-CZ4wpw",
    
  },
  alternates: {
    canonical: "https://uniquestorebd.store/",
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
      <GoogleTagManager gtmId="GTM-TW37DK9Z" />

      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="./fonts/GeistVF.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://res.cloudinary.com/dxmvrhcjx/image/upload/v1736267263/hm8yhv7pehnbxw4klxym.png"
          as="image"
        />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Comprehensive Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Unique Store BD",
              url: "https://uniquestorebd.shop",
              logo: "https://res.cloudinary.com/dxmvrhcjx/image/upload/v1736267263/hm8yhv7pehnbxw4klxym.png",
              description: "Authentic gadgets and electronics online store in Bangladesh",
              address: {
                "@type": "PostalAddress",
                streetAddress: "House 01, Road 01, Sector 01, Uttara, Dhaka",
                addressLocality: "Dhaka",
                addressRegion: "Dhaka",
                postalCode: "1200",
                addressCountry: "BD"
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+8801608257876",
                contactType: "customer service",
                email: "uniquestorebd23@gmail.com",
                areaServed: "BD",
                availableLanguage: ["en", "bn"]
              },
              sameAs: [
                "https://www.facebook.com/uniquestorebd23",
                "https://www.instagram.com/uniquestorebd",
                "https://www.linkedin.com/company/uniquestorebd"
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "09:00",
                closes: "21:00"
              },
              priceRange: "$$"
            })
          }}
        />

        {/* Search Console Verification */}
        <meta name="google-site-verification" content="H1QKSH2SYxJ7TemokhY7BFgKgZN-iJT1B51u-CZ4wpw" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers >
  <BottomBar />
        {children}
        </Providers>
   
      </body>
    </html>
  );
}
