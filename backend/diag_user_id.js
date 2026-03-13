require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log('Searching for 10054140 in Usuario ID...');
        const userById = await prisma.usuario.findUnique({
            where: { id: 10054140 }
        });
        console.log('User by ID:', !!userById);

        const users = await prisma.usuario.findMany({ take: 10 });
        console.log('Last 10 users:', JSON.stringify(users.map(u => ({id: u.id, email: u.email})), null, 2));

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
