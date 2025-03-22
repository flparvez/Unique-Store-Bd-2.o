
import { connectToDb } from "@/lib/db";
import Category, { ICategory } from "@/models/Category";

import { NextRequest, NextResponse } from "next/server";



// ✅ Initialize ImageKit
// const imagekit = new ImageKit({
//     publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
//     urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
// });



// get categories
export async function GET(){

    try {
        await connectToDb();
        const categories = await Category.find({}).sort({createdAt: -1}).lean();

        return NextResponse.json(categories)
    } catch (error) {
         return NextResponse.json(
                    {error : "Failed to fetch videos"+ error}, {status: 500}
                )
    }
}

// create category

export async function POST(request: NextRequest){
try {
    
// const session = await getServerSession(authOptions);

// if (!session) {
//     NextResponse.json(
//         {error : "Unauthorized"}, {status: 401}
//     )
// }

await connectToDb();

const body:ICategory = await request.json();

if (
    !body.name ||
    !body.description ||
    !body.image
) {
    return NextResponse.json(
        {error : "All fields are required"}, {status: 400}
    )
}


const categoryData = {
    ...body
}
const newCategory = await Category.create(categoryData);
return NextResponse.json(newCategory)
} catch (error) {
    return NextResponse.json(
        {error : "Failed to create categor"+ error}, {status: 500}
    )
}

}