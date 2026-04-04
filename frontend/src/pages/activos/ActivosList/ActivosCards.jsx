import { Link } from 'react-router-dom';
import { getImageUrl, getAssetIconPath } from '../../../lib/utils';

const AssetIcon = ({ tipo, categoria }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="h-full w-full p-2.5 text-text-muted opacity-40 group-hover:scale-110 transition-transform">
        <path strokeLinecap="round" strokeLinejoin="round"
            d={getAssetIconPath(tipo, categoria?.nombre)} />
    </svg>
);

const getStatusBadge = (estado) => {
    switch (estado) {
        case 'DISPONIBLE': return 'border-text-primary text-text-primary bg-bg-base opacity-40 group-hover:opacity-100';
        case 'ASIGNADO': return 'border-border-default text-text-primary bg-bg-elevated/50';
        case 'EN_MANTENIMIENTO': return 'border-text-accent text-text-accent bg-text-accent/5 animate-pulse';
        case 'DADO_DE_BAJA': return 'border-border-default text-text-muted opacity-20';
        default: return 'border-border-default text-text-muted';
    }
};

const ActivosCards = ({ activos, canEdit, onEdit }) => (
    <div className="mt-10 md:hidden space-y-10 font-mono animate-fadeIn">
        {activos.length === 0 && (
            <div className="py-24 text-center text-text-muted bg-bg-surface border-2 border-border-default uppercase tracking-[0.5em] text-[11px] font-black italic shadow-3xl">
                <div className="inline-block p-10 border border-dashed border-border-default/30 shadow-inner">
                     ! NO_RECORDS_ALLOCATED_IN_BUFFER
                </div>
            </div>
        )}
        {activos.map((activo) => (
            <div key={activo.id} className="bg-bg-surface p-8 border-2 border-border-default hover:border-border-strong transition-all group overflow-hidden relative shadow-3xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest group-hover:opacity-20 transition-opacity">NODE_RX_{String(activo.id).slice(0,8).toUpperCase()}</div>
                <div className="flex flex-col sm:flex-row items-start gap-8">
                    <div className="h-20 w-20 flex-shrink-0 bg-bg-base border-2 border-border-default overflow-hidden group-hover:border-border-strong transition-all relative shadow-xl">
                        {getImageUrl(activo.imagen)
                            ? <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" src={getImageUrl(activo.imagen)} alt="" />
                            : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                        <Link to={`/activos/${activo.id}`} className="font-black text-text-primary hover:text-text-accent block truncate transition-colors text-lg tracking-tighter uppercase mb-4 tabular-nums">
                            {activo.marca} {activo.modelo}
                        </Link>
                        <div className="text-[10px] text-text-muted font-black select-all uppercase tracking-widest mb-6 flex flex-wrap gap-x-6 gap-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span>PLACA: <span className="text-text-primary">[{activo.placa}]</span></span>
                            <span>SN: <span className="text-text-primary">[{activo.serial}]</span></span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 text-[9px] font-black tracking-widest uppercase border-2 transition-all shadow-md tabular-nums ${getStatusBadge(activo.estado)}`}>
                                [ {activo.estado?.toUpperCase().replace(/_/g, ' ')} ]
                            </span>
                            {activo.categoria?.nombre && (
                                <span className="text-[9px] font-black text-text-muted border-2 border-border-default uppercase tracking-widest px-3 py-1 opacity-60 shadow-md">
                                    / {activo.categoria.nombre.replace(/ /g, '_')}
                                </span>
                            )}
                        </div>
                        {activo.asignaciones?.[0]?.funcionario?.nombre && (
                            <div className="text-[10px] text-text-primary font-black mt-8 flex flex-col gap-3 bg-bg-base p-6 border-2 border-border-default shadow-inner relative overflow-hidden group/holder hover:border-text-accent/30 transition-colors">
                                <div className="absolute top-0 right-0 p-2 opacity-5 text-[8px] font-black uppercase tracking-tighter">HOLDER_ASSIGN</div>
                                <span className="shrink-0 text-text-muted opacity-40 text-[9px] tracking-[0.4em]">:: SYSTEM_HOLDER_RANK</span>
                                <span className="truncate uppercase tracking-tight text-[11px] tabular-nums group-hover/holder:text-text-accent transition-colors">{activo.asignaciones[0].funcionario.nombre.toUpperCase().replace(/ /g, '_')}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-10 pt-8 border-t-2 border-border-default/50">
                    {canEdit && (
                        <button 
                            onClick={() => onEdit(activo)} 
                            className="text-[11px] text-text-muted font-black border-2 border-border-default bg-bg-base px-6 py-3 hover:text-text-primary hover:border-text-accent transition-all shadow-xl active:scale-90 uppercase tracking-widest"
                        >
                            [ MODIFY_NODE ]
                        </button>
                    )}
                    <Link 
                        to={`/activos/${activo.id}`} 
                        className="text-[11px] text-text-muted font-black hover:text-text-primary transition-all ml-auto flex items-center gap-4 uppercase tracking-[0.3em] active:scale-95 group/access"
                    >
                        ACCESS_NODE_CHEST <span className="group-hover/access:translate-x-2 transition-transform text-text-accent">&rarr;</span>
                    </Link>
                </div>
            </div>
        ))}
    </div>
);

export default ActivosCards;
