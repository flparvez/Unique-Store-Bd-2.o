"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";

const ProductList = ({ products }: { products: IProduct[] }) => {
  const { addToCart } = useCart();

  // Sort by lastUpdatedIndex (descending) and limit to 24 products
  const sliceProdct = [...products]
    .sort((a, b) => (b?.lastUpdatedIndex || 0) - (a?.lastUpdatedIndex || 0))
    .slice(0, 24);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
           Unique Store Bd - Quality Is Here
          </h2>
        
        </motion.div>

  {/* Products Grid */}
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.1 }}
  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6"
>
  {sliceProdct?.map((product) => (
    <motion.div
      key={product._id}
      variants={itemVariants}
      className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.slug}`} prefetch={true}>
          <Image
            src={product.images[0]?.url || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
          />
        </Link>

        {/* Discount Badge */}
        {product?.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-md">
            {product?.discount}% OFF
          </span>
        )}

        {/* Rating Badge - Hidden on mobile to save space */}
        {product.rating && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-95 rounded-full px-1.5 py-0.5 md:px-2 md:py-1 shadow-md flex items-center">
            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400 text-yellow-400 mr-0.5 md:mr-1" />
            <span className="text-xs font-semibold text-gray-800">
              {product.rating}
            </span>
          </div>
        )}

        {/* Quick Actions - Hidden on mobile to save space */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex flex-col space-y-1 md:space-y-2">
          <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Eye className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
          </button>
          <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 md:p-3 lg:p-4">
        <Link href={`/product/${product.slug}`} prefetch={true}>
          <h3
            className="font-medium text-xs md:text-sm text-gray-900 mb-1 md:mb-2 line-clamp-2 hover:text-blue-600 transition-colors h-8 md:h-12"
            title={product.name}
          >
            {product.shortName || product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-1 md:mt-2">
          <div>
            <p className="text-sm md:text-base font-bold text-gray-900">
              ৳{product.price}
            </p>
            {product.originalPrice &&
              product.originalPrice > product.price && (
                <p className="text-xs text-gray-500 line-through">
                  ৳{product.originalPrice}
                </p>
              )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} className="md:w-4 md:h-4" />
          </motion.button>
        </div>

        {/* Stock Status - Hidden on mobile to save space */}
        {product.stock !== undefined && (
          <div className="mt-1 md:mt-2 hidden sm:block">
            <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
              <div
                className="bg-green-500 h-1 md:h-1.5 rounded-full"
                style={{
                  width: `${
                    product.stock > 10
                      ? 100
                      : (product.stock / 10) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 md:mt-1">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  ))}
</motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link href={"/products"}>
            <Button
              size="lg"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              সকল পণ্য দেখুন
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductList;