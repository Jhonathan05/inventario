import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { getImageUrl, formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import ActivosForm from './ActivosForm';
import HojaVidaForm from './components/HojaVidaForm';
import EstadoHojaVidaForm from './components/EstadoHojaVidaForm';
import DocumentosList from './components/DocumentosList';
import ActivoLicenciasList from './components/ActivoLicenciasList';

const ActivoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [activo, setActivo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isHVModalOpen, setIsHVModalOpen] = useState(false);
    const [selectedHV, setSelectedHV] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    useEffect(() => {
        fetchActivo();
    }, [id]);

    const fetchActivo = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/activos/${id}`);
            if (!res.data.hojaVida) res.data.hojaVida = [];
            if (!res.data.documentos) res.data.documentos = [];
            setActivo(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (estado) => {
        switch (estado) {
            case 'DISPONIBLE': return 'border-text-primary text-text-primary bg-bg-base opacity-40 hover:opacity-100 shadow-inner group-hover/header:border-text-accent transition-all';
            case 'ASIGNADO': return 'border-border-default text-text-primary bg-bg-elevated/80 shadow-md group-hover/header:border-text-primary transition-all';
            case 'EN_MANTENIMIENTO': return 'border-text-accent text-text-accent bg-text-accent/5 animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.4)]';
            case 'DADO_DE_BAJA': return 'border-border-default/40 text-text-muted opacity-20 grayscale transition-all';
            default: return 'border-border-default text-text-muted';
        }
    };

    const getHVStatusBadge = (estado) => {
        const base = "inline-flex items-center px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] border-4 transition-all shadow-xl tabular-nums";
        if (estado === 'FINALIZADO' || estado === 'CERRADO') return `${base} border-text-primary text-text-primary bg-bg-base opacity-30 hover:opacity-100 group-hover/row:opacity-100`;
        if (estado === 'EN_PROCESO' || estado === 'CREADO') return `${base} border-text-accent text-text-accent bg-text-accent/5 animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.3)]`;
        return `${base} border-border-default text-text-muted opacity-20`;
    };

    if (loading) return (
        <div className="mt-40 text-center py-40 font-mono animate-fadeIn selection:bg-text-accent selection:text-bg-base">
            <div className="w-32 h-32 border-8 border-border-default border-t-text-accent animate-spin mx-auto mb-16 shadow-[0_0_80px_rgba(var(--text-accent),0.2)] rounded-full"></div>
            <div className="text-[20px] uppercase tracking-[1.4em] text-text-accent font-black animate-pulse"># SYNCING_NODE_DATA_BLOCKS_RX...</div>
            <div className="mt-8 text-[11px] text-text-muted uppercase tracking-[0.8em] opacity-40 italic border-l-4 border-border-default/30 pl-10 inline-block">querying_repository_node_tx_0xFD42_v4</div>
            <div className="mt-16 max-w-sm mx-auto h-[4px] bg-bg-surface border-2 border-border-default overflow-hidden">
                 <div className="h-full bg-text-accent animate-progressBar"></div>
            </div>
        </div>
    );
    
    if (!activo) return (
        <div className="mt-40 text-center py-40 font-mono bg-bg-surface border-8 border-text-accent/30 mx-10 shadow-[0_60px_150px_rgba(0,0,0,0.8)] animate-fadeIn relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 text-2xl font-black uppercase tracking-[1.5em] group-hover:text-text-accent group-hover:scale-110 transition-all pointer-events-none italic">0x00_FATAL_IDENT_FAULT</div>
            <div className="relative z-10 p-16">
                <div className="text-[24px] uppercase tracking-[0.8em] text-text-accent font-black mb-10 drop-shadow-lg">! SYSTEM_ERROR :: NODE_IO_NULL</div>
                <div className="text-[12px] text-text-muted uppercase tracking-[0.5em] opacity-50 mb-20 max-w-lg mx-auto leading-relaxed border-l-4 border-text-accent/20 pl-8">IDENTIFIER_MANIFEST "{id}" RESOLVED_TO_NULL_VAL_INTERRUPT // CORE_HALTED</div>
                <button onClick={() => navigate('/activos')} className="bg-bg-elevated border-4 border-border-strong px-14 py-6 text-[13px] font-black uppercase tracking-[0.6em] text-text-primary hover:border-text-accent hover:text-text-accent transition-all active:scale-90 shadow-[0_20px_60px_rgba(0,0,0,0.5)] group/btn relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-6">
                        <span className="group-hover/btn:-translate-x-3 transition-transform">&larr;</span> [ RETURN_TO_LIST_HUB ]
                    </span>
                    <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                </button>
            </div>
        </div>
    );

    const tabs = [
        { key: 'general', label: 'GEN_DATA_TX' },
        { key: 'asignaciones', label: 'ALLOCATION_HISTORY' },
        { key: 'hojadevida', label: 'MAINTENANCE_LOG' },
        { key: 'documentos', label: 'DOC_VAULT_RX' },
        { key: 'software', label: 'SW_RESOURCES_MAP' },
    ];

    const InfoItem = ({ label, value }) => (
        <div className="group/item relative overflow-hidden p-8 bg-bg-base/30 border-2 border-border-default/40 hover:border-text-accent/60 transition-all duration-500 shadow-xl active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-[8px] font-black uppercase tracking-tighter group-hover/item:opacity-20 group-hover/item:text-text-accent transition-all">IO_NODE_v4</div>
            <dt className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] mb-4 border-l-4 border-border-default/40 pl-6 group-hover/item:border-text-accent/60 group-hover/item:text-text-primary transition-all italic opacity-60 group-hover/item:opacity-100">:: {label.toUpperCase().replace(/ /g, '_')}</dt>
            <dd className="text-[14px] font-black text-text-primary uppercase tracking-[0.1em] pl-10 truncate tabular-nums group-hover/item:translate-x-2 transition-transform drop-shadow-sm" title={value}>{value || <span className="opacity-10 italic tracking-normal">NULL_VAL_ACK</span>}</dd>
            <div className="absolute bottom-0 left-0 h-[2px] bg-text-accent transition-all duration-700 w-0 group-focus-within:w-full group-hover/item:w-full opacity-30"></div>
        </div>
    );

    return (
        <div className="font-mono mb-40 px-4 sm:px-6 lg:px-10 animate-fadeIn selection:bg-text-accent selection:text-bg-base border-r-4 border-r-border-default/10">
            {/* Header Navigation Enclave */}
            <div className="mb-20">
                <button onClick={() => navigate('/activos')} className="text-[13px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] transition-all mb-12 flex items-center gap-6 group/back active:scale-95 group">
                    <span className="group-hover/back:-translate-x-4 transition-transform text-text-accent text-3xl font-normal opacity-40 group-hover:opacity-100">&larr;</span> 
                    <span className="border-b-4 border-transparent group-hover:border-text-accent pb-1 transition-all">[ BACK_TO_INVENTORY_HUB ]</span>
                </button>
                
                <div className="bg-bg-surface border-4 border-border-default p-12 shadow-[0_50px_150px_rgba(0,0,0,0.7)] relative overflow-hidden group/header hover:border-text-accent/40 transition-colors duration-700">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[2em] group-hover/header:opacity-20 group-hover/header:translate-x-6 transition-all italic italic">NODE_MANIFEST_BLOCK_0x{String(activo.id).slice(0,8).toUpperCase()}</div>
                    <div className="absolute bottom-0 left-0 w-full h-[8px] bg-border-default/20">
                         <div className="h-full bg-text-accent w-1/3 animate-loadingBarSlow shadow-[0_0_15px_rgba(var(--text-accent),0.3)]"></div>
                    </div>

                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-12 relative z-10">
                        <div>
                            <div className="flex items-center gap-10 mb-6 group">
                                 <div className="w-6 h-6 bg-text-accent animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.6)] group-hover/header:rotate-45 transition-transform duration-1000"></div>
                                 <h1 className="text-5xl font-black uppercase tracking-[0.5em] text-text-primary leading-none drop-shadow-2xl">
                                     <span className="text-text-accent opacity-20 text-6xl">/</span> {activo.marca} <span className="opacity-40 italic font-medium">{activo.modelo}</span>
                                 </h1>
                            </div>
                            <div className="text-[12px] text-text-muted font-black uppercase tracking-[0.4em] flex flex-wrap gap-12 opacity-50 group-hover/header:opacity-100 transition-all tabular-nums italic">
                                <span className="flex items-center gap-4 bg-bg-base px-4 py-1.5 border-2 border-border-default/40 shadow-inner">IDENT_PLACA: <span className="text-text-primary not-italic font-black">[{activo.placa}]</span></span>
                                <span className="flex items-center gap-4 bg-bg-base px-4 py-1.5 border-2 border-border-default/40 shadow-inner">AF_TAG_v4: <span className="text-text-primary not-italic font-black">[{activo.activoFijo || '----'}]</span></span>
                                <span className="flex items-center gap-4 bg-bg-base px-4 py-1.5 border-2 border-border-default/40 shadow-inner">SERIAL_RX: <span className="text-text-primary not-italic font-black">[{activo.serial}]</span></span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-12 bg-bg-base/30 p-8 border-4 border-border-default/60 backdrop-blur-md shadow-2xl group-hover/header:bg-bg-base/50 transition-all">
                            <span className={`px-10 py-4 text-[12px] font-black tracking-[0.6em] uppercase border-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all tabular-nums hover:scale-105 active:scale-95 ${getStatusBadge(activo.estado)}`}>
                                [ {activo.estado?.toUpperCase().replace(/_/g, ' ')} ]
                            </span>
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="bg-bg-elevated border-4 border-border-strong px-14 py-4 text-[13px] font-black text-text-accent hover:text-text-primary hover:border-text-accent uppercase tracking-[0.6em] transition-all shadow-3xl active:scale-90 group/btn relative overflow-hidden"
                                >
                                    <span className="relative z-10 group-hover/btn:tracking-[0.8em] transition-all flex items-center gap-4">
                                        [ MODIFY_NODE_TX ] <span className="opacity-20 group-hover/btn:opacity-100 group-hover/btn:translate-x-4 transition-all">&raquo;</span>
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 h-0 group-hover/btn:h-full bg-text-accent/5 transition-all"></div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Logical Tabs / Stream Selector Viewport */}
            <div className="mb-20 border-b-8 border-border-default flex overflow-x-auto custom-scrollbar bg-bg-surface/60 backdrop-blur-xl sticky top-0 z-50 shadow-2xl border-x-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`whitespace-nowrap px-14 py-10 text-[13px] font-black uppercase tracking-[0.6em] transition-all border-b-8 relative overflow-hidden active:scale-[0.98] group ${activeTab === tab.key
                            ? 'border-text-accent text-text-primary bg-text-accent/10 shadow-[inset_0_-20px_40px_rgba(var(--text-accent),0.1)]'
                            : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-elevated/40'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-6">
                             {activeTab === tab.key && <span className="text-text-accent animate-pulse">&gt;</span>}
                             {tab.label}
                        </span>
                        {activeTab === tab.key && (
                            <div className="absolute top-0 right-0 p-3 opacity-20 text-[10px] font-black uppercase tracking-tighter bg-text-accent/10 italic">RX_STREAM</div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-text-accent transition-all duration-700 opacity-0 group-hover:opacity-40 translate-y-full group-hover:translate-y-0"></div>
                    </button>
                ))}
            </div>

            {/* Manifest Payload Viewport */}
            <div className="animate-fadeIn relative z-10">
                {activeTab === 'general' && (
                    <div className="space-y-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Block ALPHA - Specification */}
                            <div className="lg:col-span-2 bg-bg-surface border-4 border-border-default p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative overflow-hidden group/box hover:border-text-accent/30 transition-colors duration-700">
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-[11px] font-black uppercase tracking-[1em] group-hover/box:opacity-15 transition-all italic pointer-events-none">SYS_IO_BLOCK_ALPHA_RX</div>
                                <div className="flex items-center gap-10 mb-16 pb-10 border-b-4 border-border-default/40">
                                    <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]">&alpha;</div>
                                    <div>
                                        <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em]"># CORE_SPECIFICATION_MATRIX</h3>
                                        <div className="h-1 w-40 bg-text-accent/40 mt-3 rounded-full overflow-hidden">
                                             <div className="h-full bg-text-accent w-2/3 animate-loadingBarSlow"></div>
                                        </div>
                                    </div>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <InfoItem label="Categoría Manifest" value={activo.categoria?.nombre} />
                                    <InfoItem label="Tipo de Equipo RX" value={activo.tipo} />
                                    <InfoItem label="Nombre Host ID" value={activo.nombreEquipo} />
                                    <InfoItem label="Ubicación Física" value={activo.ubicacion} />
                                    <InfoItem label="Activo Fijo Tag" value={activo.activoFijo} />
                                    <InfoItem label="Valor Adquisición" value={formatCurrency(activo.valorCompra)} />
                                    <InfoItem label="Fecha Adquisición" value={formatDate(activo.fechaCompra)} />
                                    <InfoItem label="Vencimiento Garantía" value={formatDate(activo.garantiaHasta)} />
                                    <InfoItem label="Color / Chasis" value={activo.color} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Metadata Log Ops / Manifest Notes" value={activo.observaciones} />
                                    </div>
                                </dl>
                            </div>

                            {/* Block BETA - Visual Node */}
                            <div className="bg-bg-surface border-4 border-border-default p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative overflow-hidden group/imgbox hover:border-text-accent/30 transition-colors duration-700">
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-[11px] font-black uppercase tracking-[1em] group-hover/imgbox:opacity-15 transition-all italic italic pointer-events-none">NODE_VISUAL_TRACE_BETA</div>
                                <div className="flex items-center gap-10 mb-16 pb-10 border-b-4 border-border-default/40">
                                    <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]">&beta;</div>
                                    <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em]"># VISUAL_NODE_IO</h3>
                                </div>
                                <div className="aspect-square bg-bg-base border-8 border-border-default overflow-hidden relative group/img shadow-[0_30px_80px_rgba(0,0,0,0.8)] group-hover/imgbox:border-text-accent/20 transition-all duration-700">
                                    <div className="absolute inset-0 bg-text-accent/10 pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity z-10"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-bg-base/40 to-transparent z-[5] pointer-events-none"></div>
                                    {getImageUrl(activo.imagen) ? (
                                        <img src={getImageUrl(activo.imagen)} alt="" className="w-full h-full object-cover group-hover/img:scale-125 transition-transform duration-[3000ms]" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center opacity-10 grayscale p-16 relative">
                                             <div className="text-9xl font-black blur-[2px]">NULL</div>
                                             <div className="absolute text-[12px] font-black uppercase tracking-[1em] rotate-45 border-4 border-text-muted px-10 py-4 opacity-50"># NO_IMAGE_BUFF</div>
                                        </div>
                                    )}
                                    <div className="absolute top-0 left-0 p-6 bg-bg-surface/90 border-b-4 border-r-4 border-border-default text-[11px] font-black uppercase tracking-[0.4em] opacity-90 backdrop-blur-md z-20 shadow-2xl group-hover/imgbox:border-text-accent transition-colors">IO_TAG_RX: {activo.placa}</div>
                                    {/* Scanline effect */}
                                    <div className="absolute inset-0 z-30 pointer-events-none opacity-5 bg-gradient-to-b from-transparent via-text-accent to-transparent h-1/4 animate-scanline"></div>
                                </div>
                                <div className="mt-12 text-[11px] text-text-muted font-black uppercase tracking-[0.6em] opacity-30 text-center italic hover:opacity-100 transition-opacity">MANIFEST_HASH: 0x{String(activo.id).substring(String(activo.id).length - 12).toUpperCase()}</div>
                            </div>
                        </div>

                        {/* Block GAMMA & DELTA - Admin & Holder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                             {/* GAMMA BLOCK */}
                             <div className="bg-bg-surface border-4 border-border-default p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)] group/admin relative overflow-hidden hover:border-text-accent/30 transition-colors duration-700">
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-[11px] font-black uppercase tracking-[1em] italic pointer-events-none">SYS_IO_BLOCK_GAMMA</div>
                                <div className="flex items-center gap-10 mb-16 pb-10 border-b-4 border-border-default/40">
                                    <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]">&gamma;</div>
                                    <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em]"># ADMIN_GOVERNANCE_PROTOCOL</h3>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <InfoItem label="Entidad Propietaria" value={activo.empresaPropietaria} />
                                    <InfoItem label="Unidad Dependencia" value={activo.dependencia} />
                                    <InfoItem label="Stream Recurso TX" value={activo.fuenteRecurso} />
                                    <InfoItem label="Tipo Recurso RX" value={activo.tipoRecurso} />
                                    <InfoItem label="Protocolo Control" value={activo.tipoControl} />
                                    <InfoItem label="Estado Operativo RX" value={activo.estadoOperativo} />
                                    <InfoItem label="Razón Status Manifest" value={activo.razonEstado} />
                                </dl>
                             </div>

                             {/* DELTA BLOCK */}
                             <div className="bg-bg-surface border-4 border-border-default p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)] group/holder relative overflow-hidden hover:border-text-accent/30 transition-colors duration-700">
                                <div className="absolute top-0 right-0 p-8 opacity-5 text-[11px] font-black uppercase tracking-[1em] italic pointer-events-none">SYS_IO_BLOCK_DELTA</div>
                                <div className="flex items-center gap-10 mb-16 pb-10 border-b-4 border-border-default/40">
                                    <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]">&delta;</div>
                                    <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em]"># HOLDER_ALLOCATION_ENCLAVE</h3>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <InfoItem label="Empresa Holder" value={activo.empresaFuncionario} />
                                    <InfoItem label="Tipo Personal TX" value={activo.tipoPersonal} />
                                    <InfoItem label="Ident UID Core" value={activo.cedulaFuncionario} />
                                    <InfoItem label="Alias / RX_ID" value={activo.shortname} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Full Holder Identity Manifest" value={activo.nombreFuncionario} />
                                    </div>
                                    <InfoItem label="Geo Dept Tolima" value={activo.departamento} />
                                    <InfoItem label="Geo Region RX" value={activo.ciudad} />
                                    <InfoItem label="Logical Role" value={activo.cargo} />
                                    <InfoItem label="Area Core Block" value={activo.area} />
                                </dl>
                             </div>
                        </div>

                        {/* Block TAU - Technical Matrix */}
                        <div className="bg-bg-surface border-4 border-border-default p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)] group/tech relative overflow-hidden hover:border-text-accent/30 transition-colors duration-700">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-[11px] font-black uppercase tracking-[1.5em] italic pointer-events-none">TECHNICAL_HARDWARE_SPEC_MATRIX_TAU</div>
                            <div className="flex items-center gap-10 mb-16 pb-10 border-b-4 border-border-default/40">
                                <div className="w-12 h-12 flex items-center justify-center border-4 border-text-accent font-black text-2xl bg-text-accent/5 shadow-[0_0_30px_rgba(var(--text-accent),0.2)]">&tau;</div>
                                <h3 className="text-[18px] font-black text-text-primary uppercase tracking-[0.8em]"># TECHNICAL_HARDWARE_NODE_SPECS</h3>
                            </div>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                                <InfoItem label="Procesador Core Unit" value={activo.procesador} />
                                <InfoItem label="RAM_Buffer_RX" value={activo.memoriaRam} />
                                <InfoItem label="Storage_Volume_TX" value={activo.discoDuro} />
                                <InfoItem label="System_Core_OS_v4" value={activo.sistemaOperativo} />
                            </dl>
                            {/* Inner graphical decoration */}
                            <div className="mt-14 h-4 bg-bg-base/30 border-2 border-dashed border-border-default/40 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                )}

                {activeTab === 'asignaciones' && (
                    <div className="bg-bg-surface border-8 border-border-default shadow-[0_50px_150px_rgba(0,0,0,0.8)] overflow-hidden group/alloc hover:border-text-accent/20 transition-all duration-1000 relative animate-fadeIn">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-xl font-black uppercase tracking-[2em] group-hover/alloc:text-text-accent group-hover/alloc:opacity-20 transition-all italic italic">ALLOCATION_CHRONO_BUFFER_STREAM</div>
                        <div className="absolute top-0 left-0 w-4 h-full bg-text-accent/10 opacity-30 group-hover/alloc:opacity-100 transition-opacity"></div>
                        
                        <div className="overflow-x-auto custom-scrollbar bg-bg-base/20">
                            <table className="w-full text-left border-collapse min-w-[1000px] border-spacing-0">
                                <thead>
                                    <tr className="bg-bg-base/95 backdrop-blur-md border-b-8 border-border-default shadow-2xl relative z-10">
                                        <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-accent border-r-4 border-border-default/30 shadow-inner">:: NODE_HOLDER_ID</th>
                                        <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: ALLOC_PROTOCOL</th>
                                        <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: TX_STAMP_START</th>
                                        <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: TX_STAMP_END</th>
                                        <th className="px-12 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted shadow-inner bg-bg-surface/40">:: LOG_METADATA_MANIFEST</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-4 divide-border-default/10">
                                    {activo.asignaciones?.map((asig) => (
                                        <tr key={asig.id} className="hover:bg-text-accent/5 transition-all group/row border-l-8 border-l-transparent hover:border-l-text-accent cursor-default relative">
                                            <td className="px-12 py-10 text-[14px] font-black text-text-primary uppercase tracking-widest tabular-nums border-r-4 border-border-default/10 group-hover:bg-bg-elevated/40 transition-colors italic group-hover:not-italic">{asig.funcionario.nombre.toUpperCase().replace(/ /g, '_')}</td>
                                            <td className="px-12 py-10 border-r-4 border-border-default/10">
                                                <span className="inline-flex items-center border-4 border-border-default px-6 py-2 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted bg-bg-surface group-hover/row:border-text-accent group-hover/row:text-text-primary transition-all shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95">
                                                    [{asig.tipo}]
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 text-[14px] font-black text-text-primary uppercase tracking-[0.1em] tabular-nums border-r-4 border-border-default/10">{formatDate(asig.fechaInicio)}</td>
                                            <td className="px-12 py-10 text-[14px] font-black text-text-primary uppercase tracking-[0.1em] tabular-nums border-r-4 border-border-default/10">
                                                {asig.fechaFin ? formatDate(asig.fechaFin) : <span className="text-text-accent animate-pulse bg-text-accent/5 px-6 py-2 border-2 border-text-accent/40 shadow-xl tabular-nums tracking-[0.3em]">[ CURRENT_RX_ACTIVE ]</span>}
                                            </td>
                                            <td className="px-12 py-10 text-[12px] text-text-muted font-black uppercase tracking-widest leading-relaxed max-w-md group-hover:text-text-primary transition-colors" title={asig.observaciones}>
                                                <div className="line-clamp-3 italic p-4 bg-bg-base/30 border border-border-default/20 border-dashed group-hover:border-text-accent/40 transition-all font-mono">
                                                    / {asig.observaciones?.toUpperCase() || 'NO_METADATA_CAP_ACK_RX'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                        <tr><td colSpan="5" className="py-40 text-center text-text-muted text-[18px] font-black uppercase tracking-[1em] opacity-30 italic animate-pulse">! NO_ALLOCATION_TX_LOGGED_IN_BLOCK_REPOSITORY</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Stream decoration */}
                        <div className="mt-8 bg-bg-base px-12 py-6 border-t-8 border-border-default border-opacity-30 flex justify-between items-center opacity-40 shadow-inner italic">
                             <span className="text-[10px] font-black uppercase tracking-[1em]">TX_STREAM_RX_v4.2 // TOLIMA_NODE</span>
                             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-accent animate-pulse"># READY_0xAF22_v4</span>
                        </div>
                    </div>
                )}

                {activeTab === 'hojadevida' && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-16 px-10">
                            <div className="flex items-center gap-10 group">
                                 <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_30px_rgba(var(--text-accent),0.6)] group-hover:rotate-180 transition-transform duration-1000"></div>
                                 <h3 className="text-[20px] font-black text-text-primary uppercase tracking-[0.8em] relative leading-none">
                                     / MAINTENANCE_AND_EVENT_TX_LOG
                                     <div className="h-1 w-2/3 bg-text-accent/20 absolute bottom-[-16px] left-0">
                                         <div className="h-full bg-text-accent w-1/4 animate-loadingBarSlow"></div>
                                     </div>
                                 </h3>
                            </div>
                            {canEdit && (
                                <button
                                    onClick={() => setIsHVModalOpen(true)}
                                    className="bg-bg-elevated border-8 border-border-strong px-14 py-6 text-[14px] font-black text-text-accent hover:text-text-primary hover:border-text-accent uppercase tracking-[0.8em] transition-all shadow-[0_30px_80px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-[0.9] group/btn relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-8">
                                        [ + ] REGISTER_EVENT_STAMP
                                        <span className="opacity-20 group-hover/btn:opacity-100 transition-opacity">&rsaquo;&rsaquo;</span>
                                    </span>
                                    <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                </button>
                            )}
                        </div>
                        
                        <div className="bg-bg-surface border-8 border-border-default shadow-[0_60px_180px_rgba(0,0,0,0.9)] overflow-hidden group/maint hover:border-text-accent/10 transition-all duration-1000 relative">
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-xl font-black uppercase tracking-[2em] group-hover/maint:text-text-accent transition-all italic italic pointer-events-none">MAINT_PHYSICAL_CORE_STREAM_RX_v4</div>
                            <div className="absolute top-0 left-0 w-4 h-full bg-text-accent/10 opacity-30"></div>
                            
                            <div className="overflow-x-auto custom-scrollbar bg-bg-base/30">
                                <table className="w-full text-left border-collapse min-w-[1200px] border-spacing-0">
                                    <thead>
                                        <tr className="bg-bg-base/95 backdrop-blur-md border-b-8 border-border-default shadow-2xl relative z-10">
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-accent border-r-4 border-border-default/30 shadow-inner">:: TX_STAMP_ID</th>
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: PROC_TYPE</th>
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: LOG_DESC_TX_BLOCK</th>
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: ANALYST_UID_RX</th>
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: UNIT_COST_VAL</th>
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: EXT_0xIDENT</th>
                                            <th className="px-10 py-10 text-[13px] font-black uppercase tracking-[0.6em] text-text-muted border-r-4 border-border-default/30 shadow-inner">:: OP_STATE_IO</th>
                                            <th className="px-10 py-10 text-right text-[13px] font-black uppercase tracking-[0.8em] text-text-muted shadow-inner bg-bg-surface/50">_IO_CMD</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-4 divide-border-default/10">
                                        {activo.hojaVida?.map((hv) => (
                                            <tr key={hv.id} className="hover:bg-text-accent/5 transition-all group/row border-l-8 border-l-transparent hover:border-l-text-accent cursor-default relative">
                                                <td className="px-10 py-10 text-[14px] font-black text-text-primary uppercase tracking-widest tabular-nums border-r-4 border-border-default/10 group-hover:bg-bg-elevated/20 transition-colors italic">{formatDate(hv.fecha)}</td>
                                                <td className="px-10 py-10 border-r-4 border-border-default/10 group-hover:bg-bg-base/40 transition-colors">
                                                    <span className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em] bg-bg-base border-4 border-border-default px-6 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.3)] group-hover/row:border-text-accent transition-colors block text-center">/{hv.tipo}</span>
                                                </td>
                                                <td className="px-10 py-10 text-[12px] font-black text-text-muted uppercase tracking-tight max-w-md border-r-4 border-border-default/10 group-hover:text-text-primary transition-colors" title={hv.description}>
                                                     <div className="line-clamp-4 italic border-l-4 border-border-default/20 pl-6 group-hover:border-text-accent transition-all">/ {hv.descripcion?.toUpperCase() || 'NO_LOG_CAPTURED'}</div>
                                                </td>
                                                <td className="px-10 py-10 text-[12px] font-black text-text-primary uppercase tracking-widest tabular-nums border-r-4 border-border-default/10 italic">{hv.responsable?.nombre?.toUpperCase().replace(/ /g, '_') || hv.tecnico?.toUpperCase().replace(/ /g, '_') || 'NULL_ANALYST_TX'}</td>
                                                <td className="px-10 py-10 text-[14px] font-black text-text-accent uppercase tracking-tighter tabular-nums border-r-4 border-border-default/10 drop-shadow-sm">{formatCurrency(hv.costo)}</td>
                                                <td className="px-10 py-10 text-[12px] font-black text-text-muted uppercase tracking-[0.3em] font-mono opacity-40 border-r-4 border-border-default/10 group-hover:opacity-100 transition-opacity">0x{hv.casoAranda?.toUpperCase() || 'NULL_ID'}</td>
                                                <td className="px-10 py-10 border-r-4 border-border-default/10">
                                                    <span className={getHVStatusBadge(hv.estado)}>
                                                        [ {hv.estado?.replace('_', ' ') || 'ACTIVE_PROC'} ]
                                                    </span>
                                                </td>
                                                <td className="px-10 py-10 text-right whitespace-nowrap bg-bg-surface/20 group-hover:bg-bg-base/40 transition-colors">
                                                    <button
                                                        onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                                        className="inline-flex items-center justify-center text-[11px] font-black text-text-muted border-4 border-border-default bg-bg-base px-8 py-5 uppercase tracking-[0.4em] hover:text-text-primary hover:border-text-accent transition-all shadow-3xl active:scale-95 group/btn relative overflow-hidden"
                                                    >
                                                        <span className="relative z-10 flex items-center gap-4">
                                                            <span className="opacity-40 group-hover/btn:translate-x-4 transition-transform">&rsaquo;</span>
                                                            {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO' || !canEdit) ? '[ VIEW_LOG_RD ]' : '[ MANAGE_SYNC ]'}
                                                        </span>
                                                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                            <tr><td colSpan="8" className="py-40 text-center text-text-muted text-[18px] font-black uppercase tracking-[1em] opacity-30 italic animate-pulse">! NO_MAINTENANCE_LOGS_DET_IN_REPOSITORY_STREAM</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Inner graphical footer */}
                            <div className="bg-bg-base/80 px-12 py-6 border-t-8 border-border-default border-opacity-30 flex justify-between items-center opacity-40 italic shadow-inner">
                                <span className="text-[10px] font-black uppercase tracking-[1em]">SYSTEM_PROC_HISTORY_v4.2 // AF22_RX</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-accent">0xFD42_CORE_READY</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documentos' && (
                    <DocumentosList
                        activoId={activo.id}
                        documentos={activo.documentos}
                        onUpdate={fetchActivo}
                    />
                )}

                {activeTab === 'software' && (
                    <ActivoLicenciasList
                        activoId={activo.id}
                        licencias={activo.licencias}
                        onUpdate={fetchActivo}
                    />
                )}
            </div>

            {/* Logical Ident Footer Core Repository Entry Point */}
            <div className="mt-40 flex flex-col xl:flex-row justify-between items-center gap-16 p-20 bg-bg-surface/60 border-8 border-border-default opacity-40 shadow-[inner_0_20px_100px_rgba(0,0,0,0.8)] group/footer hover:opacity-100 hover:border-text-accent/20 transition-all duration-1000 group">
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[1.4em] flex items-center gap-12 group-hover:text-text-primary transition-all">
                     <div className="w-8 h-8 bg-text-accent rotate-45 animate-pulse shadow-[0_0_40px_rgba(var(--text-accent),0.7)] group-hover:rotate-180 transition-transform duration-1000"></div>
                     IDENT_MANIFEST_STABLE_v4.2 // HASH_0x{String(activo.id).substring(String(activo.id).length - 12).toUpperCase()}
                </div>
                <div className="text-[16px] font-black text-text-muted uppercase tracking-[0.6em] italic flex items-center gap-12">
                     <div className="h-16 w-1 bg-border-default opacity-20"></div>
                     FNC_IT_INFRA_CORE_STREAM // ACCESS_LVL_PROTOCOL: RO_ROOT
                </div>
            </div>

            {/* Portal Gateways Integration */}
            {isEditModalOpen && (
                <ActivosForm
                    open={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); fetchActivo(); }}
                    activo={activo}
                />
            )}

            {isHVModalOpen && (
                <HojaVidaForm
                    open={isHVModalOpen}
                    onClose={() => { setIsHVModalOpen(false); fetchActivo(); }}
                    activoId={activo.id}
                />
            )}

            {isStatusModalOpen && selectedHV && (
                <EstadoHojaVidaForm
                    open={isStatusModalOpen}
                    onClose={() => { setIsStatusModalOpen(false); fetchActivo(); }}
                    hojaVida={selectedHV}
                    activo={activo}
                />
            )}
        </div>
    );
};

export default ActivoDetail;
