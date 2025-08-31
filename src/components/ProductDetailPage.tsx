// components/ProductDetailPage.tsx
'use client';

import React, { useState } from 'react';
import { YouTubeEmbed } from '@next/third-parties/google';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Facebook, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { IProduct } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

import Loading from './shared/Loading';
import ImageSlider from './shared/product/ImageSlider';
import LatestProduct from './shared/product/LatestProduct';
import LatestProductm from './shared/product/LatestPm';

interface ProductDetailPageProps {
  product: IProduct;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
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
    if (product.specifications.some((s) => s.key === 'Color') && !selectedVariant) {
      toast.error('Please select a color before adding to cart.');
      return;
    }

    addToCart(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  const advanced = product?.advanced || 100;

  // Render loading state if cart is not initialized
  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Basic check for product data before rendering details
  if (!product || !product.specifications) {
    return <Loading />;
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the price of ${product?.shortName} in Bangladesh?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The latest price of ${product?.shortName} is ৳${product?.price} in Bangladesh. You can purchase this product at the best price from our website or any of our physical stores.`
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
          "text": `You can easily buy ${product?.shortName} online from our store. Simply add the product to your cart, proceed to checkout, and fill in your delivery details. We offer convenient home delivery across Bangladesh.`
        }
      }
    ]
  };

  return (
    <div className=" mx-auto px-1 py-1 md:py-4 bg-gray-50 min-h-screen">
      {/* JSON-LD for FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        key="faqpage-jsonld"
      />

      <div className="flex flex-col lg:flex-row gap-1 lg:gap-8">
        {/* Left: Image Gallery & Latest Products */}
        <div className="sm:w-[50%] space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageSlider discount={product?.discount} images={product.images} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LatestProduct />
          </motion.div>
        </div>

        {/* Right: All Product Info */}
        <div className="w-full lg:w-1/2 space-y-2">
          {/* Title and Short Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
            {product.shortName && (
              <p className="text-sm text-gray-600">{product.shortName}</p>
            )}
          </motion.div>

        
          {/* Price & Discount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-red-600">৳{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="line-through text-sm text-gray-500">
                  ৳{product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-2 mb-4"
          >
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
              <Truck className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-xs text-gray-700 text-center">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-green-600 mb-1" />
              <span className="text-xs text-gray-700 text-center">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
              <RotateCcw className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-xs text-gray-700 text-center">Easy Returns</span>
            </div>
          </motion.div>

          {/* Variant (Color) */}
          {product.specifications.some((s) => s.key === 'Color') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-3 bg-white rounded-lg shadow-sm"
            >
              <h3 className="text-sm font-medium mb-2">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {product.specifications
                  .filter((s) => s.key === 'Color')
                  .map((spec) => (
                    <button
                      key={spec.value}
                      onClick={() => setSelectedVariant(spec.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedVariant === spec.value
                          ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: spec.value }}
                      title={spec.value}
                      aria-label={`Select color ${spec.value}`}
                    >
                      {selectedVariant === spec.value && (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Quantity:</span>
              <span className="text-sm text-gray-600">{availableStock} in stock</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= availableStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <p className="text-sm text-yellow-800 font-medium">
              Note: {advanced} Taka or full payment in advance is required
            </p>
          </motion.div>

{/* Sticky Order Now Button */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.7 }}
  className="fixed sm:bottom-0 bottom-14 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 shadow-2xl z-50 p-3"
>
  <div className="container mx-auto flex justify-center items-center">
    <motion.button
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAddToCart}
      disabled={availableStock <= 0 || (product.specifications.some((s) => s.key === "Color") && !selectedVariant)}
      className="relative w-full sm:w-auto py-3 sm:py-4 px-4 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white font-bold text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine group-hover:duration-1000"></div>
      </div>
      
      {/* Pulse ring effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-red-400/50 group-hover:animate-pulse-ring group-hover:border-red-300/80 transition-all duration-300"></div>
      
      {/* Content */}
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      
      <span className="relative z-10 font-extrabold tracking-wide">
        {availableStock > 0 ? (
          <span className="flex items-center gap-2">
            <span>ORDER NOW</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            ></motion.span>
          </span>
        ) : (
          'OUT OF STOCK'
        )}
      </span>
      
      {/* Quick delivery badge */}
      {availableStock > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          Fast
        </span>
      )}
    </motion.button>
  </div>

  <style jsx global>{`
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    .group-hover\:animate-shine {
      animation: shine 1.5s ease-in-out;
    }
    
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .group-hover\:animate-pulse-ring {
      animation: pulse-ring 1.5s infinite;
    }
  `}</style>
</motion.div>

          {/* Quick Specs */}
          {product.specifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-3 bg-white rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Specifications</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.specifications.slice(0, 4).map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700">{spec.key}:</span>
                    <span className="text-sm text-gray-900 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
              {product.specifications.length > 4 && (
                <Link href="#full-specifications" className="text-blue-600 text-sm hover:underline mt-3 inline-block">
                  View all specifications →
                </Link>
              )}
            </motion.div>
          )}

          {/* Product Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'description'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'specs'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Specifications
                </button>
              </nav>
            </div>
            <div className="p-1">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-bold text-lg border-b text-black my-2">{product.shortName} Details</h3>
                    {product?.video && (
                      <div className="mb-4">
                        <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden">
                          <YouTubeEmbed
                            videoid={product.video}
                            params="controls=1&color=red&rel=0"
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
                    />
                  </motion.div>
                )}
                {activeTab === 'specs' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-bold text-lg mb-3">Full Specifications</h3>
                    <div className="space-y-3">
                      {product.specifications.map((spec, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700">{spec.key}:</span>
                          <span className="text-sm text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Floating Facebook Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="fixed bottom-24 sm:bottom-6 right-4 z-50"
          >
            <Link href="https://www.facebook.com/uniquestorebd23" passHref
             
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
                title="Visit our Facebook page"
              >
                <Facebook size={24} />
            
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Product Tags */}
      {product.seo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mb-6 pt-6"
        >
          <h2 className="text-lg font-semibold mb-3">Product Tags</h2>
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
        </motion.div>
      )}

      {/* Frequently Asked Questions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="bg-white border border-gray-200 rounded-lg p-6 mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What is the price of {product.shortName} in Bangladesh?</h3>
            <p className="text-gray-700">
              The latest price of {product.shortName} is <strong>৳{product.price}</strong> in Bangladesh. You can purchase this product at the best price from our website.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What is the warranty for {product.shortName}?</h3>
            <p className="text-gray-700">
              {product.warranty || "This product comes with a standard manufacturer's warranty. Please contact us for specific warranty information."}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">How to buy {product.shortName} online?</h3>
            <p className="text-gray-700">
              You can easily buy {product.shortName} online from our store. Add to cart, proceed to checkout, and provide your delivery details for convenient home delivery across Bangladesh.
            </p>
          </div>
        </div>
      </motion.section>

      {/* More Latest Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <LatestProductm />
      </motion.div>
    </div>
  );
};

export default ProductDetailPage;