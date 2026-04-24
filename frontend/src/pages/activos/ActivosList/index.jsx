import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Pagination from '../../../components/Pagination';
import { useActivosList } from './useActivosList';
import ActivosFilters from './ActivosFilters';
import ActivosTable from './ActivosTable';
import ActivosCards from './ActivosCards';
import HistorialModal from './HistorialModal';
import {
    exportActivosExcel,
    exportActivosPDF,
    exportHistorialExcel,
    exportHistorialPDF,
} from './ActivosExport';
import { 
    ComputerDesktopIcon, 
    PlusIcon, 
    TableCellsIcon, 
    DocumentTextIcon, 
    ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

const ActivosList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const {
        activos, pagination, loading, categorias, funcionarios, catalogs,
        search, setSearch,
        showFilters, setShowFilters,
        currentPage, itemsPerPage,
        filterCategoria, setFilterCategoria,
        filterEstado, setFilterEstado,
        filterEmpresa, setFilterEmpresa,
        filterEstadoOp, setFilterEstadoOp,
        filterCiudad, setFilterCiudad,
        filterFuncionario, setFilterFuncionario,
        searchFuncionarioText, setSearchFuncionarioText,
        showFuncionarioDropdown, setShowFuncionarioDropdown,
        activeFilterCount,
        showHistorial, setShowHistorial,
        historialData, historialLoading,
        clearFilters, changePage,
        handleViewHistorial,
        isExporting, getExportData,
        sortBy, sortOrder, handleSort,
    } = useActivosList();

    const handleCreate = () => { navigate('/activos/nuevo'); };
    const handleEdit = (activo) => { navigate(`/activos/editar/${activo.id}`); };

    const totalPages = pagination.pages || 1;
    const totalItems = pagination.total || activos.length;

    return (
        <div className="space-y-6">
            {/* Header Módulo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Activos Tecnológicos</h1>
                    <p className="page-header-subtitle">
                        Inventario completo de equipos y periféricos ({totalItems} registros)
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {activos.length > 0 && (
                        <>
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosExcel(allData);
                                }}
                                disabled={isExporting}
                                className="btn-secondary"
                            >
                                <TableCellsIcon className="w-3.5 h-3.5" />
                                Excel
                            </button>
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosPDF(allData, funcionarios, filterFuncionario);
                                }}
                                disabled={isExporting}
                                className="btn-secondary"
                            >
                                <DocumentTextIcon className="w-3.5 h-3.5" />
                                PDF
                            </button>
                        </>
                    )}
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="btn-primary"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nuevo Activo
                        </button>
                    )}
                </div>
            </div>

            {/* Seccion de Contenido: Filtros y Datos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <ActivosFilters
                        search={search} setSearch={setSearch}
                        showFilters={showFilters} setShowFilters={setShowFilters}
                        activeFilterCount={activeFilterCount}
                        filterCategoria={filterCategoria} setFilterCategoria={setFilterCategoria}
                        filterEstado={filterEstado} setFilterEstado={setFilterEstado}
                        filterEmpresa={filterEmpresa} setFilterEmpresa={setFilterEmpresa}
                        filterEstadoOp={filterEstadoOp} setFilterEstadoOp={setFilterEstadoOp}
                        filterCiudad={filterCiudad} setFilterCiudad={setFilterCiudad}
                        filterFuncionario={filterFuncionario} setFilterFuncionario={setFilterFuncionario}
                        searchFuncionarioText={searchFuncionarioText} setSearchFuncionarioText={setSearchFuncionarioText}
                        showFuncionarioDropdown={showFuncionarioDropdown} setShowFuncionarioDropdown={setShowFuncionarioDropdown}
                        catalogs={catalogs} funcionarios={funcionarios} categorias={categorias}
                        clearFilters={clearFilters}
                        onViewHistorial={handleViewHistorial}
                    />
                </div>

                <div className="p-0">
                    {loading && <div className="text-center text-gray-500 py-20">Cargando activos...</div>}

                    {!loading && (
                        <div className="divide-y divide-gray-100">
                            <ActivosTable 
                                activos={activos} 
                                canEdit={canEdit} 
                                onEdit={handleEdit} 
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                            />
                            <div className="p-4 md:hidden">
                                <ActivosCards activos={activos} canEdit={canEdit} onEdit={handleEdit} />
                            </div>
                        </div>
                    )}

                    {!loading && activos.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                currentCount={activos.length}
                                onPageChange={changePage}
                            />
                        </div>
                    )}
                </div>
            </div>

            <HistorialModal
                show={showHistorial}
                onClose={() => setShowHistorial(false)}
                funcionarios={funcionarios}
                filterFuncionario={filterFuncionario}
                historialData={historialData}
                historialLoading={historialLoading}
                onExportExcel={() => exportHistorialExcel(historialData, funcionarios, filterFuncionario)}
                onExportPDF={() => exportHistorialPDF(historialData, funcionarios, filterFuncionario)}
            />
        </div>
    );
};

export default ActivosList;
