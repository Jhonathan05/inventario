import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { getImageUrl } from '../../lib/utils';
import ActivosForm from './ActivosForm';
import AsignarActivoModal from './AsignarActivoModal';
import { exportToExcel } from '../../lib/exportUtils';

const ActivosList = () => {
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivo, setSelectedActivo] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        fetchActivos();
    }, [search]);

    const fetchActivos = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;

            const response = await api.get('/activos', { params });
            setActivos(response.data);
        } catch (error) {
            console.error('Error fetching activos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedActivo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (activo) => {
        setSelectedActivo(activo);
        setIsModalOpen(true);
    };

    const handleAssign = (activo) => {
        setSelectedActivo(activo);
        setIsAssignModalOpen(true);
    };

    const handleReturn = async (activo) => {
        if (window.confirm(`¿Está seguro de marcar el equipo ${activo.placa} como devuelto a TI?`)) {
            try {
                await api.post('/asignaciones/devolucion', { activoId: activo.id, observaciones: 'Devolución rápida desde lista' });
                fetchActivos();
            } catch (err) {
                alert('Error al procesar devolución');
            }
        }
    };

    const handleExport = () => {
        const dataToExport = activos.map(a => ({
            ID: a.id,
            Placa: a.placa,
            Serial: a.serial,
            Marca: a.marca,
            Modelo: a.modelo,
            Categoría: a.categoria?.nombre || 'N/A',
            Estado: a.estado,
            Ubicación: a.ubicacion,
            'Asignado A': a.asignaciones?.[0]?.funcionario?.nombre || 'Sin Asignar',
            'Valor Compra': a.valorCompra,
            'Fecha Compra': a.fechaCompra ? new Date(a.fechaCompra).toLocaleDateString() : ''
        }));
        exportToExcel(dataToExport, 'Inventario_Activos');
    };

    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) {
            fetchActivos();
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Activos Tecnológicos</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Inventario completo de equipos. Busca por placa, serial o modelo.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
                    <button
                        type="button"
                        onClick={handleExport}
                        className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 from-slate-50"
                    >
                        📤 Exportar Excel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Nuevo Activo
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por placa, serie, marca..."
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Add more filters here later */}
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Activo</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categoría</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ubicación</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Asignado A</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Acciones</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {activos.map((activo) => (
                                        <tr key={activo.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={getImageUrl(activo.imagen)} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            <Link to={`/activos/${activo.id}`} className="hover:text-indigo-600 hover:underline">
                                                                {activo.marca} {activo.modelo}
                                                            </Link>
                                                        </div>
                                                        <div className="text-gray-500">Placa: {activo.placa}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div className="text-gray-900">{activo.categoria?.nombre}</div>
                                                <div className="text-xs text-gray-400">SN: {activo.serial}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${activo.estado === 'DISPONIBLE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    activo.estado === 'ASIGNADO' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                                                        'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                                    }`}>
                                                    {activo.estado}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {activo.ubicacion || 'Sin ubicación'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {activo.asignaciones?.[0]?.funcionario?.nombre || 'Sin asignar'}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-3">
                                                    {activo.estado === 'DISPONIBLE' && (
                                                        <button onClick={() => handleAssign(activo)} className="text-green-600 hover:text-green-900">
                                                            Asignar
                                                        </button>
                                                    )}
                                                    {activo.estado === 'ASIGNADO' && (
                                                        <>
                                                            <button onClick={() => handleAssign(activo)} className="text-blue-600 hover:text-blue-900">
                                                                Trasladar
                                                            </button>
                                                            <button onClick={() => handleReturn(activo)} className="text-orange-600 hover:text-orange-900">
                                                                Devolver
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(activo)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {activos.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" className="py-10 text-center text-gray-500">
                                                No se encontraron activos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ActivosForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    activo={selectedActivo}
                />
            )}

            {isAssignModalOpen && (
                <AsignarActivoModal
                    open={isAssignModalOpen}
                    onClose={() => { setIsAssignModalOpen(false); fetchActivos(); }}
                    activo={selectedActivo}
                />
            )}
        </div>
    );
};

export default ActivosList;
