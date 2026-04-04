import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { funcionariosService } from '../../api/funcionarios.service';
import { activosService } from '../../api/activos.service';
import SelectWithAdd from '../../components/SelectWithAdd';

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const TicketForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [mostrarTodosLosActivos, setMostrarTodosLosActivos] = useState(false);
    const [adjuntos, setAdjuntos] = useState([]);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        prioridad: 'MEDIA',
        tipo: 'REQUERIMIENTO',
        funcionarioId: '',
        activoId: ''
    });

    const { data: funcionariosRaw = [] } = useQuery({
        queryKey: ['funcionarios', { activo: true }],
        queryFn: () => funcionariosService.getAll({ activo: true, limit: 500 }).then(r => r.data || r),
    });
    const funcionarios = sortList(funcionariosRaw);

    const { data: activosRaw = [] } = useQuery({
        queryKey: ['activos', { limit: 500 }],
        queryFn: () => activosService.getAll({ limit: 500 }).then(r => r.data || r),
    });
    const activos = sortList(activosRaw);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAdjuntos(prev => [...prev, ...files]);
        e.target.value = ''; 
    };

    const removeFile = (index) => {
        setAdjuntos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.funcionarioId) { 
            toast.error('SELECTION_REQUIRED: SOURCE_ENTITY'); 
            return; 
        }

        setLoading(true);
        try {
            const payload = new FormData();
            payload.append('titulo', formData.titulo.toUpperCase());
            payload.append('descripcion', formData.descripcion);
            payload.append('prioridad', formData.prioridad);
            payload.append('tipo', formData.tipo);
            payload.append('funcionarioId', formData.funcionarioId);
            if (formData.activoId) payload.append('activoId', formData.activoId);
            adjuntos.forEach(file => payload.append('adjuntos', file));

            const res = await api.post('/tickets', payload);
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            toast.success('CORE_COMMIT_SUCCESS: CASE_INITIALIZED');
            navigate(`/tickets/${res.data.id}`);
        } catch (err) {
            toast.error('CORE_COMMIT_FAULT: TRANSACTION_ABORTED');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectedFuncionario = funcionarios.find(f => String(f.id) === String(formData.funcionarioId));
    
    const activosMostrados = (mostrarTodosLosActivos || !formData.funcionarioId)
        ? activos
        : activos.filter(a => a.cedulaFuncionario === selectedFuncionario?.cedula);

    const getFileSymbol = (file) => {
        if (file.type.startsWith('image/')) return '[IMG_NODE]';
        if (file.type === 'application/pdf') return '[PDF_DOC]';
        return '[BIN_BLOB]';
    };

    const inputCls = "w-full bg-bg-base border-4 border-border-default px-8 py-5 text-[14px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all placeholder:opacity-10 appearance-none shadow-[inset_0_5px_30px_rgba(0,0,0,0.5)]";
    const labelCls = "block text-[12px] font-black text-text-muted uppercase tracking-[0.5em] mb-4 border-l-4 border-border-default pl-6 group-hover/field:border-text-accent transition-colors italic";

    return (
        <div className="max-w-6xl mx-auto space-y-16 font-mono mb-48 px-10 animate-fadeIn selection:bg-text-accent selection:text-bg-base">
            {/* Header / Entry Console RX */}
            <div className="flex justify-between items-center bg-bg-surface border-8 border-border-default p-14 shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-text-accent/20 transition-all duration-1000">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[2em] group-hover:opacity-25 transition-all italic italic">INCIDENT_REG_CORE_v4.2</div>
                <div className="flex items-center gap-12 relative z-10">
                     <div className="w-6 h-6 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.6)] border-4 border-bg-surface"></div>
                     <div>
                        <h1 className="text-4xl font-black uppercase tracking-[0.6em] text-text-primary leading-none mb-10">/ SPAWN_NEW_CASE_PTR</h1>
                        <div className="flex flex-wrap items-center gap-10 border-l-8 border-text-accent/20 pl-8 bg-bg-base/20 py-3 shadow-inner">
                             <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-60 italic">KERNEL_READY // INITIALIZING_STREAM_TX</p>
                             <span className="text-border-default h-4 w-0.5 opacity-20"></span>
                             <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic">0xFD42_SYNC_PROTOCOL_ACTIVE</p>
                        </div>
                     </div>
                </div>
                <button 
                    onClick={() => navigate('/tickets')} 
                    className="text-text-muted hover:text-text-accent transition-all font-black text-3xl px-10 py-4 hover:rotate-90 active:scale-75 bg-bg-base/30 border-4 border-transparent hover:border-border-default shadow-xl"
                >
                    [ &times; ]
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-bg-surface p-16 border-8 border-border-default shadow-[0_80px_200px_rgba(0,0,0,0.9)] space-y-20 relative group hover:border-text-accent/10 transition-all duration-1000">
                <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-text-accent/20 to-transparent opacity-50 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]"></div>
                <div className="absolute top-0 left-0 h-full w-[6px] bg-text-accent/5 opacity-40 group-hover:opacity-100 group-hover:bg-text-accent transition-all"></div>
                
                {/* 01: Manifest Attributes */}
                <div className="space-y-14 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-10 border-b-8 border-border-default pb-8">
                        <div className="w-14 h-14 flex items-center justify-center border-8 border-text-accent text-text-accent font-black text-2xl shadow-xl bg-bg-base">&alpha;</div>
                        <h3 className="text-[13px] font-black uppercase tracking-[0.8em] text-text-primary italic opacity-80 leading-none">
                             MANIFEST_IDENTITY_AND_PRIORITY_STREAM
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="md:col-span-2 group/field">
                            <label className={labelCls}>:: CASE_SUMMARY_NODE_TITLE *</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.titulo} 
                                onChange={e => setFormData({ ...formData, titulo: e.target.value.toUpperCase() })}
                                className={`${inputCls} group-hover/field:border-text-accent/40 transition-colors uppercase italic`}
                                placeholder="E.G._SYSTEM_FAILURE_LOG_IDENT_0x66" 
                                autoComplete="off"
                            />
                        </div>
                        <div className="group/field">
                            <label className={labelCls}>:: INCIDENT_CLASS_ID *</label>
                            <div className="relative group/sel">
                                <select 
                                    required 
                                    value={formData.tipo} 
                                    onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                    className={`${inputCls} group-hover/field:border-text-accent/40 transition-colors`}
                                >
                                    <option value="INCIDENTE">0xINCIDENT [FAIL_EVENT_RX]</option>
                                    <option value="REQUERIMIENTO">0xREQUIREMENT [NEW_NODE_REQ]</option>
                                </select>
                                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none opacity-40 text-text-accent font-black group-hover/sel:scale-125 transition-transform">
                                    &raquo;
                                </div>
                            </div>
                        </div>
                        <div className="group/field">
                            <label className={labelCls}>:: PRIORITY_LEVEL_BUF *</label>
                            <div className="relative group/sel">
                                <select 
                                    required 
                                    value={formData.prioridad} 
                                    onChange={e => setFormData({ ...formData, prioridad: e.target.value })}
                                    className={`${inputCls} group-hover/field:border-text-accent/40 transition-colors`}
                                >
                                    <option value="MEDIA">STANDARD_MEDIUM_RX</option>
                                    <option value="ALTA">HIGH_PRIORITY_NODE_TX</option>
                                    <option value="CRITICA">CRITICAL_EMERGENCY_ALRT</option>
                                    <option value="BAJA">LOW_PRIORITY_BUFFER</option>
                                </select>
                                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none opacity-40 text-text-accent font-black group-hover/sel:scale-125 transition-transform">
                                    &raquo;
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 group/field">
                            <label className={labelCls}>:: CORE_DESCRIPTION_PAYLOAD_MAP *</label>
                            <textarea 
                                required 
                                rows="10" 
                                value={formData.descripcion} 
                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                className={`${inputCls} resize-none min-h-[220px] leading-relaxed tracking-widest group-hover/field:border-text-accent/40 transition-colors italic`}
                                placeholder="DETAILED_SYSTEM_LOGS_AND_EVENT_VECTORS_REQUIRED..." 
                            />
                             <div className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-20 text-right mt-4 italic">0x{formData.descripcion.length.toString(16).padStart(4, '0')}_HEX_BYTES_RX</div>
                        </div>
                    </div>
                </div>

                {/* 02: Entity Map Association */}
                <div className="space-y-14 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-10 border-b-8 border-border-default pb-8">
                        <div className="w-14 h-14 flex items-center justify-center border-8 border-text-accent text-text-accent font-black text-2xl shadow-xl bg-bg-base">&beta;</div>
                        <h3 className="text-[13px] font-black uppercase tracking-[0.8em] text-text-primary italic opacity-80 leading-none">
                             SOURCE_AND_RESOURCES_ENTITY_MAPPING
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="group/field">
                             <SelectWithAdd
                                label=":: ORIGIN_REQUESTER_UID_ENTRY"
                                name="funcionarioId"
                                value={formData.funcionarioId}
                                onChange={handleFormChange}
                                options={funcionarios.map(f => ({ id: f.id, nombre: `${f.nombre.toUpperCase()} (${f.cedula})` }))}
                                required={true}
                                canAdd={false}
                                placeholder="SCAN_ENTITY_UID_0x..."
                                className="group-hover/field:border-text-accent transition-colors"
                            />
                        </div>
                        <div className="flex flex-col group/field">
                            <div className="flex justify-between items-end mb-6 border-l-4 border-border-default pl-6 group-hover/field:border-text-accent transition-colors">
                                <label className="block text-[12px] font-black text-text-muted uppercase tracking-[0.5em] italic opacity-60">:: RELATED_ASSET_NODE (OPT)</label>
                                {formData.funcionarioId && (
                                    <button
                                        type="button"
                                        onClick={() => setMostrarTodosLosActivos(!mostrarTodosLosActivos)}
                                        className={`text-[10px] font-black px-6 py-2 border-4 transition-all uppercase tracking-[0.3em] shadow-xl active:scale-90 italic ${
                                            mostrarTodosLosActivos 
                                            ? 'bg-text-primary text-bg-base border-text-primary shadow-[0_10px_30px_rgba(0,0,0,0.4)]' 
                                            : 'bg-bg-base text-text-muted border-border-default hover:border-text-accent hover:text-text-primary'
                                        }`}
                                    >
                                        {mostrarTodosLosActivos ? '[ SCAN: GLOBAL_POOL ]' : '[ SCAN: ASSIGNED_ONLY ]'}
                                    </button>
                                )}
                            </div>
                            <SelectWithAdd
                                label=""
                                name="activoId"
                                value={formData.activoId}
                                onChange={handleFormChange}
                                options={[
                                    ...activosMostrados,
                                    ...(formData.activoId && !activosMostrados.find(a => String(a.id) === String(formData.activoId))
                                        ? [activos.find(a => String(a.id) === String(formData.activoId))].filter(Boolean)
                                        : [])
                                ].map(a => ({ id: a.id, nombre: `${a.placa} -- ${a.marca?.toUpperCase()} ${a.modelo?.toUpperCase()}` }))}
                                canAdd={false}
                                placeholder={
                                    !formData.funcionarioId 
                                    ? "!! WAITING_SOURCE_ENTITY_INIT..." 
                                    : (activosMostrados.length === 0 ? "!! ZERO_NODES_IN_LOCAL_BUFFER" : "SELECT_ASSET_ENTITY_NODE...")
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* 03: Data Provenance Buffer */}
                <div className="space-y-14 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-10 border-b-8 border-border-default pb-8">
                        <div className="w-14 h-14 flex items-center justify-center border-8 border-text-accent text-text-accent font-black text-2xl shadow-xl bg-bg-base">&gamma;</div>
                        <h3 className="text-[13px] font-black uppercase tracking-[0.8em] text-text-primary italic opacity-80 leading-none">
                             EVIDENCE_AND_SAMPLE_PAYLOAD_BUFFER
                        </h3>
                    </div>

                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full border-8 border-dashed border-border-default bg-bg-base/40 p-24 cursor-pointer hover:border-text-accent hover:bg-bg-base/60 transition-all duration-700 text-center group/upload relative overflow-hidden shadow-[inset_0_10px_60px_rgba(0,0,0,0.5)]"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[0.8em] group-hover/upload:opacity-20 transition-opacity italic">UPLOAD_CHANNEL_RX_0xFD</div>
                        <div className="text-6xl mb-10 group-hover/upload:scale-150 transition-all duration-1000 opacity-20 group-hover/upload:opacity-100 group-hover/upload:rotate-90 group-hover/upload:text-text-accent">+</div>
                        <p className="text-[16px] font-black text-text-primary uppercase tracking-[0.8em] group-hover:tracking-[1.2em] transition-all">INITIALIZE_PAYLOAD_TRANSFER</p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-10 opacity-30 group-hover:opacity-100 transition-opacity">
                             <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] font-black bg-bg-surface px-4 py-1 border-2 border-border-default italic">TYPE: IMG, PDF, LOGS</p>
                             <span className="text-text-accent font-black">::</span>
                             <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] font-black bg-bg-surface px-4 py-1 border-2 border-border-default italic">LIMIT: 5.0MB_FRAGMENT</p>
                        </div>
                        <input id="file-upload" type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileChange} className="hidden" />
                    </label>

                    {adjuntos.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 animate-fadeInUp">
                            {adjuntos.map((file, i) => (
                                <div key={i} className="flex items-center gap-8 p-10 bg-bg-base border-4 border-border-strong group/file hover:border-text-accent hover:bg-bg-elevated/20 transition-all relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-tighter italic">FRAGMENT_CHUNK_{i.toString(16).toUpperCase().padStart(2, '0')}</div>
                                    <div className="w-16 h-16 flex items-center justify-center border-4 border-text-accent text-[10px] font-black text-text-accent bg-bg-base tabular-nums shadow-xl group-hover:rotate-6 transition-transform">{getFileSymbol(file).replace(/[\[\]]/g, '')}</div>
                                    <div className="flex-1 min-w-0 space-y-4">
                                        <p className="text-[13px] font-black text-text-primary truncate uppercase tracking-[0.1em] italic">{file.name.toUpperCase().replace(/ /g, '_')}</p>
                                        <p className="text-[10px] text-text-muted font-black opacity-80 tabular-nums bg-bg-surface/50 w-fit px-3 py-1 border border-border-default/30">ALLOC_SIZE: {(file.size / 1024).toFixed(2)}_KB</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeFile(i)} 
                                        className="text-text-muted hover:text-text-accent transition-all p-4 font-black text-2xl active:scale-50 hover:bg-bg-base shadow-inner border-2 border-transparent hover:border-text-accent/20"
                                        title="UNLINK_FRAGMENT"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Final Protocol Execution Gate */}
                <div className="flex flex-col sm:flex-row justify-end gap-10 pt-16 border-t-8 border-border-default/50 relative group/footer">
                    <button 
                        type="button" 
                        onClick={() => navigate('/tickets')} 
                        disabled={loading}
                        className="px-14 py-6 border-4 border-border-strong text-[13px] font-black text-text-muted uppercase tracking-[0.6em] hover:text-text-primary hover:border-text-accent transition-all disabled:opacity-20 bg-bg-base/60 shadow-xl active:scale-95 group/disc relative overflow-hidden"
                    >
                         <span className="relative z-10 flex items-center gap-6">
                            <span className="opacity-30 group-hover/disc:-translate-x-4 transition-transform italic">&larr;</span> [ ABORT_TX_PROC ]
                         </span>
                         <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/disc:opacity-100 transition-opacity"></div>
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-16 py-6 bg-text-primary border-4 border-text-primary text-bg-base font-black text-[14px] hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.8em] flex items-center justify-center gap-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] disabled:opacity-20 group/submit active:scale-95 relative overflow-hidden"
                    >
                        {loading ? (
                            <span className="relative z-10 flex items-center gap-8 animate-pulse italic">
                                <div className="w-6 h-6 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                EXECUTING_CORE_COMMIT...
                            </span>
                        ) : (
                            <span className="relative z-10 flex items-center gap-8">
                                [ EXECUTE_COMMIT_TX_0xFD ]
                                <span className="opacity-20 group-hover/submit:translate-x-6 transition-all duration-500 font-normal">»</span>
                            </span>
                        )}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/submit:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-shine"></div>
                    </button>
                </div>
                <div className="text-center opacity-10 text-[9px] font-black uppercase tracking-[3em] pt-12 italic group-hover:opacity-30 transition-all duration-1000">TX_COMMIT_GATEWAY_v4.2 // SECURITY_COMITE_TOLIMA</div>
            </form>
        </div>
    );
};

export default TicketForm;
