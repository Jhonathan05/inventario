const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function repair() {
  console.log('🔧 Iniciando Reparación de Valores...');
  
  // 1. Sincronizar datos de funcionario en Activos
  console.log('🔄 Sincronizando nombres, cédulas, áreas y cargos...');
  
  const activosAsignados = await prisma.activo.findMany({
    where: {
      asignaciones: {
        some: { fechaFin: null }
      }
    },
    include: {
      asignaciones: {
        where: { fechaFin: null },
        include: { funcionario: true }
      }
    }
  });

  let updatedCount = 0;

  for (const activo of activosAsignados) {
    const funcionario = activo.asignaciones[0].funcionario;
    
    // Comprobar si hay diferencias
    const needsUpdate = 
      activo.cedulaFuncionario !== funcionario.cedula ||
      activo.nombreFuncionario !== funcionario.nombre ||
      activo.area !== funcionario.area ||
      activo.cargo !== funcionario.cargo;

    if (needsUpdate) {
      process.stdout.write(` - Reparando Activo ${activo.placa}... `);
      await prisma.activo.update({
        where: { id: activo.id },
        data: {
          cedulaFuncionario: funcionario.cedula,
          nombreFuncionario: funcionario.nombre,
          area: funcionario.area,
          cargo: funcionario.cargo
        }
      });
      console.log('✅');
      updatedCount++;
    }
  }

  // 2. Limpieza de campos en activos DISPONIBLES (Opcional, por limpieza)
  console.log('\n🧹 Limpiando campos de funcionario en activos disponibles...');
  const resultClean = await prisma.activo.updateMany({
    where: {
      estado: 'DISPONIBLE',
      OR: [
        { cedulaFuncionario: { not: null } },
        { nombreFuncionario: { not: null } }
      ]
    },
    data: {
      cedulaFuncionario: null,
      nombreFuncionario: null,
      cargo: null,
      area: null
    }
  });
  console.log(`✅ Campos limpiados en ${resultClean.count} activos disponibles.`);

  console.log('\n--- RESUMEN DE REPARACIÓN ---');
  console.log(`✨ Activos sincronizados con funcionario real: ${updatedCount}`);
  console.log(`✨ Activos disponibles normalizados (vacíos): ${resultClean.count}`);
}

repair()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
