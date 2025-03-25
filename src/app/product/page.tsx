import { ProductUploadForm } from './CreateProduct'
import { apiClient } from '@/lib/api-client'

import React from 'react'

const page = async () => {
    const data = await apiClient.getCategories()
  return (
    <div>
      <ProductUploadForm categories={data} />
    </div>
  )
}

export default page
