import { useState, useRef } from 'react';
import api from '../../lib/axios';

const TABS = [
    { key: 'activos', label: 'ACTIVOS_NODE', color: 'indigo' },
    { key: 'funcionarios', label: 'PERSONNEL_NODE', color: 'emerald' },
    { key: 'cmdb', label: 'CMDB_AGGREGATOR', color: 'fuchsia' },
];

const ESTADO_CLASSES = {
    CREADO: 'text-text-primary border-border-default bg-bg-base shadow-sm',
    ACTUALIZADO: 'text-text-primary border-border-default bg-bg-base opacity-70',
    ERROR: 'text-text-accent border-text-accent bg-bg-base animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.1)]',
};

const ESTADO_ICONS = { CREADO: '[ OK ]', ACTUALIZADO: '[ UP ]', ERROR: '[ !! ]' };

const ImportarDatos = () => {
    const [tab, setTab] = useState('activos');
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [archivo, setArchivo] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef();

    const handleDescargarPlantilla = () => {
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        const url = `${baseUrl}/importar/plantilla/${tab}`;
        const link = document.createElement('a');
        link.href = url;
        let fileName = 'Plantilla.xlsx';
        if (tab === 'activos') fileName = 'Plantilla_Activos.xlsx';
        else if (tab === 'funcionarios') fileName = 'Plantilla_Funcionarios.xlsx';
        else if (tab === 'cmdb') fileName = 'Plantilla_CMDB.xlsx';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleFileChange = (file) => {
        if (!file) return;
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            alert('REQUIRED_FORMAT_VIOLATION: .XLSX OR .XLS_ONLY');
            return;
        }
        setArchivo(file);
        setResultado(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleImportar = async () => {
        if (!archivo) return;
        setLoading(true);
        setResultado(null);
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);
            const res = await api.post(`/importar/${tab}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResultado(res.data);
        } catch (err) {
            setResultado({ error: err.response?.data?.error || 'BUFFER_PROCESS_FATAL_FAULT' });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setArchivo(null);
        setResultado(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 border-l-4 border-l-border-default/10 animate-fadeIn">
            {/* Header / Bulk IO Commander */}
            <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover:opacity-30 transition-opacity">BULK_IO_STREAM_RX_0xFD</div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                             <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.6em] text-text-primary leading-tight">
                                 / bulk_data_import_module
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-10">
                            <div className="flex items-center gap-4">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.5em] opacity-60">INGESTION_SERVICE_READY // <span className="text-text-primary underline decoration-text-accent decoration-2 underline-offset-4">V_STABLE_02</span></p>
                            </div>
                            <span className="text-border-default h-6 w-[2px] bg-border-default/30"></span>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 italic">MASS_REGISTRATION_SYSTEM_CONTROLLER</p>
                        </div>
                    </div>
                </div>
                {/* Visual Progress accent */}
                <div className="absolute bottom-0 left-0 w-full h-[4px] bg-border-default/10">
                     <div className="h-full bg-text-accent w-1/3 animate-loadingBarSlow"></div>
                </div>
            </div>

            {/* Tab Selection Protocol */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => { setTab(t.key); handleReset(); }}
                        className={`group relative p-10 text-[13px] font-black uppercase tracking-[0.6em] transition-all border-2 shadow-2xl flex flex-col items-start overflow-hidden active:scale-95
                            ${tab === t.key
                                ? 'bg-bg-elevated border-text-accent text-text-accent ring-2 ring-text-accent ring-inset'
                                : 'bg-bg-base border-border-default text-text-muted hover:border-border-strong hover:text-text-primary opacity-50 grayscale'
                            }`}
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10 text-[9px] font-black uppercase tracking-tighter ${tab === t.key ? 'opacity-40 text-text-accent' : ''}`}>IO_TARGET: {t.key.substring(0,3).toUpperCase()}</div>
                        <span className="relative z-10 transition-all group-hover:tracking-[0.8em]">{t.label.replace(/_/g, '_')}</span>
                        <div className={`h-px w-20 transition-all duration-500 mt-4 ${tab === t.key ? 'bg-text-accent w-40' : 'bg-border-default opacity-20'}`}></div>
                        {tab === t.key && <div className="absolute inset-0 bg-text-accent/5 animate-pulse"></div>}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
                {/* Stage 1: Protocol Template Acquisition */}
                <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl hover:border-border-strong transition-all relative overflow-hidden group/stage">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-sm font-black uppercase tracking-[1em] group-hover/stage:text-text-accent transition-colors">SCHEMA_DEF_0xAF</div>
                    <div className="flex items-start gap-10">
                        <div className="flex-shrink-0 w-16 h-16 border-2 border-border-default bg-bg-base text-[18px] font-black flex items-center justify-center text-text-primary shadow-inner group-hover/stage:border-text-accent transition-colors">01</div>
                        <div className="flex-1">
                            <h2 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em] mb-6 flex items-center gap-4 group-hover/stage:text-text-accent transition-colors">
                                <span className="opacity-30">#</span> FETCH_SCHEMA_TEMPLATE
                            </h2>
                            <div className="h-px w-24 bg-text-accent mb-8 opacity-20 group-hover/stage:opacity-60 transition-all"></div>
                            <p className="text-[11px] text-text-muted font-black leading-relaxed opacity-60 uppercase tracking-widest mb-12 border-l-4 border-text-accent/20 pl-8 italic">
                                OBTAIN_STRICT_SCHEMA_MANIFEST_FOR_CURRENT_IO_TARGET. ENSURE_DATA_FIELDS_MATCH_SPECIFIED_CELLS_EXACTLY_OR_INGESTION_FAULT_BUF_CRASH.
                            </p>
                            <button
                                onClick={handleDescargarPlantilla}
                                className="w-full px-12 py-6 text-[13px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-3xl uppercase tracking-[0.7em] active:scale-95 group/btn relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-6">
                                     [ XLS_TEMPLATE_FETCH_{tab.substring(0,3).toUpperCase()} ]
                                     <span className="opacity-30 group-hover/btn:translate-y-2 transition-transform text-xl">&darr;</span>
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stage 2: Payload Injection */}
                <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl hover:border-border-strong transition-all relative overflow-hidden group/stage">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-sm font-black uppercase tracking-[1em] group-hover/stage:text-text-accent transition-colors">PAYLOAD_STREAM_INJ</div>
                    <div className="flex items-start gap-10 h-full">
                        <div className="flex-shrink-0 w-16 h-16 border-2 border-border-default bg-bg-base text-[18px] font-black flex items-center justify-center text-text-primary shadow-inner group-hover/stage:border-text-accent transition-colors">02</div>
                        <div className="flex-1 flex flex-col h-full">
                            <h2 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em] mb-6 flex items-center gap-4 group-hover/stage:text-text-accent transition-colors">
                                <span className="opacity-30">#</span> DATA_MANIFEST_UPLOAD
                            </h2>
                            <div className="h-px w-24 bg-text-accent mb-8 opacity-20 group-hover/stage:opacity-60 transition-all"></div>
                            
                            {/* Drag Enclave Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`flex-1 border-4 border-dashed p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden ring-inset
                                    ${dragOver
                                        ? 'border-text-accent bg-bg-elevated ring-4 ring-text-accent/10 shadow-[0_0_50px_rgba(var(--text-accent),0.1)]'
                                        : archivo
                                            ? 'border-text-primary bg-bg-base shadow-2xl'
                                            : 'border-border-default hover:border-text-accent/50 bg-bg-base/30 group/drop shadow-inner'
                                    }`}
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                />
                                {archivo ? (
                                    <div className="animate-fadeIn relative z-10 w-full text-center py-6">
                                        <div className="text-[12px] font-black text-text-accent mb-6 uppercase tracking-[0.6em] animate-pulse underline decoration-text-accent/30 decoration-2 underline-offset-8">[ PAYLOAD_BUFFERED_STABLE ]</div>
                                        <div className="bg-bg-surface p-8 border-2 border-text-primary inline-block max-w-full hover:border-text-accent transition-colors shadow-3xl">
                                            <p className="text-[14px] font-black text-text-primary uppercase tracking-tighter truncate mb-3">{archivo.name.toUpperCase().replace(/ /g, '_')}</p>
                                            <div className="flex items-center justify-center gap-6 mt-4">
                                                <p className="text-[10px] text-text-muted font-black tracking-[0.3em] opacity-60 tabular-nums bg-bg-base px-3 py-1 border border-border-default shadow-sm">
                                                    SIZE_RX: 0x{(archivo.size / 1024).toFixed(1).replace('.', '')} KB_NODES
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="group-hover/drop:scale-105 transition-all duration-500 relative z-10 p-10">
                                        <div className="text-[11px] font-black text-text-muted mb-6 uppercase tracking-[0.5em] opacity-40">[ IO_RECOVERY_ADDR_RX ]</div>
                                        <p className="text-[13px] font-black text-text-muted uppercase tracking-[0.4em] leading-relaxed group-hover/drop:text-text-primary">
                                            DRAG_AND_DROP_RAW_MANIFEST <br/> <span className="text-text-primary group-hover/drop:text-text-accent transition-all underline decoration-text-accent/20 decoration-4 underline-offset-[12px] hover:decoration-text-accent">:: MOUNT_STORAGE_VOLUME ::</span>
                                        </p>
                                        <div className="mt-12 text-[10px] font-black text-text-muted opacity-20 tracking-widest italic group-hover/drop:opacity-40 transition-opacity">EXTENSIONS: .XLSX // .XLS_ONLY</div>
                                    </div>
                                )}
                                {dragOver && <div className="absolute inset-0 bg-text-accent/10 animate-pulse"></div>}
                            </div>

                            {/* Command Buttons */}
                            <div className="flex gap-10 mt-12 flex-wrap sm:flex-nowrap">
                                <button
                                    disabled={!archivo || loading}
                                    onClick={handleImportar}
                                    className="flex-1 px-12 py-6 text-[13px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_0_40px_rgba(var(--text-primary),0.2)] hover:shadow-[0_0_60px_rgba(var(--text-accent),0.3)] disabled:opacity-20 uppercase tracking-[0.7em] active:scale-95 group/commit relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-6">
                                         {loading ? 'SYNCING_TX_STREAM...' : '[ EXECUTE_BULK_IMPORT ]'}
                                         {!loading && <span className="opacity-30 group-hover/commit:translate-x-3 transition-transform text-xl">&raquo;</span>}
                                    </span>
                                    {loading && <div className="absolute inset-0 bg-text-accent/20 animate-loadingBar"></div>}
                                </button>
                                {archivo && (
                                    <button
                                        onClick={handleReset}
                                        className="px-10 py-6 text-[12px] font-black text-text-muted hover:text-text-accent uppercase tracking-[0.4em] border-2 border-border-default hover:border-text-accent transition-all shadow-2xl active:scale-95 bg-bg-base"
                                    >
                                        [ DISCARD ]
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Trace Output */}
            {resultado && (
                <div className="bg-bg-surface border-2 border-border-default p-14 shadow-3xl relative animate-slideUp overflow-hidden group/results hover:border-border-strong transition-all">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-sm font-black uppercase tracking-[1.5em] group-hover/results:text-text-accent transition-all">BUFFER_IO_MANIFEST_LOG_0xAF</div>
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-text-accent opacity-30 shadow-[0_0_20px_rgba(var(--text-accent),0.2)]"></div>
                    
                    <h2 className="text-[15px] font-black text-text-primary uppercase tracking-[0.8em] mb-14 border-b-2 border-border-default pb-10 flex items-center gap-8 group-hover/results:text-text-accent transition-colors">
                        <div className="w-4 h-4 bg-text-accent shadow-[0_0_12px_rgba(var(--text-accent),0.6)]"></div>
                        / raw_transaction_processing_trace
                    </h2>

                    {resultado.error ? (
                        <div className="p-12 border-4 border-text-accent bg-text-accent/5 text-text-accent shadow-3xl relative overflow-hidden animate-shake flex items-center gap-12">
                             <div className="absolute top-0 right-0 p-8 opacity-20 text-[12px] font-black uppercase tracking-[0.6em] italic">FATAL_ENCOUNTER_IO_FAILURE</div>
                             <span className="font-black text-8xl leading-none animate-pulse">!!!</span>
                             <div className="space-y-6 pt-2 z-10">
                                 <p className="text-[18px] font-black uppercase tracking-[0.8em] text-text-primary underline decoration-text-accent decoration-4 underline-offset-8">TX_STREAM_INTERRUPTED_IO</p>
                                 <p className="text-[13px] font-black opacity-90 border-l-4 border-text-accent/40 pl-10 py-4 tracking-widest leading-loose uppercase bg-bg-base/50">{resultado.error}</p>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-20 animate-fadeIn">
                                {/* KPI Snapshot Buffer */}
                                {tab === 'cmdb' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
                                        {[
                                            { label: 'PERS_CREATED', value: resultado.resumen.funcionariosCreados },
                                            { label: 'PERS_UPDATED', value: resultado.resumen.funcionariosActualizados },
                                            { label: 'NODE_CREATED', value: resultado.resumen.activosCreados },
                                            { label: 'NODE_UPDATED', value: resultado.resumen.activosActualizados },
                                            { label: 'MAP_CREATED', value: resultado.resumen.asignacionesCreadas },
                                            { label: 'BUF_ERROR', value: resultado.resumen.errores, error: true },
                                        ].map(s => (
                                            <div key={s.label} className={`group/stat relative flex flex-col p-8 bg-bg-base border-2 transition-all hover:scale-105 shadow-2xl active:scale-95 ${s.error && s.value > 0 ? 'border-text-accent shadow-[0_0_30px_rgba(var(--text-accent),0.15)] ring-2 ring-text-accent ring-inset' : 'border-border-default hover:border-border-strong hover:shadow-[0_0_30px_rgba(var(--text-primary),0.05)]'}`}>
                                                <div className="absolute top-0 right-0 p-2 opacity-5 text-[9px] font-black uppercase tracking-tighter group-hover/stat:opacity-20">STAT_0x{s.label.substring(0,3)}</div>
                                                <div className={`text-4xl font-black tabular-nums transition-all ${s.error && s.value > 0 ? 'text-text-accent animate-pulse' : 'text-text-primary group-hover/stat:text-text-accent'}`}>
                                                    [{s.value.toString().padStart(2, '0')}]
                                                </div>
                                                <div className="h-px w-full bg-border-default/20 my-6 transition-all group-hover/stat:w-full group-hover/stat:bg-text-accent/30"></div>
                                                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-60 leading-tight group-hover/stat:opacity-100 transition-opacity">{s.label.replace(/_/g, '_')}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                                        {[
                                            { label: 'TOTAL_TX_COUNT', value: resultado.resumen.total },
                                            { label: 'NODES_GENERATED', value: resultado.resumen.creados },
                                            { label: 'LOGS_REWRITTEN', value: resultado.resumen.actualizados },
                                            { label: 'BUF_EXCEPTIONS', value: resultado.resumen.errores, error: true },
                                        ].map(s => (
                                            <div key={s.label} className={`group/stat relative flex flex-col p-10 bg-bg-base border-2 transition-all hover:scale-105 shadow-3xl active:scale-95 ${s.error && s.value > 0 ? 'border-text-accent shadow-[0_0_40px_rgba(var(--text-accent),0.2)] ring-2 ring-text-accent ring-inset' : 'border-border-default hover:border-border-strong'}`}>
                                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[10px] font-black uppercase tracking-tighter group-hover/stat:opacity-20 transition-all group-hover/stat:text-text-accent">CORE_REG_IDX</div>
                                                <div className={`text-5xl font-black tabular-nums transition-all ${s.error && s.value > 0 ? 'text-text-accent animate-pulse' : 'text-text-primary group-hover/stat:text-text-accent'}`}>
                                                    [{s.value.toString().padStart(2, '0')}]
                                                </div>
                                                <div className="h-[2px] w-full bg-border-default/20 my-8 shadow-inner group-hover/stat:bg-text-accent/30 transition-all"></div>
                                                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.6em] opacity-60 transition-opacity group-hover/stat:opacity-100">{s.label.replace(/_/g, '_')}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Line-by-Line Registry Feed */}
                                <div className="border-2 border-border-default bg-bg-base/30 shadow-inner group/table relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-text-accent opacity-20"></div>
                                    <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
                                        <table className="w-full border-collapse border-spacing-0">
                                            <thead className="bg-bg-surface sticky top-0 z-10 border-b-2 border-border-default/60 backdrop-blur-md">
                                                <tr>
                                                    <th className="px-10 py-8 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r-2 border-border-default/10">:: BUFFER_PTR_ADDR</th>
                                                    <th className="px-10 py-8 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.5em] border-r-2 border-border-default/10">:: STATUS_BITS_RX</th>
                                                    <th className="px-10 py-8 text-left text-[11px] font-black text-text-muted uppercase tracking-[0.5em]">:: LOG_MANIFEST_REPLY_BUF</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-2 divide-border-default/5 hover:bg-bg-base/10 transition-colors">
                                                {resultado.resultados.map((r, i) => (
                                                    <tr key={i} className="hover:bg-bg-elevated/40 transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                                        <td className="px-10 py-6 text-[12px] text-text-muted font-black uppercase tracking-[0.3em] border-r-2 border-border-default/5 tabular-nums">
                                                            L_ADDR_{i.toString().padStart(3, '0')}>> <span className="text-text-primary opacity-60 group-hover/row:opacity-100 transition-opacity">0x{r.fila.toString(16).toUpperCase().padStart(3, '0')}</span>
                                                        </td>
                                                        <td className="px-10 py-6 border-r-2 border-border-default/5">
                                                            <span className={`inline-flex items-center px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all tabular-nums shadow-lg ${ESTADO_CLASSES[r.estado]}`}>
                                                                <span className="mr-4 opacity-40">{ESTADO_ICONS[r.estado]}</span> {r.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-10 py-6 text-[12px] font-black text-text-primary uppercase tracking-tight opacity-70 group-hover/row:opacity-100 transition-all tabular-nums italic">
                                                            {r.mensaje.toUpperCase().replace(/ /g, '_')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        </div>
                    )}
                </div>
            )}

            {/* Controller Footer Stream Identify Overlay */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-12 p-14 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-text-accent/30 to-transparent"></div>
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-8 relative z-10">
                     <div className="w-4 h-4 bg-text-accent rotate-45 animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.8)]"></div>
                     BULK_IO_STABLE_CHANNEL_RX // CRC_0xFD44_OK
                </div>
                <div className="text-[13px] font-black text-text-muted uppercase tracking-[0.5em] italic group-hover:text-text-primary transition-all relative z-10 tabular-nums">
                     ITSM_MASS_INGESTION_CONTROLLER // PARITY_ACKN_TRUE
                </div>
            </div>
        </div>
    );
};

export default ImportarDatos;
