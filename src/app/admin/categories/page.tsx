"use client"
import { handleDeleteCategory } from '@/components/admin/DeleteProduct'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useCategory } from '@/hooks/UseOrders'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CreateCategory = () => {
  const {category} = useCategory()
  console.log(category)
  return (
   <div >
      <Link href="/admin/categories/add">
        <h1 className="text-2xl font-bold">Add Category</h1>       </Link>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      
        {
          category?.map((category) => (
            <div key={category._id}>
        <Card className="w-full max-w-sm mx-auto">
          <div>
            <div className="relative">
              <Image
                width={200}
                height={200}
                src={category.images[0].url}
                alt={category.name}
                className="w-full h-[300px] object-cover rounded-t-lg"
              />
            </div>
            <CardContent>
              <h2 className="text-xl font-bold mb-2 mt-2">{category.name}</h2>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link href={`/admin/categories/edit/${category.slug}`}>Edit</Link>
              <Button onClick={() => handleDeleteCategory(category.slug)}  variant="destructive">Delete</Button>
            </CardFooter>
          </div>
        </Card>
        </div>
          ))
        }

    </div>
    </div>

  )
}

export default CreateCategory
