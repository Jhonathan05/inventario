import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ticketsService } from '../../api/tickets.service';
import { useAuth } from '../../context/AuthContext';

const TicketsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const { data: tickets = [], isLoading: loading } = useQuery({
        queryKey: ['tickets', { estado: estadoFiltro }],
        queryFn: () => ticketsService.getAll(estadoFiltro ? { estado: estadoFiltro } : {}),
    });

    const getEstadoBadge = (estado) => {
        const config = {
            'CREADO': { border: 'border-border-default text-text-muted opacity-40', label: 'INITIALIZED' },
            'EN_CURSO': { border: 'border-text-accent text-text-accent bg-text-accent/5', label: 'PROCESSING_BUF' },
            'SIN_RESPUESTA': { border: 'border-text-accent text-text-accent animate-pulse bg-text-accent/10 shadow-[0_0_20px_rgba(var(--text-accent),0.2)]', label: 'IO_WAIT_STATE' },
            'COMPLETADO': { border: 'border-text-primary text-text-primary bg-text-primary/5 opacity-60', label: 'RESOLVED_COMPLETE' }
        };
        const c = config[estado] || config['CREADO'];
        return (
            <span className={`inline-flex items-center px-6 py-2 border-4 text-[11px] font-black uppercase tracking-[0.3em] ${c.border} shadow-2xl transition-all`}>
                <div className={`w-3 h-3 mr-4 ${estado === 'SIN_RESPUESTA' ? 'bg-text-accent animate-ping' : 'bg-current opacity-40'}`}></div>
                [{c.label}]
            </span>
        );
    };

    const getPrioridadBadge = (prioridad) => {
        const config = {
            'BAJA': 'text-text-muted opacity-30',
            'MEDIA': 'text-text-primary opacity-60',
            'ALTA': 'text-text-primary font-black underline decoration-text-accent/60 decoration-8 underline-offset-[12px] group-hover:text-text-accent transition-all',
            'CRITICA': 'text-text-accent font-black animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.4)] bg-text-accent/5 px-4 py-2 border-2 border-text-accent/40'
        };
        return (
            <span className={`inline-flex text-[11px] uppercase tracking-[0.5em] font-black ${config[prioridad] || config['MEDIA']}`}>
                ::{prioridad}_PRIORITY
            </span>
        );
    };

    const ticketsFiltrados = tickets.filter(t => {
        const term = searchTerm.toLowerCase();
        return (
            t.titulo?.toLowerCase().includes(term) ||
            t.funcionario?.nombre?.toLowerCase().includes(term) ||
            String(t.id).includes(term)
        );
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[600px] font-mono bg-bg-surface border-8 border-border-default mx-10 shadow-[0_60px_180px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-15 pointer-events-none text-2xl font-black animate-pulse tracking-[2.5em] group-hover:opacity-40 transition-all italic">SYSTEM_BUSY_IO_BUF</div>
                <div className="w-24 h-24 border-[12px] border-border-default border-t-text-accent animate-spin rounded-full mb-14 shadow-[0_0_60px_rgba(var(--text-accent),0.3)]"></div>
                <div className="text-[18px] font-black text-text-accent animate-pulse uppercase tracking-[1.2em] mb-10">
                    # SYNCING_ITS_TICKETS_STREAM_RX...
                </div>
                <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.6em] opacity-40 italic border-l-8 border-border-default pl-10 bg-bg-base/30 py-4 shadow-inner">ESTABLISHING_LINK_DB_0x0D_PORT_ACTIVE // CORE_BUF_READY</p>
            </div>
        );
    }

    return (
        <div className="font-mono space-y-16 mb-48 px-10 animate-fadeIn selection:bg-text-accent selection:text-bg-base">
            {/* Header / ITSM Command Console RX */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 bg-bg-surface border-8 border-border-default p-16 shadow-[0_80px_160px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-text-accent/30 transition-all duration-1000">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[2.5em] group-hover:opacity-25 group-hover:translate-x-12 transition-all italic italic">HELPDESK_ITSM_CORE_v4.2</div>
                <div className="absolute bottom-0 left-0 w-full h-[12px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-30 shadow-[0_0_50px_rgba(var(--text-accent),0.4)]"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-10 mb-10">
                         <div className="w-8 h-8 bg-text-accent animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.8)] group-hover:rotate-[225deg] transition-all duration-1000 border-4 border-bg-surface"></div>
                         <h1 className="text-5xl font-black uppercase tracking-[0.8em] text-text-primary leading-none flex items-center gap-8">
                            <span className="text-text-accent opacity-30 text-6xl font-normal">/</span> ITSM_HUB_IO
                         </h1>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-12 border-l-8 border-text-accent/20 pl-12 bg-bg-base/20 py-4 shadow-inner">
                         <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.5em] opacity-80 bg-bg-base px-6 py-2 border-2 border-border-default shadow-xl italic">KERNEL_RX_ACTIVE // {tickets.length.toString().padStart(4, '0')} INCIDENTS_POOL</p>
                         <span className="text-border-default h-6 w-1 opacity-20 hidden md:block"></span>
                         <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 italic flex items-center gap-6">
                            SIGNAL: INCIDENT_MGMT_STAMP <span className="text-text-accent font-black animate-pulse">::</span> 0xFD42_SYNCED
                         </p>
                    </div>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/tickets/nuevo')}
                        className="bg-text-primary border-8 border-text-primary px-16 py-8 text-[14px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[1em] transition-all shadow-[0_40px_100px_rgba(0,0,0,0.6)] active:scale-90 group/btn relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-8 group-hover/btn:tracking-[1.4em] transition-all duration-700 italic group-hover:not-italic">
                            <span className="text-2xl font-normal">+</span> SPAWN_NEW_CASE_PTR
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-[-10px] left-0 w-full h-8 bg-black/20 group-hover:bg-white/5 transition-colors"></div>
                    </button>
                )}
            </div>

            {/* Query Filters / Parameter Matrix */}
            <div className="bg-bg-surface border-8 border-border-default p-14 flex flex-col lg:flex-row gap-14 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-text-accent/10 transition-all duration-700">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[2em] group-hover:opacity-20 transition-all italic italic">QUERY_SCAN_MATRIX_RX</div>
                <div className="flex-1 relative group/search">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-text-accent opacity-20 text-[13px] font-black group-focus-within/search:opacity-100 transition-all whitespace-nowrap uppercase tracking-[0.6em] pointer-events-none italic">
                        STREAM_SCAN &raquo;
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH_MANIFEST_BY_TITLE_UID_NODE..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-bg-base border-4 border-border-default pl-56 pr-12 py-8 text-[14px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all placeholder:opacity-10 shadow-[inset_0_5px_30px_rgba(0,0,0,0.5)] appearance-none group-hover:border-border-strong"
                    />
                </div>
                <div className="w-full lg:w-[500px] relative group/filter">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-text-accent opacity-20 text-[13px] font-black group-focus-within/filter:opacity-100 transition-all whitespace-nowrap uppercase tracking-[0.6em] pointer-events-none italic">
                        STATUS_BIT ::
                    </div>
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="w-full bg-bg-base border-4 border-border-default pl-52 pr-16 py-8 text-[14px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-[inset_0_5px_30px_rgba(0,0,0,0.5)] group-hover:border-border-strong"
                    >
                        <option value="" className="italic">[ ALL_INCIDENTS_STREAM ]</option>
                        <option value="COMPLETADO">0xRESOLVED_NODES_ONLY</option>
                        <option value="CREADO">0xINITIALIZED_NODES_ONLY</option>
                        <option value="EN_CURSO">0xPROCESSING_NODES_ONLY</option>
                        <option value="SIN_RESPUESTA">0xWAITING_IO_PTR_ONLY</option>
                    </select>
                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none opacity-40 text-text-accent group-hover/filter:scale-150 transition-transform font-black">
                        &raquo;
                    </div>
                </div>
            </div>

            {/* Data Manifest / Incident Stream RX */}
            <div className="bg-bg-surface border-8 border-border-default shadow-[0_80px_200px_rgba(0,0,0,0.9)] overflow-hidden relative group/stream hover:border-text-accent/10 transition-all duration-1000">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[3em] group-hover/stream:opacity-20 group-hover/stream:translate-x-16 transition-all italic italic">INCIDENT_MANIFEST_STREAM_BUF_v4</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1500px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base/90 backdrop-blur-md border-b-8 border-border-default shadow-2xl relative z-20">
                                <th className="px-12 py-10 text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-r-4 border-border-default/20 w-48 whitespace-nowrap shadow-inner bg-bg-base/50">:: PTR_IDADDR</th>
                                <th className="px-12 py-10 text-[12px] font-black text-text-accent uppercase tracking-[0.6em] border-r-4 border-border-default/20 shadow-inner italic bg-bg-base/30">:: CASE_DESCRIPTION_MANIFEST_TX</th>
                                <th className="px-12 py-10 text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-r-4 border-border-default/20 w-[450px] whitespace-nowrap shadow-inner">:: REQ_SOURCE_ENTITY_IDENT</th>
                                <th className="px-12 py-10 text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-r-4 border-border-default/20 w-72 whitespace-nowrap shadow-inner bg-bg-base/10 text-center">:: STATUS_BIT_RX</th>
                                <th className="px-12 py-10 text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-r-4 border-border-default/20 w-80 whitespace-nowrap shadow-inner">:: ANALYST_PTR_ALLOC</th>
                                <th className="px-12 py-10 text-[12px] font-black text-text-muted uppercase tracking-[0.6em] w-64 whitespace-nowrap shadow-inner bg-bg-base/20">:: TIMESTAMP_INIT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-4 divide-border-default/10 bg-bg-base/10 group/tbody">
                            {ticketsFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-12 py-64 text-center bg-bg-base/20 relative">
                                         <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(var(--text-accent),0.05)_0%,transparent_70%)] animate-pulse"></div>
                                        <div className="inline-block p-20 bg-bg-surface border-8 border-dashed border-border-default shadow-[0_60px_150px_rgba(0,0,0,0.8)] group/null relative z-10 hover:border-text-accent/30 transition-all duration-1000">
                                            <div className="text-[20px] font-black text-text-muted uppercase tracking-[1.2em] opacity-20 group-hover/null:opacity-100 group-hover/null:text-text-accent transition-all duration-1000 italic group-hover:scale-110">
                                                ! CRITICAL_NOTICE: NULL_IO_STREAM_RX
                                            </div>
                                            <div className="mt-10 text-[11px] text-text-muted uppercase tracking-[0.8em] opacity-10 italic bg-bg-base py-4 border-2 border-border-default shadow-inner px-10 group-hover:opacity-40 transition-opacity">BUFFER_EMPTY_REMOTE_KERNEL_v4.2 // CRC_0x0000</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                ticketsFiltrados.map((ticket, idx) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="hover:bg-text-accent/5 cursor-pointer transition-all group border-l-[12px] border-l-transparent hover:border-l-text-accent active:bg-bg-base/80 relative"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <td className="px-12 py-12 border-r-4 border-border-default/10 text-[14px] font-black text-text-accent tabular-nums bg-bg-base/30 group-hover:bg-bg-elevated transition-all shadow-inner group-hover:scale-105 group-hover:z-30 relative italic">
                                            <span className="opacity-20 mr-2 font-normal not-italic">&gt;</span>
                                            0x{ticket.id.toString().padStart(4, '0')}
                                        </td>
                                        <td className="px-12 py-12 border-r-4 border-border-default/10 relative group-hover:bg-bg-base/10 transition-colors">
                                            <div className="flex flex-col gap-4">
                                                <p className="text-[16px] font-black text-text-primary uppercase tracking-[0.2em] group-hover:text-text-accent transition-all group-hover:tracking-[0.3em] truncate max-w-lg drop-shadow-md">
                                                    {ticket.titulo.toUpperCase().replace(/ /g, '_')}
                                                </p>
                                                <div className="flex items-center gap-10 border-l-4 border-text-accent/20 pl-6 italic opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em] bg-bg-base border-2 border-border-default px-4 py-1.5 shadow-xl group-hover:border-text-accent/40 transition-all">{ticket.tipo.toUpperCase().replace(/ /g, '_')}</span>
                                                    <span className="text-text-accent font-black opacity-20">&bull;</span>
                                                    {getPrioridadBadge(ticket.prioridad)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 border-r-4 border-border-default/10 group-hover:bg-bg-base/5 transition-colors">
                                            <div className="flex items-center gap-8 group/user">
                                                <div className="h-20 w-20 border-8 border-border-default text-text-primary flex items-center justify-center font-black text-[24px] bg-bg-base shadow-[0_20px_60px_rgba(0,0,0,0.6)] group-hover:border-text-accent transition-all group-hover:shadow-[0_0_40px_rgba(var(--text-accent),0.3)] group-hover:-rotate-12 group-hover:scale-110 duration-700">
                                                    {ticket.funcionario?.nombre?.charAt(0).toUpperCase() || '&Sigma;'}
                                                </div>
                                                <div className="min-w-0 space-y-4">
                                                    <p className="text-[14px] font-black text-text-primary uppercase tracking-[0.3em] truncate max-w-[280px] border-b-2 border-border-default/20 pb-2 italic group-hover:not-italic transition-all group-hover:text-text-accent">{ticket.funcionario?.nombre.toUpperCase().replace(/ /g, '_')}</p>
                                                    <div className="flex items-center gap-4">
                                                         <div className="h-4 w-1 bg-text-accent opacity-20"></div>
                                                         <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.5em] opacity-40 tabular-nums bg-bg-base/80 w-fit px-3 border-2 border-border-default/30 shadow-inner italic">UID: 0x{ticket.funcionario?.id?.toString(16).toUpperCase().padStart(4, '0') || 'NULL_RX'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-12 border-r-4 border-border-default/10 text-center group-hover:bg-bg-elevated/20 transition-colors">
                                            {getEstadoBadge(ticket.estado)}
                                        </td>
                                        <td className="px-12 py-12 border-r-4 border-border-default/10 group-hover:bg-bg-base/10 transition-colors">
                                            {ticket.asignadoA ? (
                                                <div className="flex flex-col gap-4 group/analyst">
                                                    <div className="flex items-center gap-4 bg-bg-base/40 p-4 border-2 border-border-default group-hover/analyst:border-text-accent/30 transition-all shadow-inner">
                                                         <div className="w-2 h-2 bg-text-accent opacity-20 group-hover/analyst:opacity-100 group-hover/analyst:animate-pulse"></div>
                                                         <span className="text-[13px] font-black text-text-primary uppercase tracking-[0.3em] truncate max-w-[220px] group-hover/analyst:translate-x-2 transition-transform italic italic">/ {ticket.asignadoA.nombre.toUpperCase().replace(/ /g, '_')}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-text-accent uppercase tracking-[0.6em] opacity-50 pl-10 italic">ALLOC_ANALYST_IO</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-4 p-4 border-4 border-dashed border-border-default/20 opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.6em] italic animate-pulse"># WAITING_ALLOC_TX...</span>
                                                    <div className="h-1 w-full bg-border-default/20 relative overflow-hidden">
                                                         <div className="absolute inset-0 bg-text-accent/20 animate-loadingBarSlow"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-12 py-12 text-[14px] text-text-muted uppercase tracking-[0.4em] font-black tabular-nums group-hover:text-text-primary transition-all group-hover:tracking-[0.6em] bg-bg-base/20 shadow-inner italic border-l-4 border-border-default/10">
                                            [{new Date(ticket.creadoEn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '_')}]
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Visual Stream Metadata Footer RX */}
                <div className="p-16 bg-bg-base/80 border-t-8 border-border-default/30 flex flex-col md:flex-row justify-between items-center gap-12 group-hover/stream:bg-bg-base/95 transition-all duration-1000 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--text-accent),0.05)_0%,transparent_80%)] opacity-0 group-hover/stream:opacity-100 transition-opacity"></div>
                    <div className="text-[11px] font-black text-text-muted uppercase tracking-[1.2em] opacity-40 flex items-center gap-10 tabular-nums italic transition-all group-hover/stream:opacity-80 group-hover/stream:translate-x-10">
                         <div className="w-4 h-4 bg-border-strong rounded-full animate-ping shadow-[0_0_20px_rgba(0,0,0,0.5)]"></div>
                         END_OF_MANIFEST_STREAM_BUF_0x0D // PARITY_BIT_v4.2: PASS_RX_OK
                    </div>
                    <div className="text-[14px] font-black text-text-accent uppercase tracking-[1.2em] animate-pulse opacity-40 italic bg-bg-surface px-12 py-4 border-4 border-text-accent/10 shadow-[0_20px_60px_rgba(var(--text-accent),0.1)] group-hover/stream:opacity-100 group-hover/stream:-translate-x-10 transition-all duration-700">
                         _LISTENING_FOR_REMOTE_EVENT_POOLS...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketsList;
