"use server"
import { Product } from '@/models/Product';
import { connectToDb } from '@/lib/db';
import mongoose from 'mongoose';
import {  IProduct } from '@/types/product';
import Category, { ICategory } from '@/models/Category';
import { Order } from '@/models/Order';






export async function fetchProductById(id: string): Promise<IProduct> {
  await connectToDb();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    const product = await Product.findById(id)
      .populate('category')
      .lean();

    if (!product) {
      throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  await connectToDb();

  try {
 

    const product = await Product.findOne({ slug })
      .populate('category')
      .lean();

    if (!product) {
      throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    throw new Error('Failed to fetch product');
  }
}





export async function getAllCategory():Promise<ICategory[]> {
  await connectToDb()

  try {
    const category = await Category.find()
    
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error('Failed to fetch all Category:', error);
    throw new Error('Failed to fetch all category');
  }
 
}





// delete product
export async function deleteProduct(id: string) {
  await connectToDb();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    } 
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      throw new Error('Product not found');
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product');
  }
}
// delete order
export async function deleteOrder(id: string) {
  await connectToDb();

  try {

    const order = await Order.findByIdAndDelete(id)
    if (!order) {
      throw new Error('Product not found');
    }
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product');
  }
}


// delete category
export async function deleteCategory(slug: string) {
  await connectToDb();

  try {
    
    const category = await Category.findOneAndDelete({slug})
    if (!category) {
      throw new Error('Product not found');
    }
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product');
  }
}
