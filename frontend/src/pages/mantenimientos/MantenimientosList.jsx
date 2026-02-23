import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const ESTADOS = ['CREADO', 'EN_PROCESO', 'SUSPENDIDO', 'FINALIZADO', 'CERRADO'];
const TIPOS = ['MANTENIMIENTO', 'REPARACION', 'SUMINISTRO', 'INSPECCION', 'ACTUALIZACION'];

const estadoBadge = (estado) => {
    const map = {
        CREADO: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        EN_PROCESO: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        SUSPENDIDO: 'bg-orange-50 text-orange-700 ring-orange-600/20',
        FINALIZADO: 'bg-green-50 text-green-700 ring-green-600/20',
        CERRADO: 'bg-gray-100 text-gray-600 ring-gray-500/10',
    };
    return map[estado] || 'bg-gray-100 text-gray-500 ring-gray-500/10';
};

const tipoBadge = (tipo) => {
    const map = {
        MANTENIMIENTO: 'bg-indigo-50 text-indigo-700',
        REPARACION: 'bg-red-50 text-red-700',
        SUMINISTRO: 'bg-teal-50 text-teal-700',
        INSPECCION: 'bg-purple-50 text-purple-700',
        ACTUALIZACION: 'bg-sky-50 text-sky-700',
    };
    return map[tipo] || 'bg-gray-100 text-gray-500';
};

const MantenimientosList = () => {
    const [registros, setRegistros] = useState([]);
    const [allRegistros, setAllRegistros] = useState([]); // siempre sin filtros, para los contadores
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(t);
    }, [search]);

    const fetchRegistros = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (filterEstado) params.estado = filterEstado;
            if (filterTipo) params.tipo = filterTipo;
            const res = await api.get('/hojavida', { params });
            setRegistros(res.data);
        } catch (err) {
            console.error('Error cargando mantenimientos', err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, filterEstado, filterTipo]);

    // Carga UNA sola vez sin filtros para los contadores de las tarjetas
    useEffect(() => {
        api.get('/hojavida').then(res => setAllRegistros(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        fetchRegistros();
    }, [fetchRegistros]);

    // Counters siempre sobre el total completo (no filtrado)
    const counts = ESTADOS.reduce((acc, e) => {
        acc[e] = allRegistros.filter(r => r.estado === e).length;
        return acc;
    }, {});

    const cardConfig = [
        { label: 'Creados', estado: 'CREADO', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700', icon: '🆕' },
        { label: 'En Proceso', estado: 'EN_PROCESO', color: 'bg-yellow-400', light: 'bg-yellow-50 text-yellow-800', icon: '⚙️' },
        { label: 'Suspendidos', estado: 'SUSPENDIDO', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700', icon: '⏸️' },
        { label: 'Finalizados', estado: 'FINALIZADO', color: 'bg-green-500', light: 'bg-green-50 text-green-700', icon: '✅' },
    ];

    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mantenimientos</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Vista global de todas las hojas de vida y tickets de soporte.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {cardConfig.map(c => (
                    <button
                        key={c.estado}
                        onClick={() => setFilterEstado(prev => prev === c.estado ? '' : c.estado)}
                        className={`rounded-lg p-4 text-left shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md
                            ${filterEstado === c.estado ? `${c.light} ring-2` : 'bg-white'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{c.icon}</span>
                            <span className={`text-2xl font-bold ${filterEstado === c.estado ? '' : 'text-gray-900'}`}>
                                {counts[c.estado] || 0}
                            </span>
                        </div>
                        <p className={`text-xs font-medium ${filterEstado === c.estado ? '' : 'text-gray-500'}`}>{c.label}</p>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-black/5 p-4 mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <input
                        type="text"
                        placeholder="🔍 Buscar por placa, descripción, caso Aranda..."
                        className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        value={filterEstado}
                        onChange={e => setFilterEstado(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Estado --</option>
                        {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                    </select>
                    <select
                        value={filterTipo}
                        onChange={e => setFilterTipo(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Tipo --</option>
                        {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {(search || filterEstado || filterTipo) && (
                        <button
                            onClick={() => { setSearch(''); setFilterEstado(''); setFilterTipo(''); }}
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-2"
                        >
                            Limpiar ✕
                        </button>
                    )}
                    <span className="ml-auto text-sm text-gray-400">{registros.length} resultado{registros.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Cargando mantenimientos...</div>
            ) : registros.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm ring-1 ring-black/5 text-gray-500">
                    No se encontraron registros con los filtros actuales.
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900">Activo</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Tipo</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Estado</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Descripción</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Responsable</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Caso Aranda</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Fecha</th>
                                    <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Acción</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {registros.map(reg => (
                                    <tr key={reg.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm">
                                            <Link to={`/activos/${reg.activo?.id}`} className="font-medium text-indigo-700 hover:underline">
                                                {reg.activo?.marca} {reg.activo?.modelo}
                                            </Link>
                                            <div className="text-xs text-gray-400">Placa: {reg.activo?.placa}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm">
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tipoBadge(reg.tipo)}`}>
                                                {reg.tipo}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm">
                                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${estadoBadge(reg.estado)}`}>
                                                {reg.estado?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-sm text-gray-700 max-w-xs">
                                            <p className="truncate" title={reg.descripcion}>{reg.descripcion}</p>
                                            {reg.diagnostico && (
                                                <p className="text-xs text-gray-400 truncate" title={reg.diagnostico}>Dx: {reg.diagnostico}</p>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                            {reg.responsable?.nombre || <span className="text-gray-300 italic">Sin asignar</span>}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                            {reg.casoAranda || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                            {new Date(reg.fecha).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm">
                                            <Link
                                                to={`/activos/${reg.activo?.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                Ver Activo →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {registros.map(reg => (
                            <div key={reg.id} className="bg-white rounded-lg shadow ring-1 ring-black/5 p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <Link to={`/activos/${reg.activo?.id}`} className="font-medium text-indigo-700 text-sm hover:underline">
                                            {reg.activo?.marca} {reg.activo?.modelo}
                                        </Link>
                                        <p className="text-xs text-gray-400">Placa: {reg.activo?.placa}</p>
                                    </div>
                                    <span className={`shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${estadoBadge(reg.estado)}`}>
                                        {reg.estado?.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tipoBadge(reg.tipo)}`}>
                                        {reg.tipo}
                                    </span>
                                    {reg.casoAranda && (
                                        <span className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">#{reg.casoAranda}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{reg.descripcion}</p>
                                <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-2 mt-1">
                                    <span>{reg.responsable?.nombre || 'Sin responsable'}</span>
                                    <span>{new Date(reg.fecha).toLocaleDateString()}</span>
                                </div>
                                <Link
                                    to={`/activos/${reg.activo?.id}`}
                                    className="mt-2 block text-center text-xs text-indigo-700 bg-indigo-50 rounded-md px-2 py-1.5 font-medium hover:bg-indigo-100"
                                >
                                    Ver Activo →
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MantenimientosList;
