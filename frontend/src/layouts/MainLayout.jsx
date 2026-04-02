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
        <div className="app-layout font-mono selection:bg-text-accent selection:text-bg-base">
            <Sidebar />

            <div className="main-content min-h-screen bg-bg-base">
                <header className="container pt-8">
                    <div className="flex justify-between items-center p-6 bg-bg-surface border-2 border-border-default md:border-4 gap-4 md:gap-8 relative z-[1000] shadow-3xl group/header overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/header:translate-x-2 transition-transform">SHELL_CORE_0x00</div>
                        
                        <div className="md:hidden flex-1 overflow-hidden">
                            <h1 className="text-xl m-0 text-text-accent leading-tight truncate font-black tracking-widest uppercase">/ inventario_tic</h1>
                            <p className="text-[10px] text-text-muted m-0 truncate font-black uppercase tracking-widest opacity-60">USER: {user?.nombre?.toUpperCase()}</p>
                        </div>
                        
                        <div className="hidden md:block flex-1">
                            <div className="flex items-center gap-6">
                                <div className="w-2.5 h-2.5 bg-text-accent animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.5)]"></div>
                                <h1 className="m-0 text-text-primary text-2xl font-black uppercase tracking-[0.4em]">system_dashboard_controller</h1>
                            </div>
                            <div className="flex items-center gap-6 mt-3">
                                <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic">gestion_activos // audit_stream // parity_check_ok</p>
                            </div>
                        </div>

                        {/* Sistema de Alertas (Campana) */}
                        {user?.rol === 'ANALISTA_TIC' && (
                            <div className="relative mr-4" ref={alertsRef}>
                                <button
                                    onClick={() => setAlertsOpen(!alertsOpen)}
                                    className={`relative p-3 border-2 transition-all active:scale-90 group/bell
                                        ${alertsOpen 
                                            ? 'bg-bg-elevated border-text-accent text-text-accent ring-4 ring-text-accent/10 shadow-2xl scale-110' 
                                            : 'bg-bg-base border-border-default text-text-muted hover:border-text-primary hover:text-text-primary hover:shadow-xl'
                                        }`}
                                >
                                    <BellIcon className={`h-6 w-6 transition-all ${alertsOpen ? 'animate-none' : 'group-hover/bell:scale-110'}`} />
                                    {alertas.pendientes > 0 && (
                                        <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center bg-text-accent text-[11px] font-black text-bg-base ring-2 ring-bg-base shadow-xl animate-bounce">
                                            {alertas.pendientes}
                                        </span>
                                    )}
                                </button>

                                {alertsOpen && (
                                    <div className="absolute right-0 mt-6 w-96 bg-bg-surface shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[9999] overflow-hidden animate-slideUp origin-top-right border-4 border-border-strong ring-8 ring-black/5">
                                        <div className="bg-bg-base p-6 border-b-2 border-border-default flex items-center justify-between">
                                            <h3 className="text-xs font-black flex items-center gap-4 text-text-primary uppercase tracking-[0.4em]">
                                                <div className="w-2 h-2 bg-text-accent"></div>
                                                notifications_manifest
                                            </h3>
                                            <span className="text-[10px] font-bold text-text-accent bg-bg-elevated px-3 py-1 border border-text-accent/20">BUFF_LEN: {alertas.pendientes.toString().padStart(2, '0')}</span>
                                        </div>

                                        <div className="max-h-[32rem] overflow-y-auto divide-y-2 divide-border-default/20 custom-scrollbar bg-bg-surface/50">
                                            {alertas.listaRecientes.length > 0 ? (
                                                alertas.listaRecientes.map((alerta) => (
                                                    <button
                                                        key={alerta.id}
                                                        onClick={() => handleAlertaClick(alerta)}
                                                        className={`w-full text-left p-6 hover:bg-bg-elevated/50 transition-all flex items-start gap-5 group filter grayscale hover:grayscale-0 active:bg-bg-base ${!alerta.leida ? 'bg-bg-base border-l-4 border-l-text-accent shadow-inner' : 'opacity-60 border-l-4 border-l-transparent'}`}
                                                    >
                                                        <div className={`mt-2 h-2 w-2 shadow-[0_0_8px_currentcolor] transition-all group-hover:scale-150 ${!alerta.leida ? 'bg-text-accent' : 'bg-text-muted opacity-30'}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <p className={`text-[11px] font-black uppercase tracking-[0.2em] truncate group-hover:text-text-primary transition-colors ${!alerta.leida ? 'text-text-primary underline decoration-text-accent/30 decoration-2 underline-offset-4' : 'text-text-muted'}`}>
                                                                    {alerta.titulo}
                                                                </p>
                                                            </div>
                                                            <p className="text-[10px] text-text-muted font-bold line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                                                                {alerta.mensaje}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-4">
                                                                <span className="text-[8px] font-black text-text-muted bg-bg-base px-2 py-1 border border-border-default opacity-50 tabular-nums">
                                                                    TS: {formatDistanceToNow(new Date(alerta.creadoEn), { addSuffix: true, locale: es }).toUpperCase()}
                                                                </span>
                                                                <span className="text-[8px] font-black text-text-accent opacity-0 group-hover:opacity-100 transition-opacity tracking-[0.3em]">READ_TX &rarr;</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-14 text-center bg-bg-base border-y-2 border-border-default/10">
                                                    <p className="text-[11px] text-text-muted uppercase tracking-[0.8em] font-black opacity-30 italic animate-pulse"># NULL_NOTIF_BUFFER</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 bg-bg-base border-t-2 border-border-default/50">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.delete('/alertas/limpiar');
                                                        fetchAlertas();
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                                className="w-full py-4 bg-bg-surface border-2 border-border-default text-[10px] font-black text-text-primary hover:bg-text-accent hover:text-bg-base hover:border-text-accent transition-all uppercase tracking-[0.5em] active:scale-95 shadow-lg group/clear"
                                            >
                                                <span className="group-hover:tracking-[0.8em] transition-all">[ CLEAR_READ_LOGS_TX ]</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Datos de Usuario y Menú Desplegable */}
                        <div className="flex items-center gap-5 text-right border-l-2 border-border-default/40 pl-6 ml-auto" ref={dropdownRef}>
                            <div className="hidden md:flex flex-col justify-center gap-2">
                                <span className="text-sm font-black text-text-primary uppercase tracking-[0.3em]">{user?.nombre || 'USER_IDENT_0x00'}</span>
                                <div className="flex items-center justify-end gap-3">
                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-[0.2em] bg-bg-base px-2 py-1 border border-border-default opacity-60">{user?.rol || 'GUEST_IO'}</span>
                                    <div className="w-2 h-0.5 bg-text-accent opacity-30"></div>
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className={`h-12 w-12 border-2 flex items-center justify-center text-text-primary font-black text-lg flex-shrink-0 transition-all focus:outline-none shadow-xl active:scale-90
                                        ${dropdownOpen 
                                            ? 'bg-text-accent border-text-accent text-bg-base scale-110 ring-4 ring-text-accent/20' 
                                            : 'bg-bg-elevated border-border-default hover:border-text-primary hover:scale-105'
                                        }`}
                                >
                                    {user?.nombre?.[0]?.toUpperCase() || 'U'}
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-56 bg-bg-surface shadow-[0_30px_100px_rgba(0,0,0,0.8)] focus:outline-none z-50 animate-slideUp origin-top-right border-4 border-border-strong divide-y-2 divide-border-default ring-8 ring-black/5">
                                        <div className="px-6 py-5 md:hidden bg-bg-base border-b-2 border-border-default">
                                            <p className="text-xs font-black text-text-primary truncate uppercase tracking-widest">{user?.nombre || 'USER'}</p>
                                            <div className="h-px bg-text-accent mt-3 opacity-20"></div>
                                            <p className="text-[9px] text-text-muted truncate uppercase font-black tracking-[0.3em] mt-3">{user?.rol || 'GUEST'}</p>
                                        </div>
                                        <div className="py-2 bg-bg-surface">
                                            <button
                                                onClick={handleLogout}
                                                className="group flex w-full items-center justify-between px-6 py-4 text-[11px] text-text-primary hover:bg-text-accent hover:text-bg-base transition-all uppercase font-black tracking-[0.4em] active:bg-border-strong"
                                            >
                                                <span># logout_session</span>
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">&lsaquo;QUIT&rsaquo;</span>
                                            </button>
                                        </div>
                                        <div className="px-6 py-3 bg-bg-base opacity-20">
                                            <p className="text-[8px] font-black uppercase tracking-tighter">IO_PORT_STABLE // CRC_OK</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container pt-8 pb-32">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
