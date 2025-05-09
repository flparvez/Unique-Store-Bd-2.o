'use client';
import { YouTubeEmbed } from '@next/third-parties/google';
import {  useState } from 'react';

import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { IProduct } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import LatestProduct from './shared/product/LatestProduct';
import LatestProductm from './shared/product/LatestPm';
import { useRouter } from 'next/navigation';
import ImageSlider from './shared/product/ImageSlider';
import { Button } from './ui/button';
import Link from 'next/link';
import { Facebook } from 'lucide-react';
// import { ShoppingCart } from 'lucide-react';
// import Link from 'next/link';



interface Props {
  product: IProduct;
  
}

const ProductDetailPage = ({ product }:Props) => {



  const [selectedVariant, setSelectedVariant] = useState<string>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getItem, isInitialized } = useCart();
const router = useRouter();
  const cartItem = getItem(product._id, selectedVariant);
  const currentQuantity = cartItem?.quantity || 0;
  const availableStock = product.stock - currentQuantity;


  const handleAddToCart = () => {
    if (availableStock <= 0) return;
    addToCart(product, quantity, selectedVariant);
    toast.success('Product added to cart');
    router.push('/checkout')
  };
const advanced = product?.advanced || 100

  if (!isInitialized) return <div className="text-center py-8">Loading cart...</div>;


  if (!product || !product.specifications ) {
    return <ProductLoadingSkeleton />;
  }


  // const latestproducts = products.slice(3, 13);

  return (
<div className="container mx-auto px-4 py-2 md:py-4">
  <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
    {/* Left: Image Gallery */}
    <div className="w-full lg:w-1/2 space-y-4">
<ImageSlider images={product.images} />
        {/* Latest Products Section */}
<LatestProduct />
    </div>

    {/* Right: All Product Info */}
    <div className="w-full lg:w-1/2 space-y-2">
      {/* Title and Short Name */}
      <div>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
      
      </div>

      {/* Price & Discount */}
      <div className="flex items-center gap-4">
      
          <>
            <span className="text-xl font-extrabold text-red-600">৳{product.price}</span>
            <span className="line-through text-xl text-gray-500">
              ৳{product.originalPrice}
            </span>
        
          </>
 
      </div>

      {/* Variant (Color) */}
      {product?.specifications.some((s) => s.key === 'Color') && (
        <div>
          <h3 className="text-sm font-medium">Color</h3>
          <div className="flex space-x-2 mt-2">
            {product.specifications
              .filter((s) => s.key === 'Color')
              .map((spec) => (
                <Button
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

        <Button
          onClick={handleAddToCart}
          disabled={availableStock <= 0}
          className={`w-full sm:w-auto py-3 px-6 rounded-md font-semibold ${
            availableStock <= 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {availableStock <= 0 ? 'Out of Stock' : 'Order Now'}
        </Button>
      </div>
 {/* Payment Info */}
 <div className="mb-2">
              <p className="text-red-600 font-bold">
                {advanced} Taka or full payment in advance is required
              </p>
            </div>
      {/* Quick Specs */}
      {product.specifications.length > 0 && (
        <div className="pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Specifications</h3>
          <ul className="space-y-1">
            {product.specifications.slice(0, 4).map((spec, idx) => (
              <li key={idx} className="flex text-sm text-gray-800">
                <span className="w-24 flex-shrink-0 uppercase text-black font-bold">{spec.key}</span>
                <span>{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
<div className="fixed bottom-16 sm:right-20  right-12 z-50">
      <Link target='_blank' href="https://www.facebook.com/uniquestorebd23" passHref>
        <h1
          
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <Facebook size={24} />
        </h1>
      </Link>
    </div>
      {/* Description */}
      <div className="pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Product Description</h3>
        <h1 className="font-bold sm:text-xl  border-b text-black my-2 "> {product.shortName} in Bangladesh
        </h1> 
 {/* Product Video */}
 {product?.video?    <div className="mb-2">
                <h2 className="text-lg font-semibold mb-2">Product Video</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <YouTubeEmbed 
                    videoid={product.video} 
                    params="controls=1&color=red&rel=0" 
                  />
                </div>
              </div> : null }

        <div
          className="prose prose-sm max-w-none prose-p:leading-relaxed prose-li:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
        />
      </div>
    </div>
  </div>

  {/* Latest Products Section */}
 <LatestProductm />
</div>

  );
};

export default ProductDetailPage;
