import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import FuncionariosForm from './FuncionariosForm';

const FuncionariosList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'TECNICO';

    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [options, setOptions] = useState({ areas: [], cargos: [] });

    // Filtros avanzados
    const [filterArea, setFilterArea] = useState('');
    const [filterCargo, setFilterCargo] = useState('');
    const [filterVinculacion, setFilterVinculacion] = useState('');
    const [filterActivo, setFilterActivo] = useState('');

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        fetchFuncionarios();
    }, [search, filterArea, filterCargo, filterVinculacion, filterActivo]);

    const fetchOptions = async () => {
        try {
            const res = await api.get('/funcionarios/opciones');
            setOptions(res.data);
        } catch (error) {
            console.error('Error fetching filter options', error);
        }
    };

    const fetchFuncionarios = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (filterArea) params.area = filterArea;
            if (filterCargo) params.cargo = filterCargo;
            if (filterVinculacion) params.vinculacion = filterVinculacion;
            if (filterActivo !== '') params.activo = filterActivo;

            const response = await api.get('/funcionarios', { params });
            setFuncionarios(response.data);
        } catch (error) {
            console.error('Error fetching funcionarios', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilterArea('');
        setFilterCargo('');
        setFilterVinculacion('');
        setFilterActivo('');
    };

    const activeFilterCount = [filterArea, filterCargo, filterVinculacion, filterActivo].filter(Boolean).length;

    const handleCreate = () => { setSelectedFuncionario(null); setIsModalOpen(true); };
    const handleEdit = (f) => { setSelectedFuncionario(f); setIsModalOpen(true); };
    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) fetchFuncionarios();
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
                    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cédula</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cód. Personal</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cargo / Área</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vinculación</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Activos</th>
                                    {canEdit && (
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Acciones</span>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {funcionarios.map((f) => (
                                    <tr key={f.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                            <div className="font-medium text-gray-900">{f.nombre}</div>
                                            {f.shortname && <div className="text-xs text-gray-400">{f.shortname}</div>}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{f.cedula}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{f.codigoPersonal || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="text-gray-900">{f.cargo || '-'}</div>
                                            <div className="text-gray-500 text-xs">{f.area}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {f.vinculacion ? (
                                                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${f.vinculacion === 'EMPLEADO'
                                                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                    : 'bg-orange-50 text-orange-700 ring-orange-600/20'
                                                    }`}>
                                                    {f.vinculacion}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {f._count?.asignaciones || 0} equipos
                                            </span>
                                        </td>
                                        {canEdit && (
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => handleEdit(f)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {funcionarios.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="py-10 text-center text-gray-500">
                                            No se encontraron funcionarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                        <div key={f.id} className="bg-white rounded-lg shadow ring-1 ring-black/5 p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                                        {f.nombre?.[0] || '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{f.nombre}</div>
                                        <div className="text-xs text-gray-500">CC: {f.cedula}</div>
                                        {f.shortname && <div className="text-xs text-gray-400">{f.shortname}</div>}
                                    </div>
                                </div>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 flex-shrink-0">
                                    {f._count?.asignaciones || 0} equipos
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                                {f.cargo && <span>{f.cargo}</span>}
                                {f.cargo && f.area && <span className="text-gray-300">·</span>}
                                {f.area && <span className="text-gray-500 text-xs">{f.area}</span>}
                            </div>

                            {f.vinculacion && (
                                <div className="mt-1.5">
                                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${f.vinculacion === 'EMPLEADO'
                                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                                        : 'bg-orange-50 text-orange-700 ring-orange-600/20'
                                        }`}>
                                        {f.vinculacion}
                                    </span>
                                </div>
                            )}

                            {canEdit && (
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => handleEdit(f)}
                                        className="text-xs text-indigo-700 bg-indigo-50 rounded-md px-3 py-1.5 font-medium hover:bg-indigo-100"
                                    >
                                        Editar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <FuncionariosForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    funcionario={selectedFuncionario}
                />
            )}
        </div>
    );
};

export default FuncionariosList;
