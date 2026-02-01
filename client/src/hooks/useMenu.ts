import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService, MenuQueryParams } from '../services/menu.service';
import type { CreateMenuItemDTO, UpdateMenuItemDTO } from '../types';

export const MENU_QUERY_KEY = 'menu';
export const MENU_SEARCH_KEY = 'menu-search';
export const TOP_SELLERS_KEY = 'top-sellers';

// Hook to fetch all menu items with filters
export function useMenuItems(params?: MenuQueryParams) {
    return useQuery({
        queryKey: [MENU_QUERY_KEY, params],
        queryFn: () => menuService.getAll(params),
        staleTime: 1000 * 60, // 1 minute
    });
}

// Hook to search menu items
export function useMenuSearch(query: string) {
    return useQuery({
        queryKey: [MENU_SEARCH_KEY, query],
        queryFn: () => menuService.search(query),
        enabled: query.length > 0,
        staleTime: 1000 * 30, // 30 seconds
    });
}

// Hook to get top selling items
export function useTopSellers(limit = 5) {
    return useQuery({
        queryKey: [TOP_SELLERS_KEY, limit],
        queryFn: () => menuService.getTopSellers(limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook to create a menu item
export function useCreateMenuItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item: CreateMenuItemDTO) => menuService.create(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
        },
    });
}

// Hook to update a menu item
export function useUpdateMenuItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemDTO }) =>
            menuService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
        },
    });
}

// Hook to delete a menu item
export function useDeleteMenuItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => menuService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
        },
    });
}

// Hook to toggle menu item availability (Challenge 3 - Optimistic UI)
export function useToggleAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => menuService.toggleAvailability(id),
        // Optimistic update
        onMutate: async (id) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [MENU_QUERY_KEY] });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData([MENU_QUERY_KEY]);

            // Optimistically update the cache
            queryClient.setQueriesData({ queryKey: [MENU_QUERY_KEY] }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((item: any) =>
                        item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
                    ),
                };
            });

            return { previousData };
        },
        // If mutation fails, use the context to roll back
        onError: (err, id, context) => {
            queryClient.setQueryData([MENU_QUERY_KEY], context?.previousData);
        },
        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
        },
    });
}
