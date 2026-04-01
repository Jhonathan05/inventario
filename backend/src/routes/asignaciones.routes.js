const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/asignaciones
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { activoId, funcionarioId, activa, page = 1, limit = 50 } = req.query;
        const where = {};
        if (activoId) where.activoId = parseInt(activoId);
        if (funcionarioId) where.funcionarioId = parseInt(funcionarioId);
        if (activa === 'true') where.fechaFin = null;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [asignaciones, total] = await Promise.all([
            prisma.asignacion.findMany({
                where,
                skip,
                take,
                include: {
                    activo: { include: { categoria: true } },
                    funcionario: true,
                    documentos: true,
                },
                orderBy: { fechaInicio: 'desc' },
            }),
            prisma.asignacion.count({ where })
        ]);

        res.json({
            data: asignaciones,
            pagination: {
                page: parseInt(page),
                limit: take,
                total,
                pages: Math.ceil(total / take)
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
});

// POST /api/asignaciones - Asignar, trasladar o devolver
router.post('/', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const { activoId, funcionarioId, tipo, observaciones } = req.body;

        // Verificar estado actual del activo
        const activo = await prisma.activo.findUnique({ where: { id: parseInt(activoId) } });
        if (!activo) return res.status(404).json({ error: 'Activo no encontrado' });
        if (activo.estado === 'DADO_DE_BAJA') {
            return res.status(400).json({ error: 'No se puede asignar un activo que ha sido dado de baja' });
        }

        const asignacionFinal = await prisma.$transaction(async (tx) => {
            // Cerrar asignación activa anterior
            await tx.asignacion.updateMany({
                where: { activoId: parseInt(activoId), fechaFin: null },
                data: { fechaFin: new Date() },
            });

            // Determinar nuevo estado del activo
            let nuevoEstado = 'ASIGNADO';
            if (tipo === 'DEVOLUCION') nuevoEstado = 'DISPONIBLE';
            
            const dataActivo = { estado: nuevoEstado };
            
            if (tipo === 'DEVOLUCION') {
                dataActivo.cedulaFuncionario = null;
                dataActivo.nombreFuncionario = null;
                dataActivo.shortname = null;
                dataActivo.cargo = null;
                dataActivo.area = null;
                dataActivo.ubicacion = null;
                dataActivo.departamento = null;
                dataActivo.ciudad = null;
                dataActivo.empresaFuncionario = null;
                dataActivo.tipoPersonal = null;
            } else {
                const funcionario = await tx.funcionario.findUnique({ where: { id: parseInt(funcionarioId) } });
                if (!funcionario) throw new Error('Funcionario no encontrado');
                
                dataActivo.cedulaFuncionario = funcionario.cedula;
                dataActivo.nombreFuncionario = funcionario.nombre;
                dataActivo.shortname = funcionario.shortname;
                dataActivo.cargo = funcionario.cargo;
                dataActivo.area = funcionario.area;
                dataActivo.ubicacion = funcionario.ubicacion;
                dataActivo.departamento = funcionario.departamento;
                dataActivo.ciudad = funcionario.ciudad;
                dataActivo.empresaFuncionario = funcionario.empresaFuncionario;
                dataActivo.tipoPersonal = funcionario.vinculacion;
            }

            // Actualizar estado del activo con los datos del funcionario (Sincronización/Caché)
            await tx.activo.update({
                where: { id: parseInt(activoId) },
                data: dataActivo,
            });

            if (tipo === 'DEVOLUCION') {
                return null;
            }

            const data = {
                activoId: parseInt(activoId),
                funcionarioId: parseInt(funcionarioId),
                tipo,
                observaciones,
                realizadoPor: req.user.nombre,
            };

            return await tx.asignacion.create({
                data,
                include: { activo: true, funcionario: true },
            });
        });

        if (tipo === 'DEVOLUCION') {
            return res.status(201).json({ message: 'Activo devuelto a TI correctamente' });
        }

        res.status(201).json(asignacionFinal);
    } catch (err) {
        if (err.message === 'Funcionario no encontrado') {
             return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Error al registrar asignación' });
    }
});

// POST /api/asignaciones/devolucion - Devolver a TI
router.post('/devolucion', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const { activoId, observaciones } = req.body;

        await prisma.$transaction(async (tx) => {
            // Cerrar asignación activa
            await tx.asignacion.updateMany({
                where: { activoId: parseInt(activoId), fechaFin: null },
                data: { fechaFin: new Date() },
            });

            // Marcar activo como disponible y limpiar caché de funcionario
            await tx.activo.update({
                where: { id: parseInt(activoId) },
                data: { 
                    estado: 'DISPONIBLE',
                    cedulaFuncionario: null,
                    nombreFuncionario: null,
                    shortname: null,
                    cargo: null,
                    area: null,
                    ubicacion: null,
                    departamento: null,
                    ciudad: null,
                    empresaFuncionario: null,
                    tipoPersonal: null
                },
            });
        });

        res.json({ message: 'Activo devuelto a TI correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar devolución' });
    }
});

module.exports = router;
