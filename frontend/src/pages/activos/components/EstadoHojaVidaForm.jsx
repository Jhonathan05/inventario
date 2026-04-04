import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { generateMaintenanceReport } from '../reports/MaintenanceReport';

const EstadoHojaVidaForm = ({ open, onClose, hojaVida, activo }) => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';
    const isReadOnly = !canEdit || hojaVida.estado === 'FINALIZADO';

    const [formData, setFormData] = useState({
        tipo: hojaVida?.tipo || 'MANTENIMIENTO',
        diagnostico: hojaVida?.diagnostico || '',
        responsableId: hojaVida?.responsableId || '',
        casoAranda: hojaVida?.casoAranda || '',
        costo: hojaVida?.costo || '',
        estado: hojaVida?.estado || 'EN_PROCESO',
        nuevaNota: ''
    });
    const [usuarios, setUsuarios] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await api.get('/usuarios');
                const tecnicos = res.data.filter(u => u.rol === 'ANALISTA_TIC' || u.rol === 'ADMIN');
                setUsuarios(tecnicos);
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('tipo', formData.tipo);
            if (formData.responsableId) data.append('responsableId', formData.responsableId);
            data.append('diagnostico', formData.diagnostico);
            data.append('casoAranda', formData.casoAranda);
            data.append('costo', formData.costo);
            data.append('estado', formData.estado);
            data.append('nuevaNota', formData.nuevaNota);

            if (file) {
                data.append('file', file);
            }

            await api.put(`/hojavida/${hojaVida.id}/procesar`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onClose(true);
        } catch (err) {
            console.error(err);
            setError(`!! UPDATE_FAULT :: ${err.response?.data?.error?.toUpperCase() || 'SYSTEM_REJECTED_TX'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const inputCls = "block w-full bg-bg-base border-4 border-border-default py-6 px-10 text-[13px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none disabled:opacity-20 disabled:cursor-not-allowed shadow-[inset_0_5px_30px_rgba(0,0,0,0.5)] active:scale-[0.99]";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono selection:bg-text-accent selection:text-bg-base" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-6 text-center">
                {/* Backdrop Layer */}
                <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn duration-500" onClick={() => onClose(false)}></div>
                
                {/* Modal Container */}
                <div className="relative bg-bg-surface border-4 border-border-default p-14 text-left shadow-[0_60px_150px_rgba(0,0,0,0.9)] w-full max-w-4xl z-10 overflow-hidden animate-fadeInUp group/modal hover:border-text-accent/30 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.8em] italic">PROCEDURE_MANAGER_STAMP_v4 // IDENT_NODE: 0x{hojaVida.id.substring(0,8).toUpperCase()}</div>
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-16 border-b-4 border-border-default pb-12 relative">
                        <div className="flex items-center gap-8">
                             <div className="w-6 h-6 bg-text-accent animate-pulse shadow-[0_0_25px_rgba(var(--text-accent),0.6)] flex items-center justify-center text-bg-base text-xs font-black">!</div>
                             <div>
                                 <h3 className="text-[20px] font-black text-text-primary uppercase tracking-[0.6em] leading-none mb-4">
                                     / manage_event_procedure_io
                                 </h3>
                                 <div className="flex items-center gap-6 text-[10px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 italic">
                                      <span>STATUS: [{hojaVida.estado.toUpperCase()}]</span>
                                      <span className="text-text-accent">::</span>
                                      <span>TX_BUFFER: active_procedure_pool</span>
                                 </div>
                             </div>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90 p-4 bg-bg-base/30 border-2 border-transparent hover:border-border-default">
                            [ &times; ]
                        </button>
                    </div>

                    {/* Error Feedback Area */}
                    {error && (
                        <div className="mb-14 p-8 border-4 border-text-accent bg-text-accent/5 text-text-accent font-black text-[13px] uppercase tracking-[0.6em] animate-pulse flex items-center gap-10 shadow-[0_30px_70px_rgba(var(--text-accent),0.2)]">
                            <span className="text-4xl">!!</span>
                            <div>
                                <div className="mb-1">IO_PROCEDURE_FAULT: {error}</div>
                                <div className="text-[10px] opacity-40 uppercase tracking-[0.5em] italic">VALIDATE_TX_INTEGRITY // REINITIALIZE_GATEWAY</div>
                            </div>
                        </div>
                    )}

                    {/* Node Historical Context Segment */}
                    <div className="mb-16 bg-bg-base/40 p-12 border-4 border-border-default shadow-inner relative overflow-hidden group/ctx hover:border-text-accent/10 transition-colors duration-700">
                        <div className="absolute top-0 right-0 p-6 opacity-5 text-[10px] font-black uppercase tracking-tighter group-hover/ctx:opacity-10 transition-opacity">INITIAL_DATA_SEGMENT_RX_ACK</div>
                        
                        <div className="flex items-center gap-8 mb-12 border-b-2 border-border-default/20 pb-8">
                            <div className="w-10 h-10 flex items-center justify-center border-4 border-text-primary font-black text-lg shadow-xl bg-bg-surface group-hover/ctx:border-text-accent transition-colors">&Omega;</div>
                            <h4 className="text-[14px] font-black text-text-primary uppercase tracking-[0.6em]"># HISTORICAL_ENTRY_CONTEXT_v4</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                            <div className="space-y-4 group/entry">
                                <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40 border-l-4 border-border-default pl-6 group-hover/entry:border-text-accent transition-colors italic">:: TIMESTAMP_LINK_RX</span>
                                <span className="text-[13px] font-black text-text-primary uppercase pl-10 block tabular-nums leading-none">{new Date(hojaVida.fecha).toLocaleDateString().replace(/\//g, ' / ')}</span>
                            </div>
                            <div className="space-y-4 group/entry">
                                <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40 border-l-4 border-border-default pl-6 group-hover/entry:border-text-accent transition-colors italic">:: ORIGIN_ACTUATOR_NODE</span>
                                <span className="text-[13px] font-black text-text-primary uppercase pl-10 block leading-none">{hojaVida.registradoPor?.toUpperCase().replace(/ /g, '_') || 'SYS_DAEMON_AF22'}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40 border-l-4 border-border-default pl-6 italic">:: INPUT_DESCRIPTION_BUFFER_TX</span>
                            <div className="relative group/box">
                                <div className="absolute -left-10 top-0 h-full w-1.5 bg-text-accent/20 group-hover/box:bg-text-accent transition-all duration-700"></div>
                                <p className="text-[13px] font-black text-text-primary uppercase leading-relaxed italic pl-10 bg-bg-base/20 py-8 opacity-80 shadow-inner group-hover/box:opacity-100 group-hover/box:bg-bg-base/30 transition-all">"{hojaVida.descripcion.toUpperCase()}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Operational Form */}
                    <form onSubmit={handleSubmit} className="space-y-14 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: EVENT_PROTOCOL_SUTURE</label>
                                <div className="relative group/sel">
                                    <select
                                        name="tipo"
                                        disabled={isReadOnly}
                                        className={inputCls}
                                        value={formData.tipo}
                                        onChange={handleChange}
                                    >
                                        <option value="MANTENIMIENTO">0xPREVENTIVE_MAINT</option>
                                        <option value="REPARACION">0xCORRECTIVE_REPAIR</option>
                                        <option value="SUMINISTRO">0xRESOURCE_SUPPLY</option>
                                        <option value="INSPECCION">0xDIAGNOSTIC_PROBE</option>
                                        <option value="ACTUALIZACION">0xSYSTEM_UPGRADE</option>
                                        <option value="GARANTIA">0xWARRANTY_FLOW_TX</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-text-muted opacity-40 pointer-events-none font-black text-xl group-hover/sel:text-text-accent transition-colors group-disabled:hidden">&raquo;</div>
                                </div>
                            </div>

                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: ASSIGNED_ANALYST_NODE_UID</label>
                                <div className="relative group/sel">
                                    <select
                                        name="responsableId"
                                        disabled={isReadOnly}
                                        className={inputCls}
                                        value={formData.responsableId}
                                        onChange={handleChange}
                                    >
                                        <option value="" className="text-text-muted opacity-40 italic">[ SELECT_ALLOCATED_ANALYST ]</option>
                                        {usuarios.map(u => (
                                            <option key={u.id} value={u.id}>{u.nombre.toUpperCase().replace(/ /g, '_')} // {u.rol}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-text-muted opacity-40 pointer-events-none font-black text-xl group-hover/sel:text-text-accent transition-colors group-disabled:hidden">&raquo;</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 group/field">
                            <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">
                                {hojaVida.estado === 'FINALIZADO' ? ':: FINAL_DIAGNOSTIC_MANIFEST_LOG' : ':: APPEND_PROGRESS_LOG_TX'}
                            </label>
                            {hojaVida.estado !== 'FINALIZADO' ? (
                                <textarea
                                    name="nuevaNota"
                                    rows="4"
                                    disabled={isReadOnly || formData.estado !== 'EN_PROCESO' || !formData.responsableId}
                                    className={`${inputCls} resize-none italic`}
                                    value={formData.nuevaNota}
                                    onChange={handleChange}
                                    placeholder={(!isReadOnly && (formData.estado !== 'EN_PROCESO' || !formData.responsableId)) ? "!! ALERT: INITIALIZE 'ACTIVE_SYNC' & ASSIGN ANALYST UID TO UNLOCK LOG BUFFER" : "INPUT_PROGRESS_DETAILS_STAMP..."}
                                ></textarea>
                            ) : (
                                <div className="p-12 bg-bg-base/60 border-4 border-border-default text-[14px] font-black text-text-primary uppercase leading-relaxed whitespace-pre-wrap shadow-inner opacity-80 italic hover:opacity-100 transition-opacity">
                                    {hojaVida.diagnostico.toUpperCase() || 'NULL_DIAGNOSTIC_BUFFER_RX_v4'}
                                </div>
                            )}
                        </div>

                        {hojaVida.estado !== 'FINALIZADO' && (
                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: ACCUMULATIVE_DIAGNOSTIC_HISTORY_POOL</label>
                                <textarea
                                    name="diagnostico"
                                    rows="3"
                                    disabled={isReadOnly}
                                    className={`${inputCls} resize-none bg-bg-base/30 text-text-muted opacity-60 focus:opacity-100 transition-all italic`}
                                    value={formData.diagnostico}
                                    onChange={handleChange}
                                    placeholder="GENERAL_SUMMARY_STATE_BUFFER_RX..."
                                ></textarea>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: EXTERNAL_TICKET_TRACK_ID</label>
                                <input type="text" name="casoAranda" disabled={isReadOnly} className={inputCls} value={formData.casoAranda} onChange={handleChange} placeholder="0xIDENT_ARANDA_v4..." />
                            </div>
                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: TOTAL_TX_COST_ALLOCATION</label>
                                <div className="relative group/curr">
                                     <div className="absolute left-10 top-1/2 -translate-y-1/2 text-text-accent font-black text-xl group-hover/curr:scale-125 transition-transform italic">$</div>
                                     <input type="number" name="costo" disabled={isReadOnly} className={`${inputCls} pl-20 italic`} value={formData.costo} onChange={handleChange} placeholder="0.00_0xFD" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: PROCEDURE_CONTROL_STATE_LINK</label>
                                <div className="relative group/sel">
                                    <select
                                        name="estado"
                                        required
                                        disabled={isReadOnly}
                                        className={`${inputCls} border-text-accent/30 text-text-accent font-black animate-pulseSlow transition-all group-disabled:animate-none group-disabled:border-border-default`}
                                        value={formData.estado}
                                        onChange={handleChange}
                                    >
                                        <option value="CREADO">0xPENDING_INIT</option>
                                        <option value="EN_PROCESO">0xACTIVE_SYNC</option>
                                        <option value="ESPERA_SUMINISTRO">0xWAIT_RESOURCES</option>
                                        <option value="PROCESO_GARANTIA">0xWARRANTY_FLOW</option>
                                        <option value="FINALIZADO">0xCOMMIT_AND_CLOSE</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-text-accent opacity-40 font-black text-xl group-disabled:hidden">&raquo;</div>
                                </div>
                            </div>

                            <div className="space-y-6 group/field">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.6em] border-l-4 border-border-default/50 pl-8 group-focus-within/field:border-text-accent transition-colors italic opacity-60">:: EVIDENCE_UPLOAD_BINARY_TX</label>
                                <div className="bg-bg-base/40 p-6 border-4 border-border-default shadow-inner relative overflow-hidden group/file hover:bg-bg-base/60 transition-all duration-700">
                                     <input type="file" disabled={isReadOnly} onChange={handleFileChange} className="w-full text-[11px] text-text-muted font-black uppercase tracking-widest 
                                        file:mr-10 file:py-3 file:px-8 file:border-4 file:border-border-strong file:bg-bg-elevated file:text-text-primary file:text-[10px] file:font-black file:uppercase file:cursor-pointer hover:file:border-text-accent transition-all disabled:opacity-10" accept=".jpg,.jpeg,.png,.pdf" />
                                </div>
                            </div>
                        </div>

                        {/* Bitácora / Historia / Event Trace Array Graph */}
                        <div className="mt-20 bg-bg-base/40 border-4 border-border-default p-14 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group/trace hover:border-text-accent/10 transition-all duration-1000">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-xl font-black uppercase tracking-[3em] italic pointer-events-none group-hover/trace:opacity-10 transition-all">EVENT_TRACE_ARRAY_RX</div>
                            
                            <div className="flex items-center gap-10 mb-16 border-b-4 border-border-default pb-10">
                                <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl shadow-xl bg-bg-surface text-text-accent animate-pulse">&lambda;</div>
                                <div>
                                    <h4 className="text-[16px] font-black text-text-primary uppercase tracking-[0.6em] leading-none mb-4"># RE_ENTRY_PROGRESS_TRACE_POOL</h4>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 italic">STREAMING_FROM: active_traces_buffer_v4.2</p>
                                </div>
                            </div>
                            
                            <div className="space-y-12 max-h-[400px] overflow-y-auto pr-10 custom-scrollbar group-hover/trace:custom-scrollbar-accent transition-all">
                                {hojaVida.trazas && hojaVida.trazas.length > 0 ? (
                                    hojaVida.trazas.map((traza, idx) => (
                                        <div key={traza.id} className="relative pl-14 pb-12 border-l-4 border-border-default/40 last:border-0 last:pb-0 group-hover/trace:border-text-accent/10 transition-colors animate-fadeIn" style={{ animationDelay: `${idx * 150}ms` }}>
                                            <div className="absolute -left-[10px] top-2 w-4 h-4 bg-text-accent shadow-[0_0_20px_rgba(var(--text-accent),0.8)] animate-pulse rotate-45 z-10 transition-transform group-hover:rotate-0"></div>
                                            
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                                <div className="flex items-center gap-6">
                                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] tabular-nums bg-bg-base/60 px-6 py-2 border-2 border-border-default/50 shadow-md italic">
                                                        {new Date(traza.fecha).toLocaleString().replace(/\//g, ' / ')}
                                                    </span>
                                                    <span className="w-8 h-1 bg-text-accent/20"></span>
                                                </div>
                                                <span className="text-[10px] font-black text-white px-6 py-2 uppercase tracking-[0.4em] tabular-nums bg-text-accent shadow-2xl skew-x-[-12deg] group-hover:skew-x-0 transition-transform duration-500">
                                                    [{traza.estadoNuevo.toUpperCase()}]
                                                </span>
                                            </div>
                                            
                                            <div className="relative overflow-hidden">
                                                <div className="absolute left-0 top-0 h-full w-1 bg-text-accent/20"></div>
                                                <p className="text-[13px] font-black text-text-primary uppercase leading-relaxed tracking-widest border-l-4 border-border-default pl-10 py-6 bg-bg-surface/30 group-hover:bg-bg-surface/50 group-hover:border-text-accent/40 transition-all italic">
                                                    "{traza.observacion.toUpperCase()}"
                                                </p>
                                            </div>
                                            
                                            <div className="text-[10px] text-text-muted mt-6 font-black uppercase tracking-[0.5em] opacity-40 flex items-center gap-6 italic">
                                                <span>SRC_ACTUATOR:</span>
                                                <span className="text-text-accent underline decoration-text-accent/20 underline-offset-4 decoration-2">
                                                    [{traza.usuario?.nombre?.toUpperCase().replace(/ /g, '_') || 'SYSTEM_AUTO_DAEMON'}]
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-24 opacity-20 bg-bg-base/30 border-4 border-dashed border-border-default/40 group-hover:opacity-40 transition-opacity">
                                        <div className="text-5xl mb-8">&otimes;</div>
                                        <p className="text-[14px] font-black uppercase tracking-[1.2em] italic">! NO_TRACE_LOG_NODES_ATTACHED</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-4 opacity-50">INITIALIZE_PROCEDURE_LOG_STAMP_RX</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Command Interface Gateway */}
                        <div className="pt-16 flex flex-col lg:flex-row gap-10 border-t-8 border-border-default/50 relative group/footer">
                            <button
                                type="button"
                                onClick={() => generateMaintenanceReport(activo, hojaVida)}
                                className="flex-1 px-10 py-6 text-[13px] font-black text-text-primary hover:text-text-accent uppercase tracking-[0.6em] border-4 border-border-strong hover:border-text-accent transition-all bg-bg-base/60 shadow-2xl active:scale-95 group/pdf relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black group-hover/pdf:opacity-20 transition-opacity italic">PRINT_BUFFER_RX</div>
                                <span className="group-hover/pdf:-translate-y-1 inline-block transition-transform relative z-10 flex items-center justify-center gap-6">
                                     <span className="opacity-40 group-hover/pdf:scale-125 transition-all text-xl">&Omega;</span>
                                     [ DOWNLOAD_REPORT_TX ]
                                </span>
                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/pdf:opacity-100 transition-opacity"></div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-10 py-6 text-[13px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.6em] border-4 border-border-strong hover:border-border-accent transition-all bg-bg-base/60 shadow-2xl active:scale-95 group/disc relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                     <span className="opacity-30 group-hover/disc:-translate-x-4 transition-transform">&larr;</span>
                                     {isReadOnly ? '[ CLOSE_PROC_VIEW ]' : '[ DISCARD_TX_PROC ]'}
                                </span>
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/disc:opacity-100 transition-opacity"></div>
                            </button>

                            {!isReadOnly && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-14 py-6 text-[14px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_30px_90px_rgba(var(--text-primary),0.3)] disabled:opacity-20 uppercase tracking-[0.8em] relative overflow-hidden group/commit active:scale-95"
                                >
                                    {loading ? (
                                        <span className="relative z-10 flex items-center justify-center gap-8 animate-pulse italic">
                                             <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                             RX_SYNCING_TX_BUFFER...
                                        </span>
                                    ) : (
                                        <span className="relative z-10 flex items-center justify-center gap-8">
                                             [ EXECUTE_PROC_COMMIT_TX ]
                                             <span className="opacity-20 group-hover/commit:translate-x-6 transition-all">&raquo;</span>
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/commit:opacity-100 transition-opacity"></div>
                                </button>
                            )}
                        </div>
                        <div className="text-center opacity-10 text-[8px] font-black uppercase tracking-[3em] pt-12 italic group-hover/footer:opacity-30 transition-all duration-1000">PROCEDURE_LOG_CONTROLLER_v4.2 // AF_TX_COMMIT_GATEWAY</div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EstadoHojaVidaForm;
