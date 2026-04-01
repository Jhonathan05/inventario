const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { createUniqueAlert } = require('../services/notificationService');

const prisma = new PrismaClient();

const startCronJobs = () => {
    // 1. Garantías por vencer (Ejecuta todos los días a las 08:00 AM)
    // 0 8 * * *
    cron.schedule('0 8 * * *', async () => {
        console.log('[CRON] Verificando garantías próximas a vencer...');
        try {
            const hoy = new Date();
            const limite30Dias = new Date();
            limite30Dias.setDate(hoy.getDate() + 30);
            
            const activosPorVencer = await prisma.activo.findMany({
                where: {
                    garantiaHasta: {
                        gte: hoy,
                        lte: limite30Dias
                    },
                    estado: {
                         not: 'DADO_DE_BAJA'
                    }
                }
            });

            for (const activo of activosPorVencer) {
                const diasRestantes = Math.ceil((activo.garantiaHasta - hoy) / (1000 * 60 * 60 * 24));
                await createUniqueAlert({
                    tipo: 'GARANTIA_VENCIMIENTO',
                    titulo: 'Garantía por Vencer',
                    mensaje: `La garantía del activo ${activo.placa || activo.serial} (${activo.marca} ${activo.modelo}) vencerá en ${diasRestantes} días.`,
                    referenciaId: activo.id,
                });
            }
        } catch (error) {
            console.error('[CRON Error] Garantías:', error);
        }
    });

    // 2. Revisión de SLAs de Tickets (Ejecuta cada hora en el minuto 0)
    // 0 * * * *
    cron.schedule('0 * * * *', async () => {
        console.log('[CRON] Verificando SLA de tickets sin respuesta...');
        try {
            // Tickets CREADOS que tienen más de 4 horas
            const horasSLA = 4;
            const limiteSLA = new Date();
            limiteSLA.setHours(limiteSLA.getHours() - horasSLA);

            const ticketsSinRespuesta = await prisma.ticket.findMany({
                where: {
                    estado: 'CREADO',
                    creadoEn: {
                        lte: limiteSLA
                    }
                }
            });

            for (const ticket of ticketsSinRespuesta) {
                await createUniqueAlert({
                    tipo: 'SLA_TICKET_RESPUESTA',
                    titulo: 'SLA Vencido',
                    mensaje: `El ticket #${ticket.id} (${ticket.titulo}) lleva más de ${horasSLA} horas en estado CREADO.`,
                    referenciaId: ticket.id,
                    usuarioId: ticket.asignadoAId
                });
            }
        } catch (error) {
            console.error('[CRON Error] Tickets SLA:', error);
        }
    });

    // 3. Activos en Mantenimiento Prolongado (Ejecuta todos los días a las 09:00 AM)
    // 0 9 * * *
    cron.schedule('0 9 * * *', async () => {
        console.log('[CRON] Verificando activos en mantenimiento prolongado...');
        try {
            // Mantenimiento por más de 7 días
            const diasLimite = 7;
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - diasLimite);

            const activosEnMantenimiento = await prisma.activo.findMany({
                where: {
                    estado: 'EN_MANTENIMIENTO',
                    actualizadoEn: {
                        lte: fechaLimite
                    }
                }
            });

            for (const activo of activosEnMantenimiento) {
                await createUniqueAlert({
                    tipo: 'MANTENIMIENTO_PROLONGADO',
                    titulo: 'Mantenimiento Prolongado',
                    mensaje: `El activo ${activo.placa || activo.serial} lleva más de ${diasLimite} días en mantenimiento.`,
                    referenciaId: activo.id,
                });
            }
        } catch (error) {
            console.error('[CRON Error] Mantenimientos:', error);
        }
    });

    console.log('[INFO] Tareas programadas en segundo plano inicializadas.');
};

module.exports = {
    startCronJobs,
};
