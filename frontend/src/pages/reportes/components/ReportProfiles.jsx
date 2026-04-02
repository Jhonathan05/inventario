export const ReportProfiles = ({ 
    perfiles, 
    selectedPerfil, 
    applyPerfil, 
    handleEditPerfil, 
    handleUpdatePerfilColumns, 
    handleDeletePerfil, 
    selectedColumns, 
    onNewPerfil
}) => {
    return (
        <div className="bg-bg-surface border border-border-default p-8 font-mono shadow-2xl group hover:border-border-strong transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black">PROFILE_STORAGE_RX</div>
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-default/50">
                <h3 className="text-[10px] font-black text-text-accent uppercase tracking-[0.4em]"># ORDER_PROFILES</h3>
                <button 
                    onClick={onNewPerfil}
                    className="bg-bg-elevated border border-border-strong px-4 py-1.5 text-[9px] font-black text-text-primary hover:text-text-accent uppercase tracking-widest transition-all"
                >
                    [ + ] NEW_PROFILE
                </button>
            </div>

            {perfiles.length === 0 ? (
                <div className="py-8 text-center opacity-30">
                    <p className="text-[10px] text-text-muted italic uppercase tracking-widest">! NO_PROFILES_FOUND_IN_BUFFER</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {perfiles.map(perfil => (
                        <div 
                            key={perfil.id}
                            className={`p-6 cursor-pointer transition-all border group/card relative overflow-hidden ${selectedPerfil?.id === perfil.id
                                ? 'bg-text-accent/5 border-text-accent shadow-[0_0_15px_rgba(var(--color-accent),0.1)]'
                                : 'bg-bg-base/30 border-border-default hover:border-border-strong hover:bg-bg-base/50'
                                }`}
                            onClick={() => applyPerfil(perfil)}
                        >
                            <div className="flex flex-col relative z-10">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {perfil.esPredefined && <span className="text-[9px] text-text-accent font-black animate-pulse" title="PREDEFINED_NODE">[*]</span>}
                                        <span className={`text-[11px] font-black uppercase tracking-tight truncate ${selectedPerfil?.id === perfil.id ? 'text-text-primary' : 'text-text-primary/70'}`}>
                                            {perfil.nombre.replace(/ /g, '_')}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handleEditPerfil(perfil)} 
                                            title="MODIFY_METADATA"
                                            className="text-text-muted hover:text-text-accent text-[10px] font-black transition-colors"
                                        >
                                            [E]
                                        </button>
                                        {selectedPerfil?.id === perfil.id && selectedColumns.length > 0 && (
                                            <button 
                                                onClick={() => handleUpdatePerfilColumns(perfil)} 
                                                title="COMMIT_CURRENT_COLUMNS"
                                                className="text-text-accent hover:text-text-primary text-[10px] font-black animate-pulse transition-colors"
                                            >
                                                [C]
                                            </button>
                                        )}
                                        {!perfil.esPredefined && (
                                            <button 
                                                onClick={() => handleDeletePerfil(perfil)} 
                                                title="PURGE_PROFILE"
                                                className="text-text-muted hover:text-text-accent text-[10px] font-black transition-colors"
                                            >
                                                [X]
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {perfil.descripcion && (
                                    <p className="text-[9px] text-text-muted uppercase tracking-[0.1em] truncate mb-4 opacity-50 group-hover/card:opacity-100 transition-opacity">
                                        :: {perfil.description || perfil.descripcion}
                                    </p>
                                )}
                                
                                <div className="flex items-baseline justify-between pt-2 border-t border-border-default/20">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[8px] font-black text-text-accent uppercase tracking-widest opacity-60">
                                            0x{perfil.columnas?.length.toString().padStart(2, '0')} COLUMNS
                                        </span>
                                    </div>
                                    {selectedPerfil?.id === perfil.id && (
                                        <span className="text-[8px] font-black text-text-accent uppercase tracking-[0.3em] blink">ACTIVE_NODE_RX</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Decorative background label for active card */}
                            {selectedPerfil?.id === perfil.id && (
                                <div className="absolute -bottom-1 -right-1 opacity-10 text-[40px] font-black pointer-events-none select-none tracking-tighter uppercase leading-none">
                                    ACTV
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
