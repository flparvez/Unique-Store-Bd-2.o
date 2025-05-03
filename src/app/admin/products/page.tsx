"use client"
import ProductList from '@/components/admin/ProductList'
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton'
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Products =  () => {
  const { data } = useSWR('/api/products', fetcher);

  if (!data) return <ProductLoadingSkeleton />

  return (
  <ProductList products={data?.products} />
  )
}

export default Products