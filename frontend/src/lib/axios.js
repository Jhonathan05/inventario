import axios from 'axios';

// Construir la URL de la API dinámicamente a partir del hostname actual.
// Esto permite que la app funcione desde cualquier dispositivo en la LAN,
// ya que el móvil usará la IP del servidor (ej: 192.168.1.x) en vez de "localhost".
const getApiUrl = () => {
    // Si hay un override explícito, usarlo (útil para producción con dominio propio)
    if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:3003/api') {
        return import.meta.env.VITE_API_URL;
    }
    // Derivar dinámicamente del hostname actual del navegador
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3003/api`;
};

const API_URL = getApiUrl();
console.log('API_URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptar respuestas para manejar expiración de token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token inválido o expirado
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirigir al inicio de sesión si no estamos ya allí
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
