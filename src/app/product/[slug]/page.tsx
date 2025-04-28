import ProductDetailPage from '@/components/ProductDetailPage';
import { fetchProductBySlug } from '@/lib/action/product-action';

import React from 'react'

const ProductPage = async ({params}: {params : Promise<{slug: string}>}) => {
const {slug} = (await params)
const product = await fetchProductBySlug(slug)

  return (
    <div>

      <ProductDetailPage product = {product} />
    </div>
  )
}

export default ProductPage
