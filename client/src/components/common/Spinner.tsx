import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={clsx("flex justify-center items-center h-full", className)}>
            <div className="relative">
                <Loader2 className={clsx(
                    "text-primary-600 animate-spin",
                    sizeClasses[size]
                )} />
                <div className={clsx(
                    "absolute inset-0 border-2 border-primary-600/10 rounded-full",
                    sizeClasses[size]
                )} />
            </div>
        </div>
    );
}
