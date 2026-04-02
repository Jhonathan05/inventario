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
            case 'DISPONIBLE': return 'border-text-primary text-text-primary bg-bg-base opacity-40 hover:opacity-100';
            case 'ASIGNADO': return 'border-border-default text-text-primary bg-bg-elevated/50';
            case 'EN_MANTENIMIENTO': return 'border-text-accent text-text-accent bg-text-accent/5 animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.3)]';
            case 'DADO_DE_BAJA': return 'border-border-default text-text-muted opacity-20';
            default: return 'border-border-default text-text-muted';
        }
    };

    const getHVStatusBadge = (estado) => {
        const base = "inline-flex items-center px-4 py-1 text-[9px] font-black uppercase tracking-widest border-2 transition-all shadow-md";
        if (estado === 'FINALIZADO' || estado === 'CERRADO') return `${base} border-text-primary text-text-primary bg-bg-base opacity-40 hover:opacity-100`;
        if (estado === 'EN_PROCESO' || estado === 'CREADO') return `${base} border-text-accent text-text-accent bg-text-accent/5 animate-pulse`;
        return `${base} border-border-default text-text-muted opacity-30`;
    };

    if (loading) return (
        <div className="mt-24 text-center py-24 font-mono animate-fadeIn">
            <div className="w-16 h-16 border-4 border-t-text-accent border-border-default animate-spin mx-auto mb-8"></div>
            <div className="text-[14px] uppercase tracking-[0.8em] text-text-accent font-black animate-pulse"># SYNCING_NODE_DATA_BUFFER...</div>
            <div className="mt-4 text-[10px] text-text-muted uppercase tracking-widest opacity-40 italic">querying_repository_node_tx_0xFD4</div>
        </div>
    );
    
    if (!activo) return (
        <div className="mt-24 text-center py-24 font-mono bg-bg-surface border-2 border-text-accent/30 mx-8 shadow-3xl animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-xs font-black uppercase tracking-widest">FATAL_IDENT_FAULT</div>
            <div className="text-[14px] uppercase tracking-[0.4em] text-text-accent font-black mb-6">! SYSTEM_ERROR :: NODE_IO_NULL</div>
            <div className="text-[10px] text-text-muted uppercase tracking-widest opacity-60 mb-12">IDENTIFIER "{id}" RESOLVED_TO_NULL_VAL_INTERRUPT</div>
            <button onClick={() => navigate('/activos')} className="bg-bg-elevated border-2 border-border-default px-10 py-4 text-[11px] font-black uppercase tracking-widest text-text-primary hover:border-text-accent hover:text-text-accent transition-all active:scale-95 shadow-2xl">
                [ &larr; ] RETURN_TO_LIST_CORE
            </button>
        </div>
    );

    const tabs = [
        { key: 'general', label: 'GEN_DATA_TX' },
        { key: 'asignaciones', label: 'ALLOCATION_HISTORY' },
        { key: 'hojadevida', label: 'MAINTENANCE_LOG' },
        { key: 'documentos', label: 'DOC_VAULT' },
        { key: 'software', label: 'SW_RESOURCES_MAP' },
    ];

    const InfoItem = ({ label, value }) => (
        <div className="group/item relative overflow-hidden p-6 bg-bg-base/20 border border-border-default/30 hover:border-text-accent/30 transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-5 text-[7px] font-black uppercase tracking-tighter group-hover/item:opacity-20 transition-opacity">IO_DATA</div>
            <dt className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 border-l-2 border-border-default pl-4 group-hover/item:border-text-accent transition-all">:: {label.toUpperCase().replace(/ /g, '_')}</dt>
            <dd className="text-[12px] font-black text-text-primary uppercase tracking-tight pl-4 truncate tabular-nums" title={value}>{value || <span className="opacity-20 italic">NULL_VAL_ACK</span>}</dd>
        </div>
    );

    return (
        <div className="font-mono mb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Navigation / Header Identifier */}
            <div className="mb-12">
                <button onClick={() => navigate('/activos')} className="text-[11px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.4em] transition-all mb-8 flex items-center gap-4 group/back active:scale-95">
                    <span className="group-hover/back:-translate-x-2 transition-transform text-text-accent text-lg">&larr;</span> [ BACK_TO_INVENTORY_HUB ]
                </button>
                
                <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 transition-opacity">NODE_MANIFEST_STREAM_0x{activo.id.slice(0,6).toUpperCase()}</div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                 <div className="w-2.5 h-2.5 bg-text-accent animate-pulse"></div>
                                 <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">
                                     / {activo.marca} {activo.modelo}
                                 </h1>
                            </div>
                            <div className="text-[11px] text-text-muted font-black uppercase tracking-[0.25em] flex flex-wrap gap-8 opacity-60 group-hover:opacity-100 transition-opacity tabular-nums">
                                <span className="flex items-center gap-2">IDENT_PLACA: <span className="text-text-primary bg-bg-base px-2 py-0.5 border border-border-default/50">[{activo.placa}]</span></span>
                                <span className="flex items-center gap-2">AF_TAG: <span className="text-text-primary bg-bg-base px-2 py-0.5 border border-border-default/50">[{activo.activoFijo || '----'}]</span></span>
                                <span className="flex items-center gap-2">SERIAL_IO: <span className="text-text-primary bg-bg-base px-2 py-0.5 border border-border-default/50">[{activo.serial}]</span></span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-8 bg-bg-base/30 p-4 border border-border-default/50 backdrop-blur-sm">
                            <span className={`px-6 py-2.5 text-[11px] font-black tracking-[0.4em] uppercase border-2 shadow-xl transition-all tabular-nums ${getStatusBadge(activo.estado)}`}>
                                [ {activo.estado?.toUpperCase().replace(/_/g, ' ')} ]
                            </span>
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="bg-bg-elevated border-2 border-border-strong px-10 py-3 text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.5em] transition-all shadow-3xl active:scale-95 group/btn"
                                >
                                    <span className="relative z-10 group-hover/btn:tracking-[0.6em] transition-all">[ MODIFY_NODE_TX ]</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Progress tracking accent line */}
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-text-accent/20">
                         <div className="h-full bg-text-accent w-1/4 animate-loadingBarSlow"></div>
                    </div>
                </div>
            </div>

            {/* Logical Tabs / Stream Selector */}
            <div className="mb-12 border-b-2 border-border-default/30 flex overflow-x-auto custom-scrollbar bg-bg-surface/30 backdrop-blur-md sticky top-0 z-40">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`whitespace-nowrap px-10 py-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-2 relative overflow-hidden active:scale-95 group ${activeTab === tab.key
                            ? 'border-text-accent text-text-primary bg-text-accent/5'
                            : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-elevated/50'
                            }`}
                    >
                        <span className="relative z-10">{tab.label}</span>
                        {activeTab === tab.key && <div className="absolute top-0 right-0 p-1 opacity-20 text-[7px] font-black uppercase">RX</div>}
                    </button>
                ))}
            </div>

            {/* Payload Viewport */}
            <div className="animate-fadeIn">
                {activeTab === 'general' && (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group/box">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter group-hover/box:opacity-20 transition-opacity">SYS_IO_BLOCK_A</div>
                                <div className="flex items-center gap-6 mb-12 pb-8 border-b-2 border-border-default">
                                    <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-sm">&alpha;</div>
                                    <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em]"># CORE_SPECIFICATION_BLOCK</h3>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <InfoItem label="Categoría" value={activo.categoria?.nombre} />
                                    <InfoItem label="Tipo de Equipo" value={activo.tipo} />
                                    <InfoItem label="Nombre Host" value={activo.nombreEquipo} />
                                    <InfoItem label="Ubicación Física" value={activo.ubicacion} />
                                    <InfoItem label="Activo Fijo Tag" value={activo.activoFijo} />
                                    <InfoItem label="Valor Adquisición" value={formatCurrency(activo.valorCompra)} />
                                    <InfoItem label="Fecha Adquisición" value={formatDate(activo.fechaCompra)} />
                                    <InfoItem label="Vencimiento Garantía" value={formatDate(activo.garantiaHasta)} />
                                    <InfoItem label="Color / Chasis" value={activo.color} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Metadata Log Ops" value={activo.observaciones} />
                                    </div>
                                </dl>
                            </div>
                            <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group/imgbox">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter">IO_IMG_PORT</div>
                                <div className="flex items-center gap-6 mb-12 pb-8 border-b-2 border-border-default">
                                    <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-sm">&beta;</div>
                                    <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em]"># VISUAL_NODE_TRACE</h3>
                                </div>
                                <div className="aspect-square bg-bg-base border-4 border-border-default overflow-hidden relative group/img shadow-2xl">
                                    <div className="absolute inset-0 bg-text-accent/5 pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                                    {getImageUrl(activo.imagen) ? (
                                        <img src={getImageUrl(activo.imagen)} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center opacity-10 grayscale p-12">
                                             {/* Placeholder icon could go here */}
                                             <div className="text-8xl">?</div>
                                        </div>
                                    )}
                                    <div className="absolute top-0 left-0 p-4 bg-bg-surface/80 border-b border-r border-border-default text-[9px] font-black uppercase tracking-[0.3em] opacity-80 backdrop-blur-sm">REF: {activo.placa}</div>
                                </div>
                                <div className="mt-8 text-[9px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 text-center italic">IDENT_HASH: 0x{activo.id.substring(activo.id.length - 8).toUpperCase()}</div>
                            </div>
                        </div>

                        {/* Admin & Holder Layers */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                             <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl group/admin relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter">SYS_IO_BLOCK_G</div>
                                <div className="flex items-center gap-6 mb-12 pb-8 border-b-2 border-border-default">
                                    <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-sm">&gamma;</div>
                                    <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em]"># ADMIN_GOVERNANCE_LAYER</h3>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <InfoItem label="Entidad Propietaria" value={activo.empresaPropietaria} />
                                    <InfoItem label="Unidad Dependencia" value={activo.dependencia} />
                                    <InfoItem label="Stream Recurso" value={activo.fuenteRecurso} />
                                    <InfoItem label="Tipo Recurso" value={activo.tipoRecurso} />
                                    <InfoItem label="Protocolo Control" value={activo.tipoControl} />
                                    <InfoItem label="Estado Operativo" value={activo.estadoOperativo} />
                                    <InfoItem label="Razón Status" value={activo.razonEstado} />
                                </dl>
                             </div>

                             <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl group/holder relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter">SYS_IO_BLOCK_H</div>
                                <div className="flex items-center gap-6 mb-12 pb-8 border-b-2 border-border-default">
                                    <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-sm">&delta;</div>
                                    <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em]"># HOLDER_ASSIGNMENT_ENCLAVE</h3>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <InfoItem label="Empresa Holder" value={activo.empresaFuncionario} />
                                    <InfoItem label="Tipo Personal" value={activo.tipoPersonal} />
                                    <InfoItem label="Ident UID" value={activo.cedulaFuncionario} />
                                    <InfoItem label="Alias / Shortname" value={activo.shortname} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Full Holder Identity" value={activo.nombreFuncionario} />
                                    </div>
                                    <InfoItem label="Geo Dept" value={activo.departamento} />
                                    <InfoItem label="Geo Region" value={activo.ciudad} />
                                    <InfoItem label="Logical Role" value={activo.cargo} />
                                    <InfoItem label="Area Core" value={activo.area} />
                                </dl>
                             </div>
                        </div>

                        {/* Tech Spec Layer */}
                        <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl group/tech relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter">SYS_IO_BLOCK_T</div>
                            <div className="flex items-center gap-6 mb-12 pb-8 border-b-2 border-border-default">
                                <div className="w-8 h-8 flex items-center justify-center border-2 border-text-primary font-black text-sm">&tau;</div>
                                <h3 className="text-[14px] font-black text-text-primary uppercase tracking-[0.5em]"># TECHNICAL_HARDWARE_SPEC_MATRIX</h3>
                            </div>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                <InfoItem label="Procesador Unit" value={activo.procesador} />
                                <InfoItem label="RAM_Buffer" value={activo.memoriaRam} />
                                <InfoItem label="Storage_Volume" value={activo.discoDuro} />
                                <InfoItem label="System_Core_OS" value={activo.sistemaOperativo} />
                            </dl>
                        </div>
                    </div>
                )}

                {activeTab === 'asignaciones' && (
                    <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden group/alloc hover:border-border-strong transition-all relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/alloc:text-text-accent transition-colors">ALLOC_TX_LOG_STREAM</div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[900px] border-spacing-0">
                                <thead>
                                    <tr className="bg-bg-base border-b-2 border-border-default">
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: HOLDER_IDENTITY</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ALLOC_PROTOCOL</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: START_TX_STAMP</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: END_TX_STAMP</th>
                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">:: LOG_METADATA_MANIFEST</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                                    {activo.asignaciones?.map((asig) => (
                                        <tr key={asig.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                            <td className="px-10 py-8 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">{asig.funcionario.nombre.toUpperCase().replace(/ /g, '_')}</td>
                                            <td className="px-10 py-8 border-r border-border-default/10">
                                                <span className="inline-flex items-center border-2 border-border-default px-4 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted bg-bg-base group-hover/row:border-text-accent group-hover/row:text-text-primary transition-all shadow-md">
                                                    [{asig.tipo}]
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">{formatDate(asig.fechaInicio)}</td>
                                            <td className="px-10 py-8 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">
                                                {asig.fechaFin ? formatDate(asig.fechaFin) : <span className="text-text-accent animate-pulse bg-text-accent/5 px-3 py-1 border border-text-accent/30">[ CURRENT_TX_ACTIVE ]</span>}
                                            </td>
                                            <td className="px-10 py-8 text-[10px] text-text-muted font-black uppercase tracking-widest leading-relaxed max-w-sm" title={asig.observaciones}>
                                                <div className="line-clamp-2">/ {asig.observaciones?.toUpperCase() || 'NO_METADATA_CAP_ACK'}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                        <tr><td colSpan="5" className="py-24 text-center text-text-muted text-[12px] font-black uppercase tracking-[0.5em] opacity-40 italic">! NO_ALLOCATION_HISTORY_LOGGED_IN_CORE</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'hojadevida' && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-12 px-6">
                            <div className="flex items-center gap-6">
                                 <div className="w-3 h-3 bg-text-accent animate-pulse"></div>
                                 <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.6em] relative">/ MAINTENANCE_AND_SYSTEM_EVENT_HISTORY</h3>
                            </div>
                            {canEdit && (
                                <button
                                    onClick={() => setIsHVModalOpen(true)}
                                    className="bg-bg-elevated border-2 border-border-strong px-12 py-4 text-[12px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.6em] transition-all shadow-3xl hover:scale-105 active:scale-95 group/btn"
                                >
                                    <span className="relative z-10">[ + ] REGISTER_EVENT_IO_STAMP</span>
                                </button>
                            )}
                        </div>
                        
                        <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden group/maint hover:border-border-strong transition-all relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/maint:text-text-accent transition-colors">MAINT_PHYSICAL_CORE_STREAM</div>
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[1100px] border-spacing-0">
                                    <thead>
                                        <tr className="bg-bg-base border-b-2 border-border-default">
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: STAMP</th>
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: TYPE</th>
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: LOG_DESC_TX</th>
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: ANALYST_UID</th>
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: COST_UNIT</th>
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: EXT_IDENT</th>
                                            <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: STATE</th>
                                            <th className="px-8 py-8 text-right text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">_COMMAND_IO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-default/10 bg-bg-surface/30">
                                        {activo.hojaVida?.map((hv) => (
                                            <tr key={hv.id} className="hover:bg-bg-elevated transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                                <td className="px-8 py-8 text-[12px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">{formatDate(hv.fecha)}</td>
                                                <td className="px-8 py-8 border-r border-border-default/10">
                                                    <span className="text-[10px] font-black text-text-primary uppercase tracking-widest bg-bg-base border-2 border-border-default px-4 py-1 shadow-md group-hover/row:border-text-accent transition-colors">/{hv.tipo}</span>
                                                </td>
                                                <td className="px-8 py-8 text-[11px] font-black text-text-muted uppercase tracking-tight max-w-sm border-r border-border-default/10" title={hv.description}>
                                                     <div className="line-clamp-2">/ {hv.descripcion?.toUpperCase()}</div>
                                                </td>
                                                <td className="px-8 py-8 text-[11px] font-black text-text-primary uppercase tracking-tight tabular-nums border-r border-border-default/10">{hv.responsable?.nombre?.toUpperCase().replace(/ /g, '_') || hv.tecnico?.toUpperCase().replace(/ /g, '_') || 'NULL_ANALYST_ACK'}</td>
                                                <td className="px-8 py-8 text-[12px] font-black text-text-accent uppercase tracking-tight tabular-nums border-r border-border-default/10">{formatCurrency(hv.costo)}</td>
                                                <td className="px-8 py-8 text-[11px] font-black text-text-muted uppercase tracking-[0.2em] font-mono opacity-60 border-r border-border-default/10">0x{hv.casoAranda?.toUpperCase() || 'NULL_IDENT'}</td>
                                                <td className="px-8 py-8 border-r border-border-default/10">
                                                    <span className={getHVStatusBadge(hv.estado)}>
                                                        [ {hv.estado?.replace('_', ' ') || 'ACTIVE'} ]
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                                        className="inline-flex items-center justify-center text-[10px] font-black text-text-muted border-2 border-border-default bg-bg-base px-6 py-3 uppercase tracking-widest hover:text-text-primary hover:border-text-accent transition-all shadow-xl active:scale-95 group/btn"
                                                    >
                                                        <span className="opacity-40 group-hover/btn:translate-x-2 transition-transform mr-3">→</span>
                                                        {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO' || !canEdit) ? '[ VIEW_LOG_RD ]' : '[ MANAGE_SYNC ]'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                            <tr><td colSpan="8" className="py-24 text-center text-text-muted text-[12px] font-black uppercase tracking-[0.5em] opacity-40 italic">! NO_MAINTENANCE_LOGS_DETECTED_IN_REPOSITORY_TX</td></tr>
                                        )}
                                    </tbody>
                                </table>
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

            {/* Controller Footer Identification Area */}
            <div className="mt-24 flex flex-col sm:flex-row justify-between items-center gap-10 p-12 bg-bg-surface/40 border-2 border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-6">
                     <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_12px_rgba(251,97,7,0.6)]"></div>
                     NODE_MANIFEST_STABLE // HASH: {id.substring(id.length - 8).toUpperCase()}
                </div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic group-hover:text-text-primary transition-colors">
                     FNC_IT_INFRASTRUCTURE_MONITOR // ACCESS_LVL: 7
                </div>
            </div>

            {/* Modals Bridge Integration */}
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
