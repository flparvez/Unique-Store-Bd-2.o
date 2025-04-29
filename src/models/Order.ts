import  { Schema, models, model } from 'mongoose';

const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    userid: { type: String },
    mobile: { type: String, required: true },
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
  },
  { timestamps: true }
);

export const Order = models.Order || model('Order', orderSchema);
