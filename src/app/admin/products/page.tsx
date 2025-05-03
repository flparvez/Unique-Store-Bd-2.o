
import ProductList from '@/components/admin/ProductList'
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton'
import { getAllProducts } from '@/lib/action/product-action'

const Products = async () => {
  const products = (await getAllProducts())
  
  if (!products) return <ProductLoadingSkeleton />

  return (
  <ProductList products={products} />
  )
}

export default Products