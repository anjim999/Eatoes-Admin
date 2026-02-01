import { MenuItem, IMenuItem } from '../models/MenuItem';

export interface MenuQueryParams {
    category?: string;
    isAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
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

class MenuService {
    // Get all menu items with optional filters and pagination
    async getAll(params: MenuQueryParams): Promise<PaginatedResponse<IMenuItem>> {
        const { category, isAvailable, minPrice, maxPrice, page = 1, limit = 10 } = params;

        // Build filter query
        const filter: Record<string, any> = {};

        if (category) {
            filter.category = category;
        }

        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = minPrice;
            if (maxPrice !== undefined) filter.price.$lte = maxPrice;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            MenuItem.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            MenuItem.countDocuments(filter),
        ]);

        return {
            data: data as IMenuItem[],
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Search menu items by name or ingredients
    async search(query: string): Promise<IMenuItem[]> {
        // Use text index for search
        const results = await MenuItem.find(
            { $text: { $search: query } },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(20)
            .lean();

        // Fallback to regex search if text search returns nothing
        if (results.length === 0) {
            const regexResults = await MenuItem.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { ingredients: { $elemMatch: { $regex: query, $options: 'i' } } },
                ],
            })
                .limit(20)
                .lean();
            return regexResults as IMenuItem[];
        }

        return results as IMenuItem[];
    }

    // Get single menu item by ID
    async getById(id: string): Promise<IMenuItem | null> {
        return MenuItem.findById(id).lean();
    }

    // Create a new menu item
    async create(data: Partial<IMenuItem>): Promise<IMenuItem> {
        const menuItem = new MenuItem(data);
        await menuItem.save();
        return menuItem.toObject();
    }

    // Update a menu item
    async update(id: string, data: Partial<IMenuItem>): Promise<IMenuItem | null> {
        return MenuItem.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    // Delete a menu item
    async delete(id: string): Promise<IMenuItem | null> {
        return MenuItem.findByIdAndDelete(id).lean();
    }

    // Toggle availability status
    async toggleAvailability(id: string): Promise<IMenuItem | null> {
        const item = await MenuItem.findById(id);
        if (!item) return null;

        item.isAvailable = !item.isAvailable;
        await item.save();
        return item.toObject();
    }

    // Get top selling menu items (Aggregation Challenge)
    async getTopSellers(limit: number = 5): Promise<any[]> {
        const Order = (await import('../models/Order')).Order;

        return Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItem',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                },
            },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'menuItem',
                },
            },
            { $unwind: '$menuItem' },
            {
                $project: {
                    _id: 1,
                    name: '$menuItem.name',
                    category: '$menuItem.category',
                    price: '$menuItem.price',
                    imageUrl: '$menuItem.imageUrl',
                    totalQuantity: 1,
                    totalRevenue: { $round: ['$totalRevenue', 2] },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit },
        ]);
    }
}

export const menuService = new MenuService();
