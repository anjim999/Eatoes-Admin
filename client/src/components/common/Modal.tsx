import { Fragment, ReactNode } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <Fragment>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={clsx(
                        'w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl',
                        'transform transition-all',
                        'max-h-[90vh] overflow-hidden flex flex-col',
                        sizes[size]
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
                </div>
            </div>
        </Fragment>
    );
}
