export const StatCard = ({ label, value }) => {
    return (
        <div className="bg-bg-surface border border-border-default p-8 font-mono group hover:border-text-accent transition-all shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest">DATA_NODE</div>
            <div className="text-3xl font-black text-text-primary uppercase tracking-tight group-hover:text-text-accent transition-colors transform group-hover:scale-105 origin-left">
                {value}
            </div>
            <div className="text-[9px] text-text-muted mt-4 uppercase tracking-[0.25em] font-black border-t border-border-default/30 pt-4 flex items-center justify-between">
                <span>:: {label.replace(/ /g, '_')}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">0xVAL</span>
            </div>
        </div>
    );
};

export const StatsTable = ({ title, data, keyField, valueField }) => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, item) => sum + (item[valueField] || 0), 0);
    return (
        <div className="bg-bg-surface border border-border-default font-mono overflow-hidden shadow-2xl group hover:border-border-strong transition-all">
            <div className="px-8 py-5 bg-bg-base border-b border-border-default flex items-center justify-between">
                <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.4em]">/ {title.replace(/ /g, '_')}</h4>
                <div className="text-[8px] font-black text-text-muted opacity-40 uppercase tracking-widest">MAP_BUFFER_RX</div>
            </div>
            <div className="divide-y divide-border-default/20">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-8 py-5 hover:bg-bg-elevated/30 transition-all group/row">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors truncate max-w-[200px]">
                                {item[keyField] || 'NULL_NODE'}
                            </span>
                            <span className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40">NODE_REF_{idx.toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-2 bg-bg-base border border-border-default overflow-hidden hidden sm:block relative">
                                <div 
                                    className="h-full bg-text-accent opacity-30 group-hover/row:opacity-100 transition-opacity" 
                                    style={{ width: `${(item[valueField] / total) * 100}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
                                    <div className="w-full h-px bg-white/20"></div>
                                </div>
                            </div>
                            <span className="text-[11px] font-black text-text-primary w-16 text-right font-mono tracking-widest group-hover/row:text-text-accent transition-colors">
                            [{item[valueField].toString().padStart(3, '0')}]
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="px-8 py-3 bg-bg-base/30 border-t border-border-default/20 flex justify-between">
                 <span className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40">AGGREGATE_TOTAL_SUM</span>
                 <span className="text-[9px] font-black text-text-primary uppercase tracking-widest">0x{total.toString().padStart(4, '0')}</span>
            </div>
        </div>
    );
};

export const StatsDashboard = ({ statsData, loading, onBack, onFetch }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 font-mono animate-fadeIn pb-20">
            {/* Header section copied from parent for consistency but with details */}
            <div className="mb-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 pb-10 border-b border-border-default/50">
                <div className="flex items-center gap-8">
                    <button onClick={onBack} className="bg-bg-base border border-border-default px-6 py-3 text-[10px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.4em] transition-all shadow-xl hover:border-text-accent group">
                        <span className="group-hover:text-text-accent mr-2 transition-colors">&larr;</span> [ RETURN ]
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-[0.4em] text-text-primary leading-tight">/ heuristic_analytics_kernel</h1>
                        <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] mt-3 opacity-60">KERNEL_REALTIME_STREAM: ACTIVE // SCANNING_POOL_DATA</p>
                    </div>
                </div>
                <button onClick={onFetch} disabled={loading}
                    className="bg-bg-elevated border border-border-strong px-10 py-4 text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.4em] transition-all shadow-2xl disabled:opacity-30 hover:scale-105 active:scale-95"
                >
                    {loading ? '[ SYNCING_BUFFER... ]' : '[ EXECUTE_RESCAN ]'}
                </button>
            </div>

            {statsData && (
                <div className="space-y-12">
                    {/* Primary Metrics Layer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard label="Total Activos" value={statsData.totalActivos} />
                        <StatCard label="Mantenimientos" value={statsData.totalMantenimientos} />
                        <StatCard label="Costo Total Mant." value={`$${Number(statsData.costoTotalMantenimiento).toLocaleString()}`} />
                        <StatCard label="Categorías" value={statsData.porCategoria?.length || 0} />
                    </div>

                    {/* Data Visualization Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                        <StatsTable title="Por Estado" data={statsData.porEstado} keyField="estado" valueField="cantidad" />
                        <StatsTable title="Por Empresa" data={statsData.porEmpresa} keyField="empresa" valueField="cantidad" />
                        <StatsTable title="Por Tipo de Equipo" data={statsData.porTipoEquipo} keyField="tipo" valueField="cantidad" />
                        <StatsTable title="Por Categoría" data={statsData.porCategoria} keyField="nombre" valueField="cantidad" />
                        <StatsTable title="Por Estado Operativo" data={statsData.porEstadoOperativo} keyField="estado" valueField="cantidad" />
                    </div>

                    {/* Footer / Status segment */}
                    <div className="pt-10 border-t border-border-default/20 flex flex-col sm:flex-row justify-between items-center opacity-30 text-[8px] font-black uppercase tracking-[0.4em]">
                        <span>CORE_READY // WAIT_FOR_SIG_UPDATE</span>
                        <span className="animate-pulse">_LISTENING_FOR_EVENT_STREAMS</span>
                    </div>
                </div>
            )}
        </div>
    );
};
