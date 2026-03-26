const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/asignaciones
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { activoId, funcionarioId, activa } = req.query;
        const where = {};
        if (activoId) where.activoId = parseInt(activoId);
        if (funcionarioId) where.funcionarioId = parseInt(funcionarioId);
        if (activa === 'true') where.fechaFin = null;

        const asignaciones = await prisma.asignacion.findMany({
            where,
            include: {
                activo: { include: { categoria: true } },
                funcionario: true,
                documentos: true,
            },
            orderBy: { fechaInicio: 'desc' },
        });
        res.json(asignaciones);
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

        // Cerrar asignación activa anterior
        await prisma.asignacion.updateMany({
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
            const funcionario = await prisma.funcionario.findUnique({ where: { id: parseInt(funcionarioId) } });
            if (!funcionario) return res.status(404).json({ error: 'Funcionario no encontrado' });
            
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
        await prisma.activo.update({
            where: { id: parseInt(activoId) },
            data: dataActivo,
        });

        if (tipo === 'DEVOLUCION') {
            return res.status(201).json({ message: 'Activo devuelto a TI correctamente' });
        }

        const data = {
            activoId: parseInt(activoId),
            funcionarioId: parseInt(funcionarioId),
            tipo,
            observaciones,
            realizadoPor: req.user.nombre,
        };

        const asignacion = await prisma.asignacion.create({
            data,
            include: { activo: true, funcionario: true },
        });

        res.status(201).json(asignacion);
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar asignación' });
    }
});

// POST /api/asignaciones/devolucion - Devolver a TI
router.post('/devolucion', authMiddleware, requireRole('ADMIN', 'ANALISTA_TIC'), async (req, res) => {
    try {
        const { activoId, observaciones } = req.body;

        // Cerrar asignación activa
        await prisma.asignacion.updateMany({
            where: { activoId: parseInt(activoId), fechaFin: null },
            data: { fechaFin: new Date() },
        });

        // Marcar activo como disponible y limpiar caché de funcionario
        await prisma.activo.update({
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

        res.json({ message: 'Activo devuelto a TI correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar devolución' });
    }
});

module.exports = router;
