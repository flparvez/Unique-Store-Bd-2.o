'use client';

import { ICategory } from '@/models/Category';
import Image from 'next/image';


export default function CategoryList({ category }: { category: ICategory[] }) {



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

  );
}