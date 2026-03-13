require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const acta = await prisma.acta.findUnique({
            where: { id: 5 }
        });
        if (acta) {
            console.log(JSON.stringify(acta.detalles, null, 2));
        }
    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
