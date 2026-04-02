import React, { useState, useEffect, useRef } from 'react';
import axios from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

// Combobox de búsqueda de funcionarios restyled to monochromatic terminal aesthetic
const FuncionarioSearch = ({ label, funcionarios, value, onChange, excludeId = null, placeholder = '-- SEARCH_PERSONNEL_MANIFEST --' }) => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = funcionarios.find(f => f.id == value);

    const filtered = funcionarios
        .filter(f => excludeId == null || f.id !== parseInt(excludeId))
        .filter(f => {
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                f.nombre?.toLowerCase().includes(q) ||
                f.codigoPersonal?.toLowerCase().includes(q) ||
                f.cargo?.toLowerCase().includes(q)
            );
        });

    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (f) => {
        onChange(f.id);
        setQuery('');
        setOpen(false);
    };

    const handleClear = () => {
        onChange('');
        setQuery('');
    };

    return (
        <div ref={ref} className="relative font-mono group/search">
            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 opacity-70 group-focus-within/search:text-text-accent transition-colors">:: {label}</label>
            {selected ? (
                <div className="flex items-center gap-8 p-8 border-2 border-text-accent bg-bg-base shadow-3xl animate-fadeIn relative overflow-hidden group/selected">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest transition-opacity group-hover/selected:opacity-20 transition-all">ENTITY_STAGED_BUF_RX</div>
                    <div className="flex-1 min-w-0 z-10">
                        <span className="block text-[15px] font-black text-text-primary uppercase tracking-tight truncate">{selected.nombre.toUpperCase().replace(/ /g, '_')}</span>
                        <div className="flex flex-wrap items-center gap-6 mt-3">
                             {selected.codigoPersonal && <span className="text-[10px] font-black text-text-accent uppercase tracking-[0.2em] bg-text-accent/5 px-3 py-1 border border-text-accent/30 shadow-sm">ID_NODE: {selected.codigoPersonal.toUpperCase()}</span>}
                             {selected.cargo && <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black opacity-60 italic">ROLE: [{selected.cargo.toUpperCase()}]</span>}
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleClear} 
                        className="text-text-muted hover:text-text-accent p-4 transition-all active:scale-75 z-10" 
                        title="NULLIFY_ENTITY_SELECTION_TX"
                    >
                        <span className="text-3xl font-black leading-none">[ &times; ]</span>
                    </button>
                    {/* Pulsing indicator */}
                    <div className="absolute bottom-0 right-0 w-full h-[2px] bg-text-accent animate-pulse"></div>
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-text-muted opacity-30 text-[11px] font-black group-focus-within/search:opacity-100 transition-opacity">
                        SCAN &raquo;
                    </div>
                    <input
                        type="text"
                        autoComplete="off"
                        className="w-full bg-bg-base border-2 border-border-default py-5 pl-28 pr-8 text-[12px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner"
                        placeholder={placeholder}
                        value={query}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    />
                    {open && (
                        <div className="absolute z-50 w-full mt-4 bg-bg-surface border-2 border-border-default shadow-3xl max-h-80 overflow-y-auto custom-scrollbar animate-slideDown">
                            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-[8px] font-black uppercase">FRAGMENT_IO_RX</div>
                            {filtered.length === 0 ? (
                                <div className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40 italic">! NO_ENTITY_MATCHES_IN_BUFFER_TX</div>
                            ) : (
                                filtered.map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        className="w-full text-left px-10 py-6 hover:bg-bg-elevated border-b-2 border-border-default/10 last:border-0 transition-all flex flex-col group/item relative overflow-hidden"
                                        onClick={() => handleSelect(f)}
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-text-accent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                                        <span className="block text-[13px] font-black text-text-primary uppercase tracking-tight group-hover/item:translate-x-3 transition-transform">{f.nombre.toUpperCase().replace(/ /g, '_')}</span>
                                        <div className="flex gap-8 mt-3 opacity-40 text-[10px] font-black uppercase tracking-widest group-hover/item:opacity-80 group-hover/item:translate-x-3 transition-all tabular-nums">
                                            {f.codigoPersonal && <span>UID_RX: {f.codigoPersonal.toUpperCase()}</span>}
                                            {f.cargo && <span>ROLE_NODE: {f.cargo.toUpperCase()}</span>}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const GenerarActa = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        tipo: 'ASIGNACION',
        funcionarioId: '',
        funcionarioDestinoId: '',
        activosIds: [],
        observaciones: ''
    });

    const [funcionarios, setFuncionarios] = useState([]);
    const [activosDisponibles, setActivosDisponibles] = useState([]);

    useEffect(() => { loadFuncionarios(); }, []);

    useEffect(() => {
        if (formData.tipo && formData.funcionarioId) {
            loadActivosValidos();
        } else {
            setActivosDisponibles([]);
        }
    }, [formData.tipo, formData.funcionarioId]);

    const loadFuncionarios = async () => {
        try {
            const res = await axios.get('/funcionarios');
            setFuncionarios(res.data);
        } catch (err) {
            console.error('Error loading personnel', err);
        }
    };

    const loadActivosValidos = async () => {
        try {
            setLoading(true);
            let url = `/activos?${formData.tipo === 'ASIGNACION' ? 'estado=DISPONIBLE' : `funcionarioId=${formData.funcionarioId}`}`;
            const res = await axios.get(url);
            setActivosDisponibles(res.data || []);
        } catch (err) {
            console.error('Error loading assets', err);
            setActivosDisponibles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setError(null);
            const payload = { ...formData };
            await axios.post('/actas/generar', payload);
            navigate('/actas');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'ERROR_DURING_TX_COMMIT_PROTOCOL_FAILURE');
        } finally {
            setLoading(false);
        }
    };

    const toggleActivo = (id) => {
        setFormData(prev => {
            const exists = prev.activosIds.includes(id);
            return exists 
                ? { ...prev, activosIds: prev.activosIds.filter(x => x !== id) }
                : { ...prev, activosIds: [...prev.activosIds, id] };
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono mb-24 animate-fadeIn">
            {/* Header / TX Session Information */}
            <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all mb-14">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.8em] group-hover:opacity-20 transition-opacity">TX_RECORD_INITIAL_RX_0x77</div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-5 mb-4">
                             <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.5em] text-text-primary leading-tight">
                                 / novelty_transaction_generator
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-10">
                            <div className="flex items-center gap-4">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-60">SESSION_IO_CHANNEL_RX_OPEN</p>
                            </div>
                            <span className="text-border-default h-6 w-[2px] bg-border-default/30"></span>
                            <div className="flex items-center gap-4 bg-bg-base px-5 py-1.5 border border-border-default/50">
                                 <p className="text-[11px] text-text-primary font-black uppercase tracking-widest tabular-nums italic">STAGE_0{step}_PROTOCOL // ID: 0xFDAB</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Progress layer accent */}
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-border-default/10">
                     <div className={`h-full bg-text-accent transition-all duration-1000 ease-in-out ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
                </div>
            </div>

            {/* Stage Progress Map Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-14">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`relative flex flex-col p-10 border-2 transition-all duration-500 shadow-2xl overflow-hidden ${step >= i 
                        ? 'bg-bg-elevated border-text-accent shadow-[0_15px_40px_rgba(var(--text-accent),0.1)] group/step ring-2 ring-text-accent ring-inset' 
                        : 'bg-bg-base/30 border-border-default opacity-40 grayscale'}`}>
                        {step > i && (
                            <div className="absolute top-4 right-4 text-text-accent text-[9px] font-black tracking-[0.3em] animate-pulse uppercase">
                                STATUS: COMPLETE_TX
                            </div>
                        )}
                        <div className={`text-[13px] font-black uppercase tracking-[0.6em] ${step >= i ? 'text-text-accent' : 'text-text-muted'}`}>
                            {step === i ? '>> STAGE_0' : 'STAGE_0'}{i}
                        </div>
                        <div className={`mt-5 h-[2px] w-full transition-all duration-500 ${step >= i ? 'bg-text-accent' : 'bg-border-default opacity-20'}`}></div>
                        <div className={`text-[11px] font-black mt-5 uppercase tracking-[0.4em] ${step >= i ? 'text-text-primary' : 'text-text-muted'}`}>
                            {i === 1 ? 'CONFIG_TX_LAYER' : i === 2 ? 'BUFFER_UNIT_ALLOC' : 'FINAL_TX_COMMIT'}
                        </div>
                        {step === i && <div className="absolute inset-0 bg-text-accent/5 animate-pulse"></div>}
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-14 p-10 bg-text-accent/10 border-2 border-text-accent text-text-accent shadow-3xl relative overflow-hidden animate-shake flex items-center gap-12">
                    <div className="absolute top-0 right-0 p-8 opacity-20 text-[11px] font-black uppercase tracking-[1em] italic">FATAL_STREAM_EXCEPTION</div>
                    <span className="font-black text-7xl leading-none animate-pulse">!!</span>
                    <div className="pt-2 z-10">
                        <p className="text-[15px] font-black uppercase tracking-[0.6em] mb-4 text-text-primary underline decoration-text-accent decoration-2 underline-offset-8">TX_EXECUTION_EXCEPTION_LOG</p>
                        <p className="text-[12px] font-black opacity-90 border-l-4 border-text-accent/40 pl-8 py-3 tracking-widest uppercase">{error}</p>
                    </div>
                </div>
            )}

            <div className="bg-bg-surface border-2 border-border-default p-14 shadow-3xl relative group hover:border-border-strong transition-all overflow-hidden mb-24 min-h-[600px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-sm font-black uppercase tracking-[2em] group-hover:text-text-accent transition-colors">IO_WORKSPACE_NODE_BUFFER_RX</div>

                {/* STEP 1: CONFIGURATION PROTOCOL */}
                {step === 1 && (
                    <div className="space-y-16 animate-fadeIn">
                        <div className="group/types">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.5em] mb-10 border-b-2 border-border-default/20 pb-5 group-focus-within/types:text-text-accent transition-colors opacity-70">:: 0x01_IDENTIFY_TRANSACTION_TYPE</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                                {['ASIGNACION', 'DEVOLUCION', 'TRASLADO'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFormData({ ...formData, tipo: t, activosIds: [] })}
                                        className={`group/type relative p-10 border-2 text-[13px] font-black uppercase tracking-[0.5em] transition-all shadow-2xl overflow-hidden active:scale-95
                                            ${formData.tipo === t 
                                                ? 'bg-bg-elevated border-text-accent text-text-accent ring-2 ring-text-accent ring-inset' 
                                                : 'bg-bg-base border-border-default text-text-muted hover:border-border-strong hover:text-text-primary'}`}
                                    >
                                        <div className={`absolute top-0 left-0 p-3 opacity-10 text-[9px] font-black uppercase tracking-tighter ${formData.tipo === t ? 'opacity-40 text-text-accent' : ''}`}>TX_MOD_{t.substring(0,3)}</div>
                                        <span className="relative z-10 transition-all group-hover/type:tracking-[0.7em]">[ {t.replace(/_/g, '_')} ]</span>
                                        {formData.tipo === t && <div className="absolute inset-0 bg-text-accent/5 animate-pulse"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <FuncionarioSearch
                            label={
                                formData.tipo === 'ASIGNACION' ? '0x02_TARGET_RECIPIENT_ENTITY_RX' :
                                formData.tipo === 'TRASLADO' ? '0x02_ORIGIN_SENDER_ENTITY_IO' : '0x02_EXITING_ENTITY_NODE_TX'
                            }
                            funcionarios={funcionarios}
                            value={formData.funcionarioId}
                            onChange={(id) => setFormData({ ...formData, funcionarioId: id, activosIds: [], funcionarioDestinoId: '' })}
                            placeholder={formData.tipo === 'ASIGNACION' ? 'SEARCH_TARGET_RECIPIENT_AGENT...' : 'SEARCH_ORIGIN_STORAGE_AGENT...'}
                        />

                        {formData.tipo === 'TRASLADO' && (
                            <div className="pt-12 border-t-2 border-border-default/10 animate-fadeInUp">
                                <FuncionarioSearch
                                    label="0x03_TARGET_DESTINATION_ENTITY_NODE_RX"
                                    funcionarios={funcionarios}
                                    value={formData.funcionarioDestinoId}
                                    onChange={(id) => setFormData({ ...formData, funcionarioDestinoId: id })}
                                    excludeId={formData.funcionarioId}
                                    placeholder="SEARCH_DESTINATION_AGENT_IO..."
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-16 border-t-2 border-border-default/20">
                            <button
                                disabled={!formData.funcionarioId || (formData.tipo === 'TRASLADO' && !formData.funcionarioDestinoId)}
                                onClick={() => setStep(2)}
                                className="px-20 py-6 text-[14px] font-black bg-text-primary text-bg-base hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.7em] group/next active:scale-95 relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-6">
                                    [ NEXT_STAGE_PROCEED ] 
                                    <span className="opacity-40 group-hover/next:translate-x-3 transition-transform text-xl">&raquo;</span>
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/next:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: HARDWARE ALLOCATION SELECTION */}
                {step === 2 && (
                    <div className="space-y-12 animate-fadeIn">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-4">
                            <div className="group/title">
                                <h3 className="text-2xl font-black text-text-primary uppercase tracking-[0.5em] group-hover:text-text-accent transition-colors underline decoration-border-default decoration-4 underline-offset-8 transition-all group-hover:decoration-text-accent">/ selective_buffer_allocation</h3>
                                <p className="text-[10px] text-text-muted uppercase tracking-[0.4em] mt-5 opacity-50 italic font-black">SCANNING_ACTIVE_STORAGE_NODES_FOR_TX_PAYLOAD</p>
                            </div>
                            <div className="flex items-center gap-5 bg-bg-base border-2 border-text-accent px-10 py-5 shadow-3xl relative">
                                <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em]">UNITS_STAGED:</span>
                                <span className="text-[20px] font-black text-text-accent tracking-[0.4em] tabular-nums underline decoration-text-accent/30 decoration-2 underline-offset-4">
                                    {formData.activosIds.length.toString().padStart(3, '0')}
                                </span>
                                <div className="absolute top-0 right-0 p-1 opacity-20 text-[6px] font-black">TX_BUF</div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-40 flex flex-col items-center justify-center space-y-12 bg-bg-base/30 border-2 border-border-default border-dashed shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[6px] bg-border-default/10 overflow-hidden">
                                     <div className="h-full bg-text-accent animate-loadingBar"></div>
                                </div>
                                <div className="text-[18px] font-black text-text-accent uppercase tracking-[2em] animate-pulse text-center pl-[2em]"># SCANNING_BUFFER...</div>
                                <p className="text-[11px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic">DECRYPTING_HARDWARE_MAP_MANIFEST // CRC_CHECK_VALID</p>
                            </div>
                        ) : activosDisponibles.length === 0 ? (
                            <div className="py-40 text-center border-4 border-dashed border-border-default bg-bg-base/50 shadow-inner group/empty hover:border-text-accent/30 transition-all">
                                <p className="text-[15px] font-black text-text-muted uppercase tracking-[1em] opacity-30 group-hover:opacity-60 transition-opacity">! NO_COMPATIBLE_STORAGE_UNITS_IDENTIFIED</p>
                                <button onClick={() => setStep(1)} className="mt-12 text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.5em] border-2 border-text-accent/30 hover:border-text-accent px-10 py-4 transition-all bg-bg-base shadow-xl">RECONFIGURE_TX_PATH</button>
                            </div>
                        ) : (
                            <>
                                <div className="relative group/filter shadow-2xl">
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-text-muted opacity-30 text-[12px] font-black group-focus-within/filter:opacity-100 group-focus-within/filter:text-text-accent transition-all whitespace-nowrap">SCAN_HARDWARE_MAP &raquo;</div>
                                    <input
                                        type="text"
                                        placeholder="FILTER_BUFFER_BY_SERIAL_PLATE_DESCRIPTION_MANIFEST_IO..."
                                        className="w-full bg-bg-base border-2 border-border-default py-6 pl-52 pr-10 text-[14px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-10 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="max-h-[600px] overflow-y-auto border-2 border-border-default custom-scrollbar bg-bg-base/30 shadow-inner">
                                    <table className="w-full border-collapse border-spacing-0">
                                        <thead className="bg-bg-surface sticky top-0 z-10 border-b-2 border-border-default">
                                            <tr>
                                                <th className="px-10 py-6 w-24 text-center border-r-2 border-border-default/10">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-text-accent scale-[1.8] cursor-pointer shadow-xl"
                                                        onChange={(e) => {
                                                            const term = searchTerm.toLowerCase();
                                                            const visibles = activosDisponibles.filter(a =>
                                                                !term ||
                                                                a.placa?.toLowerCase().includes(term) ||
                                                                a.serial?.toLowerCase().includes(term) ||
                                                                (a.tipo || a.descripcion)?.toLowerCase().includes(term)
                                                            );
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, activosIds: [...new Set([...formData.activosIds, ...visibles.map(a => a.id)])] });
                                                            } else {
                                                                const visibleIds = visibles.map(a => a.id);
                                                                setFormData({ ...formData, activosIds: formData.activosIds.filter(id => !visibleIds.includes(id)) });
                                                            }
                                                        }}
                                                        checked={
                                                            activosDisponibles.length > 0 &&
                                                            activosDisponibles.filter(a => !searchTerm || (a.placa?.toLowerCase().includes(searchTerm.toLowerCase()) || a.serial?.toLowerCase().includes(searchTerm.toLowerCase()))).every(a => formData.activosIds.includes(a.id))
                                                        }
                                                    />
                                                </th>
                                                <th className="px-10 py-6 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-r-2 border-border-default/10">:: BUFFER_UNIT_SPEC</th>
                                                <th className="px-10 py-6 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.4em] border-r-2 border-border-default/10">:: ADDR_IDENT_IO</th>
                                                <th className="px-10 py-6 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.4em]">:: CORE_VENDOR_CLASS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-border-default/5 bg-bg-surface/20">
                                            {activosDisponibles
                                                .filter(a => {
                                                    const t = searchTerm.toLowerCase();
                                                    return !t || a.placa?.toLowerCase().includes(t) || a.serial?.toLowerCase().includes(t) || (a.tipo || a.descripcion || '').toLowerCase().includes(t);
                                                })
                                                .map(a => (
                                                    <tr 
                                                        key={a.id} 
                                                        className={`hover:bg-bg-elevated transition-all group/row cursor-pointer group-hover:scale-[1.01] ${formData.activosIds.includes(a.id) ? 'bg-text-accent/5' : ''}`}
                                                        onClick={() => toggleActivo(a.id)}
                                                    >
                                                        <td className="px-10 py-8 text-center border-r-2 border-border-default/10" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                className="accent-text-accent scale-[1.8] cursor-pointer shadow-lg"
                                                                checked={formData.activosIds.includes(a.id)}
                                                                onChange={() => toggleActivo(a.id)}
                                                            />
                                                        </td>
                                                        <td className="px-10 py-8 border-r-2 border-border-default/10">
                                                            <div className="flex flex-col">
                                                                <span className="text-[14px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors tabular-nums">
                                                                    { (a.tipo || a.descripcion).toUpperCase().replace(/ /g, '_') }
                                                                </span>
                                                                {formData.activosIds.includes(a.id) && (
                                                                    <div className="flex items-center gap-2 mt-3 animate-slideRight">
                                                                        <div className="w-2 h-2 bg-text-accent rounded-full animate-pulse"></div>
                                                                        <span className="text-[9px] font-black text-text-accent uppercase tracking-widest">[ TARGET_ALLOCATED_IO ]</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8 border-r-2 border-border-default/10">
                                                            <div className="text-[12px] text-text-primary font-black tracking-[0.3em] uppercase tabular-nums bg-bg-base/80 px-4 py-1.5 border-2 border-border-default shadow-md inline-block group-hover/row:border-text-accent transition-colors">PL: {a.placa.toUpperCase()}</div>
                                                            <div className="text-[10px] text-text-muted font-black tracking-[0.2em] opacity-40 mt-3 uppercase tabular-nums italic">SN_NODE_RX: {a.serial?.toUpperCase() || 'SYS_NULL_HW_ID'}</div>
                                                        </td>
                                                        <td className="px-10 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.4em] group-hover/row:text-text-primary transition-colors italic">
                                                            {a.marca.toUpperCase()} // <span className="opacity-100 group-hover/row:text-text-accent transition-colors">{a.modelo.toUpperCase()}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col sm:flex-row gap-10 justify-between pt-16 border-t-2 border-border-default/20 flex-wrap-reverse">
                            <button onClick={() => setStep(1)} className="px-14 py-6 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] border-2 border-border-default transition-all bg-bg-base/50 shadow-2xl active:scale-95 group/prev">
                                <span className="flex items-center gap-6">
                                     <span className="opacity-30 group-hover/prev:-translate-x-3 transition-transform text-xl">&laquo;</span> [ RECONFIGURE_TX_PROTOCOL ]
                                </span>
                            </button>
                            <button
                                disabled={formData.activosIds.length === 0}
                                onClick={() => setStep(3)}
                                className="px-20 py-6 text-[14px] font-black bg-text-primary text-bg-base hover:bg-text-accent transition-all shadow-3xl disabled:opacity-20 uppercase tracking-[0.7em] group/next active:scale-95 relative overflow-hidden"
                            >
                                 <span className="relative z-10 flex items-center gap-6">
                                    [ NEXT_STAGE_COMMIT ] 
                                    <span className="opacity-40 group-hover/next:translate-x-3 transition-transform text-xl">&raquo;</span>
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/next:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: TRANSACTION FINAL COMMIT RX */}
                {step === 3 && (
                    <div className="space-y-16 animate-fadeIn max-w-5xl mx-auto py-8">
                        <div className="p-12 border-4 border-dashed border-border-default bg-bg-base/20 relative shadow-2xl group/summary overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:text-text-accent transition-all group-hover:opacity-30">TX_PRE_COMMIT_MANIFEST_VALID_RX</div>
                            <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.8em] mb-14 border-b-2 border-border-default/50 pb-8 flex items-center gap-6 group-hover:text-text-accent transition-colors">
                                <div className="w-3 h-3 bg-text-accent animate-pulse"></div>
                                :: 0x0_PRE_COMMIT_MANIFEST_SNAPSHOT
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 gap-x-20 relative z-10">
                                <div className="group/item">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] block mb-4 opacity-40 group-hover/item:opacity-100 transition-opacity italic">TX_PROTOCOL_CLASS_SPEC:</span>
                                    <div className="text-[18px] font-black text-text-accent uppercase tracking-[0.4em] bg-text-accent/5 px-8 py-4 border-2 border-text-accent shadow-3xl hover:scale-105 transition-transform inline-block tabular-nums">
                                         [ {formData.tipo.replace(/_/g, '_')} ]
                                    </div>
                                </div>
                                <div className="group/item">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] block mb-4 opacity-40 group-hover/item:opacity-100 transition-opacity italic">ALLOCATED_BUFFER_NODES:</span>
                                    <div className="text-[18px] font-black text-text-primary tracking-[0.6em] tabular-nums flex items-center gap-6">
                                        <span className="text-text-accent border-b-4 border-text-accent/30 pb-1">0x{formData.activosIds.length.toString(16).toUpperCase().padStart(2, '0')}</span>
                                        <span className="text-[11px] text-text-muted opacity-30 font-black tracking-widest">({formData.activosIds.length}_DECIMAL_UNITS)</span>
                                    </div>
                                </div>
                                <div className="group/item md:col-span-2 border-t-2 border-border-default/10 pt-12">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] block mb-8 opacity-40 group-hover/item:opacity-100 transition-opacity italic">ENTITY_LOGISTICAL_ROUTING_MAP:</span>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-12">
                                        <div className="flex-1 bg-bg-base/50 p-8 border-2 border-border-default hover:border-text-accent transition-all shadow-xl group/card relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-5 text-[6px] font-black">SNDR</div>
                                            <p className="text-[10px] text-text-muted font-black tracking-[0.4em] uppercase mb-3 opacity-60 italic underline decoration-text-accent/20 decoration-2">CORE_ORIGIN_TX</p>
                                            <p className="text-[16px] font-black text-text-primary uppercase tracking-tight truncate border-l-4 border-text-accent pl-6 group-hover/card:tracking-widest transition-all">
                                                {formData.tipo === 'ASIGNACION' ? 'SYSTEM_CENTRAL_STORAGE' : (funcionarios.find(f => f.id == formData.funcionarioId)?.nombre.toUpperCase().replace(/ /g, '_') || 'NULL_AGENT_RX')}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center opacity-30">
                                             <div className="text-3xl font-black text-text-accent animate-pulse">&raquo;</div>
                                             <div className="text-[8px] font-black tracking-widest uppercase mt-2">TRANSF</div>
                                        </div>
                                        <div className="flex-1 bg-bg-base/50 p-8 border-2 border-border-default hover:border-text-accent transition-all shadow-xl group/card relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-5 text-[6px] font-black">RCVR</div>
                                            <p className="text-[10px] text-text-muted font-black tracking-[0.4em] uppercase mb-3 opacity-60 italic underline decoration-text-accent/20 decoration-2">DESTINATION_NODE</p>
                                            <p className="text-[16px] font-black text-text-primary uppercase tracking-tight truncate border-l-4 border-text-accent pl-6 group-hover/card:tracking-widest transition-all">
                                                {formData.tipo === 'TRASLADO' 
                                                    ? (funcionarios.find(f => f.id == formData.funcionarioDestinoId)?.nombre.toUpperCase().replace(/ /g, '_') || 'NULL_AGENT_ADDR')
                                                    : (formData.tipo === 'DEVOLUCION' ? 'SYSTEM_CENTRAL_STORAGE' : (funcionarios.find(f => f.id == formData.funcionarioId)?.nombre.toUpperCase().replace(/ /g, '_') || 'NULL_AGENT_ADDR'))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative background stripes */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-text-accent/5 rotate-45 pointer-events-none rounded-full blur-3xl opacity-20"></div>
                        </div>

                        <div className="space-y-8 group/obs">
                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.5em] group-focus-within/obs:text-text-accent transition-all opacity-70 underline decoration-border-default decoration-2 underline-offset-8">:: 0x05_TRANSACTION_METADATA_STREAM_LOG (OPTIONAL)</label>
                            <textarea
                                className="w-full bg-bg-base border-2 border-border-default p-10 text-[14px] font-black text-text-primary uppercase tracking-widest placeholder:opacity-10 focus:outline-none focus:border-text-accent transition-all min-h-[220px] custom-scrollbar shadow-inner resize-none leading-relaxed"
                                value={formData.observaciones}
                                onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                                placeholder="ENTER_METADATA_ANNOTATIONS_AND_PHYSICAL_OBSERVATIONS_FOR_XLS_MANIFEST_GENERATION_TX..."
                            ></textarea>
                            <div className="flex justify-between items-center opacity-30 italic text-[9px] uppercase tracking-widest">
                                 <span>ENCODING: UTF-8_BUF // 0xCOMMIT_READY</span>
                                 <span>LOG_STREAM: ENABLED_CORE</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-10 justify-between pt-16 border-t-2 border-border-default/30 flex-wrap-reverse items-center">
                            <button onClick={() => setStep(2)} className="px-14 py-6 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] border-2 border-border-default transition-all bg-bg-base shadow-2xl active:scale-95 group/prev">
                                <span className="flex items-center gap-6">
                                     <span className="opacity-30 group-hover/prev:-translate-x-3 transition-transform text-xl">&laquo;</span> [ RECONFIGURE_ALLOCATION ]
                                </span>
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-24 py-8 text-[15px] font-black bg-text-primary text-bg-base hover:bg-text-accent transition-all shadow-[0_0_50px_rgba(var(--text-accent),0.25)] hover:shadow-[0_0_70px_rgba(var(--text-accent),0.4)] disabled:opacity-20 uppercase tracking-[0.8em] flex items-center justify-center gap-10 group/commit active:scale-95 relative overflow-hidden ring-4 ring-text-primary hover:ring-text-accent transition-all"
                            >
                                {loading && <div className="absolute inset-0 bg-text-accent/20 animate-loadingBar"></div>}
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin rounded-full"></div>
                                        <span className="relative z-10 transition-all font-black">SYNCING_TX_STREAM...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10 transition-all group-hover/commit:tracking-[1.1em]">[ EXECUTE_DB_COMMIT_TX ]</span>
                                        <span className="opacity-20 group-hover/commit:opacity-100 transition-opacity text-[11px] relative z-10 font-bold bg-bg-base text-text-primary px-3 py-1 border border-text-primary">v_PRT-0x14</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* IO Terminal Session Status Footer Overlay */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-12 p-14 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-text-accent/30 to-transparent"></div>
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[1em] flex items-center gap-8 relative z-10">
                     <div className="w-4 h-4 bg-text-accent rotate-45 animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.8)]"></div>
                     CMD_TERMINAL_SESSION_RX_STABLE // KERNEL_ID: 0x88FE_CORE
                </div>
                <div className="text-[13px] font-black text-text-muted uppercase tracking-[0.5em] italic group-hover:text-text-primary transition-all relative z-10 tabular-nums">
                     ITSM_DOCUMENT_GENERATOR // PROTOCOL_ID: 0xFD44_BF_INIT
                </div>
            </div>
        </div>
    );
};

export default GenerarActa;
