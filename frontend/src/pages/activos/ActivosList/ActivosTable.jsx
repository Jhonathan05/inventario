import { Link } from 'react-router-dom';
import { getImageUrl, getAssetIconPath } from '../../../lib/utils';

const AssetIcon = ({ tipo, categoria }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="h-full w-full p-2.5 text-text-muted opacity-40">
        <path strokeLinecap="round" strokeLinejoin="round"
            d={getAssetIconPath(tipo, categoria?.nombre)} />
    </svg>
);

const getStatusBadge = (estado) => {
    switch (estado) {
        case 'DISPONIBLE': return 'border-text-primary text-text-primary bg-bg-base opacity-40 group-hover/row:opacity-100';
        case 'ASIGNADO': return 'border-border-default text-text-primary bg-bg-elevated/50';
        case 'EN_MANTENIMIENTO': return 'border-text-accent text-text-accent bg-text-accent/5 animate-pulse';
        case 'DADO_DE_BAJA': return 'border-border-default text-text-muted opacity-20';
        default: return 'border-border-default text-text-muted';
    }
};

const ActivosTable = ({ activos, canEdit, onEdit, sortBy, sortOrder, onSort }) => {
    const renderSortIcon = (field) => {
        if (sortBy !== field) return <span className="ml-3 text-text-muted opacity-20">↕</span>;
        return sortOrder === 'asc' ? <span className="ml-3 text-text-accent">↑</span> : <span className="ml-3 text-text-accent">↓</span>;
    };

    return (
        <div className="mt-12 hidden md:block font-mono animate-fadeIn">
            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden group hover:border-border-strong transition-all relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest group-hover:opacity-20 transition-opacity">INVENTORY_ARRAY_0xAF</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1100px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th scope="col" className="px-8 py-6 border-r border-border-default/20">
                                    <button onClick={() => onSort('activo')} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort">
                                        # NODE_IDENTITY {renderSortIcon('activo')}
                                    </button>
                                </th>
                                <th scope="col" className="px-8 py-6 border-r border-border-default/20">
                                    <button onClick={() => onSort('categoria')} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort">
                                        / CLASSIFICATION {renderSortIcon('categoria')}
                                    </button>
                                </th>
                                <th scope="col" className="px-8 py-6 border-r border-border-default/20">
                                    <button onClick={() => onSort('estado')} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort">
                                        * LOGICAL_STATE {renderSortIcon('estado')}
                                    </button>
                                </th>
                                <th scope="col" className="px-8 py-6 border-r border-border-default/20">
                                    <button onClick={() => onSort('ubicacion')} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort">
                                        @ GEO_LOC {renderSortIcon('ubicacion')}
                                    </button>
                                </th>
                                <th scope="col" className="px-8 py-6 border-r border-border-default/20">
                                    <button onClick={() => onSort('funcionario')} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort">
                                        $ HOLDER_ASSIGN {renderSortIcon('funcionario')}
                                    </button>
                                </th>
                                {canEdit && <th scope="col" className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-text-muted text-right">_COMMAND_IO</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {activos.map((activo) => (
                                <tr key={activo.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                    <td className="px-8 py-6 border-r border-border-default/10">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 flex-shrink-0 bg-bg-base border-2 border-border-default overflow-hidden group-hover/row:border-border-strong transition-all relative shadow-xl">
                                                {getImageUrl(activo.imagen)
                                                    ? <img className="h-full w-full object-cover group-hover/row:scale-110 transition-transform duration-500" src={getImageUrl(activo.imagen)} alt="" />
                                                    : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/row:opacity-100 transition-opacity"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <Link to={`/activos/${activo.id}`} className="text-[12px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors block truncate max-w-[240px] tabular-nums">
                                                    {activo.marca} {activo.modelo}
                                                </Link>
                                                <div className="text-[9px] text-text-muted font-black mt-2 tracking-[0.2em] opacity-60 uppercase flex gap-4 tabular-nums">
                                                    <span>PLACA: <span className="text-text-primary">[{activo.placa}]</span></span>
                                                    <span>AF: <span className="text-text-primary">[{activo.activoFijo || '----'}]</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 border-r border-border-default/10">
                                        <div className="text-[11px] text-text-primary font-black uppercase tracking-tight tabular-nums group-hover/row:translate-x-1 transition-transform">{activo.categoria?.nombre || 'UNCATEGORIZED'}</div>
                                        <div className="text-[9px] text-text-muted font-black mt-2 tracking-widest opacity-60 tabular-nums">SN: {activo.serial}</div>
                                    </td>
                                    <td className="px-8 py-6 border-r border-border-default/10">
                                        <span className={`inline-flex items-center px-4 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase border-2 shadow-xl transition-all tabular-nums ${getStatusBadge(activo.estado)}`}>
                                            [ {activo.estado?.toUpperCase().replace(/_/g, ' ')} ]
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 border-r border-border-default/10">
                                        <div className="text-[11px] text-text-primary font-black uppercase tracking-tight leading-relaxed tabular-nums opacity-80 group-hover/row:opacity-100 transition-opacity">
                                            {activo.ubicacion || (activo.asignaciones?.[0]?.funcionario?.ubicacion
                                                ? `${activo.asignaciones[0].funcionario.ubicacion}${activo.asignaciones[0].funcionario.piso ? ` - P${activo.asignaciones[0].funcionario.piso}` : ''}`
                                                : <span className="opacity-20 italic">NULL_REGION_DATA</span>)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 border-r border-border-default/10">
                                        <div className="text-[11px] text-text-primary font-black uppercase tracking-tight tabular-nums group-hover/row:translate-x-1 transition-transform">
                                            {activo.asignaciones?.[0]?.funcionario?.nombre?.toUpperCase().replace(/ /g, '_') || <span className="opacity-20 italic">SIN_HOLDER_ASSIGN</span>}
                                        </div>
                                        <div className="text-[8px] text-text-muted font-black mt-2 tracking-widest opacity-40 uppercase">ENTITY: COMMITTEE_TOLIMA</div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-8 py-6 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => onEdit(activo)}
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-muted border-2 border-border-default bg-bg-base px-6 py-3 uppercase tracking-widest hover:text-text-primary hover:border-text-accent transition-all shadow-xl active:scale-95 group/btn"
                                            >
                                                <span className="opacity-40 group-hover/btn:translate-x-1 transition-transform mr-2">→</span>
                                                [ MODIFY_NODE ]
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivosTable;
