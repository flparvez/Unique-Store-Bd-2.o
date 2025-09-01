"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";
import { motion, Variants } from "framer-motion";
import React from "react";

const TopSellingProduct = ({ products }: { products: IProduct[] }) => {
  // ✅ Sort by popularityScore
  const sortedProducts = [...products]
    .sort((a, b) => (b?.popularityScore || 0) - (a?.popularityScore || 0))
    .slice(0, 12);

  const { addToCart } = useCart();

  // 🔹 Animation Variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
    hover: { scale: 1.03, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="container mx-auto sm:px-4 sm:py-10">
      <h2 className="text-2xl sm:text-3xl text-center font-extrabold mb-8 text-gray-800">
        🌟 Top Selling Products
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {sortedProducts?.map((product, index) => (
          <motion.div
            key={product._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.05 }}
          >
            {/* Product Image */}
            <Link href={`/product/${product.slug}`} prefetch>
              <div className="relative aspect-square">
                <Image
                  src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-2xl"
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
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
                  >
                    {product?.discount}% OFF
                  </motion.span>
                ) : null}
              </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col flex-1 p-3">
              <Link href={`/product/${product.slug}`} prefetch>
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

                {/* Add to Cart */}
                <motion.button
                  onClick={() => addToCart(product)}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-md transition"
                >
                  <ShoppingCart size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <Link href={"/products"}>
          <Button className="px-6 py-2 text-lg rounded-full shadow-md hover:shadow-lg transition">
            Load All Products
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TopSellingProduct;
