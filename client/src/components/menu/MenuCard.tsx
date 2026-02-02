import { clsx } from 'clsx';
import { ToggleLeft, ToggleRight, Edit, Trash2, Clock, IndianRupee, Info, Star } from 'lucide-react';
import type { MenuItem } from '../../types';
import { getImageUrl } from '../../utils/image';

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
        Appetizer: 'bg-orange-500/10 text-orange-600 border-orange-200/50 dark:border-orange-500/20',
        'Main Course': 'bg-blue-500/10 text-blue-600 border-blue-200/50 dark:border-blue-500/20',
        Dessert: 'bg-pink-500/10 text-pink-600 border-pink-200/50 dark:border-pink-500/20',
        Beverage: 'bg-purple-500/10 text-purple-600 border-purple-200/50 dark:border-purple-500/20',
    };

    return (
        <div
            className={clsx(
                'group relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700',
                'overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2',
                !item.isAvailable && 'grayscale-[0.5]'
            )}
        >
            {/* Top Badge Overlay */}
            <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                <span className={clsx(
                    'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm pointer-events-auto',
                    categoryColors[item.category] || 'bg-gray-500/10 text-gray-600 border-gray-200/50'
                )}>
                    {item.category}
                </span>
                
                {!item.isAvailable && (
                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white shadow-lg shadow-red-500/30">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Premium Image Container */}
            <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                {item.imageUrl ? (
                    <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 gap-2">
                        <Info className="w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No visual preview</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate pr-2">
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-primary-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">4.8</span>
                    </div>
                </div>
                
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2 h-8 mb-6 leading-relaxed">
                    {item.description || "The chef's special creation, prepared with the finest ingredients and balanced flavors."}
                </p>

                {/* Meta Information Bar */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Investment</span>
                        <div className="flex items-center gap-0.5 text-gray-900 dark:text-white font-black text-xl">
                            <IndianRupee className="w-4 h-4 text-primary-500" />
                            <span>{item.price.toFixed(0)}</span>
                            <span className="text-xs text-gray-400 ml-0.5 font-bold">.00</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100 dark:bg-gray-700" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Kitchen Prep</span>
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-bold text-sm h-7">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            <span>{item.preparationTime || 15} min</span>
                        </div>
                    </div>
                </div>

                {/* Smart Actions Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700/50">
                    <button
                        onClick={() => onToggleAvailability(item._id)}
                        disabled={isToggling}
                        className={clsx(
                            'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all duration-300',
                            item.isAvailable
                                ? 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20'
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/30 dark:hover:bg-gray-900/50'
                        )}
                    >
                        {item.isAvailable ? (
                            <ToggleRight className="w-5 h-5" />
                        ) : (
                            <ToggleLeft className="w-5 h-5" />
                        )}
                        <span>{item.isAvailable ? 'ACTV' : 'DLT'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(item)}
                            className="p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
                            aria-label="Edit dish"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(item._id)}
                            className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm active:scale-95"
                            aria-label="Delete dish"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
