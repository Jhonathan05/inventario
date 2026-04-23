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
import { 
    ComputerDesktopIcon, 
    PlusIcon, 
    TableCellsIcon, 
    DocumentTextIcon, 
    ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

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
        <div className="space-y-6">
            {/* Sección de Encabezado: Título, Descripción y Acciones Globales */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                            <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                <ComputerDesktopIcon className="w-6 h-6 text-fnc-600" />
                            </div>
                            Activos Tecnológicos
                        </h1>
                        <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                            Inventario completo de equipos y periféricos ({totalItems} registros)
                        </p>
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
                                    className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-green-700 shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    <TableCellsIcon className="w-4 h-4" />
                                    Excel
                                </button>
                                <button
                                    onClick={async () => {
                                        const allData = await getExportData();
                                        exportActivosPDF(allData, funcionarios, filterFuncionario);
                                    }}
                                    disabled={isExporting}
                                    className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-700 shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    <DocumentTextIcon className="w-4 h-4" />
                                    PDF
                                </button>
                            </>
                        )}
                        {canEdit && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-black text-xs uppercase tracking-widest"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Nuevo Activo
                            </button>
                        )}
                    </div>
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
