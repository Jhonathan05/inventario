-- CreateEnum
CREATE TYPE "EstadoActivo" AS ENUM ('DISPONIBLE', 'ASIGNADO', 'EN_MANTENIMIENTO', 'DADO_DE_BAJA');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ASIGNACION', 'TRASLADO', 'DEVOLUCION');

-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('MANTENIMIENTO', 'REPARACION', 'SUMINISTRO', 'INSPECCION', 'ACTUALIZACION');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'TECNICO', 'CONSULTA');

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
    "categoriaId" INTEGER NOT NULL,
    "color" TEXT,
    "ubicacion" TEXT,
    "fechaCompra" TIMESTAMP(3),
    "valorCompra" DECIMAL(65,30),
    "garantiaHasta" TIMESTAMP(3),
    "observaciones" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "cargo" TEXT,
    "area" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
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

    CONSTRAINT "hoja_vida_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "activos_placa_key" ON "activos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_cedula_key" ON "funcionarios"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "activos" ADD CONSTRAINT "activos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoja_vida" ADD CONSTRAINT "hoja_vida_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_activoId_fkey" FOREIGN KEY ("activoId") REFERENCES "activos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES "asignaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_hojaVidaId_fkey" FOREIGN KEY ("hojaVidaId") REFERENCES "hoja_vida"("id") ON DELETE SET NULL ON UPDATE CASCADE;
