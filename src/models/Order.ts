import  { Schema, models, model } from 'mongoose';

export interface IOrder {
  _id?: string;
  name: string;
  orderId?: number;
  userid: string;
  mobile: string;
  address: string;
  city: string;
  paymentType: string;
  bkashTransactionId: string;
  deliveryCharge: number;
  payNowAmount: number;
  payToRiderAmount: number;
  cartItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedVariant: string;
  }[];
  subtotal: number;
  totalAmount: number;
  isInsideDhaka: boolean;
  createdAt : Date
  updatedAt?: Date;
  email?: string; 
  status?: string;
  ordertrack?: string;
}


const orderSchema = new Schema(
  {
    orderId: {
      type: Number,
      required: true,
      unique: true,
     
    },
    name: { type: String, required: true },
    userid: { type: String },
    mobile: { type: String, required: true },
    email: { type: String, default: "uniquestorebd23@gmail.com" },
    status: { type: String, default: 'pending' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    paymentType: { type: String, enum: ['full', 'partial'], required: true },
    bkashTransactionId: { type: String, required: true },
    deliveryCharge: { type: Number, required: true },
    payNowAmount: { type: Number, required: true },
    payToRiderAmount: { type: Number, required: true },
    cartItems: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        selectedVariant: String,
      },
    ],
    subtotal: Number,
    totalAmount: Number,
    isInsideDhaka: Boolean,
    ordertrack : { type: String , default:"/profile" },
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', orderSchema);
