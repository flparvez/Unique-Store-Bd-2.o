"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { IOrder } from "@/models/Order";

type OrderFormData = {
  name: string;
  email?: string;
  mobile: string;
  address: string;
  city: string;
  status?: string;
  bkashTransactionId: string;
  ordertrack?: string;
};

const OrderInfoPage = ({ order }: { order: IOrder }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<OrderFormData>();

  // Set default form values only once
  useEffect(() => {
    if (order) {
      setValue("name", order.name);
      setValue("email", order.email || "");
      setValue("mobile", order.mobile);
      setValue("address", order.address);
      setValue("city", order.city);
      setValue("status", order.status || "");
      setValue("bkashTransactionId", order.bkashTransactionId);
      setValue("ordertrack", order?.ordertrack || "");
    }
  }, [order, setValue]);

  // Handle Submit
  const onSubmit = async (formData: OrderFormData) => {
    try {
      const response = await fetch(`https://landig-store.vercel.app/api/order/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });

      const resultText = await response.text();

      // Try parsing JSON manually
      const result = resultText ? JSON.parse(resultText) : null;

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update order");
      }

      toast.success("✅ Order updated successfully!");
      console.log("Updated order:", result);
    } catch (error) {
      console.error("❌ Update failed:", error);
      toast.error("❌ Failed to update order.");
    }
  };

  if (!order) return <h1>Loading...</h1>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order ID: {order._id}</h2>
        <div className="mb-2"><strong>Customer Name:</strong> {order.name}</div>
        <div className="mb-2"><strong>Email:</strong> {order.email}</div>
        <div className="mb-2"><strong>Phone:</strong> {order.mobile}</div>
        <div className="mb-2"><strong>Address:</strong> {order.address}, {order.city}</div>
        <div className="mb-2"><strong>Total:</strong> ৳{order.totalAmount}</div>
        <div className="mb-2"><strong>Transaction ID:</strong> {order.bkashTransactionId}</div>
        <div className="mb-2"><strong>Payment Type:</strong> {order.paymentType}</div>
        <div className="mb-4"><strong>Status:</strong> {order.status}</div>

        <div className="mb-4">
          <span className="font-bold text-xl">Products:</span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.cartItems?.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>৳{product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h2 className="text-center text-xl my-4">Order Details Edit</h2>

        <div className="max-w-md sm:max-w-[90%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="name">Customer Name</Label>
              <Input {...register("name", { required: true })} id="name" placeholder="Customer Name" />
            </div>

            <div className="mb-4">
              <Label htmlFor="email">Customer Email</Label>
              <Input {...register("email")} id="email" placeholder="Email" type="email" />
            </div>

            <div className="mb-4">
              <Label htmlFor="mobile">Customer Phone</Label>
              <Input {...register("mobile", { required: true })} id="mobile" placeholder="Mobile No" type="tel" />
            </div>

            <div className="mb-4">
              <Label htmlFor="ordertrack">Order Tracking Link</Label>
              <Input {...register("ordertrack")} id="ordertrack" placeholder="Order Tracking Link" />
            </div>

            <div className="mb-4">
              <Label htmlFor="address">Customer Address</Label>
              <Input {...register("address", { required: true })} id="address" placeholder="Address" />
            </div>

            <div className="mb-4">
              <Label htmlFor="city">Customer City</Label>
              <Input {...register("city", { required: true })} id="city" placeholder="City" />
            </div>

            <div className="mb-4">
              <Label htmlFor="status">Order Status</Label>
              <Input {...register("status")} id="status" placeholder="Status" />
            </div>

            <div className="mb-4">
              <Label htmlFor="bkashTransactionId">Transaction ID</Label>
              <Input {...register("bkashTransactionId", { required: true })} id="bkashTransactionId" placeholder="Transaction ID" />
            </div>

            <button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={isSubmitting}
            >
              Update Order &rarr;
              <BottomGradient />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoPage;

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);
