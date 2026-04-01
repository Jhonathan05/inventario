import { useAuth } from '../../../context/AuthContext';
import ActivosForm from '../ActivosForm';
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

const ActivosList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const {
        activos, pagination, loading, categorias, funcionarios, catalogs,
        search, setSearch,
        isModalOpen, selectedActivo,
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
        handleCreate, handleEdit, handleCloseModal,
        clearFilters, changePage,
        handleViewHistorial,
        isExporting, getExportData,
        sortBy, sortOrder, handleSort,
    } = useActivosList();

    const totalPages = pagination.pages || 1;
    const totalItems = pagination.total || activos.length;

    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Activos Tecnológicos</h1>
                    <p className="mt-1 text-sm text-gray-700">Inventario completo de equipos ({totalItems} resultados)</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {activos.length > 0 && (
                        <>
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosExcel(allData);
                                }}
                                disabled={isExporting}
                                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm disabled:opacity-50"
                            >
                                {isExporting ? '⏳...' : '📊 Excel'}
                            </button>
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosPDF(allData, funcionarios, filterFuncionario);
                                }}
                                disabled={isExporting}
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 shadow-sm disabled:opacity-50"
                            >
                                {isExporting ? '⏳...' : '📄 PDF'}
                            </button>
                        </>
                    )}
                    {canEdit && (
                        <button type="button" onClick={handleCreate} className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                            + Nuevo
                        </button>
                    )}
                </div>
            </div>

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

            {loading && <div className="mt-8 text-center text-gray-500 py-10">Cargando activos...</div>}

            {!loading && (
                <>
                    <ActivosTable 
                        activos={activos} 
                        canEdit={canEdit} 
                        onEdit={handleEdit} 
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    />
                    <ActivosCards activos={activos} canEdit={canEdit} onEdit={handleEdit} />
                </>
            )}

            {!loading && activos.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentCount={activos.length}
                    onPageChange={changePage}
                />
            )}

            {isModalOpen && (
                <ActivosForm open={isModalOpen} onClose={handleCloseModal} activo={selectedActivo} />
            )}

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
