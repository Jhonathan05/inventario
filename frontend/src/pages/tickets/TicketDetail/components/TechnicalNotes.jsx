export const TechnicalNotes = ({ 
    ticket, 
    localTicket, 
    setLocalTicket, 
    handleGuardarNotasTecnicas, 
    saving 
}) => {
    const textareaCls = "w-full bg-bg-base border-4 border-border-default p-10 text-[14px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all resize-none font-mono leading-relaxed placeholder:opacity-10 shadow-[inset_0_5px_30px_rgba(0,0,0,0.5)] italic group-hover/field:not-italic group-hover/field:bg-bg-base/60 duration-700";
    const labelCls = "text-[12px] font-black text-text-muted uppercase tracking-[0.5em] block mb-4 opacity-60 group-hover/field:text-text-accent transition-colors italic border-l-4 border-border-default pl-6 group-hover/field:border-text-accent";

    return (
        <div className="bg-bg-surface border-4 border-border-default p-12 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group/main hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[2em] group-hover/main:opacity-20 transition-all italic italic">TECH_SOL_MANIFEST_RX_0xFD</div>
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-6 border-b-4 border-border-default pb-6 mb-10">
                <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&zeta;</div>
                <h2 className="text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                    / TECHNICAL_SOLUTIONS_DIAGNOSTIC_MANIFEST
                </h2>
            </div>

            <div className="space-y-12 relative z-10">
                <div className="group/field">
                    <label className={labelCls}>:: DIAGNOSTIC_&_IMPLEMENTED_SOLUTION_BUF_TX</label>
                    <textarea
                        rows="12"
                        value={localTicket?.solucionTecnica ?? ticket?.solucionTecnica ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), solucionTecnica: e.target.value }))}
                        className={textareaCls}
                        placeholder="DETAILED_SOLUTION_LOG_VECTOR_PAYLOAD..."
                    />
                    <div className="mt-4 text-right opacity-10 text-[9px] font-black tracking-widest italic group-hover/field:opacity-40 duration-700">SOL_MAP_0x{(localTicket?.solucionTecnica?.length ?? 0).toString(16).toUpperCase()}_BUF</div>
                </div>
                <div className="group/field">
                    <label className={labelCls}>:: FINAL_CONCLUSIONS_&_REQUIREMENTS_ARRAY</label>
                    <textarea
                        rows="5"
                        value={localTicket?.conclusiones ?? ticket?.conclusiones ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), conclusiones: e.target.value }))}
                        className={textareaCls}
                        placeholder="SUMMARY_CONCLUSIONS_ENTRY_POINTS..."
                    />
                     <div className="mt-4 text-right opacity-10 text-[9px] font-black tracking-widest italic group-hover/field:opacity-40 duration-700">CONCL_MAP_0x{(localTicket?.conclusiones?.length ?? 0).toString(16).toUpperCase()}_BUF</div>
                </div>

                <div className="flex justify-end no-print pt-10 border-t-4 border-border-default/20 relative group/footer">
                    <button
                        onClick={handleGuardarNotasTecnicas}
                        disabled={saving}
                        className="bg-bg-elevated border-4 border-border-strong px-16 py-6 text-[13px] font-black text-text-accent hover:text-text-primary hover:border-text-accent hover:bg-bg-base uppercase tracking-[0.8em] transition-all disabled:opacity-20 active:scale-95 shadow-[0_30px_100px_rgba(0,0,0,0.6)] group/btn relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-8">
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-text-accent border-t-transparent animate-spin"></div>
                                    <span>[ SYNCING_COMMITS... ]</span>
                                </>
                            ) : (
                                <>
                                    <span>[ COMMIT_TECHNICAL_NOTES ]</span>
                                    <span className="opacity-40 group-hover/btn:translate-x-4 transition-transform italic">&raquo;</span>
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>
                </div>
            </div>
            
            <div className="pt-6 flex justify-between items-center opacity-10 font-black text-[9px] uppercase tracking-[1em] italic group-hover/main:opacity-40 transition-opacity pointer-events-none">
                 <span>DOCUMENTATION_INTENSITY: HIGH_FIDELITY</span>
                 <span>SYNC_READY_v4.2</span>
            </div>
        </div>
    );
};
