import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    ComputerDesktopIcon,
    UserGroupIcon,
    WrenchScrewdriverIcon,
    TagIcon,
    TicketIcon,
    DocumentTextIcon,
    ClipboardDocumentCheckIcon,
    ArrowDownTrayIcon,
    UsersIcon,
    CircleStackIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const navigation = [
        { name: 'Inicio', href: '/', icon: HomeIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Activos', href: '/activos', icon: ComputerDesktopIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Funcionarios', href: '/funcionarios', icon: UserGroupIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'HelpDesk', href: '/tickets', icon: TicketIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Mantenimientos', href: '/mantenimientos', icon: WrenchScrewdriverIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Categorías', href: '/categorias', icon: TagIcon, roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Reportes', href: '/reportes', icon: DocumentTextIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Actas', href: '/actas', icon: ClipboardDocumentCheckIcon, roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Importar', href: '/importar', icon: ArrowDownTrayIcon, roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Usuarios', href: '/usuarios', icon: UsersIcon, roles: ['ADMIN'] },
        { name: 'Backups', href: '/soporte', icon: CircleStackIcon, roles: ['ADMIN'] },
    ];

    return (
        <nav className="nav-bar overflow-x-auto justify-start md:justify-start gap-2 md:gap-1 px-2">
            <div className="hidden md:block mb-8 text-center w-full">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fnc-700 to-fnc-500 leading-tight">
                    Inventario TIC
                </h1>
                <p className="text-xs text-charcoal-400 font-medium mt-1">FNC Tolima</p>
            </div>

            {navigation.filter(item => item.roles.includes(user?.rol)).map((item) => (
                <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `nav-item flex-shrink-0 ${isActive ? 'active' : ''}`}
                    end={item.href === '/'}
                >
                    <item.icon className="h-6 w-6 md:h-5 md:w-5 mb-1 md:mb-0 mix-blend-multiply flex-shrink-0" />
                    <span className="md:inline text-[10px] md:text-sm text-center md:text-left mt-0.5 md:mt-0 font-medium whitespace-nowrap md:whitespace-normal">{item.name}</span>
                </NavLink>
            ))}

            <div className="hidden md:block mt-auto w-full"></div>
        </nav>
    );
};

export default Sidebar;
