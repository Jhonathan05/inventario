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
            'EN_CURSO': { border: 'border-text-accent text-text-accent shadow-[0_0_10px_rgba(var(--text-accent),0.2)] bg-text-accent/5', label: 'PROCESSING_BUF' },
            'SIN_RESPUESTA': { border: 'border-text-accent text-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.4)] bg-text-accent/10', label: 'IO_WAIT_STATE' },
            'COMPLETADO': { border: 'border-text-primary text-text-primary bg-text-primary/5 opacity-60', label: 'RESOLVED_COMPLETE' }
        };
        const c = config[estado] || config['CREADO'];
        return (
            <span className={`inline-flex items-center px-4 py-1.5 border-2 text-[10px] font-black uppercase tracking-widest ${c.border} shadow-lg transition-all`}>
                <div className={`w-2 h-2 mr-3 ${estado === 'SIN_RESPUESTA' ? 'bg-text-accent animate-ping' : 'bg-current opacity-40'}`}></div>
                [{c.label}]
            </span>
        );
    };

    const getPrioridadBadge = (prioridad) => {
        const config = {
            'BAJA': 'text-text-muted opacity-30',
            'MEDIA': 'text-text-primary opacity-60',
            'ALTA': 'text-text-primary font-black underline decoration-text-accent/40 decoration-4 underline-offset-8 group-hover:text-text-accent transition-all',
            'CRITICA': 'text-text-accent font-black animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.3)] bg-text-accent/5 px-2 py-1 border border-text-accent/20'
        };
        return (
            <span className={`inline-flex text-[10px] uppercase tracking-[0.4em] font-black ${config[prioridad] || config['MEDIA']}`}>
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
            <div className="flex flex-col justify-center items-center h-[500px] font-mono bg-bg-surface border-4 border-border-default mx-4 sm:mx-6 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-sm font-black animate-pulse tracking-[1.5em] group-hover:opacity-30 transition-all italic">SYSTEM_BUSY_IO</div>
                <div className="w-16 h-16 border-8 border-border-default border-t-text-accent animate-spin rounded-full mb-10 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]"></div>
                <div className="text-[14px] font-black text-text-accent animate-pulse uppercase tracking-[0.8em] mb-6">
                    # SYNCING_ITS_TICKETS_STREAM...
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-[0.4em] opacity-40 italic border-l-4 border-border-default/30 pl-6">ESTABLISHING_REMOTE_DB_0x0D_CONNECTION // CRC_CHECK_OK</div>
            </div>
        );
    }

    return (
        <div className="font-mono space-y-12 mb-32 px-4 sm:px-6 lg:px-10 animate-fadeIn border-l-4 border-l-border-default/10">
            {/* Header / ITSM Command Console */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 bg-bg-surface border-4 border-border-default p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-text-accent transition-all duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1.5em] group-hover:opacity-20 group-hover:translate-x-4 transition-all italic">HELPDESK_ITSM_CORE_v4.2</div>
                <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-20"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-8 mb-6">
                         <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)] group-hover:rotate-45 transition-transform"></div>
                         <h1 className="text-4xl font-black uppercase tracking-[0.6em] text-text-primary leading-none flex items-center gap-6">
                            <span className="text-text-accent opacity-20 text-5xl">/</span> helpdesk_itsm
                         </h1>
                    </div>
                    <div className="mt-4 flex items-center gap-8 border-l-4 border-border-default/30 pl-8">
                         <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-60 bg-bg-base px-4 py-1 border border-border-default shadow-inner italic">KERNEL_RX_READY // {tickets.length.toString().padStart(4, '0')} INCIDENTS_BUF</p>
                         <span className="text-border-default h-5 w-[2px] opacity-20"></span>
                         <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic flex items-center gap-4">
                            INCIDENT_FLOW_CONTROL <span className="text-text-accent">//</span> IO_STATE_STABLE
                         </p>
                    </div>
                </div>
                {canEdit && (
                    <button
                        onClick={() => navigate('/tickets/nuevo')}
                        className="bg-text-primary border-4 border-text-primary px-12 py-6 text-[13px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.8em] transition-all shadow-[0_0_60px_rgba(var(--text-primary),0.2)] active:scale-95 group/btn relative overflow-hidden ring-4 ring-inset ring-black/5"
                    >
                        <span className="relative z-10 flex items-center gap-6 group-hover/btn:tracking-[1em] transition-all">
                            <span className="text-xl">+</span> SPAWN_NEW_CASE_PTR
                        </span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>
                )}
            </div>

            {/* Query Filters / Stream Parameters */}
            <div className="bg-bg-surface border-4 border-border-default p-10 flex flex-col lg:flex-row gap-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:opacity-15 transition-opacity">QUERY_STREAM_RX_0x0A</div>
                <div className="flex-1 relative group/search">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted opacity-30 text-[12px] font-black group-focus-within/search:opacity-100 group-focus-within/search:text-text-accent transition-all whitespace-nowrap uppercase tracking-[0.4em] pointer-events-none">
                        STREAM_SCAN &raquo;
                    </div>
                    <input
                        type="text"
                        placeholder="TITLE_UID_OR_ID_NODE_MANIFEST..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-bg-base border-2 border-border-default pl-48 pr-8 py-5 text-[13px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all placeholder:opacity-10 shadow-inner appearance-none focus:shadow-[0_0_40px_rgba(var(--text-accent),0.05)]"
                    />
                </div>
                <div className="w-full lg:w-[400px] relative group/filter">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted opacity-30 text-[12px] font-black group-focus-within/filter:opacity-100 group-focus-within/filter:text-text-accent transition-all whitespace-nowrap uppercase tracking-[0.4em] pointer-events-none">
                        STATUS_BIT ::
                    </div>
                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="w-full bg-bg-base border-2 border-border-default pl-44 pr-12 py-5 text-[13px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner focus:shadow-[0_0_40px_rgba(var(--text-accent),0.05)]"
                    >
                        <option value="">[ ALL_STATUS_MANIFEST ]</option>
                        <option value="COMPLETADO">RESOLVED_ONLY_IO</option>
                        <option value="CREADO">INITIALIZED_ONLY_IO</option>
                        <option value="EN_CURSO">PROCESSING_ONLY_IO</option>
                        <option value="SIN_RESPUESTA">WAITING_IO_PTR_ONLY</option>
                    </select>
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-40 text-text-accent group-hover/filter:scale-125 transition-transform">
                        [&darr;]
                    </div>
                </div>
            </div>

            {/* Data Manifest / Ticket Stream */}
            <div className="bg-bg-surface border-4 border-border-default shadow-[0_50px_150px_rgba(0,0,0,0.7)] overflow-hidden relative group hover:border-border-strong transition-all duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[2em] group-hover:opacity-15 group-hover:translate-x-4 transition-all italic">INCIDENT_MANIFEST_STREAM_BUF_v4</div>
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1300px] border-spacing-0">
                        <thead>
                            <tr className="bg-bg-base border-b-4 border-border-default">
                                <th className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r border-border-default/20 w-36 whitespace-nowrap">:: PTR_IDADDR</th>
                                <th className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r border-border-default/20">:: CASE_DESCRIPTION_LOG_TX</th>
                                <th className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r border-border-default/20 w-80 whitespace-nowrap">:: SOURCE_ENTITY_IDENT</th>
                                <th className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r border-border-default/20 w-56 whitespace-nowrap">:: STATUS_BIT_RX</th>
                                <th className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r border-border-default/20 w-64 whitespace-nowrap">:: ANALYST_PTR_ASSIGN</th>
                                <th className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] w-56 whitespace-nowrap">:: TIMESTAMP_TX</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-border-default/10 bg-bg-surface/20">
                            {ticketsFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-48 text-center bg-bg-base/30">
                                        <div className="inline-block p-14 bg-bg-base border-4 border-dashed border-border-default/20 shadow-inner group/null">
                                            <div className="text-[14px] font-black text-text-muted uppercase tracking-[0.8em] opacity-30 group-hover/null:opacity-100 transition-all duration-700 italic">
                                                ! SYSTEM_NOTICE: NULL_TICKETS_IO_SCAN
                                            </div>
                                            <div className="mt-6 text-[10px] text-text-muted uppercase tracking-[0.5em] opacity-20 italic bg-bg-surface py-2 border border-border-default/30 shadow-inner">NULL_QUERY_RESPONSE_FROM_REMOTE_KERNEL_v4.2</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                ticketsFiltrados.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="hover:bg-bg-elevated/40 cursor-pointer transition-all group border-l-8 border-l-transparent hover:border-l-text-accent active:bg-bg-base/60"
                                    >
                                        <td className="px-10 py-10 border-r border-border-default/10 text-[13px] font-black text-text-accent tabular-nums bg-bg-base/20 group-hover:bg-bg-elevated transition-colors shadow-inner">
                                            0x{ticket.id.toString().padStart(4, '0')}
                                        </td>
                                        <td className="px-10 py-10 border-r border-border-default/10 relative">
                                            <p className="text-[14px] font-black text-text-primary uppercase tracking-[0.1em] group-hover:text-text-accent transition-all group-hover:tracking-[0.2em] truncate max-w-md drop-shadow-sm">
                                                {ticket.titulo.toUpperCase().replace(/ /g, '_')}
                                            </p>
                                            <div className="flex items-center gap-8 mt-4 border-l-2 border-border-default pl-4 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.3em] bg-bg-base border-2 border-border-default/50 px-3 py-1 shadow-inner">{ticket.tipo.toUpperCase().replace(/ /g, '_')}</span>
                                                <span className="text-border-default opacity-30">//</span>
                                                {getPrioridadBadge(ticket.prioridad)}
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 border-r border-border-default/10">
                                            <div className="flex items-center gap-6 group/user">
                                                <div className="h-14 w-14 border-4 border-border-default text-text-primary flex items-center justify-center font-black text-[16px] bg-bg-base shadow-2xl group-hover:border-text-accent transition-all group-hover:shadow-[0_0_20px_rgba(var(--text-accent),0.2)] group-hover:-rotate-6">
                                                    {ticket.funcionario?.nombre?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-black text-text-primary uppercase tracking-[0.2em] truncate max-w-[200px] border-b border-border-default/20 pb-1 italic group-hover:not-italic transition-all">{ticket.funcionario?.nombre.toUpperCase().replace(/ /g, '_')}</p>
                                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] mt-3 opacity-40 tabular-nums bg-bg-base/50 w-fit px-2 border border-border-default/30">UID: 0x{ticket.funcionario?.id?.toString(16).toUpperCase().padStart(4, '0') || 'NULL'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-10 border-r border-border-default/10">
                                            {getEstadoBadge(ticket.estado)}
                                        </td>
                                        <td className="px-10 py-10 border-r border-border-default/10">
                                            {ticket.asignadoA ? (
                                                <div className="flex flex-col gap-3 group/analyst">
                                                    <span className="text-[12px] font-black text-text-primary uppercase tracking-[0.2em] truncate max-w-[200px] group-hover/analyst:text-text-accent transition-colors">/ {ticket.asignadoA.nombre.toUpperCase().replace(/ /g, '_')}</span>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-2 h-0.5 bg-text-accent opacity-30"></div>
                                                        <span className="text-[9px] font-black text-text-accent uppercase tracking-[0.4em] opacity-60">ANALYST_IO_PTR</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4 animate-pulse">
                                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] opacity-20 italic">WAITING_POOL_MEM_TX...</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-10 py-10 text-[12px] text-text-muted uppercase tracking-[0.3em] font-black tabular-nums group-hover:text-text-primary transition-all group-hover:tracking-[0.4em] bg-bg-base/10 shadow-inner italic">
                                            [{new Date(ticket.creadoEn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '_')}]
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Visual Status Line */}
                <div className="p-10 bg-bg-base/50 border-t-4 border-border-default/30 flex flex-col sm:flex-row justify-between items-center gap-10 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.8em] opacity-40 flex items-center gap-6 tabular-nums italic">
                         <div className="w-3 h-3 bg-border-strong rounded-full animate-pulse transition-all"></div>
                         END_OF_MANIFEST_BUFFER_0x0D // PARITY_BIT_v4: PASS_OK
                    </div>
                    <div className="text-[12px] font-black text-text-accent uppercase tracking-[1em] animate-pulse opacity-60 italic bg-bg-surface px-8 py-2 border-2 border-text-accent/20 shadow-[0_0_20px_rgba(var(--text-accent),0.1)]">
                         _LISTENING_FOR_EVENT_POOLS...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketsList;
