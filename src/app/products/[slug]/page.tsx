import CategorySlider from '@/components/shared/CategorySlider';
import ProductByCategory from '@/components/shared/ProductByCategory';
import { ICategory } from '@/models/Category';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import React from 'react'


type Props = {
    params: Promise<{ slug: string }>;
  };

export async function generateMetadata( { params }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    const { slug } = await params;
  
    try {
      const category:ICategory= await fetch(
        `https://unique-store-bd.vercel.app/api/categories/${slug}`
      ).then((res) => res.json());
  
 
      if (!category) {
        return {
          title: "Category Not Found | Unique Store BD",
          description: "The requested category does not exist",
        };
      }
  
      const previousImages = (await parent).openGraph?.images || [];
      const description = `${category.description || 'Browse our collection of'} ${category.name}. ${category.tags || 'Best prices in Bangladesh'}`;
  
      return {
        title: `${category.name} - Unique Store BD`,
        description: description,
        keywords: [
          category.tags || '',
          'buy online',
          'price in Bangladesh',
          'Unique Store BD'
        ].join(', '),
        alternates: {
          canonical: `https://uniquestorebd.shop/products/${category.slug}`,
        },
        openGraph: {
          title: `${category.name} | Unique Store BD`,
          description: description.slice(0, 160),
          url: `https://uniquestorebd.shop/products/${category.slug}`,
          images: [category.images?.[0]?.url || '/default-category.jpg', ...previousImages],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${category.name} | Unique Store BD`,
          description: description.slice(0, 160),
          images: [category.images?.[0]?.url || '/default-category.jpg'],
        },
      };
    } catch (error) {
      console.error('Error generating metadata:', error);
      return {
        title: "Category | Unique Store BD",
        description: "Browse our product categories",
      };
    }
  }



const Category =async ({params}: {params: Promise<{slug:string}>}) => {
    const { slug } = await params;
   
  try {
    const category = await fetch(
      `https://unique-store-bd.vercel.app/api/categories/${slug}`
    ).then((res) => res.json());

    if (!category) {
      return (
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-red-500">Category Not Found</h1>
          <p className="text-gray-600 mt-2">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link 
            href="/products" 
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Browse all categories
          </Link>
        </div>
      );
    }

        // Structured data for category
        const categorySchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: category.description,
            url: `https://uniquestorebd.shop/products/${category.slug}`,
            image: category.images?.[0]?.url || '/default-category.jpg'
          };
    return (
        <div>
            <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        />

        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="py-2 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-600" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Category header */}
        <header className="text-center ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </header>
        <div>
            
            <CategorySlider />
            <ProductByCategory slug={slug} />
        </div>

        {/* Tags */}
        {category.tags && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-center">Related Tags</h2>
            <div className="flex flex-wrap justify-center gap-2">
           
                <span
               
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {category?.tags}
                </span>
       
            </div>
          </section>
        )}
  <section className="max-w-4xl mx-auto py-8 border-t border-gray-200">
  <div className="prose prose-sm md:prose-base mx-auto">
    <h2 className="text-xl font-bold text-gray-900 mb-4">
       {category.name} at Unique Store BD
    </h2>
    <p>
      <strong className="text-yellow-600">Unique Store BD</strong> offers the best selection of {category.name} in Bangladesh. 
      We maintain comprehensive stock to ensure quick delivery of your orders.
    </p>
    <p>
      Experience online shopping in Bangladesh for authentic products at competitive prices. 
      Our collection includes the latest {category.name} with guaranteed quality and warranty.
    </p>
    <p>
      Enjoy convenient home delivery or pickup options. We provide exceptional after-sales 
      support and free consultations to help you find the best products for your needs.
    </p>
    <p>
      With years of experience, we&apos;ve earned customer trust through authentic products 
      and quality service, making us a leading eCommerce platform in Bangladesh.
    </p>
    <p>
      Join our community on <Link href="https://www.facebook.com/uniquestorebd23" className="text-yellow-600 hover:underline">Facebook</Link> 
      to stay updated on new arrivals and special offers for {category.name}.
    </p>
    <p>
      For the best {category.name} in Bangladesh, <strong className="text-yellow-600">Unique Store BD</strong> is your 
      trusted destination with professional support and competitive pricing.
    </p>
  </div>
</section>
</div>
);
} catch (error) {
console.error('Error loading category:', error);
return (
<div className="text-center py-10">
<h1 className="text-2xl font-bold text-red-500">Error Loading Category</h1>
<p className="text-gray-600 mt-2">
  We&apos;re having trouble loading this category. Please try again later.
</p>
</div>
);
}
};

export default Category
