import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
    Database,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    Lock,
    ExternalLink,
    PlaneTakeoff
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
    { name: 'Usuarios', href: '/usuarios', icon: ShieldCheck, roles: ['ADMIN'] },
    { name: 'Backups', href: '/soporte', icon: Database, roles: ['ADMIN'] },
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

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const filteredNav = navItems.filter(item => item.roles.includes(user?.rol));

    return (
        <div className="min-h-screen flex bg-background overflow-x-hidden">
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:flex flex-col fixed h-screen z-30 bg-surface-container-lowest border-r border-outline-variant shadow-ambient overflow-hidden"
            >
                {/* Header Sidebar */}
                <div className="p-4 flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer bg-surface-container-low hover:bg-surface-container-high transition-colors shrink-0"
                    >
                        <Menu size={20} className="text-on-surface" />
                    </button>
                    
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer bg-surface-container-low hover:bg-surface-container-high transition-colors shrink-0"
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="overflow-hidden"
                            >
                                <h1 className="text-sm font-bold whitespace-nowrap font-headline text-on-surface">
                                    Inventario TIC
                                </h1>
                                <p className="text-[10px] whitespace-nowrap text-on-surface-variant font-medium">
                                    FNC Tolima
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {filteredNav.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => `
                                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}
                            `}
                        >
                            <item.icon size={20} className="shrink-0" />
                            <AnimatePresence mode="wait">
                                {sidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {!sidebarOpen && (
                                <span className="pointer-events-none absolute left-full ml-4 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface shadow-float z-50">
                                    {item.name}
                                </span>
                            )}
                        </NavLink>
                    ))}

                    {/* Link Externo a Viáticos */}
                    <a
                        href="/viaticos"
                        target="_blank"
                        className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-secondary/5 transition-all mt-4 border border-dashed border-secondary/30"
                    >
                        <PlaneTakeoff size={20} className="shrink-0" />
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center gap-2 whitespace-nowrap"
                                >
                                    Sistema Viáticos
                                    <ExternalLink size={12} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {!sidebarOpen && (
                            <span className="pointer-events-none absolute left-full ml-4 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-on-secondary shadow-float z-50">
                                Sistema Viáticos
                            </span>
                        )}
                    </a>
                </nav>

                {/* User Card */}
                <div className="p-3">
                    <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {sidebarOpen ? (
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                            {user?.nombre?.[0]}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold truncate text-on-surface">{user?.nombre}</p>
                                            <p className="text-[10px] text-on-surface-variant truncate">{ROLE_LABELS[user?.rol]}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button className="flex items-center justify-center gap-2 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-[10px] font-bold text-on-surface-variant transition-colors">
                                            <Lock size={12} />
                                            Clave
                                        </button>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 text-[10px] font-bold text-primary transition-colors"
                                        >
                                            <LogOut size={12} />
                                            Salir
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4 py-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {user?.nombre?.[0]}
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-on-surface-variant hover:text-primary transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 glass border-b border-outline-variant/30 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-low"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-sm font-bold font-headline">Inventario TIC</h1>
                </div>
                <button onClick={toggleTheme} className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-low">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface-container-lowest p-4 flex flex-col shadow-float"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-lg font-bold font-headline text-on-surface">Inventario TIC</h1>
                                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low">
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {filteredNav.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                                            ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'}
                                        `}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="mt-auto p-4 rounded-2xl bg-surface-container-low">
                                <p className="text-sm font-bold text-on-surface">{user?.nombre}</p>
                                <p className="text-xs text-on-surface-variant mb-4">{ROLE_LABELS[user?.rol]}</p>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Desktop */}
            <motion.main
                initial={false}
                animate={{ marginLeft: sidebarOpen ? 280 : 80 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex-1 min-h-screen hidden lg:block"
            >
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </motion.main>

            {/* Mobile Content */}
            <main className="lg:hidden flex-1 mt-14 p-4 min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default ClientLayout;
