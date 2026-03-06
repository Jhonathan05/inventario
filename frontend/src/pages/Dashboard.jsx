import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import DashboardCharts from './dashboard/components/DashboardCharts';
import RecentActivity from './dashboard/components/RecentActivity';
import {
    ComputerDesktopIcon,
    CheckCircleIcon,
    UserGroupIcon,
    BanknotesIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

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

    if (loading) return (
        <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-charcoal-500 text-sm font-medium">
                <div className="w-4 h-4 border-2 border-charcoal-300 border-t-fnc-500 rounded-full animate-spin" />
                Cargando tablero de control...
            </div>
        </div>
    );
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>;

    const { stats, activity } = data;

    const availableCount = stats.byStatus.find(s => s.status === 'DISPONIBLE')?.count || 0;
    const assignedCount = stats.byStatus.find(s => s.status === 'ASIGNADO')?.count || 0;
    const maintenanceCount = stats.byStatus.find(s => s.status === 'EN_MANTENIMIENTO')?.count || 0;

    const cards = [
        {
            title: 'Total Activos',
            value: stats.totalAssets,
            Icon: ComputerDesktopIcon,
            gradient: 'from-fnc-600 to-fnc-700',
            bg: 'bg-fnc-50',
            text: 'text-fnc-700',
            border: 'border-fnc-200',
        },
        {
            title: 'Disponibles',
            value: availableCount,
            Icon: CheckCircleIcon,
            gradient: 'from-emerald-500 to-emerald-600',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
        },
        {
            title: 'Asignados',
            value: assignedCount,
            Icon: UserGroupIcon,
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-200',
        },
        {
            title: 'En Mantenimiento',
            value: maintenanceCount,
            Icon: WrenchScrewdriverIcon,
            gradient: 'from-amber-500 to-amber-600',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
        },
        {
            title: 'Valor Total',
            value: formatCurrency(stats.totalValue),
            Icon: BanknotesIcon,
            gradient: 'from-violet-600 to-violet-700',
            bg: 'bg-violet-50',
            text: 'text-violet-700',
            border: 'border-violet-200',
            wide: true,
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-charcoal-800">Tablero de Control</h1>
                <p className="mt-1 text-sm text-charcoal-500">Resumen general del inventario e infraestructura.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {cards.slice(0, 4).map((card) => (
                    <KpiCard key={card.title} {...card} />
                ))}
                {/* Valor Total - full width at bottom */}
                <div className="col-span-2 lg:col-span-4">
                    <KpiCard {...cards[4]} />
                </div>
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

const KpiCard = ({ title, value, Icon, gradient, bg, text, border }) => (
    <div className={`glass border ${border} rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all`}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">{title}</p>
            <p className={`text-2xl font-black ${text} leading-tight truncate`}>{value}</p>
        </div>
    </div>
);

export default Dashboard;
