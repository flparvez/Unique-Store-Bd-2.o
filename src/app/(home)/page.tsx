

import dynamic from 'next/dynamic';

import React from 'react'
const FeaturedProduct = dynamic(() => import('@/components/shared/home/FeaturedProduct'))
const CategorySlider = dynamic(() => import('@/components/shared/CategorySlider'))
const Home = dynamic(() => import('./Home'))


const Page =async () => {
const response = await fetch('https://uniquestorebd.store/api/products')
if (!response.ok) {
  throw new Error('Failed to fetch products')
}
const products = await response.json()
  return (
    <div>
           <FeaturedProduct products = {products?.products || []} />
  <CategorySlider />
     <Home />
    </div>
  )
}

export default Page
