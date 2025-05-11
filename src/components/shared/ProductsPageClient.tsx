'use client';


import AllProductList from '@/components/shared/product/AllProduct';
import { IProduct, IPagination } from '@/types/product';
import Pagination from './Pagination';
interface Apiresponse {
    success: boolean;
    products: IProduct[];
    pagination: IPagination;
}

export default function ProductsPageClient({ pagination,products }:Apiresponse ) {

  return (
    <div className="container mx-auto px-4">
  

      <section>
        <AllProductList products={products} />
      </section>

 
        <div className='sm:mb-10 mb-20'>
        <Pagination currentPage={pagination.page} totalPages={pagination.pages} />

        </div>
    </div>
  );
}
