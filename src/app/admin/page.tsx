import AdminComponent from '@/components/admin/AdminComponent'
import { apiClient } from '@/lib/api-client';
import React from 'react'

const Admin =async () => {
        const response = await apiClient.getProducts();
     
  return (
    <div>
      <AdminComponent product={response} />
    </div>
  )
}

export default Admin
