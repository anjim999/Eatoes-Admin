import { useState, useEffect, useRef } from 'react';
import { X, Upload, Link, Image } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { uploadService } from '../../services/upload.service';
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
    const [imageInputType, setImageInputType] = useState<'url' | 'file'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            if (item.imageUrl) {
                setPreviewUrl(item.imageUrl);
            }
        }
    }, [item]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!allowedTypes.includes(file.type)) {
                setErrors((prev) => ({ ...prev, image: 'Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.' }));
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, image: 'File size must be less than 5MB' }));
                return;
            }

            setSelectedFile(file);
            setErrors((prev) => ({ ...prev, image: '' }));

            // Create preview URL
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        let finalImageUrl = formData.imageUrl.trim() || undefined;

        // If file is selected, upload it first
        if (imageInputType === 'file' && selectedFile) {
            try {
                setIsUploading(true);
                const uploadResult = await uploadService.uploadImage(selectedFile);
                // Construct the full URL using the API base URL
                const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://eatoes-admin-gweo.onrender.com';
                finalImageUrl = `${baseUrl}${uploadResult.data.imageUrl}`;
            } catch (error) {
                setErrors((prev) => ({ ...prev, image: 'Failed to upload image. Please try again.' }));
                setIsUploading(false);
                return;
            } finally {
                setIsUploading(false);
            }
        }

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
            imageUrl: finalImageUrl,
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

        // Update preview for URL
        if (name === 'imageUrl' && value.trim()) {
            setPreviewUrl(value.trim());
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(formData.imageUrl || '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
                            label="Price (₹)"
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

                    <Input
                        label="Preparation Time (min)"
                        name="preparationTime"
                        type="number"
                        min="1"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        placeholder="15"
                    />

                    {/* Image Input Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Image
                        </label>

                        {/* Toggle between URL and File upload */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setImageInputType('url')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${imageInputType === 'url'
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Link className="w-4 h-4" />
                                URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageInputType('file')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${imageInputType === 'file'
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Upload className="w-4 h-4" />
                                Upload File
                            </button>
                        </div>

                        {/* URL Input */}
                        {imageInputType === 'url' && (
                            <Input
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        )}

                        {/* File Upload */}
                        {imageInputType === 'file' && (
                            <div className="space-y-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        JPEG, PNG, GIF, WebP, SVG (max 5MB)
                                    </p>
                                </div>
                                {selectedFile && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        Remove selected file
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Preview:</p>
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setPreviewUrl('')}
                                    />
                                </div>
                            </div>
                        )}

                        {errors.image && (
                            <p className="text-sm text-red-500">{errors.image}</p>
                        )}
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
                        <Button type="submit" isLoading={isLoading || isUploading}>
                            {isUploading ? 'Uploading...' : item ? 'Update Item' : 'Add Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

