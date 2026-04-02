import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const ESTADOS = ['CREADO', 'EN_PROCESO', 'SUSPENDIDO', 'FINALIZADO', 'CERRADO'];
const TIPOS = ['MANTENIMIENTO', 'REPARACION', 'SUMINISTRO', 'INSPECCION', 'ACTUALIZACION'];

const MantenimientosList = () => {
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(t);
    }, [search]);

    const queryParams = {
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterEstado && { estado: filterEstado }),
        ...(filterTipo && { tipo: filterTipo }),
    };

    const { data: registros = [], isLoading: loading } = useQuery({
        queryKey: ['mantenimientos', queryParams],
        queryFn: () => api.get('/hojavida', { params: queryParams }).then(r => r.data),
    });

    const { data: allRegistros = [] } = useQuery({
        queryKey: ['mantenimientos', 'all'],
        queryFn: () => api.get('/hojavida').then(r => r.data),
        staleTime: 1000 * 60 * 5,
    });

    const counts = ESTADOS.reduce((acc, e) => {
        acc[e] = allRegistros.filter(r => r.estado === e).length;
        return acc;
    }, {});

    const cardConfig = [
        { label: 'STA_CREATED', estado: 'CREADO', icon: '[O]' },
        { label: 'STA_PROCESS', estado: 'EN_PROCESO', icon: '[*]' },
        { label: 'STA_SUSPEND', estado: 'SUSPENDIDO', icon: '[!]' },
        { label: 'STA_FINISH', estado: 'FINALIZADO', icon: '[V]' },
    ];

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Header / Maintenance Archive Command Center */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">MNT_LOG_RX_STREAM_0x902</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                             <div className="w-2.5 h-2.5 bg-text-accent animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">
                                 / maintenance_cycle_logs_hub
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-60">KERNEL_LIFECYCLE_TRACKING_ACTIVE</p>
                            </div>
                            <span className="text-border-default/30 h-5 w-[2px] bg-border-default/30"></span>
                            <p className="text-[11px] text-text-primary font-black uppercase tracking-widest bg-bg-base px-3 py-1 border border-border-default/50 tabular-nums">
                                {registros.length.toString().padStart(4, '0')}_NODES_INTERCEPTED
                            </p>
                        </div>
                    </div>
                </div>
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-text-accent/20">
                     <div className="h-full bg-text-accent w-1/5 animate-loadingBarSlow"></div>
                </div>
            </div>

            {/* Summary KPI Cards / Block Status Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {cardConfig.map(c => (
                    <button
                        key={c.label}
                        onClick={() => setFilterEstado(prev => prev === c.estado ? '' : c.estado)}
                        className={`group relative flex flex-col p-10 border-2 transition-all transition-duration-500 shadow-3xl overflow-hidden active:scale-95 ${filterEstado === c.estado 
                            ? 'bg-bg-elevated border-text-accent shadow-[0_10px_30px_rgba(var(--text-accent),0.15)] ring-2 ring-text-accent ring-inset' 
                            : 'bg-bg-surface border-border-default hover:border-border-strong shadow-sm'}`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter group-hover:opacity-20">NODE_STATUS_BLOCK: {c.estado}</div>
                        <div className="flex items-center justify-between mb-8">
                            <span className={`text-4xl font-black transition-all ${filterEstado === c.estado ? 'text-text-accent' : 'text-text-muted opacity-30 group-hover:opacity-100 group-hover:text-text-primary'}`}>{c.icon}</span>
                            <div className="text-right">
                                <span className={`text-4xl font-black tabular-nums transition-all ${filterEstado === c.estado ? 'text-text-primary' : 'text-text-muted opacity-20 group-hover:opacity-100'}`}>
                                    [{(counts[c.estado] || 0).toString().padStart(2, '0')}]
                                </span>
                                <p className={`text-[9px] font-black mt-2 uppercase tracking-widest ${filterEstado === c.estado ? 'text-text-accent' : 'text-text-muted opacity-40'}`}>CNT_VAL_RX</p>
                            </div>
                        </div>
                        <div className={`h-[2px] w-full transition-all duration-500 mb-6 ${filterEstado === c.estado ? 'bg-text-accent' : 'bg-border-default opacity-20'}`}></div>
                        <p className={`text-[12px] font-black uppercase tracking-[0.5em] ${filterEstado === c.estado ? 'text-text-accent' : 'text-text-muted group-hover:text-text-primary'}`}>{c.label}</p>
                        {filterEstado === c.estado && (
                            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-text-accent animate-pulse"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Query Filter / Data Buffer Selector */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-widest">QUERY_MNT_PARAMS_RX_0xFD</div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="relative flex-1 group/search">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted opacity-30 text-[11px] font-black group-focus-within/search:opacity-100 group-focus-within/search:text-text-accent transition-all whitespace-nowrap">SCAN_DUMP &raquo;</div>
                        <input
                            type="text"
                            placeholder="FILTER_BUFFER_BY_PLATE_DESCRIPTION_TX_UID..."
                            className="block w-full bg-bg-base border-2 border-border-default py-5 pl-32 pr-8 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-8 items-center">
                        <div className="relative group/select min-w-[240px]">
                            <select
                                value={filterEstado}
                                onChange={e => setFilterEstado(e.target.value)}
                                className="w-full bg-bg-base border-2 border-border-default px-8 py-5 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="" className="text-text-muted opacity-40">:: ALL_STATUS_NODES</option>
                                {ESTADOS.map(e => <option key={e} value={e} className="bg-bg-surface">{e.replace('_', ' ')}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-40 text-[9px] font-black group-hover:text-text-accent transition-colors">&darr;</div>
                        </div>

                        <div className="relative group/select min-w-[240px]">
                            <select
                                value={filterTipo}
                                onChange={e => setFilterTipo(e.target.value)}
                                className="w-full bg-bg-base border-2 border-border-default px-8 py-5 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="" className="text-text-muted opacity-40">:: ALL_SERVICE_TYPES</option>
                                {TIPOS.map(t => <option key={t} value={t} className="bg-bg-surface">{t.toUpperCase()}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-40 text-[9px] font-black group-hover:text-text-accent transition-colors">&darr;</div>
                        </div>

                        {(search || filterEstado || filterTipo) && (
                            <button
                                onClick={() => { setSearch(''); setFilterEstado(''); setFilterTipo(''); }}
                                className="bg-bg-base border-2 border-text-accent px-10 py-5 text-[12px] font-black text-text-accent hover:bg-text-accent hover:text-bg-base uppercase tracking-[0.5em] transition-all shadow-xl active:scale-95 group/clear relative overflow-hidden"
                            >
                                <span className="relative z-10">[ NULLIFY_BUFFER_TX ]</span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/clear:opacity-100 transition-opacity"></div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Data Manifest / Transactional Archive Table */}
            <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden relative group/table hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1.5em] group-hover/table:text-text-accent transition-colors">LOG_ARRAY_STREAM_RX_INDEX_MANIFEST</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1300px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b-2 border-border-default">
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ASSET_NODE_SPEC</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: SERVICE_TYPE</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: OP_STATUS_FLAG</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: DESCRIPTION_HOOK</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ASSIG_ANALYST</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: EXT_UID_LINK</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: TIMESTAMP_RX</th>
                                <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_COMMAND_IO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-10 py-32 text-center">
                                         <div className="text-[15px] font-black text-text-accent animate-pulse uppercase tracking-[1.5em]"># SYNCING_MAINTENANCE_STREAM_BUFFER...</div>
                                         <div className="mt-8 text-[10px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic">RETRIEVING_HOJA_VIDA_FRAGMENTS // PARITY_RX: OK</div>
                                    </td>
                                </tr>
                            ) : registros.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-10 py-32 text-center">
                                        <div className="inline-block p-16 bg-bg-base border-2 border-dashed border-border-default/30 shadow-inner">
                                            <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 italic">
                                                ! NO_ENTRIES_MATCHED_IN_CURRENT_BUFFER_NAMESPACE_TX
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                registros.map(reg => (
                                    <tr key={reg.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <Link to={`/activos/${reg.activo?.id}`} className="block">
                                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors tabular-nums">
                                                    {reg.activo?.marca.toUpperCase().replace(/ /g, '_')} {reg.activo?.modelo.toUpperCase().replace(/ /g, '_')}
                                                </p>
                                                <div className="text-[10px] text-text-muted font-black mt-2 tracking-[0.3em] opacity-40 tabular-nums">NODE_ADDR: [ {reg.activo?.placa} ]</div>
                                            </Link>
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <span className="inline-flex items-center border-2 border-border-default bg-bg-base px-6 py-2 text-[10px] font-black uppercase tracking-widest text-text-primary group-hover/row:border-text-accent transition-all shadow-md">
                                                /{reg.tipo}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <span className={`inline-flex items-center border-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all tabular-nums
                                                ${reg.estado === 'FINALIZADO' || reg.estado === 'CERRADO' ? 'text-text-primary border-border-default opacity-60 bg-bg-base' : 
                                                  reg.estado === 'SUSPENDIDO' ? 'text-text-accent border-text-accent animate-pulse bg-text-accent/5' : 
                                                  'text-text-muted border-border-default opacity-40 bg-bg-base'}`}>
                                                [{reg.estado?.toUpperCase().replace(/_/g, '_')}]
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10 max-w-[280px]">
                                            <p className="text-[12px] font-black text-text-primary uppercase tracking-tight truncate opacity-80 group-hover/row:opacity-100" title={reg.descripcion}>{reg.descripcion.replace(/ /g, '_')}</p>
                                            {reg.diagnostico && (
                                                <div className="flex items-center gap-3 mt-3 opacity-40 group-hover/row:opacity-60 transition-opacity">
                                                     <div className="text-[8px] font-black bg-bg-base border border-border-default px-2 py-0.5">DX_BUF</div>
                                                     <p className="text-[10px] font-bold tracking-widest truncate tabular-nums italic" title={reg.diagnostico}>{reg.diagnostico.replace(/ /g, '_')}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10 text-[11px] text-text-primary font-black uppercase tracking-tight truncate max-w-[180px] opacity-60 group-hover/row:opacity-100 transition-opacity tabular-nums">
                                            {reg.responsable?.nombre?.toUpperCase().replace(/ /g, '_') || <span className="opacity-20 italic">NULL_ANALYST_TX</span>}
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10 text-[11px] text-text-primary font-black tracking-[0.3em] uppercase tabular-nums">
                                            {reg.casoAranda ? `#AR_0x${parseInt(reg.casoAranda).toString(16).toUpperCase()}` : '----_----'}
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10 text-[11px] text-text-muted font-black tracking-widest uppercase tabular-nums opacity-60">
                                            [{new Date(reg.fecha).toLocaleDateString().toUpperCase().replace(/\//g, '_')}]
                                        </td>
                                        <td className="px-10 py-8 text-right whitespace-nowrap">
                                            <Link
                                                to={`/activos/${reg.activo?.id}`}
                                                className="inline-flex items-center justify-center text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent border-2 border-border-default bg-bg-base px-8 py-4 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/btn-view"
                                            >
                                                <span className="opacity-40 group-hover/btn-view:text-text-accent group-hover/btn-view:translate-x-2 transition-all mr-4">→</span>
                                                [ VIEW_NODE_H_V ]
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Archive Footer Stream Identifier */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-10 p-12 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-6">
                     <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                     MAINT_LOG_SYNC_STABLE // VERSION: 0xFD.01 // BUFFER: TX_RD
                </div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic group-hover:text-text-primary transition-colors">
                     COLOMBIA_IT_SERVICE_HISTORY_MANIFEST // BUFFER_CRC: PASS_CORE
                </div>
            </div>
        </div>
    );
};

export default MantenimientosList;
