-- CreateEnum
CREATE TYPE "EstadoMantenimiento" AS ENUM ('EN_PROCESO', 'SUSPENDIDO', 'CERRADO');

-- AlterTable
ALTER TABLE "hoja_vida" ADD COLUMN     "casoAranda" TEXT,
ADD COLUMN     "estado" "EstadoMantenimiento" NOT NULL DEFAULT 'EN_PROCESO';

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

-- AddForeignKey
ALTER TABLE "trazas_hoja_vida" ADD CONSTRAINT "trazas_hoja_vida_hojaVidaId_fkey" FOREIGN KEY ("hojaVidaId") REFERENCES "hoja_vida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazas_hoja_vida" ADD CONSTRAINT "trazas_hoja_vida_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
