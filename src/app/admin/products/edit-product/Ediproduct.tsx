
import { ProductEditForm } from '@/components/admin/EditProduct';

export default async function EditProductPage({id}: {id: string}) {




  return <div className='w-full py-4 px-2 '> 
    <ProductEditForm id={id}  />
  </div>;
}