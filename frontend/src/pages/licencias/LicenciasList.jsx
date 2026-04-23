import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { licenciasService } from '../../api/licencias.service';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { 
    PlusIcon, 
    MagnifyingGlassIcon, 
    KeyIcon, 
    FunnelIcon, 
    CalendarIcon, 
    ComputerDesktopIcon, 
    CheckBadgeIcon, 
    PencilSquareIcon, 
    TrashIcon,
    XMarkIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
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
            {/* Sección de Encabezado: Título y Descripción */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <KeyIcon className="w-6 h-6 text-fnc-600" />
                            </div>
                            Licencias de Software
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Gestión de suscripciones, claves OEM y software por volumen institucional
                        </p>
                    </div>
                    {canEdit && (
                        <button
                            onClick={handleOpenNew}
                            className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-bold text-sm uppercase tracking-widest"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Registrar Licencia
                        </button>
                    )}
                </div>
            </div>

            {/* Sección de Contenido: Filtros y Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Buscar software, key o placa..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 text-sm bg-white transition-all shadow-sm font-medium"
                            />
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <FunnelIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                <select
                                    value={tipoFiltro}
                                    onChange={e => { setTipoFiltro(e.target.value); setPage(1); }}
                                    className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-fnc-500 text-[10px] uppercase font-black tracking-widest bg-white appearance-none transition-all cursor-pointer"
                                >
                                    <option value="">TODOS LOS TIPOS</option>
                                    <option value="PERPETUA">PERPETUA</option>
                                    <option value="SUSCRIPCION">SUSCRIPCIÓN</option>
                                    <option value="OEM">OEM</option>
                                    <option value="OPEN">VOLUME/OPEN</option>
                                </select>
                            </div>
                            <div className="relative flex-1 sm:flex-none">
                                <CheckBadgeIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                <select
                                    value={asignadaFiltro}
                                    onChange={e => { setAsignadaFiltro(e.target.value); setPage(1); }}
                                    className="w-full pl-8 pr-8 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-fnc-500 text-[10px] uppercase font-black tracking-widest bg-white appearance-none transition-all cursor-pointer"
                                >
                                    <option value="">DISPONIBILIDAD</option>
                                    <option value="false">DISPONIBLES</option>
                                    <option value="true">EN USO</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    {isLoading ? (
                        <div className="text-center py-16 text-charcoal-400 font-medium">Cargando licencias...</div>
                    ) : licencias.length === 0 ? (
                        <div className="text-center py-16 text-charcoal-400 font-bold italic">
                            No se encontraron licencias con los criterios de búsqueda.
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Software</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Tipo</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Key / SN</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Vencimiento</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Asignación</th>
                                                {canEdit && <th className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Acciones</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {licencias.map(lic => (
                                                 <tr key={lic.id} className="hover:bg-gray-50/50 transition-colors">
                                                     <td className="px-6 py-4">
                                                         <p className="font-bold text-charcoal-900 text-sm">{lic.software} {lic.version}</p>
                                                         <p className="text-[10px] text-fnc-500 font-black uppercase tracking-widest mt-0.5">{formatCurrency(lic.costo)}</p>
                                                     </td>
                                                     <td className="px-6 py-4">
                                                         <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border border-blue-100 bg-blue-50 text-blue-700">
                                                             {lic.tipoLicencia}
                                                         </span>
                                                     </td>
                                                     <td className="px-6 py-4">
                                                         <p className="font-mono text-xs font-bold text-charcoal-500 truncate max-w-[150px]">{lic.llaveLicencia || 'N/A'}</p>
                                                     </td>
                                                     <td className="px-6 py-4 whitespace-nowrap text-xs font-bold">
                                                         {lic.tipoLicencia === 'SUSCRIPCION' ? (
                                                             <div className="flex items-center gap-1.5">
                                                                 <CalendarIcon className="w-3.5 h-3.5 text-charcoal-400" />
                                                                 <span className={lic.vencimiento && new Date(lic.vencimiento) < new Date() ? 'text-red-600' : 'text-charcoal-600'}>
                                                                     {formatDate(lic.vencimiento) || '-'}
                                                                 </span>
                                                             </div>
                                                         ) : <span className="text-charcoal-300 italic font-medium">N/A</span>}
                                                     </td>
                                                     <td className="px-6 py-4">
                                                         {lic.activo ? (
                                                             <button 
                                                                 onClick={() => window.location.href = `/activos/${lic.activoId}`}
                                                                 className="text-fnc-600 hover:text-fnc-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 bg-fnc-50 px-2 py-1 rounded-lg border border-fnc-100 shadow-sm transition-all"
                                                             >
                                                                 <ComputerDesktopIcon className="w-3.5 h-3.5" />
                                                                 {lic.activo.placa}
                                                             </button>
                                                         ) : (
                                                             <span className="text-green-700 text-[10px] font-black bg-green-50 px-2.5 py-1 rounded-lg border border-green-100 uppercase tracking-widest">Disponible</span>
                                                         )}
                                                     </td>
                                                     {canEdit && (
                                                         <td className="px-6 py-4 text-right">
                                                             <div className="flex justify-end gap-1">
                                                                 <button 
                                                                     onClick={() => handleOpenEdit(lic)} 
                                                                     className="text-charcoal-400 hover:text-fnc-600 p-2 rounded-lg transition-all"
                                                                     title="Editar"
                                                                 >
                                                                     <PencilSquareIcon className="w-4 h-4" />
                                                                 </button>
                                                                 <button 
                                                                     onClick={() => handleDelete(lic.id, lic.software)} 
                                                                     className="text-charcoal-400 hover:text-red-600 p-2 rounded-lg transition-all"
                                                                     title="Eliminar"
                                                                 >
                                                                     <TrashIcon className="w-4 h-4" />
                                                                 </button>
                                                             </div>
                                                         </td>
                                                     )}
                                                 </tr>
                                             ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
                                {licencias.map(lic => (
                                    <div key={lic.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4 hover:border-fnc-200 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-charcoal-900 text-sm truncate">{lic.software} {lic.version}</h3>
                                                <p className="text-[10px] text-fnc-500 font-black uppercase tracking-widest mt-0.5">{formatCurrency(lic.costo)}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
                                                {lic.tipoLicencia}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                                            <div className="space-y-1">
                                                <p className="text-charcoal-400 uppercase tracking-widest">Key / ID</p>
                                                <p className="font-mono text-charcoal-600 truncate">{lic.llaveLicencia || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-charcoal-400 uppercase tracking-widest text-right">Estado</p>
                                                <div className="mt-1 flex justify-end">
                                                    {lic.activo ? (
                                                        <span className="text-fnc-600 bg-fnc-50 px-2 py-0.5 rounded border border-fnc-100 uppercase tracking-widest">Asignada a {lic.activo.placa}</span>
                                                    ) : (
                                                        <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest">Disponible</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {canEdit && (
                                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
                                                <button
                                                    onClick={() => handleOpenEdit(lic)}
                                                    className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-fnc-600 bg-fnc-50 rounded-lg uppercase tracking-widest hover:bg-fnc-100 transition-all shadow-sm"
                                                >
                                                    <PencilSquareIcon className="w-3.5 h-3.5" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lic.id, lic.software)}
                                                    className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-red-600 bg-red-50 rounded-lg uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                    Borrar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {!isLoading && licencias.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <Pagination
                            currentPage={page}
                            totalPages={pagination.pages || 1}
                            totalItems={pagination.total || licencias.length}
                            itemsPerPage={9}
                            currentCount={licencias.length}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-black text-charcoal-900 uppercase tracking-widest flex items-center gap-2">
                                    <KeyIcon className="w-5 h-5 text-fnc-600" />
                                    {isEditing ? 'Editar Licencia' : 'Registrar Software'}
                                </h3>
                                <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest mt-0.5">Gestión de activos digitales</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="p-2 hover:bg-white rounded-full transition-colors text-charcoal-400 shadow-sm border border-transparent hover:border-gray-100"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Nombre del Software *</label>
                                    <input required type="text" className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 transition-all outline-none" value={formData.software} onChange={e => setFormData({...formData, software: e.target.value})} placeholder="Ej: Microsoft Office LTSC" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Versión/Edición</label>
                                    <input type="text" className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-fnc-500 outline-none" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="Ej: 2021 Pro Plus" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Tipo de Licencia *</label>
                                    <select required className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-fnc-500 outline-none appearance-none" value={formData.tipoLicencia} onChange={e => setFormData({...formData, tipoLicencia: e.target.value})}>
                                        <option value="PERPETUA">PERPETUA</option>
                                        <option value="SUSCRIPCION">SUSCRIPCIÓN</option>
                                        <option value="OEM">OEM</option>
                                        <option value="OPEN">OPEN/VOLUMEN</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Llave de Activación / SN</label>
                                    <input type="text" className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-mono font-bold bg-gray-50 focus:ring-2 focus:ring-fnc-500 outline-none" value={formData.llaveLicencia} onChange={e => setFormData({...formData, llaveLicencia: e.target.value})} placeholder="XXXXX-XXXXX-XXXXX" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Fecha de Compra</label>
                                    <input type="date" className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-fnc-500 outline-none" value={formData.fechaCompra} onChange={e => setFormData({...formData, fechaCompra: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Valor Unitario</label>
                                    <input type="number" step="0.01" className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-fnc-500 outline-none" value={formData.costo} onChange={e => setFormData({...formData, costo: e.target.value})} placeholder="0.00" />
                                </div>
                                {formData.tipoLicencia === 'SUSCRIPCION' && (
                                    <div className="col-span-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                                        <label className="block text-[10px] font-black text-red-600 uppercase tracking-widest mb-1.5">Fecha de Vencimiento *</label>
                                        <input required type="date" className="block w-full border border-red-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-red-500 outline-none" value={formData.vencimiento} onChange={e => setFormData({...formData, vencimiento: e.target.value})} />
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Observaciones Adicionales</label>
                                    <textarea rows={2} className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium bg-white focus:ring-2 focus:ring-fnc-500 outline-none" value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} placeholder="..." />
                                </div>
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button 
                                    type="submit" 
                                    disabled={saveMutation.isLoading} 
                                    className="flex-1 bg-fnc-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest shadow-lg hover:bg-fnc-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {saveMutation.isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                    {isEditing ? 'Actualizar Datos' : 'Registrar Software'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 bg-white border border-gray-200 text-charcoal-600 rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Descartar
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
