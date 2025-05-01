import { CardStats } from "@/components/admin/card-stats";
import { ProductTable } from "@/components/admin/product-table";
import { getAllCategory, getAllOrders, getAllProducts, getAllUsers } from "@/lib/action/product-action";
import Link from "next/link";

// Mock data - replace with your actual data fetching



export default async function AdminDashboard() {

  const products = ((await getAllProducts()))
  const category = ((await getAllCategory()))
  const orders = ((await getAllOrders()))
  const users = ((await getAllUsers()))


  const stats = [
    { name: "Total Products", value: products?.length, change: "+12%", changeType: "positive" },
    { name: "Total Categories", value: category?.length, change: "+3%", changeType: "positive" },
    { name: "Total Orders", value: orders.length, change: "-2%", changeType: "negative" },
    { name: "Total Users", value: users.length, change: "+8%", changeType: "positive" },
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
        <CardStats stats={stats} />
      </div>

      {/* Recent Products */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
          <Link href='/admin/products' className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <ProductTable products={products} />
      </div>
    </>
  );
}