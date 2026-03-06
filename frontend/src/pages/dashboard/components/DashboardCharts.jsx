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
    Legend,
    RadialBarChart,
    RadialBar
} from 'recharts';
import { formatCurrency } from '../../../lib/utils';

// Palette alineada con la identidad FNC
const STATUS_COLORS = {
    DISPONIBLE: '#10b981',
    ASIGNADO: '#3b82f6',
    EN_MANTENIMIENTO: '#f59e0b',
    DADO_DE_BAJA: '#ef4444',
};
const BAR_COLORS = ['#7c0a02', '#9e1b0d', '#b83227', '#cc5a48', '#d4806f', '#dfa598'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass border border-charcoal-100 px-4 py-3 rounded-xl shadow-lg text-sm">
                {label && <p className="font-bold text-charcoal-700 mb-1">{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} className="text-charcoal-600">
                        <span className="font-black" style={{ color: p.color || p.fill }}>{p.value}</span>
                        {p.name && p.name !== 'count' ? ` ${p.name}` : ' equipos'}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ data }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-600">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                {entry.name} ({entry.value})
            </div>
        ))}
    </div>
);

const DashboardCharts = ({ categoryData, statusData, costs }) => {
    const pieData = statusData.map((item) => ({
        name: item.status.replace(/_/g, ' '),
        value: item.count,
        color: STATUS_COLORS[item.status] || '#8884d8',
    }));

    const barData = categoryData
        .filter(c => c.count > 0)
        .map((c, i) => ({ ...c, fill: BAR_COLORS[i % BAR_COLORS.length] }));

    const total = pieData.reduce((s, d) => s + d.value, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activos por Categoría — Horizontal bar */}
            <div className="glass rounded-2xl border border-charcoal-100 p-6 shadow-sm">
                <h3 className="text-base font-black text-charcoal-700 mb-1">Activos por Categoría</h3>
                <p className="text-xs text-charcoal-400 font-medium mb-5">Distribución de equipos por tipo</p>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                            barSize={18}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#374151', fontWeight: 700 }}
                                axisLine={false}
                                tickLine={false}
                                width={90}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,10,2,0.05)' }} />
                            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                {barData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Estado del Inventario — Donut + leyenda */}
            <div className="glass rounded-2xl border border-charcoal-100 p-6 shadow-sm">
                <h3 className="text-base font-black text-charcoal-700 mb-1">Estado del Inventario</h3>
                <p className="text-xs text-charcoal-400 font-medium mb-2">Activos clasificados por estado operativo</p>
                <div className="h-52 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={3}
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
                    {/* Centro del donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: 0, paddingBottom: 0 }}>
                        <span className="text-3xl font-black text-charcoal-800">{total}</span>
                        <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">Total</span>
                    </div>
                </div>
                <CustomLegend data={pieData} />
            </div>

            {/* Costos de Mantenimiento — full width */}
            <div className="glass rounded-2xl border border-charcoal-100 p-6 shadow-sm lg:col-span-2">
                <h3 className="text-base font-black text-charcoal-700 mb-1">Costos de Mantenimiento</h3>
                <p className="text-xs text-charcoal-400 font-medium mb-5">Inversión en sostenimiento de la flota tecnológica</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-fnc-50 border border-fnc-200 p-5 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fnc-600 to-fnc-700 flex items-center justify-center shadow-sm flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-fnc-600 uppercase tracking-wider">Últimos 30 días</span>
                            <span className="block text-2xl font-black text-fnc-800">{formatCurrency(costs.last30Days)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-charcoal-50 border border-charcoal-100 p-5 rounded-2xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-charcoal-600 to-charcoal-700 flex items-center justify-center shadow-sm flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-charcoal-500 uppercase tracking-wider">Total Histórico</span>
                            <span className="block text-2xl font-black text-charcoal-800">{formatCurrency(costs.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
