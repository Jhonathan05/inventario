import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { BellIcon, TicketIcon, ClockIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../lib/axios';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [alertsOpen, setAlertsOpen] = useState(false);
    const [alertas, setAlertas] = useState({ nuevos: 0, pendientes: 0, listaRecientes: [] });
    const dropdownRef = useRef(null);
    const alertsRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fetchAlertas = async () => {
        try {
            const res = await api.get('/alertas');
            setAlertas(res.data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const handleAlertaClick = async (alerta) => {
        try {
            if (!alerta.leida) {
                await api.patch(`/alertas/${alerta.id}/leida`);
                fetchAlertas();
            }
        } catch (e) {
            console.error('Error marking alert read:', e);
        }

        setAlertsOpen(false);

        if (alerta.tipo === 'SLA_TICKET_RESPUESTA' && alerta.referenciaId) {
            navigate(`/tickets/${alerta.referenciaId}`);
        } else if (['GARANTIA_VENCIMIENTO', 'MANTENIMIENTO_PROLONGADO'].includes(alerta.tipo) && alerta.referenciaId) {
            navigate(`/activos/${alerta.referenciaId}`);
        }
    };

    const getAlertaIcon = (tipo) => {
        if (tipo === 'SLA_TICKET_RESPUESTA') return <ClockIcon className="w-5 h-5 text-red-500" />;
        if (tipo === 'GARANTIA_VENCIMIENTO') return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
        if (tipo === 'MANTENIMIENTO_PROLONGADO') return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    };

    // Cerrar dropdowns al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (alertsRef.current && !alertsRef.current.contains(event.target)) {
                setAlertsOpen(false);
            }
        };

        if (user) {
            fetchAlertas();
            const interval = setInterval(fetchAlertas, 30000);
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                clearInterval(interval);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [user]);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-content min-h-screen">
                <header className="container pt-6">
                    <div className="flex justify-between items-center p-4 rounded-2xl glass shadow-sm gap-2 md:gap-4 relative z-[1000]">
                        <div className="md:hidden flex-1 overflow-hidden">
                            <h1 className="text-lg m-0 text-fnc-700 leading-tight truncate">Inventario TIC</h1>
                            <p className="text-xs text-charcoal-600 m-0 truncate font-medium">{user?.nombre}</p>
                            <p className="text-[10px] text-fnc-500 capitalize m-0 font-bold">{user?.rol || 'Personal'}</p>
                        </div>
                        <div className="hidden md:block flex-1">
                            <h2 className="m-0 text-charcoal-800">Panel de Control</h2>
                            <p className="text-sm text-fnc-600 capitalize m-0 font-medium tracking-tight">Gestión de Activos y Bitácora Técnica</p>
                        </div>

                        {/* Sistema de Alertas (Campana) */}
                        {user?.rol === 'ANALISTA_TIC' && (
                            <div className="relative mr-2" ref={alertsRef}>
                                <button
                                    onClick={() => setAlertsOpen(!alertsOpen)}
                                    className={`relative p-2 rounded-xl transition-all ${
                                        alertsOpen ? 'bg-fnc-100 text-fnc-700' : 'text-charcoal-400 hover:bg-gray-100 hover:text-fnc-600'
                                    }`}
                                >
                                    <BellIcon className="h-6 w-6" />
                                    {alertas.pendientes > 0 && (
                                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                                            {alertas.pendientes}
                                        </span>
                                    )}
                                </button>

                                {alertsOpen && (
                                    <div className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-[9999] overflow-hidden animate-slide-up origin-top-right border border-gray-100">
                                        <div className="bg-fnc-700 p-4 text-white">
                                            <h3 className="text-sm font-bold flex items-center justify-between">
                                                Alertas y Notificaciones
                                                <span className="bg-fnc-500 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Sistema</span>
                                            </h3>
                                            <p className="text-[10px] text-fnc-100 mt-1">Tienes {alertas.pendientes} notificaciones sin leer.</p>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                                            {alertas.listaRecientes.length > 0 ? (
                                                alertas.listaRecientes.map((alerta) => (
                                                    <button
                                                        key={alerta.id}
                                                        onClick={() => handleAlertaClick(alerta)}
                                                        className={`w-full text-left p-4 hover:bg-fnc-50 transition-colors flex items-start gap-3 group ${!alerta.leida ? 'bg-blue-50/50' : ''}`}
                                                    >
                                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!alerta.leida ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {getAlertaIcon(alerta.tipo)}
                                                                <p className={`text-xs font-semibold truncate ${!alerta.leida ? 'text-blue-900' : 'text-gray-900'}`}>
                                                                    {alerta.titulo}
                                                                </p>
                                                            </div>
                                                            <p className="text-[10px] text-gray-600 line-clamp-2 leading-tight">
                                                                {alerta.mensaje}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                                                    <ClockIcon className="w-3 h-3" />
                                                                    {formatDistanceToNow(new Date(alerta.creadoEn), { addSuffix: true, locale: es })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center bg-gray-50">
                                                    <BellIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-500">No tienes alertas pendientes.</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.delete('/alertas/limpiar');
                                                        fetchAlertas();
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                                className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-fnc-700 hover:bg-fnc-50 hover:border-fnc-200 transition-all shadow-sm"
                                            >
                                                Limpiar alertas leídas
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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
