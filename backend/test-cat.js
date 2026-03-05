const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.catalogo.groupBy({
        by: ['dominio'],
        _count: { dominio: true }
    });
    console.log("Catálogos por dominio:");
    console.log(JSON.stringify(result, null, 2));

    const activos = await prisma.activo.count();
    console.log("Total activos:", activos);
}

main().finally(() => prisma.$disconnect());
