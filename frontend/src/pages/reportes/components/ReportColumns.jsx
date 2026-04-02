export const ReportColumns = ({ 
    columns, 
    groups, 
    selectedColumns, 
    toggleColumn, 
    selectAll, 
    selectNone, 
    selectDefaults, 
    moveColumn 
}) => {
    return (
        <div className="space-y-8 font-mono animate-fadeIn">
            {/* ORDEN DE COLUMNAS / SEQUENCE_MANAGER */}
            {selectedColumns.length > 0 && (
                <div className="bg-bg-surface border border-border-default p-8 shadow-2xl group hover:border-border-strong transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest">SEQ_QUEUE_RX</div>
                    <h3 className="text-[10px] font-black text-text-accent uppercase tracking-[0.4em] mb-8 border-b border-border-default/50 pb-4 flex items-center justify-between">
                        <span>↕ COLUMN_SEQUENCE_LOG</span>
                        <span className="opacity-40">COUNT: {selectedColumns.length.toString().padStart(2, '0')}</span>
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-3">
                        {selectedColumns.map((col, idx) => (
                            <div key={col.key} className="flex items-center justify-between bg-bg-base/50 border border-border-default px-4 py-3 transition-all group/row hover:border-text-accent/30 hover:bg-bg-elevated/20">
                                <span className="text-text-primary text-[11px] font-black uppercase tracking-tight truncate flex-1 flex items-center gap-3">
                                    <span className="text-text-muted text-[9px] font-black opacity-30">[{String(idx + 1).padStart(2, '0')}]</span>
                                    {col.label.replace(/ /g, '_')}
                                </span>
                                <div className="flex gap-4 ml-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <button 
                                        onClick={() => moveColumn(idx, -1)} 
                                        disabled={idx === 0}
                                        className="text-text-muted hover:text-text-accent disabled:opacity-10 text-[9px] font-black px-2 py-1 leading-none uppercase transition-colors"
                                    >
                                        [ UP ]
                                    </button>
                                    <button 
                                        onClick={() => moveColumn(idx, 1)} 
                                        disabled={idx === selectedColumns.length - 1}
                                        className="text-text-muted hover:text-text-accent disabled:opacity-10 text-[9px] font-black px-2 py-1 leading-none uppercase transition-colors"
                                    >
                                        [ DN ]
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SELECTOR DE COLUMNAS / MANIFEST_SELECTOR */}
            <div className="bg-bg-surface border border-border-default p-8 shadow-2xl group hover:border-border-strong transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest">MANIFEST_POOL</div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-default/50">
                    <h3 className="text-[10px] font-black text-text-accent uppercase tracking-[0.4em]">
                        ☑ COLUMN_MANIFEST
                    </h3>
                    <span className="text-[9px] font-black text-text-muted opacity-40 uppercase tracking-widest">
                        {selectedColumns.length.toString().padStart(2, '0')} / {columns.length.toString().padStart(2, '0')} SELECTED
                    </span>
                </div>
                
                <div className="flex gap-6 mb-8 flex-wrap border-b border-border-default/20 pb-6">
                    <button onClick={selectAll} className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">[ ALL ]</button>
                    <button onClick={selectNone} className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">[ NONE ]</button>
                    <button onClick={selectDefaults} className="text-[9px] font-black uppercase tracking-widest text-text-accent hover:text-text-primary transition-all underline decoration-2 underline-offset-4 decoration-text-accent/30">[ RESET_DEFAULT ]</button>
                </div>

                <div className="space-y-10 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                    {Object.entries(groups).map(([groupName, groupCols]) => (
                        <div key={groupName} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] flex-shrink-0">/ {groupName.toUpperCase()}</span>
                                <div className="h-px bg-border-default/30 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {groupCols.map(col => (
                                    <label 
                                        key={col.key} 
                                        className={`flex items-center px-4 py-2.5 gap-4 cursor-pointer transition-all border group/item ${col.selected ? 'bg-text-accent/5 border-text-accent/20' : 'bg-transparent border-transparent hover:bg-bg-elevated/30'}`}
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <input 
                                                type="checkbox" 
                                                checked={col.selected} 
                                                onChange={() => toggleColumn(col.key)}
                                                className="appearance-none w-4 h-4 border border-border-default bg-bg-base checked:bg-text-primary checked:border-text-primary focus:outline-none transition-all cursor-pointer" 
                                            />
                                            {col.selected && (
                                                <div className="absolute pointer-events-none text-bg-base text-[10px] font-black select-none">
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-tight transition-colors ${col.selected ? 'text-text-primary' : 'text-text-muted group-hover/item:text-text-primary'}`}>
                                            {col.label.replace(/ /g, '_')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
