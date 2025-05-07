import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { Order } from '@/models/Order';

import { connectToDb } from '@/lib/db';
import { authOptions } from '@/lib/auth';
interface itemP {
    quantity?: number;
    selectedVariant?: string;
        product: {
            _id: string;
            name: string;
            price: number;
            originalPrice?: number;
            discount?: number;
            
            stock?: number;
            images?: { url: string; altText?: string }[];
        }

}
export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    await connectToDb();
    const data = await req.json();
const id = session?.user.id
    const isInsideDhaka = data.city.trim().toLowerCase() === 'dhaka';

    const order = await Order.create({
      name: data.name,
      userid: id,
      orderId: data?.mobile.slice(7, 10),
      mobile: data.mobile,
      address: data.address,
      city: data.city,
      paymentType: data.paymentType,
      bkashTransactionId: data.bkashTransactionId,
      deliveryCharge: data.deliveryCharge,
      payNowAmount: data.payNowAmount,
      payToRiderAmount: data.payToRiderAmount,
      cartItems: data.cart.items.map((item: itemP) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        images: item.product.images,
        selectedVariant: item.selectedVariant || '',
      })),
      subtotal: data.cart.totalPrice,
      totalAmount: data.cart.totalPrice + data.deliveryCharge,
      isInsideDhaka,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json({ success: false, message: 'Order failed' }, { status: 500 });
  }
};


export const GET = async () => {  
  try {
    await connectToDb();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}