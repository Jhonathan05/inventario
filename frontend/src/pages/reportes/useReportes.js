import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../lib/axios';
import { exportToExcel } from '../../lib/exportUtils';
import { REPORT_COLUMNS, transformData } from './reportConfigs';

export const useReportes = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [columns, setColumns] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [statsData, setStatsData] = useState(null);
    const [catalogs, setCatalogs] = useState({ EMPRESA_PROPIETARIA: [], ESTADO_OPERATIVO: [], TIPO_EQUIPO: [] });

    // Perfiles state
    const [perfiles, setPerfiles] = useState([]);
    const [selectedPerfil, setSelectedPerfil] = useState(null);
    const [showPerfilModal, setShowPerfilModal] = useState(false);
    const [editingPerfil, setEditingPerfil] = useState(null);
    const [perfilForm, setPerfilForm] = useState({ nombre: '', descripcion: '' });
    const [perfilError, setPerfilError] = useState('');

    // Initial catalogs fetch
    useEffect(() => {
        api.get('/catalogos').then(res => {
            const grouped = res.data.reduce((acc, curr) => {
                if (!acc[curr.dominio]) acc[curr.dominio] = [];
                acc[curr.dominio].push(curr.valor);
                return acc;
            }, {});
            setCatalogs({
                EMPRESA_PROPIETARIA: grouped['EMPRESA_PROPIETARIA'] || [],
                ESTADO_OPERATIVO: grouped['ESTADO_OPERATIVO'] || [],
                TIPO_EQUIPO: grouped['TIPO_EQUIPO'] || []
            });
        }).catch(() => { });
    }, []);

    const fetchPerfiles = useCallback(async (tipoReporte) => {
        try {
            const res = await api.get('/reportes/perfiles', { params: { tipoReporte } });
            setPerfiles(res.data);
            if (res.data.length === 0 && tipoReporte === 'inventario') {
                await api.post('/reportes/perfiles/seed');
                const res2 = await api.get('/reportes/perfiles', { params: { tipoReporte } });
                setPerfiles(res2.data);
            }
        } catch (err) {
            console.error('Error cargando perfiles:', err);
        }
    }, []);

    // Initialize report change
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
        setSelectedPerfil(null);
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

    const applyPerfil = (perfil) => {
        if (!perfil || !selectedReport) return;
        setSelectedPerfil(perfil);
        const perfilCols = perfil.columnas; 
        const allKeys = REPORT_COLUMNS[selectedReport.id];
        const allKeysMap = Object.fromEntries(allKeys.map(c => [c.key, c]));

        const ordered = [];
        const usedKeys = new Set();
        perfilCols.forEach(pc => {
            const def = allKeysMap[pc.key];
            if (def) {
                ordered.push({ ...def, label: pc.label, selected: true });
                usedKeys.add(pc.key);
            } else {
                ordered.push({ key: pc.key, label: pc.label, default: false, group: 'Perfil', selected: true });
                usedKeys.add(pc.key);
            }
        });
        allKeys.forEach(c => {
            if (!usedKeys.has(c.key)) {
                ordered.push({ ...c, selected: false });
            }
        });
        setColumns(ordered);
    };

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

    return {
        selectedReport, setSelectedReport,
        columns, setColumns,
        rawData, setRawData,
        loading,
        filters, setFilters,
        statsData,
        catalogs,
        perfiles,
        selectedPerfil, applyPerfil,
        showPerfilModal, setShowPerfilModal,
        editingPerfil,
        perfilForm, setPerfilForm,
        perfilError,
        fetchData,
        handleSavePerfil,
        handleDeletePerfil,
        handleEditPerfil,
        handleUpdatePerfilColumns,
        handleExport,
        previewData,
        selectedColumns,
        groups,
        toggleColumn,
        selectAll,
        selectNone,
        selectDefaults,
        moveColumn
    };
};
