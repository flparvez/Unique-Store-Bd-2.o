"use client";

import { useCart } from "@/hooks/useCart";
import { IProduct } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProductByCategoryClient = ({ products }: { products: IProduct[] }) => {
  const { addToCart } = useCart();

  if (!products.length) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No products in this category.
      </p>
    );
  }

  return (
    <div className="mt-8 mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* 🔹 Product Image */}
            <Link href={`/product/${product.slug}`} prefetch={true}>
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
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    {product?.discount}% OFF
                  </span>
                ) : null}
              </div>
            </Link>

            {/* 🔹 Product Info */}
            <div className="flex flex-col flex-1 p-3">
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
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center space-x-1 bg-orange-500 hover:bg-blue-700 text-white px-2 py-2 rounded-xl text-sm font-medium shadow transition"
                >
                  <ShoppingCart size={16} />
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductByCategoryClient;
