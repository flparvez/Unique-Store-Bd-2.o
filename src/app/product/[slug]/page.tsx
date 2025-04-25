import {ProductDetailsPage} from '@/components/ProductDetailPage';

import React from 'react'

const ProductPage = async ({params}: {params : Promise<{slug: string}>}) => {
const {slug} = (await params)

  return (
    <div>

      <ProductDetailsPage slug = {slug} />
    </div>
  )
}

export default ProductPage
