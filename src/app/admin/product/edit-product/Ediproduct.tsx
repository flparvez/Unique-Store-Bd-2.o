
import { ProductEditForm } from '@/components/admin/EditProduct';
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton';
import { fetchProductById, getAllCategory } from '@/lib/action/product-action';


export default async function EditProductPage({id}: {id: string}) {
const product = ( await fetchProductById(id))
const categories = ( await getAllCategory())


  if (!product && !categories) return <div><ProductLoadingSkeleton /></div>;

  return <div className='w-full py-4 px-2 '> 
    <ProductEditForm product={product} categories={categories} />
  </div>;
}