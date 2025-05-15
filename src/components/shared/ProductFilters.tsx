'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';
import { Navbar } from './header/Navbar';



export default function ProductFilters() {

  const searchParams = useSearchParams()


  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set('query', query);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);
    if (featured) params.set('featured', 'true');

    router.push(`/products?${params.toString()}`);
  }, [query, minPrice, maxPrice, sort, featured, router]);
// test
  return (
    <div className='container'>
        <Navbar />
              <input
          className="w-full border ml-2 mr-2  px-3 py-2 rounded"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      {/* Toggle Button - shown only on small screens */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden flex items-center gap-2 mb-4 px-3 py-2 border rounded"
      >
        {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        Filters
      </button>

      {/* Filter Panel */}
      <div
        className={clsx(
          'bg-white border rounded p-4 space-y-4 transition-all duration-300',
          'fixed top-0 left-0 w-3/4 h-full z-50 md:static md:w-full md:h-auto',
          {
            'translate-x-0': showFilters,
            '-translate-x-full': !showFilters,
            'md:translate-x-0': true,
          }
        )}
      >


        
        {/* Close button on mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold">Filter Products</h2>
          <button onClick={() => setShowFilters(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

  

        <div className="flex gap-2">
          <input
            className="w-1/2 border px-2 py-1 rounded"
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            className="w-1/2 border px-2 py-1 rounded"
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <select
          className="w-full border px-3 py-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="lowest">Price: Low to High</option>
          <option value="highest">Price: High to Low</option>
          <option value="toprated">Top Rated</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span>Featured Only</span>
        </label>
        
      </div>

      
    </div>
  );
}
