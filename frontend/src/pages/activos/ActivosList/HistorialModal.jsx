import { Link } from 'react-router-dom';

const HistorialModal = ({
    show,
    onClose,
    funcionarios,
    filterFuncionario,
    historialData,
    historialLoading,
    onExportExcel,
    onExportPDF,
}) => {
    if (!show) return null;

    const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre?.toUpperCase();

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono selection:bg-text-accent selection:text-bg-base" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-bg-base/90 backdrop-blur-md transition-opacity duration-500" onClick={onClose} />
                
                <div className="relative bg-bg-surface border-4 border-border-default p-12 text-left shadow-[0_60px_150px_rgba(0,0,0,0.9)] sm:my-12 sm:w-full sm:max-w-5xl z-10 overflow-hidden animate-fadeIn group/modal hover:border-text-accent/30 transition-colors duration-700">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1.5em] group-active:opacity-10 transition-all italic">CHRONO_BUFFER_STREAM_v4.2</div>
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-20"></div>
                    
                    <div className="flex items-center justify-between mb-12 border-b-4 border-border-default pb-10 relative">
                        <div className="flex items-center gap-8">
                            <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.5)]"></div>
                            <div>
                                <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.5em] leading-none mb-4">
                                    / asset_chronology_manifest
                                </h3>
                                <div className="flex items-center gap-4">
                                     <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-40">TARGET_HOLDER:</span>
                                     <span className="text-[11px] text-text-accent font-black uppercase tracking-widest bg-text-accent/5 px-4 py-1 border border-text-accent/20">
                                         {funcName || 'NULL_NODE_TX'}
                                     </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90 active:scale-75 p-4 bg-bg-base/30 border-2 border-transparent hover:border-border-default">
                            [ &times; ]
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mb-12 relative z-10">
                        {historialData.length > 0 && (
                            <div className="flex gap-6 p-4 border-2 border-dashed border-border-default/30 bg-bg-base/20 shadow-inner">
                                <button onClick={onExportExcel} className="text-[11px] font-black uppercase tracking-[0.3em] border-2 border-border-default px-8 py-3 hover:border-text-accent hover:text-text-accent transition-all bg-bg-surface shadow-xl active:scale-95 group/btn relative overflow-hidden">
                                     <span className="relative z-10 flex items-center gap-3">
                                         <span className="opacity-40 group-hover/btn:opacity-100 transition-opacity">[X]</span> EXPORT_RAW
                                     </span>
                                </button>
                                <button onClick={onExportPDF} className="text-[11px] font-black uppercase tracking-[0.3em] border-2 border-border-default px-8 py-3 hover:border-text-accent hover:text-text-accent transition-all bg-bg-surface shadow-xl active:scale-95 group/btn relative overflow-hidden">
                                     <span className="relative z-10 flex items-center gap-3">
                                         <span className="opacity-40 group-hover/btn:opacity-100 transition-opacity">[P]</span> GENERATE_REPORT
                                     </span>
                                </button>
                            </div>
                        )}
                        <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.6em] opacity-20 italic ml-auto pointer-events-none">RX_READY // 0xFD42</div>
                    </div>

                    {historialLoading ? (
                        <div className="py-32 text-center bg-bg-base/30 border-4 border-dashed border-border-default/10">
                             <div className="w-16 h-16 border-4 border-t-text-accent border-border-default animate-spin mx-auto mb-10 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]"></div>
                             <div className="text-[14px] uppercase tracking-[1em] text-text-accent font-black animate-pulse"># SYNCING_CHRONO_DATA_STREAM...</div>
                             <div className="mt-6 text-[10px] text-text-muted uppercase tracking-[0.5em] opacity-30 italic">querying_repository_node_tx_0xFD42</div>
                        </div>
                    ) : historialData.length === 0 ? (
                        <div className="py-32 text-center bg-bg-base border-4 border-dashed border-border-default/20 group/empty hover:border-text-accent/20 transition-colors duration-700">
                             <div className="text-6xl text-text-muted opacity-10 mb-8 font-black tracking-tighter group-active:scale-90 transition-transform">! NULL</div>
                             <p className="text-[16px] text-text-muted font-black uppercase tracking-[0.8em] mb-4">! NO_HISTORICAL_TX_LOGGED</p>
                             <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] opacity-30 italic">ADJUST_QUERY_FILTERS_OR_ALLOCATE_NEW_STREAM</p>
                        </div>
                    ) : (
                        <div className="bg-bg-base border-4 border-border-default overflow-hidden shadow-[inset_0_10px_60px_rgba(0,0,0,0.6)] group/table">
                            <div className="overflow-auto max-h-[500px] custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[800px] border-spacing-0">
                                    <thead className="sticky top-0 bg-bg-elevated/95 backdrop-blur-md border-b-4 border-border-default z-20 shadow-xl">
                                        <tr className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em]">
                                            <th className="px-8 py-6 border-r-2 border-border-default/20 shadow-inner">:: TX_START</th>
                                            <th className="px-8 py-6 border-r-2 border-border-default/20 shadow-inner">:: TX_END</th>
                                            <th className="px-8 py-6 border-r-2 border-border-default/20 shadow-inner">:: EVENT_ID</th>
                                            <th className="px-8 py-6 border-r-2 border-border-default/20 shadow-inner">:: NODE_IDENTITY</th>
                                            <th className="px-8 py-6 shadow-inner bg-bg-surface/30">:: LOG_METADATA_MANIFEST</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-border-default/10">
                                        {historialData.map((asig) => (
                                            <tr key={asig.id} className={`hover:bg-text-accent/5 transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default ${!asig.fechaFin ? 'bg-text-accent/5' : ''}`}>
                                                <td className="px-8 py-6 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r-2 border-border-default/10 group-hover:bg-bg-elevated/20 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                         <div className="w-1.5 h-1.5 bg-text-accent/30 rounded-full group-hover:scale-150 transition-transform"></div>
                                                         {new Date(asig.fechaInicio).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[12px] font-black uppercase tracking-tight tabular-nums border-r-2 border-border-default/10">
                                                    {asig.fechaFin ? 
                                                        <span className="text-text-muted/60 flex items-center gap-4">
                                                            <div className="w-3 h-[1px] bg-border-default/40"></div>
                                                            {new Date(asig.fechaFin).toLocaleDateString()}
                                                        </span> : 
                                                        <span className="text-text-accent animate-pulse flex items-center gap-4">
                                                            <div className="w-3 h-3 border-2 border-text-accent rounded-full border-t-transparent animate-spin"></div>
                                                            [ CURRENT_ACTIVE ]
                                                        </span>
                                                    }
                                                </td>
                                                <td className="px-8 py-6 border-r-2 border-border-default/10">
                                                    <span className="inline-flex items-center border-2 border-border-default px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted bg-bg-surface shadow-md group-hover/row:border-text-accent group-hover/row:text-text-primary transition-all">
                                                        [{asig.tipo}]
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 border-r-2 border-border-default/10 group-hover:bg-bg-surface/30 transition-colors">
                                                    <Link to={`/activos/${asig.activoId}`} onClick={onClose} className="text-[12px] font-black text-text-primary uppercase tracking-tight hover:text-text-accent transition-all block group-hover:translate-x-2">
                                                        <span className="text-text-accent opacity-20 group-hover:opacity-100 transition-opacity mr-2">RX:</span> 
                                                        {asig.activo?.marca} <span className="text-text-muted opacity-40 font-medium">{asig.activo?.modelo}</span>
                                                    </Link>
                                                    <div className="text-[9px] text-text-muted font-black mt-2 tracking-[0.4em] opacity-40 group-hover/row:opacity-100 transition-opacity flex items-center gap-3 italic">
                                                        <span className="bg-bg-elevated px-2 py-0.5 border border-border-default/40 not-italic">PLACA: [{asig.activo?.placa}]</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] text-text-muted font-black uppercase tracking-widest leading-relaxed max-w-sm group-hover:text-text-primary transition-colors" title={asig.observaciones}>
                                                    <div className="line-clamp-2 italic border-l-2 border-border-default/20 pl-4 group-hover:border-text-accent transition-colors">
                                                        / {asig.observaciones?.toUpperCase() || 'NO_METADATA_CAP_ACK'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Inner Footer */}
                            <div className="bg-bg-elevated/40 px-8 py-3 border-t-2 border-border-default text-[8px] font-black uppercase tracking-[0.8em] text-text-muted opacity-30 text-right">
                                END_OF_CORE_HISTORICAL_MANIFEST_v4
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-10 border-t-4 border-border-default/40 pt-10">
                        <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] opacity-20 flex items-center gap-4 italic italic">
                             <div className="w-10 h-[1px] bg-border-default"></div>
                             INVENTORY_NODE_CONTROLLER_v4.2 // TOLIMA_AF22
                        </div>
                        <button onClick={onClose} className="px-12 py-5 text-[12px] font-black uppercase tracking-[0.5em] border-4 border-border-strong hover:border-text-accent text-text-muted hover:text-text-primary transition-all shadow-2xl bg-bg-base/50 active:scale-95 group/close relative overflow-hidden backdrop-blur-sm">
                             <span className="relative z-10 flex items-center gap-4">
                                 [ &larr; ] DISCARD_VIEW_RX
                             </span>
                             <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/close:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistorialModal;
