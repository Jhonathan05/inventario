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
        <div className="font-mono mb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Header / Main Inventory Hub */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.5em] group-hover:opacity-20 group-hover:text-text-accent transition-all">INV_CORE_ARRAY_RX</div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">
                        / activos_tecnológicos
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 bg-text-accent animate-pulse shadow-[0_0_8px_rgba(var(--text-accent),0.5)]"></div>
                             <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em]">DATA_BUFFER_STABLE // TOTAL_NODES_ALLOCATED: <span className="text-text-primary">[{totalItems.toString().padStart(4, '0')}]</span></p>
                        </div>
                        <span className="text-border-default h-5 w-[1px]"></span>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 italic">CORE_KERNEL_READY // 0xAF22</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6 items-center relative z-10">
                    {activos.length > 0 && (
                        <div className="flex gap-4 items-center p-3 border border-border-default/50 bg-bg-base/30 backdrop-blur-sm">
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosExcel(allData);
                                }}
                                disabled={isExporting}
                                title="EXPORT_RAW_BUFFER_TO_XLSX"
                                className="bg-bg-elevated border-2 border-border-default px-6 py-3 text-[10px] font-black text-text-muted hover:border-text-accent hover:text-text-primary disabled:opacity-20 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/btn"
                            >
                                <span className="mr-2 opacity-30 group-hover:opacity-100 transition-opacity">[X]</span> 
                                {isExporting ? 'SYNCING...' : 'EXPORT_RAW'}
                            </button>
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosPDF(allData, funcionarios, filterFuncionario);
                                }}
                                disabled={isExporting}
                                title="GENERATE_SYSTEM_DOCUMENT_PDF"
                                className="bg-bg-elevated border-2 border-border-default px-6 py-3 text-[10px] font-black text-text-muted hover:border-text-accent hover:text-text-primary disabled:opacity-20 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/btn"
                            >
                                <span className="mr-2 opacity-30 group-hover:opacity-100 transition-opacity">[P]</span> 
                                {isExporting ? 'SYNCING...' : 'EXPORT_PDF'}
                            </button>
                        </div>
                    )}
                    {canEdit && (
                        <button 
                            type="button" 
                            onClick={handleCreate} 
                            className="bg-bg-elevated border-2 border-border-strong px-10 py-5 text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.5em] transition-all shadow-3xl hover:scale-105 active:scale-95 group relative overflow-hidden"
                        >
                            <span className="relative z-10">[ + ] CREATE_ASSET_NODE</span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Enclave Layer */}
            <div className="mt-12">
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

            {/* Data Pipeline Result Stream */}
            <div className="mt-12 relative">
                {loading && (
                    <div className="absolute inset-0 z-50 bg-bg-base/60 backdrop-blur-[2px] flex items-center justify-center p-20 font-mono">
                        <div className="text-center animate-fadeIn">
                             <div className="w-12 h-12 border-4 border-t-text-accent border-border-default animate-spin mx-auto mb-6"></div>
                             <div className="text-[13px] uppercase tracking-[0.8em] text-text-accent font-black animate-pulse"># SYNCING_BUFFER...</div>
                             <div className="mt-4 text-[9px] text-text-muted uppercase tracking-widest opacity-40 italic">recovering_node_consistency</div>
                        </div>
                    </div>
                )}

                {!loading && activos.length === 0 ? (
                    <div className="bg-bg-surface border-2 border-border-default p-24 text-center shadow-3xl relative overflow-hidden group/empty">
                         <div className="absolute top-0 right-0 p-8 opacity-5 text-xl font-black uppercase tracking-[1em] group-hover/empty:text-text-accent transition-colors">IO_NULL_STREAM</div>
                         <div className="inline-block p-12 bg-bg-base border-2 border-dashed border-border-default/30 shadow-inner group-hover:border-text-accent transition-colors">
                              <p className="text-[14px] font-black text-text-muted uppercase tracking-[0.6em] mb-4">! NO_NODES_DET_IN_BUFF</p>
                              <p className="text-[10px] text-text-muted uppercase tracking-[0.4em] opacity-40">ADJUST_FILTERS_OR_GENERATE_NEW_ASSET_IO</p>
                         </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <ActivosTable 
                            activos={activos} 
                            canEdit={canEdit} 
                            onEdit={handleEdit} 
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        />
                        <div className="lg:hidden">
                             <ActivosCards activos={activos} canEdit={canEdit} onEdit={handleEdit} />
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination IO Buffer Control */}
            {!loading && activos.length > 0 && (
                <div className="mt-12 border-t-2 border-border-default pt-10">
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

            {/* Modals Bridge */}
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

            {/* Controller Footer Identification Area */}
            <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-8 p-10 bg-bg-surface/40 border border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] flex items-center gap-4">
                     <div className="w-2 h-2 bg-text-accent rotate-45 animate-pulse shadow-[0_0_8px_rgba(255,51,102,0.5)]"></div>
                     INVENTORY_CONTROLLER_STABLE // HASH_0x88FE
                </div>
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] italic group-hover:text-text-primary transition-colors">
                     COLOMBIA_IT_NODE_MANAGER // ACCESS: RO_MASTER
                </div>
            </div>
        </div>
    );
};

export default ActivosList;
