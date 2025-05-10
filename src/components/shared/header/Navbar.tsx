"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User } from "lucide-react";

import Link from "next/link";

import { useSession } from "next-auth/react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";


export function Navbar() {

  const session = useSession();
const admin = session.data?.user?.role==="admin"
const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sm:sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-gray-700 focus:outline-none"
        >
          <Search className="h-6 w-6" />
        </button>
        <Link href="/" className="text-lg font-bold text-gray-900">
          Unique Store BD
        </Link>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
        <SearchBar />
      </div>

      {/* Right: Cart + User */}
      <div className="flex items-center gap-4">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>
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
    </div>
    {admin && (
            <Link href="/admin" className="text-gray-700 font-medium">
              Admin
            </Link>
          )}
    {/* Mobile Menu */}
    {menuOpen && (
      <div className="lg:hidden px-4 pb-4">
        <div className="flex flex-col gap-2">
          <SearchBar />
       
   
        </div>
      </div>
    )}
  </header>

  );
}