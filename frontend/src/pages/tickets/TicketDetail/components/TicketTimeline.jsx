import { AdjuntoChip } from './AdjuntoChip';

const getTrazaSymbol = (tipo) => {
    switch (tipo) {
        case 'CREACION': return '&alpha;';
        case 'CAMBIO_ESTADO': return '&psi;';
        case 'ASIGNACION': return '&beta;';
        case 'COMENTARIO': return '&gamma;';
        default: return '&sigma;';
    }
};

export const TicketTimeline = ({ ticket, handleDownload, user }) => {
    return (
        <div className="bg-bg-surface border-2 border-border-default p-3 sm:p-4 font-mono flex-1 shadow-lg relative overflow-hidden group/timeline hover:border-text-accent/20 transition-all duration-1000 flex flex-col h-full min-h-[300px] sm:min-h-[400px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-[1em] group-hover/timeline:opacity-20 transition-all italic hidden sm:block">LOG_STREAM</div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-3 border-b-2 border-border-default pb-3 mb-4 sm:mb-6">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-xs bg-bg-base shadow-lg italic flex-shrink-0">&sigma;</div>
                <h2 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-text-primary italic opacity-80 leading-none">
                     EVENT_TRAILS_STREAM
                </h2>
            </div>

            <div className="relative border-l-2 sm:border-l-4 border-border-default/20 ml-3 sm:ml-6 space-y-6 sm:space-y-8 flex-1 overflow-y-auto pr-2 sm:pr-4 pb-4 sm:pb-8 print:overflow-visible scroll-smooth">
                {ticket.trazas?.length === 0 && (
                    <div className="pl-8 sm:pl-16 py-8 sm:py-16 opacity-30 animate-pulse">
                        <p className="text-[12px] sm:text-[14px] text-text-muted italic uppercase tracking-[0.5em] sm:tracking-[0.8em] font-black">! NULL_EVENT_LOGS</p>
                    </div>
                )}
                {ticket.trazas?.map((traza, i) => (
                    <div key={i} className="relative pl-8 sm:pl-16 group/item animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                        <div 
                            className="absolute -left-[14px] sm:-left-[20px] top-6 bg-bg-surface border-2 border-border-default text-[10px] sm:text-[11px] font-black w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center no-print group-hover/item:border-text-accent group-hover/item:text-text-accent transition-all bg-bg-base italic"
                            dangerouslySetInnerHTML={{ __html: getTrazaSymbol(traza.tipoTraza) }}
                        />
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2 border-b border-border-default/10 pb-2">
                            <div className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 bg-text-accent/40 animate-pulse"></div>
                                 <span className="font-black text-[11px] text-text-primary uppercase tracking-[0.2em] bg-bg-base/80 px-2 py-0.5 border border-border-default shadow-md italic group-hover/item:text-text-accent group-hover/item:not-italic transition-all">{traza.creadoPor?.nombre?.toUpperCase().replace(/ /g, '_') || 'SYSTEM_LOG'}</span>
                            </div>
                            <time className="text-[10px] text-text-muted font-black opacity-40 tabular-nums italic tracking-wider bg-bg-base px-2 py-0.5 border border-border-default/20">
                                [{new Date(traza.creadoEn).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase().replace(/ /g, '_')}]
                            </time>
                        </div>

                        <div className={`text-[11px] sm:text-[12px] uppercase tracking-wide leading-relaxed font-black transition-all duration-700 ${traza.tipoTraza === 'COMENTARIO' ? 'bg-bg-base/40 p-3 sm:p-4 border-2 border-border-default border-dashed text-text-primary italic' : 'text-text-muted opacity-80 italic'}`}>
                            {traza.comentario.replace(/ /g, '_')}
                        </div>

                        {traza.tipoTraza === 'CAMBIO_ESTADO' && traza.estadoAnterior && (
                            <div className="mt-3 sm:mt-4 flex items-center gap-3 text-[9px] sm:text-[10px] font-black tracking-[0.1em] border-2 border-border-strong shadow-lg w-fit px-3 sm:px-4 py-1 sm:py-2 bg-bg-base transition-all hover:border-text-accent group/state">
                                <span className="text-text-muted opacity-40 italic">{traza.estadoAnterior.toUpperCase()}</span>
                                <div className="flex items-center gap-2 text-text-accent font-black animate-pulse group-hover/state:scale-110 transition-transform">
                                     &gt;&gt;
                                </div>
                                <span className="text-text-accent">{traza.estadoNuevo.toUpperCase()}</span>
                            </div>
                        )}

                        {/* Trace Attachments Payload RX */}
                        {traza.adjuntos && traza.adjuntos.length > 0 && (
                            <div className="mt-4 sm:mt-8 flex flex-wrap gap-3 sm:gap-6 no-print animate-fadeInUp">
                                {traza.adjuntos.map(doc => (
                                    <AdjuntoChip key={doc.id} doc={doc} onDownload={handleDownload} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* High-Fidelity Signature Verification Protocol RX */}
            <div className="hidden print:flex signature-area mt-24 pt-16 border-t-8 border-dashed border-black justify-between">
                <div className="w-[48%] text-center group/sig">
                    <div className="h-48 flex items-end justify-center mb-6 relative">
                         <div className="absolute top-0 opacity-10 text-[8px] font-black tracking-widest">ANALYST_AUTH_ZONE</div>
                         <div className="w-full border-t-4 border-black"></div>
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.6em] italic">RESPONSIBLE_ANALYST_SIG_RX</p>
                    <p className="text-[14px] text-black font-black mt-4 tracking-[0.2em]">{ticket.asignadoA?.nombre?.toUpperCase() || user?.nombre?.toUpperCase()}</p>
                    <div className="mt-2 text-[10px] text-gray-500 font-bold tracking-widest bg-gray-100 px-4 py-1 inline-block border border-gray-200">ID_NODE: ANALYST_VERIFIED_0xFD42</div>
                </div>
                <div className="w-[48%] text-center group/sig">
                    <div className="h-48 flex items-end justify-center mb-6 relative">
                         <div className="absolute top-0 opacity-10 text-[8px] font-black tracking-widest">REQUESTER_AUTH_ZONE</div>
                         <div className="w-full border-t-4 border-black"></div>
                    </div>
                    <p className="text-[12px] font-black uppercase tracking-[0.6em] italic">USER_SATISFACTION_SIG_TX</p>
                    <p className="text-[14px] text-black font-black mt-4 tracking-[0.2em]">{ticket.funcionario?.nombre?.toUpperCase()}</p>
                    <div className="mt-2 text-[10px] text-gray-500 font-bold tracking-widest bg-gray-100 px-4 py-1 inline-block border border-gray-200">ID_NODE: REQUESTER_VERIFIED_0xFD42</div>
                </div>
            </div>
            
            <div className="mt-10 pt-6 flex justify-between items-center opacity-10 font-black text-[10px] uppercase tracking-[1.5em] italic transition-all group-hover/timeline:opacity-40">
                 <span>STREAM_BUFFER_EOF_0x0D</span>
                 <span className="animate-pulse">RX_SYNC_PASS_OK</span>
            </div>
        </div>
    );
};
