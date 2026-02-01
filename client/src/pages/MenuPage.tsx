import { useState, useEffect } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
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
import type { MenuItem, CreateMenuItemDTO, Category } from '../types';

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

    // Debounced search value - Challenge 1
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Queries
    const {
        data: menuData,
        isLoading: isLoadingMenu,
        error: menuError,
    } = useMenuItems({
        category: category || undefined,
        isAvailable: availability ? availability === 'true' : undefined,
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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteMutation.mutateAsync(id);
            showToast('Item deleted successfully', 'success');
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
    };

    const hasActiveFilters = category || availability || searchQuery;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Menu Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your restaurant menu items
                    </p>
                </div>
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
                    Add Item
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input with Debouncing */}
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            leftIcon={<Search className="w-5 h-5" />}
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            leftIcon={<Filter className="w-4 h-4" />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                        </Button>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters} leftIcon={<X className="w-4 h-4" />}>
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            options={categoryOptions}
                        />
                        <Select
                            label="Availability"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            options={availabilityOptions}
                        />
                    </div>
                )}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSearchMode
                        ? `Found ${items.length} item(s) for "${debouncedSearch}"`
                        : `Showing ${items.length} of ${menuData?.pagination.total || 0} items`}
                </p>
            </div>

            {/* Loading State */}
            {isLoading && <Spinner />}

            {/* Error State */}
            {!!menuError && (
                <div className="text-center py-12">
                    <p className="text-red-500">Failed to load menu items. Please try again.</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && items.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                        {isSearchMode
                            ? 'No items found matching your search.'
                            : 'No menu items yet. Add your first item!'}
                    </p>
                </div>
            )}

            {/* Menu Grid */}
            {!isLoading && items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            )}

            {/* Menu Form Modal */}
            {showForm && (
                <MenuForm
                    item={editItem}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </div>
    );
}
