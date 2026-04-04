import { useReportes } from './useReportes';
import { ReportTypeSelector } from './components/ReportTypeSelector';
import { StatsDashboard } from './components/StatsDashboard';
import { ReportFilters } from './components/ReportFilters';
import { ReportProfiles } from './components/ReportProfiles';
import { ReportColumns } from './components/ReportColumns';
import { ReportPreview } from './components/ReportPreview';
import { PerfilModal } from './components/PerfilModal';

const Reportes = () => {
    const {
        selectedReport, setSelectedReport,
        columns,
        rawData,
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
    } = useReportes();

    if (!selectedReport) {
        return <ReportTypeSelector onSelect={setSelectedReport} />;
    }

    if (selectedReport.id === 'estadisticas') {
        return (
            <StatsDashboard 
                statsData={statsData} 
                loading={loading} 
                onBack={() => setSelectedReport(null)} 
                onFetch={fetchData} 
            />
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-12 font-mono animate-fadeIn mb-40 border-l-8 border-l-border-default/10">
            {/* Header / Report IO Controller RX Premium */}
            <div className="mb-16 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-12 pb-16 border-b-8 border-border-default group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[3em] group-hover:opacity-20 group-hover:translate-x-8 transition-all duration-1000 italic">REPORT_CONTROLLER_v4.2</div>
                <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-30 animate-pulse"></div>
                
                <div className="flex items-center gap-10 relative z-10">
                    <button 
                        onClick={() => setSelectedReport(null)} 
                        className="text-text-muted hover:text-text-primary uppercase tracking-[0.6em] font-black text-[13px] border-4 border-border-default px-10 py-5 bg-bg-base transition-all hover:border-text-accent hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] shrink-0 active:scale-90 group/back relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/back:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 flex items-center">
                            <span className="group-hover/back:-translate-x-3 transition-all duration-700 inline-block mr-4 italic">&laquo;</span> 
                            <span>BACK_TO_HUB</span>
                        </span>
                    </button>
                    <div className="h-16 w-[4px] bg-border-default/20 mx-4"></div>
                    <div>
                        <div className="flex items-center gap-6 mb-3">
                             <div className="w-3 h-3 bg-text-accent animate-ping opacity-60"></div>
                             <h1 className="text-4xl font-black uppercase tracking-[0.4em] text-text-primary flex items-center gap-6">
                                <span className="opacity-10 group-hover:opacity-40 group-hover:text-text-accent transition-all duration-1000">/</span>
                                {selectedReport.name.replace(/ /g, '_')}
                            </h1>
                        </div>
                        <p className="text-[12px] text-text-muted uppercase tracking-[0.5em] mt-2 opacity-40 italic border-l-4 border-border-default/30 pl-6 group-hover:opacity-80 transition-opacity">
                            MODULE_INIT: {selectedReport.id.toUpperCase()} // IO_BUFF_RX_READY_v4
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-8 bg-bg-surface border-4 border-border-default p-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group/controls hover:border-text-accent transition-all duration-700">
                    <button 
                        onClick={fetchData} 
                        disabled={loading}
                        className="bg-text-primary border-4 border-text-primary px-12 py-5 text-[13px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.8em] transition-all disabled:opacity-20 active:scale-95 relative overflow-hidden group/gen italic"
                    >
                        {loading && <div className="absolute inset-0 bg-white/20 animate-loadingBarSlow"></div>}
                        <span className="relative z-10 flex items-center gap-6 not-italic">
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-bg-base border-t-transparent animate-spin"></div>
                                    <span>STREAM_INIT...</span>
                                </>
                            ) : (
                                <>
                                    <span className="opacity-40">#</span>
                                    <span>{rawData.length > 0 ? 'RELOAD_DATA_TX' : 'EXECUTE_REPORT_GEN'}</span>
                                </>
                            )}
                        </span>
                    </button>
                    {previewData.length > 0 && (
                        <button 
                            onClick={handleExport}
                            className="bg-bg-elevated border-4 border-border-strong px-12 py-5 text-[13px] font-black text-text-primary hover:text-text-accent hover:border-text-accent hover:bg-bg-base uppercase tracking-[0.6em] transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] active:scale-95 group/export"
                        >
                            <span className="flex items-center gap-6">
                                <span className="text-text-accent opacity-40 group-hover/export:animate-bounce">&darr;</span>
                                <span>EXPORT_XLSX: {previewData.length.toString().padStart(4, '0')}</span>
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-16 relative">
                {/* Control Enclave RX */}
                <div className="xl:col-span-1 space-y-16">
                    <div className="bg-bg-surface border-4 border-border-default p-12 shadow-[0_60px_150px_rgba(0,0,0,0.7)] relative overflow-hidden group/filter hover:border-text-accent/20 transition-all duration-1000">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-xl font-black uppercase tracking-[1em] pointer-events-none group-hover/filter:opacity-20 transition-opacity italic">IO_PARAM_HOOK_0xFD</div>
                        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-text-accent/40 to-transparent"></div>
                        
                        <div className="flex items-center gap-6 border-b-4 border-border-default pb-6 mb-12">
                            <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base shadow-xl italic">&sigma;</div>
                            <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-text-primary italic opacity-80 leading-none">
                                # FILTER_CONTROL_LAYER
                            </h3>
                        </div>
                        
                        <ReportFilters 
                            selectedReport={selectedReport}
                            filters={filters}
                            setFilters={setFilters}
                            catalogs={catalogs}
                        />
                    </div>

                    <ReportProfiles 
                        perfiles={perfiles}
                        selectedPerfil={selectedPerfil}
                        applyPerfil={applyPerfil}
                        handleEditPerfil={handleEditPerfil}
                        handleUpdatePerfilColumns={handleUpdatePerfilColumns}
                        handleDeletePerfil={handleDeletePerfil}
                        selectedColumns={selectedColumns}
                        onNewPerfil={() => { 
                            setEditingPerfil(null); 
                            setPerfilForm({ nombre: '', descripcion: '' }); 
                            setShowPerfilModal(true); 
                        }}
                    />

                    <ReportColumns 
                        columns={columns}
                        groups={groups}
                        selectedColumns={selectedColumns}
                        toggleColumn={toggleColumn}
                        selectAll={selectAll}
                        selectNone={selectNone}
                        selectDefaults={selectDefaults}
                        moveColumn={moveColumn}
                    />
                </div>

                {/* Preview Enclave RX */}
                <div className="xl:col-span-3">
                    {previewData.length === 0 && !loading && (
                        <div className="bg-bg-surface border-8 border-border-default p-24 text-center h-full flex flex-col items-center justify-center min-h-[700px] shadow-[inset_0_40px_150px_rgba(0,0,0,0.5)] relative overflow-hidden group/preview hover:border-text-accent/10 transition-all duration-1000">
                            <div className="absolute top-0 right-0 p-12 opacity-5 text-3xl font-black uppercase tracking-[2em] group-hover/preview:text-text-accent group-hover/preview:opacity-20 transition-all italic duration-1000">VIRTUAL_IO_PORT_0XFD</div>
                            <div className="text-[200px] mb-20 opacity-5 scale-150 grayscale group-hover:scale-110 group-hover:opacity-10 transition-all duration-2000 rotate-12 group-hover:rotate-0 saturate-0">{selectedReport.icon}</div>
                            
                            <div className="relative z-10 space-y-10 max-w-3xl">
                                <h3 className="text-4xl font-black text-text-primary mb-6 uppercase tracking-[0.4em] italic group-hover:not-italic transition-all duration-700">INITIATE_SYSTEM_PARAMETERIZATION</h3>
                                <div className="h-1 bg-text-accent/20 w-48 mx-auto relative overflow-hidden">
                                     <div className="absolute inset-0 bg-text-accent animate-loadingBarSlow"></div>
                                </div>
                                <p className="text-[14px] text-text-muted uppercase tracking-[0.5em] mb-12 leading-[2.5] opacity-60">
                                    APPLY_ORDER_PROFILE_STREAM OR MANUALLY_SUTURE_COLUMNS_THEN_EXECUTE_TX: 
                                    <br/>
                                    <span className="text-text-accent inline-block mt-10 border-4 border-text-accent/40 px-12 py-6 bg-text-accent/5 animate-pulse shadow-[0_0_80px_rgba(var(--text-accent),0.2)] font-black italic tracking-[0.8em] hover:scale-110 active:scale-95 transition-all cursor-pointer" onClick={fetchData}>
                                        [ GENERATE_REPORT_CALL_0xFD ]
                                    </span>
                                </p>
                            </div>
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-10 text-[9px] font-black uppercase tracking-[2em] italic transition-opacity group-hover/preview:opacity-30">ESTABLISHING_DATA_SUTURE_v4.2</div>
                        </div>
                    )}

                    <ReportPreview 
                        previewData={previewData}
                        selectedColumns={selectedColumns}
                        loading={loading}
                        selectedPerfil={selectedPerfil}
                    />
                </div>
            </div>

            <PerfilModal 
                show={showPerfilModal}
                onClose={() => setShowPerfilModal(false)}
                editingPerfil={editingPerfil}
                perfilForm={perfilForm}
                setPerfilForm={setPerfilForm}
                perfilError={perfilError}
                onSave={handleSavePerfil}
                selectedColumnsCount={selectedColumns.length}
            />

            {/* High-Fidelity Footer Identifier RX */}
            <div className="mt-32 flex flex-col xl:flex-row justify-between items-center gap-12 p-16 bg-bg-surface/80 border-8 border-border-default opacity-40 shadow-[inset_0_20px_100px_rgba(0,0,0,0.5)] group/footer hover:opacity-100 hover:border-text-accent/30 transition-all duration-1000 relative overflow-hidden">
                <div className="absolute top-0 right-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] animate-shine"></div>
                <div className="text-[13px] font-black text-text-muted uppercase tracking-[0.8em] flex items-center gap-8 group-hover/footer:text-text-primary transition-all">
                     <div className="w-5 h-5 bg-text-accent rotate-45 animate-pulse shadow-[0_0_20px_rgba(var(--text-accent),0.8)] group-hover/footer:rotate-180 transition-transform duration-1000"></div>
                     REPORTING_LAYER_KERNEL_AGENT // SESSION_NODE: 0xFD44_SYNCED
                </div>
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[0.6em] italic flex items-center gap-12 group-hover/footer:text-text-accent transition-all duration-700">
                     <div className="w-16 h-[3px] bg-border-default opacity-30 group-hover/footer:w-32 group-hover/footer:bg-text-accent transition-all duration-1000"></div>
                     BI_ANALYTICS_MANIFEST_v4.2 // MASTER_RX_CLEARANCE
                </div>
            </div>
        </div>
    );
};

export default Reportes;
