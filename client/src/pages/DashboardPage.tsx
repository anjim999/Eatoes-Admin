import { TrendingUp, ShoppingBag, IndianRupee, Clock, ChefHat, ArrowUpRight, BarChart3, PieChart, Activity } from 'lucide-react';
import { useTopSellers } from '../hooks/useMenu';
import { useOrderStats } from '../hooks/useOrders';
import Spinner from '../components/common/Spinner';
import { StatusBadge } from '../components/common/StatusBadge';
import type { OrderStatus } from '../types';
import clsx from 'clsx';

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
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800/30',
            trend: '+12.5%',
        },
        {
            title: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: IndianRupee,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-100 dark:border-green-800/30',
            trend: '+8.2%',
        },
        {
            title: 'Pending',
            value: stats?.ordersByStatus?.find((s) => s._id === 'Pending')?.count || 0,
            icon: Clock,
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            border: 'border-orange-100 dark:border-orange-800/30',
            trend: '-2.4%',
        },
        {
            title: 'Preparing',
            value: stats?.ordersByStatus?.find((s) => s._id === 'Preparing')?.count || 0,
            icon: ChefHat,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-100 dark:border-purple-800/30',
            trend: '+5.1%',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        Overview of your restaurant's performance
                    </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm w-fit">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Live Updates Active
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            {isLoadingStats ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className={clsx(
                                "group bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border",
                                card.border
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={clsx("p-3.5 rounded-2xl transition-colors duration-300", card.bg)}>
                                    <card.icon className={clsx("w-6 h-6", card.color)} />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {card.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                                <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                {/* Top Sellers */}
                <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                                <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Top Selling Dishes
                                </h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Performance Metrics</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest border-b-2 border-transparent hover:border-primary-600 transition-all">
                            View All Items
                        </button>
                    </div>

                    <div className="p-6 flex-1">
                        {isLoadingTopSellers ? (
                            <div className="py-20 flex justify-center">
                                <Spinner />
                            </div>
                        ) : topSellers.length === 0 ? (
                            <div className="text-center py-24">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                    <BarChart3 className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Data Available</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Sales data will appear here once orders start coming in.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topSellers.map((item, index) => (
                                    <div
                                        key={item._id}
                                        className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-3xl transition-all duration-200 group border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                                    >
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <div className="relative flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                                        <ChefHat className="w-8 h-8" />
                                                    </div>
                                                )}
                                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-white dark:bg-gray-800 border-2 border-primary-500 flex items-center justify-center text-xs font-black text-primary-600 shadow-md">
                                                    #{index + 1}
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                                    {item.name}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider flex items-center gap-1">
                                                        <Activity className="w-3 h-3" />
                                                        {item.totalQuantity} Sold
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between sm:flex-col sm:items-end sm:text-right pl-4 sm:pl-0 border-l-2 sm:border-l-0 border-gray-100 dark:border-gray-800 sm:border-transparent">
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-white text-xl">
                                                    ₹{item.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Total Revenue</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-fit flex flex-col">
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                                <PieChart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Order Pipeline
                                </h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Status Distribution</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {isLoadingStats ? (
                            <div className="py-10 flex justify-center">
                                <Spinner />
                            </div>
                        ) : !stats?.ordersByStatus?.length ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200 dark:border-gray-700">
                                    <Clock className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">No active orders</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {stats?.ordersByStatus?.map((stat) => (
                                    <div
                                        key={stat._id}
                                        className="group p-5 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <StatusBadge status={stat._id as OrderStatus} />
                                            <span className="text-sm font-black text-gray-900 dark:text-white">
                                                {stat.count} <span className="text-gray-400 text-xs font-bold uppercase ml-1">Orders</span>
                                            </span>
                                        </div>
                                        {/* Progress Bar Mockup */}
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-4">
                                            <div 
                                                className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${Math.min((stat.count / (stats.totalOrders || 1)) * 100, 100)}%` }} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Revenue</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                ₹{stat.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


