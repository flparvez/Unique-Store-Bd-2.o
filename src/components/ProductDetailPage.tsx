'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { IProduct } from '@/types/product';

interface ProductImage {
  url: string;
  altText?: string;
}

const ProductDetailPage = ({ product }: { product: IProduct }) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product.images]);

  if (!product) {
    return <ProductLoadingSkeleton />;
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Main Product Section */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2">
          {/* Main Image */}
          <div className="aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-4">
            {selectedImage ? (
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || `${product.name} - Main Image`}
                width={600}
                height={600}
                className="w-full h-full object-contain"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3 overflow-x-auto py-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2',
                  selectedImage?.url === img.url
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-transparent'
                )}
                aria-label={`View ${product.name} image ${index + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Product Name and Short Description */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {product.name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {product.shortName}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl md:text-3xl font-semibold text-primary">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg line-through text-muted-foreground">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock and Warranty */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-600">
              Warranty: {product.warranty}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock <= 0}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Buy Now
            </Button>
          </div>

          {/* Quick Specs */}
          {product.specifications.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Key Specifications
              </h3>
              <ul className="space-y-2">
                {product.specifications.slice(0, 4).map((spec, idx) => (
                  <li key={idx} className="flex">
                    <span className="text-sm text-gray-600 w-24 flex-shrink-0">
                      {spec.key}
                    </span>
                    <span className="text-sm text-gray-900">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12 md:mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-primary text-primary">
              Description
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              Specifications
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              Reviews
            </button>
          </nav>
        </div>

        {/* Description Section */}
        <div className="py-8">
          <div
            className="prose max-w-none prose-p:leading-relaxed prose-li:leading-relaxed
                      prose-headings:font-medium prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                      prose-img:rounded-lg prose-img:shadow-sm prose-img:border"
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />
        </div>

        {/* Full Specifications Section */}
        {product.specifications.length > 0 && (
          <div className="py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Full Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {spec.key}
                  </h3>
                  <p className="text-base text-gray-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
