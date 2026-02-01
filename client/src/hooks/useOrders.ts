import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, OrderQueryParams } from '../services/order.service';
import type { CreateOrderDTO, OrderStatus } from '../types';

export const ORDERS_QUERY_KEY = 'orders';
export const ORDER_STATS_KEY = 'order-stats';

// Hook to fetch all orders with filters
export function useOrders(params?: OrderQueryParams) {
    return useQuery({
        queryKey: [ORDERS_QUERY_KEY, params],
        queryFn: () => orderService.getAll(params),
        staleTime: 1000 * 30, // 30 seconds
    });
}

// Hook to get order statistics
export function useOrderStats() {
    return useQuery({
        queryKey: [ORDER_STATS_KEY],
        queryFn: () => orderService.getStats(),
        staleTime: 1000 * 60, // 1 minute
    });
}

// Hook to get single order
export function useOrder(id: string) {
    return useQuery({
        queryKey: [ORDERS_QUERY_KEY, id],
        queryFn: () => orderService.getById(id),
        enabled: !!id,
    });
}

// Hook to create an order
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (order: CreateOrderDTO) => orderService.create(order),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [ORDER_STATS_KEY] });
        },
    });
}

// Hook to update order status
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            orderService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [ORDER_STATS_KEY] });
        },
    });
}
