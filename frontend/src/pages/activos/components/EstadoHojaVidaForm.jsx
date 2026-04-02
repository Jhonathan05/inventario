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

    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none disabled:opacity-30 disabled:cursor-not-allowed shadow-inner";

    return (
        <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-6 text-center">
                {/* Backdrop Layer */}
                <div className="fixed inset-0 bg-bg-base/90 border-border-default backdrop-blur-md transition-opacity animate-fadeIn" onClick={() => onClose(false)}></div>
                
                {/* Modal Container */}
                <div className="relative bg-bg-surface border-2 border-border-default p-12 text-left shadow-3xl w-full max-w-2xl z-10 overflow-hidden animate-fadeInUp">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.5em]">PROCESS_MANAGER_STAMP_TX_0xAF4</div>
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-12 border-b-2 border-border-default pb-10">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                 <div className="w-2.5 h-2.5 bg-text-accent animate-pulse"></div>
                                 <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.5em]">
                                     / manage_event_procedure_io
                                 </h3>
                            </div>
                            <p className="text-[11px] text-text-muted font-black mt-2 uppercase tracking-[0.3em] opacity-60 italic">IDENT_NODE: 0x{hojaVida.id.substring(0,8).toUpperCase()} // STATUS: [{hojaVida.estado}]</p>
                        </div>
                        <button onClick={() => onClose(false)} className="text-text-muted hover:text-text-accent text-3xl leading-none font-black transition-all hover:rotate-90">
                            [ &times; ]
                        </button>
                    </div>

                    {/* Error Feedback Area */}
                    {error && (
                        <div className="mb-10 p-6 border-2 border-text-accent bg-text-accent/5 text-text-accent font-black text-[11px] uppercase tracking-[0.4em] animate-pulse flex items-center gap-6 shadow-xl leading-relaxed">
                            <span className="text-2xl">!!</span>
                            <div>
                                <div>IO_SYNC_FAULT: {error}</div>
                                <div className="text-[8px] opacity-60 mt-1 uppercase tracking-widest">VALIDATE_TX_INTEGRITY // RE-INITIALIZE</div>
                            </div>
                        </div>
                    )}

                    {/* Node Historical Context Segment */}
                    <div className="mb-12 bg-bg-base/40 p-8 border-2 border-border-default shadow-inner relative overflow-hidden group/ctx">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter group-hover/ctx:opacity-10 transition-opacity">INITIAL_DATA_SEGMENT_RX</div>
                        <div className="flex items-center gap-6 mb-8 border-b border-border-default/30 pb-6">
                            <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-xs shadow-md">&gt;_</div>
                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em]"># HISTORICAL_ENTRY_CONTEXT</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-10 mb-8">
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest opacity-50 border-l border-border-default pl-4">:: TIMESTAMP_LINK</span>
                                <span className="text-[11px] font-black text-text-primary uppercase pl-4 block tabular-nums">{new Date(hojaVida.fecha).toLocaleDateString().replace(/\//g, ' / ')}</span>
                            </div>
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest opacity-50 border-l border-border-default pl-4">:: ORIGIN_ACTUATOR</span>
                                <span className="text-[11px] font-black text-text-primary uppercase pl-4 block">{hojaVida.registradoPor?.toUpperCase().replace(/ /g, '_') || 'SYS_UNKNOWN'}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <span className="block text-[9px] font-black text-text-muted uppercase tracking-widest opacity-50 border-l border-border-default pl-4">:: INPUT_DESCRIPTION_IO</span>
                            <p className="text-[11px] font-black text-text-primary uppercase leading-relaxed italic border-l-2 border-text-accent/30 pl-6 bg-bg-base/20 py-4 opacity-80">"{hojaVida.descripcion}"</p>
                        </div>
                    </div>

                    {/* Operational Form */}
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: EVENT_PROTOCOL_TX</label>
                                <div className="relative group">
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
                                        <option value="GARANTIA">0xWARRANTY_PROC_TX</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted opacity-40 font-bold">&darr;</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: ASSIGNED_ANALYST_UID</label>
                                <div className="relative group">
                                    <select
                                        name="responsableId"
                                        disabled={isReadOnly}
                                        className={inputCls}
                                        value={formData.responsableId}
                                        onChange={handleChange}
                                    >
                                        <option value="" className="text-text-muted opacity-40">[ SELECT_ANALYST_NODE ]</option>
                                        {usuarios.map(u => (
                                            <option key={u.id} value={u.id}>{u.nombre.toUpperCase().replace(/ /g, '_')} // {u.rol}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted opacity-40 font-bold">&darr;</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">
                                {hojaVida.estado === 'FINALIZADO' ? ':: FINAL_DIAGNOSTIC_MANIFEST' : ':: APPEND_PROGRESS_LOG_NOTE'}
                            </label>
                            {hojaVida.estado !== 'FINALIZADO' ? (
                                <textarea
                                    name="nuevaNota"
                                    rows="3"
                                    disabled={isReadOnly || formData.estado !== 'EN_PROCESO' || !formData.responsableId}
                                    className={`${inputCls} resize-none`}
                                    value={formData.nuevaNota}
                                    onChange={handleChange}
                                    placeholder={(!isReadOnly && (formData.estado !== 'EN_PROCESO' || !formData.responsableId)) ? "!! ALERT: DEPLOY 'IN_PROCESS' & ASSIGN ANALYST UID TO ENABLE BUFFER" : "INPUT_PROGRESS_DETAILS_TX..."}
                                ></textarea>
                            ) : (
                                <div className="p-8 bg-bg-base border-2 border-border-default text-[11px] font-black text-text-primary uppercase leading-relaxed whitespace-pre-wrap shadow-inner opacity-80 italic">
                                    {hojaVida.diagnostico || 'NULL_DIAGNOSTIC_BUFFER_RX'}
                                </div>
                            )}
                        </div>

                        {hojaVida.estado !== 'FINALIZADO' && (
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: ACCUMULATIVE_DIAGNOSTIC_REPOSITORY</label>
                                <textarea
                                    name="diagnostico"
                                    rows="3"
                                    disabled={isReadOnly}
                                    className={`${inputCls} resize-none bg-bg-base/30 text-text-muted opacity-60 focus:opacity-100 transition-opacity`}
                                    value={formData.diagnostico}
                                    onChange={handleChange}
                                    placeholder="GENERAL_SUMMARY_STATE_BUFFER..."
                                ></textarea>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: EXTERNAL_TICKET_LINK_ID</label>
                                <input type="text" name="casoAranda" disabled={isReadOnly} className={inputCls} value={formData.casoAranda} onChange={handleChange} placeholder="0xIDENT_ARANDA..." />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: TOTAL_COST_UNIT_TX</label>
                                <div className="relative">
                                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-accent font-black">$</div>
                                     <input type="number" name="costo" disabled={isReadOnly} className={`${inputCls} pl-12`} value={formData.costo} onChange={handleChange} placeholder="0x0.00" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: PROCEDURE_CONTROL_STATUS</label>
                                <div className="relative group">
                                    <select
                                        name="estado"
                                        required
                                        disabled={isReadOnly}
                                        className={`${inputCls} border-text-accent/40 text-text-accent font-black animate-pulseSlow`}
                                        value={formData.estado}
                                        onChange={handleChange}
                                    >
                                        <option value="CREADO">0xPENDING_INIT</option>
                                        <option value="EN_PROCESO">0xACTIVE_SYNC</option>
                                        <option value="ESPERA_SUMINISTRO">0xWAIT_RESOURCES</option>
                                        <option value="PROCESO_GARANTIA">0xWARRANTY_LINK</option>
                                        <option value="FINALIZADO">0xCOMMIT_AND_CLOSE_TX</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-accent opacity-50 font-black">&darr;</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-l-2 border-border-default pl-6">:: EVIDENCE_UPLOAD_BIN</label>
                                <div className="bg-bg-base/40 p-4 border-2 border-border-default shadow-inner relative overflow-hidden group/file">
                                     <input type="file" disabled={isReadOnly} onChange={handleFileChange} className="w-full text-[10px] text-text-muted font-black uppercase tracking-widest 
                                        file:mr-4 file:py-2 file:px-6 file:border-2 file:border-border-default file:bg-bg-elevated file:text-text-primary file:text-[10px] file:font-black file:uppercase file:cursor-pointer hover:file:border-text-accent transition-all disabled:opacity-20" accept=".jpg,.jpeg,.png,.pdf" />
                                </div>
                            </div>
                        </div>

                        {/* Bitácora / Historia / Event Trace Array */}
                        <div className="mt-16 bg-bg-base/40 border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group/trace">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter">PROGRESS_TRACE_ARRAY_RX</div>
                            <div className="flex items-center gap-6 mb-10 border-b-2 border-border-default pb-8">
                                <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-sm shadow-md">&lambda;</div>
                                <h4 className="text-[12px] font-black text-text-primary uppercase tracking-[0.5em]"># RE_ENTRY_PROGRESS_TRACE_LOG</h4>
                            </div>
                            <div className="space-y-8 max-h-64 overflow-y-auto pr-8 custom-scrollbar">
                                {hojaVida.trazas && hojaVida.trazas.length > 0 ? (
                                    hojaVida.trazas.map((traza) => (
                                        <div key={traza.id} className="relative pl-10 pb-8 border-l-2 border-border-default last:border-0 last:pb-0 group-hover/trace:border-text-accent/20 transition-colors">
                                            <div className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 bg-text-accent shadow-[0_0_12px_rgba(var(--text-accent),0.6)] animate-pulse"></div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] tabular-nums bg-bg-base px-3 py-1 border border-border-default/50">{new Date(traza.fecha).toLocaleString().replace(/\//g, ' / ')}</span>
                                                <span className="text-[9px] font-black text-white px-4 py-1.5 uppercase tracking-widest tabular-nums bg-text-accent shadow-xl">[{traza.estadoNuevo}]</span>
                                            </div>
                                            <p className="text-[11px] font-black text-text-primary uppercase leading-relaxed tracking-tight border-l-2 border-border-default pl-6 py-2 group-hover:border-text-accent transition-colors">{traza.observacion.toUpperCase()}</p>
                                            <div className="text-[9px] text-text-muted mt-4 font-black uppercase tracking-[0.3em] opacity-40">
                                                SRC_ANALIST_UID: <span className="text-text-primary opacity-60">[{traza.usuario?.nombre?.toUpperCase().replace(/ /g, '_') || 'SYS_AUTO_DAEMON'}]</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 opacity-30 bg-bg-base/20 border-2 border-dashed border-border-default/30">
                                        <p className="text-[11px] font-black uppercase tracking-[0.5em]">! NO_TRACE_LOG_NODES_DETECTED_IN_REPOSITORY</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Command Interface */}
                        <div className="pt-12 flex flex-col lg:flex-row gap-8 border-t-2 border-border-default/20">
                            <button
                                type="button"
                                onClick={() => generateMaintenanceReport(activo, hojaVida)}
                                className="flex-1 px-8 py-5 text-[11px] font-black text-text-primary hover:text-text-accent uppercase tracking-[0.4em] border-2 border-border-default hover:border-text-accent transition-all bg-bg-base shadow-2xl active:scale-95 group/pdf"
                            >
                                <span className="group-hover/pdf:-translate-y-1 inline-block transition-transform">[ 0xPDF ] DOWNLOAD_REPORT_TX</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="flex-1 px-8 py-5 text-[11px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.4em] border-2 border-border-default hover:border-border-strong transition-all bg-bg-base shadow-2xl active:scale-95"
                            >
                                {isReadOnly ? '[ CLOSE_PROC_VIEW ]' : '[ DISCARD_TX_PROC ]'}
                            </button>
                            {!isReadOnly && (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-10 py-5 text-[12px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.6em] relative overflow-hidden group/commit active:scale-95"
                                >
                                    {loading && <div className="absolute inset-0 bg-white/10 animate-loadingBar"></div>}
                                    <span className="relative z-10">{loading ? '[ INITIALIZING_SYNC... ]' : '[ EXECUTE_PROC_COMMIT_TX ]'}</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EstadoHojaVidaForm;
