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

// Palette alineada con la identidad FNC
const STATUS_COLORS = {
    DISPONIBLE: '#10b981',
    ASIGNADO: '#3b82f6',
    EN_MANTENIMIENTO: '#f59e0b',
    DADO_DE_BAJA: '#ef4444',
};
const BAR_COLORS = ['#7c0a02', '#9e1b0d', '#b83227', '#cc5a48', '#d4806f', '#dfa598'];

const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass border border-charcoal-100 px-4 py-3 rounded-xl shadow-lg text-sm">
                {label && <p className="font-bold text-charcoal-700 mb-1">{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} className="text-charcoal-600">
                        <span className="font-black" style={{ color: p.color || p.fill }}>
                            {formatter ? formatter(p.value) : p.value}
                        </span>
                        {p.name && p.name !== 'count' ? ` ${p.name}` : ''}
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

const formatMonth = (str) => {
    try {
        return format(parseISO(`${str}-01`), 'MMM yyyy', { locale: es });
    } catch {
        return str;
    }
};

const DashboardCharts = ({ categoryData, statusData, costs, trends }) => {
    const pieData = statusData.map((item) => ({
        name: item.status.replace(/_/g, ' '),
        value: item.count,
        color: STATUS_COLORS[item.status] || '#8884d8',
    }));

    const barData = categoryData
        .filter(c => c.count > 0)
        .map((c, i) => ({ ...c, fill: BAR_COLORS[i % BAR_COLORS.length] }));

    const total = pieData.reduce((s, d) => s + d.value, 0);

    const trendsFormatted = trends?.map(t => ({
        ...t,
        mesLabel: formatMonth(t.mes)
    })) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {/* Activos por Categoría — Horizontal bar */}
            <div className="glass rounded-2xl border border-charcoal-100 p-6 shadow-sm">
                <h3 className="text-base font-black text-charcoal-700 mb-1">Activos por Categoría</h3>
                <p className="text-xs text-charcoal-400 font-medium mb-5">Distribución de equipos por tipo</p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            layout="vertical"
                            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                            barSize={16}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
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
                <p className="text-xs text-charcoal-400 font-medium mb-2">Activos operativos vs dados de baja</p>
                <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
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
                        <span className="text-2xl font-black text-charcoal-800">{total}</span>
                    </div>
                </div>
                <CustomLegend data={pieData} />
            </div>

            {/* Costos de Mantenimiento — Area Chart */}
            <div className="glass rounded-2xl border border-charcoal-100 p-6 shadow-sm xl:col-span-1">
                <h3 className="text-base font-black text-charcoal-700 mb-1">Costos de Mantenimiento</h3>
                <p className="text-xs text-charcoal-400 font-medium mb-5">Mes actual: {formatCurrency(costs.last30Days)}</p>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendsFormatted} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCosto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c0a02" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#7c0a02" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            {/* Hide YAxis to save space, rely on tooltip */}
                            <YAxis hide /> 
                            <Tooltip content={<CustomTooltip formatter={(val) => formatCurrency(val)} />} />
                            <Area type="monotone" dataKey="costo" name="Inversión" stroke="#7c0a02" fillOpacity={1} fill="url(#colorCosto)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tendencia de Tickets — Bar Chart */}
            <div className="glass rounded-2xl border border-charcoal-100 p-6 shadow-sm lg:col-span-2 xl:col-span-3">
                <h3 className="text-base font-black text-charcoal-700 mb-1">Tendencia de Tickets (Mesa de Ayuda)</h3>
                <p className="text-xs text-charcoal-400 font-medium mb-5">Volumen de solicitudes creadas en los últimos meses</p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendsFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="mesLabel" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip formatter={(val) => `${val} tickets`} />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="tickets" name="Tickets Creados" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
