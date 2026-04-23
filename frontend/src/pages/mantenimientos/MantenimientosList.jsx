import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    WrenchScrewdriverIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    ArrowPathIcon,
    CalendarIcon,
    UserIcon,
    ChatBubbleBottomCenterTextIcon,
    XMarkIcon,
    DocumentMagnifyingGlassIcon,
    IdentificationIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import api from '../../lib/axios';
import Pagination from '../../components/Pagination';

const ESTADOS = ['CREADO', 'EN_PROCESO', 'SUSPENDIDO', 'FINALIZADO', 'CERRADO'];
const TIPOS = ['MANTENIMIENTO', 'REPARACION', 'SUMINISTRO', 'INSPECCION', 'ACTUALIZACION'];

const estadoBadge = (estado) => {
    const map = {
        CREADO: 'bg-blue-50 text-blue-700 border-blue-100',
        EN_PROCESO: 'bg-yellow-50 text-yellow-800 border-yellow-100',
        SUSPENDIDO: 'bg-orange-50 text-orange-700 border-orange-100',
        FINALIZADO: 'bg-green-50 text-green-700 border-green-100',
        CERRADO: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return map[estado] || 'bg-gray-100 text-gray-500 border-gray-200';
};

const tipoBadge = (tipo) => {
    const map = {
        MANTENIMIENTO: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        REPARACION: 'bg-red-50 text-red-700 border-red-100',
        SUMINISTRO: 'bg-teal-50 text-teal-700 border-teal-100',
        INSPECCION: 'bg-purple-50 text-purple-700 border-purple-100',
        ACTUALIZACION: 'bg-sky-50 text-sky-700 border-sky-100',
    };
    return map[tipo] || 'bg-gray-100 text-gray-500 border-gray-200';
};

const MantenimientosList = () => {
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Debounce search input
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
        { label: 'Creados', estado: 'CREADO', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🆕' },
        { label: 'En Proceso', estado: 'EN_PROCESO', color: 'bg-yellow-400', light: 'bg-yellow-50 text-yellow-800 border-yellow-200', icon: '⚙️' },
        { label: 'Suspendidos', estado: 'SUSPENDIDO', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700 border-orange-200', icon: '⏸️' },
        { label: 'Finalizados', estado: 'FINALIZADO', color: 'bg-green-500', light: 'bg-green-50 text-green-700 border-green-200', icon: '✅' },
    ];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRegistros = registros.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(registros.length / itemsPerPage);

    const handleOpenDetail = (reg) => {
        setSelectedMaintenance(reg);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <WrenchScrewdriverIcon className="w-6 h-6 text-fnc-600" />
                            </div>
                            Mantenimientos
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Vista global de todas las hojas de vida y tickets de soporte técnico
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {cardConfig.map(c => (
                    <button
                        key={c.estado}
                        onClick={() => {
                            setFilterEstado(prev => prev === c.estado ? '' : c.estado);
                            setCurrentPage(1);
                        }}
                        className={`rounded-xl p-4 lg:p-5 text-left border transition-all duration-200 hover:shadow-md group
                            ${filterEstado === c.estado ? `${c.light} border-current shadow-sm ring-1 ring-current` : 'bg-white border-gray-100 shadow-sm'}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="bg-fnc-50/50 w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                {c.icon}
                            </div>
                            <span className={`text-2xl font-black ${filterEstado === c.estado ? '' : 'text-charcoal-900'}`}>
                                {counts[c.estado] || 0}
                            </span>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${filterEstado === c.estado ? '' : 'text-charcoal-400'}`}>{c.label}</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col xl:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por placa, descripción, caso Aranda..."
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 text-sm bg-white transition-all shadow-sm font-medium outline-none"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full xl:w-auto">
                            <div className="relative flex-1 sm:w-40">
                                <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={filterEstado}
                                    onChange={e => { setFilterEstado(e.target.value); setCurrentPage(1); }}
                                    className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fnc-500 text-xs bg-white appearance-none w-full font-black uppercase tracking-widest outline-none"
                                >
                                    <option value="">Estado</option>
                                    {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                                </select>
                            </div>
                            <div className="relative flex-1 sm:w-40">
                                <select
                                    value={filterTipo}
                                    onChange={e => { setFilterTipo(e.target.value); setCurrentPage(1); }}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fnc-500 text-xs bg-white appearance-none w-full font-black uppercase tracking-widest outline-none"
                                >
                                    <option value="">Tipo</option>
                                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            {(search || filterEstado || filterTipo) && (
                                <button
                                    onClick={() => { setSearch(''); setFilterEstado(''); setFilterTipo(''); }}
                                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors shadow-sm flex items-center justify-center"
                                    title="Limpiar filtros"
                                >
                                    <ArrowPathIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-fnc-400 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">Cargando mantenimientos...</p>
                        </div>
                    ) : registros.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/20">
                            <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">No se encontraron registros</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:block">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-charcoal-500 uppercase tracking-widest w-40">Activo</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-charcoal-500 uppercase tracking-widest w-32">Tipo / Estado</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-charcoal-500 uppercase tracking-widest">Procedimiento / Hallazgos</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-charcoal-500 uppercase tracking-widest hidden lg:table-cell w-40">Responsable</th>
                                                <th className="px-6 py-4 text-left text-[10px] font-black text-charcoal-500 uppercase tracking-widest w-28">Registro</th>
                                                <th className="px-6 py-4 text-right text-[10px] font-black text-charcoal-500 uppercase tracking-widest w-24">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {paginatedRegistros.map(reg => (
                                                <tr key={reg.id} className="hover:bg-gray-50/80 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <Link to={`/activos/${reg.activo?.id}`} className="font-black text-xs text-fnc-700 hover:text-fnc-800 transition-colors uppercase tracking-tight">
                                                                {reg.activo?.marca} {reg.activo?.modelo}
                                                            </Link>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] text-charcoal-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">P: {reg.activo?.placa}</span>
                                                                {reg.casoAranda && (
                                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">#{reg.casoAranda}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1.5">
                                                            <span className={`block w-fit rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${tipoBadge(reg.tipo)}`}>
                                                                {reg.tipo}
                                                            </span>
                                                            <span className={`block w-fit rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${estadoBadge(reg.estado)}`}>
                                                                {reg.estado?.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleOpenDetail(reg)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border border-charcoal-200 bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-600 hover:text-white hover:border-charcoal-600 transition-all shadow-sm"
                                                        >
                                                            <DocumentMagnifyingGlassIcon className="w-3 h-3" />
                                                            Ver Log completo
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 hidden lg:table-cell">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-charcoal-500">
                                                                {reg.responsable?.nombre?.charAt(0) || '?'}
                                                            </div>
                                                            <span className="text-[10px] font-black text-charcoal-600 uppercase tracking-widest truncate">{reg.responsable?.nombre || 'Sin asignar'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-charcoal-700">{new Date(reg.fecha).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            to={`/activos/${reg.activo?.id}`}
                                                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[10px] font-black bg-fnc-50 text-fnc-600 border border-fnc-100 hover:bg-fnc-600 hover:text-white hover:border-fnc-600 transition-all uppercase tracking-widest shadow-sm"
                                                        >
                                                            Gestionar
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
                                {paginatedRegistros.map(reg => (
                                    <div key={reg.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <Link to={`/activos/${reg.activo?.id}`} className="font-bold text-fnc-700 text-sm hover:underline">
                                                    {reg.activo?.marca} {reg.activo?.modelo}
                                                </Link>
                                                <p className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">Placa: {reg.activo?.placa}</p>
                                            </div>
                                            <span className={`shrink-0 inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-black uppercase border ${estadoBadge(reg.estado)}`}>
                                                {reg.estado?.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold border ${tipoBadge(reg.tipo)}`}>
                                                {reg.tipo}
                                            </span>
                                            {reg.casoAranda && (
                                                <span className="text-[10px] font-bold text-charcoal-500 bg-charcoal-50 border border-charcoal-100 rounded px-1.5 py-0.5">#{reg.casoAranda}</span>
                                            )}
                                        </div>

                                        <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed font-medium">{reg.descripcion}</p>

                                        <div className="flex justify-between items-center text-[10px] text-charcoal-400 border-t border-gray-50 pt-3 mt-1 font-bold italic">
                                            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {reg.responsable?.nombre || 'Sin asignar'}</span>
                                            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {new Date(reg.fecha).toLocaleDateString()}</span>
                                        </div>

                                        <Link
                                            to={`/activos/${reg.activo?.id}`}
                                            className="mt-2 block text-center text-xs font-black text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-100 rounded-lg px-3 py-2 transition-all shadow-sm"
                                        >
                                            VER DETALLES →
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {registros.length > 0 && (
                                <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={registros.length}
                                        itemsPerPage={itemsPerPage}
                                        currentCount={paginatedRegistros.length}
                                        onPageChange={(p) => {
                                            setCurrentPage(p);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Detalle Completo */}
            {showDetailModal && selectedMaintenance && (
                <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all border border-gray-100 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-fnc-50 p-2.5 rounded-xl border border-fnc-100">
                                    <DocumentMagnifyingGlassIcon className="w-6 h-6 text-fnc-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-charcoal-900 uppercase tracking-widest">Bitácora de Soporte</h3>
                                    <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest mt-0.5">Detalle técnico del procedimiento</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-charcoal-400 shadow-sm border border-transparent hover:border-gray-100"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            {/* Seccion 1: Activo Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-charcoal-400 uppercase tracking-widest flex items-center gap-1.5"><CpuChipIcon className="w-3 h-3" /> Equipo Intervenido</span>
                                    <p className="text-sm font-black text-fnc-700 uppercase">{selectedMaintenance.activo?.marca} {selectedMaintenance.activo?.modelo}</p>
                                    <p className="text-[10px] font-mono text-charcoal-500 font-medium">PLACA: {selectedMaintenance.activo?.placa} | ARANDA: #{selectedMaintenance.casoAranda || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 sm:text-right">
                                    <span className="text-[9px] font-black text-charcoal-400 uppercase tracking-widest flex items-center gap-1.5 sm:justify-end"><CalendarIcon className="w-3 h-3" /> Fecha del Reporte</span>
                                    <p className="text-sm font-black text-charcoal-700">{new Date(selectedMaintenance.fecha).toLocaleDateString()}</p>
                                    <div className="flex gap-2 sm:justify-end mt-1">
                                        <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${tipoBadge(selectedMaintenance.tipo)}`}>{selectedMaintenance.tipo}</span>
                                        <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${estadoBadge(selectedMaintenance.estado)}`}>{selectedMaintenance.estado?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Seccion 2: Procedimiento */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 border-l-4 border-fnc-600 pl-3">
                                    <h4 className="text-[11px] font-black text-charcoal-900 uppercase tracking-widest">Procedimiento / Hallazgos</h4>
                                </div>
                                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm leading-relaxed text-sm font-medium text-charcoal-700 whitespace-pre-line">
                                    {selectedMaintenance.descripcion || <span className="italic text-charcoal-400">Sin descripción registrada</span>}
                                </div>
                            </div>

                            {/* Seccion 3: Diagnostico */}
                            {selectedMaintenance.diagnostico && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-l-4 border-yellow-500 pl-3">
                                        <h4 className="text-[11px] font-black text-charcoal-900 uppercase tracking-widest">Diagnóstico Técnico</h4>
                                    </div>
                                    <div className="bg-yellow-50/30 border border-yellow-100 p-5 rounded-2xl leading-relaxed text-sm font-bold text-charcoal-800 italic">
                                        {selectedMaintenance.diagnostico}
                                    </div>
                                </div>
                            )}

                            {/* Seccion 4: Responsable */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-charcoal-900 flex items-center justify-center text-white font-black text-xs">
                                        {selectedMaintenance.responsable?.nombre?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest">Técnico Responsable</p>
                                        <p className="text-xs font-black text-charcoal-700 uppercase tracking-tight">{selectedMaintenance.responsable?.nombre || 'Soporte TIC'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
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
