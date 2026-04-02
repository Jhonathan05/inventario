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
        <div className="px-4 sm:px-6 lg:px-8 font-mono animate-fadeIn mb-24">
            {/* Header / Report IO Controller */}
            <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-10 border-b-2 border-border-default group">
                <div className="flex items-center gap-8 relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-text-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button 
                        onClick={() => setSelectedReport(null)} 
                        className="text-text-muted hover:text-text-primary uppercase tracking-[0.4em] font-black text-[11px] border-2 border-border-default px-6 py-3 bg-bg-base transition-all hover:border-text-accent hover:shadow-xl shrink-0 active:scale-95 group/back"
                    >
                        <span className="group-hover/back:-translate-x-1 transition-transform inline-block mr-2">&lt;</span> BACK_TO_HUB
                    </button>
                    <div className="h-10 w-[1px] bg-border-default mx-2"></div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-[0.4em] text-text-primary flex items-center gap-4">
                            <span className="opacity-20 group-hover:opacity-100 group-hover:text-text-accent transition-all animate-pulse">/</span>
                            {selectedReport.name.replace(/ /g, '_')}
                        </h1>
                        <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] mt-3 opacity-60">MODULE_INITIALIZED: {selectedReport.id.toUpperCase()} // BUFF_RX_READY</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6 bg-bg-surface border border-border-default p-4 shadow-xl">
                    <button onClick={fetchData} disabled={loading}
                        className="bg-text-primary border-2 border-text-primary px-8 py-3 text-[11px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.5em] transition-all disabled:opacity-20 active:scale-95 relative overflow-hidden group/gen">
                        {loading && <div className="absolute inset-0 bg-text-accent/20 animate-loadingBar"></div>}
                        <span className="relative z-10">{loading ? '[ INITIALIZING_STREAM... ]' : rawData.length > 0 ? '[ RELOAD_DATA_TX ]' : '[ EXECUTE_REPORT_GEN ]'}</span>
                    </button>
                    {previewData.length > 0 && (
                        <button onClick={handleExport}
                            className="bg-bg-elevated border-2 border-border-strong px-8 py-3 text-[11px] font-black text-text-primary hover:text-text-accent uppercase tracking-[0.5em] transition-all shadow-xl active:scale-95">
                            [ EXPORT_XLSX: {previewData.length.toString().padStart(3, '0')} ]
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Control Enclave */}
                <div className="lg:col-span-1 space-y-10">
                    <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group/filter hover:border-border-strong transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black uppercase tracking-tighter group-hover/filter:opacity-20 transition-opacity">IO_PARAM_HOOK</div>
                        <h3 className="text-[11px] font-black text-text-accent uppercase tracking-[0.4em] mb-10 border-b border-border-default pb-4 flex items-center gap-4">
                            <div className="w-2 h-2 bg-text-accent"></div>
                            # FILTER_CONTROL_LAYER
                        </h3>
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

                {/* Preview Enclave */}
                <div className="lg:col-span-3">
                    {previewData.length === 0 && !loading && (
                        <div className="bg-bg-surface border-2 border-border-default p-16 text-center h-full flex flex-col items-center justify-center min-h-[500px] shadow-3xl relative overflow-hidden group/preview">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-xs font-black uppercase tracking-[1em] group-hover/preview:text-text-accent transition-colors">VIRTUAL_IO_PORT_0X9</div>
                            <div className="text-8xl mb-12 opacity-5 scale-150 grayscale group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000 rotate-12">{selectedReport.icon}</div>
                            <h3 className="text-[16px] font-black text-text-primary mb-6 uppercase tracking-[0.6em] relative z-10">INITIATE_SYSTEM_PARAMETERIZATION</h3>
                            <p className="text-[11px] text-text-muted uppercase tracking-[0.3em] mb-12 max-w-lg mx-auto leading-relaxed relative z-10 opacity-60">
                                APPLY_ORDER_PROFILE_STREAM OR MANUALLY_SUTURE_COLUMNS_THEN_EXECUTE: 
                                <br/><span className="text-text-accent inline-block mt-4 border border-text-accent/30 px-6 py-2 bg-text-accent/5 animate-pulse">[ GENERATE_REPORT_CALL ]</span>
                            </p>
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

            {/* Footer Identifier */}
            <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-8 p-10 bg-bg-surface/40 border border-border-default opacity-40 shadow-inner group/footer">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] flex items-center gap-4">
                     <div className="w-2 h-2 bg-text-accent rotate-45 animate-pulse shadow-[0_0_8px_rgba(255,51,102,0.5)]"></div>
                     REPORTING_LAYER_AGENT // SESSION: 0xFD44
                </div>
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] italic group-hover:text-text-primary transition-colors">
                     BI_ANALYTICS_MANIFEST // ACCESS_LEVEL: MASTER
                </div>
            </div>
        </div>
    );
};

export default Reportes;
