import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary:
                'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
            secondary:
                'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
            danger:
                'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
            ghost:
                'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm gap-1.5',
            md: 'px-4 py-2.5 text-sm gap-2',
            lg: 'px-6 py-3 text-base gap-2',
        };

        return (
            <button
                ref={ref}
                className={clsx(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    leftIcon && <span className="shrink-0">{leftIcon}</span>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
