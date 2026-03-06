import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-content min-h-screen">
                <header className="container pt-6">
                    <div className="flex justify-between items-center p-4 rounded-2xl glass shadow-sm gap-2 md:gap-4 relative">
                        <div className="md:hidden flex-1 overflow-hidden">
                            <h1 className="text-lg m-0 text-fnc-700 leading-tight truncate">Inventario TIC</h1>
                            <p className="text-xs text-charcoal-600 m-0 truncate font-medium">{user?.nombre}</p>
                            <p className="text-[10px] text-fnc-500 capitalize m-0 font-bold">{user?.rol || 'Personal'}</p>
                        </div>
                        <div className="hidden md:block flex-1">
                            <h2 className="m-0 text-charcoal-800">Panel de Control</h2>
                            <p className="text-sm text-fnc-600 capitalize m-0 font-medium">Gestión de Activos y Funcionarios</p>
                        </div>

                        {/* Datos de Usuario y Menú Desplegable */}
                        <div className="flex items-center gap-3 text-right md:border-l md:border-charcoal-200 md:pl-4 ml-auto" ref={dropdownRef}>
                            <div className="hidden md:flex flex-col justify-center">
                                <span className="text-sm font-bold text-charcoal-800">{user?.nombre || 'Administrador'}</span>
                                <span className="text-xs text-charcoal-500">{user?.email || 'admin@federacion.com'}</span>
                                <span className="text-[10px] text-fnc-600 uppercase font-bold mt-0.5">{user?.rol || 'Rol'}</span>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="h-11 w-11 rounded-full bg-fnc-100 flex items-center justify-center text-fnc-700 font-bold text-lg flex-shrink-0 shadow-sm border border-fnc-200 hover:ring-2 hover:ring-fnc-300 hover:ring-offset-1 transition-all focus:outline-none"
                                >
                                    {user?.nombre?.[0]?.toUpperCase() || 'U'}
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50 animate-slide-up origin-top-right">
                                        <div className="px-4 py-3 md:hidden">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre || 'Usuario'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || 'correo@ejemplo.com'}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                            >
                                                <svg className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container pt-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
