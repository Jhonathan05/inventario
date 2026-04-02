import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';
import { formatCurrency } from '../../../lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// SITE TOKENS ALIGNED WITH SKILLS.SH AESTHETIC - MONOCHROMATIC HIGH-CONTRAST
const STATUS_COLORS = {
    DISPONIBLE: '#fcfcfc', // text-text-primary
    ASIGNADO: '#888888',     // mid-gray
    EN_MANTENIMIENTO: '#fb6107', // Red Tinto accent for urgency
    DADO_DE_BAJA: '#333333',     // dark-gray
};

const ACCENT_COLOR = '#fb6107'; 
const BAR_COLORS = ['#fcfcfc', '#cccccc', '#999999', '#666666', '#444444', '#222222'];
const GRID_COLOR = 'rgba(255, 255, 255, 0.03)';
const TEXT_COLOR = '#888888';

const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-bg-surface border-4 border-border-strong px-8 py-6 font-mono shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group/tooltip">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-[10px] font-black uppercase tracking-[0.5em] group-hover/tooltip:opacity-30 transition-all">DATA_TX_NODE</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-text-accent opacity-40"></div>
                
                {label && (
                    <p className="text-[12px] font-black text-text-primary mb-5 uppercase tracking-[0.4em] border-b-2 border-border-default pb-3 flex items-center gap-4">
                        <span className="text-text-accent">::</span> {label.toString().replace(/ /g, '_')}
                    </p>
                )}
                <div className="space-y-3">
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-12 min-w-[180px]">
                            <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-text-accent/40"></div>
                                {p.name && p.name !== 'count' ? p.name.toUpperCase().replace(/ /g, '_') : 'VALUE_TX'}
                            </span>
                            <span className="text-[13px] font-black text-text-accent tabular-nums bg-bg-base px-3 py-1 border border-border-default/40">
                                {formatter ? formatter(p.value) : p.value.toString().padStart(2, '0')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ data }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 pt-10 border-t-2 border-border-default/20 font-mono">
        {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-6 group/leg cursor-default hover:bg-bg-base/20 p-2 transition-all">
                <span className="w-4 h-4 flex-shrink-0 shadow-2xl border-2 border-border-default group-hover:rotate-45 transition-transform" style={{ backgroundColor: entry.color }} />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] group-hover:text-text-primary transition-colors">
                        {entry.name.replace(/ /g, '_')}
                    </span>
                    <span className="text-[12px] font-black text-text-primary tabular-nums tracking-widest mt-1">[{entry.value.toString().padStart(2, '0')}]</span>
                </div>
            </div>
        ))}
    </div>
);

const formatMonth = (str) => {
    try {
        return format(parseISO(`${str}-01`), 'MMM yyyy', { locale: es }).toUpperCase();
    } catch {
        return str;
    }
};

