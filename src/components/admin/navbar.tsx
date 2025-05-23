"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { IProduct } from "@/types/product";

import Image from "next/image";
import Link from "next/link";
import ProductLoadingSkeleton from "../ProductLoadingSkeleton";


export function AdminNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search functionality

  useEffect(() => {
    const controller = new AbortController();
  
    const searchProducts = async () => {
      const trimmedQuery = searchQuery.trim();
  
      if (trimmedQuery.length < 2) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }
  
      setIsSearching(true);
  
      try {
        const endpoint = `/api/products/filter?query=${encodeURIComponent(trimmedQuery)}`;
        const res = await fetch(endpoint, { signal: controller.signal });
        const data = await res.json();
  
        if (data.success && Array.isArray(data.products)) {
          setSearchResults(data.products);
          setIsSearchOpen(true);
        } else {
          setSearchResults([]);
          setIsSearchOpen(false);
        }
      } catch (error) {
        if (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
          setIsSearchOpen(false);
        }
      } finally {
        setIsSearching(false);
      }
    };
  
    const debounceTimer = setTimeout(searchProducts, 300);
  
    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery]);
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-96 overflow-y-auto">
            <div className="py-1">
              {isSearching ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center px-4 py-2">
                    <ProductLoadingSkeleton />
                    <div className="ml-3 space-y-2">
                      <ProductLoadingSkeleton  />
                      <ProductLoadingSkeleton />
                    </div>
                  </div>
                ))
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/admin/products/edit-product/${product._id}`}
                    className="flex items-center px-4 py-2 hover:bg-gray-50"
                    onClick={clearSearch}
                  >
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                        {product.originalPrice && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </Link>
                ))
              ) : searchQuery.length > 1 ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No products found
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-x-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}