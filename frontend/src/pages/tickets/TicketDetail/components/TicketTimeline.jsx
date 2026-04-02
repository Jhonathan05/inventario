import { AdjuntoChip } from './AdjuntoChip';

const getTrazaSymbol = (tipo) => {
    switch (tipo) {
        case 'CREACION': return '[#]';
        case 'CAMBIO_ESTADO': return '[!]';
        case 'ASIGNACION': return '[@]';
        default: return '[&]';
    }
};

export const TicketTimeline = ({ ticket, handleDownload, user }) => {
    return (
        <div className="bg-bg-surface border border-border-default p-10 font-mono flex-1 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">LOG_STREAM_RX</div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-10 border-b border-border-default pb-4">
                / DETAILED_EVENT_TRAILS
            </h2>

            <div className="relative border-l-2 border-border-default/20 ml-6 space-y-12 max-h-[700px] overflow-y-auto pr-8 pb-10 print:max-h-none print:overflow-visible custom-scrollbar scroll-smooth">
                {ticket.trazas?.length === 0 && (
                    <div className="pl-12 py-10 opacity-30">
                        <p className="text-[11px] text-text-muted italic uppercase tracking-[0.4em] font-black">! NO_EVENT_LOGS_DETECTED_IN_STREAM</p>
                    </div>
                )}
                {ticket.trazas?.map((traza, i) => (
                    <div key={i} className="relative pl-12 print-section group/item animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="absolute -left-[11px] top-1 bg-bg-surface border-2 border-border-default text-[10px] font-black w-5 h-5 flex items-center justify-center no-print group-hover/item:border-text-accent group-hover/item:text-text-accent transition-all shadow-xl">
                            {getTrazaSymbol(traza.tipoTraza)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-4">
                            <span className="font-black text-[11px] text-text-primary uppercase tracking-[0.3em] bg-bg-base/50 px-3 py-1 border border-border-default/30 shadow-sm">{traza.creadoPor?.nombre?.toUpperCase().replace(/ /g, '_') || 'SYSTEM_CORE'}</span>
                            <time className="text-[10px] text-text-muted font-black opacity-60 tabular-nums">
                                [{new Date(traza.creadoEn).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase().replace(/ /g, '_')}]
                            </time>
                        </div>
                        <div className={`text-[12px] uppercase tracking-tighter sm:tracking-tight leading-relaxed font-black ${traza.tipoTraza === 'COMENTARIO' ? 'bg-bg-base/40 p-6 border-2 border-border-default border-dashed text-text-primary group-hover/item:border-border-strong transition-all shadow-inner' : 'text-text-muted opacity-80 italic'}`}>
                            {traza.comentario.replace(/ /g, '_')}
                        </div>
                        {traza.tipoTraza === 'CAMBIO_ESTADO' && traza.estadoAnterior && (
                            <div className="mt-5 flex items-center gap-4 text-[10px] font-black tracking-widest border border-border-default shadow-xl w-fit px-5 py-2 bg-bg-base transition-transform hover:scale-105">
                                <span className="text-text-muted opacity-40">{traza.estadoAnterior.toUpperCase()}</span>
                                <span className="text-text-accent opacity-30">--&gt;</span>
                                <span className="text-text-accent">{traza.estadoNuevo.toUpperCase()}</span>
                            </div>
                        )}
                        {/* Adjuntos de la traza */}
                        {traza.adjuntos && traza.adjuntos.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-4 no-print animate-slideUp">
                                {traza.adjuntos.map(doc => (
                                    <AdjuntoChip key={doc.id} doc={doc} onDownload={handleDownload} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* High-Fidelity Signature Protocol - Solo Impresión */}
            <div className="hidden print:flex signature-area mt-24 pt-12 border-t-2 border-dashed border-black justify-between">
                <div className="w-[45%] text-center group/sig">
                    <div className="h-40 flex items-end justify-center mb-4">
                         <div className="w-full border-t-2 border-black"></div>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em]">RESPONSIBLE_ANALYST_SIG_RX</p>
                    <p className="text-[12px] text-black font-black mt-3 tracking-widest">{ticket.asignadoA?.nombre?.toUpperCase() || user?.nombre?.toUpperCase()}</p>
                    <p className="text-[9px] text-gray-400 font-bold mt-1">ID_NODE: ANALYST_VERIFIED</p>
                </div>
                <div className="w-[45%] text-center group/sig">
                    <div className="h-40 flex items-end justify-center mb-4">
                         <div className="w-full border-t-2 border-black"></div>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em]">USER_SATISFACTION_SIG_TX</p>
                    <p className="text-[12px] text-black font-black mt-3 tracking-widest">{ticket.funcionario?.nombre?.toUpperCase()}</p>
                    <p className="text-[9px] text-gray-400 font-bold mt-1">ID_NODE: REQUESTER_VERIFIED</p>
                </div>
            </div>
            
            <div className="mt-8 text-[9px] font-black text-text-muted uppercase tracking-[0.4em] opacity-10">
                 STREAM_END // DATA_FRAGMENT_SYNC: PASS
            </div>
        </div>
    );
};
