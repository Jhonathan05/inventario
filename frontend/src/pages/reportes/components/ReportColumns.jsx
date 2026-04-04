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
        <div className="space-y-12 font-mono animate-fadeIn mb-24">
            {/* COLUMN SEQUENCE MANAGER */}
            {selectedColumns.length > 0 && (
                <div className="bg-bg-surface border-4 border-border-default p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group hover:border-text-accent transition-all duration-500 relative overflow-hidden active:scale-[0.99]">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-[1.5em] group-hover:opacity-20 italic">SEQ_QUEUE_RX_v4</div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-text-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    
                    <h3 className="text-[12px] font-black text-text-accent uppercase tracking-[0.5em] mb-12 border-b-4 border-border-default/40 pb-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.4)]"></div>
                            <span>↕ COLUMN_SEQUENCE_LOG</span>
                        </div>
                        <span className="text-text-primary bg-bg-base px-6 py-2 border-2 border-border-default/80 shadow-inner tabular-nums font-black scale-90">0x{selectedColumns.length.toString().padStart(2, '0')}</span>
                    </h3>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-6 shadow-inner bg-bg-base/20 border-2 border-border-default/20 p-4">
                        {selectedColumns.map((col, idx) => (
                            <div key={col.key} className="flex items-center justify-between bg-bg-surface border-4 border-border-default px-8 py-5 transition-all group/row hover:border-text-accent/60 hover:bg-bg-elevated/40 hover:translate-x-2 shadow-lg active:scale-95">
                                <div className="flex-1 min-w-0 flex items-center gap-6">
                                    <div className="text-text-muted text-[11px] font-black opacity-30 tabular-nums bg-bg-base px-3 border border-border-default group-hover/row:opacity-100 group-hover/row:text-text-accent transition-all">
                                        [{String(idx + 1).padStart(2, '0')}]
                                    </div>
                                    <span className="text-text-primary text-[14px] font-black uppercase tracking-[0.05em] truncate group-hover/row:text-text-accent group-hover/row:tracking-[0.1em] transition-all">
                                        {col.label.toUpperCase().replace(/ /g, '_')}
                                    </span>
                                </div>
                                <div className="flex gap-6 ml-10 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                    <button 
                                        onClick={() => moveColumn(idx, -1)} 
                                        disabled={idx === 0}
                                        className="bg-bg-base border-2 border-border-default px-4 py-2 text-[10px] font-black text-text-muted hover:text-text-accent disabled:opacity-5 transition-all hover:scale-110 active:scale-95 shadow-inner uppercase tracking-widest disabled:scale-100 disabled:cursor-not-allowed"
                                    >
                                        &uarr;_UP
                                    </button>
                                    <button 
                                        onClick={() => moveColumn(idx, 1)} 
                                        disabled={idx === selectedColumns.length - 1}
                                        className="bg-bg-base border-2 border-border-default px-4 py-2 text-[10px] font-black text-text-muted hover:text-text-accent disabled:opacity-5 transition-all hover:scale-110 active:scale-95 shadow-inner uppercase tracking-widest disabled:scale-100 disabled:cursor-not-allowed"
                                    >
                                        &darr;_DN
                                    </button>
                                </div>
                                {/* Selection highlight detail */}
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-text-accent opacity-0 group-hover/row:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MANIFEST SELECTOR */}
            <div className="bg-bg-surface border-4 border-border-default p-12 shadow-[0_50px_150px_rgba(0,0,0,0.7)] group hover:border-text-accent transition-all duration-500 relative overflow-hidden active:scale-[0.99] group/manifest">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[2em] group-hover:opacity-15 group-hover:translate-x-4 transition-all italic">DIM_MANIFEST_POOL_v4.2</div>
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 pb-8 border-b-4 border-border-default/50 gap-8">
                    <div className="flex items-center gap-6">
                         <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_12px_rgba(var(--text-accent),0.5)]"></div>
                         <h3 className="text-[14px] font-black text-text-accent uppercase tracking-[0.6em]">
                            ☑ COLUMN_MANIFEST_GATE
                         </h3>
                    </div>
                    <div className="flex items-center gap-6 bg-bg-base/50 px-8 py-3 border-2 border-border-default shadow-inner">
                        <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40">FRAGMENT_SEL_RATIO:</span>
                        <span className="text-text-primary text-[13px] font-black tabular-nums tracking-widest bg-bg-surface px-4 py-1 border border-border-default">
                             {selectedColumns.length.toString().padStart(2, '0')} <span className="text-text-accent opacity-40 text-xl font-normal">/</span> {columns.length.toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
                
                <div className="flex gap-10 mb-12 flex-wrap bg-bg-base/30 p-8 border-4 border-dashed border-border-default/20 shadow-inner group-hover/manifest:border-text-accent/10 transition-all">
                    <button onClick={selectAll} className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted hover:text-text-accent transition-all hover:scale-105 active:scale-95 border-b-2 border-transparent hover:border-text-accent shadow-2xl">[ ALL ]</button>
                    <button onClick={selectNone} className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted hover:text-text-accent transition-all hover:scale-105 active:scale-95 border-b-2 border-transparent hover:border-text-accent shadow-2xl">[ NONE ]</button>
                    <button onClick={selectDefaults} className="text-[11px] font-black uppercase tracking-[0.4em] text-text-accent hover:text-text-primary transition-all hover:scale-105 active:scale-95 underline-offset-8 decoration-4 decoration-text-accent/20 hover:decoration-text-accent shadow-2xl bg-text-accent/5 px-6 py-2 border border-text-accent/10">[ RESET_DEFAULT_STREAM_CONFIG ]</button>
                </div>

                <div className="space-y-14 max-h-[600px] overflow-y-auto pr-8 custom-scrollbar bg-bg-base/10 shadow-inner p-4 border border-border-default/10">
                    {Object.entries(groups).map(([groupName, groupCols]) => (
                        <div key={groupName} className="space-y-8 group/groupcard relative">
                            <div className="flex items-center gap-8 relative">
                                <div className="absolute left-0 top-1/2 w-8 h-px bg-text-accent opacity-40"></div>
                                <span className="text-[11px] font-black text-text-muted uppercase tracking-[1em] pl-14 flex-shrink-0 opacity-40 group-hover/groupcard:opacity-100 group-hover/groupcard:text-text-accent transition-all italic">
                                    // {groupName.toUpperCase().replace(/ /g, '_')}
                                </span>
                                <div className="h-[2px] bg-gradient-to-r from-border-default/50 via-transparent to-transparent flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-14">
                                {groupCols.map(col => (
                                    <label 
                                        key={col.key} 
                                        className={`flex items-center px-8 py-5 gap-8 cursor-pointer transition-all border-4 group/item relative overflow-hidden shadow-md active:scale-95 ${col.selected ? 'bg-text-accent/10 border-text-accent/40 shadow-[0_0_20px_rgba(var(--text-accent),0.05)]' : 'bg-bg-surface/50 border-border-default/40 hover:border-text-accent/40 hover:bg-bg-elevated/40'}`}
                                    >
                                        <div className="relative flex items-center justify-center transform group-hover/item:scale-110 transition-transform">
                                            <input 
                                                type="checkbox" 
                                                checked={col.selected} 
                                                onChange={() => toggleColumn(col.key)}
                                                className="appearance-none w-6 h-6 border-2 border-border-default bg-bg-base checked:bg-text-accent checked:border-text-accent focus:outline-none transition-all cursor-pointer shadow-inner" 
                                            />
                                            {col.selected && (
                                                <div className="absolute pointer-events-none text-bg-base text-[14px] font-black select-none translate-y-[2px]">
                                                    &#10003;
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-[13px] font-black uppercase tracking-[0.05em] transition-all group-hover/item:tracking-[0.15em] ${col.selected ? 'text-text-primary' : 'text-text-muted group-hover/item:text-text-primary italic group-hover/item:not-italic'}`}>
                                            {col.label.toUpperCase().replace(/ /g, '_')}
                                        </span>
                                        {col.selected && (
                                             <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-text-accent animate-pulse"></div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Logic integrity Footer detail */}
            <div className="mt-14 pt-8 border-t-2 border-border-default/20 flex flex-col items-center">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[1.5em] opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden italic leading-none animate-pulse">DIMENSIONAL_PARITY_VERIFICATION_COMPLETE // 0xAF42</p>
            </div>
        </div>
    );
};
