import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { activosService } from '../../../api/activos.service';
import { categoriasService } from '../../../api/categorias.service';
import { funcionariosService } from '../../../api/funcionarios.service';
import { catalogosService } from '../../../api/catalogos.service';

const sortList = (list) =>
    [...list].sort((a, b) =>
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
    const itemsPerPage = 10;

    // Advanced filters
    const [filterEstado, setFilterEstado] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('');
    const [filterEstadoOp, setFilterEstadoOp] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [filterFuncionario, setFilterFuncionario] = useState('');
    const [searchFuncionarioText, setSearchFuncionarioText] = useState('');
    const [showFuncionarioDropdown, setShowFuncionarioDropdown] = useState(false);

    // Historial modal
    const [showHistorial, setShowHistorial] = useState(false);
    const [historialData, setHistorialData] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);

    // ── Queries de catálogos ──────────────────────────────────────────
    const { data: categorias = [] } = useQuery({
        queryKey: ['categorias'],
        queryFn: async () => sortList(await categoriasService.getAll()),
        staleTime: 5 * 60 * 1000,
    });

    const { data: funcionarios = [] } = useQuery({
        queryKey: ['funcionarios', 'all'],
        queryFn: async () => sortList(await funcionariosService.getAll()),
        staleTime: 5 * 60 * 1000,
    });

    const { data: catalogs = { EMPRESA_PROPIETARIA: [], ESTADO_OPERATIVO: [], TIPO_EQUIPO: [] } } = useQuery({
        queryKey: ['catalogos'],
        queryFn: async () => {
            const res = await catalogosService.getAll();
            const grouped = res.reduce((acc, curr) => {
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
        ...(filterEstado && { estado: filterEstado }),
        ...(filterEmpresa && { empresaPropietaria: filterEmpresa }),
        ...(filterEstadoOp && { estadoOperativo: filterEstadoOp }),
        ...(filterTipo && { tipo: filterTipo }),
        ...(filterFuncionario && { funcionarioId: filterFuncionario }),
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
        setFilterEstado('');
        setFilterEmpresa('');
        setFilterEstadoOp('');
        setFilterTipo('');
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

    const activeFilterCount = [filterEstado, filterEmpresa, filterEstadoOp, filterTipo, filterFuncionario]
        .filter(Boolean).length;

    return {
        // Data
        activos, pagination, loading, categorias, funcionarios, catalogs,
        // UI state
        search, setSearch,
        isModalOpen, selectedActivo,
        showFilters, setShowFilters,
        currentPage, itemsPerPage,
        // Filters
        filterEstado, setFilterEstado,
        filterEmpresa, setFilterEmpresa,
        filterEstadoOp, setFilterEstadoOp,
        filterTipo, setFilterTipo,
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
    };
};
