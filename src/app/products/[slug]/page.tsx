import CategorySlider from '@/components/shared/CategorySlider';
import ProductByCategory from '@/components/shared/ProductByCategory';
import React from 'react'

const Category =async ({params}: {params: Promise<{slug:string}>}) => {
    const { slug } = await params;
   
    return (
        <div>
            <CategorySlider />
            <ProductByCategory slug={slug} />
        </div>
    )
}

export default Category
