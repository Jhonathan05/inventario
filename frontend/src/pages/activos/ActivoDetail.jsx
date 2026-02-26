import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { getImageUrl, formatCurrency, formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import ActivosForm from './ActivosForm';
import HojaVidaForm from './components/HojaVidaForm';
import EstadoHojaVidaForm from './components/EstadoHojaVidaForm';
import DocumentosList from './components/DocumentosList';

const ActivoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'TECNICO';

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
        const colors = {
            'DISPONIBLE': 'bg-green-50 text-green-700 ring-green-600/20',
            'ASIGNADO': 'bg-blue-50 text-blue-700 ring-blue-700/10',
            'EN_MANTENIMIENTO': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
            'DADO_DE_BAJA': 'bg-red-50 text-red-700 ring-red-600/20',
        };
        return colors[estado] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
    };

    const getHVStatusBadge = (estado) => {
        if (estado === 'CREADO') return 'bg-blue-50 text-blue-700 ring-blue-700/10';
        if (estado === 'EN_PROCESO') return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
        if (estado === 'ESPERA_SUMINISTRO') return 'bg-orange-50 text-orange-700 ring-orange-600/20';
        if (estado === 'PROCESO_GARANTIA') return 'bg-purple-50 text-purple-700 ring-purple-600/20';
        if (estado === 'FINALIZADO' || estado === 'CERRADO') return 'bg-green-50 text-green-700 ring-green-600/20';
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
    if (!activo) return <div className="p-8 text-center text-red-500">Activo no encontrado</div>;

    const tabs = [
        { key: 'general', label: 'General' },
        { key: 'asignaciones', label: 'Asignaciones' },
        { key: 'hojadevida', label: 'Hoja de Vida' },
        { key: 'documentos', label: 'Documentos' },
    ];

    const InfoItem = ({ label, value }) => (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
        </div>
    );

    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
                <button onClick={() => navigate('/activos')} className="text-sm text-indigo-600 hover:text-indigo-900 mb-2">
                    &larr; Volver a lista
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {activo.marca} {activo.modelo}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Placa: {activo.placa} | Serial: {activo.serial}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(activo.estado)}`}>
                            {activo.estado?.replace('_', ' ')}
                        </span>
                        {canEdit && (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs (scrollable on mobile) */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                <nav className="-mb-px flex space-x-6 min-w-max" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`${activeTab === tab.key
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="pb-10">
                {activeTab === 'general' && (
                    <div className="space-y-8">
                        {/* Row 1: Basic Info + Image */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                                    <InfoItem label="Categoría" value={activo.categoria?.nombre} />
                                    <InfoItem label="Tipo de Equipo" value={activo.tipo} />
                                    <InfoItem label="Nombre de Equipo" value={activo.nombreEquipo} />
                                    <InfoItem label="Ubicación" value={activo.ubicacion} />
                                    <InfoItem label="Valor Compra" value={formatCurrency(activo.valorCompra)} />
                                    <InfoItem label="Fecha Compra" value={formatDate(activo.fechaCompra)} />
                                    <InfoItem label="Garantía Hasta" value={formatDate(activo.garantiaHasta)} />
                                    <InfoItem label="Color" value={activo.color} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Observaciones" value={activo.observaciones || 'Ninguna'} />
                                    </div>
                                </dl>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Imagen</h3>
                                <div className="overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                                    <img src={getImageUrl(activo.imagen)} alt="" className="w-full object-cover max-h-64" />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Administration */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Administración</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                                <InfoItem label="Empresa Propietaria" value={activo.empresaPropietaria} />
                                <InfoItem label="Dependencia" value={activo.dependencia} />
                                <InfoItem label="Fuente de Recurso" value={activo.fuenteRecurso} />
                                <InfoItem label="Tipo de Recurso" value={activo.tipoRecurso} />
                                <InfoItem label="Tipo de Control" value={activo.tipoControl} />
                                <InfoItem label="Estado Operativo" value={activo.estadoOperativo} />
                                <InfoItem label="Razón de Estado" value={activo.razonEstado} />
                            </dl>
                        </div>

                        {/* Row 3: Funcionario */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Funcionario Asociado</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                                <InfoItem label="Empresa Funcionario" value={activo.empresaFuncionario} />
                                <InfoItem label="Tipo de Personal" value={activo.tipoPersonal} />
                                <InfoItem label="Cédula" value={activo.cedulaFuncionario} />
                                <InfoItem label="Nombre / Shortname" value={activo.nombreFuncionario ? `${activo.nombreFuncionario} (${activo.shortname || '-'})` : '-'} />
                                <InfoItem label="Departamento" value={activo.departamento} />
                                <InfoItem label="Ciudad" value={activo.ciudad} />
                                <InfoItem label="Cargo" value={activo.cargo} />
                                <InfoItem label="Área" value={activo.area} />
                            </dl>
                        </div>

                        {/* Row 4: Technical Specs */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Especificaciones Técnicas</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                                <InfoItem label="Procesador" value={activo.procesador} />
                                <InfoItem label="Memoria RAM" value={activo.memoriaRam} />
                                <InfoItem label="Disco Duro" value={activo.discoDuro} />
                                <InfoItem label="Sistema Operativo" value={activo.sistemaOperativo} />
                            </dl>
                        </div>
                    </div>
                )}

                {activeTab === 'asignaciones' && (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Asignaciones</h3>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Funcionario</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipo</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha Inicio</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha Fin</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Obs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {activo.asignaciones?.map((asig) => (
                                        <tr key={asig.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                {asig.funcionario.nombre}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{asig.tipo}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(asig.fechaInicio)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(asig.fechaFin)}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500">{asig.observaciones}</td>
                                        </tr>
                                    ))}
                                    {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                        <tr><td colSpan="5" className="py-6 text-center text-gray-500">Sin historial</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                <div className="py-6 text-center text-gray-500 bg-white rounded-lg shadow">Sin historial</div>
                            )}
                            {activo.asignaciones?.map((asig) => (
                                <div key={asig.id} className="bg-white rounded-lg shadow ring-1 ring-black/5 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900 text-sm">{asig.funcionario.nombre}</span>
                                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded ring-1 ring-inset ring-indigo-700/10">{asig.tipo}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div>📅 Inicio: {formatDate(asig.fechaInicio)}</div>
                                        <div>📅 Fin: {formatDate(asig.fechaFin)}</div>
                                        {asig.observaciones && <div className="text-gray-600 mt-1">📝 {asig.observaciones}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'hojadevida' && (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Mantenimientos y Eventos</h3>
                            {canEdit && (
                                <button
                                    onClick={() => setIsHVModalOpen(true)}
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    + Registrar Evento
                                </button>
                            )}
                        </div>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tipo</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Descripción</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Técnico</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Costo</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Caso Aranda</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {activo.hojaVida?.map((hv) => (
                                        <tr key={hv.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{formatDate(hv.fecha)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hv.tipo}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">{hv.descripcion}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hv.responsable?.nombre || hv.tecnico || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(hv.costo)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hv.casoAranda || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getHVStatusBadge(hv.estado)}`}>
                                                    {hv.estado?.replace('_', ' ') || 'EN PROCESO'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                                <button
                                                    onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO' || !canEdit) ? 'Ver' : 'Gestionar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                        <tr><td colSpan="8" className="py-6 text-center text-gray-500">No hay registros de mantenimiento</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                <div className="py-6 text-center text-gray-500 bg-white rounded-lg shadow">No hay registros</div>
                            )}
                            {activo.hojaVida?.map((hv) => (
                                <div key={hv.id} className="bg-white rounded-lg shadow ring-1 ring-black/5 p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="font-medium text-gray-900 text-sm">{hv.tipo}</span>
                                            <span className="text-xs text-gray-500 ml-2">{formatDate(hv.fecha)}</span>
                                        </div>
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getHVStatusBadge(hv.estado)}`}>
                                            {hv.estado?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{hv.descripcion}</p>
                                    <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                                        <div>🔧 {hv.responsable?.nombre || hv.tecnico || 'Sin técnico'}</div>
                                        {hv.casoAranda && <div>🎫 Aranda: {hv.casoAranda}</div>}
                                        <div>💰 {formatCurrency(hv.costo)}</div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                        <button
                                            onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                            className="text-xs text-indigo-700 bg-indigo-50 rounded-md px-3 py-1.5 font-medium hover:bg-indigo-100"
                                        >
                                            {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO' || !canEdit) ? 'Ver Detalles' : 'Gestionar'}
                                        </button>
                                    </div>
                                </div>
                            ))}
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
            </div>

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
