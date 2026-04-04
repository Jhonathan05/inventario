export const TechnicalNotes = ({ 
    ticket, 
    localTicket, 
    setLocalTicket, 
    handleGuardarNotasTecnicas, 
    saving 
}) => {
    const textareaCls = "w-full bg-bg-base border-2 border-border-default p-2 sm:p-3 text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-text-primary focus:outline-none focus:border-text-accent transition-all resize-none font-mono leading-relaxed placeholder:opacity-10 shadow-inner italic";
    const labelCls = "text-[8px] sm:text-[9px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1 opacity-60 group-hover/field:text-text-accent transition-colors italic border-l-2 border-border-default pl-2 group-hover/field:border-text-accent";

    return (
        <div className="bg-bg-surface border-2 border-border-default p-4 sm:p-6 font-mono shadow-lg relative overflow-hidden group/main hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/main:opacity-20 transition-all italic hidden sm:block">TECH_SOLUTIONS</div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-3 border-b-2 border-border-default pb-3 mb-4 sm:mb-6">
                <div className="w-6 h-6 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-xs bg-bg-base shadow-lg italic flex-shrink-0">&zeta;</div>
                <h2 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-text-primary italic opacity-80 leading-none">
                    / TECHNICAL_SOLUTIONS
                </h2>
            </div>

            <div className="space-y-6 sm:space-y-8 relative z-10">
                <div className="group/field">
                    <label className={labelCls}>:: DIAGNOSTIC_&_SOLUTION</label>
                    <textarea
                        rows="8"
                        value={localTicket?.solucionTecnica ?? ticket?.solucionTecnica ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), solucionTecnica: e.target.value }))}
                        className={textareaCls}
                        placeholder="DETAILED_LOG_PAYLOAD..."
                    />
                </div>
                <div className="group/field">
                    <label className={labelCls}>:: CONCLUSIONS_&_REQUIREMENTS</label>
                    <textarea
                        rows="3"
                        value={localTicket?.conclusiones ?? ticket?.conclusiones ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), conclusiones: e.target.value }))}
                        className={textareaCls}
                        placeholder="SUMMARY_ENTRY_POINTS..."
                    />
                </div>

                <div className="flex justify-end no-print pt-4 sm:pt-6 border-t-2 border-border-default/20 relative">
                    <button
                        onClick={handleGuardarNotasTecnicas}
                        disabled={saving}
                        className="bg-bg-elevated border-2 border-border-strong px-4 sm:px-8 py-2 sm:py-3 text-[10px] sm:text-[11px] font-black text-text-accent hover:text-text-primary hover:border-text-accent hover:bg-bg-base uppercase tracking-[0.4em] transition-all disabled:opacity-20 active:scale-95 shadow-lg group/btn relative overflow-hidden w-full sm:w-auto"
                    >
                        <span className="relative z-10 flex items-center gap-8">
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-text-accent border-t-transparent animate-spin"></div>
                                    <span>[ SYNCING... ]</span>
                                </>
                            ) : (
                                <>
                                    <span>[ COMMIT_NOTES ]</span>
                                    <span className="opacity-40 group-hover/btn:translate-x-4 transition-transform italic">&raquo;</span>
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>
                </div>
            </div>
            
            <div className="pt-6 flex justify-between items-center opacity-10 font-black text-[9px] uppercase tracking-[1em] italic group-hover/main:opacity-40 transition-opacity pointer-events-none">
                 <span>DOCUMENTATION_INTENSITY: HIGH</span>
                 <span>SYNC_READY_v4.2</span>
            </div>
        </div>
    );
};

export default TechnicalNotes;
