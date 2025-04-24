"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, IProduct, Pagination } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";

const ProductList = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProducts();
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <ProductListSkeleton />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data?.products.length) return <EmptyState />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Our Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <PaginationControls pagination={data.pagination} />
    </div>
  );
};

// Sub-components with proper prop types

// Product Card Component (unchanged)
const ProductCard = ({ product }: { product: IProduct }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square">
          <Image
              src={product.images[0].url || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
      {
        product?.discount ?  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
        {product?.discount}% OFF
      </span> : null
      }
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < (product.rating || 0) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-1">
            ({product.reviews?.length || 0})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-800">
            ৳{product.price.toFixed(2)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          <div className={`flex space-x-2 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <ShoppingCart size={18} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const PaginationControls = ({ pagination }: { pagination: Pagination }) => (
  <div className="mt-8 flex justify-center">
    <div className="join">
      <button className="join-item btn">«</button>
      <button className="join-item btn">Page {pagination.page}</button>
      <button className="join-item btn">»</button>
    </div>
  </div>
);

const ProductListSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    {/* Skeleton loader */}
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <p className="text-red-500 mb-4">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">No products found</p>
  </div>
);

export default ProductList;