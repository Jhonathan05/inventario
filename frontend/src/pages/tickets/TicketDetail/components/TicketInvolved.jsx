export const TicketInvolved = ({ ticket }) => {
    const labelCls = "text-[10px] text-text-muted block uppercase tracking-[0.3em] mb-2 opacity-60";
    const valueCls = "text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums";

    return (
        <div className="bg-bg-surface border border-border-default p-10 font-mono space-y-10 group hover:border-border-strong transition-all relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em]">ENTITY_NODE_MAP</div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-8 border-b border-border-default pb-4">/ ENTITIES_INVOLVED</h3>
            
            <div className="space-y-10">
                <div className="flex items-start gap-6 group/entity">
                    <div className="w-12 h-12 border border-border-default bg-bg-base flex items-center justify-center shrink-0 no-print text-[12px] font-black text-text-primary shadow-xl group-hover/entity:border-text-accent transition-colors">
                        [U]
                    </div>
                    <div className="min-w-0">
                        <span className={`${labelCls} group-hover/entity:text-text-accent transition-colors`}>ORIGIN_REQUESTER</span>
                        <p className={valueCls}>{ticket.funcionario?.nombre.toUpperCase().replace(/ /g, '_')}</p>
                        <div className="flex items-center gap-4 mt-3 opacity-60">
                             <div className="h-px w-6 bg-border-default"></div>
                             <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">AREA_NAMESPACE: {ticket.funcionario?.area?.toUpperCase() || 'NULL_SEGMENT'}</p>
                        </div>
                    </div>
                </div>

                {ticket.activo && (
                    <div className="flex items-start gap-6 pt-10 border-t border-border-default/20 group/asset animate-fadeIn">
                        <div className="w-12 h-12 border border-border-default bg-bg-base flex items-center justify-center shrink-0 no-print text-[12px] font-black text-text-accent shadow-xl group-hover/asset:border-text-primary transition-colors">
                            [A]
                        </div>
                        <div className="min-w-0">
                            <span className={`${labelCls} group-hover/asset:text-text-accent transition-colors`}>LINKED_ASSET_NODE</span>
                            <p className={`${valueCls} text-text-accent`}>TAG: {ticket.activo.placa}</p>
                            <div className="flex items-center gap-4 mt-3 opacity-60">
                                 <div className="h-px w-6 bg-border-default"></div>
                                 <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{ticket.activo.marca?.toUpperCase()} // {ticket.activo.modelo?.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 text-[8px] font-black text-text-muted uppercase tracking-[0.4em] opacity-20">
                 SECURITY_DOMAIN_VERIFIED: TRUE
            </div>
        </div>
    );
};
