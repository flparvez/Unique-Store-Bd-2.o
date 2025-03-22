
import { apiClient } from '@/lib/api-client'
import Image from 'next/image';

import React from 'react'

const CategoryList =async () => {
    const categories =await apiClient?.getCategories();
 
  return (
    <div>
      {
        categories?.map((category) => (
          <div key={category._id}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            <Image width={200} height={200} src={category.image} alt={category.name} />
          </div>
        ))
      }
    </div>
  )
}

export default CategoryList
