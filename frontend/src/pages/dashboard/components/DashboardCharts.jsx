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
            <div className="bg-bg-surface border-4 border-border-strong px-12 py-10 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden group/tooltip animate-fadeIn">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-[13px] font-black uppercase tracking-[1.5em] group-hover/tooltip:opacity-40 transition-all italic">DATA_TX_NODE_RX_v4</div>
                <div className="absolute bottom-0 left-0 w-full h-3 bg-text-accent opacity-60 shadow-[0_0_20px_rgba(var(--text-accent),0.6)] animate-pulse"></div>
                
                {label && (
                    <div className="mb-8 border-b-4 border-border-default pb-6 flex items-center gap-8">
                         <div className="w-4 h-4 bg-text-accent animate-ping opacity-60"></div>
                         <p className="text-[16px] font-black text-text-primary uppercase tracking-[0.4em] italic group-hover/tooltip:not-italic group-hover/tooltip:text-text-accent transition-all duration-700">
                            {label.toString().toUpperCase().replace(/ /g, '_')}
                        </p>
                    </div>
                )}
                <div className="space-y-6">
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-24 min-w-[280px] group/row">
                            <span className="text-[14px] font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-6 group-hover/row:text-text-primary transition-all duration-500">
                                <div className="w-3 h-3 bg-text-accent/60 group-hover/row:scale-150 transition-transform group-hover/row:rotate-45 duration-700 shadow-xl"></div>
                                {p.name && p.name !== 'count' ? p.name.toUpperCase().replace(/ /g, '_') : 'VAL_TX_PTR'}
                            </span>
                            <span className="text-[16px] font-black text-text-accent tabular-nums bg-bg-base/80 px-6 py-2.5 border-4 border-border-default shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] group-hover/row:border-text-accent/30 group-hover/row:text-text-primary transition-all duration-700">
                                {formatter ? formatter(p.value) : p.value.toString().padStart(4, '0')}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-[9px] font-black text-text-muted opacity-20 uppercase tracking-[1em] italic">CRC_CHECK_0xFD42_OK</div>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ data }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mt-16 pt-16 border-t-8 border-border-default/20 font-mono shadow-[inset_0_20px_60px_rgba(0,0,0,0.3)] bg-bg-base/30 p-12 border-4 border-dashed border-border-default/10 group/legend relative">
        <div className="absolute top-2 right-4 opacity-5 text-[9px] font-black tracking-widest italic group-hover/legend:opacity-20 transition-opacity">LEGEND_MAP_v4</div>
        {data.map((entry, i) => (
            <div key={i} className="flex items-start gap-10 group/leg cursor-default hover:bg-bg-surface p-6 transition-all duration-700 border-l-4 border-transparent hover:border-text-accent relative overflow-hidden active:scale-95">
                <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/leg:opacity-100 transition-opacity"></div>
                <span className="w-6 h-6 flex-shrink-0 shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-4 border-border-default group-hover/leg:rotate-180 transition-all duration-1000 relative z-10" style={{ backgroundColor: entry.color }} />
                <div className="flex flex-col gap-2 relative z-10">
                    <span className="text-[12px] font-black text-text-muted uppercase tracking-[0.5em] group-hover/leg:text-text-primary transition-colors italic group-hover/leg:not-italic">
                        {entry.name.toUpperCase().replace(/ /g, '_')}
                    </span>
                    <span className="text-[16px] font-black text-text-primary tabular-nums tracking-[0.2em] mt-2 bg-bg-base px-4 py-1.5 border-2 border-border-default shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] group-hover/leg:border-text-accent/30 transition-all duration-700">[{entry.value.toString().padStart(3, '0')}]</span>
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

    const chartTitleCls = "text-[20px] font-black text-text-primary mb-8 uppercase tracking-[0.8em] flex items-center gap-10 group-hover:text-text-accent transition-all duration-700 shadow-xl relative z-10 italic group-hover:not-italic";
    const chartSubCls = "text-[12px] text-text-muted font-black mb-16 uppercase tracking-[0.6em] opacity-40 border-l-8 border-border-default/40 pl-10 italic group-hover:opacity-80 group-hover:border-text-accent/50 transition-all duration-1000 relative z-10";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-20">
            {/* Activos por Categoría — Horizontal bar RX */}
            <div className="bg-bg-surface border-4 border-border-default p-16 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] hover:border-text-accent transition-all duration-700 overflow-hidden relative group/chart active:scale-[0.99] group/c1">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-xl font-black uppercase tracking-[2.5em] group-hover/c1:opacity-30 group-hover/c1:translate-x-8 transition-all duration-1000 italic">CAT_ANALYSIS_0x1_AF</div>
                <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-text-accent/40 via-transparent to-transparent opacity-0 group-hover/c1:opacity-100 transition-opacity duration-1000"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-6 h-6 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xs bg-bg-base group-hover/c1:rotate-[225deg] transition-all duration-1000 shadow-[0_0_20px_rgba(var(--text-accent),0.4)]">&beta;</div>
                    # ASSET_BY_CATEGORY_MAP
                </h3>
                <p className={chartSubCls}>distribution_array_by_classification_nodes // v4.2</p>
                
                <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 20, right: 80, left: 40, bottom: 20 }}
                            barSize={32}
                        >
                            <CartesianGrid strokeDasharray="12 24" horizontal={false} stroke={GRID_COLOR} />
                            <XAxis type="number" tick={{ fontSize: 13, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: TEXT_COLOR, fontWeight: 900, fontStyle: 'italic' }} axisLine={false} tickLine={false} width={160} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.08)' }} />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]} animationDuration={3000} animationBegin={200}>
                                {barData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} className="hover:filter hover:brightness-150 transition-all duration-700 cursor-help border-4 border-black" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Estado del Inventario — Donut RX */}
            <div className="bg-bg-surface border-4 border-border-default p-16 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] hover:border-text-accent transition-all duration-700 overflow-hidden relative group/chart active:scale-[0.99] group/c2">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-xl font-black uppercase tracking-[2.5em] group-hover/c2:opacity-30 group-hover/c2:translate-x-8 transition-all duration-1000 italic">STAT_INTEGRITY_0x2_TX</div>
                <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-text-accent/40 via-transparent to-transparent opacity-0 group-hover/c2:opacity-100 transition-opacity duration-1000"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-6 h-6 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xs bg-bg-base group-hover/c2:rotate-[225deg] transition-all duration-1000 shadow-[0_0_20px_rgba(var(--text-accent),0.4)]">&gamma;</div>
                    # INVENTORY_HEALTH_MATRIX
                </h3>
                <p className={chartSubCls}>operational_vs_offline_status_registry_checksum // AF22</p>
                
                <div className="h-[400px] relative flex items-center justify-center mt-12 group/pie">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={120}
                                outerRadius={160}
                                paddingAngle={12}
                                dataKey="value"
                                stroke="none"
                                animationDuration={3500}
                                animationBegin={400}
                                animationEasing="ease-out"
                            >
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} className="hover:filter hover:brightness-150 transition-all duration-1000 outline-none cursor-help shadow-2xl" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover/c2:scale-110 transition-transform duration-1000 group/center">
                        <span className="text-[14px] font-black text-text-muted uppercase tracking-[0.8em] mb-6 opacity-40 italic group-hover/c2:text-text-accent transition-colors duration-700">TOTAL_NODES_RX</span>
                        <div className="relative">
                            <span className="text-7xl font-black text-text-primary tracking-tighter tabular-nums drop-shadow-[0_25px_60px_rgba(255,255,255,0.2)] bg-bg-base/90 border-8 border-border-default/60 px-10 py-4 shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] group-hover/c2:border-text-accent/40 transiton-all duration-1000">
                                {total.toString().padStart(4, '0')}
                            </span>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-2 bg-text-accent opacity-60 shadow-[0_0_30px_rgba(var(--text-accent),0.8)] animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <CustomLegend data={pieData} />
            </div>

            {/* Costos de Mantenimiento — Area Chart RX */}
            <div className="bg-bg-surface border-4 border-border-default p-16 font-mono shadow-[0_60px_150px_rgba(0,0,0,0.8)] hover:border-text-accent transition-all duration-700 overflow-hidden relative group/chart active:scale-[0.99] group/c3">
                <div className="absolute top-0 right-0 p-12 opacity-5 text-xl font-black uppercase tracking-[2.5em] group-hover/c3:opacity-30 group-hover/c3:translate-x-8 transition-all duration-1000 italic">CAPEX_X_LOG_0x3_VAL</div>
                <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-text-accent/40 via-transparent to-transparent opacity-0 group-hover/c3:opacity-100 transition-opacity duration-1000"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-6 h-6 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xs bg-bg-base group-hover/c3:rotate-[225deg] transition-all duration-1000 shadow-[0_0_20px_rgba(var(--text-accent),0.4)]">&delta;</div>
                    # EXPENDITURE_LOG_STREAM
                </h3>
                <div className="mb-16 p-10 bg-bg-base/70 border-8 border-border-default shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] flex flex-col gap-4 relative overflow-hidden group/valuation hover:border-text-accent/30 transition-all duration-700">
                     <p className="text-[14px] text-text-muted uppercase tracking-[0.6em] italic opacity-60 flex items-center gap-6">
                        <span className="w-2 h-2 bg-text-accent animate-pulse"></span>
                        CURRENT_INTERVAL_VALUATION:
                    </p>
                     <span className="text-5xl font-black text-text-primary tabular-nums tracking-widest group-hover/valuation:text-text-accent transition-all duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]">{formatCurrency(costs.last30Days).replace(/ /g, '_')}</span>
                     <div className="absolute -right-8 top-1/2 -translate-y-1/2 rotate-12 opacity-5 text-9xl font-black pointer-events-none italic group-hover/valuation:opacity-15 transition-opacity duration-1000">$</div>
                </div>
                
                <div className="h-[430px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendsFormatted} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="15 30" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 13, fill: TEXT_COLOR, fontWeight: 900, fontStyle: 'italic' }} axisLine={false} tickLine={false} />
                            <YAxis hide /> 
                            <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val).replace(/ /g, '_')} />} />
                            <Area 
                                type="stepAfter" 
                                dataKey="costo" 
                                name="Inversión_TX_BUFFER" 
                                stroke={ACCENT_COLOR} 
                                strokeWidth={8} 
                                fillOpacity={0.2} 
                                fill={ACCENT_COLOR} 
                                animationDuration={4000}
                                strokeDasharray="10 10"
                                className="filter drop-shadow-[0_0_25px_rgba(var(--text-accent),0.7)]"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tendencia de Tickets — Bar Chart RX Premium */}
            <div className="bg-bg-surface border-4 border-border-default p-20 font-mono shadow-[0_80px_200px_rgba(0,0,0,0.9)] hover:border-text-accent transition-all duration-1000 overflow-hidden lg:col-span-2 xl:col-span-3 relative group/chart group/c4">
                <div className="absolute top-0 right-0 p-16 opacity-5 text-[18px] font-black uppercase tracking-[4em] group-hover/c4:opacity-15 group-hover/c4:translate-x-12 transition-all duration-1500 pointer-events-none italic">VOLUMETRY_HIST_MANIFEST_v4.2_AF22</div>
                <div className="absolute left-0 bottom-0 w-full h-[10px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-40 animate-pulse"></div>
                
                <h3 className={chartTitleCls}>
                    <div className="w-10 h-10 flex items-center justify-center border-4 border-text-accent text-text-accent font-black text-xl bg-bg-base group-hover/c4:rotate-[405deg] transition-all duration-1000 shadow-[0_0_40px_rgba(var(--text-accent),0.8)]">&epsilon;</div>
                    <span className="text-3xl tracking-[1.2em]"># INCIDENT_VOLUMETRY_TREND_ANALYSIS_STREAM</span>
                </h3>
                <p className={chartSubCls}>realtime_system_requests_load_delta_historicals_per_cycle // REGRESSION_DATA_v4 // CHANNEL: SECURE_0x99</p>
                
                <div className="h-[600px] mt-20 bg-bg-base/30 border-r-8 border-border-default/10 pr-12 shadow-[inset_0_20px_100px_rgba(0,0,0,0.5)] group/canvas transition-all duration-1000">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendsFormatted} margin={{ top: 60, right: 80, left: 60, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="4 40" vertical={false} stroke={GRID_COLOR} />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 15, fontStyle: 'italic', fill: TEXT_COLOR, fontWeight: 900 }} axisLine={{ stroke: '#222', strokeWidth: 4 }} tickLine={false} />
                            <YAxis tick={{ fontSize: 15, fill: TEXT_COLOR, fontWeight: 900 }} axisLine={{ stroke: '#222', strokeWidth: 4 }} tickLine={false} width={100} />
                            <Tooltip content={<CustomTooltip formatter={(val) => `${val.toString().padStart(4, '0')}_TICKETS_COMMITTED_TX`} />} cursor={{ fill: 'rgba(255, 255, 255, 0.08)' }} />
                            <Bar 
                                dataKey="tickets" 
                                name="Tickets_Creados_Log_TX" 
                                fill={ACCENT_COLOR} 
                                radius={[6, 6, 0, 0]} 
                                maxBarSize={120} 
                                animationDuration={4500} 
                                stroke="#000" 
                                strokeWidth={4} 
                                className="filter drop-shadow-[0_0_30px_rgba(var(--text-accent),0.8)] cursor-help hover:brightness-125 transition-all duration-700" 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-12 flex justify-between items-center opacity-10 font-black text-[11px] uppercase tracking-[1.5em] italic group-hover/c4:opacity-40 transition-all duration-1000">
                     <span>STREAM_DATA_SYNC_AF22_PASS</span>
                     <span className="animate-pulse">_0xFD42_SYNCED</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
