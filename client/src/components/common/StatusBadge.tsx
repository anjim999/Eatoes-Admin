import { clsx } from 'clsx';
import type { OrderStatus } from '../../types';

interface BadgeProps {
    status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
    Pending: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500',
    },
    Preparing: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500',
    },
    Ready: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        dot: 'bg-green-500',
    },
    Delivered: {
        bg: 'bg-gray-50 dark:bg-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        dot: 'bg-gray-500',
    },
    Cancelled: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500',
    },
};

export function StatusBadge({ status }: BadgeProps) {
    const config = statusConfig[status];

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                config.bg,
                config.text
            )}
        >
            <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
            {status}
        </span>
    );
}
