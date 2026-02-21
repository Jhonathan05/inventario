const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing Catalogo model...');
        const count = await prisma.catalogo.count();
        console.log(`Success! There are ${count} records in Catalogo.`);

        console.log('Fetching first 5 records...');
        const data = await prisma.catalogo.findMany({ take: 5 });
        console.dir(data);
    } catch (err) {
        console.error('ERROR testing Catalogo model:');
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
