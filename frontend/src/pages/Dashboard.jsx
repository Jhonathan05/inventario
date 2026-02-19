import { useEffect, useState } from 'react';
import api from '../lib/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        disponibles: 0,
        asignados: 0,
        mantenimiento: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/activos');
            const total = data.length;
            const disponibles = data.filter(a => a.estado === 'DISPONIBLE').length;
            const asignados = data.filter(a => a.estado === 'ASIGNADO').length;
            const mantenimiento = data.filter(a => a.estado === 'EN_MANTENIMIENTO').length;

            setStats({ total, disponibles, asignados, mantenimiento });
        } catch (error) {
            console.error('Error loading stats', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Resumen del inventario en tiempo real.</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Activos */}
                <Card title="Total Activos" value={stats.total} icon="💻" color="bg-indigo-500" />

                {/* Disponibles */}
                <Card title="Disponibles" value={stats.disponibles} icon="✅" color="bg-green-500" />

                {/* Asignados */}
                <Card title="Asignados" value={stats.asignados} icon="👤" color="bg-blue-500" />

                {/* En Mantenimiento */}
                <Card title="Mantenimiento" value={stats.mantenimiento} icon="🔧" color="bg-yellow-500" />
            </div>
        </div>
    );
};

const Card = ({ title, value, icon, color }) => (
    <div className="bg-white overflow-hidden rounded-lg shadow">
        <div className="p-5">
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
                    <span className="text-white text-xl">{icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;
