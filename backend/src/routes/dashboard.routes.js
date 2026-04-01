const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth.middleware');

// GET /api/dashboard/summary
router.get('/summary', authMiddleware, async (req, res) => {
    try {
        // 1. Asset Counts by Status
        const statusGroups = await prisma.activo.groupBy({
            by: ['estado'],
            _count: {
                estado: true
            }
        });

        // 2. Asset Counts by Category
        const categoryGroups = await prisma.activo.groupBy({
            by: ['categoriaId'],
            _count: {
                categoriaId: true
            }
        });

        // Fetch category names
        const categories = await prisma.categoria.findMany({
            select: { id: true, nombre: true }
        });

        const categoryStats = categoryGroups.map(group => {
            const cat = categories.find(c => c.id === group.categoriaId);
            return {
                name: cat ? cat.nombre : 'Desconocido',
                count: group._count.categoriaId
            };
        });

        // 3. Total Value
        const totalValue = await prisma.activo.aggregate({
            _sum: {
                valorCompra: true
            }
        });

        // 4. Maintenance Costs (Total vs Last 30 Days)
        const totalMaintenanceCost = await prisma.hojaVida.aggregate({
            _sum: {
                costo: true
            }
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentMaintenanceCost = await prisma.hojaVida.aggregate({
            where: {
                fecha: {
                    gte: thirtyDaysAgo
                }
            },
            _sum: {
                costo: true
            }
        });

        // 5. Recent Activity (Combined)
        // Adjust logic if you want merged feed of Assignments + Maintenance
        const recentMaintenance = await prisma.hojaVida.findMany({
            take: 5,
            orderBy: { fecha: 'desc' },
            include: {
                activo: { select: { marca: true, modelo: true, placa: true } },
                responsable: { select: { nombre: true } }
            }
        });

        const recentAssignments = await prisma.asignacion.findMany({
            take: 5,
            orderBy: { fechaInicio: 'desc' },
            include: {
                activo: { select: { marca: true, modelo: true, placa: true } },
                funcionario: { select: { nombre: true } }
            }
        });

        // Format activity feed
        const activityFeed = [
            ...recentMaintenance.map(m => ({
                id: `mnt-${m.id}`,
                type: 'MANTENIMIENTO',
                date: m.fecha,
                description: `${m.tipo} - ${m.activo.marca} ${m.activo.modelo} (${m.activo.placa})`,
                user: m.responsable?.nombre || 'Sistema',
                status: m.estado
            })),
            ...recentAssignments.map(a => ({
                id: `asg-${a.id}`,
                type: 'ASIGNACION',
                date: a.fechaInicio,
                description: `Asignación a ${a.funcionario.nombre} - ${a.activo.marca} ${a.activo.modelo} (${a.activo.placa})`,
                user: 'Sistema', // Assignments are usually done by admin/tech
                status: a.fechaFin ? 'FINALIZADO' : 'ACTIVO'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        // 6. MTTR (Mean Time to Repair en horas)
        const closedTickets = await prisma.ticket.findMany({
            where: { estado: { in: ['COMPLETADO', 'RESUELTO'] }, cerradoEn: { not: null } },
            select: { creadoEn: true, cerradoEn: true }
        });

        let mttrHours = 0;
        if (closedTickets.length > 0) {
            const totalHours = closedTickets.reduce((acc, t) => {
                const diff = (new Date(t.cerradoEn) - new Date(t.creadoEn)) / (1000 * 60 * 60);
                return acc + diff;
            }, 0);
            mttrHours = totalHours / closedTickets.length;
        }

        // 7. % Activos en Garantía
        const hoy = new Date();
        const activosEnGarantia = await prisma.activo.count({
            where: {
                garantiaHasta: { gte: hoy },
                estado: { not: 'DADO_DE_BAJA' }
            }
        });
        const totalActivosOperativos = await prisma.activo.count({
            where: { estado: { not: 'DADO_DE_BAJA' } }
        });
        const percentGarantia = totalActivosOperativos > 0 ? Math.round((activosEnGarantia / totalActivosOperativos) * 100) : 0;

        // 8. Tickets CRÍTICOS sin asignar
        const ticketsCriticos = await prisma.ticket.findMany({
            where: { estado: 'CREADO', prioridad: 'ALTA', asignadoAId: null },
            select: { id: true, titulo: true, creadoEn: true }
        });

        // 9. Tendencia: Tickets por mes (últimos 6 meses)
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
        seisMesesAtras.setDate(1);

        const ticketsRecientesHist = await prisma.ticket.findMany({
            where: { creadoEn: { gte: seisMesesAtras } },
            select: { creadoEn: true }
        });

        const mesesRecientesMap = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7); // YYYY-MM
            mesesRecientesMap[key] = { tickets: 0, costo: 0 };
        }

        ticketsRecientesHist.forEach(t => {
            const key = t.creadoEn.toISOString().slice(0, 7);
            if (mesesRecientesMap[key]) {
                mesesRecientesMap[key].tickets++;
            }
        });

        // 10. Tendencia: Costos por Mes
        const mantenimientosRecientes = await prisma.hojaVida.findMany({
            where: { fecha: { gte: seisMesesAtras } },
            select: { fecha: true, costo: true }
        });

        mantenimientosRecientes.forEach(m => {
            if (!m.costo) return;
            const key = m.fecha.toISOString().slice(0, 7);
            if (mesesRecientesMap[key]) {
                mesesRecientesMap[key].costo += m.costo;
            }
        });

        const tendenciasMes = Object.keys(mesesRecientesMap).sort().map(mes => ({
            mes,
            tickets: mesesRecientesMap[mes].tickets,
            costo: mesesRecientesMap[mes].costo
        }));

        res.json({
            stats: {
                totalAssets: await prisma.activo.count(),
                byStatus: statusGroups.map(g => ({ status: g.estado, count: g._count.estado })),
                byCategory: categoryStats,
                totalValue: totalValue._sum.valorCompra || 0,
                maintenanceCost: {
                    total: totalMaintenanceCost._sum.costo || 0,
                    last30Days: recentMaintenanceCost._sum.costo || 0
                },
                itsm: {
                    mttrHours: Math.round(mttrHours * 10) / 10,
                    percentGarantia,
                    ticketsCriticos
                },
                trends: tendenciasMes
            },
            activity: activityFeed
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener datos del dashboard' });
    }
});

module.exports = router;
