import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { getImageUrl } from '../../lib/utils';
import ActivosForm from './ActivosForm';
import { EMPRESAS_PROPIETARIAS, ESTADOS_OPERATIVOS, TIPOS_EQUIPO } from './ActivosFormData';
import { exportToExcel } from '../../lib/exportUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ActivosList = () => {
    const [activos, setActivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivo, setSelectedActivo] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filtros avanzados
    const [filterEstado, setFilterEstado] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('');
    const [filterEstadoOp, setFilterEstadoOp] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [filterFuncionario, setFilterFuncionario] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);

    // Modal Historial
    const [showHistorial, setShowHistorial] = useState(false);
    const [historialData, setHistorialData] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);

    useEffect(() => {
        api.get('/categorias').then(res => setCategorias(res.data)).catch(() => { });
        api.get('/funcionarios').then(res => setFuncionarios(res.data)).catch(() => { });
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
            Ubicación: a.ubicacion || '',
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

        const tableColumn = ["Placa", "Serial", "Marca/Modelo", "Categoría", "Tipo", "Estado", "Ubicación", "Asignado A"];
        const tableRows = [];

        activos.forEach(a => {
            const ticketData = [
                a.placa || 'N/A',
                a.serial || 'N/A',
                `${a.marca || ''} ${a.modelo || ''}`.trim(),
                a.categoria?.nombre || 'N/A',
                a.tipo || 'N/A',
                a.estado || 'N/A',
                a.ubicacion || 'N/A',
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
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        + Nuevo
                    </button>
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
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Funcionario Asignado</label>
                            <select value={filterFuncionario} onChange={e => setFilterFuncionario(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todos</option>
                                {funcionarios.map(f => <option key={f.id} value={f.id}>{f.nombre} ({f.cedula})</option>)}
                            </select>
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
                                {EMPRESAS_PROPIETARIAS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Estado Operativo</label>
                            <select value={filterEstadoOp} onChange={e => setFilterEstadoOp(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todos</option>
                                {ESTADOS_OPERATIVOS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Equipo</label>
                            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                                <option value="">Todos</option>
                                {TIPOS_EQUIPO.map(e => <option key={e} value={e}>{e}</option>)}
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
                    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Activo</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categoría</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ubicación</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Asignado A</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {activos.map((activo) => (
                                    <tr key={activo.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={getImageUrl(activo.imagen)} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">
                                                        <Link to={`/activos/${activo.id}`} className="hover:text-indigo-600 hover:underline">
                                                            {activo.marca} {activo.modelo}
                                                        </Link>
                                                    </div>
                                                    <div className="text-gray-500">Placa: {activo.placa}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <div className="text-gray-900">{activo.categoria?.nombre}</div>
                                            <div className="text-xs text-gray-400">SN: {activo.serial}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(activo.estado)}`}>
                                                {activo.estado?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {activo.ubicacion || 'Sin ubicación'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {activo.asignaciones?.[0]?.funcionario?.nombre || 'Sin asignar'}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(activo)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {activos.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-gray-500">
                                            No se encontraron activos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                    {activos.map((activo) => (
                        <div key={activo.id} className="bg-white rounded-lg shadow ring-1 ring-black/5 p-4">
                            <div className="flex items-start gap-3">
                                <img className="h-12 w-12 rounded-lg object-cover flex-shrink-0" src={getImageUrl(activo.imagen)} alt="" />
                                <div className="flex-1 min-w-0">
                                    <Link to={`/activos/${activo.id}`} className="font-medium text-gray-900 hover:text-indigo-600 block truncate">
                                        {activo.marca} {activo.modelo}
                                    </Link>
                                    <div className="text-xs text-gray-500 mt-0.5">Placa: {activo.placa} | SN: {activo.serial}</div>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusBadge(activo.estado)}`}>
                                            {activo.estado?.replace('_', ' ')}
                                        </span>
                                        {activo.categoria?.nombre && (
                                            <span className="text-xs text-gray-500 bg-gray-100 rounded px-1.5 py-0.5">
                                                {activo.categoria.nombre}
                                            </span>
                                        )}
                                    </div>
                                    {activo.asignaciones?.[0]?.funcionario?.nombre && (
                                        <div className="text-xs text-gray-600 mt-1.5">
                                            👤 {activo.asignaciones[0].funcionario.nombre}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                                <button onClick={() => handleEdit(activo)} className="text-xs text-indigo-700 bg-indigo-50 rounded-md px-2.5 py-1.5 font-medium hover:bg-indigo-100">
                                    Editar
                                </button>
                                <Link to={`/activos/${activo.id}`} className="text-xs text-gray-700 bg-gray-100 rounded-md px-2.5 py-1.5 font-medium hover:bg-gray-200 ml-auto">
                                    Ver Detalle →
                                </Link>
                            </div>
                        </div>
                    ))}
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
