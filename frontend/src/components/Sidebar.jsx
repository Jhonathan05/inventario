import { Link, useLocation } from 'react-router-dom';
import { DocumentTextIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, onNavigate }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: '📊', type: 'emoji', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Activos', href: '/activos', icon: '💻', type: 'emoji', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Funcionarios', href: '/funcionarios', icon: '👤', type: 'emoji', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Mantenimientos', href: '/mantenimientos', icon: '🔧', type: 'emoji', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Categorías', href: '/categorias', icon: '🏷️', type: 'emoji', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Mesa de Ayuda', href: '/tickets', icon: '🎫', type: 'emoji', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Reportes', href: '/reportes', icon: DocumentTextIcon, type: 'component', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Actas', href: '/actas', icon: ClipboardDocumentCheckIcon, type: 'component', roles: ['ADMIN', 'TECNICO', 'CONSULTA'] },
        { name: 'Importar Datos', href: '/importar', icon: '📥', type: 'emoji', roles: ['ADMIN', 'TECNICO'] },
        { name: 'Usuarios', href: '/usuarios', icon: '👥', type: 'emoji', roles: ['ADMIN'] },
        { name: 'Respaldos', href: '/soporte', icon: '💾', type: 'emoji', roles: ['ADMIN'] },
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavClick = () => {
        if (onNavigate) onNavigate();
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-charcoal-900 bg-opacity-60 z-20 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 flex flex-col
            `}>
                {/* Logo / Brand */}
                <div className="flex flex-col items-center justify-center border-b border-fnc-100 px-4 py-4 bg-gradient-to-b from-fnc-600 to-fnc-700">
                    <h1 className="text-base font-bold text-white leading-tight text-center tracking-wide">Inventario TIC</h1>
                    <p className="text-xs text-fnc-200 text-center leading-tight mt-0.5 font-medium">FNC Tolima</p>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto space-y-0.5 px-2 py-3">
                    {navigation.filter(item => item.roles.includes(user?.rol)).map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={handleNavClick}
                            className={`
                                group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150
                                ${isActive(item.href)
                                    ? 'bg-fnc-600 text-white shadow-sm'
                                    : 'text-charcoal-700 hover:bg-fnc-50 hover:text-fnc-700'
                                }
                            `}
                        >
                            {item.type === 'component' ? (
                                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-fnc-200' : 'text-charcoal-400 group-hover:text-fnc-600'}`} aria-hidden="true" />
                            ) : (
                                <span className="mr-3 text-lg leading-none">{item.icon}</span>
                            )}
                            <span>{item.name}</span>
                            {isActive(item.href) && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-fnc-300" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User section */}
                <div className="border-t border-gray-100 p-4 bg-charcoal-50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-fnc-100 flex items-center justify-center text-fnc-700 font-bold text-sm flex-shrink-0">
                            {user?.nombre?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-semibold text-charcoal-800">{user?.nombre || 'Usuario'}</p>
                            <p className="truncate text-xs text-charcoal-400">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center justify-center rounded-md border border-fnc-200 bg-white px-4 py-2 text-sm font-medium text-fnc-700 hover:bg-fnc-50 hover:border-fnc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-fnc-500 focus:ring-offset-2"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
