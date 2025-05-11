
import { ProductEditForm } from '@/components/admin/EditProduct';
import { fetchProductById } from '@/lib/action /product-action'

export default async function EditProductPage({id}: {id: string}) {


const product = ( await fetchProductById(id))


  return <div className='w-full py-4 px-2 '> 
    <ProductEditForm product={product}  />
  </div>;
}