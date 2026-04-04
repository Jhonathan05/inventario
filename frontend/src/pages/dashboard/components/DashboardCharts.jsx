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
import { useWindowSize } from '../../../lib/useWindowSize';

// HIGH-FIDELITY TOKENS - MONOCHROMATIC INTENSITY v4.2
const STATUS_COLORS = {
    DISPONIBLE: '#fcfcfc', // text-text-primary
    ASIGNADO: '#888888',     // mid-gray
    EN_MANTENIMIENTO: '#fb6107', // Accent Red for urgency
    DADO_DE_BAJA: '#333333',     // dark-gray
};

const ACCENT_COLOR = '#fb6107'; 
const BAR_COLORS = ['#fcfcfc', '#cccccc', '#999999', '#666666', '#444444', '#222222'];
const GRID_COLOR = 'rgba(255, 255, 255, 0.05)';
const TEXT_COLOR = '#888888';

const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-bg-surface border border-border-strong px-4 py-3 font-mono shadow-xl relative overflow-hidden animate-fadeIn w-full max-w-[240px]">
                {label && (
                    <div className="mb-3 border-b border-border-default pb-2 flex items-center gap-3">
                         <div className="w-2 h-2 bg-text-accent animate-ping opacity-60 flex-shrink-0"></div>
                         <p className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] truncate">
                            {label.toString().toUpperCase().replace(/ /g, '_')}
                        </p>
                    </div>
                )}
                <div className="space-y-2">
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.1em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-text-accent/60 flex-shrink-0"></div>
                                <span className="truncate">{p.name && p.name !== 'count' ? p.name.toUpperCase().replace(/ /g, '_') : 'VAL'}</span>
                            </span>
                            <span className="text-[11px] font-black text-text-accent tabular-nums bg-bg-base/80 px-2 py-0.5 border border-border-default flex-shrink-0">
                                {formatter ? formatter(p.value) : p.value.toString().padStart(3, '0')}
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
    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-default/20 font-mono bg-bg-base/30 p-3 border border-border-default/10">
        {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-2 group/leg cursor-default hover:bg-bg-surface p-1.5 transition-all border-l border-transparent hover:border-text-accent">
                <span className="w-2.5 h-2.5 flex-shrink-0 border border-border-default" style={{ backgroundColor: entry.color }} />
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.1em] group-hover/leg:text-text-primary transition-colors">
                        {entry.name.toUpperCase().replace(/ /g, '_')}
                    </span>
                    <span className="text-[10px] font-black text-text-primary tabular-nums">[{entry.value.toString().padStart(3, '0')}]</span>
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
    const { isMobile, isTablet } = useWindowSize();
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

    const pieInner = isMobile ? 50 : isTablet ? 70 : 90;
    const pieOuter = isMobile ? 70 : isTablet ? 90 : 120;

    const chartTitleCls = "text-[11px] sm:text-[13px] font-black text-text-primary mb-2 uppercase tracking-[0.3em] flex items-center gap-2";
    const chartSubCls = "text-[9px] text-text-muted font-black mb-4 uppercase tracking-[0.2em] opacity-40 border-l-2 border-border-default/40 pl-2 italic";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Activos por Categoría */}
            <div className="bg-bg-surface border border-border-default p-4 sm:p-6 font-mono shadow-lg hover:border-text-accent transition-all duration-700 overflow-hidden relative group/c1">
                <h3 className={chartTitleCls}>
                    <div className="w-4 h-4 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-[10px] bg-bg-base">&beta;</div>
                    # ASSET_BY_CATEGORY
                </h3>
                <p className={chartSubCls}>distribution_array_by_classification_nodes</p>
                
                <div className="h-[240px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            barSize={20}
                        >
                            <CartesianGrid strokeDasharray="4 8" horizontal={false} stroke={GRID_COLOR} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={2000}>
                                {barData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Estado del Inventario — Donut */}
            <div className="bg-bg-surface border border-border-default p-4 sm:p-6 font-mono shadow-lg hover:border-text-accent transition-all duration-700 overflow-hidden relative group/c2">
                <h3 className={chartTitleCls}>
                    <div className="w-4 h-4 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-[10px] bg-bg-base">&gamma;</div>
                    # INVENTORY_HEALTH
                </h3>
                <p className={chartSubCls}>operational_vs_offline_status_registry</p>
                
                <div className="h-[200px] sm:h-[240px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={pieInner}
                                outerRadius={pieOuter}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">TOTAL</span>
                        <span className="text-3xl font-black text-text-primary tracking-tighter tabular-nums">
                            {total.toString().padStart(3, '0')}
                        </span>
                    </div>
                </div>
                <CustomLegend data={pieData} />
            </div>

            {/* Costos de Mantenimiento — Area Chart */}
            <div className="bg-bg-surface border border-border-default p-4 sm:p-6 font-mono shadow-lg hover:border-text-accent transition-all duration-700 overflow-hidden relative group/c3">
                <h3 className={chartTitleCls}>
                    <div className="w-4 h-4 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-[10px] bg-bg-base">&delta;</div>
                    # EXPENDITURE_LOG
                </h3>
                <div className="mb-4 p-3 bg-bg-base/70 border border-border-default flex flex-col gap-1">
                     <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] opacity-60">VALUATION:</p>
                     <span className="text-2xl font-black text-text-primary tabular-nums">{formatCurrency(costs.last30Days)}</span>
                </div>
                
                <div className="h-[180px] sm:h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendsFormatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 8" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 9, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} />
                            <Area
                                type="stepAfter"
                                dataKey="costo"
                                stroke={ACCENT_COLOR}
                                strokeWidth={3}
                                fillOpacity={0.1}
                                fill={ACCENT_COLOR}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tendencia de Tickets — Bar Chart full-width */}
            <div className="bg-bg-surface border border-border-default p-4 sm:p-8 font-mono shadow-lg hover:border-text-accent transition-all duration-700 overflow-hidden lg:col-span-2 xl:col-span-3 relative group/c4">
                <h3 className={chartTitleCls}>
                    <div className="w-5 h-5 flex items-center justify-center border-2 border-text-accent text-text-accent font-black text-xs bg-bg-base">&epsilon;</div>
                    <span className="text-sm tracking-[0.4em]"># TICKET_TREND_ANALYSIS</span>
                </h3>
                <div className="h-[200px] sm:h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendsFormatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 8" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} width={30} />
                            <Tooltip content={<CustomTooltip formatter={(val) => `${val}_TICKETS`} />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                            <Bar
                                dataKey="tickets"
                                fill={ACCENT_COLOR}
                                radius={[2, 2, 0, 0]}
                                maxBarSize={40}
                                animationDuration={2000}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
