import { useState, useEffect, useRef } from 'react';
import { Upload, Link, Check, Image as ImageIcon } from 'lucide-react'; // Image icon renamed to avoid conflict
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Modal } from '../common/Modal'; // Import reusable Modal
import { uploadService } from '../../services/upload.service';
import type { MenuItem, CreateMenuItemDTO, Category } from '../../types';
import clsx from 'clsx';

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
        <Modal
            isOpen={true} // Controlled by parent rendering this component
            onClose={onClose}
            title={item ? 'Edit Culinary Masterpiece' : 'Create New Dish'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Input
                        label="Dish Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="e.g. Truffle Mushroom Risotto"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        leftIcon={<span className="text-gray-500 font-bold">₹</span>}
                    />
                </div>

                <div>
                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-5 py-4 rounded-2xl border-none ring-1 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm ring-gray-100 dark:ring-gray-700/50 transition-all placeholder:text-gray-400"
                        placeholder="Describe the flavors, textures, and key ingredients..."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                        label="Ingredients"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="e.g. Garlic, Thyme, Butter"
                    />

                    <Input
                        label="Prep Time (min)"
                        name="preparationTime"
                        type="number"
                        min="1"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        placeholder="15"
                    />
                </div>

                {/* Image Input Section */}
                <div className="space-y-3 bg-gray-50 dark:bg-gray-900/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        Dish Presentation
                    </label>

                    {/* Toggle between URL and File upload */}
                    <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl inline-flex shadow-sm border border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setImageInputType('url')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all",
                                imageInputType === 'url'
                                    ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                            )}
                        >
                            <Link className="w-3.5 h-3.5" />
                            Image URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageInputType('file')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all",
                                imageInputType === 'file'
                                    ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                            )}
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Upload File
                        </button>
                    </div>

                    {/* URL Input */}
                    {imageInputType === 'url' && (
                        <Input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="bg-white dark:bg-gray-800"
                        />
                    )}

                    {/* File Upload */}
                    {imageInputType === 'file' && (
                        <div className="space-y-3 animate-fade-in">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                    {selectedFile ? selectedFile.name : 'Click to select an image'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-medium">
                                    Max 5MB • JPG, PNG, WEBP
                                </p>
                            </div>
                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors px-2"
                                >
                                    Remove selection
                                </button>
                            )}
                        </div>
                    )}

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm animate-fade-in">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Live Preview</p>
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={() => setPreviewUrl('')}
                                />
                                <div className="absolute inset-0 ring-1 ring-black/5 rounded-xl pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {errors.image && (
                        <p className="text-xs font-bold text-red-500 animate-slide-in-right">{errors.image}</p>
                    )}
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all checked:border-primary-500 checked:bg-primary-500 hover:border-primary-400"
                        />
                        <Check className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <label
                        htmlFor="isAvailable"
                        className="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                    >
                        Available for ordering immediately
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading || isUploading} className="px-8 shadow-xl shadow-primary-500/20">
                        {isUploading ? 'Uploading...' : item ? 'Save Changes' : 'Create Dish'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

