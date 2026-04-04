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
        const base = "inline-flex items-center px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] border-2 transition-all shadow-md tabular-nums";
        if (estado === 'FINALIZADO' || estado === 'CERRADO') return `${base} border-text-primary text-text-primary bg-bg-base opacity-30 hover:opacity-100 group-hover/row:opacity-100`;
        if (estado === 'EN_PROCESO' || estado === 'CREADO') return `${base} border-text-accent text-text-accent bg-text-accent/5 animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.3)]`;
        return `${base} border-border-default text-text-muted opacity-20`;
    };

    if (loading) return (
        <div className="mt-20 text-center py-20 font-mono animate-fadeIn selection:bg-text-accent selection:text-bg-base">
            <div className="w-20 h-20 border-4 border-border-default border-t-text-accent animate-spin mx-auto mb-8 shadow-[0_0_40px_rgba(var(--text-accent),0.2)] rounded-full"></div>
            <div className="text-[16px] uppercase tracking-[0.8em] text-text-accent font-black animate-pulse"># SYNCING_DATA...</div>
        </div>
    );
    
    if (!activo) return (
        <div className="mt-20 text-center py-20 font-mono bg-bg-surface border-4 border-text-accent/30 mx-10 shadow-xl animate-fadeIn relative overflow-hidden group">
            <div className="relative z-10 p-10">
                <div className="text-[18px] uppercase tracking-[0.5em] text-text-accent font-black mb-6">! SYSTEM_ERROR :: NODE_NULL</div>
                <button onClick={() => navigate('/activos')} className="bg-bg-elevated border-2 border-border-strong px-8 py-3 text-[11px] font-black uppercase tracking-[0.4em] text-text-primary hover:border-text-accent hover:text-text-accent transition-all active:scale-90">
                    [ RETURN_TO_LIST ]
                </button>
            </div>
        </div>
    );

    const tabs = [
        { key: 'general', label: 'GEN_DATA' },
        { key: 'asignaciones', label: 'HISTORY' },
        { key: 'hojadevida', label: 'MAINTENANCE' },
        { key: 'documentos', label: 'DOCS' },
        { key: 'software', label: 'SW_MAP' },
    ];

    const InfoItem = ({ label, value }) => (
        <div className="group/item relative overflow-hidden p-2 bg-bg-base/30 border border-border-default/40 hover:border-text-accent/60 transition-all duration-500 shadow-sm">
            <dt className="text-[8px] font-black text-text-muted uppercase tracking-[0.1em] mb-1 border-l-2 border-border-default/40 pl-2 group-hover/item:border-text-accent/60 transition-all italic opacity-60">:: {label.toUpperCase().replace(/ /g, '_')}</dt>
            <dd className="text-[10px] font-black text-text-primary uppercase tracking-tight pl-3 truncate tabular-nums" title={value}>{value || <span className="opacity-10 italic">NULL</span>}</dd>
        </div>
    );

    return (
        <div className="font-mono mb-12 page-padding animate-fadeIn selection:bg-text-accent selection:text-bg-base">
            <div className="mb-10">
                <button onClick={() => navigate('/activos')} className="text-[11px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.3em] transition-all mb-6 flex items-center gap-4 group/back active:scale-95">
                    <span className="group-hover/back:-translate-x-2 transition-transform text-text-accent text-xl font-normal opacity-40 group-hover:opacity-100">&larr;</span> 
                    <span className="border-b-2 border-transparent group-hover:border-text-accent pb-0.5 transition-all">[ BACK_TO_HUB ]</span>
                </button>
                
                <div className="bg-bg-surface border-2 border-border-default p-4 shadow-lg relative overflow-hidden group/header hover:border-text-accent/40 transition-colors duration-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2 group">
                                 <div className="w-2 h-2 bg-text-accent animate-pulse flex-shrink-0"></div>
                                 <h1 className="text-lg font-black uppercase tracking-[0.2em] text-text-primary leading-none">
                                     {activo.marca} <span className="opacity-40 italic font-medium">{activo.modelo}</span>
                                 </h1>
                            </div>
                            <div className="text-[9px] text-text-muted font-black uppercase tracking-[0.2em] flex flex-wrap gap-3 opacity-70 tabular-nums">
                                <span className="flex items-center gap-1 bg-bg-base px-1.5 py-0.5 border border-border-default/40">PLACA: <span className="text-text-primary font-black">{activo.placa}</span></span>
                                <span className="flex items-center gap-1 bg-bg-base px-1.5 py-0.5 border border-border-default/40">SRL: <span className="text-text-primary font-black">{activo.serial}</span></span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 bg-bg-base/30 p-3 border border-border-default/50 shadow-sm">
                            <span className={`px-3 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase border-2 shadow-sm transition-all tabular-nums ${getStatusBadge(activo.estado)}`}>
                                [ {activo.estado?.toUpperCase().replace(/_/g, ' ')} ]
                            </span>
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="bg-bg-elevated border border-border-strong px-4 py-1.5 text-[9px] font-black text-text-accent hover:text-text-primary hover:border-text-accent uppercase tracking-[0.3em] transition-all shadow-sm active:scale-90"
                                >
                                    [ MODIFY ]
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 border-b-2 border-border-default flex overflow-x-auto bg-bg-surface/60 sticky top-0 z-50 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`whitespace-nowrap px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all border-b-2 relative ${activeTab === tab.key
                            ? 'border-text-accent text-text-primary bg-text-accent/10'
                            : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-elevated/40'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-fadeIn relative z-10">
                {activeTab === 'general' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-bg-surface border border-border-default p-6 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-6 pb-2 border-b border-border-default/40">
                                    <div className="w-6 h-6 flex items-center justify-center border-2 border-text-accent font-black text-xs bg-text-accent/5">&alpha;</div>
                                    <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em]"># SPEC_MATRIX</h3>
                                </div>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InfoItem label="Categoría" value={activo.categoria?.nombre} />
                                    <InfoItem label="Tipo" value={activo.tipo} />
                                    <InfoItem label="Host ID" value={activo.nombreEquipo} />
                                    <InfoItem label="Ubicación" value={activo.ubicacion} />
                                    <InfoItem label="Activo Fijo" value={activo.activoFijo} />
                                    <InfoItem label="Valor" value={formatCurrency(activo.valorCompra)} />
                                    <InfoItem label="Adquisición" value={formatDate(activo.fechaCompra)} />
                                    <InfoItem label="Garantía" value={formatDate(activo.garantiaHasta)} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Notas" value={activo.observaciones} />
                                    </div>
                                </dl>
                            </div>

                            <div className="bg-bg-surface border border-border-default p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-6 pb-2 border-b border-border-default/40">
                                    <div className="w-6 h-6 flex items-center justify-center border-2 border-text-accent font-black text-xs bg-text-accent/5">&beta;</div>
                                    <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em]"># VISUAL_NODE</h3>
                                </div>
                                <div className="aspect-square bg-bg-base border-2 border-border-default overflow-hidden relative">
                                    {getImageUrl(activo.imagen) ? (
                                        <img src={getImageUrl(activo.imagen)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center opacity-10 p-8">
                                             <div className="text-4xl font-black">NULL</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'asignaciones' && (
                    <div className="animate-fadeIn">
                        <div className="hidden md:block bg-bg-surface border-2 border-border-default shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px] border-spacing-0">
                                    <thead>
                                        <tr className="bg-bg-base border-b-2 border-border-default">
                                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-accent border-r border-border-default/30 shadow-inner">:: HOLDER</th>
                                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: TIPO</th>
                                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: INICIO</th>
                                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: FIN</th>
                                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">:: NOTAS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-default/10">
                                        {activo.asignaciones?.map((asig) => (
                                            <tr key={asig.id} className="hover:bg-bg-elevated transition-all group/row border-l-2 border-l-transparent hover:border-l-text-accent">
                                                <td className="px-4 py-3 text-[11px] font-black text-text-primary uppercase tracking-wide border-r border-border-default/10">{asig.funcionario.nombre.replace(/ /g, '_')}</td>
                                                <td className="px-4 py-3 border-r border-border-default/10">
                                                    <span className="border border-border-default px-2 py-0.5 text-[9px] font-black uppercase text-text-muted bg-bg-surface">[{asig.tipo}]</span>
                                                </td>
                                                <td className="px-4 py-3 text-[11px] font-black text-text-primary tabular-nums border-r border-border-default/10">{formatDate(asig.fechaInicio)}</td>
                                                <td className="px-4 py-3 text-[11px] font-black tabular-nums border-r border-border-default/10">
                                                    {asig.fechaFin ? formatDate(asig.fechaFin) : <span className="text-text-accent text-[9px] animate-pulse">ACTIVO</span>}
                                                </td>
                                                <td className="px-4 py-3 text-[10px] text-text-muted max-w-xs">
                                                    <div className="line-clamp-2 italic">{asig.observaciones || '—'}</div>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                            <tr><td colSpan="5" className="py-12 text-center text-text-muted text-[12px] font-black uppercase tracking-[0.6em] opacity-30 italic">! SIN_ASIGNACIONES</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Móvil cards */}
                        <div className="md:hidden space-y-4">
                            {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                <div className="py-8 text-center border border-dashed border-border-default/30 p-4">
                                    <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] opacity-40 italic">! SIN_ASIGNACIONES</div>
                                </div>
                            )}
                            {activo.asignaciones?.map((asig) => (
                                <div key={asig.id} className="bg-bg-surface border-2 border-border-default p-4">
                                    <p className="font-black text-text-primary text-[13px] uppercase mb-2">{asig.funcionario.nombre}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div><span className="text-[9px] text-text-muted uppercase block">Tipo</span><p className="text-[11px] font-black text-text-primary">{asig.tipo}</p></div>
                                        <div><span className="text-[9px] text-text-muted uppercase block">Inicio</span><p className="text-[11px] font-black text-text-primary">{formatDate(asig.fechaInicio)}</p></div>
                                        <div><span className="text-[9px] text-text-muted uppercase block">Fin</span><p className="text-[11px] font-black text-text-primary">{asig.fechaFin ? formatDate(asig.fechaFin) : <span className="text-text-accent">ACTIVO</span>}</p></div>
                                    </div>
                                    {asig.observaciones && <p className="text-[10px] text-text-muted mt-2 italic opacity-60 line-clamp-2">{asig.observaciones}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'hojadevida' && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 px-6">
                            <div className="flex items-center gap-4 group">
                                 <div className="w-3 h-3 bg-text-accent animate-pulse shadow-md group-hover:rotate-180 transition-transform duration-1000"></div>
                                 <h3 className="text-[16px] font-black text-text-primary uppercase tracking-[0.4em] relative leading-none">
                                     / MAINTENANCE_LOG
                                     <div className="h-0.5 w-2/3 bg-text-accent/20 absolute bottom-[-8px] left-0">
                                         <div className="h-full bg-text-accent w-1/4 animate-loadingBarSlow"></div>
                                     </div>
                                 </h3>
                            </div>
                            {canEdit && (
                                <button
                                    onClick={() => setIsHVModalOpen(true)}
                                    className="bg-bg-elevated border-2 border-border-strong px-6 py-2 text-[11px] font-black text-text-accent hover:text-text-primary hover:border-text-accent uppercase tracking-[0.4em] transition-all shadow-lg hover:scale-105 active:scale-[0.95] group/btn relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        [ + ] REGISTER_EVENT
                                    </span>
                                </button>
                            )}
                        </div>
                        
                        <div className="bg-bg-surface border-2 border-border-default shadow-xl overflow-hidden group/maint hover:border-text-accent/10 transition-all duration-1000 relative">
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1em] group-hover/maint:text-text-accent transition-all italic pointer-events-none">MAINT_CORE_STREAM</div>
                            <div className="absolute top-0 left-0 w-4 h-full bg-text-accent/10 opacity-30"></div>
                            
                            <div className="overflow-x-auto custom-scrollbar bg-bg-base/30">
                                <table className="w-full text-left border-collapse min-w-[1200px] border-spacing-0">
                                    <thead>
                                        <tr className="bg-bg-base/95 backdrop-blur-md border-b-2 border-border-default shadow-lg relative z-10">
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-accent border-r border-border-default/30 shadow-inner">:: TX_STAMP</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: PROC_TYPE</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: LOG_DESC</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: ANALYST</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: UNIT_COST</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: EXT_ID</th>
                                            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border-r border-border-default/30 shadow-inner">:: STATUS</th>
                                            <th className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-[0.4em] text-text-muted shadow-inner bg-bg-surface/50">_CMD</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-default/10">
                                        {activo.hojaVida?.map((hv) => (
                                            <tr key={hv.id} className="hover:bg-text-accent/5 transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default relative">
                                                <td className="px-4 py-4 text-[11px] font-black text-text-primary uppercase tracking-widest tabular-nums border-r border-border-default/10 group-hover:bg-bg-elevated/20 transition-colors italic">{formatDate(hv.fecha)}</td>
                                                <td className="px-4 py-4 border-r border-border-default/10 group-hover:bg-bg-base/40 transition-colors">
                                                    <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] bg-bg-base border-2 border-border-default px-3 py-1 shadow-md group-hover/row:border-text-accent transition-colors block text-center">/{hv.tipo}</span>
                                                </td>
                                                <td className="px-4 py-4 text-[10px] font-black text-text-muted uppercase tracking-tight max-w-sm border-r border-border-default/10 group-hover:text-text-primary transition-colors" title={hv.description}>
                                                     <div className="line-clamp-3 italic border-l-2 border-border-default/20 pl-4 group-hover:border-text-accent transition-all">/ {hv.descripcion?.toUpperCase() || 'NO_LOG'}</div>
                                                </td>
                                                <td className="px-4 py-4 text-[10px] font-black text-text-primary uppercase tracking-widest tabular-nums border-r border-border-default/10 italic">{hv.responsable?.nombre?.toUpperCase().replace(/ /g, '_') || hv.tecnico?.toUpperCase().replace(/ /g, '_') || 'NULL_ANALYST'}</td>
                                                <td className="px-4 py-4 text-[11px] font-black text-text-accent uppercase tracking-tighter tabular-nums border-r border-border-default/10 drop-shadow-sm">{formatCurrency(hv.costo)}</td>
                                                <td className="px-4 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40 border-r border-border-default/10 group-hover:opacity-100 transition-opacity">0x{hv.casoAranda?.toUpperCase() || 'NULL'}</td>
                                                <td className="px-4 py-4 border-r border-border-default/10">
                                                    <span className={getHVStatusBadge(hv.estado)}>
                                                        [ {hv.estado?.replace('_', ' ') || 'ACTIVE'} ]
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right whitespace-nowrap bg-bg-surface/20 group-hover:bg-bg-base/40 transition-colors">
                                                    <button
                                                        onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                                        className="inline-flex items-center justify-center text-[9px] font-black text-text-muted border-2 border-border-default bg-bg-base px-4 py-2 uppercase tracking-[0.2em] hover:text-text-primary hover:border-text-accent transition-all shadow-md active:scale-95 group/btn relative overflow-hidden"
                                                    >
                                                        <span className="relative z-10 flex items-center gap-2">
                                                            {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO' || !canEdit) ? '[ VIEW ]' : '[ MANAGE ]'}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                            <tr><td colSpan="8" className="py-20 text-center text-text-muted text-[13px] font-black uppercase tracking-[0.6em] opacity-30 italic animate-pulse">! NO_MAINTENANCE_LOGS</td></tr>
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
            <div className="mt-20 flex flex-col xl:flex-row justify-between items-center gap-8 p-8 bg-bg-surface/60 border border-border-default opacity-40 shadow-inner group/footer hover:opacity-100 hover:border-text-accent/20 transition-all duration-1000 group">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[1em] flex items-center gap-6 group-hover:text-text-primary transition-all">
                     <div className="w-4 h-4 bg-text-accent rotate-45 animate-pulse shadow-md group-hover:rotate-180 transition-transform duration-1000"></div>
                     IDENT_MANIFEST_v4.2 // 0x{String(activo.id).substring(String(activo.id).length - 12).toUpperCase()}
                </div>
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] italic flex items-center gap-6">
                     FNC_IT_INFRA // ACCESS: RO_ROOT
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
