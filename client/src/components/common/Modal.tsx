import { Fragment, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    const modalContent = (
        <Fragment>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9999] bg-gray-900/60 backdrop-blur-md transition-all duration-300 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-none">
                <div
                    className={clsx(
                        'w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl ring-1 ring-black/5 pointer-events-auto',
                        'transform transition-all',
                        'max-h-[85vh] overflow-hidden flex flex-col',
                        sizes[size]
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700/50">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">{children}</div>
                </div>
            </div>
        </Fragment>
    );

    return createPortal(modalContent, document.body);
}
