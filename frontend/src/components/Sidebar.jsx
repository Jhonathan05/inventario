import { Link, useLocation } from 'react-router-dom';
import { DocumentTextIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, onNavigate }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: '📊', type: 'emoji' },
        { name: 'Activos', href: '/activos', icon: '💻', type: 'emoji' },
        { name: 'Funcionarios', href: '/funcionarios', icon: '👤', type: 'emoji' },
        { name: 'Categorías', href: '/categorias', icon: '🏷️', type: 'emoji' },
        { name: 'Reportes', href: '/reportes', icon: DocumentTextIcon, type: 'component' },
        { name: 'Actas', href: '/actas', icon: ClipboardDocumentCheckIcon, type: 'component' },
        { name: 'Importar Datos', href: '/importar', icon: '📥', type: 'emoji' },
        { name: 'Usuarios', href: '/usuarios', icon: '👥', type: 'emoji' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavClick = () => {
        // Cerrar sidebar automáticamente en mobile al navegar
        if (onNavigate) onNavigate();
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar component */}
            <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
                <div className="flex h-16 items-center justify-center border-b px-4">
                    <h1 className="text-xl font-bold text-indigo-600">Inventario</h1>
                </div>

                <nav className="flex-1 space-y-1 px-2 py-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={handleNavClick}
                            className={`
                group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                ${isActive(item.href)
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
              `}
                        >
                            {/* Render icon based on type */}
                            {item.type === 'component' ? (
                                <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                            ) : (
                                <span className="mr-3 text-xl">{item.icon}</span>
                            )}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="border-t p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user?.nombre?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</p>
                            <p className="truncate text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
