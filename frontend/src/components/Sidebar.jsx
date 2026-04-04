import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const navigation = [
        { name: 'Inicio',        short: 'INICIO',  href: '/',              icon: '#', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Activos',       short: 'ACTIVOS', href: '/activos',        icon: '*', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Funcionarios',  short: 'FUNC.',   href: '/funcionarios',   icon: '@', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'HelpDesk',      short: 'HELP',    href: '/tickets',        icon: '$', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Mantenimientos',short: 'MANT.',   href: '/mantenimientos', icon: '!', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Categorías',    short: 'CAT.',    href: '/categorias',     icon: '/', roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Licencias',     short: 'LIC.',    href: '/licencias',      icon: '&', roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Reportes',      short: 'REP.',    href: '/reportes',       icon: '>', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Actas',         short: 'ACTAS',   href: '/actas',          icon: '=', roles: ['ADMIN', 'ANALISTA_TIC', 'CONSULTA'] },
        { name: 'Importar',      short: 'IMP.',    href: '/importar',       icon: '+', roles: ['ADMIN', 'ANALISTA_TIC'] },
        { name: 'Usuarios',      short: 'USER',    href: '/usuarios',       icon: '%', roles: ['ADMIN'] },
        { name: 'Backups',       short: 'BCK.',    href: '/soporte',        icon: '^', roles: ['ADMIN'] },
    ];

    const filtered = navigation.filter(item => item.roles.includes(user?.rol));

    return (
        <nav className="nav-bar overflow-x-auto md:overflow-y-auto md:overflow-x-hidden bg-bg-surface md:border-r-2 border-r-border-default shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest hidden md:block">ROOT_SHELL_NAV_0x00</div>

            {/* Logo — visible solo en desktop */}
            <div className="hidden md:block mb-6 px-3 md:px-4 border-b border-border-default pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2.5 h-2.5 bg-text-accent animate-pulse"></div>
                    <div className="text-text-primary font-black text-base md:text-lg tracking-[0.3em] uppercase">
                        / core_it
                    </div>
                </div>
                <div className="text-[10px] text-text-muted mt-1 uppercase tracking-[0.4em] font-black opacity-60">FNC_TOLIMA [v1.5.1]</div>
            </div>

            {/* Nav items */}
            <div className="flex flex-row md:flex-col gap-0 md:gap-1 w-full md:w-auto">
                {filtered.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `nav-item group/nav border-2 md:border
                            ${isActive
                                ? 'text-text-primary bg-bg-elevated border-text-accent border-b-text-accent md:border-text-accent'
                                : 'border-transparent text-text-muted hover:border-border-default hover:text-text-primary hover:bg-bg-base/30'
                            }`
                        }
                        end={item.href === '/'}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Ícono — siempre visible */}
                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center font-black text-[13px] opacity-60 group-hover/nav:opacity-100 transition-opacity">
                                    {item.icon}
                                </span>

                                {/* Texto abreviado en tablet / completo en desktop */}
                                <span className="hidden sm:inline md:hidden text-[10px] font-black uppercase tracking-wide whitespace-nowrap">
                                    {item.short}
                                </span>
                                <span className="hidden md:inline text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap group-hover/nav:translate-x-0.5 transition-transform">
                                    {item.name.replace(/ /g, '_')}
                                </span>

                                {/* Indicador activo en desktop */}
                                <div className={`ml-auto w-1 h-1 bg-text-accent hidden md:block transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover/nav:opacity-20'}`}></div>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Footer — solo desktop */}
            <div className="mt-auto hidden md:block px-3 md:px-4 pt-8 opacity-30">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted border-t border-border-default pt-4">
                    [ SYSTEM_UPTIME_OK ] <br/>
                    [ IO_LINK_STABLE ]
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
