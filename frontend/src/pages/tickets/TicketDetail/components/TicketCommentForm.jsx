export const TicketCommentForm = ({ 
    nuevoComentario, 
    setNuevoComentario, 
    archivosComentario, 
    handleFileSelect, 
    handleRemoveFile, 
    handleAgregarComentario, 
    fileInputRef, 
    saving 
}) => {
    const labelCls = "text-[11px] font-black uppercase tracking-[0.4em] text-text-muted mb-8 border-b border-border-default pb-4 opacity-70 group-hover:text-text-primary transition-colors";
    const textareaCls = "w-full bg-bg-base border-2 border-border-default p-8 text-[12px] font-black uppercase tracking-tighter sm:tracking-tight text-text-primary focus:outline-none focus:border-border-strong transition-all resize-none leading-relaxed placeholder:opacity-20 shadow-inner";

    return (
        <form onSubmit={handleAgregarComentario} className="bg-bg-surface border border-border-default p-10 font-mono shadow-3xl no-print relative overflow-hidden group hover:border-border-strong transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">LOG_INPUT_RX</div>
            <h3 className={labelCls}>
                / APPEND_TO_TIMELINE_STREAM
            </h3>
            
            <div className="space-y-8">
                <div className="relative group/field">
                     <div className="absolute top-4 left-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-widest group-focus-within/field:opacity-30 transition-opacity">ENTRY_POINT_TX</div>
                    <textarea
                        rows="6"
                        value={nuevoComentario}
                        onChange={e => setNuevoComentario(e.target.value)}
                        placeholder="ENTER_UPDATE_OR_TECHNICAL_OBSERVATIONS_LOG..."
                        className={textareaCls}
                        autoComplete="off"
                    />
                </div>

                {/* Preview de archivos a adjuntar / Buffer fragments */}
                {archivosComentario.length > 0 && (
                    <div className="flex flex-wrap gap-4 animate-slideDown">
                        {archivosComentario.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-bg-base border border-border-default px-5 py-2.5 text-text-primary shadow-xl hover:border-text-accent transition-all group/frag">
                                <span className="text-text-accent opacity-50 group-hover/frag:opacity-100">[F_BUF]</span>
                                <span>{f.name.toUpperCase().replace(/ /g, '_')}</span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveFile(i)}
                                    className="text-text-muted hover:text-text-accent transition-all text-xl leading-none active:scale-90"
                                    title="UNLINK_FRAGMENT"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action protocol bar */}
            <div className="mt-10 pt-10 border-t border-border-default/30 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        multiple 
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileSelect} 
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border border-border-default px-8 py-4 hover:border-text-accent hover:text-text-primary transition-all flex items-center gap-4 group/adj active:scale-95 bg-bg-base/30 shadow-xl"
                    >
                        <span className="opacity-40 group-hover/adj:scale-125 transition-transform">+</span>
                        <span>[ ATTACH_PAYLOAD ]</span>
                    </button>
                </div>
                <button 
                    type="submit" 
                    disabled={(nuevoComentario.trim().length === 0 && archivosComentario.length === 0) || saving}
                    className="w-full sm:w-auto bg-bg-elevated border border-border-strong px-12 py-4 text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-5 shadow-3xl disabled:opacity-30 group/submit active:scale-95"
                >
                    <span>{saving ? '[ SYNCING_COMMITS... ]' : '[ > ] COMMIT_LOG_ENTRY'}</span>
                    {!saving && <span className="opacity-40 group-hover/submit:translate-x-1 transition-transform">→</span>}
                </button>
            </div>
            
            <div className="mt-6 text-[8px] font-black text-text-muted uppercase tracking-[0.4em] opacity-10">
                 TRANSACTION_LOGGING: ON // CHANNEL_ENCRYPTION: ACTIVE
            </div>
        </form>
    );
};
