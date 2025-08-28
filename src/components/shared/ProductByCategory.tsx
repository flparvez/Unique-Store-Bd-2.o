// ✅ Server Component
import ProductByCategoryClient from "@/components/ProductByCategoryClient";
import { IProduct } from "@/types/product";

export const revalidate = 60; // ISR cache

const ProductByCategory = async ({ slug }: { slug: string }) => {
  // 🔥 Fetch products server-side (fast, static, cached)
  const products: { products: IProduct[] } = await fetch(
    "https://uniquestorebd.store/api/products",
    { next: { revalidate } }
  ).then((res) => res.json());

  // ✅ Filter + sort before sending to client
  const productsBySlug =
    products?.products?.filter((p) => p?.category?.slug === slug) ?? [];

  const productsByCategory = [...productsBySlug].sort(
    (a, b) => (b?.popularityScore || 0) - (a?.popularityScore || 0)
  );

  return <ProductByCategoryClient products={productsByCategory} />;
};

export default ProductByCategory;
