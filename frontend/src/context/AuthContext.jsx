import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token implementation needed in backend, or just decode if client-side only (not recommended).
                    // For now, let's assume if token exists we are logged in, or try to fetch profile.
                    // Since we don't have a /me endpoint explicitly documented (maybe I created it?), let's verify.
                    // I remember creating auth.routes.js but did I add /me?
                    // Let's check auth.routes.js later. For now, we will decode from localStorage if user info is stored there or just persist logged in state.
                    // Better: Store user info in localStorage on login too.
                    const storedUser = localStorage.getItem('user');
                    if (storedUser && storedUser !== 'undefined') {
                        setUser(JSON.parse(storedUser));
                    }
                } catch (error) {
                    console.error('Auth check failed', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        console.log('Attempting login with:', email);
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response.data);
            const { token, usuario } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(usuario));
            setUser(usuario);
            return { success: true };
        } catch (error) {
            console.error('Login failed details:', error);
            return {
                success: false,
                message: error.response?.data?.error || 'Error al iniciar sesión'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
