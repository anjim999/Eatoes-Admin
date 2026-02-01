import { Order, IOrder, OrderStatus } from '../models/Order';
import { MenuItem } from '../models/MenuItem';

export interface OrderQueryParams {
    status?: OrderStatus;
    page?: number;
    limit?: number;
}

export interface CreateOrderInput {
    items: { menuItemId: string; quantity: number }[];
    customerName: string;
    tableNumber: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class OrderService {
    // Generate unique order number
    private generateOrderNumber(): string {
        const prefix = 'ORD';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }

    // Get all orders with optional status filter and pagination
    async getAll(params: OrderQueryParams): Promise<PaginatedResponse<IOrder>> {
        const { status, page = 1, limit = 10 } = params;

        const filter: Record<string, any> = {};

        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Order.find(filter)
                .populate('items.menuItem', 'name price category imageUrl')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        return {
            data: data as IOrder[],
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Get single order by ID with populated menu items
    async getById(id: string): Promise<IOrder | null> {
        return Order.findById(id)
            .populate('items.menuItem', 'name price category imageUrl preparationTime')
            .lean();
    }

    // Create a new order
    async create(input: CreateOrderInput): Promise<IOrder> {
        const { items, customerName, tableNumber } = input;

        // Fetch menu items to get prices
        const menuItemIds = items.map((item) => item.menuItemId);
        const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

        if (menuItems.length !== items.length) {
            throw new Error('One or more menu items not found');
        }

        // Build order items with prices
        const orderItems = items.map((item) => {
            const menuItem = menuItems.find((mi) => mi._id.toString() === item.menuItemId);
            if (!menuItem) {
                throw new Error(`Menu item ${item.menuItemId} not found`);
            }
            return {
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price,
            };
        });

        // Calculate total
        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = new Order({
            orderNumber: this.generateOrderNumber(),
            items: orderItems,
            totalAmount: Math.round(totalAmount * 100) / 100,
            status: 'Pending',
            customerName,
            tableNumber,
        });

        await order.save();

        // Return populated order
        return Order.findById(order._id)
            .populate('items.menuItem', 'name price category imageUrl')
            .lean() as Promise<IOrder>;
    }

    // Update order status
    async updateStatus(id: string, status: OrderStatus): Promise<IOrder | null> {
        return Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
            .populate('items.menuItem', 'name price category imageUrl')
            .lean();
    }

    // Get order statistics
    async getStats(): Promise<any> {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                },
            },
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        return {
            ordersByStatus: stats,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
        };
    }
}

export const orderService = new OrderService();
