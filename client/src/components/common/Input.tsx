import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                            'bg-white dark:bg-gray-800',
                            'text-gray-900 dark:text-gray-100',
                            'placeholder-gray-400 dark:placeholder-gray-500',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                            error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600',
                            leftIcon && 'pl-10',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
