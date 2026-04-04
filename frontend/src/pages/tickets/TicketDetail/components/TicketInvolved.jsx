export const TicketInvolved = ({ ticket }) => {
    const labelCls = "text-[9px] font-black text-text-muted block uppercase tracking-[0.2em] mb-1 opacity-60 italic group-hover/entity:text-text-accent transition-colors";
    const valueCls = "text-[12px] font-black text-text-primary uppercase tracking-wider tabular-nums italic group-hover/entity:not-italic transition-all";

    return (
        <div className="bg-bg-surface border-2 border-border-default p-4 sm:p-6 font-mono space-y-6 group/main hover:border-text-accent/20 transition-all relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/main:opacity-20 transition-all italic hidden sm:block">ENTITY_MAP</div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-3 border-b-2 border-border-default pb-3">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-xs bg-bg-base shadow-lg italic flex-shrink-0">&theta;</div>
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-text-primary italic opacity-80 leading-none">
                     INVOLVED_ENTITIES
                </h3>
            </div>
            
            <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4 group/entity hover:bg-bg-base/20 transition-colors p-3 border-l-2 border-border-default hover:border-text-accent">
                    <div className="w-12 h-12 border-2 border-border-default bg-bg-base flex items-center justify-center shrink-0 no-print text-xl font-black text-text-primary shadow-lg">
                        &Omega;
                    </div>
                    <div className="min-w-0 space-y-1.5">
                        <span className={labelCls}>:: REQUESTER</span>
                        <p className={valueCls}>{ticket.funcionario?.nombre.toUpperCase().replace(/ /g, '_')}</p>
                        <div className="flex items-center gap-3 mt-3 opacity-40 group-hover/entity:opacity-100 transition-opacity">
                             <div className="h-0.5 w-6 bg-text-accent"></div>
                             <p className="text-[8px] sm:text-[9px] text-text-muted font-black uppercase tracking-[0.2em] italic truncate">{ticket.funcionario?.area?.toUpperCase() || 'NULL'}</p>
                        </div>
                    </div>
                </div>

                {/* Linked Asset Entity Card */}
                {ticket.activo && (
                    <div className="flex items-start gap-3 pt-4 border-t-2 border-border-default/20 group/asset animate-fadeInUp p-3 border-l-2 border-border-default hover:border-text-accent hover:bg-bg-base/20 transition-all">
                        <div className="w-12 h-12 border-2 border-border-default bg-bg-base flex items-center justify-center shrink-0 no-print text-xl font-black text-text-accent shadow-lg">
                            &Delta;
                        </div>
                        <div className="min-w-0 space-y-1.5">
                            <span className={labelCls}>:: LINKED_ASSET</span>
                            <div className="flex items-center gap-2">
                                <p className={`${valueCls} text-text-accent bg-text-accent/5 px-2 py-0.5 border-2 border-text-accent/20 shadow-inner`}>TAG: {ticket.activo.placa}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-3 opacity-40 group-hover/asset:opacity-100 transition-opacity">
                                 <div className="h-0.5 w-6 bg-text-accent"></div>
                                 <p className="text-[8px] sm:text-[9px] text-text-muted font-black uppercase tracking-[0.2em] italic truncate">{ticket.activo.marca?.toUpperCase()} // {ticket.activo.modelo?.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 flex justify-between items-center opacity-10 font-black text-[9px] uppercase tracking-[1em] italic group-hover/main:opacity-40 transition-opacity">
                 <span>SECURITY_DOMAIN_VERIFIED: TRUE</span>
                 <span>_0xFD42_SYNCED</span>
            </div>
        </div>
    );
};
