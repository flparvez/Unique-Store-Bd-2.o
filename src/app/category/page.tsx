import { apiClient } from '@/lib/api-client';
import { notFound } from 'next/navigation';
import CategoryCard from '@/components/CategoryCard';
import { ICategory } from '@/models/Category';

// Revalidate this page every hour (ISR)
export const revalidate = 3600; 

export async function generateMetadata() {
  return {
    title: 'Product Categories | My Store',
    description: 'Browse all product categories',
  };
}

export default async function CategoriesPage() {
  try {
    const categories = await apiClient.getCategories();
    
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">All Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((category:ICategory) => (
            <div key={category._id}>
                <CategoryCard  category={category} />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load categories:', error);
    notFound(); // Will show 404 page if fetch fails
  }
}