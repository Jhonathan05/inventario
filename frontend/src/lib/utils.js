export const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:3003/api') {
        return import.meta.env.VITE_API_URL;
    }
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3003/api`;
};

export const getImageUrl = (path) => {
    if (!path) return null; // null significa: usar ícono por defecto
    if (path.startsWith('http')) return path;
    const rootUrl = getApiBaseUrl().replace('/api', '');
    return `${rootUrl}/${path}`;
};

// Paths SVG predeterminados por tipo de activo
const ASSET_ICON_PATHS = {
    PORTATIL: 'M9 3H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V4a1 1 0 00-1-1h-6M9 3v1m0-1h6m0 0v1M3 16v1a2 2 0 002 2h14a2 2 0 002-2v-1',
    LAPTOP: 'M9 3H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V4a1 1 0 00-1-1h-6M9 3v1m0-1h6m0 0v1M3 16v1a2 2 0 002 2h14a2 2 0 002-2v-1',
    MONITOR: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    DESKTOP: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    IMPRESORA: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',
    SCANNER: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z',
    CELULAR: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    TABLET: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    UPS: 'M13 10V3L4 14h7v7l9-11h-7z',
    RED: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    SWITCH: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ROUTER: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    DEFAULT: 'M9 3H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V4a1 1 0 00-1-1h-6M9 3v1m0-1h6',
};

/**
 * Retorna el path SVG adecuado para un tipo/categoría de activo.
 */
export const getAssetIconPath = (tipo, categoriaNombre) => {
    const key = ((tipo || '') + ' ' + (categoriaNombre || '')).toUpperCase();
    for (const [k, path] of Object.entries(ASSET_ICON_PATHS)) {
        if (key.includes(k)) return path;
    }
    return ASSET_ICON_PATHS.DEFAULT;
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
 * invocar el handler original.
 */
export const toUpperInput = (handler) => (e) => {
    const clone = { ...e, target: { ...e.target, value: e.target.value.toUpperCase() } };
    Object.defineProperty(clone, 'target', { value: { ...e.target, value: e.target.value.toUpperCase() } });
    e.target.value = e.target.value.toUpperCase();
    handler(e);
};
