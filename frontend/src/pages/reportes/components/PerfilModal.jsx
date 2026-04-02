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

    const inputCls = "block w-full bg-bg-base border border-border-default py-3 px-4 text-[11px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-border-strong transition-all appearance-none";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <div className="fixed inset-0 bg-bg-base/80 border-border-default backdrop-blur-sm transition-opacity" onClick={onClose}></div>
                
                <div className="relative bg-bg-surface border border-border-default p-10 text-left shadow-3xl w-full max-w-md z-10 overflow-hidden animate-fadeIn">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black uppercase tracking-widest">PROFILE_COMMIT_RX</div>
                    
                    <div className="flex items-center justify-between mb-10 border-b border-border-default pb-8">
                        <div>
                            <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.4em]">
                                {editingPerfil ? '/ edit_profile_node' : '/ create_new_profile_node'}
                            </h3>
                            <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest opacity-60">TARGET_POOL: profile_manifest.db</p>
                        </div>
                        <button onClick={onClose} className="text-text-muted hover:text-text-accent text-2xl leading-none font-black transition-colors">
                            [ &times; ]
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2 group/field">
                            <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] group-hover/field:text-text-accent transition-colors">:: PROFILE_IDENT_NAME *</label>
                            <input 
                                type="text" 
                                value={perfilForm.nombre}
                                onChange={e => setPerfilForm(p => ({ ...p, nombre: e.target.value.toUpperCase() }))}
                                placeholder="EX: CORE_ASSET_INVENTORY"
                                className={inputCls}
                            />
                        </div>

                        <div className="space-y-2 group/field">
                            <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] group-hover/field:text-text-accent transition-colors">:: PROFILE_DESCRIPTION_LOG</label>
                            <textarea 
                                value={perfilForm.descripcion}
                                onChange={e => setPerfilForm(p => ({ ...p, descripcion: e.target.value.toUpperCase() }))}
                                placeholder="SYSTEM_MANIFEST_DESCRIPTION..."
                                rows={2}
                                className={`${inputCls} resize-none`}
                            />
                        </div>

                        {!editingPerfil && (
                            <div className="bg-bg-base/30 border border-text-accent/30 p-6 text-[10px] text-text-accent uppercase tracking-widest leading-relaxed">
                                <span className="font-black">[ NOTICE ]</span> :: CURRENT_ARRAY_OF <span className="font-black text-text-primary">[{selectedColumnsCount.toString().padStart(2, '0')}]</span>_COLUMNS 
                                WILL_BE_MAPPED_TO_THIS_PROFILE_MANIFEST_UPON_COMMIT.
                            </div>
                        )}

                        {perfilError && (
                            <div className="mb-8 p-4 border border-text-accent bg-bg-base text-text-accent font-black text-[10px] uppercase tracking-widest animate-pulse">
                                !! ERROR_SYSTEM_REJECTED: {perfilError.toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-border-default/50 flex flex-col sm:flex-row justify-end gap-6">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-8 py-4 text-[11px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.2em] border border-border-default hover:border-border-strong transition-all bg-bg-base/30 shadow-xl"
                        >
                            [ DISCARD_VIEW ]
                        </button>
                        <button 
                            onClick={onSave}
                            disabled={!perfilForm.nombre.trim()}
                            className="flex-1 px-8 py-4 text-[11px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.35em]"
                        >
                            {editingPerfil ? '[ UPDATE_RECORD ]' : '[ COMMIT_PROFILE ]'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
