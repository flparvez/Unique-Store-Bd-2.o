'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { IProduct } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';


interface ProductImage {
  url: string;
  altText?: string;
}
interface Props {
  product: IProduct;
  products: IProduct[];
}

const ProductDetailPage = ({ product,products }:Props) => {

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


  if (!product || !product.specifications ) {
    return <ProductLoadingSkeleton />;
  }


  const latestproducts = products.slice(3, 13);

  return (
<div className="container mx-auto px-4 py-8 md:py-12">
  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
    {/* Left: Image Gallery */}
    <div className="w-full lg:w-1/2 space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || product.name}
            width={600}
            height={600}
            className="w-full h-full object-contain"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Thumbnails */}
      <div className=" flex gap-2 overflow-x-auto">
        {product?.images?.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={cn(
              'w-16 h-16 rounded-md overflow-hidden border-2',
              selectedImage?.url === img.url
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-transparent'
            )}
          >
            <Image
              src={img.url}
              alt={img.altText || `${product.name} thumb ${idx + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

        {/* Latest Products Section */}
  <div className="hidden sm:block mt-16">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Products</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {latestproducts?.map((product) => (
      <div key={product._id} 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"

    >
      <Link href={`/product/${product.slug}`} className="block">
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
          <h3 className=" text-sm font-bold mb-1 line-clamp-2 hover:text-blue-600 transition">
            {product.shortName}
          </h3>
        </Link>

       

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-800">
            ৳{product.price}
            </p>
        
          
          </div>
     
          <div className={`flex space-x-2 transition-opacity  hover:opacity-100 opacity-0}`}>
            <button   onClick={() => addToCart(product)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <ShoppingCart size={18} />
            </button>
         
          </div>
        </div>
      </div>
    </div>
      ))}
    </div>
  </div>
    </div>

    {/* Right: All Product Info */}
    <div className="w-full lg:w-1/2 space-y-6">
      {/* Title and Short Name */}
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-base text-muted-foreground">{product.shortName}</p>
      </div>

      {/* Price & Discount */}
      <div className="flex items-center gap-4">
      
          <>
            <span className="text-3xl font-bold text-red-600">৳{product.price}</span>
            <span className="line-through text-xl text-gray-500">
              ৳{product.originalPrice?.toFixed(2)}
            </span>
        
          </>
 
      </div>

      {/* Variant (Color) */}
      {product.specifications.some((s) => s.key === 'Color') && (
        <div>
          <h3 className="text-sm font-medium">Color</h3>
          <div className="flex space-x-2 mt-2">
            {product.specifications
              .filter((s) => s.key === 'Color')
              .map((spec) => (
                <button
                  key={spec.value}
                  onClick={() => setSelectedVariant(spec.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedVariant === spec.value ? 'border-blue-600' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: spec.value }}
                  title={spec.value}
                />
              ))}
          </div>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 text-lg"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
            className="px-3 py-1 text-lg"
            disabled={quantity >= availableStock}
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">{availableStock} available</span>

        <button
          onClick={handleAddToCart}
          disabled={availableStock <= 0}
          className={`w-full sm:w-auto py-3 px-6 rounded-md font-semibold ${
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
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Specifications</h3>
          <ul className="space-y-1">
            {product.specifications.slice(0, 4).map((spec, idx) => (
              <li key={idx} className="flex text-sm text-gray-800">
                <span className="w-24 flex-shrink-0 text-gray-600">{spec.key}</span>
                <span>{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      <div className="pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Product Description</h3>
        <div
          className="prose prose-sm max-w-none prose-p:leading-relaxed prose-li:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
        />
      </div>
    </div>
  </div>

  {/* Latest Products Section */}
  <div className="block sm:hidden mt-16">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Products</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {latestproducts?.map((product) => (
      <div key={product._id} 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"

    >
      <Link href={`/product/${product.slug}`} className="block">
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
          <h3 className=" sm:text-lg text-sm font-bold mb-1 line-clamp-2 hover:text-blue-600 transition">
            {product.shortName}
          </h3>
        </Link>

       

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-800">
            ৳{product.price}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice}
              </p>
            )}
          </div>
     
          <div className={`flex space-x-2 transition-opacity  hover:opacity-100 opacity-0}`}>
            <button   onClick={() => addToCart(product)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <ShoppingCart size={18} />
            </button>
         
          </div>
        </div>
      </div>
    </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default ProductDetailPage;
