
import { apiClient } from '@/lib/api-client';
import React from 'react'
import EditProduct from '../Ediproduct';

const ProductEdit = async({params}: {params:Promise<{id:string}>}) => {

  const id= (await params).id
 const product = await apiClient.getProduct(id);

  return (
  
     <EditProduct  product = {product} />
 
  )
}

export default ProductEdit
