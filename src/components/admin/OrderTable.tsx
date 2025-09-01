"use client"



import React from 'react';

import Link from 'next/link';
import {
  Table,
  TableBody,

  TableCell,

  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useOrders } from '@/hooks/UseOrders';
import ProductLoadingSkeleton from '../ProductLoadingSkeleton';
import { Button } from '../ui/button';
import { handleDeleteOrder } from './DeleteProduct';





const OrderTable = () => {


  const { orders, isLoading } = useOrders();
if (isLoading) {
  return <ProductLoadingSkeleton />
}
  return (
    <div >
    
    <h1 className="sm:text-3xl text-xl font-bold text-center mb-8">My Orders</h1>
    <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order Id</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Delete</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.orders?.map((invoice) => (
          <TableRow key={invoice._id}>
            <TableCell className="font-medium"><Link href={`/admin/orders/${invoice._id}`}>{invoice.orderId}</Link></TableCell>
            <TableCell><span className="font-semibold">Placed on:</span>{" "}
            {new Date(invoice.createdAt).toLocaleDateString()}{" "}
            {new Date(invoice.createdAt).toLocaleTimeString()} </TableCell>
            <TableCell>{invoice.name}</TableCell>
            <TableCell>{invoice?.status}</TableCell>
            <TableCell>         <Button onClick={() => handleDeleteOrder(invoice._id!)}  variant="destructive">Delete</Button></TableCell>
  
          </TableRow>
        ))}
      </TableBody>
      
    </Table>
    
    </div>
 
  );
};

export default OrderTable;