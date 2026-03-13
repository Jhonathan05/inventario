require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? 'PRESENT' : 'MISSING');
        const usuarios = await prisma.usuario.findMany({
            take: 5,
            select: { email: true, nombre: true, activo: true }
        });
        console.log('Usuarios encontrados:', usuarios);
    } catch (e) {
        console.error('Error connecting to database or querying users:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
