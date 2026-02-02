import { clsx } from 'clsx';
import type { OrderStatus } from '../../types';

interface BadgeProps {
    status: OrderStatus;
    className?: string; // Added className prop for flexibility
}

const statusConfig: Record<OrderStatus, { bg: string; text: string; dot: string; border: string }> = {
    Pending: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/10',
        text: 'text-yellow-600 dark:text-yellow-400',
        dot: 'bg-yellow-500',
        border: 'border-yellow-200 dark:border-yellow-700/30'
    },
    Preparing: {
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        text: 'text-blue-600 dark:text-blue-400',
        dot: 'bg-blue-500',
        border: 'border-blue-200 dark:border-blue-700/30'
    },
    Ready: {
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        text: 'text-purple-600 dark:text-purple-400',
        dot: 'bg-purple-500',
        border: 'border-purple-200 dark:border-purple-700/30'
    },
    Delivered: {
        bg: 'bg-green-50 dark:bg-green-900/10',
        text: 'text-green-600 dark:text-green-400',
        dot: 'bg-green-500',
        border: 'border-green-200 dark:border-green-700/30'
    },
    Cancelled: {
        bg: 'bg-red-50 dark:bg-red-900/10',
        text: 'text-red-600 dark:text-red-400',
        dot: 'bg-red-500',
        border: 'border-red-200 dark:border-red-700/30'
    },
};

export function StatusBadge({ status, className }: BadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                config.bg,
                config.text,
                config.border,
                className
            )}
        >
            <span className={clsx('w-1.5 h-1.5 rounded-full shadow-sm', config.dot)} />
            {status}
        </span>
    );
}
