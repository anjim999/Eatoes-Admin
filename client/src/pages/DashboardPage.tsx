import { TrendingUp, ShoppingBag, DollarSign, Clock, ChefHat } from 'lucide-react';
import { useTopSellers } from '../hooks/useMenu';
import { useOrderStats } from '../hooks/useOrders';
import Spinner from '../components/common/Spinner';
import { StatusBadge } from '../components/common/StatusBadge';
import type { OrderStatus } from '../types';

export default function DashboardPage() {
    const { data: topSellersData, isLoading: isLoadingTopSellers } = useTopSellers(5);
    const { data: statsData, isLoading: isLoadingStats } = useOrderStats();

    const topSellers = topSellersData?.data || [];
    const stats = statsData?.data;

    const statCards = [
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Revenue',
            value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            title: 'Pending Orders',
            value: stats?.ordersByStatus?.find((s) => s._id === 'Pending')?.count || 0,
            icon: Clock,
            color: 'bg-yellow-500',
        },
        {
            title: 'Preparing',
            value: stats?.ordersByStatus?.find((s) => s._id === 'Preparing')?.count || 0,
            icon: ChefHat,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome to Eatoes Admin Dashboard
                </p>
            </div>

            {/* Stats Cards */}
            {isLoadingStats ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${card.color}`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Sellers - Challenge 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Top Selling Items
                        </h2>
                    </div>

                    {isLoadingTopSellers ? (
                        <Spinner />
                    ) : topSellers.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No sales data yet
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {topSellers.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    {item.imageUrl && (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.category} • {item.totalQuantity} sold
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            ${item.totalRevenue.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Orders by Status */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingBag className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Orders by Status
                        </h2>
                    </div>

                    {isLoadingStats ? (
                        <Spinner />
                    ) : !stats?.ordersByStatus?.length ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No orders yet
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {stats?.ordersByStatus?.map((stat) => (
                                <div
                                    key={stat._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <StatusBadge status={stat._id as OrderStatus} />
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {stat.count} orders
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            ${stat.totalRevenue.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
