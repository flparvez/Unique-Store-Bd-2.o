import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import components for better performance
const FeaturedProduct = dynamic(() => import('@/components/shared/home/FeaturedProduct'));
const CategorySlider = dynamic(() => import('@/components/shared/CategorySlider'));
const HomePageContent = dynamic(() => import('./Home')); // Renamed to avoid confusion with the file name

// Define API endpoints as constants for easier management
const PRODUCTS_API_URL = 'https://uniquestorebd.store/api/products';
const CATEGORIES_API_URL = 'https://uniquestorebd.store/api/categories';

// Function to fetch data with error handling
async function fetchData(url:string) {
  const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate data every hour
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}. Status: ${response.status}`);
  }
  return response.json();
}

const Page = async () => {
  let products = [];
  let categories = [];
  let error = null;

  try {
    // Fetch products and categories concurrently using Promise.all
    const [productsData, categoriesData] = await Promise.all([
      fetchData(PRODUCTS_API_URL),
      fetchData(CATEGORIES_API_URL),
    ]);
    products = productsData?.products || [];
    categories = categoriesData || [];
  } catch (err) {
    console.error('Error fetching data:', err);
    error = 'Failed to load some content. Please try again later.';
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <FeaturedProduct products={products} />
      <CategorySlider category={categories} />
      <HomePageContent products={products} />
    </div>
  );
};

export default Page;