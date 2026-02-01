import { Schema, model, Document } from 'mongoose';

export type Category = 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';

export interface IMenuItem extends Document {
    name: string;
    description?: string;
    category: Category;
    price: number;
    ingredients: string[];
    isAvailable: boolean;
    preparationTime?: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
    {
        name: { type: String, required: true, index: true },
        description: { type: String },
        category: {
            type: String,
            enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],
            required: true,
            index: true,
        },
        price: { type: Number, required: true },
        ingredients: { type: [String], default: [] },
        isAvailable: { type: Boolean, default: true, index: true },
        preparationTime: { type: Number },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

// Create compound text index for search
menuItemSchema.index({ name: 'text', ingredients: 'text' });

export const MenuItem = model<IMenuItem>('MenuItem', menuItemSchema);
