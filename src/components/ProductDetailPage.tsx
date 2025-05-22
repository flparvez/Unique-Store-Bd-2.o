// components/ProductDetailPage.tsx
'use client';

import React, { useState } from 'react';
import { YouTubeEmbed } from '@next/third-parties/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Facebook } from 'lucide-react';
import { htmlToText } from 'html-to-text'; // For cleaning description for schema

import { IProduct } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { Button } from './ui/button'; // Assuming this is a UI button component
import Loading from './shared/Loading'; // Your Loading component
import ImageSlider from './shared/product/ImageSlider'; // Assume this component uses next/image internally
import LatestProduct from './shared/product/LatestProduct';
import LatestProductm from './shared/product/LatestPm';

interface ProductDetailPageProps {
  product: IProduct;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItem, isInitialized } = useCart();
  const router = useRouter();

  const cartItem = getItem(product._id, selectedVariant);
  const currentQuantity = cartItem?.quantity || 0;
  const availableStock = product.stock - currentQuantity;

  const handleAddToCart = () => {
    if (availableStock <= 0) {
      toast.error('Product is out of stock.');
      return;
    }
    // Optional: If 'Color' variant is mandatory, uncomment this check
    // if (product.specifications.some((s) => s.key === 'Color') && !selectedVariant) {
    //   toast.error('Please select a color before adding to cart.');
    //   return;
    // }

    addToCart(product, quantity, selectedVariant);
    toast.success('Product added to cart!');
    router.push('/checkout');
  };

  const advanced = product?.advanced || 100;

  // Render loading state if cart is not initialized
  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        Initializing cart...
      </div>
    );
  }

  // Basic check for product data before rendering details
  if (!product || !product.specifications) {
    // In a real app, you might want to redirect to a 404 or a generic product list.
    // For now, using your existing Loading component.
    return <Loading />;
  }

  // --- Product Schema (JSON-LD) for Rich Snippets ---
  // Placed here because it describes the content within this component.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "productID": product._id,
    "name": product.name,
    "sku": product.shortName || product._id, // Fallback to product ID if shortName isn't a true SKU
    "description": htmlToText(product.description || '', { wordwrap: 130 }).slice(0, 500),
    "image": product.images?.map(img => img.url) || [],
    "url": `https://uniquestorebd.shop/product/${product.slug}`, // Canonical URL
    "brand": {
      "@type": "Brand",
      "name": "Unique Store BD"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://uniquestorebd.shop/product/${product.slug}`,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Valid for 1 year
      "availability": product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Unique Store BD"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": product.advanced === 200 ? 0 : 100, // Assuming 200 for free delivery
          "currency": "BDT"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "BD" // Bangladesh
        },
        "transitTimeLabel": "Standard shipping",
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    // IMPORTANT: Replace with actual dynamic review data from your backend.
    // If no real reviews exist, it's better to omit this section or set counts to 0.
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8", // Dynamic average rating
      "reviewCount": "13", // Dynamic total review count
      "bestRating": "5",
      "worstRating": "1"
    },
    // "review": [{ // Example if you have individual review data
    //   "@type": "Review",
    //   "reviewRating": { "@type": "Rating", "ratingValue": "5" },
    //   "author": { "@type": "Person", "name": "Customer Name" },
    //   "reviewBody": "Excellent product, highly recommended!",
    //   "datePublished": "2024-05-20"
    // }]
  };

  // --- FAQ Page Schema (JSON-LD) ---
  // You can combine this into the Product schema or keep it separate.
  // Separate is often cleaner for complex FAQs.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the price of ${product?.shortName} in Bangladesh?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The latest price of <strong>${product?.shortName}</strong> is <strong>৳${product?.price}</strong> in Bangladesh. You can purchase this product at the best price from Unique Store BD website or any of our physical stores.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the warranty for ${product?.shortName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": product.warranty || "This product comes with a standard manufacturer's warranty. Please refer to the product details or contact us for specific warranty information."
        }
      },
      {
        "@type": "Question",
        "name": `How to buy ${product?.shortName} online in Bangladesh?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can easily buy ${product?.shortName} online from Unique Store BD. Simply add the product to your cart, proceed to checkout, and fill in your delivery details. We offer convenient home delivery across Bangladesh.`
        }
      }
      // Add more questions and answers here, ensure they are reflected in the HTML FAQ section
    ]
  };

  return (
    <div className="container mx-auto px-4 py-2 md:py-4">
      {/* JSON-LD for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        key="product-jsonld" // Add a key for React to handle multiple scripts
      />
      {/* JSON-LD for FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        key="faqpage-jsonld" // Add a key for React to handle multiple scripts
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left: Image Gallery & Latest Products */}
        <div className="w-full lg:w-1/2 space-y-4">
          <ImageSlider images={product.images} />
          {/* LatestProduct and LatestProductm are likely client components too */}
          <LatestProduct />
        </div>

        {/* Right: All Product Info */}
        <div className="w-full lg:w-1/2 space-y-2">
          {/* Title and Short Name */}
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* Price & Discount */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-stretch-20% text-black">{product.warranty}</span>
            {product.price !== product.originalPrice ? (
              <>
                <span className="text-xl font-extrabold text-red-600">৳{product.price}</span>
                <span className="line-through text-xl font-stretch-10% text-gray-500">
                  ৳{product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-red-600">৳{product.price}</span>
            )}
          </div>

          {/* Variant (Color) */}
          {product.specifications.some((s) => s.key === 'Color') && (
            <div>
              <h3 className="text-sm font-medium">Color:</h3>
              <div className="flex space-x-2 mt-2">
                {product.specifications
                  .filter((s) => s.key === 'Color')
                  .map((spec) => (
                    <Button
                      key={spec.value}
                      onClick={() => setSelectedVariant(spec.value)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedVariant === spec.value ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: spec.value }}
                      title={spec.value}
                      aria-label={`Select color ${spec.value}`}
                    >
                      {selectedVariant === spec.value && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-lg"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                className="px-3 py-1 text-lg"
                disabled={quantity >= availableStock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">{availableStock} in stock</span>

            <Button
              onClick={handleAddToCart}
              disabled={availableStock <= 0 || (product.specifications.some((s) => s.key === 'Color') && !selectedVariant)} // Disable if variant is mandatory but not selected
              className={`w-full sm:w-auto py-3 px-6 rounded-md font-semibold ${
                availableStock <= 0 || (product.specifications.some((s) => s.key === 'Color') && !selectedVariant)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {availableStock <= 0 ? 'Out of Stock' : (product.specifications.some((s) => s.key === 'Color') && !selectedVariant ? 'Select Color' : 'Order Now')}
            </Button>
          </div>

          {/* Payment Info */}
          <div className="mb-2">
            <p className="text-red-600 font-bold">
              {advanced} Taka or full payment in advance is required
            </p>
          </div>

          {/* Quick Specs */}
          {product.specifications.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Specifications</h3>
              <ul className="space-y-1 list-disc pl-5">
                {product.specifications.slice(0, 4).map((spec, idx) => (
                  <li key={idx} className="flex text-sm text-gray-800">
                    <span className="w-24 flex-shrink-0 uppercase text-black font-bold">{spec.key}:</span>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
              {product.specifications.length > 4 && (
                <Link href="#full-specifications" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  View all specifications
                </Link>
              )}
            </div>
          )}

          {/* Floating Facebook Button */}
          <div className="fixed bottom-16 sm:right-20 right-12 z-50">
            <Link target='_blank' href="https://www.facebook.com/uniquestorebd23" passHref>
              <span
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
                title="Visit our Facebook page"
              >
                <Facebook size={24} />
              </span>
            </Link>
          </div>

          {/* Product Description */}
          <div className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h2>
            <h3 className="font-bold sm:text-xl border-b text-black my-2">{product.shortName} in Bangladesh</h3>

            {product?.video ? (
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2">Product Video</h4>
                <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden">
                  <YouTubeEmbed
                    videoid={product.video}
                    params="controls=1&color=red&rel=0"
                  />
                </div>
              </div>
            ) : null}

            <div
              className="prose prose-sm max-w-none prose-p:leading-relaxed prose-li:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
            />
          </div>
        </div>
      </div>

      {/* Product Tags */}
      {product.seo && (
        <div className="mb-6 pt-4">
          <h2 className="text-lg font-semibold mb-2">Product Tags</h2>
          <div className="flex flex-wrap gap-2">
            {product.seo.split(',').map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <section className="border border-gray-200 rounded-lg p-2 mb-6">
        <h2 className="text-xl font-bold mb-3">Frequently Asked Questions about {product.shortName}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What is the price of <b>{product?.shortName}</b> in Bangladesh?</h3>
            <p className="text-gray-800">
              The latest price of <b>{product?.shortName}</b> is <b>৳{product?.price}</b> in Bangladesh. You can purchase this product at the best price from Unique Store BD website or any of our physical stores.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">What is the warranty for <b>{product?.shortName}</b>?</h3>
            <p className="text-gray-700">
              {product.warranty || "This product comes with a standard manufacturer's warranty. Please refer to the product details or contact us for specific warranty information."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">How to buy <b>{product?.shortName}</b> online in Bangladesh?</h3>
            <p className="text-gray-700">
              You can easily buy {product?.shortName} online from Unique Store BD. Simply add the product to your cart, proceed to checkout, and fill in your delivery details. We offer convenient home delivery across Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* More Latest Products */}
      <LatestProductm />
    </div>
  );
};

export default ProductDetailPage;