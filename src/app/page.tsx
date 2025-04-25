import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

export default async function Home() {
  let products;
  let error = null;

  try {
    const response = await apiClient.getProducts();
    products = response;
  } catch (err) {
    console.error('Error fetching products:', err);
    error = err instanceof Error ? err.message : 'Failed to load products';
    
    // In production, return a generic error message
    if (process.env.NODE_ENV === 'production') {
      error = 'Failed to load products. Please try again later.';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to Our Store</h1>
        <Link 
          href="/admin/product/create-product" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Product
        </Link>
      </div>

      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
            {products ? (
              <ProductList product={products} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 h-64 animate-pulse"></div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <CategoryList />
          </section>
        </>
      )}
    </div>
  );
}