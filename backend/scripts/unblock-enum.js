const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function unblockEnum() {
  console.log('🛠️ Intentando desbloquear el ENUM de ROLES...');
  try {
    // 1. Agregar el nuevo valor al enum de Postgres directamente
    // Nota: ALTER TYPE ADD VALUE no puede ejecutarse dentro de una transacción en algunas versiones
    await prisma.$executeRawUnsafe(`ALTER TYPE "Rol" ADD VALUE IF NOT EXISTS 'ANALISTA_TIC'`);
    console.log('✅ Valor "ANALISTA_TIC" agregado al ENUM (si no existía).');

    // 2. Ahora sí podemos actualizar los usuarios
    const result = await prisma.$executeRawUnsafe(`
      UPDATE usuarios SET rol = 'ANALISTA_TIC' WHERE rol = 'TECNICO'
    `);
    console.log(`✅ Roles migrados: ${result}`);

  } catch (e) {
    console.log('Error durante el desbloqueo:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

unblockEnum();
