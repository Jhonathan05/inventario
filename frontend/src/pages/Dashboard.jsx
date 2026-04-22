import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { formatCurrency } from '../lib/utils';
import DashboardCharts from './dashboard/components/DashboardCharts';
import RecentActivity from './dashboard/components/RecentActivity';
import { motion } from 'framer-motion';
import {
    Monitor,
    CheckCircle2,
    Users,
    CircleDollarSign,
    Wrench,
    AlertTriangle,
    ShieldCheck,
    Clock,
    ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
    const { data, isLoading: loading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => api.get('/dashboard/summary').then(r => r.data),
        staleTime: 1000 * 60 * 2,
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-on-surface-variant text-sm font-medium animate-pulse">
                Sincronizando tablero institucional...
            </p>
        </div>
    );
    
    if (!data) return (
        <div className="p-12 text-center bg-error-container/20 rounded-3xl border border-error/10">
            <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-bold text-error">Error de Conexión</h3>
            <p className="text-on-surface-variant text-sm">No pudimos recuperar las estadísticas en este momento.</p>
        </div>
    );

    const { stats, activity } = data;

    const availableCount = stats.byStatus.find(s => s.status === 'DISPONIBLE')?.count || 0;
    const assignedCount = stats.byStatus.find(s => s.status === 'ASIGNADO')?.count || 0;
    const maintenanceCount = stats.byStatus.find(s => s.status === 'EN_MANTENIMIENTO')?.count || 0;

    const cards = [
        {
            title: 'Total Activos',
            value: stats.totalAssets,
            Icon: Monitor,
            color: 'primary',
            description: 'Inventario total'
        },
        {
            title: 'Disponibles',
            value: availableCount,
            Icon: CheckCircle2,
            color: 'secondary',
            description: 'Listos para asignar'
        },
        {
            title: 'Asignados',
            value: assignedCount,
            Icon: Users,
            color: 'blue',
            description: 'En uso operativo'
        },
        {
            title: 'Mantenimiento',
            value: maintenanceCount,
            Icon: Wrench,
            color: 'amber',
            description: 'En taller/soporte'
        },
        {
            title: 'MTTR Promedio',
            value: `${stats.itsm.mttrHours}h`,
            Icon: Clock,
            color: 'primary',
            description: 'Tiempo de resolución'
        },
        {
            title: 'Tickets Críticos',
            value: stats.itsm.ticketsCriticos.length,
            Icon: AlertTriangle,
            color: stats.itsm.ticketsCriticos.length > 0 ? 'red' : 'secondary',
            description: 'Atención inmediata'
        },
        {
            title: 'En Garantía',
            value: `${stats.itsm.percentGarantia}%`,
            Icon: ShieldCheck,
            color: 'blue',
            description: 'Cobertura vigente'
        },
        {
            title: 'Valor Inventario',
            value: formatCurrency(stats.totalValue),
            Icon: CircleDollarSign,
            color: 'primary',
            description: 'Costo histórico'
        },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface font-headline leading-tight">Tablero de Control</h1>
                    <p className="text-on-surface-variant font-medium">Resumen estratégico de infraestructura y activos TIC.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-xs font-bold text-on-surface-variant border border-outline-variant/30">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    Actualizado en tiempo real
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <KpiCard key={card.title} {...card} index={i} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-10">
                <DashboardCharts
                    categoryData={stats.byCategory}
                    statusData={stats.byStatus}
                    costs={stats.maintenanceCost}
                    trends={stats.trends}
                    itsm={stats.itsm}
                />
            </div>

            {/* Activity Feed */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant/30 shadow-ambient"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold font-headline flex items-center gap-3">
                        <ArrowUpRight className="text-primary" />
                        Actividad Reciente
                    </h3>
                </div>
                <RecentActivity activity={activity} />
            </motion.div>
        </motion.div>
    );
};

const KpiCard = ({ title, value, Icon, color, description, index = 0 }) => {
    const colorMap = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border-secondary/20',
        blue: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
        amber: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
        red: 'bg-error-container text-error border-error/20',
    };

    const iconBgMap = {
        primary: 'gradient-primary',
        secondary: 'bg-secondary',
        blue: 'bg-blue-600',
        amber: 'bg-amber-600',
        red: 'bg-error',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative bg-surface-container-lowest border border-outline-variant/40 rounded-[28px] p-6 shadow-sm hover:shadow-float hover:border-primary/20 transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 ${iconBgMap[color] || 'bg-primary'}`}>
                    <Icon size={24} strokeWidth={2} />
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${colorMap[color] || ''}`}>
                    {description}
                </div>
            </div>
            
            <div>
                <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-black text-on-surface leading-tight font-headline">
                    {value}
                </p>
            </div>

            {/* Decoración sutil de fondo */}
            <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${iconBgMap[color] || 'bg-primary'}`} />
        </motion.div>
    );
};

export default Dashboard;
