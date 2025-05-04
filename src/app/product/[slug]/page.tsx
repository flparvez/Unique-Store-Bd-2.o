// app/product/[slug]/page.tsx

import React from 'react';
import { Metadata } from 'next';
import { htmlToText } from 'html-to-text';

import { Navbar } from '@/components/shared/header/Navbar';
import ProductDetailPage from '@/components/ProductDetailPage';
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton';

import { IProduct } from '@/types/product';



type Props = {
  params: Promise<{ slug: string }>;
  
};


// Utility: fetch single product by slug
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const res = await fetch(`https://landig-store.vercel.app/api/products/${slug}`, {

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
  const priceText = product.price ? ` at just ৳${product.price}` : '';

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
      canonical: `https://landig-store.vercel.app/product/${slug}`,
    },
    openGraph: {
      title: `${product.shortName} Price In Bangladesh`,
      description: `Buy ${product.shortName}${priceText}. ${shortDescription} Free delivery available.`,
      url: `https://landig-store.vercel.app/product/${slug}`,
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

 
  return (
    <div>
      <Navbar />
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
    </div>
  );
};

export default ProductPage;
