
import ProductDetailPage from '@/components/ProductDetailPage';
import { Navbar } from '@/components/shared/header/Navbar';

import { Metadata } from 'next';
import { htmlToText } from "html-to-text";
import React from 'react'
import { IProduct } from '@/types/product';
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton';
import { getAllProducts } from '@/lib/action/product-action';


type Props = {
  params: Promise<{ slug: string }>;
  
};

// Enhanced fetch with error handling
async function getProduct(slug: string): Promise<IProduct | null>  {
  try {
    const res = await fetch(
      // `http://localhost:3000/api/products/${slug}`,
      `https://landig-store.vercel.app/api/products/${slug}`,
      { 
        next: { 
          revalidate: 60*60*12,
          tags: [`product_${slug}`]
        } 
      }
    );
    
    if (!res.ok) {
      console.error(`Failed to fetch product ${slug}: ${res.status}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Network error fetching product ${slug}:`, error);
    return null;
  }
}




export async function generateMetadata({ params }: Props,
  
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Unique Store BD",
      description: "The product you're looking for isn't available. Browse our other products.",
      robots: {
        index: false,
        follow: true,
      }
    };
  }

  // Clean description and create SEO-friendly text
  const plainDescription = htmlToText(product.description).replace(/\s+/g, ' ').trim();
  const shortDescription = plainDescription.slice(0, 155) + (plainDescription.length > 155 ? '...' : '');
  const priceText = product.price ? ` at just ৳${product.price}` : '';
  
  // Generate keywords from existing data
  const keywords = [
    ...(product?.seo?.split(',') || []),
    'buy online',
    'price in Bangladesh',
    product?.category?.name || '',
    'Unique Store BD'
  ].filter(Boolean).join(', ');

  return {
    title: `${product?.shortName}  Price In Bangladesh`,
    description: `Buy ${product?.shortName}${priceText}. ${shortDescription} Free delivery available.`,
    keywords: keywords,
    
    alternates: {
      canonical: `https://landig-store.vercel.app/product/${slug}`,
    },
    openGraph: {
      title: `${product?.shortName}  Price In Bangladesh`,
      description: `Buy ${product?.shortName}${priceText}. ${shortDescription} Free delivery available.`,
      url: `https://landig-store.vercel.app/product/${slug}`,
      type: 'website',
      images: product.images?.map(img => ({
        url: img.url,
        alt: `${product.name} product image`,
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


const ProductPage = async ({params}: {params : Promise<{slug: string}>}) => {
const {slug} = (await params)
const product = await getProduct(slug);
console.log(product)
if (!product) {
  return <ProductLoadingSkeleton />
}

const products = (await getAllProducts()) || [];
  return (
    <div>
       <Navbar />
      <ProductDetailPage products={products} product = {product} />
       {/* FAQ section for SEO */}
       <section className="mx-4 py-4">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold"> What is the price of <b>{product?.shortName}</b> in Bangladesh?</h3>
              <p>
              The latest price of <b>{product?.shortName}</b> is{' '}
                <b>৳{product?.price}</b> in Bangladesh. You can purchase the{' '}
                {product?.shortName} in Bangladesh at the best price from our website or any
                of our stores.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Where can I buy {product.name} in Bangladesh?</h3>
              <p>
                You can purchase {product.name} from Unique Store BD with nationwide delivery across Bangladesh. 
                We offer secure online payment options and cash on delivery.
              </p>
            </div>
          </div>
        </section>
    </div>
  )
}

export default ProductPage
