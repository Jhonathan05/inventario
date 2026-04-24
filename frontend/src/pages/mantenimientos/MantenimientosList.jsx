import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import {
    WrenchScrewdriverIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    CalendarIcon,
    UserIcon,
    ChatBubbleBottomCenterTextIcon,
    XMarkIcon,
    DocumentMagnifyingGlassIcon,
    IdentificationIcon,
    CpuChipIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import api from '../../lib/axios';
import Pagination from '../../components/Pagination';

const ESTADOS = ['CREADO', 'EN_PROCESO', 'SUSPENDIDO', 'FINALIZADO', 'CERRADO'];
const TIPOS = ['MANTENIMIENTO', 'REPARACION', 'SUMINISTRO', 'INSPECCION', 'ACTUALIZACION'];

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
    }),
    groupHeading: (base) => ({
        ...base,
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#9ca3af',
        padding: '8px 16px'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af',
        textTransform: 'none'
    })
};

const estadoBadge = (estado) => {
    const map = {
        CREADO: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        EN_PROCESO: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        SUSPENDIDO: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
        FINALIZADO: 'bg-green-500/10 text-green-600 border-green-500/20',
        CERRADO: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };
    return map[estado] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

const tipoBadge = (tipo) => {
    const map = {
        MANTENIMIENTO: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
        REPARACION: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        SUMINISTRO: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
        INSPECCION: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
        ACTUALIZACION: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    };
    return map[tipo] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};

const MantenimientosList = () => {
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(t);
    }, [search]);

    const queryParams = {
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filterEstado && { estado: filterEstado }),
        ...(filterTipo && { tipo: filterTipo }),
    };

    const { data: registros = [], isLoading: loading } = useQuery({
        queryKey: ['mantenimientos', queryParams],
        queryFn: () => api.get('/hojavida', { params: queryParams }).then(r => r.data),
    });

    const { data: allRegistros = [] } = useQuery({
        queryKey: ['mantenimientos', 'all'],
        queryFn: () => api.get('/hojavida').then(r => r.data),
        staleTime: 1000 * 60 * 5,
    });

    const counts = ESTADOS.reduce((acc, e) => {
        acc[e] = allRegistros.filter(r => r.estado === e).length;
        return acc;
    }, {});

    const cardConfig = [
        { label: 'Creados', estado: 'CREADO', icon: '🆕' },
        { label: 'En Proceso', estado: 'EN_PROCESO', icon: '⚙️' },
        { label: 'Suspendidos', estado: 'SUSPENDIDO', icon: '⏸️' },
        { label: 'Finalizados', estado: 'FINALIZADO', icon: '✅' },
    ];

    const activeFilterCount = (filterEstado ? 1 : 0) + (filterTipo ? 1 : 0);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRegistros = registros.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(registros.length / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header Módulo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Gestión de Mantenimientos</h1>
                    <p className="page-header-subtitle">
                        Vista global de todas las hojas de vida y soporte técnico ({registros.length} registros)
                    </p>
                </div>
            </div>

            {/* kpis Minimalistas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cardConfig.map(c => (
                    <button
                        key={c.estado}
                        onClick={() => {
                            setFilterEstado(prev => prev === c.estado ? '' : c.estado);
                            setCurrentPage(1);
                        }}
                        className={`rounded-2xl p-4 text-left border transition-all duration-300 group
                            ${filterEstado === c.estado 
                                ? 'bg-fnc-50 border-fnc-200 shadow-md ring-1 ring-fnc-200' 
                                : 'bg-white border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="bg-gray-50 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                                {c.icon}
                            </div>
                            <span className={`text-xl font-black ${filterEstado === c.estado ? 'text-fnc-700' : 'text-charcoal-900'}`}>
                                {counts[c.estado] || 0}
                            </span>
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${filterEstado === c.estado ? 'text-fnc-600' : 'text-charcoal-400'}`}>{c.label}</p>
                    </button>
                ))}
            </div>

            {/* Filtros Sobrios */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col xl:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full group">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 group-focus-within:text-fnc-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Busca por placa, descripción o caso Aranda..."
                                className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-fnc-500/20 focus:border-fnc-500 transition-all shadow-sm"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 w-full xl:w-auto">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-[12px] font-bold transition-all border ${
                                    showFilters || activeFilterCount > 0 
                                    ? 'bg-fnc-50 border-fnc-200 text-fnc-700' 
                                    : 'bg-white border-gray-100 text-charcoal-500 hover:bg-gray-50'
                                }`}
                            >
                                <FunnelIcon className="w-4 h-4" />
                                {showFilters ? 'Ocultar Filtros' : 'Más Filtros'}
                                {activeFilterCount > 0 && (
                                    <span className="bg-fnc-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                            {(search || filterEstado || filterTipo) && (
                                <button
                                    onClick={() => { setSearch(''); setFilterEstado(''); setFilterTipo(''); }}
                                    className="p-3 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-100"
                                    title="Limpiar filtros"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up bg-white/50 p-4 rounded-2xl border border-gray-100/50">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Estado</label>
                                <Select
                                    styles={customSelectStyles}
                                    options={[{value: '', label: 'Cualquier Estado'}, ...ESTADOS.map(e => ({ value: e, label: e.replace('_', ' ') }))]}
                                    value={{ value: filterEstado, label: filterEstado ? filterEstado.replace('_', ' ') : 'Cualquier Estado' }}
                                    onChange={o => { setFilterEstado(o?.value || ''); setCurrentPage(1); }}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Tipo de Intervención</label>
                                <Select
                                    styles={customSelectStyles}
                                    options={[{value: '', label: 'Cualquier Tipo'}, ...TIPOS.map(t => ({ value: t, label: t }))]}
                                    value={{ value: filterTipo, label: filterTipo || 'Cualquier Tipo' }}
                                    onChange={o => { setFilterTipo(o?.value || ''); setCurrentPage(1); }}
                                    isSearchable={false}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla Minimalista */}
                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-fnc-400 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando registros...</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50 table-auto">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Activo</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Tipo / Estado</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Bitácora</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize hidden lg:table-cell">Responsable</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Fecha</th>
                                            <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {paginatedRegistros.map(reg => (
                                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <Link to={`/activos/${reg.activoId || reg.activo?.id}`} className="font-semibold text-charcoal-800 text-[13px] hover:text-fnc-600 transition-colors capitalize tracking-tight">
                                                            {reg.activo?.marca?.toLowerCase()} {reg.activo?.modelo?.toLowerCase()}
                                                        </Link>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[11px] text-charcoal-400 font-mono opacity-70">P: {reg.activo?.placa}</span>
                                                            {reg.casoAranda && (
                                                                <span className="text-[10px] font-bold text-fnc-600 bg-fnc-50 px-1.5 py-0.5 rounded-full border border-fnc-100">#{reg.casoAranda}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize border ${tipoBadge(reg.tipo)}`}>
                                                            {reg.tipo?.toLowerCase()}
                                                        </span>
                                                        <span className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize border ${estadoBadge(reg.estado)}`}>
                                                            {reg.estado?.replace('_', ' ')?.toLowerCase()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <button
                                                        onClick={() => setSelectedMaintenance(reg) || setShowDetailModal(true)}
                                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold capitalize bg-gray-50 text-charcoal-500 hover:bg-charcoal-600 hover:text-white transition-all border border-gray-100"
                                                    >
                                                        <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                                                        Ver Historial
                                                    </button>
                                                </td>
                                                <td className="px-6 py-6 hidden lg:table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-charcoal-400">
                                                            {reg.responsable?.nombre?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-[12px] text-charcoal-700 font-semibold capitalize tracking-tight">{reg.responsable?.nombre?.toLowerCase() || 'soporte tic'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-mono text-[11px] text-charcoal-400">
                                                    {new Date(reg.fecha).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <Link
                                                        to={`/activos/${reg.activoId || reg.activo?.id}`}
                                                        className="inline-flex items-center justify-center p-2 rounded-full text-charcoal-300 hover:text-fnc-600 hover:bg-fnc-50 transition-all border border-transparent hover:border-fnc-100"
                                                        title="Gestionar Mantenimiento"
                                                    >
                                                        <ClockIcon className="w-4 h-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Vista Card para mobile */}
                            <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                {paginatedRegistros.map(reg => (
                                    <div key={reg.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link to={`/activos/${reg.activoId || reg.activo?.id}`} className="font-semibold text-charcoal-800 text-sm capitalize">
                                                    {reg.activo?.marca?.toLowerCase()} {reg.activo?.modelo?.toLowerCase()}
                                                </Link>
                                                <p className="text-[11px] text-charcoal-400 font-mono mt-0.5">Placa: {reg.activo?.placa}</p>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${estadoBadge(reg.estado)}`}>
                                                {reg.estado?.replace('_', ' ')?.toLowerCase()}
                                            </span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                            <button onClick={() => setSelectedMaintenance(reg) || setShowDetailModal(true)} className="text-[11px] font-bold text-fnc-600 bg-fnc-50 px-3 py-1.5 rounded-full border border-fnc-100">
                                                Bitácora
                                            </button>
                                            <span className="text-[11px] text-charcoal-400 font-mono">{new Date(reg.fecha).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            <div className="p-4 border-t border-gray-50">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={registros.length}
                                    itemsPerPage={itemsPerPage}
                                    currentCount={paginatedRegistros.length}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Detalle Completo */}
            {showDetailModal && selectedMaintenance && (
                <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-gray-100 flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="bg-fnc-50 p-2.5 rounded-full border border-fnc-100">
                                    <DocumentMagnifyingGlassIcon className="w-6 h-6 text-fnc-600" />
                                </div>
                                <h3 className="text-lg font-black text-charcoal-900 capitalize tracking-tight">Bitácora de Soporte</h3>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Contenido Modal */}
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-charcoal-400 capitalize flex items-center gap-2"><CpuChipIcon className="w-3 h-3" /> Equipo Intervenido</span>
                                    <p className="text-sm font-black text-fnc-700 capitalize">{selectedMaintenance.activo?.marca?.toLowerCase()} {selectedMaintenance.activo?.modelo?.toLowerCase()}</p>
                                    <p className="text-[11px] font-mono text-charcoal-400">PLACA: {selectedMaintenance.activo?.placa}</p>
                                </div>
                                <div className="space-y-1 md:text-right">
                                    <span className="text-[10px] font-bold text-charcoal-400 capitalize flex items-center gap-2 md:justify-end"><CalendarIcon className="w-3 h-3" /> Fecha del Reporte</span>
                                    <p className="text-sm font-black text-charcoal-700">{new Date(selectedMaintenance.fecha).toLocaleDateString()}</p>
                                    <div className="flex gap-2 md:justify-end mt-2">
                                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize border ${tipoBadge(selectedMaintenance.tipo)}`}>{selectedMaintenance.tipo?.toLowerCase()}</span>
                                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize border ${estadoBadge(selectedMaintenance.estado)}`}>{selectedMaintenance.estado?.replace('_', ' ')?.toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[12px] font-bold text-charcoal-900 capitalize border-l-4 border-fnc-600 pl-3">Procedimiento y Hallazgos</h4>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-sm font-medium text-charcoal-700 whitespace-pre-line leading-relaxed">
                                    {selectedMaintenance.descripcion || <span className="italic text-charcoal-300">No se registró descripción técnica</span>}
                                </div>
                            </div>

                            {selectedMaintenance.diagnostico && (
                                <div className="space-y-3">
                                    <h4 className="text-[12px] font-bold text-charcoal-900 capitalize border-l-4 border-amber-500 pl-3">Diagnóstico Técnico</h4>
                                    <div className="bg-amber-50/30 border border-amber-100 p-6 rounded-2xl text-sm font-bold text-charcoal-800 italic leading-relaxed">
                                        {selectedMaintenance.diagnostico}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {selectedMaintenance.responsable?.nombre?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-charcoal-400 capitalize">Técnico Responsable</p>
                                        <p className="text-sm font-black text-charcoal-700 capitalize">{selectedMaintenance.responsable?.nombre?.toLowerCase() || 'Soporte TIC'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowDetailModal(false)} 
                                    className="btn-secondary"
                                >
                                    Cerrar Bitácora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MantenimientosList;
