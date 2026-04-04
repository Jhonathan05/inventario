import { AdjuntoChip } from './AdjuntoChip';

export const TicketInfo = ({ ticket, onDownload }) => {
    const labelCls = "text-[9px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1 opacity-60 italic group-hover/field:text-text-accent transition-colors";
    const valueCls = "text-[11px] font-black text-text-primary uppercase tracking-wider tabular-nums italic group-hover/field:not-italic transition-all";

    return (
        <div className="space-y-3 sm:space-y-4 font-mono">
            {/* General Manifest Block RX */}
            <div className="bg-bg-surface border-2 border-border-default p-3 sm:p-4 space-y-4 group/info hover:border-text-accent/20 transition-all overflow-hidden relative shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/info:opacity-20 transition-all italic hidden sm:block">INFO_BLOCK</div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-20"></div>
                
                <div className="flex items-center gap-2 border-b-2 border-border-default pb-2">
                    <div className="w-5 h-5 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-[10px] bg-bg-base shadow-lg italic flex-shrink-0">&alpha;</div>
                    <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-primary italic opacity-80 leading-none">
                         GEN_TICKET_MANIFEST_CORE
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                    <div className="group/field border-l-2 border-border-default pl-3 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: IDENT_CLASS_RX</span>
                        <div className="bg-bg-base/40 p-1.5 border border-border-default/30 shadow-inner">
                            <span className={valueCls}>{ticket.tipo.replace(/ /g, '_')}</span>
                        </div>
                    </div>
                    <div className="group/field border-l-2 border-border-default pl-3 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: PRIORITY_LVL_BUF</span>
                        <div className="bg-bg-base/40 p-1.5 border border-border-default/30 shadow-inner flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${ticket.prioridad === 'CRITICAL' ? 'bg-text-accent animate-ping' : 'bg-text-primary opacity-40'}`}></div>
                            <span className="text-[11px] font-black text-text-accent uppercase tracking-widest">{ticket.prioridad}_NODE</span>
                        </div>
                    </div>
                    <div className="no-print-essential group/field border-l-2 border-border-default pl-3 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: CURR_STATUS_BIT</span>
                        <div className="bg-bg-base/40 p-1.5 border border-border-default/30 shadow-inner">
                            <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.1em] decoration-dotted underline underline-offset-4 decoration-border-default/50">
                                {ticket.estado.toUpperCase().replace(/_/g, '_')}
                            </span>
                        </div>
                    </div>
                    <div className="group/field border-l-2 border-border-default pl-3 hover:border-text-accent transition-colors">
                        <span className={labelCls}>:: INIT_TIMESTAMP_TX</span>
                        <div className="bg-bg-base/40 p-1.5 border border-border-default/30 shadow-inner text-[9px] font-black text-text-primary uppercase tracking-[0.1em] tabular-nums italic opacity-80 flex items-center gap-2">
                            <span className="text-text-accent opacity-40">&bull;</span>
                            {new Date(ticket.creadoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase().replace(/ /g, '_')}
                        </div>
                    </div>
                </div>

                {ticket.cerradoEn && (
                    <div className="pt-4 border-t-2 border-border-default/30 animate-fadeInUp">
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em] block mb-1 opacity-60 italic">:: RESOLUTION_COMMIT_POINT</span>
                        <div className="text-[10px] text-bg-base font-black uppercase tracking-[0.1em] bg-text-primary px-3 py-2 border-2 border-text-primary shadow-lg flex items-center gap-3 group/res hover:bg-text-accent hover:border-text-accent transition-all duration-700">
                             <div className="w-2.5 h-2.5 bg-bg-base animate-pulse shadow-xl"></div>
                             RESOLVED: {new Date(ticket.cerradoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase().replace(/ /g, '_')}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t-2 border-border-default/20 group/desc">
                    <div className="flex items-center gap-2 mb-2 opacity-40 group-hover/desc:opacity-100 transition-opacity">
                         <div className="w-1.5 h-0.5 bg-text-accent"></div>
                         <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] italic">ROOT_CAUSE_PAYLOAD_RX</span>
                    </div>
                    <div className="bg-bg-base border-2 border-border-default p-3 sm:p-4 border-dashed leading-normal uppercase tracking-wider shadow-inner opacity-80 group-hover/desc:opacity-100 transition-opacity group-hover/desc:border-text-accent/30">
                        <p className="text-[11px] text-text-primary/95 whitespace-pre-wrap italic group-hover/desc:not-italic transition-all">
                            {ticket.descripcion}
                        </p>
                    </div>
                </div>
            </div>

            {/* Evidence Buffer Block TX */}
            {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                <div className="bg-bg-surface border-2 border-border-default p-4 sm:p-6 font-mono no-print hover:border-text-accent/20 transition-all shadow-lg relative overflow-hidden group/adj">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/adj:opacity-20 transition-all italic hidden sm:block">PAYLOAD_BUFFER</div>

                     <div className="flex items-center gap-3 border-b-2 border-border-default pb-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-xs bg-bg-base shadow-lg italic flex-shrink-0">&beta;</div>
                        <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-text-primary italic opacity-80 leading-none">
                            EVIDENCE_LOGS ({ticket.adjuntos.length.toString().padStart(2, '0')})
                        </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 sm:gap-4 animate-fadeInUp">
                        {ticket.adjuntos.map(doc => (
                            <AdjuntoChip key={doc.id} doc={doc} onDownload={onDownload} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
