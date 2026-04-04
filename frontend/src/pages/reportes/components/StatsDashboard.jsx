export const StatCard = ({ label, value }) => {
    return (
        <div className="bg-bg-surface border-4 border-border-default p-10 font-mono group hover:border-text-accent transition-all duration-500 shadow-[0_30px_90px_rgba(0,0,0,0.5)] relative overflow-hidden active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black uppercase tracking-[1em] group-hover:opacity-20 transition-all italic">STATS_NODE_RX</div>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-text-accent opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(var(--text-accent),0.4)]"></div>
            
            <div className="text-4xl font-black text-text-primary uppercase tracking-tighter group-hover:text-text-accent transition-all transform group-hover:scale-105 origin-left tabular-nums drop-shadow-xl">
                {value}
            </div>
            
            <div className="text-[10px] text-text-muted mt-6 uppercase tracking-[0.4em] font-black border-t-4 border-border-default/40 pt-6 flex items-center justify-between">
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">:: {label.toUpperCase().replace(/ /g, '_')}</span>
                <span className="text-text-accent opacity-0 group-hover:opacity-100 transition-opacity animate-pulse shadow-[0_0_8px_rgba(var(--text-accent),0.5)] bg-text-accent/10 px-2 border border-text-accent/20">0xV_DATA</span>
            </div>
        </div>
    );
};

export const StatsTable = ({ title, data, keyField, valueField }) => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, item) => sum + (item[valueField] || 0), 0);
    
    return (
        <div className="bg-bg-surface border-4 border-border-default font-mono overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] group hover:border-text-accent transition-all duration-500 relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-[2em] group-hover:opacity-15 transition-all italic">MAP_BUFFER_RX_v4</div>
            
            <div className="px-10 py-8 bg-bg-base border-b-4 border-border-default flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-6">
                    <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_8px_rgba(var(--text-accent),0.5)]"></div>
                    <h4 className="text-[12px] font-black text-text-primary uppercase tracking-[0.5em]">/ {title.toUpperCase().replace(/ /g, '_')}</h4>
                </div>
                <div className="text-[10px] font-black text-text-muted opacity-40 uppercase tracking-[0.4em] italic bg-bg-surface px-4 py-1 border border-border-default shadow-inner">BUFF_SYNC_OK</div>
            </div>
            
            <div className="divide-y-2 divide-border-default/10 bg-bg-base/30">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-10 py-6 hover:bg-bg-elevated/40 transition-all group/row relative overflow-hidden group border-l-4 border-l-transparent hover:border-l-text-accent">
                        <div className="flex flex-col gap-2 relative z-10">
                            <span className="text-[14px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-all group-hover/row:tracking-widest truncate max-w-[250px] drop-shadow-sm">
                                {item[keyField]?.toUpperCase() || 'NULL_NODE'}
                            </span>
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40 bg-bg-base w-fit px-2 border border-border-default/30 shadow-inner italic">NODE_REF_{idx.toString().padStart(3, '0')}</span>
                        </div>
                        
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="w-48 h-3 bg-bg-base border-2 border-border-default/60 overflow-hidden hidden sm:block relative shadow-inner group-hover:border-text-accent/20 transition-colors">
                                <div 
                                    className="h-full bg-text-accent opacity-20 group-hover/row:opacity-100 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--text-accent),0.3)]" 
                                    style={{ width: `${(item[valueField] / total) * 100}%` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-full h-[1px] bg-white/5"></div>
                                </div>
                            </div>
                            <span className="text-[14px] font-black text-text-primary w-24 text-right tabular-nums tracking-widest group-hover/row:text-text-accent transition-all drop-shadow-sm">
                                [{item[valueField].toString().padStart(4, '0')}]
                            </span>
                        </div>
                        {/* Interactive scanline on hover */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r from-transparent via-text-accent to-transparent -translate-x-full group-hover:animate-loadingBar"></div>
                    </div>
                ))}
            </div>

            <div className="px-10 py-5 bg-bg-base border-t-4 border-border-default/40 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.6em] italic flex items-center gap-4">
                    <div className="w-2 h-2 bg-text-accent animate-pulse"></div>
                    AGGREGATE_TOTAL_SUM_IO
                 </span>
                 <span className="text-[13px] font-black text-text-primary uppercase tracking-[0.3em] bg-bg-surface px-6 py-2 border-2 border-border-default shadow-xl tabular-nums">
                    0x{total.toString().padStart(6, '0')}
                 </span>
            </div>
        </div>
    );
};

