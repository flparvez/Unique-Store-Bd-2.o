import { CategoryForm } from '@/components/admin/EditCategoryForm'
import React from 'react'

const EditCategory =async ({ params }:{params:Promise<{slug:string}>}) => {
    const {slug} = (await params)
    
    return (
        <div>
            <h1>Edit Category</h1>
            <CategoryForm slug={slug} /> 
        </div>
    )
}

export default EditCategory
