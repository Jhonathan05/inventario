require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log('Searching for 10054140 in Funcionario...');
        const funcs = await prisma.funcionario.findMany({
            where: {
                OR: [
                    { cedula: '10054140' },
                    { codigoPersonal: '10054140' }
                ]
            }
        });
        console.log('Found funcionarios:', JSON.stringify(funcs, null, 2));

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
