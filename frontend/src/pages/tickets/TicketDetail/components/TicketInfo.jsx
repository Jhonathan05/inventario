import { AdjuntoChip } from './AdjuntoChip';

export const TicketInfo = ({ ticket, onDownload }) => {
    const labelCls = "text-[12px] font-black text-text-muted uppercase tracking-[0.5em] block mb-3 opacity-60 italic group-hover/field:text-text-accent transition-colors";
    const valueCls = "text-[14px] font-black text-text-primary uppercase tracking-widest tabular-nums italic group-hover/field:not-italic transition-all";

    return (
        <div className="space-y-12 font-mono">
            {/* General Manifest Block RX */}
            <div className="bg-bg-surface border-4 border-border-default p-12 space-y-12 group/info hover:border-text-accent/20 transition-all overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[1.5em] group-hover/info:opacity-20 transition-all italic">INFO_BLOCK_RX_0xFD</div>
                <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-20"></div>
                
                <div className="flex items-center gap-6 border-b-4 border-border-default pb-6">
                    <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&alpha;</div>
                    <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                         GEN_TICKET_MANIFEST_CORE
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10">
                    <div className="group/field border-l-4 border-border-default pl-6 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: IDENT_CLASS_RX</span>
                        <div className="bg-bg-base/40 p-3 border-2 border-border-default/30 shadow-inner">
                            <span className={valueCls}>{ticket.tipo.replace(/ /g, '_')}</span>
                        </div>
                    </div>
                    <div className="group/field border-l-4 border-border-default pl-6 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: PRIORITY_LVL_BUF</span>
                        <div className="bg-bg-base/40 p-3 border-2 border-border-default/30 shadow-inner flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${ticket.prioridad === 'CRITICAL' ? 'bg-text-accent animate-ping' : 'bg-text-primary opacity-40'}`}></div>
                            <span className="text-[14px] font-black text-text-accent uppercase tracking-widest">{ticket.prioridad}_NODE</span>
                        </div>
                    </div>
                    <div className="no-print-essential group/field border-l-4 border-border-default pl-6 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: CURR_STATUS_BIT</span>
                        <div className="bg-bg-base/40 p-3 border-2 border-border-default/30 shadow-inner">
                            <span className="text-[14px] font-black text-text-primary uppercase tracking-[0.4em] decoration-dotted underline underline-offset-8 decoration-border-default/50">
                                {ticket.estado.toUpperCase().replace(/_/g, '_')}
                            </span>
                        </div>
                    </div>
                    <div className="group/field border-l-4 border-border-default pl-6 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: INIT_TIMESTAMP_TX</span>
                        <div className="bg-bg-base/40 p-3 border-2 border-border-default/30 shadow-inner text-[11px] font-black text-text-primary uppercase tracking-[0.4em] tabular-nums italic opacity-80 flex items-center gap-4">
                            <span className="text-text-accent opacity-40">&bull;</span>
                            {new Date(ticket.creadoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase().replace(/ /g, '_')}
                        </div>
                    </div>
                </div>

                {ticket.cerradoEn && (
                    <div className="pt-10 border-t-4 border-border-default/30 animate-fadeInUp">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.6em] block mb-4 opacity-60 italic">:: RESOLUTION_COMMIT_POINT</span>
                        <div className="text-[13px] text-bg-base font-black uppercase tracking-[0.3em] bg-text-primary px-8 py-5 border-4 border-text-primary shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-6 group/res hover:bg-text-accent hover:border-text-accent transition-all duration-700">
                             <div className="w-4 h-4 bg-bg-base animate-pulse shadow-2xl"></div>
                             RESOLVED_AT_TIMESTAMP: {new Date(ticket.cerradoEn).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' }).toUpperCase().replace(/ /g, '_')}
                        </div>
                    </div>
                )}

                <div className="pt-10 border-t-4 border-border-default/20 group/desc">
                    <div className="flex items-center gap-5 mb-5 opacity-40 group-hover/desc:opacity-100 transition-opacity">
                         <div className="w-2 h-0.5 bg-text-accent"></div>
                         <span className="text-[12px] font-black text-text-muted uppercase tracking-[0.8em] italic">ROOT_CAUSE_PAYLOAD_RX</span>
                    </div>
                    <div className="bg-bg-base border-4 border-border-default p-10 border-dashed leading-relaxed uppercase tracking-widest shadow-[inset_0_10px_40px_rgba(0,0,0,0.4)] opacity-80 group-hover/desc:opacity-100 transition-opacity group-hover/desc:border-text-accent/30">
                        <p className="text-[14px] text-text-primary/95 whitespace-pre-wrap italic group-hover/desc:not-italic transition-all">
                            {ticket.descripcion}
                        </p>
                         <div className="mt-8 text-right opacity-10 text-[9px] font-black tracking-widest italic group-hover/desc:opacity-40 transition-opacity">DESC_MAP_0x{ticket.descripcion.length.toString(16).toUpperCase()}_BUF</div>
                    </div>
                </div>
            </div>

            {/* Evidence Buffer Block TX */}
            {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                <div className="bg-bg-surface border-4 border-border-default p-10 font-mono no-print hover:border-text-accent/20 transition-all shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group/adj">
                     <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[2em] group-hover/adj:opacity-20 transition-all italic italic">PAYLOAD_BUFFER_RX</div>
                     <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-text-accent/30 to-transparent"></div>

                     <div className="flex items-center gap-6 border-b-4 border-border-default pb-6 mb-10">
                        <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&beta;</div>
                        <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                            EVIDENCE_LOGS_CHUNK_ARRAY ({ticket.adjuntos.length.toString().padStart(2, '0')})
                        </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-8 animate-fadeInUp">
                        {ticket.adjuntos.map(doc => (
                            <AdjuntoChip key={doc.id} doc={doc} onDownload={onDownload} />
                        ))}
                    </div>
                    <div className="mt-10 pt-6 border-t border-border-default/10 text-[9px] font-black text-text-muted uppercase tracking-[1em] opacity-10 italic group-hover/adj:opacity-30 transition-opacity">IO_TX_STREAM_FRAGMENT_CHECK_OK</div>
                </div>
            )}
        </div>
    );
};
