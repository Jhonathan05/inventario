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
    const labelCls = "text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none group-hover/main:text-text-accent transition-all duration-700";
    const textareaCls = "w-full bg-bg-base border-4 border-border-default p-10 text-[14px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all resize-none leading-relaxed placeholder:opacity-10 shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)] italic group-hover/field:not-italic duration-700";

    return (
        <form onSubmit={handleAgregarComentario} className="bg-bg-surface border-4 border-border-default p-12 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] no-print relative overflow-hidden group/main hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xl font-black uppercase tracking-[2em] group-hover/main:opacity-20 transition-all italic italic">LOG_INPUT_BUFFER_RX_0xFD</div>
            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-6 border-b-4 border-border-default pb-6 mb-10">
                <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&kappa;</div>
                <h3 className={labelCls}>
                    / APPEND_TO_TIMELINE_LOG_STREAM
                </h3>
            </div>
            
            <div className="space-y-10 relative z-10">
                <div className="relative group/field">
                    <div className="absolute top-4 left-6 opacity-5 pointer-events-none text-[11px] font-black uppercase tracking-widest group-focus-within/field:opacity-40 transition-opacity italic italic duration-700">PTR_ENTRY_GATEWAY_TX</div>
                    <textarea
                        rows="8"
                        value={nuevoComentario}
                        onChange={e => setNuevoComentario(e.target.value)}
                        placeholder="ENTER_TECHNICAL_OBSERVATIONS_OR_UPDATE_LOG_VECTORS..."
                        className={textareaCls}
                        autoComplete="off"
                    />
                    <div className="mt-4 text-right opacity-10 text-[9px] font-black tracking-widest italic group-hover/field:opacity-40 duration-700">0x{nuevoComentario.length.toString(16).toUpperCase().padStart(4, '0')}_HEX_BYTES_RX</div>
                </div>

                {/* Preview de archivos a adjuntar / Buffer fragments RX */}
                {archivosComentario.length > 0 && (
                    <div className="flex flex-wrap gap-6 animate-fadeInUp">
                        {archivosComentario.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-6 text-[11px] font-black uppercase tracking-widest bg-bg-base border-4 border-border-strong px-6 py-3 text-text-primary shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-text-accent transition-all group/frag italic">
                                <span className="text-text-accent opacity-40 group-hover/frag:opacity-100 group-hover/frag:animate-pulse">[FRAGMT]</span>
                                <span className="truncate max-w-[200px]">{f.name.toUpperCase().replace(/ /g, '_')}</span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveFile(i)}
                                    className="text-text-muted hover:text-text-accent transition-all text-2xl leading-none active:scale-50 px-2 py-1 bg-bg-surface shadow-inner border-2 border-transparent hover:border-text-accent/20"
                                    title="UNLINK_FRAGMENT"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action protocol control bar RX */}
            <div className="mt-12 pt-10 border-t-4 border-border-default/30 flex flex-col sm:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8 w-full sm:w-auto">
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
                        className="w-full sm:w-auto text-[11px] font-black text-text-muted hover:text-text-primary hover:border-text-accent hover:bg-bg-base uppercase tracking-[0.5em] border-4 border-border-strong px-10 py-5 transition-all flex items-center justify-center gap-6 group/adj active:scale-90 bg-bg-base/30 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden"
                    >
                        <span className="opacity-40 group-hover/adj:scale-150 transition-all duration-700 italic group-hover/adj:rotate-90 group-hover/adj:text-text-accent">+</span>
                        <span className="relative z-10">[ ATTACH_PAYLOAD ]</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-text-accent opacity-0 group-hover/adj:opacity-100 transition-opacity"></div>
                    </button>
                </div>
                <button 
                    type="submit" 
                    disabled={(nuevoComentario.trim().length === 0 && archivosComentario.length === 0) || saving}
                    className="w-full sm:w-auto bg-text-primary border-4 border-text-primary px-16 py-5 text-[13px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.8em] transition-all flex items-center justify-center gap-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] disabled:opacity-20 group/submit active:scale-95 relative overflow-hidden italic"
                >
                    <span className="relative z-10 flex items-center gap-6 group-hover/submit:tracking-[1.2em] transition-all duration-700 uppercase not-italic">
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                <span>SYNCING_COMMITS...</span>
                            </>
                        ) : (
                            <>
                                <span>[ COMMIT_LOG_ENTRY ]</span>
                                <span className="opacity-20 group-hover/submit:translate-x-6 transition-all duration-500 font-normal">»</span>
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/submit:opacity-100 transition-opacity"></div>
                </button>
            </div>
            
            <div className="pt-8 flex justify-between items-center opacity-10 font-black text-[9px] uppercase tracking-[1em] italic group-hover/main:opacity-40 transition-opacity pointer-events-none">
                 <span>TRANSACTION_LOGGING_ACTIVE</span>
                 <span>_0xFD42_SYNCED</span>
            </div>
        </form>
    );
};
