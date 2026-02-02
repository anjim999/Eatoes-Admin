import { useState } from 'react';
import { 
    Search, 
    Plus, 
    Filter, 
    X, 
    AlertTriangle, 
    Utensils, 
    SlidersHorizontal, 
    ArrowLeft, 
    ArrowRight,
    ChefHat,
    LayoutGrid,
    Flame
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { MenuCard } from '../components/menu/MenuCard';
import { MenuForm } from '../components/menu/MenuForm';
import { useDebounce } from '../hooks/useDebounce';
import {
    useMenuItems,
    useMenuSearch,
    useCreateMenuItem,
    useUpdateMenuItem,
    useDeleteMenuItem,
    useToggleAvailability,
} from '../hooks/useMenu';
import { useToast } from '../context/ToastContext';
import type { MenuItem, CreateMenuItemDTO } from '../types';
import clsx from 'clsx';

const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Appetizer', label: 'Appetizer' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Beverage', label: 'Beverage' },
];

const availabilityOptions = [
    { value: '', label: 'All Items' },
    { value: 'true', label: 'Available Only' },
    { value: 'false', label: 'Unavailable Only' },
];

export default function MenuPage() {
    const { showToast } = useToast();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [availability, setAvailability] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<MenuItem | null>(null);
    const [page, setPage] = useState(1);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        itemId: string | null;
        itemName?: string;
    }>({
        isOpen: false,
        itemId: null,
    });

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Queries
    const {
        data: menuData,
        isLoading: isLoadingMenu,
        error: menuError,
        refetch
    } = useMenuItems({
        category: category || undefined,
        isAvailable: availability ? availability === 'true' : undefined,
        page,
        limit: 12,
    });

    const {
        data: searchData,
        isFetching: isSearching,
    } = useMenuSearch(debouncedSearch);

    // Mutations
    const createMutation = useCreateMenuItem();
    const updateMutation = useUpdateMenuItem();
    const deleteMutation = useDeleteMenuItem();
    const toggleMutation = useToggleAvailability();

    // Determine which data to show
    const isSearchMode = debouncedSearch.length > 0;
    const items = isSearchMode ? searchData?.data || [] : menuData?.data || [];
    const isLoading = isSearchMode ? isSearching : isLoadingMenu;
    const pagination = menuData?.pagination;

    // Handlers
    const handleToggleAvailability = async (id: string) => {
        try {
            await toggleMutation.mutateAsync(id);
            showToast('Availability updated', 'success');
        } catch (error) {
            showToast('Failed to update availability', 'error');
        }
    };

    const handleEdit = (item: MenuItem) => {
        setEditItem(item);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        const item = items.find((i) => i._id === id);
        setDeleteConfirmation({
            isOpen: true,
            itemId: id,
            itemName: item?.name,
        });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.itemId) return;

        try {
            await deleteMutation.mutateAsync(deleteConfirmation.itemId);
            showToast('Item deleted successfully', 'success');
            setDeleteConfirmation({ isOpen: false, itemId: null });
        } catch (error) {
            showToast('Failed to delete item', 'error');
        }
    };

    const handleSubmit = async (data: CreateMenuItemDTO) => {
        try {
            if (editItem) {
                await updateMutation.mutateAsync({ id: editItem._id, data });
                showToast('Item updated successfully', 'success');
            } else {
                await createMutation.mutateAsync(data);
                showToast('Item created successfully', 'success');
            }
            setShowForm(false);
            setEditItem(null);
        } catch (error) {
            showToast('Failed to save item', 'error');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditItem(null);
    };

    const clearFilters = () => {
        setCategory('');
        setAvailability('');
        setSearchQuery('');
        setPage(1);
    };

    const hasActiveFilters = category || availability || searchQuery;

    return (
        <div className="space-y-6 sm:space-y-10 pb-20 animate-fade-in">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 -m-20 opacity-10 blur-3xl pointer-events-none">
                    <ChefHat className="w-[30rem] h-[30rem] text-white rotate-12" />
                </div>
                <div className="absolute bottom-0 left-0 -m-20 opacity-5 blur-2xl pointer-events-none">
                    <Flame className="w-96 h-96 text-primary-400 -rotate-45" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="max-w-xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary-200">
                           <LayoutGrid className="w-3 h-3" />
                           Culinary Repository
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.9] mb-2">
                            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100">Flavors</span>
                        </h1>
                        <p className="text-primary-100/70 text-lg font-medium leading-relaxed max-w-sm">
                            Curate, manage and refine your restaurant's digital offerings with precision.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        leftIcon={<Plus className="w-6 h-6" />}
                        className="bg-white text-primary-900 hover:bg-primary-50 px-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl shadow-black/40 self-start md:self-center"
                    >
                        NEW DISH
                    </Button>
                </div>
            </div>

            {/* Smart Search & Filter Dock */}
            <div className="sticky top-4 z-30 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl p-4 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500 text-gray-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by flavor, name or ingredient..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-none ring-1 ring-gray-100 dark:ring-gray-700/50 focus:ring-2 focus:ring-primary-500 font-bold transition-all placeholder:text-gray-400 text-gray-900 dark:text-white"
                    />
                    {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Spinner size="sm" />
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border shrink-0",
                            showFilters 
                                ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30" 
                                : "bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700/50 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && !showFilters && <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping" />}
                    </button>
                    
                    {hasActiveFilters && (
                        <button 
                            onClick={clearFilters}
                            className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 dark:border-gray-700/50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Expandable Filter Drawer */}
            <div className={clsx(
                "overflow-hidden transition-all duration-500 ease-in-out",
                showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 dark:bg-gray-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 mb-8">
                    <Select
                        label="Gourmet Category"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        options={categoryOptions}
                        className="rounded-2xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800"
                    />
                    <Select
                        label="Status Monitor"
                        value={availability}
                        onChange={(e) => {
                            setAvailability(e.target.value);
                            setPage(1);
                        }}
                        options={availabilityOptions}
                        className="rounded-2xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800"
                    />
                </div>
            </div>

            {/* Result Header Bar */}
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3 text-gray-400">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        {isSearchMode ? "Discovery Mode" : "Standard Archive"}
                    </span>
               </div>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    {items.length} {items.length === 1 ? 'Entry' : 'Entries'} Displayed
               </div>
            </div>

            {/* Main Content Grid */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center gap-6">
                    <Spinner size="lg" />
                    <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Syncing Inventory...</p>
                </div>
            ) : !!menuError ? (
                <div className="text-center py-24 bg-red-50/50 dark:bg-red-900/10 rounded-[3rem] border border-red-100 dark:border-red-900/20 px-10">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h4 className="text-2xl font-black text-red-900 dark:text-red-100 mb-2">Pantry Offline</h4>
                    <p className="text-red-600/70 font-medium mb-8 max-w-sm mx-auto">The digital kitchen is currently unreachable. Please check your uplink.</p>
                    <Button onClick={() => refetch()} variant="secondary" className="rounded-2xl font-black px-10 py-3 border-red-200">
                        RETRY CONNECTION
                    </Button>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-[3.5rem] border border-dashed border-gray-200 dark:border-gray-700 px-10">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Utensils className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">No creations found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium mb-10 leading-relaxed">
                        {isSearchMode 
                            ? "We couldn't locate any dishes matching your query. Fine-tune your search terms?" 
                            : category 
                            ? `Your ${category} gallery is waiting for its first masterpiece.` 
                            : 'Architect your first culinary delight and share it with the world.'}
                    </p>
                    {!isSearchMode && (
                        <Button onClick={() => setShowForm(true)} className="rounded-2xl font-black px-12 py-4 shadow-xl shadow-primary-500/20">
                            CRAFT NEW ITEM
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map((item) => (
                            <MenuCard
                                key={item._id}
                                item={item}
                                onToggleAvailability={handleToggleAvailability}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isToggling={toggleMutation.isPending}
                            />
                        ))}
                    </div>

                    {/* Premium Pagination */}
                    {!isSearchMode && pagination && pagination.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 mt-12 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4 order-2 sm:order-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pantry Page</span>
                                <div className="flex items-center gap-1.5">
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => {
                                                setPage(i + 1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={clsx(
                                                "w-10 h-10 rounded-xl text-xs font-black transition-all border-2",
                                                page === i + 1 
                                                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30" 
                                                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-primary-500/50"
                                            )}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </button>
                                    )).slice(Math.max(0, page - 3), Math.min(pagination.totalPages, page + 2))}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 order-1 sm:order-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary-600 hover:border-primary-500/50 disabled:opacity-20 transition-all font-black"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <button
                                    disabled={page === pagination.totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary-600 hover:border-primary-500/50 disabled:opacity-20 transition-all font-black"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals & Forms */}
            {showForm && (
                <MenuForm
                    item={editItem}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            )}

            <Modal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, itemId: null })}
                title="PERMANENT REMOVAL"
            >
                <div className="flex flex-col items-center text-center p-2">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Confirm Sacrifice?</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-xs">
                        Removing <span className="text-gray-900 dark:text-white font-bold">"{deleteConfirmation.itemName}"</span> is permanent. This flavor profile will be lost to time.
                    </p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteConfirmation({ isOpen: false, itemId: null })}
                            className="rounded-2xl h-14 font-black text-gray-400"
                        >
                            HOLD ON
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            isLoading={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-14 font-black shadow-xl shadow-red-500/30"
                        >
                            DELETE
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
