export const ReportPreview = ({ 
    previewData, 
    selectedColumns, 
    loading, 
    selectedPerfil 
}) => {
    if (loading) {
        return (
            <div className="bg-bg-surface border border-border-default p-20 text-center h-full flex flex-col items-center justify-center min-h-[500px] font-mono shadow-3xl">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black animate-pulse tracking-[0.5em]">SYSTEM_BUSY</div>
                <div className="text-[11px] font-black text-text-accent animate-pulse uppercase tracking-[0.8em]"># EXECUTING_DATA_EXTRACTION...</div>
                <div className="mt-6 text-[9px] text-text-muted uppercase tracking-[0.4em] opacity-40">QUERYING_REMOTE_NODES // FRAGMENTING_DATA_STREAM</div>
                <div className="mt-12 w-48 h-[2px] bg-bg-base border border-border-default relative overflow-hidden">
                    <div className="absolute inset-0 bg-text-accent animate-progressBar"></div>
                </div>
            </div>
        );
    }

    if (previewData.length === 0) {
        return null; // Parent handles empty state when not generating
    }

    return (
        <div className="bg-bg-surface border border-border-default font-mono flex flex-col h-full min-h-[600px] shadow-3xl animate-fadeIn relative overflow-hidden group/container hover:border-border-strong transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest group-hover/container:opacity-20 transition-opacity">DATA_BUFFER_STREAM_RX</div>
            
            <div className="px-8 py-6 border-b border-border-default bg-bg-base flex flex-wrap items-center justify-between gap-6">
                <h3 className="text-[10px] font-black text-text-primary uppercase tracking-[0.4em] flex items-center gap-4">
                    <span className="text-text-accent">[ &gt; ]</span> 
                    PREVIEW_BUFFER: <span className="text-text-accent tabular-nums">{previewData.length.toString().padStart(4, '0')}</span>_NODES 
                    <span className="text-border-default h-4 w-[1px] mx-2"></span>
                    <span className="text-text-accent tabular-nums">{selectedColumns.length.toString().padStart(2, '0')}</span>_DIMENSIONS
                    {selectedPerfil && (
                        <>
                            <span className="text-border-default h-4 w-[1px] mx-2"></span>
                            <span className="text-text-muted opacity-60 italic tracking-widest">:: [SET: {selectedPerfil.nombre.toUpperCase().replace(/ /g, '_')}]</span>
                        </>
                    )}
                </h3>
                <div className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">READY_FOR_EXPORT</div>
            </div>
            
            <div className="overflow-auto flex-1 custom-scrollbar bg-bg-surface/50">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-bg-elevated/95 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                            <th className="px-6 py-4 text-left text-[9px] font-black text-text-accent uppercase tracking-[0.2em] border-b border-r border-border-default/30">#_ID</th>
                            {selectedColumns.map(col => (
                                <th key={col.key} className="px-6 py-3 text-left text-[9px] font-black text-text-muted uppercase tracking-[0.3em] whitespace-nowrap border-b border-r border-border-default/30 group-hover:text-text-primary transition-colors">
                                    {col.label.replace(/ /g, '_')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-border-default/10">
                        {previewData.slice(0, 100).map((row, idx) => (
                            <tr key={idx} className="hover:bg-text-accent/5 transition-all group/row">
                                <td className="px-6 py-3 text-[9px] font-black text-text-muted border-r border-border-default/20 group-hover/row:text-text-accent transition-colors tabular-nums">
                                    {(idx + 1).toString().padStart(3, '0')}
                                </td>
                                {selectedColumns.map(col => (
                                    <td key={col.key} className="px-6 py-3 text-[11px] font-black text-text-primary/70 group-hover/row:text-text-primary transition-colors whitespace-nowrap max-w-xs truncate border-r border-border-default/10 uppercase tracking-tight">
                                        {row[col.label] ?? <span className="opacity-10 italic">DATA_NULL</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-4 bg-bg-base border-t border-border-default flex flex-col sm:flex-row justify-between items-center gap-4">
                {previewData.length > 100 ? (
                    <div className="text-[9px] font-black text-text-accent uppercase tracking-[0.3em] flex items-center gap-3">
                        <span className="blink">[ ATTENTION ]</span> :: PREVIEW_TRUNCATED_AT_100_NODES | TOTAL_SET: {previewData.length} | FULL_EXPORT_REQUIRED
                    </div>
                ) : (
                    <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">
                        [ STATUS ] :: FULL_DATA_STREAM_RENDERED // NO_TRUNCATION_MET
                    </div>
                )}
                <div className="text-[8px] font-black text-text-muted uppercase tracking-[0.4em] opacity-20">HEURISTIC_PREVIEW_V4.2.1</div>
            </div>
        </div>
    );
};
