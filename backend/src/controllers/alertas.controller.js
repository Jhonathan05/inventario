const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAlertas = async (req, res) => {
    try {
        const usuarioId = req.user.id; // user set by auth middleware

        const maxAlertas = 50;
        
        // Obtener alertas donde usuarioId sea nulo (generales) o sea igual al usuarioId
        const alertas = await prisma.alerta.findMany({
            where: {
                OR: [
                    { usuarioId: null },
                    { usuarioId: usuarioId }
                ]
            },
            take: maxAlertas,
            orderBy: {
                creadoEn: 'desc'
            }
        });

        // Contar el número de alertas no leídas
        const pendientes = alertas.filter(a => !a.leida).length;

        res.json({
            nuevos: pendientes, // compatible with frontend expecting 'nuevos'
            pendientes: pendientes,
            listaRecientes: alertas
        });
    } catch (error) {
        console.error('Error getting alerts:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const marcarLeida = async (req, res) => {
    try {
        const { id } = req.params;

        // Ideal checks could be added to ensure the user owns the alert or is admin
        
        await prisma.alerta.update({
            where: { id: parseInt(id) },
            data: { leida: true }
        });

        res.json({ success: true, message: 'Alerta marcada como leída.' });
    } catch (error) {
        console.error('Error marking alert read:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const limpiarAlertas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        
        // solo marca validas para limpieza
        await prisma.alerta.deleteMany({
            where: {
                usuarioId: usuarioId,
                leida: true,
            }
        });

        res.json({ success: true, message: 'Alertas antiguas limpiadas.' });
    } catch (error) {
        console.error('Error cleaning alerts:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAlertas,
    marcarLeida,
    limpiarAlertas
};
