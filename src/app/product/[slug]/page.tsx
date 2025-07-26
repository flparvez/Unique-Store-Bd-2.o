
import React from 'react';
import { Metadata } from 'next';
import { htmlToText } from 'html-to-text';
import { notFound } from 'next/navigation'; // Import notFound for 404 handling
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/shared/header/Navbar';

import { IProduct } from '@/types/product';
import Link from 'next/link';

const ProductDetailPage = dynamic(() => import('@/components/ProductDetailPage'));

// Define the Props type for both generateMetadata and the Page Component
type Props = {
  params: Promise<{ slug: string }>;
  
};

// --- Data Fetching Function ---
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const res = await fetch(`https://uniquestorebd.shop/api/products/${slug}`);

    if (!res.ok) {
      // If the product is not found, return null to trigger notFound()
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

// --- Metadata Generation Function (Server-side) ---
export async function generateMetadata({ params }:Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Handle product not found scenario for metadata
  if (!product) {
    return {
      title: 'Product Not Found | Unique Store BD',
      description: 'The product you are looking for is not available or has been removed.',
      robots: { index: false, follow: false }, // Prevent indexing of non-existent pages
    };
  }

  const plainDescription = htmlToText(product.description || '', { wordwrap: 130 }).replace(/\s+/g, ' ').trim();
  const shortDescription = plainDescription.slice(0, 155) + (plainDescription.length > 155 ? '...' : '');
  const priceText = product.price ? ` at just ৳${product.price}` : '';

  // Prepare images for Open Graph and Twitter
  const ogImages = product.images?.length > 0
    ? product?.images.map(img => ({
        url: img.url,
        alt: `${product.name} image`,
        width: 1200, // Recommended Open Graph image width
        height: 630, // Recommended Open Graph image height
      }))
    : [{ url: 'https://uniquestorebd.shop/default-image.jpg', alt: 'Unique Store BD default product image', width: 1200, height: 630 }];

  // Generate SEO keywords
  const seoKeywords = [
    ...(product?.seo?.split(',').map((k: string) => k.trim()) || []),
    product.shortName,
    product.name,
    'buy online',
    'price in Bangladesh',
    product?.category?.name || '',
    'Unique Store BD',
    `buy ${product.shortName}`,
    `price of ${product.shortName}`,
    'online shopping Bangladesh',
    'e-commerce Bangladesh',
    'best price BD',
  ].filter(Boolean).join(', '); // Filter out any empty strings before joining

  return {
    title: `${product.shortName} Price In Bangladesh - Buy Online | Unique Store BD`,
    description: `Buy ${product.shortName}${priceText} from Unique Store BD. ${shortDescription} Order now for home delivery across Bangladesh.`,
    keywords: seoKeywords,
    alternates: {
      canonical: `https://uniquestorebd.shop/product/${slug}`,
    },
    openGraph: {
      title: `${product.shortName} Price In Bangladesh - Unique Store BD`,
      description: `Buy ${product.shortName}${priceText} from Unique Store BD. ${shortDescription} Order now for home delivery across Bangladesh.`,
      url: `https://uniquestorebd.shop/product/${slug}`,
      siteName: 'Unique Store BD',
      // The 'product' type is nested within the OpenGraph object itself.
      // This is the correct way to handle it, not as a direct root property of openGraph.
      // Next.js handles this mapping internally if you provide specific product-related fields.
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.shortName} Price In Bangladesh - Unique Store BD`,
      description: `Available now${priceText}. ${shortDescription}`,
      images: ogImages[0]?.url, // Use the first OG image for Twitter card
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

// --- Page Component (Server Component) ---
const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound(); // Triggers Next.js's default 404 page or your custom not-found.tsx
  }

  return (
    <main>
      <Navbar />
      {/* Structured data (JSON-LD) will be passed to ProductDetailPage */}

      {/* Breadcrumb navigation for SEO and UX */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-2 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          </li>
          <li>/</li>
          {product.category?.slug && product.category?.name && (
            <>
              <li>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {product.category.name}
                </Link>
              </li>
              <li>/</li>
            </>
          )}
          <h2 className="text-gray-600 line-clamp-2" >
            {product.shortName}
          </h2>
        </ol>
      </nav>

      {/* ProductDetailPage is a client component, pass product data to it */}
      <ProductDetailPage product={product} />
    </main>
  );
};

export default ProductPage;