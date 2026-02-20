import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../lib/axios';
import { exportToExcel } from '../../lib/exportUtils';
import { REPORT_TYPES, REPORT_COLUMNS, transformData } from './reportConfigs';
import { EMPRESAS_PROPIETARIAS, ESTADOS_OPERATIVOS, TIPOS_EQUIPO } from '../activos/ActivosFormData';

const Reportes = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [columns, setColumns] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [statsData, setStatsData] = useState(null);
    // Perfiles
    const [perfiles, setPerfiles] = useState([]);
    const [selectedPerfil, setSelectedPerfil] = useState(null);
    const [showPerfilModal, setShowPerfilModal] = useState(false);
    const [editingPerfil, setEditingPerfil] = useState(null);
    const [perfilForm, setPerfilForm] = useState({ nombre: '', descripcion: '' });
    const [perfilError, setPerfilError] = useState('');

    // Cargar perfiles al seleccionar un reporte
    const fetchPerfiles = useCallback(async (tipoReporte) => {
        try {
            const res = await api.get('/reportes/perfiles', { params: { tipoReporte } });
            setPerfiles(res.data);
            // Seed CMDB if no profiles exist
            if (res.data.length === 0 && tipoReporte === 'inventario') {
                await api.post('/reportes/perfiles/seed');
                const res2 = await api.get('/reportes/perfiles', { params: { tipoReporte } });
                setPerfiles(res2.data);
            }
        } catch (err) {
            console.error('Error cargando perfiles:', err);
        }
    }, []);

    // Inicializar columnas al seleccionar un reporte
    useEffect(() => {
        if (selectedReport && REPORT_COLUMNS[selectedReport.id]) {
            const cols = REPORT_COLUMNS[selectedReport.id].map(c => ({ ...c, selected: c.default }));
            setColumns(cols);
            setRawData([]);
            setFilters({});
            setStatsData(null);
            setSelectedPerfil(null);
            fetchPerfiles(selectedReport.id);
        }
    }, [selectedReport, fetchPerfiles]);

    const selectedColumns = useMemo(() => columns.filter(c => c.selected), [columns]);
    const groups = useMemo(() => {
        const g = {};
        columns.forEach(col => {
            if (!g[col.group]) g[col.group] = [];
            g[col.group].push(col);
        });
        return g;
    }, [columns]);

    const toggleColumn = (key) => {
        setColumns(prev => prev.map(c => c.key === key ? { ...c, selected: !c.selected } : c));
        setSelectedPerfil(null); // Deseleccionar perfil al modificar columnas manualmente
    };

    const selectAll = () => { setColumns(prev => prev.map(c => ({ ...c, selected: true }))); setSelectedPerfil(null); };
    const selectNone = () => { setColumns(prev => prev.map(c => ({ ...c, selected: false }))); setSelectedPerfil(null); };
    const selectDefaults = () => { setColumns(prev => prev.map(c => ({ ...c, selected: c.default }))); setSelectedPerfil(null); };

    const moveColumn = (index, direction) => {
        const selected = [...selectedColumns];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= selected.length) return;
        [selected[index], selected[newIndex]] = [selected[newIndex], selected[index]];
        const selectedKeys = new Set(selected.map(c => c.key));
        const unselected = columns.filter(c => !selectedKeys.has(c.key));
        setColumns([...selected.map(c => ({ ...c, selected: true })), ...unselected.map(c => ({ ...c, selected: false }))]);
    };

    // Aplicar perfil
    const applyPerfil = (perfil) => {
        if (!perfil || !selectedReport) return;
        setSelectedPerfil(perfil);
        const perfilCols = perfil.columnas; // [{key, label}]
        const allKeys = REPORT_COLUMNS[selectedReport.id];
        const allKeysMap = Object.fromEntries(allKeys.map(c => [c.key, c]));

        // Build ordered columns: first the profile ones (in order), then the rest (unselected)
        const ordered = [];
        const usedKeys = new Set();
        perfilCols.forEach(pc => {
            const def = allKeysMap[pc.key];
            if (def) {
                ordered.push({ ...def, label: pc.label, selected: true });
                usedKeys.add(pc.key);
            } else {
                // Column from profile not in standard config — add as custom
                ordered.push({ key: pc.key, label: pc.label, default: false, group: 'Perfil', selected: true });
                usedKeys.add(pc.key);
            }
        });
        // Add remaining columns as unselected
        allKeys.forEach(c => {
            if (!usedKeys.has(c.key)) {
                ordered.push({ ...c, selected: false });
            }
        });
        setColumns(ordered);
    };

    // Guardar perfil actual como nuevo
    const handleSavePerfil = async () => {
        if (!perfilForm.nombre.trim()) { setPerfilError('El nombre es obligatorio'); return; }
        try {
            setPerfilError('');
            const payload = {
                nombre: perfilForm.nombre,
                descripcion: perfilForm.descripcion,
                tipoReporte: selectedReport.id,
                columnas: selectedColumns.map(c => ({ key: c.key, label: c.label })),
            };
            if (editingPerfil) {
                await api.put(`/reportes/perfiles/${editingPerfil.id}`, payload);
            } else {
                await api.post('/reportes/perfiles', payload);
            }
            await fetchPerfiles(selectedReport.id);
            setShowPerfilModal(false);
            setEditingPerfil(null);
            setPerfilForm({ nombre: '', descripcion: '' });
        } catch (err) {
            setPerfilError(err.response?.data?.error || 'Error al guardar perfil');
        }
    };

    const handleDeletePerfil = async (perfil) => {
        if (perfil.esPredefinido) return;
        if (!window.confirm(`¿Eliminar el perfil "${perfil.nombre}"?`)) return;
        try {
            await api.delete(`/reportes/perfiles/${perfil.id}`);
            await fetchPerfiles(selectedReport.id);
            if (selectedPerfil?.id === perfil.id) setSelectedPerfil(null);
        } catch (err) {
            console.error('Error eliminando perfil:', err);
        }
    };

    const handleEditPerfil = (perfil) => {
        setEditingPerfil(perfil);
        setPerfilForm({ nombre: perfil.nombre, descripcion: perfil.descripcion || '' });
        setShowPerfilModal(true);
    };

    const handleUpdatePerfilColumns = async (perfil) => {
        if (selectedColumns.length === 0) return;
        try {
            await api.put(`/reportes/perfiles/${perfil.id}`, {
                ...perfil,
                columnas: selectedColumns.map(c => ({ key: c.key, label: c.label })),
            });
            await fetchPerfiles(selectedReport.id);
        } catch (err) {
            console.error('Error actualizando columnas del perfil:', err);
        }
    };

    const fetchData = async () => {
        if (!selectedReport) return;
        if (selectedReport.id === 'estadisticas') {
            try {
                setLoading(true);
                const res = await api.get(selectedReport.endpoint);
                setStatsData(res.data);
            } catch (err) { console.error('Error cargando estadísticas:', err); }
            finally { setLoading(false); }
            return;
        }
        try {
            setLoading(true);
            const res = await api.get(selectedReport.endpoint, { params: { ...filters } });
            setRawData(res.data);
        } catch (err) { console.error('Error cargando datos:', err); }
        finally { setLoading(false); }
    };

    const previewData = useMemo(() => {
        if (!selectedReport || selectedReport.id === 'estadisticas' || rawData.length === 0) return [];
        return transformData(selectedReport.id, rawData, selectedColumns);
    }, [rawData, selectedColumns, selectedReport]);

    const handleExport = () => {
        if (previewData.length === 0) return;
        const name = selectedPerfil ? selectedPerfil.nombre : selectedReport.name;
        const fileName = `Reporte_${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
        exportToExcel(previewData, fileName);
    };

    const getFilterComponent = () => {
        if (!selectedReport) return null;
        switch (selectedReport.id) {
            case 'inventario':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FilterSelect label="Estado" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                            options={[{ value: 'DISPONIBLE', label: 'Disponible' }, { value: 'ASIGNADO', label: 'Asignado' }, { value: 'EN_MANTENIMIENTO', label: 'En Mantenimiento' }, { value: 'DADO_DE_BAJA', label: 'Dado de Baja' }]} />
                        <FilterSelect label="Empresa" value={filters.empresaPropietaria} onChange={v => setFilters(p => ({ ...p, empresaPropietaria: v }))}
                            options={EMPRESAS_PROPIETARIAS.map(e => ({ value: e, label: e }))} />
                        <FilterSelect label="Estado Operativo" value={filters.estadoOperativo} onChange={v => setFilters(p => ({ ...p, estadoOperativo: v }))}
                            options={ESTADOS_OPERATIVOS.map(e => ({ value: e, label: e }))} />
                        <FilterSelect label="Tipo Equipo" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                            options={TIPOS_EQUIPO.map(e => ({ value: e, label: e }))} />
                    </div>
                );
            case 'asignaciones':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FilterSelect label="Tipo" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                            options={[{ value: 'ASIGNACION', label: 'Asignación' }, { value: 'TRASLADO', label: 'Traslado' }, { value: 'DEVOLUCION', label: 'Devolución' }]} />
                        <FilterDate label="Desde" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                        <FilterDate label="Hasta" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                    </div>
                );
            case 'mantenimiento':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FilterSelect label="Estado" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                            options={[{ value: 'CREADO', label: 'Creado' }, { value: 'EN_PROCESO', label: 'En Proceso' }, { value: 'FINALIZADO', label: 'Finalizado' }, { value: 'CERRADO', label: 'Cerrado' }]} />
                        <FilterSelect label="Tipo Servicio" value={filters.tipoServicio} onChange={v => setFilters(p => ({ ...p, tipoServicio: v }))}
                            options={[{ value: 'MANTENIMIENTO', label: 'Mantenimiento' }, { value: 'REPARACION', label: 'Reparación' }, { value: 'SUMINISTRO', label: 'Suministro' }, { value: 'INSPECCION', label: 'Inspección' }, { value: 'ACTUALIZACION', label: 'Actualización' }]} />
                        <FilterDate label="Desde" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                        <FilterDate label="Hasta" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                    </div>
                );
            case 'garantias':
                return (
                    <div className="grid grid-cols-1 gap-3">
                        <FilterSelect label="Filtrar por" value={filters.filtro} onChange={v => setFilters(p => ({ ...p, filtro: v }))}
                            options={[{ value: 'vencidas', label: '⛔ Vencidas' }, { value: 'proximas', label: '⚠️ Próximas (3 meses)' }, { value: 'vigentes', label: '✅ Vigentes' }]} />
                    </div>
                );
            default: return null;
        }
    };

    // ==========================================
    // VISTA: Tarjetas de selección de reporte
    // ==========================================
    if (!selectedReport) {
        return (
            <div className="px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Reportes</h1>
                    <p className="mt-1 text-sm text-gray-600">Selecciona un tipo de reporte para personalizar y exportar</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REPORT_TYPES.map((report) => (
                        <button key={report.id} onClick={() => setSelectedReport(report)}
                            className="text-left bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 hover:shadow-md hover:ring-indigo-300 transition-all group">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{report.icon}</span>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{report.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{report.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ==========================================
    // VISTA: Resumen Estadístico
    // ==========================================
    if (selectedReport.id === 'estadisticas') {
        return (
            <div className="px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedReport(null)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Volver</button>
                        <h1 className="text-xl font-semibold text-gray-900">📊 Resumen Estadístico</h1>
                    </div>
                    <button onClick={fetchData} disabled={loading}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                        {loading ? 'Cargando...' : 'Generar Estadísticas'}
                    </button>
                </div>
                {statsData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Total Activos" value={statsData.totalActivos} color="indigo" />
                            <StatCard label="Mantenimientos" value={statsData.totalMantenimientos} color="yellow" />
                            <StatCard label="Costo Total Mant." value={`$${Number(statsData.costoTotalMantenimiento).toLocaleString()}`} color="green" />
                            <StatCard label="Categorías" value={statsData.porCategoria?.length || 0} color="blue" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatsTable title="Por Estado" data={statsData.porEstado} keyField="estado" valueField="cantidad" />
                            <StatsTable title="Por Empresa" data={statsData.porEmpresa} keyField="empresa" valueField="cantidad" />
                            <StatsTable title="Por Tipo de Equipo" data={statsData.porTipoEquipo} keyField="tipo" valueField="cantidad" />
                            <StatsTable title="Por Categoría" data={statsData.porCategoria} keyField="nombre" valueField="cantidad" />
                            <StatsTable title="Por Estado Operativo" data={statsData.porEstadoOperativo} keyField="estado" valueField="cantidad" />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ==========================================
    // VISTA: Configuración de Reporte
    // ==========================================
    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedReport(null)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Volver</button>
                    <h1 className="text-xl font-semibold text-gray-900">{selectedReport.icon} {selectedReport.name}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={fetchData} disabled={loading}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                        {loading ? 'Cargando...' : rawData.length > 0 ? '🔄 Actualizar' : '▶ Generar Reporte'}
                    </button>
                    {previewData.length > 0 && (
                        <button onClick={handleExport}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">
                            📤 Exportar Excel ({previewData.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Columna Izquierda */}
                <div className="lg:col-span-1 space-y-4">

                    {/* Filtros */}
                    {getFilterComponent() && (
                        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">🔍 Filtros</h3>
                            {getFilterComponent()}
                        </div>
                    )}

                    {/* PERFILES DE REPORTE */}
                    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">📁 Perfiles de Orden</h3>
                            <button onClick={() => { setEditingPerfil(null); setPerfilForm({ nombre: '', descripcion: '' }); setPerfilError(''); setShowPerfilModal(true); }}
                                className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-md font-medium transition-colors">
                                + Nuevo
                            </button>
                        </div>
                        {perfiles.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No hay perfiles para este reporte</p>
                        ) : (
                            <div className="space-y-2">
                                {perfiles.map(perfil => (
                                    <div key={perfil.id}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-all ${selectedPerfil?.id === perfil.id
                                            ? 'bg-indigo-50 ring-2 ring-indigo-400'
                                            : 'bg-gray-50 hover:bg-gray-100 ring-1 ring-gray-200'
                                            }`}
                                        onClick={() => applyPerfil(perfil)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                {perfil.esPredefinido && <span className="text-xs">⭐</span>}
                                                <span className="text-sm font-medium text-gray-800 truncate">{perfil.nombre}</span>
                                            </div>
                                            {perfil.descripcion && (
                                                <p className="text-xs text-gray-500 mt-0.5 truncate">{perfil.descripcion}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-0.5">{perfil.columnas?.length || 0} columnas</p>
                                        </div>
                                        <div className="flex gap-1 ml-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => handleEditPerfil(perfil)} title="Editar nombre"
                                                className="text-gray-400 hover:text-indigo-600 p-1 text-xs">✏️</button>
                                            {selectedPerfil?.id === perfil.id && selectedColumns.length > 0 && (
                                                <button onClick={() => handleUpdatePerfilColumns(perfil)} title="Guardar columnas actuales en este perfil"
                                                    className="text-gray-400 hover:text-green-600 p-1 text-xs">💾</button>
                                            )}
                                            {!perfil.esPredefinido && (
                                                <button onClick={() => handleDeletePerfil(perfil)} title="Eliminar"
                                                    className="text-gray-400 hover:text-red-600 p-1 text-xs">🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ORDEN DE COLUMNAS */}
                    {selectedColumns.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                ↕️ Orden de Columnas ({selectedColumns.length})
                            </h3>
                            <div className="space-y-1 max-h-80 overflow-y-auto">
                                {selectedColumns.map((col, idx) => (
                                    <div key={col.key} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1.5 text-sm">
                                        <span className="text-gray-700 truncate flex-1">
                                            <span className="text-gray-400 text-xs mr-1">{idx + 1}.</span>
                                            {col.label}
                                        </span>
                                        <div className="flex gap-0.5 ml-2 flex-shrink-0">
                                            <button onClick={() => moveColumn(idx, -1)} disabled={idx === 0}
                                                className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs px-1.5 py-0.5 hover:bg-gray-200 rounded">▲</button>
                                            <button onClick={() => moveColumn(idx, 1)} disabled={idx === selectedColumns.length - 1}
                                                className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs px-1.5 py-0.5 hover:bg-gray-200 rounded">▼</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SELECTOR DE COLUMNAS */}
                    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">☑️ Columnas ({selectedColumns.length}/{columns.length})</h3>
                        </div>
                        <div className="flex gap-2 mb-3 flex-wrap">
                            <button onClick={selectAll} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Todas</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={selectNone} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Ninguna</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={selectDefaults} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Por defecto</button>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                            {Object.entries(groups).map(([groupName, groupCols]) => (
                                <div key={groupName}>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{groupName}</h4>
                                    <div className="space-y-1">
                                        {groupCols.map(col => (
                                            <label key={col.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5">
                                                <input type="checkbox" checked={col.selected} onChange={() => toggleColumn(col.key)}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 h-3.5 w-3.5" />
                                                <span className="text-sm text-gray-700">{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Vista previa */}
                <div className="lg:col-span-3">
                    {rawData.length === 0 && !loading && (
                        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-12 text-center">
                            <div className="text-4xl mb-3">{selectedReport.icon}</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Configura tu reporte</h3>
                            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                                Aplica un <strong>perfil de orden</strong> o selecciona columnas manualmente,
                                luego presiona <strong>"Generar Reporte"</strong>.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-12 text-center">
                            <div className="text-2xl mb-2">⏳</div>
                            <p className="text-gray-500">Generando reporte...</p>
                        </div>
                    )}

                    {!loading && previewData.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200">
                            <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Vista Previa — {previewData.length} registros, {selectedColumns.length} columnas
                                    {selectedPerfil && <span className="text-indigo-600 ml-2">({selectedPerfil.nombre})</span>}
                                </h3>
                            </div>
                            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a5b4fc #f3f4f6' }}>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                                            {selectedColumns.map(col => (
                                                <th key={col.key} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    {col.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {previewData.slice(0, 100).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                                                {selectedColumns.map(col => (
                                                    <td key={col.key} className="px-3 py-2 text-sm text-gray-700 whitespace-nowrap max-w-xs truncate">
                                                        {row[col.label] ?? ''}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {previewData.length > 100 && (
                                <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs border-t">
                                    Mostrando 100 de {previewData.length} registros. Excel incluirá todos.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Crear/Editar Perfil */}
            {showPerfilModal && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPerfilModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingPerfil ? 'Editar Perfil' : 'Nuevo Perfil de Orden'}
                            </h3>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" value={perfilForm.nombre}
                                    onChange={e => setPerfilForm(p => ({ ...p, nombre: e.target.value }))}
                                    placeholder="Ej: CMDB USUARIO FINAL"
                                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea value={perfilForm.descripcion}
                                    onChange={e => setPerfilForm(p => ({ ...p, descripcion: e.target.value }))}
                                    placeholder="Descripción opcional del perfil..."
                                    rows={2}
                                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-3"
                                />
                            </div>
                            {!editingPerfil && (
                                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                                    💡 Las <strong>{selectedColumns.length} columnas seleccionadas</strong> actualmente
                                    se guardarán con su orden en este perfil.
                                </div>
                            )}
                            {perfilError && (
                                <p className="text-sm text-red-600">{perfilError}</p>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button onClick={() => setShowPerfilModal(false)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                                Cancelar
                            </button>
                            <button onClick={handleSavePerfil}
                                disabled={!perfilForm.nombre.trim()}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                                {editingPerfil ? 'Guardar Cambios' : 'Crear Perfil'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components
const FilterSelect = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <select value={value || ''} onChange={e => onChange(e.target.value || undefined)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
            <option value="">Todos</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

const FilterDate = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input type="date" value={value || ''} onChange={e => onChange(e.target.value || undefined)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2" />
    </div>
);

const StatCard = ({ label, value, color }) => {
    const colors = { indigo: 'bg-indigo-50 text-indigo-700', yellow: 'bg-yellow-50 text-yellow-700', green: 'bg-green-50 text-green-700', blue: 'bg-blue-50 text-blue-700' };
    return (
        <div className={`rounded-xl p-5 ${colors[color] || colors.indigo}`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm mt-1 opacity-80">{label}</div>
        </div>
    );
};

const StatsTable = ({ title, data, keyField, valueField }) => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, item) => sum + (item[valueField] || 0), 0);
    return (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b"><h4 className="text-sm font-semibold text-gray-800">{title}</h4></div>
            <div className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm text-gray-700">{item[keyField] || 'N/A'}</span>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(item[valueField] / total) * 100}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">{item[valueField]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reportes;
