import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Monitor, 
    Users, 
    Ticket, 
    Wrench, 
    Tag, 
    Key, 
    FileText, 
    ClipboardCheck, 
    Download, 
    ShieldCheck, 
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';

const navItems = [
    { name: 'Inicio', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'Activos', href: '/activos', icon: Monitor, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'Funcionarios', href: '/funcionarios', icon: Users, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'HelpDesk', href: '/tickets', icon: Ticket, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'Mantenimientos', href: '/mantenimientos', icon: Wrench, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'Categorías', href: '/categorias', icon: Tag, roles: ['ADMIN', 'ANALISTA_TIC'] },
    { name: 'Licencias', href: '/licencias', icon: Key, roles: ['ADMIN', 'ANALISTA_TIC'] },
    { name: 'Reportes', href: '/reportes', icon: FileText, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'Actas', href: '/actas', icon: ClipboardCheck, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
    { name: 'Importar', href: '/importar', icon: Download, roles: ['ADMIN', 'ANALISTA_TIC'] },
    { name: 'Administración', href: '/administracion', icon: ShieldCheck, roles: ['ADMIN'] },
];

const ROLE_LABELS = {
    'ADMIN': 'Administrador',
    'ANALISTA_TIC': 'Analista TIC',
    'CONSULTA': 'Consulta'
};

const ClientLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        return () => clearTimeout(timer);
    }, [sidebarOpen]);

    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/login');
    }, [logout, navigate]);

    const filteredNav = navItems.filter(item => item.roles.includes(user?.rol));

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 72 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="hidden lg:flex flex-col fixed h-screen z-30"
                style={{
                    background: 'var(--surface-container-lowest)',
                    boxShadow: 'var(--shadow-ambient)',
                    borderRight: '1px solid var(--outline-variant)'
                }}
            >
                {/* Header / Sidebar Toggle */}
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                        style={{ background: 'var(--surface-container-low)' }}
                    >
                        <Menu size={18} style={{ color: 'var(--on-surface)' }} />
                    </button>
                    
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <h1 className="text-sm font-bold whitespace-nowrap" style={{ fontFamily: 'var(--font-headline)', color: 'var(--on-surface)' }}>
                                    Inventario TIC
                                </h1>
                                <p className="text-[10px] whitespace-nowrap font-medium" style={{ color: 'var(--on-surface-variant)' }}>
                                    FNC Tolima
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                    {filteredNav.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline"
                                style={{
                                    background: isActive ? 'rgba(141, 16, 36, 0.08)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
                                }}
                            >
                                <item.icon size={20} className="shrink-0" />
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {!sidebarOpen && (
                                    <span
                                        className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        style={{
                                            background: 'var(--inverse-surface)',
                                            color: 'var(--inverse-on-surface)',
                                            boxShadow: 'var(--shadow-float)',
                                            zIndex: 100,
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Card / Logout Section */}
                <div className="p-3">
                    <div
                        className="p-3 rounded-xl border border-outline-variant/10 transition-all duration-300"
                        style={{ background: 'var(--surface-container-low)' }}
                    >
                        <AnimatePresence>
                            {sidebarOpen ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-3"
                                >
                                    <div>
                                        <p className="text-sm font-bold truncate" style={{ color: 'var(--on-surface)' }}>
                                            {user?.nombre}
                                        </p>
                                        <p className="text-[10px] font-medium truncate uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>
                                            {ROLE_LABELS[user?.rol] || 'Usuario'}
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1 pt-2 border-t border-outline-variant/10">
                                        <button className="w-full text-[11px] py-1.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-high transition-colors font-bold flex items-center justify-center gap-2" style={{ color: 'var(--on-surface-variant)' }}>
                                            <Lock size={12} /> Cambiar clave
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-[11px] py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                                            style={{ background: 'var(--surface-container)', color: '#dc2626' }}
                                        >
                                            <LogOut size={12} /> Cerrar sesión
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="py-1 flex flex-col gap-4 items-center">
                                    <button onClick={handleLogout} className="group relative text-red-600">
                                        <LogOut size={18} />
                                        <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white shadow-float z-50">
                                            Cerrar sesión
                                        </span>
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 glass border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMobileMenuOpen(true)} className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: 'var(--surface-container-low)' }}>
                        <Menu size={18} style={{ color: 'var(--on-surface)' }} />
                    </button>
                    <h1 className="text-sm font-bold truncate text-on-surface">Inventario TIC</h1>
                </div>
                <ThemeToggle />
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                        <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] p-4 flex flex-col bg-surface-container-lowest">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-sm font-bold text-on-surface">Inventario TIC</h1>
                                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container-low">
                                    <X size={16} />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-1 overflow-y-auto">
                                {filteredNav.map((item) => (
                                    <NavLink key={item.href} to={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all" style={{ background: location.pathname === item.href ? 'rgba(141, 16, 36, 0.08)' : 'transparent', color: location.pathname === item.href ? 'var(--primary)' : 'var(--on-surface-variant)' }}>
                                        <item.icon size={20} /> <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="p-3 rounded-2xl bg-surface-container-low mt-4 flex flex-col gap-4">
                                <div>
                                    <p className="text-sm font-bold truncate text-on-surface">{user?.nombre}</p>
                                    <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{ROLE_LABELS[user?.rol]}</p>
                                </div>
                                <button onClick={handleLogout} className="py-2 rounded-xl bg-red-600 text-white text-xs font-bold w-full">Cerrar sesión</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <motion.main
                initial={false}
                animate={{ marginLeft: sidebarOpen ? 280 : 72 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1 min-h-screen w-full flex flex-col"
            >
                {/* Desktop Topbar */}
                <header className="sticky top-0 z-20 h-14 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 hidden lg:flex items-center justify-between px-8">
                    <h2 className="text-sm font-bold text-on-surface">
                        {filteredNav.find(item => location.pathname === item.href)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-on-surface-variant px-3 py-1 bg-surface-container-low rounded-full">
                            FNC Tolima • {user?.nombre}
                        </span>
                        <ThemeToggle />
                    </div>
                </header>

                <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex-1">
                    {children}
                </div>
            </motion.main>
        </div>
    );
};

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
};

export default ClientLayout;
