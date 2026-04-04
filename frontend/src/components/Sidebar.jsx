import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const navigation = [
        { name: 'Inicio', href: '/', icon: '#', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Activos', href: '/activos', icon: '*', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Funcionarios', href: '/funcionarios', icon: '@', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'HelpDesk', href: '/tickets', icon: '$', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Mantenimientos', href: '/mantenimientos', icon: '!', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Categorías', href: '/categorias', icon: '/', roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Licencias', href: '/licencias', icon: '&', roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Reportes', href: '/reportes', icon: '>', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Actas', href: '/actas', icon: '=', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Importar', href: '/importar', icon: '+', roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Usuarios', href: '/usuarios', icon: '%', roles: ['ADMIN'] },
        { name: 'Backups', href: '/soporte', icon: '^', roles: ['ADMIN'] },
    ];

    return (
        <nav className="nav-bar overflow-x-auto justify-start md:justify-start gap-2 px-4 py-8 bg-bg-surface border-r-4 border-r-border-default h-full shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest vertical-rl h-full">ROOT_SHELL_NAV_0x00</div>
            
            <div className="hidden md:block mb-10 px-4 border-b-2 border-border-default pb-8">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.5)]"></div>
                    <div className="text-text-primary font-black text-xl tracking-[0.3em] uppercase">
                        / core_it
                    </div>
                </div>
                <div className="text-[10px] text-text-muted mt-2 uppercase tracking-[0.4em] font-black opacity-60">FNC_TOLIMA [v1.5.1]</div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 w-full">
                {navigation.filter(item => item.roles.includes(user?.rol)).map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => 
                            `flex items-center gap-5 px-6 py-4 transition-all border-2 group/nav
                            ${isActive 
                                ? 'bg-bg-elevated border-text-accent text-text-accent shadow-[0_0_20px_rgba(var(--text-accent),0.1)]' 
                                : 'bg-transparent border-transparent text-text-muted hover:border-border-default hover:text-text-primary hover:bg-bg-base/30'
                            }`
                        }
                        end={item.href === '/'}
                    >
                        {({ isActive }) => (
                            <>
                                <span className="w-6 h-6 flex items-center justify-center font-black text-[14px] opacity-40 group-hover/nav:opacity-100 transition-opacity">
                                    {item.icon}
                                </span>
                                <span className="md:inline text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap group-hover/nav:translate-x-1 transition-transform">
                                    {item.name.replace(/ /g, '_')}
                                </span>
                                <div className={`ml-auto w-1 h-1 bg-text-accent hidden md:block transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover/nav:opacity-20'}`}></div>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto hidden md:block px-4 pt-10 opacity-30">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted border-t border-border-default pt-6">
                    [ SYSTEM_UPTIME_OK ] <br/>
                    [ IO_LINK_STABLE ]
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
