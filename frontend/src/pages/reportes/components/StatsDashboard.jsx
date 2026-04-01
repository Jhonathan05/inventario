export const StatCard = ({ label, value, color }) => {
    const colors = { indigo: 'bg-indigo-50 text-indigo-700', yellow: 'bg-yellow-50 text-yellow-700', green: 'bg-green-50 text-green-700', blue: 'bg-blue-50 text-blue-700' };
    return (
        <div className={`rounded-xl p-5 ${colors[color] || colors.indigo}`}>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm mt-1 opacity-80">{label}</div>
        </div>
    );
};

export const StatsTable = ({ title, data, keyField, valueField }) => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, item) => sum + (item[valueField] || 0), 0);
    return (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b"><h4 className="text-sm font-semibold text-gray-800">{title}</h4></div>
            <div className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm text-gray-700">{item[keyField] || 'N/A'}</span>
                        <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(item[valueField] / total) * 100}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">{item[valueField]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatsDashboard = ({ statsData, loading, onBack, onFetch }) => {
    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">← Volver</button>
                    <h1 className="text-xl font-semibold text-gray-900">📊 Resumen Estadístico</h1>
                </div>
                <button onClick={onFetch} disabled={loading}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                    {loading ? 'Cargando...' : 'Generar Estadísticas'}
                </button>
            </div>
            {statsData && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Activos" value={statsData.totalActivos} color="indigo" />
                        <StatCard label="Mantenimientos" value={statsData.totalMantenimientos} color="yellow" />
                        <StatCard label="Costo Total Mant." value={`$${Number(statsData.costoTotalMantenimiento).toLocaleString()}`} color="green" />
                        <StatCard label="Categorías" value={statsData.porCategoria?.length || 0} color="blue" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatsTable title="Por Estado" data={statsData.porEstado} keyField="estado" valueField="cantidad" />
                        <StatsTable title="Por Empresa" data={statsData.porEmpresa} keyField="empresa" valueField="cantidad" />
                        <StatsTable title="Por Tipo de Equipo" data={statsData.porTipoEquipo} keyField="tipo" valueField="cantidad" />
                        <StatsTable title="Por Categoría" data={statsData.porCategoria} keyField="nombre" valueField="cantidad" />
                        <StatsTable title="Por Estado Operativo" data={statsData.porEstadoOperativo} keyField="estado" valueField="cantidad" />
                    </div>
                </div>
            )}
        </div>
    );
};
