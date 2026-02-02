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
                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            'w-full px-5 py-3.5 rounded-2xl border-none ring-1 transition-all duration-300',
                            'bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900',
                            'text-gray-900 dark:text-white font-bold',
                            'placeholder:text-gray-400 dark:placeholder:text-gray-600',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm',
                            error
                                ? 'ring-red-500/50 focus:ring-red-500'
                                : 'ring-gray-100 dark:ring-gray-700/50',
                            leftIcon && 'pl-12',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-2 ml-1 text-xs font-bold text-red-500 animate-fade-in">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
