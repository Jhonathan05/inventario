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
    const labelCls = "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-text-primary italic opacity-80 leading-none group-hover/main:text-text-accent transition-all duration-700";
    const textareaCls = "w-full bg-bg-base border-2 border-border-default p-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-text-primary focus:outline-none focus:border-text-accent transition-all resize-none leading-relaxed placeholder:opacity-10 shadow-inner italic";

    return (
        <form onSubmit={handleAgregarComentario} className="bg-bg-surface border-2 border-border-default p-3 sm:p-4 font-mono shadow-lg no-print relative overflow-hidden group/main hover:border-text-accent/20 transition-all duration-1000">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-[1em] group-hover/main:opacity-20 transition-all italic hidden sm:block">LOG_INPUT</div>
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-text-accent/40 via-transparent to-transparent opacity-20"></div>

            <div className="flex items-center gap-2 border-b-2 border-border-default pb-2 mb-3 sm:mb-4">
                <div className="w-5 h-5 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-[10px] bg-bg-base shadow-lg italic flex-shrink-0">&kappa;</div>
                <h3 className={labelCls}>
                    / APPEND_LOG
                </h3>
            </div>
            
            <div className="space-y-4 sm:space-y-6 relative z-10">
                <div className="relative group/field">
                    <div className="absolute top-2 left-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest group-focus-within/field:opacity-40 transition-opacity italic duration-700">PTR_ENTRY</div>
                    <textarea
                        rows="4"
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
                    <div className="flex flex-wrap gap-2 sm:gap-3 animate-fadeInUp">
                        {archivosComentario.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wide bg-bg-base border-2 border-border-strong px-2 sm:px-4 py-1 sm:py-2 text-text-primary shadow-lg hover:border-text-accent transition-all group/frag italic">
                                <span className="text-text-accent opacity-40 hidden sm:inline">[FRAG]</span>
                                <span className="truncate max-w-[100px] sm:max-w-[180px]">{f.name.toUpperCase().replace(/ /g, '_')}</span>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveFile(i)}
                                    className="text-text-muted hover:text-text-accent transition-all text-xl leading-none active:scale-50 px-1 py-0.5 bg-bg-surface shadow-inner border border-transparent hover:border-text-accent/20"
                                    title="UNLINK"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action protocol control bar RX */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-border-default/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-6">
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
                        className="w-full sm:w-auto text-[9px] sm:text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent hover:bg-bg-base uppercase tracking-[0.2em] border-2 border-border-strong px-4 sm:px-6 py-2 sm:py-3 transition-all flex items-center justify-center gap-3 sm:gap-4 group/adj active:scale-95 bg-bg-base/30 shadow-lg relative overflow-hidden"
                    >
                        <span className="opacity-40 group-hover/adj:scale-125 transition-all duration-700 italic group-hover/adj:text-text-accent">+</span>
                        <span className="relative z-10">[ ATTACH ]</span>
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-text-accent opacity-0 group-hover/adj:opacity-100 transition-opacity"></div>
                    </button>
                </div>
                <button 
                    type="submit" 
                    disabled={(nuevoComentario.trim().length === 0 && archivosComentario.length === 0) || saving}
                    className="w-full sm:w-auto bg-text-primary border-2 border-text-primary px-6 sm:px-8 py-2 sm:py-3 text-[10px] sm:text-[11px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 sm:gap-4 shadow-lg disabled:opacity-20 group/submit active:scale-95 relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-4 group-hover/submit:tracking-[0.6em] transition-all duration-700 uppercase not-italic">
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
