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

    const inputCls = "w-full bg-bg-base border border-border-default px-5 py-4 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-border-strong transition-all placeholder:opacity-20 appearance-none";
    const labelCls = "block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3";

    return (
        <div className="max-w-5xl mx-auto space-y-10 font-mono mb-20 px-4 sm:px-6 animate-fadeIn">
            {/* Header / Entry Console */}
            <div className="flex justify-between items-center bg-bg-surface border border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">INCIDENT_REG_8.0</div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">/ create_new_case</h1>
                    <div className="mt-4 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-text-accent animate-pulse"></div>
                             <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">KERNEL_READY // REGISTERING_NEW_EVENT</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/tickets')} 
                    className="text-text-muted hover:text-text-accent transition-all font-black text-3xl px-6 py-2 active:scale-95 transition-transform"
                >
                    [ &times; ]
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-bg-surface p-12 border border-border-default shadow-3xl space-y-12 relative group hover:border-border-strong transition-all">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border-default to-transparent opacity-50"></div>
                
                {/* 01: Details Manifest */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5 border-b border-border-default pb-6">
                        <span className="text-[14px] font-black text-text-accent opacity-60 tabular-nums">[01]</span>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-primary">
                             MANIFEST_DETAILS_STREAM
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2 group/field">
                            <label className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: CASE_SUMMARY_TITLE *</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.titulo} 
                                onChange={e => setFormData({ ...formData, titulo: e.target.value.toUpperCase() })}
                                className={inputCls}
                                placeholder="E.G._SYSTEM_FAILURE_LOG_POINT_A" 
                                autoComplete="off"
                            />
                        </div>
                        <div className="group/field">
                            <label className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: CASE_CLASSIFICATION *</label>
                            <div className="relative">
                                <select 
                                    required 
                                    value={formData.tipo} 
                                    onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                    className={inputCls}
                                >
                                    <option value="INCIDENTE">INCIDENT [EXISTING_FAILURE]</option>
                                    <option value="REQUERIMIENTO">REQUIREMENT [NEW_REQUEST]</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-40 text-[8px]">
                                    [ &darr; ]
                                </div>
                            </div>
                        </div>
                        <div className="group/field">
                            <label className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: PRIORITY_LEVEL *</label>
                            <div className="relative">
                                <select 
                                    required 
                                    value={formData.prioridad} 
                                    onChange={e => setFormData({ ...formData, prioridad: e.target.value })}
                                    className={inputCls}
                                >
                                    <option value="MEDIA">STANDARD_MEDIUM</option>
                                    <option value="ALTA">HIGH_PRIORITY_NODE</option>
                                    <option value="CRITICA">CRITICAL_EMERGENCY_RX</option>
                                    <option value="BAJA">LOW_PRIORITY_BUF</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none opacity-40 text-[8px]">
                                    [ &darr; ]
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 group/field">
                            <label className={`${labelCls} group-hover/field:text-text-accent transition-colors`}>:: ROOT_DESCRIPTION_PAYLOAD *</label>
                            <textarea 
                                required 
                                rows="8" 
                                value={formData.descripcion} 
                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                className={`${inputCls} resize-none min-h-[180px] leading-relaxed tracking-tighter normal-case`}
                                placeholder="DETAILED_FAILURE_VECTOR_DOCUMENTATION..." 
                            />
                        </div>
                    </div>
                </div>

                {/* 02: Entity Linking */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5 border-b border-border-default pb-6">
                        <span className="text-[14px] font-black text-text-accent opacity-60 tabular-nums">[02]</span>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-primary">
                             ENTITY_ASSOCIATION_MAP
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <SelectWithAdd
                            label=":: ORIGIN_REQUESTER_ENTITY_UID"
                            name="funcionarioId"
                            value={formData.funcionarioId}
                            onChange={handleFormChange}
                            options={funcionarios.map(f => ({ id: f.id, nombre: `${f.nombre.toUpperCase()} (${f.cedula})` }))}
                            required={true}
                            canAdd={false}
                            placeholder="SCAN_UID..."
                        />
                        <div className="flex flex-col group/field">
                            <div className="flex justify-between items-end mb-3">
                                <label className={`${labelCls} mb-0 group-hover/field:text-text-accent transition-colors`}>
                                    :: RELATED_ASSET_TAG (OPT)
                                </label>
                                {formData.funcionarioId && (
                                    <button
                                        type="button"
                                        onClick={() => setMostrarTodosLosActivos(!mostrarTodosLosActivos)}
                                        className={`text-[9px] font-black px-4 py-1.5 border transition-all uppercase tracking-widest shadow-md ${
                                            mostrarTodosLosActivos 
                                            ? 'bg-text-primary text-bg-base border-text-primary' 
                                            : 'bg-bg-base text-text-muted border-border-default hover:border-text-accent hover:text-text-primary'
                                        }`}
                                    >
                                        {mostrarTodosLosActivos ? '[ SCAN_MODE: ALL ]' : '[ SCAN_MODE: ASSIGNED ]'}
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
                                    ? "WAITING_SOURCE_ENTITY..." 
                                    : (activosMostrados.length === 0 ? "ZERO_ASSETS_IN_LOCAL_BUFFER" : "SELECT_ASSET_NODE...")
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* 03: Evidence Buffer */}
                <div className="space-y-10">
                    <div className="flex items-center gap-5 border-b border-border-default pb-6">
                        <span className="text-[14px] font-black text-text-accent opacity-60 tabular-nums">[03]</span>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-primary">
                             EVIDENCE_PAYLOAD_BUFFER
                        </h3>
                    </div>

                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border-default bg-bg-base/20 p-16 cursor-pointer hover:border-text-accent hover:bg-bg-base/40 transition-all text-center group/upload relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-[9px] font-black uppercase tracking-[0.3em]">UPLOAD_RX_CHANNEL</div>
                        <span className="text-3xl mb-6 group-hover/upload:scale-125 transition-transform duration-500 opacity-60 group-hover/upload:opacity-100">++</span>
                        <p className="text-[12px] font-black text-text-primary uppercase tracking-[0.4em]">CONNECT_PAYLOAD_SAMPLES</p>
                        <p className="text-[10px] text-text-muted mt-3 uppercase tracking-widest opacity-60 font-black">IMG, PDF, LOGS // LIMIT: 5.0MB_PER_FRAGMENT</p>
                        <input id="file-upload" type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileChange} className="hidden" />
                    </label>

                    {adjuntos.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slideUp">
                            {adjuntos.map((file, i) => (
                                <div key={i} className="flex items-center gap-5 p-6 bg-bg-base border border-border-default group/file hover:border-text-accent hover:bg-bg-elevated/20 transition-all relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-tighter">DATA_CHUNK_{i}</div>
                                    <span className="text-[9px] font-black text-text-accent border border-text-accent/30 px-2 py-1 bg-bg-base tabular-nums shadow-sm">{getFileSymbol(file)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black text-text-primary truncate uppercase tracking-tight">{file.name.replace(/ /g, '_')}</p>
                                        <p className="text-[9px] text-text-muted font-black mt-2 opacity-60 tabular-nums">ALLOC_SIZE: {(file.size / 1024).toFixed(1)}_KB</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeFile(i)} 
                                        className="text-text-muted hover:text-text-accent transition-all px-4 py-2 font-black text-lg active:scale-90"
                                        title="UNLINK_FRAGMENT"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Final Protocol Execution */}
                <div className="flex flex-col sm:flex-row justify-end gap-8 pt-12 border-t border-border-default/50">
                    <button 
                        type="button" 
                        onClick={() => navigate('/tickets')} 
                        disabled={loading}
                        className="px-12 py-5 border border-border-default text-[11px] font-black text-text-muted uppercase tracking-[0.4em] hover:text-text-primary hover:border-border-strong transition-all disabled:opacity-30 bg-bg-base/30 shadow-xl active:scale-95"
                    >
                        [ CANCEL_TRANSACTION_TX ]
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-14 py-5 bg-bg-elevated border border-border-strong text-text-accent font-black text-[11px] hover:text-text-primary uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-5 shadow-3xl disabled:opacity-30 group/submit active:scale-95"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin text-xl leading-none opacity-50">/</span>
                                <span>EXECUTING_COMMIT...</span>
                            </>
                        ) : (
                            <>
                                <span>[ COMMIT_NEW_CASE_ENTRY ]</span>
                                <span className="opacity-40 group-hover/submit:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
