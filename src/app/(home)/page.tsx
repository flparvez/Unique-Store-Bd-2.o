

import dynamic from 'next/dynamic';

import React from 'react'
const FeaturedProduct = dynamic(() => import('@/components/shared/home/FeaturedProduct'))
const CategorySlider = dynamic(() => import('@/components/shared/CategorySlider'))
const Home = dynamic(() => import('./Home'))


const Page =async () => {
const response = await fetch('https://uniquestorebd.store/api/products')
const res = await fetch('https://uniquestorebd.store/api/categories')
if (!response.ok || !res.ok) {
  throw new Error('Failed to fetch products')
}
const products = await response.json()
const categories = await res.json()
  return (
    <div>
           <FeaturedProduct products = {products?.products || []} />
  <CategorySlider category = {categories || []} />
     <Home  products = {products?.products || []} />
    </div>
  )
}

export default Page
