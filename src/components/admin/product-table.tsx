"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IProduct } from "@/types/product";
import { handleDelete } from "./DeleteProduct";
import Link from "next/link";



export function ProductTable({ products }: { products: IProduct[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
         
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.slice(0, 13).map((product) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium"><Link href={`/admin/products/edit-product/${product._id}`}> {product.name}  </Link> </TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
       
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                    <Link href={`/admin/products/edit-product/${product._id}`}> Edit  </Link> 
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                     
                      <button onClick={() => handleDelete(product._id)} >
                      <Trash2 className="mr-2 h-4 w-4" />
                        Delete</button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}