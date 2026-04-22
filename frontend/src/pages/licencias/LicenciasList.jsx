import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { licenciasService } from '../../api/licencias.service';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/Pagination';

const LicenciasList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [asignadaFiltro, setAsignadaFiltro] = useState(''); // 'true', 'false', ''
    
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        software: '',
        version: '',
        tipoLicencia: 'PERPETUA',
        llaveLicencia: '',
        cantidad: 1,
        costo: '',
        fechaCompra: '',
        vencimiento: '',
        observaciones: ''
    });

    const { data: licenciasResponse, isLoading } = useQuery({
        queryKey: ['licencias', page, search, tipoFiltro, asignadaFiltro],
        queryFn: () => licenciasService.getAll({ 
            page, 
            limit: 9, 
            search, 
            tipoLicencia: tipoFiltro, 
            asignada: asignadaFiltro 
        }),
        keepPreviousData: true
    });

    const licencias = licenciasResponse?.data || [];
    const pagination = licenciasResponse?.pagination || { page: 1, pages: 1 };

    const saveMutation = useMutation({
        mutationFn: (data) => isEditing ? licenciasService.update(currentId, data) : licenciasService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['licencias']);
            toast.success(isEditing ? 'Licencia actualizada' : 'Licencia registrada');
            setShowModal(false);
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Error al guardar')
    });

    const deleteMutation = useMutation({
        mutationFn: licenciasService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['licencias']);
            toast.success('Licencia eliminada');
        },
        onError: (err) => toast.error('Error al eliminar')
    });

    const handleOpenNew = () => {
        setFormData({
            software: '', version: '', tipoLicencia: 'PERPETUA', llaveLicencia: '',
            cantidad: 1, costo: '', fechaCompra: '', vencimiento: '', observaciones: ''
        });
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            software: item.software || '',
            version: item.version || '',
            tipoLicencia: item.tipoLicencia || 'PERPETUA',
            llaveLicencia: item.llaveLicencia || '',
            cantidad: item.cantidad || 1,
            costo: item.costo || '',
            fechaCompra: item.fechaCompra ? item.fechaCompra.split('T')[0] : '',
            vencimiento: item.vencimiento ? item.vencimiento.split('T')[0] : '',
            observaciones: item.observaciones || ''
        });
        setIsEditing(true);
        setCurrentId(item.id);
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
    };

    const handleDelete = (id, soft) => {
        if (window.confirm(`¿Eliminar definitivamente la licencia de ${soft}?`)) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Licencias de Software</h1>
                    <p className="mt-1 text-sm text-gray-500">Gestión de suscripciones, claves OEM y software por volumen.</p>
                </div>
                {canEdit && (
                    <button
                        onClick={handleOpenNew}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-500 shadow-sm transition-colors"
                    >
                        + Registrar Licencia
                    </button>
                )}
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Buscar software, key o placa..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
                <select
                    value={tipoFiltro}
                    onChange={e => { setTipoFiltro(e.target.value); setPage(1); }}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                >
                    <option value="">Todos los tipos</option>
                    <option value="PERPETUA">Perpetua</option>
                    <option value="SUSCRIPCION">Suscripción</option>
                    <option value="OEM">OEM</option>
                    <option value="OPEN">Volume/Open</option>
                </select>
                <select
                    value={asignadaFiltro}
                    onChange={e => { setAsignadaFiltro(e.target.value); setPage(1); }}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                >
                    <option value="">Disponibilidad</option>
                    <option value="false">Disponibles (Sin asignar)</option>
                    <option value="true">En Uso (Asignadas)</option>
                </select>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Software</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key / SN</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignación</th>
                                {canEdit && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Cargando...</td></tr>
                            ) : licencias.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No se encontraron licencias.</td></tr>
                            ) : licencias.map(lic => (
                                <tr key={lic.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900">{lic.software} {lic.version}</p>
                                        <p className="text-xs text-gray-500">{formatCurrency(lic.costo)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            {lic.tipoLicencia}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-mono text-xs text-gray-600 truncate max-w-[150px]">{lic.llaveLicencia || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {lic.tipoLicencia === 'SUSCRIPCION' ? (
                                            <span className={lic.vencimiento && new Date(lic.vencimiento) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                                                {formatDate(lic.vencimiento) || '-'}
                                            </span>
                                        ) : <span className="text-gray-400">N/A</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {lic.activo ? (
                                            <a href={`/activos/${lic.activoId}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-xs">
                                                {lic.activo.placa} ({lic.activo.marca})
                                            </a>
                                        ) : (
                                            <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded">Disponible</span>
                                        )}
                                    </td>
                                    {canEdit && (
                                        <td className="px-6 py-4 text-right font-medium">
                                            <button onClick={() => handleOpenEdit(lic)} className="text-indigo-600 hover:text-indigo-900 mr-3 text-xs">Editar</button>
                                            <button onClick={() => handleDelete(lic.id, lic.software)} className="text-red-600 hover:text-red-900 text-xs">Cerrar</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {!isLoading && licencias.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={pagination.pages || 1}
                        totalItems={pagination.total || licencias.length}
                        itemsPerPage={9}
                        currentCount={licencias.length}
                        onPageChange={setPage}
                    />
                )}
            </div>

            {/* Modal de Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Editar Licencia' : 'Registrar Software'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Software *</label>
                                    <input required type="text" className="mt-1 block w-full border rounded-md p-2 text-sm" value={formData.software} onChange={e => setFormData({...formData, software: e.target.value})} placeholder="Ej: Microsoft Office LTSC" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Versión</label>
                                    <input type="text" className="mt-1 block w-full border rounded-md p-2 text-sm" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="Ej: 2021" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Tipo *</label>
                                    <select required className="mt-1 block w-full border rounded-md p-2 text-sm" value={formData.tipoLicencia} onChange={e => setFormData({...formData, tipoLicencia: e.target.value})}>
                                        <option value="PERPETUA">Perpetua</option>
                                        <option value="SUSCRIPCION">Suscripción</option>
                                        <option value="OEM">OEM</option>
                                        <option value="OPEN">Open/Volumen</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Llave / Product Key</label>
                                    <input type="text" className="mt-1 block w-full border rounded-md p-2 text-sm font-mono" value={formData.llaveLicencia} onChange={e => setFormData({...formData, llaveLicencia: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Fecha Compra</label>
                                    <input type="date" className="mt-1 block w-full border rounded-md p-2 text-sm" value={formData.fechaCompra} onChange={e => setFormData({...formData, fechaCompra: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Costo</label>
                                    <input type="number" step="0.01" className="mt-1 block w-full border rounded-md p-2 text-sm" value={formData.costo} onChange={e => setFormData({...formData, costo: e.target.value})} />
                                </div>
                                {formData.tipoLicencia === 'SUSCRIPCION' && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 text-red-600">Fecha Vencimiento *</label>
                                        <input required type="date" className="mt-1 block w-full border rounded-md p-2 text-sm border-red-200 bg-red-50" value={formData.vencimiento} onChange={e => setFormData({...formData, vencimiento: e.target.value})} />
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea rows={2} className="mt-1 block w-full border rounded-md p-2 text-sm" value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="submit" disabled={saveMutation.isLoading} className="flex-1 bg-indigo-600 text-white rounded-md py-2 text-sm font-semibold hover:bg-indigo-500">
                                    {saveMutation.isLoading ? 'Guardando...' : 'Guardar y Cerrar'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 rounded-md py-2 text-sm font-semibold hover:bg-gray-50">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LicenciasList;
