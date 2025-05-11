// app/product/[slug]/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { htmlToText } from 'html-to-text';

import { Navbar } from '@/components/shared/header/Navbar';
import ProductDetailPage from '@/components/ProductDetailPage';
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton';

import { IProduct } from '@/types/product';
import Link from 'next/link';



type Props = {
  params: Promise<{ slug: string }>;
  
};


// Utility: fetch single product by slug
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    // const res = await fetch(`http://localhost:3000/api/products/${slug}`, {
    const res = await fetch(`https://uniquestorebd.shop/api/products/${slug}`, {

      next: {
        revalidate: 60 * 60 * 12,
        tags: [`product_${slug}`]
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({ params }:Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Unique Store BD',
      description: 'The product you are looking for is not available.',
      robots: { index: false, follow: true },
    };
  }

  const plainDescription = htmlToText(product.description || '').replace(/\s+/g, ' ').trim();
  const shortDescription = plainDescription.slice(0, 155) + (plainDescription.length > 155 ? '...' : '');
  const priceText = product.price? ` at just ৳${product.price}` : '';

  return {
    title: `${product.shortName} Price In Bangladesh`,
    description: `Buy ${product.shortName}${priceText}. ${shortDescription} Free delivery available.`,
    keywords: [
      ...(product?.seo?.split(',') || []),
      'buy online',
      'price in Bangladesh',
      product?.category?.name || '',
      'Unique Store BD',
    ].join(', '),
    alternates: {
      canonical: `https://uniquestorebd.shop/product/${slug}`,
    },
    openGraph: {
      title: `${product.shortName} Price In Bangladesh`,
      description: `Buy ${product.shortName}${priceText}. ${shortDescription} Free delivery available.`,
      url: `https://uniquestorebd.shop/product/${slug}`,
      type: 'website',
      images: product.images?.map(img => ({
        url: img.url,
        alt: `${product.name} image`,
      })) || [{ url: '/default-image.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Unique Store BD`,
      description: `Available now${priceText}. ${shortDescription}`,
      images: product.images?.[0]?.url || '/default-image.jpg',
    },
  };
}

// Page Component
const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return <ProductLoadingSkeleton />;
 // Enhanced product schema data
 const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  productID: product._id,
  name: product.name,
  sku: product.shortName,
  description: htmlToText(product.description).slice(0, 250),
  image: product.images?.map(img => img.url) || [],
  brand: {
    "@type": "Brand",
    name: "Unique Store BD"
  },
  offers: {
    "@type": "Offer",
    url: `https://uniquestorebd.shop/product/${slug}`,
    priceCurrency: "BDT",
    price: product.price,
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    availability: product.stock > 0 
      ? "https://schema.org/InStock" 
      : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: product.advanced === 200 ? 0 : 100,
        currency: "BDT"
      }
    }
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "13",
    bestRating: "5",
    worstRating: "1"
  }
};

 
  return (
    <main>
      <Navbar />
    {/* Structured data for search engines */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
     {/* Breadcrumb navigation for SEO */}
     <nav aria-label="Breadcrumb" className="container  mx-auto px-2 pt-2 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          </li>
          <li>/</li>
          <li>
            <a 
              href={`/products/${product.category?.slug || ''}`} 
              className="text-blue-600 hover:underline"
            >
              {product?.category?.name || 'Products'}
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-600  line-clamp-2" aria-current="page">
            {product?.shortName}
          </li>
        </ol>
      </nav>
      
      
      <ProductDetailPage product={product}  />

      {/* FAQ Section for SEO */}
      <section className="mx-4 py-4">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What is the price of <b>{product.shortName}</b> in Bangladesh?</h3>
            <p>
              The latest price of <b>{product.shortName}</b> is <b>৳{product.price}</b>. You can purchase it at Unique Store BD.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Where can I buy {product.name} in Bangladesh?</h3>
            <p>
              You can buy {product.name} from <b>Unique Store BD</b> with home delivery across Bangladesh.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
