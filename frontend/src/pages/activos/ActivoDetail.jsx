import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeftIcon,
    PencilSquareIcon,
    PlusIcon,
    ComputerDesktopIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    ClockIcon,
    CpuChipIcon,
    BanknotesIcon,
    IdentificationIcon,
    MapPinIcon,
    TagIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import api from '../../lib/axios';
import { getImageUrl, formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
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
        const colors = {
            'DISPONIBLE': 'bg-green-500/10 text-green-600 border-green-500/10',
            'ASIGNADO': 'bg-blue-500/10 text-blue-600 border-blue-500/10',
            'EN_MANTENIMIENTO': 'bg-amber-500/10 text-amber-600 border-amber-500/10',
            'DADO_DE_BAJA': 'bg-rose-500/10 text-rose-600 border-rose-500/10',
        };
        return colors[estado] || 'bg-gray-500/10 text-gray-600 border-gray-500/10';
    };

    const getHVStatusBadge = (estado) => {
        if (estado === 'CREADO') return 'bg-blue-500/10 text-blue-600 border-blue-500/10';
        if (estado === 'EN_PROCESO') return 'bg-amber-500/10 text-amber-600 border-amber-500/10';
        if (estado === 'ESPERA_SUMINISTRO') return 'bg-orange-500/10 text-orange-600 border-orange-500/10';
        if (estado === 'PROCESO_GARANTIA') return 'bg-purple-500/10 text-purple-600 border-purple-500/10';
        if (estado === 'FINALIZADO' || estado === 'CERRADO') return 'bg-green-500/10 text-green-600 border-green-500/10';
        return 'bg-gray-500/10 text-gray-600 border-gray-500/10';
    };

    if (loading) return (
        <div className="text-center py-20">
            <ClockIcon className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-3" />
            <p className="text-charcoal-400 font-bold italic text-[11px]">Sincronizando inventario técnico...</p>
        </div>
    );
    if (!activo) return <div className="p-8 text-center text-rose-500 font-bold text-xs">Activo no encontrado</div>;

    const tabs = [
        { key: 'general', label: 'Estructura General', icon: ComputerDesktopIcon },
        { key: 'asignaciones', label: 'Trazabilidad', icon: ClockIcon },
        { key: 'hojadevida', label: 'Hoja de Vida', icon: ShieldCheckIcon },
        { key: 'documentos', label: 'Anexos', icon: DocumentTextIcon },
        { key: 'software', label: 'Licenciamiento', icon: Cog6ToothIcon },
    ];

    const InfoCard = ({ title, children, icon: Icon }) => (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-[11px] font-bold text-charcoal-400 flex items-center gap-2 border-b border-gray-50 pb-3">
                {Icon && <Icon className="w-4 h-4 text-primary" />}
                {title}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {children}
            </dl>
        </div>
    );

    const toTitleCase = (str) => {
        if (!str) return '';
        return str.toString().toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const InfoItem = ({ label, value, isFullWidth }) => (
        <div className={isFullWidth ? 'sm:col-span-2' : ''}>
            <dt className="text-[10px] font-bold text-charcoal-400 mb-1 opacity-80">{toTitleCase(label)}</dt>
            <dd className="text-[13px] font-bold text-charcoal-800 tracking-tight">{toTitleCase(value)}</dd>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Módulo */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/activos')}
                            className="bg-gray-50 p-3 rounded-full border border-gray-100 hover:bg-white hover:shadow-md transition-all group"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-charcoal-400 group-hover:text-primary" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="page-header-title">
                                    {toTitleCase(`${activo.marca} ${activo.modelo}`)}
                                </h1>
                                <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-bold border ${getStatusBadge(activo.estado)}`}>
                                    {toTitleCase(activo.estado?.replace('_', ' '))}
                                </span>
                            </div>
                            <p className="text-charcoal-400 text-xs font-medium">
                                placa: <span className="font-mono font-bold text-charcoal-600 uppercase">{activo.placa}</span> | serial: <span className="font-mono font-bold text-charcoal-600 uppercase">{activo.serial}</span>
                            </p>
                        </div>
                    </div>
                    {canEdit && (
                        <button
                            onClick={() => navigate(`/activos/editar/${id}`)}
                            className="btn-primary"
                        >
                            <PencilSquareIcon className="w-5 h-5" />
                            Editar Información
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-100/50 p-2 rounded-full border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold transition-all shrink-0
                            ${activeTab === tab.key 
                                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                : 'text-charcoal-400 hover:text-charcoal-600 hover:bg-white'}`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-white' : 'text-charcoal-300'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="pb-10">
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <InfoCard title="Información Técnica Principal" icon={TagIcon}>
                                <InfoItem label="Categoría" value={activo.categoria?.nombre?.toLowerCase()} />
                                <InfoItem label="Subtipo" value={activo.tipo?.toLowerCase()} />
                                <InfoItem label="Nombre de Red" value={activo.nombreEquipo?.toLowerCase()} />
                                <InfoItem label="Localización" value={activo.ubicacion?.toLowerCase()} />
                                <InfoItem label="Activo Fijo" value={activo.activoFijo} />
                                <InfoItem label="Color / Estética" value={activo.color?.toLowerCase()} />
                                <InfoItem label="Valor Adquisición" value={formatCurrency(activo.valorCompra)} />
                                <InfoItem label="Fecha de Compra" value={formatDate(activo.fechaCompra)} />
                                <InfoItem label="Vigencia Garantía" value={formatDate(activo.garantiaHasta)} />
                                <InfoItem label="Observaciones" value={activo.observaciones?.toLowerCase()} isFullWidth />
                            </InfoCard>

                            <InfoCard title="Administración Patrimonial" icon={BanknotesIcon}>
                                <InfoItem label="Empresa Propietaria" value={activo.empresaPropietaria?.toLowerCase()} />
                                <InfoItem label="Dependencia Cargo" value={activo.dependencia?.toLowerCase()} />
                                <InfoItem label="Fuente recurrentes" value={activo.fuenteRecurso?.toLowerCase()} />
                                <InfoItem label="Modalidad" value={activo.tipoRecurso?.toLowerCase()} />
                                <InfoItem label="Esquema Control" value={activo.tipoControl?.toLowerCase()} />
                                <InfoItem label="Estado Operativo" value={activo.estadoOperativo?.toLowerCase()} />
                            </InfoCard>

                            <InfoCard title="Asignación Actual" icon={IdentificationIcon}>
                                <InfoItem label="Personal Responsable" value={activo.nombreFuncionario?.toLowerCase()} />
                                <InfoItem label="Cédula" value={activo.cedulaFuncionario} />
                                <InfoItem label="Área / Proceso" value={activo.area?.toLowerCase()} />
                                <InfoItem label="Cargo / Función" value={activo.cargo?.toLowerCase()} />
                            </InfoCard>

                            <InfoCard title="Arquitectura de Hardware" icon={CpuChipIcon}>
                                <InfoItem label="Unidad Central (CPU)" value={activo.procesador?.toLowerCase()} />
                                <InfoItem label="Memoria Operativa" value={activo.memoriaRam?.toLowerCase()} />
                                <InfoItem label="Almacenamiento" value={activo.discoDuro?.toLowerCase()} />
                                <InfoItem label="Núcleo de Software" value={activo.sistemaOperativo?.toLowerCase()} />
                            </InfoCard>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="text-[11px] font-bold text-charcoal-400 mb-4 border-b border-gray-50 pb-3">Registro Visual</h3>
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
                                    <img 
                                        src={getImageUrl(activo.imagen)} 
                                        alt="" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'asignaciones' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-[13px] font-black text-charcoal-900 capitalize tracking-tight flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-primary" />
                                Historial de Trazabilidad
                            </h3>
                        </div>
                        <div className="p-0">
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Funcionario</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Ciclo de Vida</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Anotaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {activo.asignaciones?.map((asig) => (
                                            <tr key={asig.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-charcoal-400">
                                                            {asig.funcionario.nombre?.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-charcoal-800 text-[13px] capitalize">{asig.funcionario.nombre?.toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="bg-charcoal-50 text-charcoal-600 px-3 py-1 rounded-full text-[10px] font-bold border border-charcoal-100 capitalize">
                                                        {asig.tipo?.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 space-y-1">
                                                    <p className="text-[11px] font-bold text-charcoal-600 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                        {formatDate(asig.fechaInicio)}
                                                    </p>
                                                    <p className="text-[11px] font-bold text-charcoal-300 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-charcoal-200"></span>
                                                        {asig.fechaFin ? formatDate(asig.fechaFin) : 'VIGENTE'}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 text-xs text-charcoal-500 italic max-w-xs truncate">{asig.observaciones}</td>
                                            </tr>
                                        ))}
                                        {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                            <tr><td colSpan="4" className="py-20 text-center text-charcoal-300 italic font-bold text-[11px]">Sin registros de trazabilidad</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hojadevida' && (
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-charcoal-900 tracking-tight capitalize">Eventos de Mantenimiento</h3>
                                <p className="text-charcoal-400 text-xs mt-1 font-medium capitalize">Cronología de soporte técnico y siniestros</p>
                            </div>
                            {canEdit && (
                                <button
                                    onClick={() => setIsHVModalOpen(true)}
                                    className="btn-primary"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Registrar Evento
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-0">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Registro</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Analista</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Valorización</th>
                                            <th className="px-8 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Estado</th>
                                            <th className="px-8 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {activo.hojaVida?.map((hv) => (
                                            <tr key={hv.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <p className="text-[12px] font-bold text-charcoal-800">{formatDate(hv.fecha)}</p>
                                                    <p className="text-[10px] text-charcoal-400 font-bold opacity-60">Caso: {hv.casoAranda || 'N/A'}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-bold border border-primary/10 capitalize">
                                                        {hv.tipo?.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-full bg-charcoal-800 flex items-center justify-center text-white text-[10px] font-bold">
                                                            {(hv.responsable?.nombre || hv.tecnico)?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-[12px] text-charcoal-700 font-semibold capitalize">{(hv.responsable?.nombre || hv.tecnico || 'anonimo')?.toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-[12px] font-bold text-charcoal-900">{formatCurrency(hv.costo)}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-bold border ${getHVStatusBadge(hv.estado)}`}>
                                                        {hv.estado?.replace('_', ' ')?.toLowerCase() || 'en proceso'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                                        className="text-primary font-bold text-[11px] hover:underline"
                                                    >
                                                        {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO' || !canEdit) ? 'Detalle' : 'Gestionar'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                            <tr><td colSpan="6" className="py-20 text-center text-charcoal-300 italic font-bold text-[11px]">Sin registros técnicos vinculados</td></tr>
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
