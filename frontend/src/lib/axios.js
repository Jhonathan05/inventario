import axios from 'axios';

// Construir la URL de la API dinámicamente a partir del hostname actual.
// Esto permite que la app funcione desde cualquier dispositivo en la LAN,
// ya que el móvil usará la IP del servidor (ej: 192.168.1.x) en vez de "localhost".
const getApiUrl = () => {
    // Si hay un override explícito en las variables de entorno, usarlo
    if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost:3003')) {
        return import.meta.env.VITE_API_URL;
    }
    // En producción (detrás de Nginx) o desarrollo (con proxy de Vite), 
    // usamos la ruta relativa para evitar problemas de puertos e IPs.
    return '/api';
};

const API_URL = getApiUrl();

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // Importante para enviar la HttpOnly Cookie
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptar respuestas para manejar expiración de token y refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Evitar bucles infinitos en llamados de auth o si el original_request ya se reintentó
        if (error.response && error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/refresh')) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Enviar la cookie refreshToken para obtener un nuevo access token corto
                const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                
                const newToken = data.token;
                localStorage.setItem('token', newToken);
                
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                
                processQueue(null, newToken);
                
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                
                // Si el refresh token también falló (expirado a los 7 días, o inexistente)
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
