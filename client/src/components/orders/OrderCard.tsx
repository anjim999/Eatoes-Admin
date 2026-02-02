import { clsx } from 'clsx';
import { getImageUrl } from '../../utils/image';
import { ChevronDown, ChevronUp, Clock, User, Hash, Utensils, FileText, MapPin, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Select } from '../common/Select';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (id: string, status: OrderStatus) => void;
    isUpdating?: boolean;
}

const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Preparing', label: 'Preparing' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
];

export function OrderCard({ order, onUpdateStatus, isUpdating = false }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const statusColors: Record<OrderStatus, string> = {
        Pending: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100',
        Preparing: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100',
        Ready: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100',
        Delivered: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100',
        Cancelled: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100'
    };

    return (
        <div
            className={clsx(
                'group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                isExpanded ? 'ring-2 ring-primary-500/20' : ''
            )}
        >
            {/* Primary Info Header */}
            <div className="p-4 sm:p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={clsx(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors",
                            statusColors[order.status]
                        )}>
                            <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                    #{order.orderNumber}
                                </span>
                                <StatusBadge status={order.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5 min-w-fit">
                                    <User className="w-3.5 h-3.5" />
                                    {order.customerName}
                                </span>
                                <span className="flex items-center gap-1.5 min-w-fit">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Table {order.tableNumber}
                                </span>
                                <span className="flex items-center gap-1.5 min-w-fit">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatDate(order.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-6 sm:border-l border-gray-100 dark:border-gray-700">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">
                                ₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className={clsx(
                            "p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 transition-transform duration-300",
                            isExpanded ? "rotate-180" : "rotate-0"
                        )}>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Collapsible Details */}
            <div className={clsx(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-5 pb-6 pt-2 border-t border-gray-100/50 dark:border-gray-700/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Items List */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-primary-500" />
                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    Order Summary ({order.items.length})
                                </h4>
                            </div>
                            <div className="space-y-3">
                                {order.items.map((item, index) => {
                                    if (!item.menuItem) {
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3.5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                                        <Utensils className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-red-600 dark:text-red-400 leading-tight">
                                                            Item Unavailable
                                                        </p>
                                                        <p className="text-xs font-medium text-red-400 mt-0.5">
                                                            ₹{item.price.toFixed(2)} / unit
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">
                                                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {item.menuItem.imageUrl ? (
                                                        <img
                                                            src={getImageUrl(item.menuItem.imageUrl)}
                                                            alt={item.menuItem.name}
                                                            className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white p-0.5"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-300 border border-gray-100 dark:border-gray-700">
                                                            <Utensils className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                                        {item.menuItem.name}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-400 mt-0.5">
                                                        ₹{item.price.toFixed(2)} / unit
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status Management Panel */}
                        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 self-start">
                            <div className="flex items-center gap-2 mb-6">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    Order Workflow
                                </h4>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="relative pb-6">
                                    <p className="text-xs font-bold text-gray-500 mb-3">CURRENT STATUS</p>
                                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                                        {statusOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                disabled={isUpdating}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUpdateStatus(order._id, opt.value as OrderStatus);
                                                }}
                                                className={clsx(
                                                    "px-3 py-2.5 rounded-xl text-[11px] font-black transition-all border-2",
                                                    order.status === opt.value
                                                        ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30"
                                                        : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-primary-500/50 hover:text-primary-500"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Modified</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white">{formatDate(new Date().toISOString())}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
