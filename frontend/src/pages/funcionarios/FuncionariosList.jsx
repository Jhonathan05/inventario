import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { funcionariosService } from '../../api/funcionarios.service';
import { activosService } from '../../api/activos.service';
import { useAuth } from '../../context/AuthContext';
import FuncionariosForm from './FuncionariosForm';
import { getImageUrl, getAssetIconPath } from '../../lib/utils';
import { 
    UsersIcon, 
    UserPlusIcon, 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    IdentificationIcon, 
    BriefcaseIcon, 
    UserGroupIcon, 
    CheckBadgeIcon, 
    ComputerDesktopIcon, 
    AdjustmentsHorizontalIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Ícono SVG dinámico para activos sin imagen
const AssetIcon = ({ tipo, categoria }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="h-full w-full p-2.5 text-charcoal-400">
        <path strokeLinecap="round" strokeLinejoin="round"
            d={getAssetIconPath(tipo, categoria?.nombre)} />
    </svg>
);

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const FuncionariosList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Filtros avanzados
    const [filterArea, setFilterArea] = useState('');
    const [filterCargo, setFilterCargo] = useState('');
    const [filterVinculacion, setFilterVinculacion] = useState('');
    const [filterActivo, setFilterActivo] = useState('');

    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        ...(search && { search }),
        ...(filterArea && { area: filterArea }),
        ...(filterCargo && { cargo: filterCargo }),
        ...(filterVinculacion && { vinculacion: filterVinculacion }),
        ...(filterActivo !== '' && { activo: filterActivo }),
    };

    const { data: options = { areas: [], cargos: [] } } = useQuery({
        queryKey: ['funcionarios', 'options'],
        queryFn: async () => {
             const res = await funcionariosService.getOptions();
             return {
                 areas: sortList(res.areas),
                 cargos: sortList(res.cargos)
             };
        }
    });

    const { data: responseData, isLoading: loading, refetch: fetchFuncionarios } = useQuery({
        queryKey: ['funcionarios', queryParams],
        queryFn: () => funcionariosService.getAll(queryParams)
    });

    const funcionarios = responseData?.data || [];
    const pagination = responseData?.pagination || { page: 1, totalPages: 1, total: funcionarios.length };

    const clearFilters = () => {
        setFilterArea('');
        setFilterCargo('');
        setFilterVinculacion('');
        setFilterActivo('');
        setCurrentPage(1);
    };

    const activeFilterCount = [filterArea, filterCargo, filterVinculacion, filterActivo].filter(Boolean).length;

    const handleCreate = () => { setSelectedFuncionario(null); setIsModalOpen(true); };
    const handleEdit = (f) => { setSelectedFuncionario(f); setIsModalOpen(true); };
    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) fetchFuncionarios();
    };

    // Modal de activos por funcionario
    const [showEquiposModal, setShowEquiposModal] = useState(false);
    const [equiposFuncionario, setEquiposFuncionario] = useState([]);
    const [equiposLoading, setEquiposLoading] = useState(false);
    const [equiposTitulo, setEquiposTitulo] = useState('');

    const fetchEquiposFuncionario = async (f) => {
        setEquiposTitulo(f.nombre);
        setEquiposLoading(true);
        setShowEquiposModal(true);
        try {
            // Reutilizamos el endpoint de activos filtrando por funcionarioId
            const res = await activosService.getAll({ funcionarioId: f.id, limit: 100 });
            setEquiposFuncionario(Array.isArray(res) ? res.filter(a => a.estado === 'ASIGNADO') : (res.data || []).filter(a => a.estado === 'ASIGNADO'));
        } catch (err) {
            console.error('Error obteniendo equipos del funcionario', err);
        } finally {
            setEquiposLoading(false);
        }
    };

    // Logic for pagination
    const totalPages = pagination.pages || 1;
    const totalItems = pagination.total || funcionarios.length;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(indexOfFirstItem + funcionarios.length, totalItems);

    const changePage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <UsersIcon className="w-6 h-6 text-fnc-600" />
                            </div>
                            Funcionarios
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Listado y gestión del personal vinculado a la entidad ({totalItems} registros)
                        </p>
                    </div>
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-bold text-sm uppercase tracking-widest"
                        >
                            <UserPlusIcon className="w-4 h-4" />
                            Nuevo Funcionario
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, cédula, código, cargo..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 text-sm bg-white transition-all shadow-sm font-medium"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest shadow-sm border transition-all flex items-center gap-2 ${activeFilterCount > 0
                                ? 'bg-fnc-50 text-fnc-700 border-fnc-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                            Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100 shadow-inner space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Área</label>
                                    <select
                                        value={filterArea}
                                        onChange={e => setFilterArea(e.target.value)}
                                        className="block w-full rounded-lg border-gray-200 py-2 text-charcoal-800 shadow-sm focus:ring-2 focus:ring-fnc-500 text-sm px-3 bg-white font-medium"
                                    >
                                        <option value="">Todas las Áreas</option>
                                        {options.areas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Cargo</label>
                                    <select
                                        value={filterCargo}
                                        onChange={e => setFilterCargo(e.target.value)}
                                        className="block w-full rounded-lg border-gray-200 py-2 text-charcoal-800 shadow-sm focus:ring-2 focus:ring-fnc-500 text-sm px-3 bg-white font-medium"
                                    >
                                        <option value="">Todos los Cargos</option>
                                        {options.cargos.map(cargo => (
                                            <option key={cargo} value={cargo}>{cargo}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Vinculación</label>
                                    <select
                                        value={filterVinculacion}
                                        onChange={e => setFilterVinculacion(e.target.value)}
                                        className="block w-full rounded-lg border-gray-200 py-2 text-charcoal-800 shadow-sm focus:ring-2 focus:ring-fnc-500 text-sm px-3 bg-white font-medium"
                                    >
                                        <option value="">Todas</option>
                                        <option value="EMPLEADO">Empleado</option>
                                        <option value="CONTRATISTA">Contratista</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Estado</label>
                                    <select
                                        value={filterActivo}
                                        onChange={e => setFilterActivo(e.target.value)}
                                        className="block w-full rounded-lg border-gray-200 py-2 text-charcoal-800 shadow-sm focus:ring-2 focus:ring-fnc-500 text-sm px-3 bg-white font-medium"
                                    >
                                        <option value="">Todos</option>
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            {activeFilterCount > 0 && (
                                <div className="flex justify-end pt-2 border-t border-gray-50">
                                    <button onClick={clearFilters} className="text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-all uppercase tracking-widest flex items-center gap-1">
                                        <ArrowPathIcon className="w-3 h-3" /> Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-fnc-400 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">Cargando funcionarios...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Identificación</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Gestión / Área</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Vinculación</th>
                                                <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Activos</th>
                                                {canEdit && <th className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Gestión</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {funcionarios.map((f) => (
                                                <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-charcoal-800 text-sm">{f.nombre}</div>
                                                        {f.shortname && <div className="text-[10px] text-fnc-500 font-black uppercase tracking-wider">{f.shortname}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-charcoal-500 font-medium font-bold">{f.cedula}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="text-charcoal-800 font-bold text-xs uppercase tracking-tight">{f.cargo || '-'}</div>
                                                        <div className="text-charcoal-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{f.area}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {f.vinculacion ? (
                                                            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase border ${f.vinculacion === 'EMPLEADO'
                                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                                : 'bg-orange-50 text-orange-700 border-orange-100'
                                                                }`}>
                                                                {f.vinculacion}
                                                            </span>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => fetchEquiposFuncionario(f)}
                                                            className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700 hover:bg-blue-100 transition-all shadow-sm gap-1.5"
                                                        >
                                                            <ComputerDesktopIcon className="w-3 h-3" />
                                                            {f._count?.asignaciones || 0}
                                                        </button>
                                                    </td>
                                                    {canEdit && (
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleEdit(f)}
                                                                className="text-[10px] font-black text-fnc-600 hover:bg-fnc-50 px-4 py-2 rounded-lg border border-transparent hover:border-fnc-100 transition-all uppercase tracking-widest"
                                                            >
                                                                Editar
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            {funcionarios.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-20 text-center bg-gray-50/20">
                                                        <IdentificationIcon className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                                                        <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">No se encontraron funcionarios</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
                                {funcionarios.map((f) => (
                                    <div key={f.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4 hover:border-fnc-200 transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-fnc-50 flex items-center justify-center text-fnc-600 font-black text-lg border border-fnc-100 shadow-inner">
                                                    {f.nombre?.[0] || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-charcoal-900 text-sm max-w-[150px] truncate">{f.nombre}</div>
                                                    <div className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">CC: {f.cedula}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => fetchEquiposFuncionario(f)}
                                                className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-2 py-1 text-[10px] font-black text-blue-700 shadow-sm gap-1"
                                            >
                                                <ComputerDesktopIcon className="w-3.5 h-3.5" />
                                                {f._count?.asignaciones || 0}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                                            <div className="space-y-1">
                                                <p className="text-charcoal-400 uppercase tracking-widest flex items-center gap-1"><BriefcaseIcon className="w-3 h-3" /> Cargo / Área</p>
                                                <p className="text-charcoal-800 truncate">{f.cargo || '-'}</p>
                                                <p className="text-fnc-600 truncate">{f.area}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-charcoal-400 uppercase tracking-widest flex items-center gap-1 justify-end"><UserGroupIcon className="w-3 h-3" /> Vinculación</p>
                                                <div className="mt-1">
                                                    {f.vinculacion ? (
                                                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-black uppercase border font-bold ${f.vinculacion === 'EMPLEADO' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                                            {f.vinculacion}
                                                        </span>
                                                    ) : '-'}
                                                </div>
                                            </div>
                                        </div>

                                        {canEdit && (
                                            <div className="pt-3 border-t border-gray-50 flex justify-end">
                                                <button
                                                    onClick={() => handleEdit(f)}
                                                    className="w-full text-center py-2 text-[10px] font-black text-fnc-600 bg-fnc-50 rounded-lg uppercase tracking-widest hover:bg-fnc-100 transition-colors"
                                                >
                                                    Gestionar Funcionario
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {funcionarios.length === 0 && (
                                    <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
                                        <IdentificationIcon className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                                        <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">No se encontraron funcionarios</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {!loading && totalItems > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest">
                                Mostrando <span className="text-fnc-600">{indexOfFirstItem + 1} - {indexOfLastItem}</span> de <span className="text-fnc-600">{totalItems}</span>
                            </p>
                            <nav className="flex items-center gap-1" aria-label="Pagination">
                                <button
                                    onClick={() => changePage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-fnc-600 hover:border-fnc-200 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-1 px-4">
                                    <span className="text-[10px] font-black text-charcoal-800 uppercase tracking-widest">Página</span>
                                    <span className="bg-fnc-600 text-white px-2 py-0.5 rounded text-[10px] font-black">{currentPage}</span>
                                    <span className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest">de {totalPages}</span>
                                </div>
                                <button
                                    onClick={() => changePage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-fnc-600 hover:border-fnc-200 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <FuncionariosForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    funcionario={selectedFuncionario}
                />
            )}

            {/* Modal Equipos Activos del Funcionario */}
            {showEquiposModal && (
                <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 pb-20 pt-4 text-center sm:p-0">
                        <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-md transition-opacity" onClick={() => setShowEquiposModal(false)} />
                        <div className="relative bg-white border border-gray-200 rounded-2xl px-6 pt-6 pb-6 text-left shadow-2xl sm:my-8 sm:w-full sm:max-w-2xl z-10 overflow-hidden transform transition-all">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                                <div>
                                    <h3 className="text-xl font-black text-charcoal-900 flex items-center gap-2">
                                        <ComputerDesktopIcon className="w-6 h-6 text-blue-600" />
                                        Equipos Asignados
                                    </h3>
                                    <p className="text-[10px] font-black text-fnc-500 uppercase tracking-widest mt-0.5">{equiposTitulo}</p>
                                </div>
                                <button 
                                    onClick={() => setShowEquiposModal(false)} 
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {equiposLoading ? (
                                <div className="py-20 text-center">
                                    <ArrowPathIcon className="w-10 h-10 text-fnc-400 animate-spin mx-auto mb-4" />
                                    <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">Consultando inventario...</p>
                                </div>
                            ) : equiposFuncionario.length === 0 ? (
                                <div className="py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <ComputerDesktopIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">Sin equipos asignados</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                    {equiposFuncionario.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-fnc-200 transition-all hover:bg-gray-50 shadow-sm bg-white">
                                            <div className="h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                                                {getImageUrl(a.imagen)
                                                    ? <img className="h-full w-full object-cover" src={getImageUrl(a.imagen)} alt="" />
                                                    : <AssetIcon tipo={a.tipo} categoria={a.categoria} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-charcoal-900 text-sm truncate uppercase tracking-tight">{a.marca} {a.modelo}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-fnc-600 bg-fnc-50 px-2 py-0.5 rounded border border-fnc-100 uppercase">PLACA: {a.placa}</span>
                                                    <span className="text-gray-200">|</span>
                                                    <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">{a.categoria?.nombre}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-700 border border-green-100 shadow-sm uppercase tracking-widest">
                                                    <CheckBadgeIcon className="w-3 h-3" />
                                                    En Uso
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-50">
                                <button 
                                    onClick={() => setShowEquiposModal(false)} 
                                    className="px-6 py-2.5 text-sm font-black text-charcoal-600 bg-gray-100 hover:bg-gray-200 rounded-xl uppercase tracking-widest transition-all"
                                >
                                    Cerrar Vista
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FuncionariosList;
