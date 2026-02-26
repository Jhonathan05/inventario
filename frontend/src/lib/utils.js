export const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:3003/api') {
        return import.meta.env.VITE_API_URL;
    }
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3003/api`;
};

export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150?text=No+Image';
    if (path.startsWith('http')) return path;
    const rootUrl = getApiBaseUrl().replace('/api', '');
    return `${rootUrl}/${path}`;
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value);
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO');
};

export const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

/**
 * Wrapper de evento onChange que convierte el valor a MAYÚSCULAS antes de
 * invocar el handler original. Úsalo así:
 *   onChange={toUpperInput(handleChange)}
 *   onChange={toUpperInput(e => setFormData({...formData, campo: e.target.value}))}
 */
export const toUpperInput = (handler) => (e) => {
    const clone = { ...e, target: { ...e.target, value: e.target.value.toUpperCase() } };
    // Necesario para eventos sintéticos de React
    Object.defineProperty(clone, 'target', { value: { ...e.target, value: e.target.value.toUpperCase() } });
    e.target.value = e.target.value.toUpperCase();
    handler(e);
};
