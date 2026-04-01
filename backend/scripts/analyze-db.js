const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyze() {
  console.log('🔍 Iniciando Auditoría de Datos...');
  const results = {
    statusMismatches: [],
    syncMismatches: [],
    orphans: {
      asignaciones: 0,
      licencias: 0,
      tickets: 0
    },
    bajaWithAssignment: []
  };

  // 1. Validar Estados de Activos vs Asignaciones
  const activos = await prisma.activo.findMany({
    include: {
      asignaciones: {
        where: { fechaFin: null },
        include: { funcionario: true }
      }
    }
  });

  for (const activo of activos) {
    const hasActiveAssignment = activo.asignaciones.length > 0;
    const currentAsig = hasActiveAssignment ? activo.asignaciones[0] : null;

    // Caso A: Marcado como ASIGNADO pero sin asignación vigente
    if (activo.estado === 'ASIGNADO' && !hasActiveAssignment) {
      results.statusMismatches.push({
        id: activo.id,
        placa: activo.placa,
        actual: 'ASIGNADO',
        deberiaSer: 'DISPONIBLE',
        motivo: 'No tiene asignación activa'
      });
    }

    // Caso B: Marcado como DISPONIBLE pero tiene asignación vigente
    if (activo.estado === 'DISPONIBLE' && hasActiveAssignment) {
      results.statusMismatches.push({
        id: activo.id,
        placa: activo.placa,
        actual: 'DISPONIBLE',
        deberiaSer: 'ASIGNADO',
        motivo: `Asignado a ${currentAsig.funcionario.nombre}`
      });
    }

    // Caso C: DADO_DE_BAJA con asignación activa (Error de flujo)
    if (activo.estado === 'DADO_DE_BAJA' && hasActiveAssignment) {
      results.bajaWithAssignment.push({
        id: activo.id,
        placa: activo.placa,
        funcionario: currentAsig.funcionario.nombre
      });
    }

    // 2. Sincronización de campos Funcionario
    if (hasActiveAssignment) {
      const func = currentAsig.funcionario;
      // Normalizamos nulos a string vacío para comparar
      const actCedula = activo.cedulaFuncionario || '';
      const actNombre = activo.nombreFuncionario || '';
      const realCedula = func.cedula || '';
      const realNombre = func.nombre || '';

      if (actCedula !== realCedula || actNombre !== realNombre) {
        results.syncMismatches.push({
          activoId: activo.id,
          placa: activo.placa,
          esperado: `${realNombre} (${realCedula})`,
          actual: `${actNombre} (${actCedula})`
        });
      }
    }
  }

  // 3. Huérfanos via SQL Crudo (más seguro tras una restauración manual)
  try {
    const asigOrphansResult = await prisma.$queryRaw`
      SELECT count(*)::int as count FROM asignaciones 
      WHERE "activoId" NOT IN (SELECT id FROM activos)
      OR "funcionarioId" NOT IN (SELECT id FROM funcionarios)
    `;
    results.orphans.asignaciones = asigOrphansResult[0].count;

    const licOrphansResult = await prisma.$queryRaw`
      SELECT count(*)::int as count FROM licencias 
      WHERE "activoId" IS NOT NULL AND "activoId" NOT IN (SELECT id FROM activos)
    `;
    results.orphans.licencias = licOrphansResult[0].count;
  } catch (e) {
    console.error('Error calculando huérfanos:', e.message);
  }

  // Reporte Final
  console.log('\n--- RESULTADOS DE LA AUDITORÍA ---');
  console.log(`✅ Activos analizados: ${activos.length}`);
  console.log(`⚠️  Inconsistencias de estado: ${results.statusMismatches.length}`);
  console.log(`🔄 Desincronización de datos funcionario: ${results.syncMismatches.length}`);
  console.log(`🚨 Activos DE BAJA con asignación abierta: ${results.bajaWithAssignment.length}`);
  console.log(`Ghost: Registros huérfanos detectados: ${results.orphans.asignaciones + results.orphans.licencias}`);

  if (results.statusMismatches.length > 0) {
    console.log('\nEjemplos de Mismatch de Estado:');
    results.statusMismatches.slice(0, 5).forEach(m => console.log(` - Activo ${m.placa}: ${m.actual} -> ${m.deberiaSer} (${m.motivo})`));
  }

  if (results.syncMismatches.length > 0) {
    console.log('\nEjemplos de Desincronización de Funcionario:');
    results.syncMismatches.slice(0, 5).forEach(m => console.log(` - Activo ${m.placa}: Actual [${m.actual}] vs Real [${m.esperado}]`));
  }

  return results;
}

analyze()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
