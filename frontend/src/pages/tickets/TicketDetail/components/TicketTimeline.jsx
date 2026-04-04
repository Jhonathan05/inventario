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
        <div className="bg-bg-surface border-4 border-border-default p-12 font-mono flex-1 shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group/timeline hover:border-text-accent/20 transition-all duration-1000 flex flex-col h-full min-h-[600px]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[2em] group-hover/timeline:opacity-20 transition-all italic italic">LOG_STREAM_RX_0xFD</div>
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-6 border-b-4 border-border-default pb-6 mb-10">
                <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&sigma;</div>
                <h2 className="text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                     DETAILED_EVENT_TRAILS_STREAM
                </h2>
            </div>

            <div className="relative border-l-8 border-border-default/20 ml-10 space-y-16 flex-1 overflow-y-auto pr-8 pb-16 print:overflow-visible custom-scrollbar scroll-smooth">
                {ticket.trazas?.length === 0 && (
                    <div className="pl-16 py-16 opacity-30 animate-pulse">
                        <p className="text-[14px] text-text-muted italic uppercase tracking-[0.8em] font-black">! NULL_EVENT_LOGS_STREAM_RX</p>
                        <div className="mt-4 h-1 w-48 bg-border-default/20 relative overflow-hidden">
                             <div className="absolute inset-0 bg-text-accent/20 animate-loadingBarSlow"></div>
                        </div>
                    </div>
                )}
                {ticket.trazas?.map((traza, i) => (
                    <div key={i} className="relative pl-16 group/item animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                        <div 
                            className="absolute -left-[24px] top-4 bg-bg-surface border-4 border-border-default text-[12px] font-black w-10 h-10 flex items-center justify-center no-print group-hover/item:border-text-accent group-hover/item:text-text-accent transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-bg-base group-hover/item:rotate-[360deg] duration-1000 italic"
                            dangerouslySetInnerHTML={{ __html: getTrazaSymbol(traza.tipoTraza) }}
                        />
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 border-b-2 border-border-default/10 pb-4">
                            <div className="flex items-center gap-4">
                                 <div className="w-2 h-2 bg-text-accent/40 animate-pulse"></div>
                                 <span className="font-black text-[13px] text-text-primary uppercase tracking-[0.4em] bg-bg-base/80 px-4 py-1.5 border-2 border-border-default shadow-xl italic group-hover/item:text-text-accent group-hover/item:not-italic transition-all">{traza.creadoPor?.nombre?.toUpperCase().replace(/ /g, '_') || 'SYSTEM_KERNEL_TX'}</span>
                            </div>
                            <time className="text-[11px] text-text-muted font-black opacity-40 tabular-nums italic tracking-widest bg-bg-base px-3 py-1 border border-border-default/30 shadow-inner">
                                [{new Date(traza.creadoEn).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase().replace(/ /g, '_')}]
                            </time>
                        </div>

                        <div className={`text-[14px] uppercase tracking-widest leading-relaxed font-black transition-all duration-700 ${traza.tipoTraza === 'COMENTARIO' ? 'bg-bg-base/60 p-8 border-4 border-border-default border-dashed text-text-primary group-hover/item:border-text-accent/40 group-hover/item:bg-bg-elevated/20 shadow-[inset_0_10px_40px_rgba(0,0,0,0.4)] italic' : 'text-text-muted opacity-80 italic group-hover/item:opacity-100'}`}>
                            {traza.comentario.replace(/ /g, '_')}
                        </div>

                        {traza.tipoTraza === 'CAMBIO_ESTADO' && traza.estadoAnterior && (
                            <div className="mt-6 flex items-center gap-6 text-[11px] font-black tracking-[0.3em] border-4 border-border-strong shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-fit px-6 py-3 bg-bg-base transition-all hover:scale-105 hover:border-text-accent group/state">
                                <span className="text-text-muted opacity-40 italic">{traza.estadoAnterior.toUpperCase()}</span>
                                <div className="flex items-center gap-2 text-text-accent font-black animate-pulse group-hover/state:scale-125 transition-transform">
                                     &gt;&gt;
                                </div>
                                <span className="text-text-accent">{traza.estadoNuevo.toUpperCase()}</span>
                            </div>
                        )}

                        {/* Trace Attachments Payload RX */}
                        {traza.adjuntos && traza.adjuntos.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-6 no-print animate-fadeInUp">
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
