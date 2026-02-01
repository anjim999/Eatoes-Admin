import { api } from './api';
import type { MenuItem, CreateMenuItemDTO, UpdateMenuItemDTO } from '../types';

export interface MenuQueryParams {
    category?: string;
    isAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
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

export interface TopSeller {
    _id: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string;
    totalQuantity: number;
    totalRevenue: number;
}

export const menuService = {
    // Get all menu items with optional filters
    getAll: async (params?: MenuQueryParams): Promise<PaginatedResponse<MenuItem>> => {
        const { data } = await api.get('/menu', { params });
        return data;
    },

    // Search menu items
    search: async (query: string): Promise<{ success: boolean; data: MenuItem[] }> => {
        const { data } = await api.get('/menu/search', { params: { q: query } });
        return data;
    },

    // Get top selling items
    getTopSellers: async (limit = 5): Promise<{ success: boolean; data: TopSeller[] }> => {
        const { data } = await api.get('/menu/top-sellers', { params: { limit } });
        return data;
    },

    // Get single menu item
    getById: async (id: string): Promise<{ success: boolean; data: MenuItem }> => {
        const { data } = await api.get(`/menu/${id}`);
        return data;
    },

    // Create new menu item
    create: async (item: CreateMenuItemDTO): Promise<{ success: boolean; data: MenuItem }> => {
        const { data } = await api.post('/menu', item);
        return data;
    },

    // Update menu item
    update: async (
        id: string,
        item: UpdateMenuItemDTO
    ): Promise<{ success: boolean; data: MenuItem }> => {
        const { data } = await api.put(`/menu/${id}`, item);
        return data;
    },

    // Delete menu item
    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        const { data } = await api.delete(`/menu/${id}`);
        return data;
    },

    // Toggle availability
    toggleAvailability: async (id: string): Promise<{ success: boolean; data: MenuItem }> => {
        const { data } = await api.patch(`/menu/${id}/availability`);
        return data;
    },
};