const DashboardCharts = ({ categoryData, statusData, costs, trends }) => {
    const pieData = statusData.map((item) => ({
        name: item.status.replace(/_/g, ' '),
        value: item.count,
        color: STATUS_COLORS[item.status] || '#555555',
    }));

    const barData = categoryData
        .filter(c => c.count > 0)
        .map((c, i) => ({ ...c, fill: BAR_COLORS[i % BAR_COLORS.length] }));

    const total = pieData.reduce((s, d) => s + d.value, 0);

    const trendsFormatted = trends?.map(t => ({
        ...t,
        mesLabel: formatMonth(t.mes)
    })) || [];

    const chartTitleCls = "text-[14px] font-black text-text-primary mb-4 uppercase tracking-[0.6em] flex items-center gap-6";
    const chartSubCls = "text-[10px] text-text-muted font-black mb-12 uppercase tracking-[0.4em] opacity-40 border-l-4 border-border-default/30 pl-6 italic";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
            {/* Activos por Categoría — Horizontal bar */}
            <div className="bg-bg-surface border-2 border-border-default p-12 font-mono shadow-3xl hover:border-text-accent transition-all overflow-hidden relative group/chart active:scale-[0.99] group/c1">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-xs font-black uppercase tracking-[1em] group-hover/c1:opacity-20 group-hover/c1:translate-x-2 transition-all">CAT_ANALYSIS_0x1</div>
                <div className="absolute top-0 left-0 w-2 h-full bg-text-accent/10 opacity-0 group-hover/c1:opacity-100 transition-opacity"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-3 h-3 bg-text-accent animate-pulse group-hover/c1:scale-150 transition-transform"></div>
                    # ASSET_BY_CATEGORY
                </h3>
                <p className={chartSubCls}>distribution_array_by_classification_nodes</p>
                
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 20, right: 40, left: 20, bottom: 0 }}
                            barSize={18}
                        >
                            <CartesianGrid strokeDasharray="6 12" horizontal={false} stroke={GRID_COLOR} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} width={120} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={1500}>
                                {barData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} className="hover:filter hover:brightness-125 transition-all" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Estado del Inventario — Donut */}
            <div className="bg-bg-surface border-2 border-border-default p-12 font-mono shadow-3xl hover:border-text-accent transition-all overflow-hidden relative group/chart active:scale-[0.99] group/c2">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-xs font-black uppercase tracking-[1em] group-hover/c2:opacity-20 group-hover/c2:translate-x-2 transition-all">STAT_INTEGRITY_0x2</div>
                <div className="absolute top-0 left-0 w-2 h-full bg-text-accent/10 opacity-0 group-hover/c2:opacity-100 transition-opacity"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-3 h-3 bg-text-accent animate-pulse group-hover/c2:scale-150 transition-transform"></div>
                    # INVENTORY_INTEGRITY
                </h3>
                <p className={chartSubCls}>operational_vs_offline_status_registry_checksum</p>
                
                <div className="h-64 relative flex items-center justify-center mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={115}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                                animationDuration={2000}
                                animationBegin={300}
                            >
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} className="hover:filter hover:brightness-125 transition-all outline-none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover/c2:scale-110 transition-transform duration-700">
                        <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] mb-3 opacity-40">TOTAL_BUF</span>
                        <span className="text-5xl font-black text-text-primary tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                             {total.toString().padStart(3, '0')}
                        </span>
                        <div className="mt-2 w-12 h-1 bg-text-accent opacity-40"></div>
                    </div>
                </div>
                <CustomLegend data={pieData} />
            </div>

            {/* Costos de Mantenimiento — Area Chart */}
            <div className="bg-bg-surface border-2 border-border-default p-12 font-mono shadow-3xl hover:border-text-accent transition-all overflow-hidden relative group/chart active:scale-[0.99] group/c3">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-xs font-black uppercase tracking-[1em] group-hover/c3:opacity-20 group-hover/c3:translate-x-2 transition-all">CAPEX_X_LOG_0x3</div>
                <div className="absolute top-0 left-0 w-2 h-full bg-text-accent/10 opacity-0 group-hover/c3:opacity-100 transition-opacity"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-3 h-3 bg-text-accent animate-pulse group-hover/c3:scale-150 transition-transform"></div>
                    # EXPENDITURE_LOG
                </h3>
                <p className={chartSubCls}>CURRENT_INTERVAL_VALUATION: <span className="text-text-primary bg-bg-base border border-border-default px-4 tabular-nums shadow-inner ml-2">{formatCurrency(costs.last30Days)}</span></p>
                
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendsFormatted} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="8 12" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis hide /> 
                            <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} />
                            <Area 
                                type="stepAfter" 
                                dataKey="costo" 
                                name="Inversión" 
                                stroke={ACCENT_COLOR} 
                                strokeWidth={4} 
                                fillOpacity={0.1} 
                                fill={ACCENT_COLOR} 
                                animationDuration={2500}
                                strokeDasharray="3 3"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tendencia de Tickets — Bar Chart */}
            <div className="bg-bg-surface border-2 border-border-default p-14 font-mono shadow-3xl hover:border-text-accent transition-all overflow-hidden lg:col-span-2 xl:col-span-3 relative group/chart active:scale-[0.99] group/c4">
                <div className="absolute top-0 right-0 p-10 opacity-5 text-sm font-black uppercase tracking-[2em] group-hover/c4:opacity-10 transition-all pointer-events-none">VOLUMETRY_HIST_TX</div>
                <div className="absolute left-0 bottom-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-20"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-4 h-4 bg-text-accent animate-pulse group-hover/c4:rotate-45 transition-transform shadow-[0_0_15px_rgba(var(--text-accent),0.5)]"></div>
                    # INCIDENT_VOLUMETRY_TREND_ANALYSIS
                </h3>
                <p className={chartSubCls}>realtime_system_requests_load_delta_historicals_per_cycle</p>
                
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendsFormatted} margin={{ top: 20, right: 40, left: 20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 20" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 11, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} width={60} />
                            <Tooltip content={<CustomTooltip formatter={(val) => `${val.toString().padStart(2, '0')}_TICKETS`} />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                            <Bar dataKey="tickets" name="Tickets Creados" fill={ACCENT_COLOR} radius={[0, 0, 0, 0]} maxBarSize={60} animationDuration={2000} stroke="#000" strokeWidth={1} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
