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
        <div className="p-32 text-center font-mono animate-fadeIn flex flex-col items-center justify-center min-h-[60vh]">
            <div className="inline-flex flex-col items-center gap-10">
                <div className="w-20 h-20 border-8 border-border-default border-t-text-accent animate-spin rounded-full shadow-[0_0_50px_rgba(var(--text-accent),0.2)]"></div>
                <div className="space-y-4">
                    <div className="text-text-accent text-[15px] font-black uppercase tracking-[1em] animate-pulse">
                        # INITIALIZING_SYSTEM_MONITOR_v1.5
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-[0.5em] opacity-40 italic">
                        establishing_secure_kernel_connection_0x00...
                    </div>
                </div>
            </div>
        </div>
    );

    if (!data) return (
        <div className="p-32 text-center font-mono animate-shake flex flex-col items-center justify-center min-h-[60vh]">
            <div className="inline-block p-16 border-4 border-text-accent bg-bg-base shadow-[0_0_100px_rgba(var(--text-accent),0.2)]">
                <div className="text-[18px] font-black text-text-accent uppercase tracking-[0.8em] mb-6 flex items-center gap-6">
                    <span className="text-3xl">!!!</span>
                    KERNEL_PANIC: DATA_STREAM_FAILURE
                    <span className="text-3xl">!!!</span>
                </div>
                <div className="text-[11px] text-text-muted uppercase tracking-[0.4em] opacity-60">
                    REASON: BUFFER_OVERFLOW_OR_SERVICE_UNAVAILABLE_500 // ABORTING_PROC
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
            value: stats.totalAssets.toString().padStart(3, '0'),
            symbol: '#',
            accent: 'text-text-primary',
            meta: 'GLOB_REG_IDX_v1'
        },
        {
            title: 'SERVICE_AVAILABLE_NODES',
            value: availableCount.toString().padStart(3, '0'),
            symbol: '*',
            accent: 'text-text-accent',
            meta: 'READY_ST_TX_OK'
        },
        {
            title: 'ASSET_DEPLOYMENT_ACTIVE',
            value: assignedCount.toString().padStart(3, '0'),
            symbol: '/',
            accent: 'text-text-primary',
            meta: 'LIVE_NODES_STREAM'
        },
        {
            title: 'SYSTEM_MAINTENANCE_LOCK',
            value: maintenanceCount.toString().padStart(3, '0'),
            symbol: '!',
            accent: maintenanceCount > 0 ? 'text-text-accent shadow-[0_0_15px_rgba(var(--text-accent),0.3)]' : 'text-text-muted opacity-40',
            meta: 'OFFLINE_PROC_LOCK'
        },
        {
            title: 'SYSTEM_MTTR_LATENCY',
            value: `${stats.itsm.mttrHours}H`,
            symbol: '~',
            accent: 'text-text-primary',
            meta: 'AVG_REC_METRIC'
        },
        {
            title: 'CRITICAL_EXCEPTIONS_IO',
            value: stats.itsm.ticketsCriticos.length.toString().padStart(2, '0'),
            symbol: '!!',
            accent: stats.itsm.ticketsCriticos.length > 0 ? 'text-text-accent animate-pulse' : 'text-text-muted opacity-40',
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
            value: formatCurrency(stats.totalValue),
            symbol: '$',
            accent: 'text-text-accent',
            meta: 'VALU_BUFFER_RX'
        },
    ];

    return (
        <div className="font-mono space-y-16 animate-fadeIn mb-32 px-4 sm:px-6 lg:px-10 border-l-4 border-l-border-default/10">
            {/* Main Header / Status Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-b-4 border-border-default pb-14 group relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-xs font-black uppercase tracking-[1.5em] group-hover:opacity-20 transition-all">DASHBOARD_CONTROLLER_v1.5</div>
                <div className="relative">
                    <div className="absolute -left-10 top-0 bottom-0 w-2 bg-text-accent opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_15px_rgba(var(--text-accent),0.5)]"></div>
                    <div className="flex items-center gap-8 mb-6">
                         <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)] group-hover:scale-125 transition-transform"></div>
                         <h1 className="text-5xl font-black uppercase tracking-[0.5em] text-text-primary leading-none flex items-center gap-6">
                            <span className="text-text-accent opacity-20 text-6xl">/</span> system_dashboard
                         </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-10 mt-6 border-l-4 border-border-default/30 pl-10">
                        <div className="flex items-center gap-4">
                             <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.4em] italic group-hover:text-text-primary transition-colors">REALTIME_INFRASTRUCTURE_INTEGRITY_MONITOR</p>
                        </div>
                        <span className="text-border-default h-5 w-[2px] opacity-20"></span>
                        <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic flex items-center gap-4">
                            CORE_KERNEL_STABLE <span className="text-text-accent">//</span> 0xAF22_TOLIMA
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-8 bg-bg-surface border-2 border-border-default p-6 shadow-3xl group/sync hover:border-text-accent transition-all">
                    <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] group-hover/sync:text-text-accent transition-colors">LAST_SYNC_TS:</div>
                    <div className="text-[13px] font-black text-text-primary tabular-nums tracking-widest bg-bg-base px-4 py-2 border border-border-default shadow-inner">
                        [{new Date().toISOString().replace('T', ' ').substring(0, 19).toUpperCase()}]
                    </div>
                </div>
            </div>

            {/* Global KPI Manifest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {cards.map((card) => (
                    <KpiCard key={card.title} {...card} />
                ))}
            </div>

            {/* Analysis Enclave */}
            <div className="space-y-16">
                <DashboardCharts
                    categoryData={stats.byCategory}
                    statusData={stats.byStatus}
                    costs={stats.maintenanceCost}
                    trends={stats.trends}
                    itsm={stats.itsm}
                />

                <div className="pt-10">
                    <RecentActivity activity={activity} />
                </div>
            </div>

            {/* Footer Identifier */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-12 p-14 bg-bg-surface/50 border-2 border-border-default opacity-40 shadow-inner group hover:opacity-100 transition-all duration-700">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.6em] flex items-center gap-6 group-hover:text-text-primary">
                     <div className="w-3 h-3 bg-text-accent rotate-45 animate-pulse shadow-[0_0_10px_rgba(var(--text-accent),0.6)]"></div>
                     DASHBOARD_CONTROLLER_STABLE // KERNEL_AF22_0x00
                </div>
                <div className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic flex items-center gap-6">
                     <div className="w-10 h-px bg-border-default"></div>
                     COLOMBIA_IT_REALTIME_MANIFEST // ACCESS: RO_MASTER_STREAM
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, symbol, accent, meta }) => (
    <div className="group relative bg-bg-surface border-2 border-border-default p-10 flex flex-col justify-between hover:border-text-accent hover:shadow-[0_0_60px_rgba(var(--text-accent),0.1)] transition-all overflow-hidden cursor-default shadow-2xl active:scale-95">
        <div className="absolute top-0 right-0 p-6 opacity-5 text-[9px] font-black uppercase tracking-[0.5em] group-hover:opacity-30 transition-all pointer-events-none">{meta}</div>
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-text-accent opacity-0 group-hover:opacity-30 transition-all"></div>
        
        <div className="flex items-center justify-between mb-12">
            <span className="text-[16px] font-black text-text-muted opacity-20 group-hover:opacity-100 group-hover:text-text-accent transition-all font-mono bg-bg-base w-10 h-10 flex items-center justify-center border-2 border-border-default shadow-inner">
                {symbol}
            </span>
            <div className="h-[2px] flex-1 mx-8 bg-border-default/20 group-hover:bg-text-accent/20 transition-all"></div>
        </div>
        
        <div className="relative z-10">
            <p className={`text-5xl font-black ${accent} leading-none tracking-tighter group-hover:translate-x-4 transition-all duration-500 tabular-nums mb-8 drop-shadow-xl`}>
                {value}
            </p>
            <div className="h-0.5 w-16 bg-text-accent mb-6 opacity-20 group-hover:w-full transition-all duration-700"></div>
            <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] leading-relaxed italic opacity-70 group-hover:opacity-100 group-hover:text-text-primary transition-all duration-300">
                {title.replace(/_/g, ' ')}
            </p>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute -bottom-10 -right-10 text-[100px] font-black opacity-[0.02] pointer-events-none group-hover:opacity-[0.08] transition-all duration-700 uppercase tracking-tighter leading-none select-none italic group-hover:-rotate-12">
            {symbol.replace(/[\[\]]/g, '')}
        </div>
    </div>
);

export default Dashboard;
