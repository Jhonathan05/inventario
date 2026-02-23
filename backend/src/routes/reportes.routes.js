const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');

// GET /api/reportes/inventario - Todos los activos con relaciones
router.get('/inventario', authMiddleware, async (req, res) => {
    try {
        const { estado, empresaPropietaria, estadoOperativo, tipo, categoriaId } = req.query;
        const where = {};
        if (estado) where.estado = estado;
        if (empresaPropietaria) where.empresaPropietaria = empresaPropietaria;
        if (estadoOperativo) where.estadoOperativo = estadoOperativo;
        if (tipo) where.tipo = tipo;
        if (categoriaId) where.categoriaId = parseInt(categoriaId);

        const activos = await prisma.activo.findMany({
            where,
            include: {
                categoria: true,
                asignaciones: {
                    where: { fechaFin: null },
                    include: { funcionario: true },
                    take: 1,
                },
            },
            orderBy: { id: 'asc' },
        });
        res.json(activos);
    } catch (error) {
        console.error('Error en reporte inventario:', error);
        res.status(500).json({ error: 'Error al generar reporte de inventario' });
    }
});

// GET /api/reportes/por-funcionario - Activos agrupados por funcionario
router.get('/por-funcionario', authMiddleware, async (req, res) => {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            where: { activo: true },
            include: {
                asignaciones: {
                    where: { fechaFin: null },
                    include: {
                        activo: {
                            include: { categoria: true },
                        },
                    },
                },
            },
            orderBy: { nombre: 'asc' },
        });
        res.json(funcionarios);
    } catch (error) {
        console.error('Error en reporte por funcionario:', error);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// GET /api/reportes/asignaciones - Historial de movimientos
router.get('/asignaciones', authMiddleware, async (req, res) => {
    try {
        const { tipo, fechaDesde, fechaHasta } = req.query;
        const where = {};
        if (tipo) where.tipo = tipo;
        if (fechaDesde || fechaHasta) {
            where.fechaInicio = {};
            if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde);
            if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta);
        }

        const asignaciones = await prisma.asignacion.findMany({
            where,
            include: {
                activo: { include: { categoria: true } },
                funcionario: true,
            },
            orderBy: { fechaInicio: 'desc' },
        });
        res.json(asignaciones);
    } catch (error) {
        console.error('Error en reporte asignaciones:', error);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// GET /api/reportes/mantenimiento - Hoja de vida / eventos técnicos
router.get('/mantenimiento', authMiddleware, async (req, res) => {
    try {
        const { estado, tipoServicio, fechaDesde, fechaHasta } = req.query;
        const where = {};
        if (estado) where.estado = estado;
        if (tipoServicio) where.tipo = tipoServicio;
        if (fechaDesde || fechaHasta) {
            where.fecha = {};
            if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
            if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
        }

        const eventos = await prisma.hojaVida.findMany({
            where,
            include: {
                activo: { include: { categoria: true } },
                responsable: true,
                trazas: {
                    include: { usuario: true },
                    orderBy: { fecha: 'desc' },
                },
            },
            orderBy: { fecha: 'desc' },
        });
        res.json(eventos);
    } catch (error) {
        console.error('Error en reporte mantenimiento:', error);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// GET /api/reportes/garantias - Activos con info de garantía
router.get('/garantias', authMiddleware, async (req, res) => {
    try {
        const { filtro } = req.query; // 'vencidas', 'proximas', 'vigentes', 'todas'
        const now = new Date();
        const tresMeses = new Date();
        tresMeses.setMonth(tresMeses.getMonth() + 3);

        let where = { garantiaHasta: { not: null } };
        if (filtro === 'vencidas') {
            where.garantiaHasta = { lt: now };
        } else if (filtro === 'proximas') {
            where.garantiaHasta = { gte: now, lte: tresMeses };
        } else if (filtro === 'vigentes') {
            where.garantiaHasta = { gt: tresMeses };
        }

        const activos = await prisma.activo.findMany({
            where,
            include: { categoria: true },
            orderBy: { garantiaHasta: 'asc' },
        });
        res.json(activos);
    } catch (error) {
        console.error('Error en reporte garantías:', error);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// GET /api/reportes/estadisticas - Datos agregados
router.get('/estadisticas', authMiddleware, async (req, res) => {
    try {
        const [
            totalActivos,
            porEstado,
            porCategoria,
            porEmpresa,
            porTipoEquipo,
            porEstadoOp,
            totalMantenimientos,
            costoTotal,
        ] = await Promise.all([
            prisma.activo.count(),
            prisma.activo.groupBy({ by: ['estado'], _count: true }),
            prisma.activo.groupBy({ by: ['categoriaId'], _count: true }),
            prisma.activo.groupBy({ by: ['empresaPropietaria'], _count: true, where: { empresaPropietaria: { not: null } } }),
            prisma.activo.groupBy({ by: ['tipo'], _count: true, where: { tipo: { not: null } } }),
            prisma.activo.groupBy({ by: ['estadoOperativo'], _count: true, where: { estadoOperativo: { not: null } } }),
            prisma.hojaVida.count(),
            prisma.hojaVida.aggregate({ _sum: { costo: true } }),
        ]);

        // Resolver nombres de categorías
        const categorias = await prisma.categoria.findMany();
        const catMap = Object.fromEntries(categorias.map(c => [c.id, c.nombre]));
        const porCategoriaResolved = porCategoria.map(c => ({
            nombre: catMap[c.categoriaId] || 'Sin Categoría',
            cantidad: c._count,
        }));

        res.json({
            totalActivos,
            porEstado: porEstado.map(e => ({ estado: e.estado, cantidad: e._count })),
            porCategoria: porCategoriaResolved,
            porEmpresa: porEmpresa.map(e => ({ empresa: e.empresaPropietaria || 'N/A', cantidad: e._count })),
            porTipoEquipo: porTipoEquipo.map(e => ({ tipo: e.tipo || 'N/A', cantidad: e._count })),
            porEstadoOperativo: porEstadoOp.map(e => ({ estado: e.estadoOperativo || 'N/A', cantidad: e._count })),
            totalMantenimientos,
            costoTotalMantenimiento: costoTotal._sum.costo || 0,
        });
    } catch (error) {
        console.error('Error en estadísticas:', error);
        res.status(500).json({ error: 'Error al generar estadísticas' });
    }
});

// ==========================================
// CRUD - PERFILES DE REPORTE
// ==========================================

// GET /api/reportes/perfiles - Listar todos los perfiles
router.get('/perfiles', authMiddleware, async (req, res) => {
    try {
        const { tipoReporte } = req.query;
        const where = {};
        if (tipoReporte) where.tipoReporte = tipoReporte;
        const perfiles = await prisma.perfilReporte.findMany({
            where,
            orderBy: [{ esPredefinido: 'desc' }, { nombre: 'asc' }],
        });
        res.json(perfiles);
    } catch (error) {
        console.error('Error listando perfiles:', error);
        res.status(500).json({ error: 'Error al listar perfiles' });
    }
});

// GET /api/reportes/perfiles/:id - Obtener un perfil
router.get('/perfiles/:id', authMiddleware, async (req, res) => {
    try {
        const perfil = await prisma.perfilReporte.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!perfil) return res.status(404).json({ error: 'Perfil no encontrado' });
        res.json(perfil);
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// POST /api/reportes/perfiles - Crear perfil
router.post('/perfiles', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { nombre, descripcion, tipoReporte, columnas } = req.body;
        const perfil = await prisma.perfilReporte.create({
            data: { nombre, descripcion, tipoReporte, columnas },
        });
        res.status(201).json(perfil);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe un perfil con ese nombre' });
        }
        console.error('Error creando perfil:', error);
        res.status(500).json({ error: 'Error al crear perfil' });
    }
});

// PUT /api/reportes/perfiles/:id - Actualizar perfil
router.put('/perfiles/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const { nombre, descripcion, tipoReporte, columnas } = req.body;
        const perfil = await prisma.perfilReporte.update({
            where: { id: parseInt(req.params.id) },
            data: { nombre, descripcion, tipoReporte, columnas },
        });
        res.json(perfil);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe un perfil con ese nombre' });
        }
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
});

// DELETE /api/reportes/perfiles/:id - Eliminar perfil
router.delete('/perfiles/:id', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const perfil = await prisma.perfilReporte.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!perfil) return res.status(404).json({ error: 'Perfil no encontrado' });
        if (perfil.esPredefinido) return res.status(400).json({ error: 'No se puede eliminar un perfil predefinido' });
        await prisma.perfilReporte.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Perfil eliminado' });
    } catch (error) {
        console.error('Error eliminando perfil:', error);
        res.status(500).json({ error: 'Error al eliminar perfil' });
    }
});

// POST /api/reportes/perfiles/seed - Crear perfiles predefinidos
router.post('/perfiles/seed', authMiddleware, requireRole('ADMIN', 'TECNICO'), async (req, res) => {
    try {
        const existing = await prisma.perfilReporte.findFirst({ where: { nombre: 'CMDB USUARIO FINAL' } });
        if (existing) return res.json({ message: 'Perfiles predefinidos ya existen', perfil: existing });

        const perfil = await prisma.perfilReporte.create({
            data: {
                nombre: 'CMDB USUARIO FINAL',
                descripcion: 'Formato estándar CMDB para reporte de equipos asignados a usuarios finales',
                tipoReporte: 'inventario',
                esPredefinido: true,
                columnas: [
                    { key: 'empresaPropietaria', label: 'EMPRESA PROPIETARIO DEL EQUIPO' },
                    { key: 'dependencia', label: 'DEPENDENCIA' },
                    { key: 'fuenteRecurso', label: 'FUENTE DE RECURSO' },
                    { key: 'empresaFuncionario', label: 'EMPRESA FUNCIONARIO' },
                    { key: 'tipoPersonal', label: 'EMPLEADO O CONTRATISTA' },
                    { key: 'cedulaFuncionario', label: 'CEDULA DEL FUNCIONARIO/CONTRATISTA' },
                    { key: 'shortname', label: 'SHORTNAME' },
                    { key: 'nombreFuncionario', label: 'NOMBRES Y APELLIDOS' },
                    { key: 'departamento', label: 'DEPARTAMENTO' },
                    { key: 'ciudad', label: 'CIUDAD' },
                    { key: 'cargo', label: 'CARGO' },
                    { key: 'area', label: 'ÁREA' },
                    { key: 'ubicacion', label: 'UBICACIÓN Y PISO' },
                    { key: 'tipoRecurso', label: 'TIPO DE RECURSO' },
                    { key: 'tipo', label: 'TIPO' },
                    { key: 'serial', label: 'SERIAL' },
                    { key: 'placa', label: 'PLACA' },
                    { key: 'marca', label: 'MARCA' },
                    { key: 'modelo', label: 'MODELO' },
                    { key: 'nombreEquipo', label: 'NOMBRE DE EQUIPO' },
                    { key: 'estadoOperativo', label: 'ESTADO OPERATIVO' },
                    { key: 'razonEstado', label: 'RAZÓN DEL ESTADO' },
                    { key: 'tipoControl', label: 'ADMINISTRADO/CONTROLADO' },
                    { key: 'procesador', label: 'PROCESADOR' },
                    { key: 'memoriaRam', label: 'MEMORIA RAM' },
                    { key: 'discoDuro', label: 'TAMAÑO DISCO DURO' },
                    { key: 'sistemaOperativo', label: 'SISTEMA OPERATIVO' },
                    { key: 'fechaCompra', label: 'FECHA DE COMPRA' },
                    { key: 'garantiaHasta', label: 'FIN DE GARANTIA' },
                    { key: 'tiempoUso', label: 'TIEMPO USO (AÑOS)' },
                    { key: 'tipoPropiedad', label: 'TIPO DE PROPIEDAD' },
                    { key: 'checklistTI', label: 'CHEKLIST (RESPONSABLE TI)' },
                    { key: 'ordenRemision', label: 'ORDEN DE REMISIÓN' },
                    { key: 'observaciones', label: 'OBSERVACIONES' },
                ],
            },
        });
        res.status(201).json({ message: 'Perfil CMDB creado', perfil });
    } catch (error) {
        console.error('Error creando perfiles predefinidos:', error);
        res.status(500).json({ error: 'Error al crear perfiles predefinidos' });
    }
});

module.exports = router;
