import { clsx } from 'clsx';
import { ToggleLeft, ToggleRight, Edit, Trash2, Clock, IndianRupee } from 'lucide-react';
import type { MenuItem } from '../../types';

interface MenuCardProps {
    item: MenuItem;
    onToggleAvailability: (id: string) => void;
    onEdit: (item: MenuItem) => void;
    onDelete: (id: string) => void;
    isToggling?: boolean;
}

export function MenuCard({

    item,
    onToggleAvailability,
    onEdit,
    onDelete,
    isToggling = false,
}: MenuCardProps) {
    const categoryColors: Record<string, string> = {
        Appetizer: 'bg-orange-100 dark:bg-orange-950/90 text-orange-700 dark:text-orange-200 backdrop-blur-sm shadow-sm',
        'Main Course': 'bg-blue-100 dark:bg-blue-950/90 text-blue-700 dark:text-blue-200 backdrop-blur-sm shadow-sm',
        Dessert: 'bg-pink-100 dark:bg-pink-950/90 text-pink-700 dark:text-pink-200 backdrop-blur-sm shadow-sm',
        Beverage: 'bg-purple-100 dark:bg-purple-950/90 text-purple-700 dark:text-purple-200 backdrop-blur-sm shadow-sm',
    };

    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
                'overflow-hidden transition-all duration-200 hover:shadow-md',
                !item.isAvailable && 'opacity-60'
            )}
        >
            {/* Image */}
            <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                {/* Category Badge */}
                <span
                    className={clsx(
                        'absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-semibold',
                        categoryColors[item.category]
                    )}
                >
                    {item.category}
                </span>
                {/* Availability Badge */}
                {!item.isAvailable && (
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/90 text-red-700 dark:text-red-200 backdrop-blur-sm shadow-sm">
                        Unavailable
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10 mb-3">
                    {item.description || 'No description'}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {item.price.toFixed(2)}
                    </span>
                    {item.preparationTime && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.preparationTime} min
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => onToggleAvailability(item._id)}
                        disabled={isToggling}
                        className={clsx(
                            'flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium transition-colors',
                            item.isAvailable
                                ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                    >
                        {item.isAvailable ? (
                            <ToggleRight className="w-5 h-5" />
                        ) : (
                            <ToggleLeft className="w-5 h-5" />
                        )}
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(item._id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
