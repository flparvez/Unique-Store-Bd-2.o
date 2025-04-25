
import { ApiResponse } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AdminComponent = ({product}:{product:ApiResponse}) => {
 
  return (
    <div>
      <h2>Admin</h2>

      <Link className="text-xl " href="/admin/product/create-product">Create Product</Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {product?.products?.map((product) => (  
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    
            <Link href={`/admin/product/edit-product/${product._id}`} className="block">
              <div className="relative aspect-square">
                <Image
                width={300}
                height={300}
                  src={product.images[0].url || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="object-cover"
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
        ))} 
    </div>
    </div>
  )}

export default AdminComponent
