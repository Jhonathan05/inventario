-- CreateEnum
CREATE TYPE "EstadoActivo" AS ENUM ('DISPONIBLE', 'ASIGNADO', 'EN_MANTENIMIENTO', 'DADO_DE_BAJA');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ASIGNACION', 'TRASLADO', 'DEVOLUCION');

-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('MANTENIMIENTO', 'REPARACION', 'SUMINISTRO', 'INSPECCION', 'ACTUALIZACION', 'GARANTIA');

-- CreateEnum
CREATE TYPE "EstadoMantenimiento" AS ENUM ('CREADO', 'EN_PROCESO', 'SUSPENDIDO', 'FINALIZADO', 'CERRADO', 'ESPERA_SUMINISTRO', 'PROCESO_GARANTIA');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'TECNICO', 'CONSULTA');

-- CreateEnum
CREATE TYPE "EstadoTicket" AS ENUM ('CREADO', 'EN_CURSO', 'SIN_RESPUESTA', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "PrioridadTicket" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "TipoTicket" AS ENUM ('INCIDENTE', 'REQUERIMIENTO');

-- CreateEnum
CREATE TYPE "TipoTrazaTicket" AS ENUM ('CREACION', 'COMENTARIO', 'CAMBIO_ESTADO', 'ASIGNACION');

-- CreateTable
CREATE TABLE "catalogos" (
    "id" SERIAL NOT NULL,
    "dominio" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activos" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "serial" TEXT,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoActivo" NOT NULL DEFAULT 'DISPONIBLE',
    "categoriaId" INTEGER,
    "color" TEXT,
    "ubicacion" TEXT,
    "fechaCompra" TIMESTAMP(3),
    "valorCompra" DECIMAL(65,30),
    "garantiaHasta" TIMESTAMP(3),
    "observaciones" TEXT,
    "imagen" TEXT,
    "empresaPropietaria" TEXT DEFAULT 'FEDERACION',
    "dependencia" TEXT DEFAULT 'SUCURSAL IBAGUE',
    "fuenteRecurso" TEXT,
    "tipoRecurso" TEXT,
    "tipoControl" TEXT DEFAULT 'CONTROLADO',
    "estadoOperativo" TEXT DEFAULT 'EN OPERACI├ôN',
    "razonEstado" TEXT DEFAULT 'DISPONIBLE',
    "empresaFuncionario" TEXT DEFAULT 'FEDERACION',
    "tipoPersonal" TEXT,
    "cedulaFuncionario" TEXT,
    "shortname" TEXT,
    "nombreFuncionario" TEXT,
    "departamento" TEXT DEFAULT 'TOLIMA',
    "ciudad" TEXT DEFAULT 'IBAGUE',
    "cargo" TEXT,
    "area" TEXT,
    "tipo" TEXT,
    "nombreEquipo" TEXT,
    "procesador" TEXT,
    "memoriaRam" TEXT,
    "discoDuro" TEXT,
    "sistemaOperativo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "tiempoUso" TEXT,
    "tipoPropietario" TEXT,
    "checklist" TEXT,
    "ordenRemision" TEXT,

    CONSTRAINT "activos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "codigoPersonal" TEXT,
    "cargo" TEXT,
    "area" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "shortname" TEXT,
    "vinculacion" TEXT,
    "empresaFuncionario" TEXT,
    "proyecto" TEXT,
    "departamento" TEXT,
    "ciudad" TEXT,
    "seccional" TEXT,
    "municipio" TEXT,
    "ubicacion" TEXT,
    "piso" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones" (
    "id" SERIAL NOT NULL,
    "activoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "tipo" "TipoMovimiento" NOT NULL,
    "observaciones" TEXT,
    "realizadoPor" TEXT,

    CONSTRAINT "asignaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hoja_vida" (
    "id" SERIAL NOT NULL,
    "activoId" INTEGER NOT NULL,
    "tipo" "TipoServicio" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tecnico" TEXT,
    "costo" DECIMAL(65,30),
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proximoMantenimiento" TIMESTAMP(3),
    "registradoPor" TEXT,
    "casoAranda" TEXT,
    "estado" "EstadoMantenimiento" NOT NULL DEFAULT 'EN_PROCESO',
    "diagnostico" TEXT,
    "responsableId" INTEGER,
    "ticketId" INTEGER,

    CONSTRAINT "hoja_vida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazas_hoja_vida" (
    "id" SERIAL NOT NULL,
    "hojaVidaId" INTEGER NOT NULL,
    "estadoAnterior" "EstadoMantenimiento",
    "estadoNuevo" "EstadoMantenimiento" NOT NULL,
    "observacion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "trazas_hoja_vida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "ruta" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamano" INTEGER,
    "activoId" INTEGER,
    "asignacionId" INTEGER,
    "hojaVidaId" INTEGER,
    "ticketId" INTEGER,
    "trazaTicketId" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'TECNICO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_reporte" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipoReporte" TEXT NOT NULL,
    "columnas" JSONB NOT NULL,
    "esPredefinido" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actas" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivoUrl" TEXT,
    "observaciones" TEXT,
    "creadoPorId" INTEGER NOT NULL,
    "funcionarioId" INTEGER,
    "detalles" JSONB NOT NULL,

    CONSTRAINT "actas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoTicket" NOT NULL DEFAULT 'CREADO',
    "prioridad" "PrioridadTicket" NOT NULL DEFAULT 'MEDIA',
    "tipo" "TipoTicket" NOT NULL DEFAULT 'REQUERIMIENTO',
    "funcionarioId" INTEGER NOT NULL,
    "activoId" INTEGER,
    "asignadoAId" INTEGER,
    "creadoPorId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "cerradoEn" TIMESTAMP(3),

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazas_ticket" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "tipoTraza" "TipoTrazaTicket" NOT NULL DEFAULT 'COMENTARIO',
    "comentario" TEXT NOT NULL,
    "estadoAnterior" "EstadoTicket",
    "estadoNuevo" "EstadoTicket",
    "creadoPorId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trazas_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalogos_dominio_valor_key" ON "catalogos"("dominio", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "activos_placa_key" ON "activos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_cedula_key" ON "funcionarios"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_codigoPersonal_key" ON "funcionarios"("codigoPersonal");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_reporte_nombre_key" ON "perfiles_reporte"("nombre");

-- AddForeignKey
ALTER TABLE "activos" ADD CONSTRAINT "activos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_vida" ADD CONSTRAINT "hoja_vida_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_vida" ADD CONSTRAINT "hoja_vida_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_vida" ADD CONSTRAINT "hoja_vida_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_hoja_vida" ADD CONSTRAINT "trazas_hoja_vida_hojaVidaId_fkey" FOREIGN KEY ("hojaVidaId") REFERENCES "hoja_vida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_hoja_vida" ADD CONSTRAINT "trazas_hoja_vida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES "asignaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_hojaVidaId_fkey" FOREIGN KEY ("hojaVidaId") REFERENCES "hoja_vida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_trazaTicketId_fkey" FOREIGN KEY ("trazaTicketId") REFERENCES "trazas_ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actas" ADD CONSTRAINT "actas_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actas" ADD CONSTRAINT "actas_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_asignadoAId_fkey" FOREIGN KEY ("asignadoAId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_ticket" ADD CONSTRAINT "trazas_ticket_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_ticket" ADD CONSTRAINT "trazas_ticket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

