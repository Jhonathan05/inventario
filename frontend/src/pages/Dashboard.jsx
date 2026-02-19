import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import DashboardCharts from './dashboard/components/DashboardCharts';
import RecentActivity from './dashboard/components/RecentActivity';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/dashboard/summary');
            setData(res.data);
        } catch (error) {
            console.error('Error loading dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando tablero de control...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>;

    const { stats, activity } = data;

    // Calculate available/assigned for cards from byStatus array
    const availableCount = stats.byStatus.find(s => s.status === 'DISPONIBLE')?.count || 0;
    const assignedCount = stats.byStatus.find(s => s.status === 'ASIGNADO')?.count || 0;
    const maintenanceCount = stats.byStatus.find(s => s.status === 'EN_MANTENIMIENTO')?.count || 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Resumen general del inventario e infraestructura.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card title="Total Activos" value={stats.totalAssets} icon="💻" color="bg-indigo-500" />
                <Card title="Disponibles" value={availableCount} icon="✅" color="bg-green-500" />
                <Card title="Asignados" value={assignedCount} icon="👤" color="bg-blue-500" />
                <Card title="Valor Total" value={formatCurrency(stats.totalValue)} icon="💰" color="bg-purple-500" textSize="text-xl" />
            </div>

            {/* Charts Section */}
            <DashboardCharts
                categoryData={stats.byCategory}
                statusData={stats.byStatus}
                costs={stats.maintenanceCost}
            />

            {/* Activity Feed */}
            <RecentActivity activity={activity} />
        </div>
    );
};

const Card = ({ title, value, icon, color, textSize = "text-3xl" }) => (
    <div className="bg-white overflow-hidden rounded-lg shadow">
        <div className="p-5">
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                    <span className="text-white text-xl">{icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className={`${textSize} font-semibold text-gray-900`}>{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;
