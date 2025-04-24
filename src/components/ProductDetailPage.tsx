"use client";
import { apiClient } from '@/lib/api-client';
import { ApiResponseP } from '@/types/product';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';



interface ProductDetailPageProps {
  slug: string;
}

const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
  const [data, setData] = useState<ApiResponseP | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getProductBySlug(slug);
        
        
        
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading || error) {
    return <ProductLoadingSkeleton />;
  }




  const product = data?.product;
if (!product) {
  return <ProductLoadingSkeleton />;
}
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="grid grid-cols-2 gap-4">
      {
        product.images?.map((image, index) => (
          <div key={index} className="aspect-square relative">
          <Image
            src={image.url}
            alt={`${product.name} - Image ${index + 1}`}
            fill
            className="object-cover rounded-lg"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        ))
      }
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < (product.rating || 0) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-gray-500">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <div className="mb-6">
          {
            product?.discount ?   <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {product.discount}% OFF
          </span> : null
          }
            <div className="flex items-center mt-2">
              <p className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="ml-2 text-lg text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <p className="mb-6 text-gray-700">{product?.description}</p>

          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {product?.reviews?.length ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                    {review.user.image && (
                      <Image
                        src={review.user.image}
                        alt={review.user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>

       */}
    </div>
  );
};

export default ProductDetailPage;