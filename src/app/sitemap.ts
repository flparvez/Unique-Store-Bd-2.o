import { ICategory, IProduct } from '@/types/product';
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://landig-store.vercel.app";
  
  // Fetch all necessary data in parallel
  const [productsRes, categoriesRes] = await Promise.all([
    fetch('https://landig-store.vercel.app/api/products', {
      next: { revalidate: 86400 } // Revalidate daily
    }),
    fetch('https://landig-store.vercel.app/api/categories', {
      next: { revalidate: 86400 } // Revalidate daily
    })
  ]);

  // Handle potential errors
  if (!productsRes.ok || !categoriesRes.ok) {
    console.error('Failed to fetch data for sitemap');
    // Return at least the static URLs as fallback
    return generateStaticUrls(baseUrl);
  }

  const products = await productsRes.json();
  const categories = await categoriesRes.json();

  // Generate all dynamic URLs
  const productUrls = products.products?.map((product:IProduct) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  const categoryUrls = categories?.map((category: ICategory) => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || [];

  // Combine all URLs
  return [
    ...generateStaticUrls(baseUrl),
    ...categoryUrls,
    ...productUrls
  ];
}

function generateStaticUrls(baseUrl: string): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // {
    //   url: `${baseUrl}/policy/returns`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly' as const,
    //   priority: 0.3,
    // },
    // {
    //   url: `${baseUrl}/policy/replacement-warranty`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly' as const,
    //   priority: 0.3,
    // },
    // // Add other important static pages
    // {
    //   url: `${baseUrl}/policy/after-sales-support`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.5,
    // },

  ];
}