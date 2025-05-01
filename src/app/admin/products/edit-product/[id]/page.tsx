

import React from 'react'
import EditProduct from '../Ediproduct';

const ProductEdit = async({params}: {params:Promise<{id:string}>}) => {

  const id= (await params).id


  return (
  
     <EditProduct id={id}   />
 
  )
}

export default ProductEdit
