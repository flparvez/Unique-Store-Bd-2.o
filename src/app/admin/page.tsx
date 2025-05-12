"use client"

import { ProductTable } from "@/components/admin/product-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategory, useGetUsers, useOrders, useProducts } from "@/hooks/UseOrders";
import { Badge } from "lucide-react";

import Link from "next/link";

// Mock data - replace with your actual data fetching



export default  function AdminDashboard() {

const {products} = useProducts()
const {category} = useCategory()
const {orders} = useOrders()
const {users} = useGetUsers()


  const stats = [
    { name: "Total Products", value: products?.products?.length, change: "+12%", changeType: "positive" },
    { name: "Total Categories", value: category?.length, change: "+3%", changeType: "positive" },
    { name: "Total Orders", value: orders?.orders?.length, change: "-2%", changeType: "negative" },
    { name: "Total Users", value: users?.user?.length, change: "+8%", changeType: "positive" },
  ]
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats?.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="mt-2">
              <Badge
                fontVariant={stat.changeType}
              >
                {stat.change}
              </Badge>
              <span className="ml-1 text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
      </div>

      {/* Recent Products */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
          <Link href='/admin/products' className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <ProductTable products={products?.products || []} />
      </div>
    </>
  );
}