import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import type { MenuItem, CreateMenuItemDTO, Category } from '../../types';

interface MenuFormProps {
    item?: MenuItem | null;
    onSubmit: (data: CreateMenuItemDTO) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const categoryOptions = [
    { value: 'Appetizer', label: 'Appetizer' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Beverage', label: 'Beverage' },
];

export function MenuForm({ item, onSubmit, onClose, isLoading = false }: MenuFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Appetizer' as Category,
        price: '',
        ingredients: '',
        preparationTime: '',
        imageUrl: '',
        isAvailable: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                description: item.description || '',
                category: item.category,
                price: item.price.toString(),
                ingredients: item.ingredients.join(', '),
                preparationTime: item.preparationTime?.toString() || '',
                imageUrl: item.imageUrl || '',
                isAvailable: item.isAvailable,
            });
        }
    }, [item]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data: CreateMenuItemDTO = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            category: formData.category,
            price: parseFloat(formData.price),
            ingredients: formData.ingredients
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean),
            preparationTime: formData.preparationTime
                ? parseInt(formData.preparationTime)
                : undefined,
            imageUrl: formData.imageUrl.trim() || undefined,
            isAvailable: formData.isAvailable,
        };

        onSubmit(data);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Form */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item ? 'Edit Menu Item' : 'Add Menu Item'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Enter item name"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={categoryOptions}
                            error={errors.category}
                        />
                        <Input
                            label="Price ($)"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="Enter description"
                        />
                    </div>

                    <Input
                        label="Ingredients (comma separated)"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="e.g., chicken, garlic, butter"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Preparation Time (min)"
                            name="preparationTime"
                            type="number"
                            min="1"
                            value={formData.preparationTime}
                            onChange={handleChange}
                            placeholder="15"
                        />
                        <Input
                            label="Image URL"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                            htmlFor="isAvailable"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Available for order
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            {item ? 'Update Item' : 'Add Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
