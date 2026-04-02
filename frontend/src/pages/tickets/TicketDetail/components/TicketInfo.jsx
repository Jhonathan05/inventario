import { AdjuntoChip } from './AdjuntoChip';

export const TicketInfo = ({ ticket, onDownload }) => {
    const labelCls = "text-[10px] font-black text-text-muted uppercase tracking-[0.3em] block mb-2 opacity-60";
    const valueCls = "text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums";

    return (
        <div className="space-y-8 font-mono">
            <div className="bg-bg-surface border border-border-default p-10 space-y-10 group hover:border-border-strong transition-all overflow-hidden relative shadow-3xl">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em]">INFO_BLOCK_RX</div>
                
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-8 border-b border-border-default pb-4">/ GEN_MANIFEST_INFO</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="group/field">
                        <span className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: IDENT_CLASS</span>
                        <span className={valueCls}>{ticket.tipo.replace(/ /g, '_')}</span>
                    </div>
                    <div className="group/field">
                        <span className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: PRIORITY_LVL</span>
                        <span className="text-[12px] font-black text-text-accent uppercase tracking-tight">[{ticket.prioridad}]</span>
                    </div>
                    <div className="no-print-essential group/field">
                        <span className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: CURR_STATUS</span>
                        <span className="text-[12px] font-black text-text-primary uppercase tracking-widest decoration-dotted underline underline-offset-4 decoration-border-default/50">
                            {ticket.estado.replace(/_/g, '_')}
                        </span>
                    </div>
                    <div className="group/field">
                        <span className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: INIT_TIMESTAMP</span>
                        <div className="flex items-center text-[10px] font-black text-text-primary uppercase tracking-widest tabular-nums italic opacity-80">
                            {new Date(ticket.creadoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase().replace(/ /g, '_')}
                        </div>
                    </div>
                </div>

                {ticket.cerradoEn && (
                    <div className="pt-8 border-t border-border-default/30 animate-fadeIn">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] block mb-2 opacity-60">:: FINAL_STATUS_LOG_POINT</span>
                        <span className="text-[12px] text-text-accent font-black uppercase tracking-tight bg-text-accent/5 px-4 py-2 border border-text-accent shadow-xl inline-block">
                             RESOLVED @ {new Date(ticket.cerradoEn).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' }).toUpperCase().replace(/ /g, '_')}
                        </span>
                    </div>
                )}

                <div className="pt-8 border-t border-border-default/20 group/desc">
                    <span className={`${labelCls} group-hover/desc:text-text-accent transition-colors`}># PROBLEM_DESC_PAYLOAD</span>
                    <p className="text-[12px] text-text-primary/90 whitespace-pre-wrap bg-bg-base border border-border-default p-8 border-dashed leading-relaxed uppercase tracking-tighter shadow-inner opacity-80">
                        {ticket.descripcion}
                    </p>
                </div>
            </div>

            {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                <div className="bg-bg-surface border border-border-default p-10 font-mono no-print hover:border-border-strong transition-all shadow-3xl relative overflow-hidden group/adj">
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase">PAYLOAD_BUFFER</div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-10 flex items-center gap-5 border-b border-border-default pb-4">
                        <span className="text-text-accent opacity-60">[ + ]</span> 
                        ATTACHED_LOGS_CHUNK ({ticket.adjuntos.length})
                    </h3>
                    <div className="flex flex-wrap gap-6 animate-slideUp">
                        {ticket.adjuntos.map(doc => (
                            <AdjuntoChip key={doc.id} doc={doc} onDownload={onDownload} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
