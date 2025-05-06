import { connectToDb } from "@/lib/db";
import { Order } from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";


export async function GET (
    request: NextRequest,
    {params}: {params : Promise<{id: string}>} 
) {
    const {id} = (await params)
    await connectToDb();
    try {
        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

//  PATCH request for edit order

export async function PATCH (
    request: NextRequest,
    {params}: {params : Promise<{id: string}>} 
) {
    const {id} = (await params)
    await connectToDb();
    try {
        const body = await request.json();
        const order = await Order.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

//  delete request by id
export async function DELETE (
    request: NextRequest,
    {params}: {params : Promise<{id: string}>}
)   {
    const {id} = (await params)
    await connectToDb();
    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(
            { message: 'Order deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: 'Failed to delete order' },
            { status: 500 }
        );
    }
}