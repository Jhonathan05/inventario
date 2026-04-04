export const TicketInvolved = ({ ticket }) => {
    const labelCls = "text-[12px] font-black text-text-muted block uppercase tracking-[0.5em] mb-3 opacity-60 italic group-hover/entity:text-text-accent transition-colors";
    const valueCls = "text-[14px] font-black text-text-primary uppercase tracking-widest tabular-nums italic group-hover/entity:not-italic transition-all";

    return (
        <div className="bg-bg-surface border-4 border-border-default p-12 font-mono space-y-12 group/main hover:border-text-accent/20 transition-all relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[1.5em] group-hover/main:opacity-20 transition-all italic">ENTITY_NODE_MAP_RX_0xFD</div>
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-6 border-b-4 border-border-default pb-6">
                <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&theta;</div>
                <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                     INVOLVED_ENTITIES_AND_ASSETS_MAP
                </h3>
            </div>
            
            <div className="space-y-12 relative z-10">
                {/* Requester Entity Card */}
                <div className="flex items-start gap-8 group/entity hover:bg-bg-base/20 transition-colors p-4 border-l-4 border-border-default hover:border-text-accent">
                    <div className="w-16 h-16 border-4 border-border-default bg-bg-base flex items-center justify-center shrink-0 no-print text-[20px] font-black text-text-primary shadow-2xl group-hover/entity:scale-110 group-hover/entity:-rotate-12 transition-all duration-700">
                        &Omega;
                    </div>
                    <div className="min-w-0 space-y-3">
                        <span className={labelCls}>:: ORIGIN_REQUESTER_UID</span>
                        <p className={valueCls}>{ticket.funcionario?.nombre.toUpperCase().replace(/ /g, '_')}</p>
                        <div className="flex items-center gap-6 mt-4 opacity-40 group-hover/entity:opacity-100 transition-opacity">
                             <div className="h-0.5 w-10 bg-text-accent shadow-[0_0_10px_rgba(var(--text-accent),0.4)]"></div>
                             <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.5em] italic">ALLOC_NAMESPACE: {ticket.funcionario?.area?.toUpperCase() || 'NULL_SEGMENT'}</p>
                        </div>
                    </div>
                </div>

                {/* Linked Asset Entity Card */}
                {ticket.activo && (
                    <div className="flex items-start gap-8 pt-12 border-t-4 border-border-default/20 group/asset animate-fadeInUp p-4 border-l-4 border-border-default hover:border-text-accent hover:bg-bg-base/20 transition-all">
                        <div className="w-16 h-16 border-4 border-border-default bg-bg-base flex items-center justify-center shrink-0 no-print text-[20px] font-black text-text-accent shadow-2xl group-hover/asset:rotate-45 group-hover/asset:scale-110 transition-all duration-700">
                            &Delta;
                        </div>
                        <div className="min-w-0 space-y-3">
                            <span className={labelCls}>:: LINKED_ASSET_RESOURCE_TAG</span>
                            <div className="flex items-center gap-4">
                                <p className={`${valueCls} text-text-accent bg-text-accent/5 px-4 py-1 border-2 border-text-accent/20 shadow-inner`}>TAG_ID: {ticket.activo.placa}</p>
                            </div>
                            <div className="flex items-center gap-6 mt-4 opacity-40 group-hover/asset:opacity-100 transition-opacity">
                                 <div className="h-0.5 w-10 bg-text-accent"></div>
                                 <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.5em] italic">{ticket.activo.marca?.toUpperCase()} // {ticket.activo.modelo?.toUpperCase()}</p>
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
