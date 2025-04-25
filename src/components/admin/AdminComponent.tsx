import { ApiResponse } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface AdminComponentProps {
  product: ApiResponse | null;
}

const AdminComponent: React.FC<AdminComponentProps> = ({ product }) => {
  // Early return for loading/error states
  if (!product) {
    return (
      <div className="p-4">
        <h2>Admin</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  // Check for empty products array
  if (!product.products || product.products.length === 0) {
    return (
      <div className="p-4">
        <h2>Admin</h2>
        <Link className="text-xl" href="/admin/product/create-product">
          Create Product
        </Link>
        <p className="mt-4">No products found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin</h2>

      <Link 
        className="text-xl mb-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" 
        href="/admin/product/create-product"
      >
        Create Product
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {product.products.map((product) => {
          // Ensure image URL exists
          const imageUrl = product.images?.[0]?.url || "/placeholder-product.jpg";
          const altText = product.name || "Product image";

          return (
            <div 
              key={product._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/admin/product/edit-product/${product._id}`} className="block">
                <div className="relative aspect-square">
                  <Image
                    width={300}
                    height={300}
                    src={imageUrl}
                    alt={altText}
                    className="object-cover w-full h-full"
                    priority={false}
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/admin/product/edit-product/${product._id}`}>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminComponent;