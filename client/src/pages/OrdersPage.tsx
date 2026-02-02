import { useState } from 'react';
import { Filter, X, RefreshCw, ShoppingBag, LayoutList, Calendar, CheckCircle2, Clock, ChefHat, Truck, AlertOctagon } from 'lucide-react';
import { Button } from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { OrderCard } from '../components/orders/OrderCard';
import { useOrders, useUpdateOrderStatus } from '../hooks/useOrders';
import { useToast } from '../context/ToastContext';
import type { OrderStatus } from '../types';
import clsx from 'clsx';

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

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                     <ShoppingBag className="w-64 h-64 -rotate-12" />
                 </div>
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                            <ShoppingBag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                            Live Orders
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium ml-14">
                        Real-time kitchen monitor & delivery tracking
                    </p>
                </div>
                <Button
                    variant="secondary"
                    leftIcon={<RefreshCw className={clsx("w-5 h-5", isFetching && "animate-spin")} />}
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="w-full md:w-auto px-8 py-4 rounded-2xl font-black border-gray-200 dark:border-gray-700 shadow-lg relative z-10"
                >
                    REFRESH BOARD
                </Button>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Clock className="w-16 h-16 text-blue-600" />
                    </div>
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Pending</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{orders.filter(o => o.status === 'Pending').length}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800 rounded-[2rem] border border-orange-100 dark:border-orange-800/30 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <ChefHat className="w-16 h-16 text-orange-600" />
                    </div>
                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] mb-2">Cooking</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{orders.filter(o => o.status === 'Preparing').length}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-[2rem] border border-purple-100 dark:border-purple-800/30 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-16 h-16 text-purple-600" />
                    </div>
                    <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em] mb-2">Ready</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{orders.filter(o => o.status === 'Ready').length}</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-[2rem] border border-green-100 dark:border-green-800/30 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Truck className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em] mb-2">Completed</p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{orders.filter(o => o.status === 'Delivered').length}</p>
                </div>
            </div>

            {/* Filter Navigation */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700/50 p-2 overflow-hidden sticky top-4 z-20">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-2">
                    <div className="hidden md:flex items-center gap-3 px-4 text-gray-400 border-r-2 border-gray-100 dark:border-gray-700 mr-2 shrink-0">
                        <Filter className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filter Stream</span>
                    </div>
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setStatusFilter(option.value);
                                setPage(1);
                            }}
                            className={clsx(
                                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border",
                                statusFilter === option.value
                                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105"
                                    : "bg-transparent border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3 text-gray-400">
                    <LayoutList className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {statusFilter || 'Global'} Queue • {orders.length} ACTIVE
                    </span>
                </div>
                <div className="flex items-center gap-2">
                     <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                        Live Feed
                    </p>
                </div>
            </div>

            {/* Content States */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center gap-6">
                    <Spinner size="lg" />
                    <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Syncing Orders...</p>
                </div>
            ) : !!error ? (
                <div className="text-center py-24 bg-red-50/50 dark:bg-red-900/10 rounded-[3rem] border border-red-100 dark:border-red-900/20 px-10">
                    <AlertOctagon className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h4 className="text-2xl font-black text-red-900 dark:text-red-100 mb-2">System Interruption</h4>
                    <p className="text-red-600/70 font-medium mb-8">Unable to fetch live order data.</p>
                    <Button onClick={() => refetch()} variant="secondary" className="rounded-2xl font-black px-8">RECONNECT</Button>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-[3.5rem] border border-dashed border-gray-200 dark:border-gray-700 px-10">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h4 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                        {statusFilter ? 'No items in this queue' : 'All caught up!'}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium leading-relaxed">
                        {statusFilter 
                            ? `There are currently no orders marked as "${statusFilter}".` 
                            : 'The kitchen is clear. Waiting for new culinary missions.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
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

            {/* Premium Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-100 dark:border-gray-800">
                     <Button
                        variant="ghost"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-2xl font-black px-8 text-xs uppercase tracking-widest"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page</span>
                        <span className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 flex items-center justify-center text-sm font-black text-primary-600 dark:text-primary-400 shadow-sm">
                            {page}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">of {pagination.totalPages}</span>
                    </div>
                    <Button
                        variant="ghost"
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-2xl font-black px-8 text-xs uppercase tracking-widest"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
