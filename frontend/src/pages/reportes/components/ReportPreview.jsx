export const ReportPreview = ({ 
    previewData, 
    selectedColumns, 
    loading, 
    selectedPerfil 
}) => {
    if (loading) {
        return (
            <div className="bg-bg-surface border-8 border-border-default p-24 text-center h-full flex flex-col items-center justify-center min-h-[700px] font-mono shadow-[0_80px_200px_rgba(0,0,0,0.8)] relative overflow-hidden group/loading animate-fadeIn">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-[18px] font-black animate-pulse tracking-[2.5em] group-hover/loading:opacity-30 transition-all italic">SYSTEM_BUSY_STREAM_RX_0xFD</div>
                <div className="absolute top-0 left-0 w-full h-[10px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-40"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 border-[12px] border-border-default border-t-text-accent animate-spin rounded-full mb-12 shadow-[0_0_80px_rgba(var(--text-accent),0.4)]"></div>
                    <div className="space-y-6">
                        <div className="text-[22px] font-black text-text-accent animate-pulse uppercase tracking-[1.2em] mb-4 italic">
                            # EXECUTING_DATA_EXTRACTION_IO_v4
                        </div>
                        <div className="text-[12px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic border-l-8 border-border-default/30 pl-10 group-hover/loading:opacity-80 transition-opacity">
                            QUERYING_REMOTE_NODES // FRAGMENTING_DATA_STREAM // 0xFD42_SYNC_PROTOCOL
                        </div>
                    </div>
                </div>
                
                <div className="mt-20 w-96 h-[10px] bg-bg-base border-4 border-border-default relative overflow-hidden shadow-[inset_0_5px_20px_rgba(0,0,0,0.6)]">
                    <div className="absolute inset-0 bg-text-accent animate-loadingBarSlow shadow-[0_0_30px_rgba(var(--text-accent),0.8)]"></div>
                </div>
            </div>
        );
    }

    if (previewData.length === 0) {
        return null; // Parent handles empty state when not generating
    }

    return (
        <div className="bg-bg-surface border-8 border-border-default font-mono flex flex-col h-full min-h-[700px] shadow-[0_60px_180px_rgba(0,0,0,0.7)] animate-fadeIn relative overflow-hidden group/container hover:border-text-accent transition-all duration-1000">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-[22px] font-black uppercase tracking-[3em] group-hover/container:opacity-20 group-hover/container:translate-x-12 transition-all duration-1500 italic">DATA_BUFFER_STREAM_RX_v4.2_AF22</div>
            <div className="absolute top-0 left-0 w-[10px] h-full bg-gradient-to-b from-text-accent/30 via-transparent to-transparent opacity-0 group-hover/container:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="px-12 py-12 border-b-8 border-border-default bg-bg-base flex flex-wrap items-center justify-between gap-10 group/header relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-text-accent opacity-20"></div>
                
                <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.6em] flex items-center gap-8 relative z-10">
                    <div className="w-8 h-8 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xs rotate-45 group-hover/container:rotate-[225deg] transition-all duration-1000 shadow-[0_0_30px_rgba(var(--text-accent),0.4)] bg-bg-base">&alpha;</div>
                    PREVIEW_BUFFER: <span className="text-text-accent tabular-nums bg-bg-surface px-6 py-2 border-4 border-border-default shadow-[inset_0_5px_15px_rgba(0,0,0,0.6)] group-hover/header:border-text-accent/30 transition-all italic">{previewData.length.toString().padStart(4, '0')}</span>_NODES 
                    <span className="text-border-default h-10 w-[4px] mx-6 opacity-10"></span>
                    DIM_WIDTH: <span className="text-text-accent tabular-nums bg-bg-surface px-6 py-2 border-4 border-border-default shadow-[inset_0_5px_15px_rgba(0,0,0,0.6)] group-hover/header:border-text-accent/30 transition-all italic">{selectedColumns.length.toString().padStart(2, '0')}</span>_PTRS
                    {selectedPerfil && (
                        <>
                            <span className="text-border-default h-10 w-[4px] mx-6 opacity-10"></span>
                            <span className="text-text-muted opacity-40 italic tracking-[0.4em] bg-bg-surface px-8 py-2 border-4 border-text-accent/20 group-hover/header:opacity-100 group-hover/header:border-text-accent/40 transition-all duration-700">:: [PROFILE: {selectedPerfil.nombre.toUpperCase().replace(/ /g, '_')}]</span>
                        </>
                    )}
                </h3>
                <div className="flex items-center gap-10 relative z-10">
                    <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 italic border-r-4 border-border-default/40 pr-10 group-hover/header:opacity-100 transition-opacity">BUFFER_PARITY: 0xFD_OK</div>
                    <div className="bg-text-accent/10 text-text-accent px-10 py-3 border-4 border-text-accent/30 text-[13px] font-black uppercase tracking-[0.8em] animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.2)]">READY_FOR_EXPORT</div>
                </div>
            </div>
            
            <div className="overflow-auto flex-1 custom-scrollbar bg-bg-base/30 shadow-[inset_0_40px_150px_rgba(0,0,0,0.5)]">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-bg-base/98 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                            <th className="px-10 py-8 text-left text-[12px] font-black text-text-accent uppercase tracking-[0.5em] border-b-8 border-r-4 border-border-default bg-bg-surface/60 italic">#_ADDR_PTR</th>
                            {selectedColumns.map(col => (
                                <th key={col.key} className="px-10 py-8 text-left text-[12px] font-black text-text-muted uppercase tracking-[0.6em] whitespace-nowrap border-b-8 border-r-4 border-border-default min-w-[250px] group/th hover:bg-bg-surface transition-colors duration-500">
                                    <div className="flex items-center gap-6 group-hover/th:translate-x-4 transition-transform duration-700">
                                        <div className="w-2.5 h-2.5 bg-text-accent opacity-20 group-hover/th:opacity-100 group-hover/th:animate-pulse transition-all"></div>
                                        {col.label.toUpperCase().replace(/ /g, '_')}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y-8 divide-border-default/10">
                        {previewData.slice(0, 100).map((row, idx) => (
                            <tr key={idx} className="hover:bg-text-accent/5 transition-all group/row group relative active:scale-[0.99] duration-700">
                                <td className="px-10 py-6 text-[12px] font-black text-text-muted border-r-4 border-border-default/20 group-hover/row:text-text-accent group-hover/row:border-r-text-accent/40 transition-all tabular-nums bg-bg-base/40 group-hover:bg-bg-elevated/60 italic group-hover/row:not-italic group-hover/row:translate-x-2 duration-700">
                                    0x{(idx + 1).toString(16).padStart(4, '0').toUpperCase()}
                                </td>
                                {selectedColumns.map(col => (
                                    <td key={col.key} className="px-10 py-6 text-[15px] font-black text-text-primary/60 group-hover/row:text-text-primary transition-all whitespace-nowrap max-w-lg truncate border-r-4 border-border-default/10 uppercase tracking-widest tabular-nums font-mono italic group-hover:not-italic group-hover/row:translate-x-4 duration-1000">
                                        {row[col.label] ?? <span className="opacity-[0.05] font-black tracking-[1em] text-[11px] italic group-hover/row:opacity-15 transition-opacity">NULL_VAL_0x00_EMPTY</span>}
                                    </td>
                                ))}
                                {/* High-Fidelity active row marker RX */}
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-text-accent opacity-0 group-hover/row:opacity-100 transition-opacity duration-700 shadow-[0_0_30px_rgba(var(--text-accent),0.8)]"></div>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Context Metadata Footer RX Premium */}
            <div className="px-12 py-10 bg-bg-base border-t-8 border-border-default flex flex-col xl:flex-row justify-between items-center gap-12 shadow-[inset_0_20px_80px_rgba(0,0,0,0.6)] group/footer relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-text-accent/20 to-transparent"></div>
                
                {previewData.length > 100 ? (
                    <div className="text-[13px] font-black text-text-accent uppercase tracking-[0.6em] flex items-center gap-8 bg-text-accent/5 border-4 border-text-accent/30 px-12 py-4 animate-pulse shadow-[0_20px_60px_rgba(var(--text-accent),0.1)] italic group-hover/footer:not-italic transition-all duration-700">
                        <span className="text-3xl font-bold">!</span> 
                        :: STREAM_TRUNCATED_AT_BUFFER_LIMIT_ [100_NODES] &bull; TOTAL_HEURISTIC_TS: {previewData.length} &bull; FULL_EXPORT_INIT_REQUIRED_TX
                    </div>
                ) : (
                    <div className="text-[13px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 flex items-center gap-6 italic bg-bg-surface px-12 py-4 border-4 border-border-default shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] group-hover/footer:opacity-100 group-hover/footer:border-text-accent/30 transition-all duration-1000">
                        <span className="w-4 h-4 bg-text-accent opacity-20"></span>
                        [ SYSTEM_STATUS ] :: FULL_MANIFEST_STREAM_RENDERED // NO_OVERFLOW_MET_RX_0xFD
                    </div>
                )}
                <div className="flex items-center gap-12 relative z-10">
                     <div className="text-[12px] font-black text-text-muted uppercase tracking-[1.2em] opacity-10 group-hover/footer:opacity-50 transition-all duration-1000 cursor-help italic">HEURISTIC_RENDERER_v4.2.1 // 0xFD42_SYNC_PROTOCOL</div>
                     <div className="h-8 w-[4px] bg-border-default opacity-10 group-hover/footer:bg-text-accent transition-all duration-1000"></div>
                     <span className="text-text-accent text-[12px] font-black tabular-nums tracking-[0.4em] opacity-30 group-hover/footer:opacity-100 transition-opacity italic duration-700">NODE_LATENCY: <span className="underline decoration-double decoration-text-accent/40">12ms_RX</span></span>
                </div>
            </div>
            <div className="absolute top-1/2 left-0 w-1 h-32 bg-text-accent shadow-[0_0_40px_rgba(var(--text-accent),0.8)] opacity-0 group-hover/container:opacity-100 animate-pulse transition-opacity"></div>
        </div>
    );
};
