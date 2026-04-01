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
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedReport(null)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Volver</button>
                    <h1 className="text-xl font-semibold text-gray-900">{selectedReport.icon} {selectedReport.name}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={fetchData} disabled={loading}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                        {loading ? 'Cargando...' : rawData.length > 0 ? '🔄 Actualizar' : '▶ Generar Reporte'}
                    </button>
                    {previewData.length > 0 && (
                        <button onClick={handleExport}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">
                            📤 Exportar Excel ({previewData.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Columna Izquierda */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">🔍 Filtros</h3>
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

                {/* Columna Derecha: Vista previa */}
                <div className="lg:col-span-3">
                    {previewData.length === 0 && !loading && (
                        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 p-12 text-center">
                            <div className="text-4xl mb-3">{selectedReport.icon}</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Configura tu reporte</h3>
                            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                                Aplica un <strong>perfil de orden</strong> o selecciona columnas manually,
                                luego presiona <strong>"Generar Reporte"</strong>.
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
        </div>
    );
};

export default Reportes;
