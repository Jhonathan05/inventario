
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { formatCurrency } from '../../../lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DashboardCharts = ({ categoryData, statusData, costs }) => {

    // Prepare data for rendering
    const pieData = statusData.map((item, index) => ({
        name: item.status,
        value: item.count,
        color: COLORS[index % COLORS.length]
    }));

    // Filter out categories with 0 assets if you want cleaner charts
    const barData = categoryData.filter(c => c.count > 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Asset Distribution by Category */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Activos por Categoría</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Cantidad" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Asset Distribution by Status */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Inventario</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Maintenance Costs Summary */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Costos de Mantenimiento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <span className="block text-sm text-indigo-600 font-medium">Últimos 30 días</span>
                        <span className="block text-2xl font-bold text-indigo-900">{formatCurrency(costs.last30Days)}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <span className="block text-sm text-gray-600 font-medium">Total Histórico</span>
                        <span className="block text-2xl font-bold text-gray-800">{formatCurrency(costs.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
