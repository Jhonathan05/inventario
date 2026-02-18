const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Categorías base
    const categorias = [
        { nombre: 'Computador de Escritorio', icono: 'computer-desktop' },
        { nombre: 'Portátil', icono: 'laptop' },
        { nombre: 'Impresora', icono: 'printer' },
        { nombre: 'Monitor', icono: 'tv' },
        { nombre: 'Teléfono IP', icono: 'phone' },
        { nombre: 'Tablet', icono: 'device-tablet' },
        { nombre: 'UPS / Regulador', icono: 'bolt' },
        { nombre: 'Switch / Router', icono: 'wifi' },
        { nombre: 'Escáner', icono: 'document-magnifying-glass' },
        { nombre: 'Otro', icono: 'cube' },
    ];

    for (const cat of categorias) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: {},
            create: cat,
        });
    }
    console.log(`✅ ${categorias.length} categorías creadas`);

    // Usuario administrador por defecto
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    await prisma.usuario.upsert({
        where: { email: 'admin@inventario.com' },
        update: {},
        create: {
            nombre: 'Administrador',
            email: 'admin@inventario.com',
            password: adminPassword,
            rol: 'ADMIN',
        },
    });
    console.log('✅ Usuario admin creado: admin@inventario.com / Admin123!');

    console.log('🎉 Seed completado exitosamente');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
