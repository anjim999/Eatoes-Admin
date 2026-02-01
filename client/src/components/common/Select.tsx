import { forwardRef, SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Option[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={clsx(
                        'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
                        'bg-white dark:bg-gray-800',
                        'text-gray-900 dark:text-gray-100',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
