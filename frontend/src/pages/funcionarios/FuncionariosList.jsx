import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { funcionariosService } from '../../api/funcionarios.service';
import { activosService } from '../../api/activos.service';
import { useAuth } from '../../context/AuthContext';
import FuncionariosForm from './FuncionariosForm';
import { getImageUrl, getAssetIconPath } from '../../lib/utils';
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
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Funcionarios</h1>
                    <p className="mt-1 text-sm text-gray-700">
                        Listado de personal ({funcionarios.length} registros)
                    </p>
                </div>
                {canEdit && (
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        + Nuevo Funcionario
                    </button>
                )}
            </div>

            {/* Buscador + Toggle Filtros */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, cédula, código, cargo, área..."
                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm px-3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-colors ${activeFilterCount > 0
                        ? 'bg-indigo-50 text-indigo-700 ring-indigo-300'
                        : 'bg-white text-gray-700 ring-gray-300 hover:bg-gray-50'
                        }`}
                >
                    🔽 Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                </button>
            </div>

            {/* Panel de Filtros Avanzados */}
            {showFilters && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Área</label>
                            <select
                                value={filterArea}
                                onChange={e => setFilterArea(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2"
                            >
                                <option value="">Todas</option>
                                {options.areas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Cargo</label>
                            <select
                                value={filterCargo}
                                onChange={e => setFilterCargo(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2"
                            >
                                <option value="">Todos</option>
                                {options.cargos.map(cargo => (
                                    <option key={cargo} value={cargo}>{cargo}</option>
                                ))}
                            </select>

                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Vinculación</label>
                            <select
                                value={filterVinculacion}
                                onChange={e => setFilterVinculacion(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2"
                            >
                                <option value="">Todas</option>
                                <option value="EMPLEADO">Empleado</option>
                                <option value="CONTRATISTA">Contratista</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                            <select
                                value={filterActivo}
                                onChange={e => setFilterActivo(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2"
                            >
                                <option value="">Todos</option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    {activeFilterCount > 0 && (
                        <div className="mt-3 flex justify-end">
                            <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                ✕ Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div className="mt-8 text-center text-gray-500 py-10">Cargando funcionarios...</div>
            )}

            {/* Desktop Table */}
            {!loading && (
                <div className="mt-6 hidden md:block">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cód. Personal</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo / Área</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vinculación</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activos</th>
                                        {canEdit && (
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {funcionarios.map((f) => (
                                        <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-charcoal-800">{f.nombre}</div>
                                                {f.shortname && <div className="text-xs text-charcoal-400 font-medium">{f.shortname}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-charcoal-500 font-medium">{f.cedula}</td>
                                            <td className="px-6 py-4 text-sm text-charcoal-500">{f.codigoPersonal || '-'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="text-charcoal-800 font-bold">{f.cargo || '-'}</div>
                                                <div className="text-charcoal-500 text-xs font-medium mt-0.5">{f.area}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {f.vinculacion ? (
                                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ${f.vinculacion === 'EMPLEADO'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-orange-50 text-orange-700 border-orange-200'
                                                        }`}>
                                                        {f.vinculacion}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => fetchEquiposFuncionario(f)}
                                                    className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-black text-blue-700 hover:bg-blue-100 transition-colors shadow-sm gap-1"
                                                >
                                                    {f._count?.asignaciones || 0} equipos
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                            </td>
                                            {canEdit && (
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(f)}
                                                        className="inline-flex items-center justify-center text-xs font-bold text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-200 rounded-lg px-4 py-2 transition-colors shadow-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {funcionarios.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-charcoal-400 font-medium">
                                                No se encontraron funcionarios con los filtros actuales.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Cards */}
            {!loading && (
                <div className="mt-4 md:hidden space-y-3">
                    {funcionarios.length === 0 && (
                        <div className="py-10 text-center text-gray-500 bg-white rounded-lg shadow">
                            No se encontraron funcionarios.
                        </div>
                    )}
                    {funcionarios.map((f) => (
                        <div key={f.id} className="glass p-4 rounded-2xl border border-charcoal-100 shadow-sm hover:border-fnc-200 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-charcoal-100 flex items-center justify-center text-charcoal-600 font-bold text-lg flex-shrink-0 group-hover:bg-fnc-100 group-hover:text-fnc-700 transition-colors shadow-sm">
                                        {f.nombre?.[0] || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-charcoal-800 truncate text-base">{f.nombre}</div>
                                        <div className="text-xs text-charcoal-500 font-medium select-all">CC: <span className="text-charcoal-700">{f.cedula}</span></div>
                                        {f.shortname && <div className="text-xs text-fnc-600 font-medium mt-0.5">{f.shortname}</div>}
                                    </div>
                                </div>
                                <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-black text-blue-700 flex-shrink-0 shadow-sm mt-1">
                                    {f._count?.asignaciones || 0} eqs
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-charcoal-600 font-medium">
                                {f.cargo && <span className="bg-charcoal-50 border border-charcoal-100 px-2.5 py-1 rounded-lg shadow-sm">{f.cargo}</span>}
                                {f.area && <span className="bg-charcoal-50 border border-charcoal-100 px-2.5 py-1 rounded-lg text-charcoal-500 shadow-sm">{f.area}</span>}
                            </div>

                            {f.vinculacion && (
                                <div className="mt-3">
                                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ${f.vinculacion === 'EMPLEADO'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : 'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                        {f.vinculacion}
                                    </span>
                                </div>
                            )}

                            {canEdit && (
                                <div className="mt-4 pt-4 border-t border-charcoal-100 flex justify-between">
                                    <button
                                        onClick={() => fetchEquiposFuncionario(f)}
                                        className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 font-bold hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-1"
                                    >
                                        {f._count?.asignaciones || 0} equipos
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(f)}
                                        className="text-xs text-fnc-600 bg-white border border-fnc-200 rounded-lg px-4 py-2 font-bold hover:bg-fnc-50 transition-colors shadow-sm"
                                    >
                                        Editar
                                    </button>
                                </div>
                            )}
                            {!canEdit && f._count?.asignaciones > 0 && (
                                <div className="mt-4 pt-4 border-t border-charcoal-100">
                                    <button
                                        onClick={() => fetchEquiposFuncionario(f)}
                                        className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 font-bold hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-1"
                                    >
                                        {f._count?.asignaciones || 0} equipos
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Component */}
            {!loading && funcionarios.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow mb-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{indexOfLastItem}</span> de <span className="font-medium">{totalItems}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => changePage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Anterior</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <button
                                    onClick={() => changePage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                    {/* Controles para móviles */}
                    <div className="flex flex-1 justify-between sm:hidden w-full">
                        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            Anterior
                        </button>
                        <span className="text-sm text-gray-700 mt-2">
                            Pág. {currentPage} / {totalPages}
                        </span>
                        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="relative ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

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
                        <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={() => setShowEquiposModal(false)} />
                        <div className="relative glass border border-charcoal-100 rounded-2xl px-6 pt-6 pb-6 text-left shadow-2xl sm:my-8 sm:w-full sm:max-w-2xl z-10">
                            <div className="flex justify-between items-center mb-5">
                                <div>
                                    <h3 className="text-lg font-black text-charcoal-800">Equipos Asignados</h3>
                                    <p className="text-sm text-charcoal-500 font-medium">{equiposTitulo}</p>
                                </div>
                                <button onClick={() => setShowEquiposModal(false)} className="text-charcoal-400 hover:text-charcoal-600 text-2xl leading-none font-bold">&times;</button>
                            </div>

                            {equiposLoading ? (
                                <div className="py-12 text-center text-charcoal-400 font-medium">Cargando equipos...</div>
                            ) : equiposFuncionario.length === 0 ? (
                                <div className="py-12 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-charcoal-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <p className="text-charcoal-400 font-medium text-sm">Sin equipos actualmente asignados</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                    {equiposFuncionario.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 p-3 border border-charcoal-100 rounded-xl hover:border-fnc-200 transition-colors">
                                            <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-100">
                                                {getImageUrl(a.imagen)
                                                    ? <img className="h-12 w-12 object-cover" src={getImageUrl(a.imagen)} alt="" />
                                                    : <AssetIcon tipo={a.tipo} categoria={a.categoria} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-charcoal-800 truncate">{a.marca} {a.modelo}</div>
                                                <div className="text-xs text-charcoal-500 font-medium">Placa: <span className="text-charcoal-700">{a.placa}</span> · {a.categoria?.nombre}</div>
                                            </div>
                                            <span className="text-[10px] font-black text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg uppercase tracking-wider flex-shrink-0">
                                                Asignado
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 flex justify-end">
                                <button onClick={() => setShowEquiposModal(false)} className="glass border border-charcoal-100 rounded-xl px-5 py-2 text-sm font-bold text-charcoal-700 hover:border-charcoal-200 transition-colors">
                                    Cerrar
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
