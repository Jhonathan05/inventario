require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log('Searching for 10054140 in Activo...');
        const activos = await prisma.activo.findMany({
            where: {
                OR: [
                    { placa: '10054140' },
                    { serial: '10054140' }
                ]
            }
        });
        console.log('Found activos:', JSON.stringify(activos, null, 2));

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
