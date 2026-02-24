const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const counts = await prisma.usuario.count();
        console.log('COUNT:', counts);
        const users = await prisma.usuario.findMany({
            select: { email: true, rol: true, activo: true }
        });
        console.log('USERS:', JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
