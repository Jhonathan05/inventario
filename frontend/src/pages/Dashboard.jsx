import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import DashboardCharts from './dashboard/components/DashboardCharts';
import RecentActivity from './dashboard/components/RecentActivity';

const Dashboard = () => {
    const { data, isLoading: loading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => api.get('/dashboard/summary').then(r => r.data),
        staleTime: 1000 * 60 * 2,
    });

    if (loading) return (
        <div className="p-32 text-center font-mono animate-fadeIn flex flex-col items-center justify-center min-h-[70vh]">
            <div className="inline-flex flex-col items-center gap-12">
                <div className="w-24 h-24 border-8 border-border-default border-t-text-accent animate-spin rounded-full shadow-[0_0_60px_rgba(var(--text-accent),0.3)]"></div>
                <div className="space-y-6">
                    <div className="text-text-accent text-[18px] font-black uppercase tracking-[1.2em] animate-pulse">
                        # INITIALIZING_SYSTEM_MONITOR_v4.2
                    </div>
                    <div className="text-[11px] text-text-muted uppercase tracking-[0.6em] opacity-40 italic border-l-4 border-border-default/30 pl-8">
                        ESTABLISHING_SECURE_KERNEL_CONNECTION_0x00_AF22...
                    </div>
                </div>
            </div>
        </div>
    );

    if (!data) return (
        <div className="p-32 text-center font-mono animate-shake flex flex-col items-center justify-center min-h-[70vh]">
            <div className="inline-block p-16 border-8 border-text-accent bg-bg-base shadow-[0_0_150px_rgba(var(--text-accent),0.3)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-text-accent animate-pulse"></div>
                <div className="text-[22px] font-black text-text-accent uppercase tracking-[0.8em] mb-10 flex items-center justify-center gap-10">
                    <span className="text-5xl animate-bounce">!!!</span>
                    KERNEL_PANIC: DATA_STREAM_FAILURE
                    <span className="text-5xl animate-bounce">!!!</span>
                </div>
                <div className="text-[13px] text-text-muted uppercase tracking-[0.4em] opacity-70 bg-bg-surface py-4 px-8 border-2 border-text-accent/20">
                    REASON: BUFFER_OVERFLOW_OR_SERVICE_UNAVAILABLE_500 // ABORTING_PROC_SIGNAL_0
                </div>
            </div>
        </div>
    );

    const { stats, activity } = data;

    const availableCount = stats.byStatus.find(s => s.status === 'DISPONIBLE')?.count || 0;
    const assignedCount = stats.byStatus.find(s => s.status === 'ASIGNADO')?.count || 0;
    const maintenanceCount = stats.byStatus.find(s => s.status === 'EN_MANTENIMIENTO')?.count || 0;

    const cards = [
        {
            title: 'TOTAL_ASSETS_RECORDED',
            value: stats.totalAssets.toString().padStart(4, '0'),
            symbol: '#',
            accent: 'text-text-primary',
            meta: 'GLOB_REG_IDX_v4.2'
        },
        {
            title: 'SERVICE_AVAILABLE_NODES',
            value: availableCount.toString().padStart(4, '0'),
            symbol: '*',
            accent: 'text-text-accent font-black shadow-inner bg-text-accent/5 px-2 px-y-1',
            meta: 'READY_ST_TX_OK_PORT'
        },
        {
            title: 'ASSET_DEPLOYMENT_ACTIVE',
            value: assignedCount.toString().padStart(4, '0'),
            symbol: '/',
            accent: 'text-text-primary',
            meta: 'LIVE_NODES_STREAM_v4'
        },
        {
            title: 'SYSTEM_MAINTENANCE_LOCK',
            value: maintenanceCount.toString().padStart(4, '0'),
            symbol: '!',
            accent: maintenanceCount > 0 ? 'text-text-accent animate-pulse shadow-[0_0_25px_rgba(var(--text-accent),0.4)]' : 'text-text-muted opacity-30',
            meta: 'OFFLINE_PROC_LOCK_v4'
        },
        {
            title: 'SYSTEM_MTTR_LATENCY',
            value: `${stats.itsm.mttrHours}H`,
            symbol: '~',
            accent: 'text-text-primary',
            meta: 'AVG_REC_METRIC_v4'
        },
        {
            title: 'CRITICAL_EXCEPTIONS_IO',
            value: stats.itsm.ticketsCriticos.length.toString().padStart(2, '0'),
            symbol: '!!',
            accent: stats.itsm.ticketsCriticos.length > 0 ? 'text-text-accent animate-ping shadow-[0_0_25px_rgba(var(--text-accent),0.5)]' : 'text-text-muted opacity-30',
            meta: 'URGENT_HANDL_BUFFER'
        },
        {
            title: 'WARRANTY_COVERAGE_RATE',
            value: `${stats.itsm.percentGarantia}%`,
            symbol: '%',
            accent: 'text-text-primary',
            meta: 'PROT_ARRAY_CHECKSUM'
        },
        {
            title: 'CAPEX_TOTAL_VALUATION',
            value: formatCurrency(stats.totalValue).replace(/ /g, '_'),
            symbol: '$',
            accent: 'text-text-accent',
            meta: 'VALU_BUFFER_RX_v4'
        },
    ];

    return (
        <div className="font-mono space-y-20 animate-fadeIn mb-48 px-4 sm:px-6 lg:px-12 border-l-8 border-l-border-default/10">
            {/* Main Premium Command Bar */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-16 border-b-8 border-border-default pb-20 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-2xl font-black uppercase tracking-[3em] group-hover:opacity-20 group-hover:translate-x-8 transition-all duration-1000 italic">DASHBOARD_CONTROLLER_RX_v4.2</div>
                <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-30 animate-pulse"></div>
                
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-12 mb-10 group/title">
                         <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl rotate-45 group-hover:rotate-[225deg] transition-all duration-1000 shadow-[0_0_40px_rgba(var(--text-accent),0.4)] bg-bg-base">&alpha;</div>
                         <h1 className="text-8xl font-black uppercase tracking-[-0.05em] sm:tracking-[0.1em] text-text-primary leading-none flex items-center gap-10">
                            <span className="text-text-accent opacity-20 text-9xl font-normal group-hover:opacity-40 transition-opacity">/</span> 
                            <span>dashboard</span>
                         </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-16 mt-12 border-l-8 border-text-accent/20 pl-16 italic">
                        <div className="space-y-4">
                             <p className="text-[16px] text-text-primary font-black uppercase tracking-[0.8em] group-hover:text-text-accent transition-colors">REALTIME_INFRASTRUCTURE_MONITORING_ENGINE</p>
                             <div className="h-1 w-64 bg-text-accent/20 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-text-accent animate-loadingBarSlow"></div>
                             </div>
                        </div>
                        <span className="text-border-default h-12 w-[4px] opacity-10"></span>
                        <p className="text-[13px] text-text-muted font-black uppercase tracking-[0.6em] opacity-40 flex items-center gap-8 group-hover:opacity-100 transition-opacity">
                            <span className="text-text-accent animate-pulse">&bull;</span> CORE_KERNEL_STABLE: 0xFD42_SYNC
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-6 no-print">
                     <div className="flex items-center gap-10 bg-bg-surface border-4 border-border-default p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group/sync hover:border-text-accent hover:bg-bg-base/50 transition-all duration-700 active:scale-95 cursor-pointer">
                        <div className="text-[13px] font-black text-text-muted uppercase tracking-[0.8em] group-hover/sync:text-text-accent transition-colors italic">SYNC_POINT:</div>
                        <div className="text-[16px] font-black text-text-primary tabular-nums tracking-[0.3em] bg-bg-base px-8 py-4 border-4 border-border-default shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)] group-hover/sync:border-text-accent/30 transition-all">
                            [{new Date().toISOString().replace('T', ' ').substring(0, 19).toUpperCase()}]
                        </div>
                    </div>
                    <div className="text-[10px] text-text-muted font-black uppercase tracking-[1.5em] opacity-10 italic">_0xAF22_SECURE_PORT_OPEN</div>
                </div>
            </div>

            {/* Global KPI Matrix RX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 relative">
                 <div className="absolute -top-10 left-0 text-[11px] font-black text-text-accent uppercase tracking-[1em] opacity-20 italic"># SYSTEM_RESOURCE_METRICS</div>
                 {cards.map((card) => (
                    <KpiCard key={card.title} {...card} />
                ))}
            </div>

            {/* Analysis Center Enclave */}
            <div className="space-y-32">
                <div className="relative group/charts">
                    <div className="absolute -top-12 right-0 flex items-center gap-6 opacity-10 group-hover/charts:opacity-40 transition-opacity">
                         <span className="text-[10px] font-black uppercase tracking-[1em]">IO_VISUALIZATION_READY</span>
                         <div className="w-12 h-0.5 bg-text-accent"></div>
                    </div>
                    <DashboardCharts
                        categoryData={stats.byCategory}
                        statusData={stats.byStatus}
                        costs={stats.maintenanceCost}
                        trends={stats.trends}
                        itsm={stats.itsm}
                    />
                </div>

                <div className="pt-20 border-t-8 border-border-default/10">
                    <RecentActivity activity={activity} />
                </div>
            </div>

            {/* High-Fidelity Footer Identifier */}
            <div className="flex flex-col xl:flex-row justify-between items-center gap-16 p-20 bg-bg-surface/80 border-8 border-border-default shadow-[inset_0_20px_100px_rgba(0,0,0,0.4)] group hover:border-text-accent/30 transition-all duration-1000 relative overflow-hidden">
                <div className="absolute top-0 right-[-100%] w-full h-full bg-gradient-to-r from-transparent via-text-accent/5 to-transparent skew-x-[-30deg] animate-shine"></div>
                
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[1em] flex items-center gap-10 group-hover:text-text-primary transition-all relative z-10">
                     <div className="w-5 h-5 bg-text-accent rotate-45 animate-pulse shadow-[0_0_25px_rgba(var(--text-accent),0.8)] group-hover:rotate-[225deg] transition-transform duration-1000"></div>
                     DASHBOARD_CONTROLLER_v4 // STATUS: KERNEL_AF22_STABLE_0x00
                </div>
                <div className="text-[14px] font-black text-text-muted uppercase tracking-[0.6em] italic flex items-center gap-12 relative z-10">
                     <div className="w-24 h-[3px] bg-border-default opacity-40 group-hover:w-48 group-hover:bg-text-accent transition-all duration-1000"></div>
                     COLOMBIA_IT_REALTIME_MANIFEST // ACCESS_RX: RO_MASTER_STREAM_GATE
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, symbol, accent, meta }) => (
    <div className="group relative bg-bg-surface border-4 border-border-default p-14 flex flex-col justify-between hover:border-text-accent hover:shadow-[0_45px_120px_rgba(251,97,7,0.25)] transition-all duration-700 overflow-hidden cursor-default shadow-[0_30px_90px_rgba(0,0,0,0.6)] active:scale-95 group/card h-full">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-[13px] font-black uppercase tracking-[1.5em] group-hover:opacity-40 group-hover:text-text-accent transition-all duration-700 pointer-events-none italic">{meta}</div>
        <div className="absolute bottom-0 left-0 w-0 h-3 bg-text-accent group-hover:w-full transition-all duration-1000 shadow-[0_0_30px_rgba(var(--text-accent),0.5)]"></div>
        
        <div className="flex items-center justify-between mb-20 relative">
            <span className="text-[24px] font-black text-text-muted opacity-20 group-hover/card:opacity-100 group-hover/card:text-text-accent transition-all duration-700 font-mono bg-bg-base/80 w-16 h-16 flex items-center justify-center border-4 border-border-default shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)] group-hover/card:rotate-[360deg] duration-1000">
                {symbol}
            </span>
            <div className="h-[4px] flex-1 mx-12 bg-border-default/10 group-hover/card:bg-text-accent/20 transition-all duration-1000 relative">
                 <div className="absolute inset-0 bg-text-accent/30 w-0 group-hover/card:w-full transition-all duration-1500"></div>
            </div>
        </div>
        
        <div className="relative z-10 flex-1 flex flex-col justify-end">
            <p className={`text-7xl font-black ${accent} leading-none tracking-tighter group-hover/card:translate-x-8 transition-all duration-1000 tabular-nums mb-12 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] italic group-hover/card:not-italic`}>
                {value}
            </p>
            <div className="h-[3px] w-24 bg-text-accent mb-10 opacity-10 group-hover/card:w-full group-hover/card:opacity-50 transition-all duration-1000"></div>
            <div className="flex items-center gap-6">
                 <div className="w-1.5 h-6 bg-text-accent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                 <p className="text-[13px] font-black text-text-muted uppercase tracking-[0.6em] leading-relaxed italic opacity-50 group-hover/card:opacity-100 group-hover/card:text-text-primary transition-all duration-500 border-l-4 border-border-default/20 pl-6 group-hover/card:border-text-accent">
                    {title.replace(/_/g, '_')}
                </p>
            </div>
        </div>
        
        {/* Aggressive background decoration */}
        <div className="absolute -bottom-16 -right-16 text-[180px] font-black opacity-[0.01] pointer-events-none group-hover/card:opacity-[0.15] transition-all duration-1000 uppercase tracking-tighter leading-none select-none italic group-hover/card:-rotate-12 group-hover/card:scale-125 transition-all">
            {symbol.replace(/[\[\]]/g, '')}
        </div>
    </div>
);

export default Dashboard;
