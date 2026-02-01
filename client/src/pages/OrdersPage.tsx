import { useState } from 'react';
import { Filter, X, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import Spinner from '../components/common/Spinner';
import { OrderCard } from '../components/orders/OrderCard';
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import { useToast } from '../context/ToastContext';
import type { OrderStatus } from '../types';

const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Preparing', label: 'Preparing' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
    const { showToast } = useToast();

    // State
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);

    // Query
    const {
        data: ordersData,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useOrders({
        status: statusFilter as OrderStatus | undefined,
        page,
        limit: 10,
    });

    // Mutation
    const updateStatusMutation = useUpdateOrderStatus();

    const orders = ordersData?.data || [];
    const pagination = ordersData?.pagination;

    // Handlers
    const handleUpdateStatus = async (id: string, status: OrderStatus) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
            showToast('Order status updated', 'success');
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const clearFilters = () => {
        setStatusFilter('');
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Orders Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track and manage customer orders
                    </p>
                </div>
                <Button
                    variant="secondary"
                    leftIcon={<RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />}
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Filter className="w-5 h-5" />
                        <span className="font-medium">Filter by status:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setStatusFilter(option.value);
                                    setPage(1);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {orders.length} of {pagination?.total || 0} orders
                </p>
            </div>

            {/* Loading State */}
            {isLoading && <Spinner />}

            {/* Error State */}
            {!!error && (
                <div className="text-center py-12">
                    <p className="text-red-500">Failed to load orders. Please try again.</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && orders.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                        No orders found{statusFilter ? ` with status "${statusFilter}"` : ''}.
                    </p>
                </div>
            )}

            {/* Orders List */}
            {!isLoading && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            onUpdateStatus={handleUpdateStatus}
                            isUpdating={updateStatusMutation.isPending}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Page {page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
