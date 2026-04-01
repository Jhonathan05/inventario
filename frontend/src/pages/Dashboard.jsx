import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import DashboardCharts from './dashboard/components/DashboardCharts';
import RecentActivity from './dashboard/components/RecentActivity';
import {
    ComputerDesktopIcon,
    CheckCircleIcon,
    UserGroupIcon,
    BanknotesIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    const { data, isLoading: loading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => api.get('/dashboard/summary').then(r => r.data),
        staleTime: 1000 * 60 * 2, // 2 minutos - dashboard no cambia tan frecuente
    });

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
            title: 'Tiempo Med. Resol. (MTTR)',
            value: `${stats.itsm.mttrHours}h`,
            Icon: ClockIcon,
            gradient: 'from-fnc-600 to-fnc-700',
            bg: 'bg-fnc-50',
            text: 'text-fnc-700',
            border: 'border-fnc-200',
        },
        {
            title: 'Tickets Críticos (Sin Asignar)',
            value: stats.itsm.ticketsCriticos.length,
            Icon: ExclamationTriangleIcon,
            gradient: stats.itsm.ticketsCriticos.length > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600',
            bg: stats.itsm.ticketsCriticos.length > 0 ? 'bg-red-50' : 'bg-emerald-50',
            text: stats.itsm.ticketsCriticos.length > 0 ? 'text-red-700' : 'text-emerald-700',
            border: stats.itsm.ticketsCriticos.length > 0 ? 'border-red-200' : 'border-emerald-200',
        },
        {
            title: '% En Garantía',
            value: `${stats.itsm.percentGarantia}%`,
            Icon: ShieldCheckIcon,
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-200',
        },
        {
            title: 'Valor Total de Activos',
            value: formatCurrency(stats.totalValue),
            Icon: BanknotesIcon,
            gradient: 'from-violet-600 to-violet-700',
            bg: 'bg-violet-50',
            text: 'text-violet-700',
            border: 'border-violet-200',
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
                {cards.map((card) => (
                    <KpiCard key={card.title} {...card} />
                ))}
            </div>

            {/* Charts Section */}
            <DashboardCharts
                categoryData={stats.byCategory}
                statusData={stats.byStatus}
                costs={stats.maintenanceCost}
                trends={stats.trends}
                itsm={stats.itsm}
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
