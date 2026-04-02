export const TechnicalNotes = ({ 
    ticket, 
    localTicket, 
    setLocalTicket, 
    handleGuardarNotasTecnicas, 
    saving 
}) => {
    const textareaCls = "w-full bg-bg-base border border-border-default p-8 text-[12px] font-black uppercase tracking-tighter text-text-primary focus:outline-none focus:border-border-strong transition-all resize-none font-mono leading-relaxed placeholder:opacity-20 shadow-inner";
    const labelCls = "text-[10px] font-black text-text-muted uppercase tracking-[0.3em] block mb-3 opacity-60 group-hover/field:text-text-accent transition-colors";

    return (
        <div className="bg-bg-surface border border-border-default p-10 font-mono shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">SOL_DOC_PROTOCOL</div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-10 border-b border-border-default pb-4">
                / TECHNICAL_SOLUTION_MANIFEST
            </h2>
            <div className="space-y-10">
                <div className="group/field">
                    <label className={labelCls}>:: DIAGNOSTIC_&_IMPLEMENTED_SOLUTION_STREAM</label>
                    <textarea
                        rows="10"
                        value={localTicket?.solucionTecnica ?? ticket?.solucionTecnica ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), solucionTecnica: e.target.value }))}
                        className={textareaCls}
                        placeholder="DETAILED_SOLUTION_LOG_VECTOR..."
                    />
                </div>
                <div className="group/field">
                    <label className={labelCls}>:: FINAL_CONCLUSIONS_&_REQUIREMENTS_BUF</label>
                    <textarea
                        rows="4"
                        value={localTicket?.conclusiones ?? ticket?.conclusiones ?? ''}
                        onChange={e => setLocalTicket(prev => ({ ...(prev || ticket), conclusiones: e.target.value }))}
                        className={textareaCls}
                        placeholder="SUMMARY_CONCLUSIONS_ENTRY..."
                    />
                </div>
                <div className="flex justify-end no-print pt-8 border-t border-border-default/20">
                    <button
                        onClick={handleGuardarNotasTecnicas}
                        disabled={saving}
                        className="bg-bg-elevated border border-border-strong px-12 py-4 text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.5em] transition-all flex items-center gap-4 shadow-3xl disabled:opacity-30 active:scale-95 group/btn"
                    >
                        <span>{saving ? '[ SYNCING... ]' : '[ COMMIT_TECHNICAL_NOTES ]'}</span>
                        {!saving && <span className="opacity-40 group-hover/btn:translate-x-1 transition-transform">→</span>}
                    </button>
                </div>
            </div>
            <div className="mt-6 text-[8px] font-black text-text-muted uppercase tracking-[0.4em] opacity-10">
                 DOCUMENTATION_MODE: HIGH_FIDELITY // ENCRYPTION: ACTIVE
            </div>
        </div>
    );
};
