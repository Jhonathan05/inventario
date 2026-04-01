import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { activosService } from '../../../api/activos.service';
import { categoriasService } from '../../../api/categorias.service';
import { funcionariosService } from '../../../api/funcionarios.service';
import { catalogosService } from '../../../api/catalogos.service';

const sortList = (list) =>
    [...(list?.data || list)].sort((a, b) =>
        (a.nombre || a.valor || a).toString().toUpperCase()
            .localeCompare((b.nombre || b.valor || b).toString().toUpperCase())
    );

export const useActivosList = () => {
    const queryClient = useQueryClient();

    // UI state
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivo, setSelectedActivo] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [sortBy, setSortBy] = useState('creadoEn');
    const [sortOrder, setSortOrder] = useState('desc');
    const itemsPerPage = 10;

    // Advanced filters
    const [filterCategoria, setFilterCategoria] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('');
    const [filterEstadoOp, setFilterEstadoOp] = useState('');
    const [filterCiudad, setFilterCiudad] = useState('');
    const [filterFuncionario, setFilterFuncionario] = useState('');
    const [searchFuncionarioText, setSearchFuncionarioText] = useState('');
    const [showFuncionarioDropdown, setShowFuncionarioDropdown] = useState(false);

    // Historial modal
    const [showHistorial, setShowHistorial] = useState(false);
    const [historialData, setHistorialData] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);

    // ── Queries de catálogos ──────────────────────────────────────────
    const { data: categorias = [] } = useQuery({
        queryKey: ['categorias', 'filters'],
        queryFn: async () => sortList(await categoriasService.getAll()),
        staleTime: 5 * 60 * 1000,
    });

    const { data: funcionarios = [] } = useQuery({
        queryKey: ['funcionarios', 'all'],
        queryFn: async () => {
            const res = await funcionariosService.getAll({ limit: 1000 });
            return sortList(res?.data || (Array.isArray(res) ? res : []));
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: catalogs = { EMPRESA_PROPIETARIA: [], ESTADO_OPERATIVO: [], TIPO_EQUIPO: [] } } = useQuery({
        queryKey: ['catalogos', 'filters'],
        queryFn: async () => {
            const res = await catalogosService.getAll();
            const grouped = (res?.data || res).reduce((acc, curr) => {
                if (!acc[curr.dominio]) acc[curr.dominio] = [];
                acc[curr.dominio].push(curr.valor);
                return acc;
            }, {});
            return {
                EMPRESA_PROPIETARIA: sortList(grouped['EMPRESA_PROPIETARIA'] || []),
                ESTADO_OPERATIVO: sortList(grouped['ESTADO_OPERATIVO'] || []),
                TIPO_EQUIPO: sortList(grouped['TIPO_EQUIPO'] || []),
            };
        },
        staleTime: 5 * 60 * 1000,
    });

    // ── Query principal de activos ────────────────────────────────────
    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        ...(search && { search }),
        ...(filterCategoria && { categoriaId: filterCategoria }),
        ...(filterEstado && { estado: filterEstado }),
        ...(filterEmpresa && { empresaPropietaria: filterEmpresa }),
        ...(filterEstadoOp && { estadoOperativo: filterEstadoOp }),
        ...(filterCiudad && { ciudad: filterCiudad }),
        ...(filterFuncionario && { funcionarioId: filterFuncionario }),
        sortBy,
        order: sortOrder,
    };

    const { data: responseData, isLoading: loading } = useQuery({
        queryKey: ['activos', queryParams],
        queryFn: () => activosService.getAll(queryParams),
    });

    const activos = responseData?.data || (Array.isArray(responseData) ? responseData : []);
    const pagination = responseData?.pagination || { page: 1, pages: 1, total: activos.length };

    // ── Handlers ──────────────────────────────────────────────────────
    const handleCreate = () => { setSelectedActivo(null); setIsModalOpen(true); };
    const handleEdit = (activo) => { setSelectedActivo(activo); setIsModalOpen(true); };

    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) queryClient.invalidateQueries({ queryKey: ['activos'] });
    };

    const clearFilters = () => {
        setSearch('');
        setFilterCategoria('');
        setFilterEstado('');
        setFilterEmpresa('');
        setFilterEstadoOp('');
        setFilterCiudad('');
        setFilterFuncionario('');
        setSearchFuncionarioText('');
        setCurrentPage(1);
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination.pages || 1)) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleViewHistorial = async () => {
        if (!filterFuncionario) return;
        setHistorialLoading(true);
        setShowHistorial(true);
        try {
            const data = await activosService.getHistorialByFuncionario(filterFuncionario);
            setHistorialData(data);
        } catch (err) {
            console.error('Error obteniendo historial', err);
        } finally {
            setHistorialLoading(false);
        }
    };

    const activeFilterCount = [filterCategoria, filterEstado, filterEmpresa, filterEstadoOp, filterCiudad, filterFuncionario]
        .filter(Boolean).length;
    
    // ── Exportación total ─────────────────────────────────────────────
    const getExportData = async () => {
        setIsExporting(true);
        try {
            // Clonar parámetros actuales pero con límite alto
            const exportParams = {
                ...queryParams,
                page: 1,
                limit: 5000 // Suficiente para evitar paginación en la mayoría de casos
            };
            const response = await activosService.getAll(exportParams);
            return response?.data || (Array.isArray(response) ? response : []);
        } catch (err) {
            console.error('Error fetching export data', err);
            return [];
        } finally {
            setIsExporting(false);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    return {
        // Data
        activos, pagination, loading, categorias, funcionarios, catalogs,
        // UI state
        search, setSearch,
        isModalOpen, selectedActivo,
        showFilters, setShowFilters,
        currentPage, itemsPerPage,
        // Filters
        filterCategoria, setFilterCategoria,
        filterEstado, setFilterEstado,
        filterEmpresa, setFilterEmpresa,
        filterEstadoOp, setFilterEstadoOp,
        filterCiudad, setFilterCiudad,
        filterFuncionario, setFilterFuncionario,
        searchFuncionarioText, setSearchFuncionarioText,
        showFuncionarioDropdown, setShowFuncionarioDropdown,
        activeFilterCount,
        // Historial
        showHistorial, setShowHistorial,
        historialData, historialLoading,
        // Handlers
        handleCreate, handleEdit, handleCloseModal,
        clearFilters, changePage,
        handleViewHistorial,
        // Export
        isExporting, getExportData,
        // Sort
        sortBy, sortOrder, handleSort,
    };
};
