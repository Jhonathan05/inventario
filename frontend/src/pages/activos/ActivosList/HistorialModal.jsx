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
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
                <div className="relative bg-bg-surface border border-border-default p-10 text-left shadow-3xl sm:my-12 sm:w-full sm:max-w-4xl z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-xs font-black">CHRONO_BUFFER_STREAM</div>
                    
                    <div className="flex items-center justify-between mb-10 border-b border-border-default pb-8">
                        <div>
                            <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.4em]">
                                / asset_chronology_log
                            </h3>
                            <p className="text-[10px] text-text-muted font-bold mt-2 uppercase tracking-widest opacity-60">HOLDER_IDENTITY: {funcName || 'NULL_NODE'}</p>
                        </div>
                        <button onClick={onClose} className="text-text-muted hover:text-text-accent text-2xl leading-none font-black transition-colors">
                            [ &times; ]
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        {historialData.length > 0 && (
                            <>
                                <button onClick={onExportExcel} className="text-[10px] font-black uppercase tracking-widest border border-border-default px-4 py-2 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/30 shadow-xl">
                                    [ 0xEXCEL ] EXPORT_RAW
                                </button>
                                <button onClick={onExportPDF} className="text-[10px] font-black uppercase tracking-widest border border-border-default px-4 py-2 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/30 shadow-xl">
                                    [ 0xPDF ] EXPORT_REPORT
                                </button>
                            </>
                        )}
                    </div>

                    {historialLoading ? (
                        <div className="py-20 text-center animate-pulse text-text-accent text-[11px] font-black uppercase tracking-[0.5em]"># SYNCING_CHRONO_DATA...</div>
                    ) : historialData.length === 0 ? (
                        <div className="py-20 text-center text-text-muted text-[10px] font-black uppercase tracking-[0.3em] opacity-40">! NO_HISTORICAL_RECORDS_ALLOCATED</div>
                    ) : (
                        <div className="bg-bg-base border border-border-default overflow-hidden shadow-inner">
                            <div className="overflow-auto max-h-96 custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead className="sticky top-0 bg-bg-elevated border-b border-border-default z-10">
                                        <tr className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">:: TIMESTAMP_START</th>
                                            <th className="px-6 py-4">:: TIMESTAMP_END</th>
                                            <th className="px-6 py-4">:: EVENT_TYPE</th>
                                            <th className="px-6 py-4">:: NODE_IDENTITY</th>
                                            <th className="px-6 py-4">:: LOG_METADATA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-default/30">
                                        {historialData.map((asig) => (
                                            <tr key={asig.id} className={`hover:bg-bg-surface transition-all group/row ${!asig.fechaFin ? 'bg-text-accent/5' : ''}`}>
                                                <td className="px-6 py-4 text-[10px] font-black text-text-primary uppercase tracking-tight">
                                                    {new Date(asig.fechaInicio).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-[10px] font-black uppercase tracking-tight">
                                                    {asig.fechaFin ? 
                                                        <span className="text-text-muted">{new Date(asig.fechaFin).toLocaleDateString()}</span> : 
                                                        <span className="text-text-accent animate-pulse">[ CURRENT_ACTIVE ]</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center border border-border-default px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-text-muted bg-bg-base">
                                                        [{asig.tipo}]
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link to={`/activos/${asig.activoId}`} onClick={onClose} className="text-[10px] font-black text-text-primary uppercase tracking-tight hover:text-text-accent transition-colors underline decoration-text-accent/30 decoration-2 underline-offset-4">
                                                        {asig.activo?.marca} {asig.activo?.modelo}
                                                    </Link>
                                                    <div className="text-[8px] text-text-muted font-bold mt-1 tracking-widest opacity-60">P: {asig.activo?.placa}</div>
                                                </td>
                                                <td className="px-6 py-4 text-[9px] text-text-muted font-black uppercase tracking-widest leading-relaxed max-w-xs truncate" title={asig.observaciones}>
                                                    {asig.observaciones || '---'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className="mt-10 flex justify-end">
                        <button onClick={onClose} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] border border-border-default hover:border-text-accent hover:text-text-accent transition-all shadow-xl bg-bg-base/30">
                            [ DISCARD_VIEW ]
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistorialModal;
