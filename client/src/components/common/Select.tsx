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
                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={clsx(
                            'w-full px-5 py-3.5 rounded-2xl border-none ring-1 transition-all duration-300 appearance-none',
                            'bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900',
                            'text-gray-900 dark:text-white font-bold',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm',
                            error
                                ? 'ring-red-500/50 focus:ring-red-500'
                                : 'ring-gray-100 dark:ring-gray-700/50',
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && <p className="mt-2 ml-1 text-xs font-bold text-red-500 animate-fade-in">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
