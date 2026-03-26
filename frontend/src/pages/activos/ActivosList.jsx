import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, getAssetIconPath } from '../../lib/utils';
import ActivosForm from './ActivosForm';
import { exportToExcel } from '../../lib/exportUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Ícono SVG dinámico por tipo de activo (fallback cuando no hay imagen)
const AssetIcon = ({ tipo, categoria, className = 'h-full w-full p-2.5 text-charcoal-400' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className={className}>
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

const ActivosList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivo, setSelectedActivo] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Filtros avanzados
    const [filterEstado, setFilterEstado] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('');
    const [filterEstadoOp, setFilterEstadoOp] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [filterFuncionario, setFilterFuncionario] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [catalogs, setCatalogs] = useState({ EMPRESA_PROPIETARIA: [], ESTADO_OPERATIVO: [], TIPO_EQUIPO: [] });
    const [searchFuncionarioText, setSearchFuncionarioText] = useState('');
    const [showFuncionarioDropdown, setShowFuncionarioDropdown] = useState(false);

    // Modal Historial
    const [showHistorial, setShowHistorial] = useState(false);
    const [historialData, setHistorialData] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);

    useEffect(() => {
        api.get('/categorias').then(res => setCategorias(sortList(res.data))).catch(() => { });
        api.get('/funcionarios').then(res => setFuncionarios(sortList(res.data))).catch(() => { });
        api.get('/catalogos').then(res => {
            const grouped = res.data.reduce((acc, curr) => {
                if (!acc[curr.dominio]) acc[curr.dominio] = [];
                acc[curr.dominio].push(curr.valor);
                return acc;
            }, {});
            setCatalogs({
                EMPRESA_PROPIETARIA: sortList(grouped['EMPRESA_PROPIETARIA'] || []),
                ESTADO_OPERATIVO: sortList(grouped['ESTADO_OPERATIVO'] || []),
                TIPO_EQUIPO: sortList(grouped['TIPO_EQUIPO'] || [])
            });
        }).catch(() => { });
    }, []);

    useEffect(() => {
        fetchActivos();
    }, [search, filterEstado, filterEmpresa, filterEstadoOp, filterTipo, filterFuncionario]);

    const fetchActivos = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (filterEstado) params.estado = filterEstado;
            if (filterEmpresa) params.empresaPropietaria = filterEmpresa;
            if (filterEstadoOp) params.estadoOperativo = filterEstadoOp;
            if (filterTipo) params.tipo = filterTipo;
            if (filterFuncionario) params.funcionarioId = filterFuncionario;

            const response = await api.get('/activos', { params });
            setActivos(response.data);
            setCurrentPage(1); // Reset page on new fetch
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




    const clearFilters = () => {
        setFilterEstado('');
        setFilterEmpresa('');
        setFilterEstadoOp('');
        setFilterTipo('');
        setFilterFuncionario('');
        setSearchFuncionarioText('');
    };

    const activeFilterCount = [filterEstado, filterEmpresa, filterEstadoOp, filterTipo, filterFuncionario].filter(Boolean).length;

    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) {
            fetchActivos();
        }
    };

    const getStatusBadge = (estado) => {
        const colors = {
            'DISPONIBLE': 'bg-green-50 text-green-700 ring-green-600/20',
            'ASIGNADO': 'bg-blue-50 text-blue-700 ring-blue-700/10',
            'EN_MANTENIMIENTO': 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
            'DADO_DE_BAJA': 'bg-red-50 text-red-700 ring-red-600/20',
        };
        return colors[estado] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
    };

    // Funciones de Reportes
    const handleExportExcel = () => {
        if (!activos.length) return;
        const data = activos.map(a => ({
            Placa: a.placa || '',
            Serial: a.serial || '',
            Marca: a.marca || '',
            Modelo: a.modelo || '',
            Categoría: a.categoria?.nombre || '',
            TipoEquipo: a.tipo || '',
            Estado: a.estado || '',
            EstadoOperativo: a.estadoOperativo || '',
            'Ubicación y Piso': a.ubicacion || (a.asignaciones?.[0]?.funcionario?.ubicacion ? 
                `${a.asignaciones[0].funcionario.ubicacion}${a.asignaciones[0].funcionario.piso ? ` - Piso ${a.asignaciones[0].funcionario.piso}` : ''}` 
                : 'Sin Ubicación'),
            Funcionario_Asignado: a.asignaciones?.[0]?.funcionario?.nombre || 'Sin Asignar',
            Cédula_Funcionario: a.asignaciones?.[0]?.funcionario?.cedula || '',
        }));
        exportToExcel(data, `Reporte_Activos_${new Date().toISOString().split('T')[0]}`);
    };

    const handleExportPDF = () => {
        if (!activos.length) return;
        const doc = new jsPDF('landscape');

        let headerText = 'Reporte General de Activos';
        if (filterFuncionario) {
            const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre;
            headerText = `Reporte de Activos Asignados a: ${funcName || 'Funcionario'}`;
        }

        doc.setFontSize(14);
        doc.text(headerText, 14, 15);
        doc.setFontSize(10);
        doc.text(`Total Resultados: ${activos.length}`, 14, 22);

        const tableColumn = ["Placa", "Serial", "Marca/Modelo", "Categoría", "Tipo", "Estado", "Ubicación y Piso", "Asignado A"];
        const tableRows = [];

        activos.forEach(a => {
            const ticketData = [
                a.placa || 'N/A',
                a.serial || 'N/A',
                `${a.marca || ''} ${a.modelo || ''}`.trim(),
                a.categoria?.nombre || 'N/A',
                a.tipo || 'N/A',
                a.estado || 'N/A',
                a.ubicacion || (a.asignaciones?.[0]?.funcionario?.ubicacion ? 
                    `${a.asignaciones[0].funcionario.ubicacion}${a.asignaciones[0].funcionario.piso ? ` - Piso ${a.asignaciones[0].funcionario.piso}` : ''}` 
                    : 'N/A'),
                a.asignaciones?.[0]?.funcionario?.nombre || 'N/A'
            ];
            tableRows.push(ticketData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo-600
        });

        doc.save(`Activos_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleViewHistorial = async () => {
        if (!filterFuncionario) return;
        setHistorialLoading(true);
        setShowHistorial(true);
        try {
            const res = await api.get(`/activos/historial/${filterFuncionario}`);
            setHistorialData(res.data);
        } catch (err) {
            console.error("Error obteniendo historial", err);
        } finally {
            setHistorialLoading(false);
        }
    };

    const handleExportHistorialExcel = () => {
        if (!historialData.length) return;
        const exportData = historialData.map(asig => ({
            'Fecha Inicio': new Date(asig.fechaInicio).toLocaleDateString(),
            'Fecha Fin / Devolución': asig.fechaFin ? new Date(asig.fechaFin).toLocaleDateString() : 'Actual (Vigente)',
            'Movimiento': asig.tipo,
            'Activo (Equipo)': `${asig.activo?.marca || ''} ${asig.activo?.modelo || ''}`.trim() || 'N/A',
            'Placa': asig.activo?.placa || 'N/A',
            'Serial': asig.activo?.serial || 'N/A',
            'Observaciones': asig.observaciones || '-'
        }));

        const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre || 'Funcionario';
        exportToExcel(exportData, `Historial_Activos_${funcName.replace(/\s+/g, '_')}`);
    };

    const handleExportHistorialPDF = () => {
        if (!historialData.length) return;
        const doc = new jsPDF('landscape');

        const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre || 'Funcionario';
        const headerText = `Historial Completo de Activos — ${funcName}`;

        doc.setFontSize(14);
        doc.text(headerText, 14, 15);
        doc.setFontSize(10);
        doc.text(`Total Movimientos: ${historialData.length}`, 14, 22);

        const tableColumn = ["Fecha Inicio", "Fecha Fin", "Movimiento", "Equipo", "Placa", "Observaciones"];
        const tableRows = [];

        historialData.forEach(asig => {
            const rowData = [
                new Date(asig.fechaInicio).toLocaleDateString(),
                asig.fechaFin ? new Date(asig.fechaFin).toLocaleDateString() : 'Actual (Vigente)',
                asig.tipo || 'N/A',
                `${asig.activo?.marca || ''} ${asig.activo?.modelo || ''}`.trim() || 'N/A',
                asig.activo?.placa || 'N/A',
                asig.observaciones || '-'
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo-600
        });

        doc.save(`Historial_Activos_${funcName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activos.length / itemsPerPage);

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Activos Tecnológicos</h1>
                    <p className="mt-1 text-sm text-gray-700">
                        Inventario completo de equipos ({activos.length} resultados)
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {activos.length > 0 && (
                        <>
                            <button onClick={handleExportExcel} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm">
                                📊 Excel
                            </button>
                            <button onClick={handleExportPDF} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 shadow-sm">
                                📄 PDF
                            </button>
                        </>
                    )}
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            + Nuevo
                        </button>
                    )}
                </div>
            </div>

            {/* Search + Filters Toggle */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar por placa, serial, marca, modelo, funcionario..."
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

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Funcionario Asignado</label>
                            <input
                                type="text"
                                placeholder="Buscar funcionario..."
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2"
                                value={searchFuncionarioText}
                                onChange={(e) => {
                                    setSearchFuncionarioText(e.target.value);
                                    setShowFuncionarioDropdown(true);
                                    if (!e.target.value) setFilterFuncionario('');
                                }}
                                onFocus={() => setShowFuncionarioDropdown(true)}
                                onBlur={() => setTimeout(() => setShowFuncionarioDropdown(false), 200)}
                            />
                            {showFuncionarioDropdown && searchFuncionarioText && (
                                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {funcionarios.filter(f => f.nombre.toLowerCase().includes(searchFuncionarioText.toLowerCase()) || f.cedula?.includes(searchFuncionarioText)).map(f => (
                                        <li
                                            key={f.id}
                                            className="cursor-pointer select-none py-2 pl-3 pr-4 hover:bg-indigo-50 text-gray-900 relative border-b border-gray-100 last:border-0"
                                            onClick={() => {
                                                setFilterFuncionario(f.id.toString());
                                                setSearchFuncionarioText(f.nombre);
                                                setShowFuncionarioDropdown(false);
                                            }}
                                        >
                                            <span className="block truncate font-medium">{f.nombre}</span>
                                            <span className="block truncate text-xs text-gray-500">CC: {f.cedula}</span>
                                        </li>
                                    ))}
                                    {funcionarios.filter(f => f.nombre.toLowerCase().includes(searchFuncionarioText.toLowerCase()) || f.cedula?.includes(searchFuncionarioText)).length === 0 && (
                                        <li className="cursor-default select-none py-2 pl-3 pr-4 text-gray-500">Sin resultados</li>
                                    )}
                                </ul>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todos</option>
                                <option value="DISPONIBLE">Disponible</option>
                                <option value="ASIGNADO">Asignado</option>
                                <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
                                <option value="DADO_DE_BAJA">Dado de Baja</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Empresa Propietaria</label>
                            <select value={filterEmpresa} onChange={e => setFilterEmpresa(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todas</option>
                                {catalogs.EMPRESA_PROPIETARIA.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Estado Operativo</label>
                            <select value={filterEstadoOp} onChange={e => setFilterEstadoOp(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todos</option>
                                {catalogs.ESTADO_OPERATIVO.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Equipo</label>
                            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todos</option>
                                {catalogs.TIPO_EQUIPO.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                    </div>

                    {filterFuncionario && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                            <button onClick={handleViewHistorial} className="text-sm rounded-md bg-blue-50 text-blue-700 px-4 py-2 ring-1 ring-blue-600/20 hover:bg-blue-100 font-medium">
                                🕒 Ver Historial General del Funcionario
                            </button>
                        </div>
                    )}

                    {activeFilterCount > 0 && (
                        <div className="mt-3 flex justify-end">
                            <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                ✕ Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="mt-8 text-center text-gray-500 py-10">Cargando activos...</div>
            )}

            {/* Desktop Table (hidden on mobile) */}
            {!loading && (
                <div className="mt-6 hidden md:block">
                    <div className="glass overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-charcoal-50 border-b border-charcoal-100 text-sm uppercase tracking-wider text-charcoal-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-bold">Activo</th>
                                        <th scope="col" className="px-6 py-4 font-bold">Categoría</th>
                                        <th scope="col" className="px-6 py-4 font-bold">Estado</th>
                                        <th scope="col" className="px-6 py-4 font-bold">Ubicación y Piso</th>
                                        <th scope="col" className="px-6 py-4 font-bold">Asignado A</th>
                                        {canEdit && (
                                            <th scope="col" className="px-6 py-4 font-bold text-right">
                                                Acciones
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-charcoal-100 bg-transparent">
                                    {currentItems.map((activo) => (
                                        <tr key={activo.id} className="hover:bg-fnc-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-100 shadow-sm">
                                                        {getImageUrl(activo.imagen)
                                                            ? <img className="h-12 w-12 object-cover" src={getImageUrl(activo.imagen)} alt="" />
                                                            : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-charcoal-800">
                                                            <Link to={`/activos/${activo.id}`} className="hover:text-fnc-600 transition-colors">
                                                                {activo.marca} {activo.modelo}
                                                            </Link>
                                                        </div>
                                                        <div className="text-sm text-charcoal-500 font-medium">
                                                            P: <span className="text-charcoal-700">{activo.placa}</span> | 
                                                            AF: <span className="text-charcoal-700">{activo.activoFijo || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="text-charcoal-800 font-bold">{activo.categoria?.nombre}</div>
                                                <div className="text-xs text-charcoal-400 font-medium mt-0.5">SN: {activo.serial}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ${getStatusBadge(activo.estado)}`}>
                                                    {activo.estado?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-charcoal-600 font-medium whitespace-nowrap">
                                                {activo.ubicacion || (activo.asignaciones?.[0]?.funcionario?.ubicacion ? 
                                                    `${activo.asignaciones[0].funcionario.ubicacion}${activo.asignaciones[0].funcionario.piso ? ` - Piso ${activo.asignaciones[0].funcionario.piso}` : ''}` 
                                                    : <span className="text-charcoal-400 font-medium italic">Sin ubicación</span>)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-charcoal-800 font-bold whitespace-nowrap">
                                                {activo.asignaciones?.[0]?.funcionario?.nombre || <span className="text-charcoal-400 font-medium italic">Sin asignar</span>}
                                            </td>
                                            {canEdit && (
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(activo)}
                                                        className="inline-flex items-center justify-center text-xs font-bold text-fnc-600 bg-fnc-50 hover:bg-fnc-100 border border-fnc-200 rounded-lg px-4 py-2 transition-colors shadow-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {activos.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-charcoal-400 font-medium">
                                                No se encontraron activos con los filtros actuales.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Cards (visible only on mobile) */}
            {!loading && (
                <div className="mt-4 md:hidden space-y-3">
                    {activos.length === 0 && (
                        <div className="py-10 text-center text-gray-500 bg-white rounded-lg shadow">
                            No se encontraron activos.
                        </div>
                    )}
                    {currentItems.map((activo) => (
                        <div key={activo.id} className="glass p-4 rounded-2xl border border-charcoal-100 shadow-sm hover:border-fnc-200 transition-all group">
                            <div className="flex items-start gap-3">
                                <div className="h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-100 shadow-sm group-hover:shadow-md transition-shadow">
                                    {getImageUrl(activo.imagen)
                                        ? <img className="h-14 w-14 object-cover" src={getImageUrl(activo.imagen)} alt="" />
                                        : <AssetIcon tipo={activo.tipo} categoria={activo.categoria} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/activos/${activo.id}`} className="font-bold text-charcoal-800 hover:text-fnc-600 block truncate transition-colors text-base">
                                        {activo.marca} {activo.modelo}
                                    </Link>
                                    <div className="text-xs text-charcoal-500 mt-1 font-medium select-all">Placa: <span className="text-charcoal-700">{activo.placa}</span> | SN: <span className="text-charcoal-700">{activo.serial}</span></div>
                                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                        <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider uppercase border border-opacity-50 ${getStatusBadge(activo.estado)}`}>
                                            {activo.estado?.replace('_', ' ')}
                                        </span>
                                        {activo.categoria?.nombre && (
                                            <span className="text-[10px] font-bold text-charcoal-600 bg-charcoal-50 border border-charcoal-200 uppercase tracking-wider rounded-lg px-2.5 py-1 shadow-sm">
                                                {activo.categoria.nombre}
                                            </span>
                                        )}
                                    </div>
                                    {activo.asignaciones?.[0]?.funcionario?.nombre && (
                                        <div className="text-xs text-fnc-700 font-semibold mt-3 flex items-center gap-1.5 bg-fnc-50 px-2.5 py-1.5 rounded-lg border border-fnc-100 shadow-sm inline-flex max-w-full">
                                            <span className="shrink-0 text-fnc-500">👤</span> <span className="truncate">{activo.asignaciones[0].funcionario.nombre}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-charcoal-100">
                                {canEdit && (
                                    <button onClick={() => handleEdit(activo)} className="text-xs text-fnc-600 bg-white border border-fnc-200 rounded-lg px-4 py-2 font-bold hover:bg-fnc-50 transition-colors shadow-sm">
                                        Editar
                                    </button>
                                )}
                                <Link to={`/activos/${activo.id}`} className="text-xs text-charcoal-700 bg-white border border-charcoal-200 rounded-lg px-4 py-2 font-bold hover:bg-charcoal-50 transition-colors shadow-sm ml-auto flex items-center gap-1 group/btn">
                                    Ver Detalle <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Componente de Paginación */}
            {!loading && activos.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a <span className="font-medium">{Math.min(indexOfLastItem, activos.length)}</span> de <span className="font-medium">{activos.length}</span> resultados
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
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
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
                    {/* Controles simples para móviles */}
                    <div className="flex flex-1 justify-between sm:hidden w-full">
                        <button
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-700 mt-2">
                            Pág. {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative ml-auto inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <ActivosForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    activo={selectedActivo}
                />
            )}

            {/* Modal Historial de Funcionario */}
            {showHistorial && (
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowHistorial(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                            <div className="flex justify-between items-center mb-5 gap-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                                    Historial Completo de Activos — {funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre}
                                </h3>
                                <div className="flex items-center gap-3 shrink-0">
                                    {historialData.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleExportHistorialExcel}
                                                className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-md mx-1 hover:bg-green-100 flex items-center shadow-sm border border-green-200"
                                                title="Exportar a Excel"
                                            >
                                                📊 Excel
                                            </button>
                                            <button
                                                onClick={handleExportHistorialPDF}
                                                className="text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-md mx-1 hover:bg-red-100 flex items-center shadow-sm border border-red-200"
                                                title="Exportar a PDF"
                                            >
                                                📄 PDF
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => setShowHistorial(false)} className="text-gray-400 hover:text-gray-500 text-2xl font-bold ml-2 leading-none" title="Cerrar">&times;</button>
                                </div>
                            </div>

                            {historialLoading ? (
                                <p className="text-center text-gray-500 py-10">Cargando historial...</p>
                            ) : historialData.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">El funcionario no tiene un historial de activos registrado.</p>
                            ) : (
                                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg max-h-96">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900">Fecha Inicio</th>
                                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Fecha Fin / Devolución</th>
                                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Movimiento</th>
                                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Equipo</th>
                                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-900">Observaciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {historialData.map((asig) => (
                                                <tr key={asig.id} className={!asig.fechaFin ? "bg-green-50/30" : ""}>
                                                    <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm text-gray-900">
                                                        {new Date(asig.fechaInicio).toLocaleDateString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 font-medium">
                                                        {asig.fechaFin ? new Date(asig.fechaFin).toLocaleDateString() : <span className="text-green-600">Actual (Vigente)</span>}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                            {asig.tipo}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                                                        <Link to={`/activos/${asig.activoId}`} onClick={() => setShowHistorial(false)} className="hover:text-indigo-600 underline">
                                                            {asig.activo?.marca} {asig.activo?.modelo}
                                                        </Link>
                                                        <br />
                                                        <span className="text-xs text-gray-500">Placa: {asig.activo?.placa}</span>
                                                    </td>
                                                    <td className="px-3 py-3 text-sm text-gray-500 max-w-xs truncate" title={asig.observaciones}>
                                                        {asig.observaciones || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="mt-5 flex justify-end">
                                <button onClick={() => setShowHistorial(false)} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
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

export default ActivosList;
