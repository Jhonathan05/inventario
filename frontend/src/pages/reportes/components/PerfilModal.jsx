export const PerfilModal = ({ 
    show, 
    onClose, 
    editingPerfil, 
    perfilForm, 
    setPerfilForm, 
    perfilError, 
    onSave, 
    selectedColumnsCount 
}) => {
    if (!show) return null;

    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-[13px] font-black uppercase tracking-[0.1em] text-text-primary placeholder:opacity-10 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner focus:shadow-[0_0_20px_rgba(var(--text-accent),0.05)]";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono selection:bg-text-accent selection:text-bg-base" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-6 text-center">
                <div className="fixed inset-0 bg-bg-base/90 backdrop-blur-md transition-opacity duration-500" onClick={onClose}></div>
                
                <div className="relative bg-bg-surface border-4 border-border-default p-12 text-left shadow-[0_60px_150px_rgba(0,0,0,0.8)] w-full max-w-xl z-10 overflow-hidden animate-fadeIn scale-100 ring-4 ring-inset ring-black/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-sm font-black uppercase tracking-[1.5em] italic">PROFILE_COMMIT_RX_0x0D</div>
                    <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-30"></div>
                    
                    <div className="flex items-center justify-between mb-12 border-b-4 border-border-default pb-10 relative">
                        <div>
                            <h3 className="text-xl font-black text-text-primary uppercase tracking-[0.4em] flex items-center gap-6">
                                <span className="text-text-accent opacity-40">/</span>
                                {editingPerfil ? 'modify_profile_node' : 'spawn_new_profile_node'}
                            </h3>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="w-2 h-2 bg-text-accent animate-pulse shadow-[0_0_8px_rgba(var(--text-accent),0.4)]"></div>
                                <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic">TARGET_POOL: analytics_profile_manifest.db // USER_SYNCCON_OK</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:scale-125 hover:rotate-90 active:scale-95 bg-bg-base px-4 py-2 border-2 border-border-default shadow-inner"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-4 group/field">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.5em] group-focus-within/field:text-text-accent transition-colors opacity-70">
                                :: PROFILE_IDENT_NAME_STR *
                            </label>
                            <input 
                                type="text" 
                                value={perfilForm.nombre}
                                onChange={e => setPerfilForm(p => ({ ...p, nombre: e.target.value.toUpperCase() }))}
                                placeholder="EX: CORE_ASSET_INVENTORY_BUF"
                                className={inputCls}
                                autoFocus
                            />
                        </div>

                        <div className="space-y-4 group/field">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.5em] group-focus-within/field:text-text-accent transition-colors opacity-70">
                                :: PROFILE_DESCRIPTION_LOG_BUFFER
                            </label>
                            <textarea 
                                value={perfilForm.descripcion}
                                onChange={e => setPerfilForm(p => ({ ...p, descripcion: e.target.value.toUpperCase() }))}
                                placeholder="ENTER_SYSTEM_MANIFEST_DESCRIPTION_DESC..."
                                rows={3}
                                className={`${inputCls} resize-none min-h-[120px]`}
                            />
                        </div>

                        {!editingPerfil && (
                            <div className="bg-bg-base border-l-8 border-text-accent/40 p-8 text-[12px] text-text-accent uppercase tracking-widest leading-relaxed shadow-inner font-black group/notice relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 text-[8px] animate-pulse">0xFD_NOTICE</div>
                                <span className="text-xl mr-4 text-text-accent">!</span> 
                                ATTENTION :: CURRENT_SEQUENCE_OF <span className="text-text-primary bg-bg-surface px-4 py-1 border border-border-default shadow-md">[{selectedColumnsCount.toString().padStart(2, '0')}]</span>_COLUMN_PTRS 
                                WILL_BE_MAPPED_TO_THIS_PROFILE_MANIFEST_UPON_COMMIT_TX.
                            </div>
                        )}

                        {perfilError && (
                            <div className="p-6 border-4 border-text-accent bg-text-accent/5 text-text-accent font-black text-[11px] uppercase tracking-[0.4em] animate-shake relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-text-accent animate-pulse"></div>
                                !!! CRITICAL_AUTH_SYSTEM_REJECTED_IO: {perfilError.toUpperCase().replace(/ /g, '_')} !!!
                            </div>
                        )}
                    </div>

                    <div className="mt-16 pt-10 border-t-4 border-border-default/50 flex flex-col sm:flex-row justify-end gap-8">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-10 py-5 text-[13px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.3em] border-4 border-border-default hover:border-text-accent transition-all bg-bg-base/30 shadow-2xl active:scale-95 group/cancel"
                        >
                            <span className="group-hover/cancel:-translate-x-2 transition-transform inline-block">[ &lsaquo; ] DISCARD_TX</span>
                        </button>
                        <button 
                            onClick={onSave}
                            disabled={!perfilForm.nombre.trim()}
                            className="flex-1 px-10 py-5 text-[13px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_0_50px_rgba(var(--text-primary),0.2)] disabled:opacity-10 uppercase tracking-[0.5em] active:scale-95 group/commit relative overflow-hidden ring-4 ring-inset ring-black/5"
                        >
                            <span className="relative z-10 group-hover/commit:tracking-[0.6em] transition-all">
                                {editingPerfil ? '[ UPDATE_RECORD_COMMIT ]' : '[ EXECUTE_PROFILE_COMMIT ]'}
                                <span className="ml-4 opacity-50 group-hover/commit:translate-x-4 transition-all inline-block">&rsaquo;&rsaquo;</span>
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/commit:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
