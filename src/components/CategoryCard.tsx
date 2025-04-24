'use client';

import { ICategory } from '@/models/Category';


export default function CategoryList({ category }: { category: ICategory }) {

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div 
    
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-lg">{category.name}</h3>
          <p className="text-gray-600 mt-2">{category.description}</p>
     
        </div>

    </div>
  );
}