import { Schema, model, Document } from 'mongoose';
import { IMenuItem } from './MenuItem';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface IOrderItem {
    menuItem: IMenuItem['_id'];
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    orderNumber: string;
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    customerName: string;
    tableNumber: number;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, unique: true, required: true },
        items: [
            {
                menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
            default: 'Pending',
            index: true,
        },
        customerName: { type: String, required: true },
        tableNumber: { type: Number, required: true },
    },
    { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
