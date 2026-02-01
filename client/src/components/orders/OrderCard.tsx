import { clsx } from 'clsx';
import { ChevronDown, ChevronUp, Clock, User, Hash } from 'lucide-react';
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
                'overflow-hidden transition-all duration-200'
            )}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                #{order.orderNumber}
                            </span>
                            <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {order.customerName}
                            </span>
                            <span className="flex items-center gap-1">
                                <Hash className="w-4 h-4" />
                                Table {order.tableNumber}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${order.totalAmount.toFixed(2)}
                    </span>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                    {/* Order Items */}
                    <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Order Items
                        </h4>
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    {item.menuItem.imageUrl && (
                                        <img
                                            src={item.menuItem.imageUrl}
                                            alt={item.menuItem.name}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {item.menuItem.name}
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Status Update */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Update Status:
                            </span>
                            <div className="w-48">
                                <Select
                                    value={order.status}
                                    onChange={(e) => onUpdateStatus(order._id, e.target.value as OrderStatus)}
                                    options={statusOptions}
                                    disabled={isUpdating}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
