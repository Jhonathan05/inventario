require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const users = await prisma.usuario.findMany({
            select: { id: true, email: true, rol: true, activo: true }
        });
        console.log('Users in DB:', JSON.stringify(users, null, 2));

        const admin = await prisma.usuario.findUnique({
            where: { email: 'admin@cafedecolombia.com' }
        });
        console.log('Admin user exists:', !!admin);
        if (admin) {
            console.log('Admin details:', JSON.stringify({
                id: admin.id,
                email: admin.email,
                rol: admin.rol,
                activo: admin.activo
            }));
        }
        
        // Buscar el número misterioso en todos los campos de usuario
        const anyUser = await prisma.usuario.findMany({
            where: {
                OR: [
                    { nombre: { contains: '10054140' } },
                    { email: { contains: '10054140' } }
                ]
            }
        });
        console.log('Users matching 10054140:', anyUser.length);

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
