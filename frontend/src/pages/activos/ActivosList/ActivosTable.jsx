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
        case 'DISPONIBLE': return 'border-text-primary text-text-primary bg-bg-base opacity-40 group-hover/row:opacity-100 shadow-inner group-hover:border-text-accent transition-all';
        case 'ASIGNADO': return 'border-border-default text-text-primary bg-bg-elevated/80 shadow-md group-hover:border-text-primary transition-all';
        case 'EN_MANTENIMIENTO': return 'border-text-accent text-text-accent bg-text-accent/5 animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.2)]';
        case 'DADO_DE_BAJA': return 'border-border-default/40 text-text-muted opacity-20 bg-bg-surface grayscale scale-95 transition-all';
        default: return 'border-border-default text-text-muted';
    }
};

const ActivosTable = ({ activos, canEdit, onEdit, sortBy, sortOrder, onSort }) => {
    const renderSortIcon = (field) => {
        if (sortBy !== field) return <span className="ml-4 text-text-muted opacity-10">↕</span>;
        return sortOrder === 'asc' 
            ? <span className="ml-4 text-text-accent animate-bounce">0&uarr;</span> 
            : <span className="ml-4 text-text-accent animate-bounce">0&darr;</span>;
    };

    return (
        <div className="mt-16 hidden md:block font-mono animate-fadeIn mb-20">
            <div className="bg-bg-surface border-4 border-border-default shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden group hover:border-text-accent transition-all duration-500 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-[2em] group-hover:opacity-20 transition-all italic">INVENTORY_ARRAY_v4_AF22</div>
                
                <div className="overflow-x-auto custom-scrollbar bg-bg-base/20 shadow-inner">
                    <table className="w-full text-left border-collapse min-w-[1200px] border-spacing-0">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-bg-base/95 backdrop-blur-md shadow-2xl border-b-4 border-border-default">
                                <th scope="col" className="px-10 py-8 border-r-2 border-border-default/20 bg-bg-surface/30">
                                    <button onClick={() => onSort('activo')} className="text-[11px] font-black uppercase tracking-[0.5em] text-text-accent hover:text-text-primary transition-all flex items-center group/sort drop-shadow-sm">
                                        <span className="text-text-accent opacity-40 mr-4">#</span> NODE_IDENTITY {renderSortIcon('activo')}
                                    </button>
                                </th>
                                <th scope="col" className="px-10 py-8 border-r-2 border-border-default/20">
                                    <button onClick={() => onSort('categoria')} className="text-[11px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort drop-shadow-sm">
                                        <span className="text-text-accent opacity-40 mr-4">/</span> CLASSIFICATION {renderSortIcon('categoria')}
                                    </button>
                                </th>
                                <th scope="col" className="px-10 py-8 border-r-2 border-border-default/20">
                                    <button onClick={() => onSort('estado')} className="text-[11px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort drop-shadow-sm">
                                        <span className="text-text-accent opacity-40 mr-4">*</span> LOGICAL_STATE {renderSortIcon('estado')}
                                    </button>
                                </th>
                                <th scope="col" className="px-10 py-8 border-r-2 border-border-default/20">
                                    <button onClick={() => onSort('ubicacion')} className="text-[11px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort drop-shadow-sm">
                                        <span className="text-text-accent opacity-40 mr-4">@</span> GEO_LOC {renderSortIcon('ubicacion')}
                                    </button>
                                </th>
                                <th scope="col" className="px-10 py-8 border-r-2 border-border-default/20">
                                    <button onClick={() => onSort('funcionario')} className="text-[11px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-text-primary transition-all flex items-center group/sort drop-shadow-sm">
                                        <span className="text-text-accent opacity-40 mr-4">$</span> HOLDER_ASSIGN {renderSortIcon('funcionario')}
                                    </button>
                                </th>
                                {canEdit && <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.6em] text-text-muted text-right shadow-inner bg-bg-surface/50">_IO_CMD</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-border-default/10">
                            {activos.map((activo) => (
                                <tr key={activo.id} className="hover:bg-text-accent/5 transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default relative overflow-hidden group">
                                    <td className="px-10 py-8 border-r-2 border-border-default/10 bg-bg-surface/10 group-hover:bg-bg-elevated/40 transition-colors">
                                        <div className="flex items-center gap-8 group/info relative z-10">
                                            <div className="h-20 w-20 flex-shrink-0 bg-bg-base border-4 border-border-default overflow-hidden group-hover/row:border-text-accent transition-all duration-500 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover/row:scale-110 active:scale-95">
                                                {getImageUrl(activo.imagen)
                                                    ? <img className="h-full w-full object-cover group-hover/row:scale-125 transition-transform duration-1000" src={getImageUrl(activo.imagen)} alt="" />
                                                    : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                                                <div className="absolute inset-0 bg-text-accent/10 opacity-0 group-hover/row:opacity-100 transition-opacity"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <Link to={`/activos/${activo.id}`} className="text-[15px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent group-hover/row:tracking-widest transition-all block truncate max-w-[280px] tabular-nums drop-shadow-lg">
                                                    {activo.marca} <span className="opacity-40 italic font-medium">{activo.modelo}</span>
                                                </Link>
                                                <div className="text-[10px] text-text-muted font-black mt-3 tracking-[0.3em] opacity-40 uppercase flex flex-wrap gap-6 tabular-nums group-hover/row:opacity-100 transition-opacity italic">
                                                    <span className="bg-bg-base px-2 py-0.5 border border-border-default/40">PLACA: <span className="text-text-primary not-italic">[{activo.placa}]</span></span>
                                                    <span className="bg-bg-base px-2 py-0.5 border border-border-default/40">AF: <span className="text-text-primary not-italic">[{activo.activoFijo || '----'}]</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Subtle scanline on hover */}
                                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 bg-gradient-to-r from-transparent via-text-accent to-transparent -translate-x-full group-hover:animate-loadingBar"></div>
                                    </td>
                                    <td className="px-10 py-8 border-r-2 border-border-default/10">
                                        <div className="text-[13px] text-text-primary font-black uppercase tracking-widest tabular-nums group-hover/row:translate-x-2 transition-transform drop-shadow-sm italic group-hover:not-italic">{activo.categoria?.nombre || 'UNCATEGORIZED_0x0'}</div>
                                        <div className="text-[10px] text-text-muted font-black mt-3 tracking-[0.4em] opacity-40 tabular-nums uppercase">SN: <span className="text-text-primary/70">{activo.serial}</span></div>
                                    </td>
                                    <td className="px-10 py-8 border-r-2 border-border-default/10">
                                        <div className="flex flex-col gap-4">
                                            <span className={`inline-flex items-center justify-center px-6 py-2.5 text-[10px] font-black tracking-[0.4em] uppercase border-4 shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-all tabular-nums scale-100 group-hover/row:scale-105 ${getStatusBadge(activo.estado)}`}>
                                                [ {activo.estado?.toUpperCase().replace(/_/g, ' ')} ]
                                            </span>
                                            {activo.estado === 'EN_MANTENIMIENTO' && (
                                                <div className="text-[8px] text-text-accent font-black uppercase tracking-widest text-center animate-pulse"># CORE_LOCK_ACTIVE</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 border-r-2 border-border-default/10">
                                        <div className="text-[12px] text-text-primary font-black uppercase tracking-widest leading-relaxed tabular-nums opacity-60 group-hover/row:opacity-100 transition-all group-hover/row:translate-x-2 drop-shadow-sm flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-1.5 h-1.5 bg-text-accent/30"></div>
                                                 {activo.ubicacion || (activo.asignaciones?.[0]?.funcionario?.ubicacion
                                                    ? `${activo.asignaciones[0].funcionario.ubicacion}${activo.asignaciones[0].funcionario.piso ? ` - P${activo.asignaciones[0].funcionario.piso}` : ''}`
                                                    : <span className="opacity-10 italic tracking-normal">NULL_GEO_BUFFER</span>)}
                                            </div>
                                            <div className="text-[8px] opacity-40 uppercase tracking-[0.4em] italic pl-[18px]">LOC_COORD_TX_v4</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 border-r-2 border-border-default/10">
                                        <div className="flex flex-col gap-3 group-hover/row:translate-x-2 transition-transform">
                                            <div className="text-[13px] text-text-primary font-black uppercase tracking-widest tabular-nums drop-shadow-sm">
                                                {activo.asignaciones?.[0]?.funcionario?.nombre?.toUpperCase().replace(/ /g, '_') || <span className="opacity-10 italic tracking-[0.2em]">0x0_NO_HOLDER</span>}
                                            </div>
                                            <div className="text-[9px] text-text-muted font-black tracking-[0.3em] opacity-40 uppercase italic flex items-center gap-3">
                                                <div className="w-4 h-[1px] bg-border-default"></div>
                                                ENTITY: COMMIT_TOL_v4
                                            </div>
                                        </div>
                                    </td>
                                    {canEdit && (
                                        <td className="px-10 py-8 text-right whitespace-nowrap bg-bg-surface/20 group-hover:bg-bg-elevated/40 transition-colors">
                                            <button
                                                onClick={() => onEdit(activo)}
                                                className="inline-flex items-center justify-center text-[11px] font-black text-text-muted border-4 border-border-default bg-bg-base px-8 py-4 uppercase tracking-widest hover:text-text-primary hover:border-text-accent transition-all shadow-[0_10px_25px_rgba(0,0,0,0.4)] active:scale-90 group/btn relative overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-4">
                                                    <span className="opacity-40 group-hover/btn:translate-x-2 transition-transform">→</span>
                                                    [ MODIFY_IO ]
                                                </span>
                                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Visual parity Footer detail */}
                <div className="bg-bg-base px-10 py-5 border-t-4 border-border-default border-opacity-30 flex justify-between items-center opacity-30 shadow-inner group-hover:opacity-100 transition-opacity italic">
                     <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.8em]">MANIFEST_ARRAY_RENDERED_TX_v4.2</span>
                     <span className="text-[9px] font-black text-text-accent uppercase tracking-[0.5em] animate-pulse"># CHECK_PARITY_0x88_OK</span>
                </div>
            </div>
        </div>
    );
};

export default ActivosTable;
