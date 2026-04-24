import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Select from 'react-select';
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
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '9999px',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: '600',
        borderColor: state.isFocused ? '#8d1024' : '#f3f4f6',
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        '&:hover': {
            borderColor: '#8d1024'
        },
        transition: 'all 0.2s ease',
        textTransform: 'capitalize'
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '12px',
        fontWeight: state.isSelected ? '700' : '600',
        backgroundColor: state.isSelected ? '#f3f4f6' : state.isFocused ? '#f9fafb' : 'transparent',
        color: state.isSelected ? '#111827' : '#4b5563',
        cursor: 'pointer',
        padding: '10px 16px',
        textTransform: 'capitalize',
        '&:active': {
            backgroundColor: '#f3f4f6'
        }
    }),
    valueContainer: (base) => ({
        ...base,
        textTransform: 'capitalize'
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        padding: '4px',
        zIndex: 50
    })
};

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
        })
    });

    const licencias = licenciasResponse?.data || [];
    const pagination = licenciasResponse?.pagination || { page: 1, pages: 1, total: 0 };

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
            {/* Header Módulo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Software & Licencias</h1>
                    <p className="page-header-subtitle">
                        Gestión centralizada de activos digitales e institucionales ({pagination.total || 0} activos)
                    </p>
                </div>
                {canEdit && (
                    <button
                        type="button"
                        onClick={handleOpenNew}
                        className="btn-primary"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Registrar Software
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="relative group w-full xl:max-w-md">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Busca por software, llave o placa..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                        <div className="w-full xl:w-56">
                            <Select
                                styles={customSelectStyles}
                                options={[
                                    { value: '', label: 'Cualquier Tipo' },
                                    { value: 'PERPETUA', label: 'Perpetua' },
                                    { value: 'SUSCRIPCION', label: 'Suscripción' },
                                    { value: 'OEM', label: 'Oem / Fábrica' },
                                    { value: 'OPEN', label: 'Volumen / Open' }
                                ]}
                                value={{ value: tipoFiltro, label: tipoFiltro ? (tipoFiltro === 'OEM' ? 'OEM' : (tipoFiltro === 'OPEN' ? 'Volumen' : tipoFiltro?.toLowerCase())) : 'Cualquier Tipo' }}
                                onChange={o => { setTipoFiltro(o?.value || ''); setPage(1); }}
                                isSearchable={false}
                            />
                        </div>
                        <div className="w-full xl:w-56">
                            <Select
                                styles={customSelectStyles}
                                options={[
                                    { value: '', label: 'Disponibilidad' },
                                    { value: 'false', label: 'Disponibles' },
                                    { value: 'true', label: 'En Uso' }
                                ]}
                                value={{ value: asignadaFiltro, label: asignadaFiltro === 'true' ? 'En Uso' : (asignadaFiltro === 'false' ? 'Disponibles' : 'Disponibilidad') }}
                                onChange={o => { setAsignadaFiltro(o?.value || ''); setPage(1); }}
                                isSearchable={false}
                            />
                        </div>
                        {(search || tipoFiltro || asignadaFiltro) && (
                            <button
                                onClick={() => { setSearch(''); setTipoFiltro(''); setAsignadaFiltro(''); setPage(1); }}
                                className="p-3 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-100"
                                title="Limpiar filtros"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-0">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando licencias...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Software</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Llave de activación</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Vencimiento</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Asignación</th>
                                            {canEdit && <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {licencias.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-20 text-center bg-gray-50/20">
                                                    <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">No se encontraron licencias registradas</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            licencias.map((lic) => (
                                                <tr key={lic.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-[13px] font-semibold text-charcoal-800 capitalize tracking-tight">{lic.software?.toLowerCase()} {lic.version?.toLowerCase()}</span>
                                                            <span className="text-[10px] font-bold text-primary tracking-tight opacity-80">{formatCurrency(lic.costo)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 transition-transform group-hover:translate-x-1">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold capitalize border border-blue-500/10 bg-blue-500/5 text-blue-600">
                                                            {lic.tipoLicencia?.toLowerCase() === 'open' ? 'volumen' : lic.tipoLicencia?.toLowerCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="font-mono text-[11px] font-semibold text-charcoal-400 truncate max-w-[150px] opacity-70 group-hover:opacity-100 transition-opacity">{lic.llaveLicencia || 'Sin registro'}</p>
                                                    </td>
                                                    <td className="px-6 py-6 whitespace-nowrap text-[12px] font-medium">
                                                        {lic.tipoLicencia === 'SUSCRIPCION' ? (
                                                            <div className="flex items-center gap-2">
                                                                <CalendarIcon className="w-4 h-4 text-charcoal-300" />
                                                                <span className={lic.vencimiento && new Date(lic.vencimiento) < new Date() ? 'text-rose-600 font-bold' : 'text-charcoal-500'}>
                                                                    {formatDate(lic.vencimiento) || '-'}
                                                                </span>
                                                            </div>
                                                        ) : <span className="text-charcoal-300 italic text-[11px]">Vitalicia</span>}
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        {lic.activo ? (
                                                            <button 
                                                                onClick={() => window.location.href = `/activos/${lic.activoId}`}
                                                                className="text-primary hover:text-primary/80 font-bold text-[10px] flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 transition-all hover:shadow-sm"
                                                            >
                                                                <ComputerDesktopIcon className="w-3.5 h-3.5" />
                                                                Placa: {lic.activo.placa}
                                                            </button>
                                                        ) : (
                                                            <span className="text-green-600 text-[10px] font-bold bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/10">En Bodega</span>
                                                        )}
                                                    </td>
                                                    {canEdit && (
                                                        <td className="px-6 py-6 text-right">
                                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleOpenEdit(lic)} className="p-2 text-charcoal-300 hover:text-primary rounded-full hover:bg-primary/5 transition-all">
                                                                    <PencilSquareIcon className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDelete(lic.id, lic.software)} className="p-2 text-charcoal-300 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-all">
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                {licencias.map((lic) => (
                                    <div key={lic.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-charcoal-800 text-[13px] capitalize truncate">{lic.software?.toLowerCase()} {lic.version?.toLowerCase()}</h3>
                                                <p className="text-[10px] text-primary font-bold tracking-tight mt-1">{formatCurrency(lic.costo)}</p>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold capitalize border border-blue-500/10 bg-blue-500/5 text-blue-600">
                                                {lic.tipoLicencia?.toLowerCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-charcoal-400 font-bold">Identificador</p>
                                                <p className="font-mono text-[11px] text-charcoal-600 truncate opacity-80">{lic.llaveLicencia || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[10px] text-charcoal-400 font-bold">Disponibilidad</p>
                                                <div className="mt-1 flex justify-end">
                                                    {lic.activo ? (
                                                        <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 text-[9px] font-bold">Ocupada ({lic.activo.placa})</span>
                                                    ) : (
                                                        <span className="text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/10 text-[9px] font-bold">Stock</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {canEdit && (
                                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                                <button
                                                    onClick={() => handleOpenEdit(lic)}
                                                    className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-primary bg-primary/5 rounded-full capitalize hover:bg-primary transition-all hover:text-white"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lic.id, lic.software)}
                                                    className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-rose-600 bg-rose-50 rounded-full capitalize hover:bg-rose-500 transition-all hover:text-white"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
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
                    <div className="p-4 border-t border-gray-50">
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h3 className="text-lg font-black text-charcoal-900 capitalize tracking-tight flex items-center gap-3">
                                    <div className="bg-primary/5 p-1.5 rounded-full border border-primary/10">
                                        <KeyIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    {isEditing ? 'editar licencia' : 'registrar software'}
                                </h3>
                                <p className="text-[11px] font-bold text-charcoal-400 capitalize mt-1.5 ml-10">Gestión de activos digitales e institucionales</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Nombre del Software *</label>
                                    <input required type="text" className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" value={formData.software} onChange={e => setFormData({...formData, software: e.target.value})} placeholder="Ej: Microsoft Office LTSC" />
                                </div>
                                <div className="col-span-1 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Versión / Edición</label>
                                    <input type="text" className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="Ej: 2021 Pro Plus" />
                                </div>
                                <div className="col-span-1 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Tipo licencia *</label>
                                    <select required className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none" value={formData.tipoLicencia} onChange={e => setFormData({...formData, tipoLicencia: e.target.value})}>
                                        <option value="PERPETUA">PERPETUA</option>
                                        <option value="SUSCRIPCION">SUSCRIPCIÓN</option>
                                        <option value="OEM">OEM</option>
                                        <option value="OPEN">OPEN / VOLUMEN</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Llave de activación / Key</label>
                                    <input type="text" className="w-full bg-gray-50 border border-transparent rounded-full py-3 px-5 text-[13px] font-mono text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-inner" value={formData.llaveLicencia} onChange={e => setFormData({...formData, llaveLicencia: e.target.value})} placeholder="XXXXX-XXXXX-XXXXX" />
                                </div>
                                <div className="col-span-1 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Fecha compra</label>
                                    <input type="date" className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" value={formData.fechaCompra} onChange={e => setFormData({...formData, fechaCompra: e.target.value})} />
                                </div>
                                <div className="col-span-1 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Inversión unitaria</label>
                                    <input type="number" step="0.01" className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" value={formData.costo} onChange={e => setFormData({...formData, costo: e.target.value})} placeholder="0.00" />
                                </div>
                                {formData.tipoLicencia === 'SUSCRIPCION' && (
                                    <div className="col-span-2 space-y-1.5 p-5 bg-rose-50 rounded-2xl border border-rose-100">
                                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">vencimiento obligatorio *</label>
                                        <input required type="date" className="w-full border border-rose-200 rounded-full py-3.5 px-5 text-[13px] font-bold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-rose-500 outline-none" value={formData.vencimiento} onChange={e => setFormData({...formData, vencimiento: e.target.value})} />
                                    </div>
                                )}
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Notas técnicas</label>
                                    <textarea rows={2} className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm resize-none" value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} placeholder="..." />
                                </div>
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button 
                                    type="submit" 
                                    disabled={saveMutation.isLoading} 
                                    className="flex-1 btn-primary"
                                >
                                    {saveMutation.isLoading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                    {isEditing ? 'Actualizar Registro' : 'Registrar Software'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 btn-secondary"
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
