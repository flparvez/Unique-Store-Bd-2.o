"use client"

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { handleDelete } from '@/components/admin/DeleteProduct'
import { IProduct } from '@/types/product'

const ProductList = ({products}:{products:IProduct[]}) => {
    return (
        <div className="w-full py-4 px-2">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <Image
                          className="h-16 w-16 rounded-md object-cover"
                          src={product.images[0]?.url || '/placeholder-product.jpg'}
                          alt={product.name}
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                     
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category?.name || 'Uncategorized'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      ${product.price.toFixed(2)}
                      {product.originalPrice && (
                        <span className="ml-2 text-xs text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        product.stock > 10
                          ? 'default'
                          : product.stock > 0
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {product.stock > 10
                        ? 'In Stock'
                        : product.stock > 0
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.stock} units available
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/edit-product/${product._id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                     
                          <button onClick={() => handleDelete(product._id)} >
                      <Trash2 className="mr-2 h-4 w-4" />
                        Delete</button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )
}

export default ProductList
