const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRoles() {
  console.log('🛠️ Corrigiendo roles obsoletos (TECNICO -> ANALISTA_TIC)...');
  try {
    // Usamos SQL crudo para evitar validaciones del esquema de Prisma que fallan actualmente
    const result = await prisma.$executeRawUnsafe(`
      UPDATE usuarios SET rol = 'ANALISTA_TIC' WHERE rol = 'TECNICO'
    `);
    console.log(`✅ Roles actualizados: ${result}`);
  } catch (e) {
    if (e.message.includes('column "rol" does not exist')) {
        console.log('Información: La columna "rol" aún no existe o tiene otro nombre.');
    } else {
        console.log('Error al actualizar roles:', e.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixRoles();
