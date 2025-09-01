"use client";

import { useCart } from "@/hooks/useCart";
import { IProduct } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const ProductByCategoryClient = ({ products }: { products: IProduct[] }) => {
  const { addToCart } = useCart();

  if (!products.length) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No products in this category.
      </p>
    );
  }

  // 🔹 Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80 },
  },
  hover: {
    scale: 1.03,
    transition: { type: "spring", stiffness: 300 },
  },
};

  return (
    <div className="mt-8 mx-auto px-2 sm:px-4 lg:px-6">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden transition-all"
          >
            {/* 🔹 Product Image */}
            <Link href={`/product/${product.slug}`} prefetch={true}>
              <div className="relative aspect-square">
                <Image
                  src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-2xl transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 768px) 50vw,
                         (max-width: 1024px) 33vw,
                         20vw"
                />
                {product?.discount ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow"
                  >
                    {product?.discount}% OFF
                  </motion.span>
                ) : null}
              </div>
            </Link>

            {/* 🔹 Product Info */}
            <div className="flex flex-col flex-1 p-3 sm:p-4">
              <Link href={`/product/${product.slug}`} prefetch={true}>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition">
                  {product.shortName}
                </h3>
              </Link>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ৳{product.price}
                  </p>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <p className="text-sm text-gray-400 line-through">
                        ৳{product.originalPrice}
                      </p>
                    )}
                </div>

                {/* 🔹 Always visible Add to Cart */}

                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-pink-800 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-medium shadow transition"
                >
                  <ShoppingCart size={16} />
                  <span>Add To Cart</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductByCategoryClient;
