import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { getImageUrl, formatCurrency, formatDate } from '../../lib/utils';
import ActivosForm from './ActivosForm';
import HojaVidaForm from './components/HojaVidaForm';
import EstadoHojaVidaForm from './components/EstadoHojaVidaForm';
import DocumentosList from './components/DocumentosList';

const ActivoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
            // Ensure related data exists
            if (!res.data.hojaVida) res.data.hojaVida = [];
            if (!res.data.documentos) res.data.documentos = [];
            setActivo(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of component code ...


    if (loading) return <div>Cargando...</div>;
    if (!activo) return <div>Activo no encontrado</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <button onClick={() => navigate('/activos')} className="text-sm text-indigo-600 hover:text-indigo-900 mb-2">
                        &larr; Volver a lista
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activo.marca} {activo.modelo}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Placa: {activo.placa} | Serial: {activo.serial}
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${activo.estado === 'DISPONIBLE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                        activo.estado === 'ASIGNADO' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                            'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                        }`}>
                        {activo.estado}
                    </span>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Editar
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['General', 'Asignaciones', 'Hoja de Vida', 'Documentos'].map((tab) => {
                        const key = tab.toLowerCase().replace(/ /g, '');
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`${activeTab === key
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div className="pb-10">
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Información Técnica</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{activo.categoria?.nombre}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Ubicación Actual</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{activo.ubicacion || '-'}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Valor Compra</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatCurrency(activo.valorCompra)}</dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Fecha Compra</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(activo.fechaCompra)}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{activo.observaciones || 'Ninguna'}</dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Imagen</h3>
                            <div className="aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src={getImageUrl(activo.imagen)} alt="" className="object-cover" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'asignaciones' && (
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Historial de Asignaciones</h3>
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{asig.observaciones}</td>
                                        </tr>
                                    ))}
                                    {(!activo.asignaciones || activo.asignaciones.length === 0) && (
                                        <tr><td colSpan="5" className="py-4 text-center text-gray-500">Sin historial</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'hojadevida' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Mantenimientos y Eventos</h3>
                            <button
                                onClick={() => {
                                    console.log('Button Clicked! Setting isHVModalOpen to true');
                                    setIsHVModalOpen(true);
                                }}
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                + Registrar Evento
                            </button>
                        </div>
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                                            <td className="px-3 py-4 text-sm text-gray-500">{hv.descripcion}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hv.responsable?.nombre || hv.tecnico || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(hv.costo)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{hv.casoAranda || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${hv.estado === 'CREADO' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                    hv.estado === 'EN_PROCESO' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                        (hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO') ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                            'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                    }`}>
                                                    {hv.estado?.replace('_', ' ') || 'EN PROCESO'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                                <button
                                                    onClick={() => { setSelectedHV(hv); setIsStatusModalOpen(true); }}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    {(hv.estado === 'FINALIZADO' || hv.estado === 'CERRADO') ? 'Ver Detalles' : 'Gestionar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!activo.hojaVida || activo.hojaVida.length === 0) && (
                                        <tr><td colSpan="7" className="py-4 text-center text-gray-500">No hay registros de mantenimiento</td></tr>
                                    )}
                                </tbody>
                            </table>
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
                />
            )}
        </div>
    );
};

export default ActivoDetail;
