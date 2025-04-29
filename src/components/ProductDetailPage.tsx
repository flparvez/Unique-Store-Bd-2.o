'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { IProduct } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';


interface ProductImage {
  url: string;
  altText?: string;
}

const ProductDetailPage = ({ product }: { product: IProduct }) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItem, isInitialized } = useCart();

  const cartItem = getItem(product._id, selectedVariant);
  const currentQuantity = cartItem?.quantity || 0;
  const availableStock = product.stock - currentQuantity;
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product.images]);

  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    addToCart(product, quantity, selectedVariant);
    toast.success('Product added to cart');
  };

  if (!isInitialized) return <div className="text-center py-8">Loading cart...</div>;



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
 <div className="flex items-center space-x-4">
            {product.discount ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Variant Selection (if applicable) */}
          {product.specifications.some((spec) => spec.key === 'Color') && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <div className="flex space-x-2 mt-2">
                {product.specifications
                  .filter((spec) => spec.key === 'Color')
                  .map((spec) => (
                    <button
                      key={spec.value}
                      onClick={() => setSelectedVariant(spec.value)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedVariant === spec.value
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: spec.value }}
                      title={spec.value}
                    />
                  ))}
              </div>
            </div>
          )}
  
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
   {/* Quantity Selector */}
   <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="px-3 py-1 text-lg disabled:opacity-50"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(availableStock, prev + 1))}
                disabled={quantity >= availableStock}
                className="px-3 py-1 text-lg disabled:opacity-50"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {availableStock} available
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
            className={`w-full py-3 px-4 rounded-md font-medium ${
              availableStock <= 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {availableStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
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
