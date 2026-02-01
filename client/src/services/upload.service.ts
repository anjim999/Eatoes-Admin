import { api } from './api';

export interface UploadResponse {
    success: boolean;
    data: {
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
        imageUrl: string;
    };
}

export const uploadService = {
    // Upload a single image file
    async uploadImage(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};
