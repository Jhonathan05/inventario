const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing all codigoPersonal values to allow unique constraint...');

    const result = await prisma.funcionario.updateMany({
        data: { codigoPersonal: null }
    });

    console.log(`Updated ${result.count} records to null.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
