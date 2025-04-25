
"use client"

import { apiClient } from '@/lib/api-client';
import { ICategory } from '@/models/Category';
import Image from 'next/image';
import { useEffect, useState } from 'react';


const CategoryList = () => {
  const [category, setCategories] = useState<ICategory[]>();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
  
    fetchVideos();
  }, []);
  return (
    <div className='border-2'>

      {
        category && category?.map((category) => (
            <div key={category._id} className='container'>
                <h2>{category.name}</h2>
                <p>{category.description}</p> 
                <div className='flex'>
                {
                  category?.images && category.images.length > 0 &&  category.images.map((image) => (
                    <Image key={image.publicId} src={image.url} alt={category.name} width={200} height={200} />
                  ))
                }
                </div>
              
               
            </div>
        ))
      }
    </div>
  )
}

export default CategoryList
