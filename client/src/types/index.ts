export type Category = 'Appetizer' | 'Main Course' | 'Dessert' | 'Beverage';

export interface MenuItem {
    _id: string;
    name: string;
    description?: string;
    category: Category;
    price: number;
    ingredients: string[];
    isAvailable: boolean;
    preparationTime?: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateMenuItemDTO = Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateMenuItemDTO = Partial<CreateMenuItemDTO>;

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface OrderItem {
    menuItem: MenuItem;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    customerName: string;
    tableNumber: number;
    createdAt: string;
    updatedAt: string;
}

export type CreateOrderDTO = {
    items: { menuItemId: string; quantity: number }[];
    customerName: string;
    tableNumber: number;
};
