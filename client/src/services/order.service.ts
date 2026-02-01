import { api } from './api';
import type { Order, CreateOrderDTO, OrderStatus } from '../types';

export interface OrderQueryParams {
    status?: OrderStatus;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface OrderStats {
    ordersByStatus: { _id: OrderStatus; count: number; totalRevenue: number }[];
    totalOrders: number;
    totalRevenue: number;
}

export const orderService = {
    /**
     * Get all orders with optional filters and pagination
     */
    getAll: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
        const { data } = await api.get('/orders', { params });
        return data;
    },

    /**
     * Get order statistics
     */
    getStats: async (): Promise<{ success: boolean; data: OrderStats }> => {
        const { data } = await api.get('/orders/stats');
        return data;
    },

    /**
     * Get single order with details
     */
    getById: async (id: string): Promise<{ success: boolean; data: Order }> => {
        const { data } = await api.get(`/orders/${id}`);
        return data;
    },

    /**
     * Create new order
     */
    create: async (order: CreateOrderDTO): Promise<{ success: boolean; data: Order }> => {
        const { data } = await api.post('/orders', order);
        return data;
    },

    /**
     * Update order status
     */
    updateStatus: async (
        id: string,
        status: OrderStatus
    ): Promise<{ success: boolean; data: Order }> => {
        const { data } = await api.patch(`/orders/${id}/status`, { status });
        return data;
    },
};
