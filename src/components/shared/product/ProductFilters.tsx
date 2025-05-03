'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FilterProps {
  searchParams: {
    query?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    featured?: string;
  };
}

let debounceTimer: NodeJS.Timeout;

export default function ProductFilters({ searchParams }: FilterProps) {
  const router = useRouter();

  const [ShowFIlter, setShowFIlter] = useState(false);



  const handleFilter = () => {
    setShowFIlter(true);
  };

const handleCloseFilter = () => {
  setShowFIlter(false);
};




  const [query, setQuery] = useState(searchParams.query || '');
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');
  // const [rating, setRating] = useState(searchParams.rating || '');
  const [sort, setSort] = useState(searchParams.sort || 'newest');
  const [featured, setFeatured] = useState(searchParams.featured === 'true');

  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const params = new URLSearchParams();

      if (query) params.set('query', query);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      // if (rating) params.set('rating', rating);
      if (sort) params.set('sort', sort);
      if (featured) params.set('featured', 'true');

      router.push(`/products?${params.toString()}`);
    }, 500); // Debounce to avoid too many updates

    return () => clearTimeout(debounceTimer);
  }, [query, minPrice, maxPrice, sort, featured,router]);

  return (
    <div className="flex items-center justify-between mb-4">
    <h2 className="block sm:hidden text-lg font-semibold">
      {
        ShowFIlter? <button onClick={handleCloseFilter}>Close</button> : <button onClick={handleFilter}>Filter</button>
      }
    </h2>
 

    {
      ShowFIlter && (

        <div className="block sm:hidden space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
  
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
  
        {/* <select
          className="w-full border px-3 py-2 rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Rating</option>
          <option value="1">1★ & up</option>
          <option value="2">2★ & up</option>
          <option value="3">3★ & up</option>
          <option value="4">4★ & up</option>
        </select>
   */}
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
      )
    }


<div className="hidden sm:block space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
  
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
  
        {/* <select
          className="w-full border px-3 py-2 rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Rating</option>
          <option value="1">1★ & up</option>
          <option value="2">2★ & up</option>
          <option value="3">3★ & up</option>
          <option value="4">4★ & up</option>
        </select>
   */}
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
