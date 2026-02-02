export const getImageUrl = (url: string | undefined | null): string => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    
    // Get API URL and strip /api suffix to get server root
    const apiBase = import.meta.env.VITE_API_URL || 'https://eatoes-admin-gweo.onrender.com/api';
    const serverRoot = apiBase.replace(/\/api\/?$/, '');
    
    // Ensure path starts with /
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    
    return `${serverRoot}${normalizedPath}`;
};
