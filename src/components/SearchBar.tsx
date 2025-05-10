
'use client';
import { useState, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useSearchProducts } from '@/hooks/UseOrders';
import Image from 'next/image';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { products, isLoading } = useSearchProducts(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleProductClick = () => {
    setQuery('');
    setShowResults(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (


<div className="relative flex-1 mx-4" ref={searchRef}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for products..."
            className="border p-2 w-full rounded-lg text-gray-800"
          />
          {showResults && query && (
            <div className="absolute left-0 right-0 bg-white shadow-md  rounded-lg z-10">
              {isLoading && <p className="p-2">Loading...</p>}
           
              <ul className="max-h-72 overflow-y-auto">
                {
                
                products?.products?.length ? (
                  products?.products?.slice(0, 8).map((product) => (
                    <li key={product._id} className="border-b last:border-0">
                      <Link href={`/product/${product.slug}`} onClick={handleProductClick}>
                        <div className="flex items-center p-2">
                          <Image width={80} height={80} src={product.images[0].url} alt={product.name} className="sm:w-14 w-12 h-12 object-cover rounded-lg mr-4" />
                          <div>
                            <p className="text-gray-800 font-bold">৳{product.price}</p>
                            <h3 className="text-gray-700 text-sm font-bold">{product.name}</h3>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="p-2">No Product Found</p>
                )}
              </ul>
            </div>
          )}
        </div>

  );
}
