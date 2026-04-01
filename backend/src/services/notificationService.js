const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates an alert avoiding duplicates.
 * If there is already an unread alert of the same type for the same reference and user, it skips creation.
 */
const createUniqueAlert = async ({ tipo, titulo, mensaje, referenciaId, usuarioId }) => {
    try {
        const whereClause = {
            tipo,
            leida: false,
        };
        
        if (referenciaId) whereClause.referenciaId = referenciaId;
        if (usuarioId !== undefined) whereClause.usuarioId = usuarioId;

        const alertaExistente = await prisma.alerta.findFirst({
            where: whereClause
        });

        if (!alertaExistente) {
            const nuevaAlerta = await prisma.alerta.create({
                data: {
                    tipo,
                    titulo,
                    mensaje,
                    referenciaId,
                    usuarioId,
                }
            });
            console.log(`[ALERTA] Creada [${tipo}]: ${titulo}`);
            return nuevaAlerta;
        }
        return alertaExistente;
    } catch (error) {
        console.error('[Error NotificationService] Failed to create alert:', error);
        return null;
    }
};

module.exports = {
    createUniqueAlert,
};