export const StatsDashboard = ({ statsData, loading, onBack, onFetch }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-10 font-mono animate-fadeIn pb-32">
            {/* Header / Analytics Hub Interface */}
            <div className="mb-16 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-12 pb-12 border-b-4 border-border-default/50 group">
                <div className="flex items-center gap-10">
                    <button 
                        onClick={onBack} 
                        className="bg-bg-surface border-4 border-border-default px-10 py-5 text-[12px] font-black text-text-muted hover:text-text-primary hover:border-text-accent uppercase tracking-[0.5em] transition-all shadow-3xl active:scale-90 group/back relative overflow-hidden shrink-0"
                    >
                        <span className="relative z-10 group-hover/back:-translate-x-2 transition-transform inline-block">
                             &laquo; [ RETURN_HUB ]
                        </span>
                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/back:opacity-100 transition-opacity"></div>
                    </button>
                    <div className="h-16 w-[2px] bg-border-default opacity-20 hidden sm:block"></div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-[0.6em] text-text-primary leading-none flex items-center gap-6">
                            <span className="text-text-accent opacity-20">/</span> heuristic_kernel
                        </h1>
                        <p className="text-[11px] text-text-muted uppercase tracking-[0.4em] mt-5 opacity-50 bg-bg-base px-6 py-1 border border-border-default italic shadow-inner w-fit">KERNEL_REALTIME_STREAM: ACTIVE // SCANNING_POOL_DATA_0xFD42</p>
                    </div>
                </div>
                <button 
                    onClick={onFetch} 
                    disabled={loading}
                    className="bg-text-primary border-4 border-text-primary px-14 py-6 text-[13px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.8em] transition-all shadow-[0_0_60px_rgba(var(--text-primary),0.2)] disabled:opacity-20 active:scale-95 group/scan relative overflow-hidden ring-4 ring-inset ring-black/5"
                >
                    {loading && <div className="absolute inset-0 bg-white/10 animate-loadingBar"></div>}
                    <span className="relative z-10 flex items-center gap-6 group-hover/scan:tracking-[1em] transition-all">
                        {loading ? 'SYNCING_BUFFER...' : '[ EXECUTE_RESCAN_TX ]'}
                        {!loading && <span className="opacity-40 group-hover/scan:translate-x-4 transition-all">&rsaquo;&rsaquo;</span>}
                    </span>
                </button>
            </div>

            {statsData && !loading ? (
                <div className="space-y-20">
                    {/* Primary Metrics Enclave */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        <StatCard label="Total Activos" value={statsData.totalActivos} />
                        <StatCard label="Mantenimientos" value={statsData.totalMantenimientos} />
                        <StatCard label="Costo Total" value={`$${Number(statsData.costoTotalMantenimiento).toLocaleString().replace(/ /g, '_')}`} />
                        <StatCard label="Regional Categories" value={statsData.porCategoria?.length || 0} />
                    </div>

                    {/* Data Visualization Grid Manifest */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <StatsTable title="Distribution by Status" data={statsData.porEstado} keyField="estado" valueField="cantidad" />
                        <StatsTable title="Distribution by Entity" data={statsData.porEmpresa} keyField="empresa" valueField="cantidad" />
                        <StatsTable title="Distribution by Type" data={statsData.porTipoEquipo} keyField="tipo" valueField="cantidad" />
                        <StatsTable title="Distribution by Classification" data={statsData.porCategoria} keyField="nombre" valueField="cantidad" />
                        <StatsTable title="Operational Health Matrix" data={statsData.porEstadoOperativo} keyField="estado" valueField="cantidad" />
                    </div>

                    {/* Footer / Identity segment */}
                    <div className="pt-20 border-t-4 border-border-default/20 flex flex-col sm:flex-row justify-between items-center gap-10 opacity-30 text-[10px] font-black uppercase tracking-[1em] italic group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-6">
                            <div className="w-4 h-4 bg-border-strong rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                            CORE_SYNC_READY // FRAGMENTATION_ACK
                        </div>
                        <span className="animate-pulse text-text-accent">_LISTENING_FOR_TX_EVENT_STREAMS...</span>
                    </div>
                </div>
            ) : loading ? (
                 <div className="flex flex-col items-center justify-center p-48 bg-bg-surface border-4 border-border-default shadow-3xl animate-fadeIn">
                      <div className="w-20 h-20 border-8 border-border-default border-t-text-accent animate-spin rounded-full mb-12 shadow-[0_0_40px_rgba(var(--text-accent),0.2)]"></div>
                      <p className="text-[16px] font-black text-text-accent uppercase tracking-[1.2em] animate-pulse"># INITIALIZING_ANALYTIC_CORE...</p>
                 </div>
            ) : null}
        </div>
    );
};
