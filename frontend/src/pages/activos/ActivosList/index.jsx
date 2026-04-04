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
        <div className="font-mono mb-40 px-4 sm:px-6 lg:px-10 animate-fadeIn selection:bg-text-accent selection:text-bg-base border-l-4 border-l-border-default/10">
            {/* Header / Core Inventory Hub Gateway */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-12 bg-bg-surface border-4 border-border-default p-12 shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-text-accent transition-all duration-700 active:scale-[0.995]">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[2em] group-hover:opacity-15 group-hover:translate-x-4 transition-all italic">INV_CORE_ARRAY_RX_v4</div>
                <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-10 mb-8">
                         <div className="w-6 h-6 bg-text-accent animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.7)] group-hover:rotate-45 transition-transform duration-700"></div>
                         <h1 className="text-5xl font-black uppercase tracking-[0.5em] text-text-primary leading-none flex items-center gap-8">
                            <span className="text-text-accent opacity-20 text-6xl">/</span> activos_core
                         </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-12 mt-10 border-l-8 border-border-default/40 pl-12 italic">
                        <div className="flex items-center gap-6">
                             <p className="text-[14px] text-text-muted font-black uppercase tracking-[0.4em] group-hover:text-text-primary transition-colors">DATA_BUFFER_STABLE // NODES_ALLOCATED:</p>
                             <div className="bg-bg-base px-6 py-1.5 border-4 border-border-default/40 shadow-inner group-hover:border-text-accent/30 transition-all font-black text-text-accent tabular-nums tracking-[0.5em] text-xl">
                                [{totalItems.toString().padStart(4, '0')}]
                             </div>
                        </div>
                        <span className="text-border-default h-6 w-[2px] opacity-20"></span>
                        <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-35 flex items-center gap-5">
                            CORE_KERNEL_READY_0xAF22 <span className="text-text-accent text-2xl font-normal opacity-50">//</span> TOLIMA_SECURE_NODE
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-10 items-center relative z-10">
                    {activos.length > 0 && (
                        <div className="flex gap-6 items-center p-6 border-4 border-border-default/40 bg-bg-base/30 backdrop-blur-sm shadow-inner group-hover:bg-bg-base/50 transition-all">
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosExcel(allData);
                                }}
                                disabled={isExporting}
                                className="bg-bg-surface border-4 border-border-default px-8 py-4 text-[12px] font-black text-text-muted hover:text-text-primary hover:border-text-accent disabled:opacity-20 uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-90 group/btn relative overflow-hidden"
                            >
                                <span className="relative z-10">{isExporting ? 'SYNCING_BUFFER...' : '[ XLSX_EXPORT_RX ]'}</span>
                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>
                            <button
                                onClick={async () => {
                                    const allData = await getExportData();
                                    exportActivosPDF(allData, funcionarios, filterFuncionario);
                                }}
                                disabled={isExporting}
                                className="bg-bg-surface border-4 border-border-default px-8 py-4 text-[12px] font-black text-text-muted hover:text-text-primary hover:border-text-accent disabled:opacity-20 uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-90 group/btn relative overflow-hidden"
                            >
                                <span className="relative z-10">{isExporting ? 'SYNCING_BUFFER...' : '[ PDF_REPORT_GEN ]'}</span>
                                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    )}
                    {canEdit && (
                        <button 
                            type="button" 
                            onClick={handleCreate} 
                            className="bg-text-primary border-4 border-text-primary px-12 py-6 text-[13px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.6em] transition-all shadow-[0_0_60px_rgba(var(--text-primary),0.2)] hover:shadow-[0_0_80px_rgba(var(--text-accent),0.3)] hover:scale-105 active:scale-95 group/spawn relative overflow-hidden ring-4 ring-inset ring-black/5"
                        >
                            <span className="relative z-10 group-hover/spawn:tracking-[0.8em] transition-all flex items-center gap-6">
                                [ + ] SPAWN_NEW_ASSET_NODE 
                                <span className="opacity-40 group-hover/spawn:translate-x-4 transition-all inline-block">&rsaquo;&rsaquo;</span>
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/spawn:opacity-100 transition-opacity"></div>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Enclave Layer - Standardized v4 */}
            <div className="mt-16 bg-bg-base/30 p-8 border-4 border-dashed border-border-default/20 hover:border-text-accent/10 transition-all shadow-inner">
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

            {/* Data Pipeline Result Stream Viewport */}
            <div className="mt-16 relative">
                {loading && (
                    <div className="absolute inset-0 z-50 bg-bg-base/80 backdrop-blur-md flex flex-col items-center justify-center p-32 font-mono border-4 border-border-default/20 animate-fadeIn">
                         <div className="w-24 h-24 border-8 border-border-default border-t-text-accent animate-spin rounded-full mb-12 shadow-[0_0_60px_rgba(var(--text-accent),0.3)]"></div>
                         <div className="text-[18px] uppercase tracking-[1.4em] text-text-accent font-black animate-pulse text-center"># RX_STREAMING_BUFFER_IO...</div>
                         <div className="mt-8 text-[11px] text-text-muted uppercase tracking-[0.8em] opacity-40 italic border-l-4 border-border-default/30 pl-8">VERIFYING_NODE_CONSISTENCY_CHECKUM // 0xFD42</div>
                         <div className="mt-14 w-80 h-[4px] bg-bg-surface border border-border-default overflow-hidden">
                             <div className="h-full bg-text-accent animate-progressBar"></div>
                         </div>
                    </div>
                )}

                {!loading && activos.length === 0 ? (
                    <div className="bg-bg-surface border-8 border-border-default p-32 text-center shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group/empty animate-fadeIn">
                         <div className="absolute top-0 right-0 p-12 opacity-5 text-4xl font-black uppercase tracking-[1.5em] group-hover/empty:text-text-accent group-hover:opacity-10 transition-all pointer-events-none italic italic">0x00_IO_MANIFEST_EMPTY</div>
                         <div className="inline-block p-16 bg-bg-base border-4 border-dashed border-border-default/40 shadow-inner group-hover/empty:border-text-accent transition-colors duration-700 relative">
                              <span className="text-6xl text-text-accent opacity-20 block mb-10 group-hover/empty:scale-150 transition-transform">!</span>
                              <p className="text-[20px] font-black text-text-muted uppercase tracking-[0.8em] mb-6 group-hover/empty:text-text-primary transition-colors">! NULL_STREAM_DETECTED_IN_RX</p>
                              <p className="text-[12px] text-text-muted uppercase tracking-[0.5em] opacity-40 italic">ADJUST_QUERY_FILTERS_OR_GENERATE_NEW_ASSET_NODE_IO</p>
                         </div>
                    </div>
                ) : (
                    <div className="space-y-16">
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

            {/* Pagination Buffer Management Control */}
            {!loading && activos.length > 0 && (
                <div className="mt-16 border-t-8 border-border-default pt-14 bg-bg-surface/30 p-12 shadow-inner border-x-4">
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

            {/* Bridge Integration Portals (Modals) */}
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

            {/* Controller Identity Footer Access Point */}
            <div className="mt-32 flex flex-col sm:flex-row justify-between items-center gap-12 p-16 bg-bg-surface/60 border-8 border-border-default opacity-40 shadow-[inner_0_10px_40px_rgba(0,0,0,0.5)] group/footer hover:opacity-100 transition-all duration-1000 group hover:border-text-accent/20">
                <div className="text-[13px] font-black text-text-muted uppercase tracking-[1em] flex items-center gap-8 group-hover:text-text-primary transition-all">
                     <div className="w-5 h-5 bg-text-accent rotate-45 animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.7)] group-hover:rotate-180 transition-transform duration-1000"></div>
                     INVENTORY_MASTER_CONTROLLER_v4.2 // HASH_0x88FE_STABLE
                </div>
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[0.5em] italic flex items-center gap-10">
                     <div className="w-[3px] h-10 bg-border-default opacity-30"></div>
                     COLOMBIA_IT_NODE_MANAGER_AF22 // ACCESS_LVL: MASTER_RO_STREAM
                </div>
            </div>
        </div>
    );
};

export default ActivosList;
