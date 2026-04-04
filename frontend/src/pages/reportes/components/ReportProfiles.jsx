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
        <div className="bg-bg-surface border-4 border-border-default p-10 font-mono shadow-[0_30px_80px_rgba(0,0,0,0.5)] group hover:border-text-accent transition-all duration-500 overflow-hidden relative active:scale-[0.99]">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:opacity-15 transition-all italic">PROFILE_MEM_TX_v4</div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-text-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="flex items-center justify-between mb-10 pb-6 border-b-4 border-border-default/50">
                <div className="flex items-center gap-5">
                    <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.4)]"></div>
                    <h3 className="text-[12px] font-black text-text-accent uppercase tracking-[0.5em]"># ORDER_PROFILES</h3>
                </div>
                <button 
                    onClick={onNewPerfil}
                    className="bg-text-primary border-2 border-text-primary px-6 py-2 text-[10px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.3em] transition-all shadow-xl active:scale-90 group/add"
                >
                    <span className="group-hover/add:tracking-[0.5em] transition-all">[ + ] SPAWN_NEW</span>
                </button>
            </div>

            {perfiles.length === 0 ? (
                <div className="py-14 text-center opacity-30 bg-bg-base/30 border-2 border-dashed border-border-default/20 italic">
                    <p className="text-[11px] text-text-muted uppercase tracking-[0.6em] animate-pulse">! NO_PROFILES_FOUND_IN_BUFFER</p>
                    <p className="text-[9px] mt-4 opacity-40 uppercase tracking-[0.4em]">INITIATE_FIRST_SEQ_NODE_TO_STORE</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {perfiles.map(perfil => (
                        <div 
                            key={perfil.id}
                            className={`p-8 cursor-pointer transition-all border-4 group/card relative overflow-hidden active:scale-95 shadow-lg ${selectedPerfil?.id === perfil.id
                                ? 'bg-text-accent/5 border-text-accent shadow-[0_0_30px_rgba(var(--text-accent),0.1)]'
                                : 'bg-bg-base/30 border-border-default hover:border-text-accent/40 hover:bg-bg-base/50'
                                }`}
                            onClick={() => applyPerfil(perfil)}
                        >
                            <div className="flex flex-col relative z-10">
                                <div className="flex items-start justify-between gap-6 mb-5">
                                    <div className="flex items-center gap-4 min-w-0">
                                        {perfil.esPredefined && <span className="text-[10px] text-text-accent font-black animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.3)] bg-text-accent/10 px-2 py-0.5 border border-text-accent/20" title="PREDEFINED_NODE">CORE</span>}
                                        <span className={`text-[14px] font-black uppercase tracking-tight truncate border-b-2 border-transparent transition-all group-hover/card:border-text-primary/20 ${selectedPerfil?.id === perfil.id ? 'text-text-primary underline decoration-text-accent decoration-4 underline-offset-8' : 'text-text-primary/70'}`}>
                                            {perfil.nombre.replace(/ /g, '_')}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handleEditPerfil(perfil)} 
                                            title="MODIFY_METADATA"
                                            className="text-text-muted hover:text-text-accent text-[11px] font-black transition-all hover:scale-125 bg-bg-surface px-2 border border-border-default shadow-inner"
                                        >
                                            [E]
                                        </button>
                                        {selectedPerfil?.id === perfil.id && selectedColumns.length > 0 && (
                                            <button 
                                                onClick={() => handleUpdatePerfilColumns(perfil)} 
                                                title="COMMIT_CURRENT_COLUMNS"
                                                className="text-text-accent hover:text-text-primary text-[11px] font-black animate-pulse transition-all hover:scale-125 bg-bg-surface px-2 border border-text-accent/40 shadow-inner"
                                            >
                                                [C]
                                            </button>
                                        )}
                                        {!perfil.esPredefined && (
                                            <button 
                                                onClick={() => handleDeletePerfil(perfil)} 
                                                title="PURGE_PROFILE"
                                                className="text-text-muted hover:text-text-accent text-[11px] font-black transition-all hover:scale-125 bg-bg-surface px-2 border border-border-default shadow-inner"
                                            >
                                                [X]
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {perfil.descripcion && (
                                    <p className="text-[10px] text-text-muted uppercase tracking-[0.1em] truncate mb-6 opacity-40 group-hover/card:opacity-80 transition-all italic border-l-2 border-border-default/30 pl-4">
                                        :: {perfil.description || perfil.descripcion}
                                    </p>
                                )}
                                
                                <div className="flex items-baseline justify-between pt-4 border-t-2 border-border-default/20">
                                    <div className="flex items-center gap-4 bg-bg-base/40 px-4 py-1 border border-border-default/30 shadow-inner">
                                        <span className="text-[9px] font-black text-text-accent uppercase tracking-widest opacity-80 tabular-nums">
                                            0x{perfil.columnas?.length.toString().padStart(2, '0')} COL_NODES
                                        </span>
                                    </div>
                                    {selectedPerfil?.id === perfil.id && (
                                        <span className="text-[9px] font-black text-text-accent uppercase tracking-[0.4em] blink italic bg-text-accent/5 px-4 animate-pulse">ACTIVE_GATE_RX</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Decorative background label for active card */}
                            {selectedPerfil?.id === perfil.id && (
                                <div className="absolute -bottom-4 -right-2 opacity-5 text-[60px] font-black pointer-events-none select-none tracking-tighter uppercase italic leading-none group-hover:opacity-10 transition-opacity">
                                    MEM_ACTIVE
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Logic integrity Footer detail */}
            <div className="mt-10 pt-6 border-t border-border-default/20 flex flex-col items-center">
                 <p className="text-[8px] font-black text-text-muted uppercase tracking-[1em] opacity-20 group-hover:opacity-60 transition-opacity whitespace-nowrap overflow-hidden italic leading-none">STREAMING_PROFILE_DATA_RX_COMMIT</p>
                 <div className="mt-2 w-full h-[1px] bg-gradient-to-r from-transparent via-text-accent/20 to-transparent"></div>
            </div>
        </div>
    );
};
