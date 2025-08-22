import React from 'react';
import { Metadata } from 'next';
import { htmlToText } from 'html-to-text';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Navbar } from '@/components/shared/header/Navbar';
import { IProduct } from '@/types/product';

// Dynamically import the client component to ensure it's not rendered on the server

const ProductDetailPage = dynamic(() => import('@/components/ProductDetailPage'));


// Define the Props type for both generateMetadata and the Page Component
type Props = {
  params: Promise<{ slug: string }>;
  
};
// --- Data Fetching Function ---
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    // Using cache: 'force-cache' is the default, but being explicit can be helpful.
    // For highly dynamic data, consider 'no-store' or revalidate options.
    const res = await fetch(`https://uniquestorebd.shop/api/products/${slug}`);

    if (!res.ok) {
      if (res.status === 404) return null;
      // For other errors, we throw to be caught by the catch block
      throw new Error(`Failed to fetch product with status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product '${slug}':`, error);
    // In case of a network or other error, we treat it as not found.
    return null;
  }
}

// --- Metadata Generation Function (Server-side) ---
export async function generateMetadata({ params }:Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist or has been moved.',
      robots: { index: false, follow: false }, // Crucial for SEO: don't index 404s
    };
  }

  // Sanitize and shorten the description
  const plainDescription = htmlToText(product.description || '', { wordwrap: 130 });
  const shortDescription = plainDescription.slice(0, 160).replace(/\s+/g, ' ').trim() + '...';
  const priceText = product.price ? ` at a great price of ৳${product.price}` : '';

  // Prepare images for Open Graph and Twitter
  const ogImages = product.images?.length
    ? product.images.map(img => ({
        url: img.url,
        alt: `${product.name} - View`,
        width: 1200,
        height: 630,
      }))
    : [{ url: '/default-product-image.jpg', alt: 'Default Product Image', width: 1200, height: 630 }];

  // Generate SEO keywords from product data
  const seoKeywords = [
    product.name,
    product.shortName,
    product.category?.name,
    'buy online bangladesh',
    'price in bd',
    `buy ${product.name}`,
    `${product.name} price`,
    'online shopping bd',
    'Unique Store BD',
    ...(product?.seo?.split(',').map((k: string) => k.trim()) || []),
  ].filter(Boolean); // Remove any null/undefined values

  return {
    title: `${product.name} - Price In Bangladesh | Unique Store BD`,
    description: `Order the ${product.name} online from Unique Store BD${priceText}. ${shortDescription} Fast home delivery across Bangladesh.`,
    keywords: seoKeywords,
    alternates: {
      canonical: `https://uniquestorebd.shop/product/${slug}`,
    },
    openGraph: {
      title: `${product.name} | Unique Store BD`,
      description: `Check out the ${product.name}${priceText}. ${shortDescription}`,
      url: `https://uniquestorebd.shop/product/${slug}`,
      siteName: 'Unique Store BD',
      images: ogImages,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Available Now`,
      description: shortDescription,
      images: ogImages.length > 0 ? ogImages[0].url : undefined,
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
  const { slug } =await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound(); // Triggers the not-found.js file or Next.js default 404 page
  }
  
  // --- JSON-LD Structured Data for Product ---
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map(img => img.url) || [],
    description: htmlToText(product.description || '').slice(0, 5000), // Limit description length for schema
    sku: product._id, // Use SKU or a unique ID
    brand: {
      '@type': 'Brand',
      name: product.category?.name || 'Unique Store BD',
    },
    offers: {
      '@type': 'Offer',
      url: `https://uniquestorebd.shop/product/${slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Unique Store BD',
      },
    },
    // Optional: Add aggregateRating if you have reviews
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.5',
    //   reviewCount': '89',
    // },
  };


  return (
    <main>
        {/* Inject JSON-LD into the head of the page */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <Navbar />
      <div className="container mx-auto px-4">
        {/* Breadcrumb navigation for SEO and UX */}
        <nav aria-label="Breadcrumb" className="py-3 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link href="/" className="hover:text-blue-600 hover:underline">Home</Link></li>
            {product.category?.slug && (
              <>
                <li><span>/</span></li>
                <li>
                  <Link href={`/category/${product.category.slug}`} className="hover:text-blue-600 hover:underline">
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li><span>/</span></li>
            <li className="font-semibold text-gray-700 truncate" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* The client component receives the fetched data */}
        <ProductDetailPage product={product} />
      </div>
    </main>
  );
};

export default ProductPage;