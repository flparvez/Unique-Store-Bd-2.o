"use client";
import { useCart } from '@/hooks/useCart';
import { IProduct } from '@/types/product';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AllProductList({ products }: { products: IProduct[] }) {
  const { addToCart } = useCart();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!products?.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back later for new arrivals.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 py-1">
      <div className=" mx-auto ">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-2">Unique Store Bd - All Products</h1>
        
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              className="bg-white  border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Link href={`/product/${product.slug}`}>
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
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {product?.discount}% OFF
                  </span>
                )}

                {/* Rating Badge */}
                {product.rating && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-95 rounded-full px-2 py-1 shadow-md flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xs font-semibold text-gray-800">
                      {product.rating}
                    </span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col space-y-2">
                  <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors h-12 text-sm md:text-base"
                    title={product.name}
                  >
                    {product.shortName || product.name}
                  </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      ৳{product.price}
                    </p>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ৳{product.originalPrice}
                        </p>
                      )}
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="p-2.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </motion.button>
                </div>

                {/* Stock Status */}
                {product.stock !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{
                          width: `${
                            product.stock > 10
                              ? 100
                              : (product.stock / 10) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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

        {/* Load More Button (if needed) */}
        {products.length >= 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Load More Products
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}