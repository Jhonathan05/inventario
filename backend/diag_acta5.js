require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log('Searching for Acta ID 5...');
        const acta = await prisma.acta.findUnique({
            where: { id: 5 },
            include: { funcionario: true, creadoPor: true }
        });
        console.log('Acta ID 5 found:', !!acta);
        if (acta) {
            console.log('Acta details:', JSON.stringify(acta, null, 2));
        }

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
