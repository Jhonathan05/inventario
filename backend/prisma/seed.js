const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Categorías base
    const categorias = [
        { nombre: 'BOCINA', icono: 'speaker' },
        { nombre: 'CAMARA IP', icono: 'camera-video' },
        { nombre: 'CONTROLADORA MICROFONO', icono: 'microphone' },
        { nombre: 'EQUIPO ESCRITORIO', icono: 'computer-desktop' },
        { nombre: 'EQUIPO PORTATIL', icono: 'laptop' },
        { nombre: 'EQUIPO TODO EN UNO', icono: 'computer-desktop' },
        { nombre: 'ESCANER', icono: 'document-magnifying-glass' },
        { nombre: 'IMPRESORA', icono: 'printer' },
        { nombre: 'MICROFONO', icono: 'microphone' },
        { nombre: 'MONITOR', icono: 'tv' },
        { nombre: 'PLANTA TELEFONIA IP', icono: 'phone' },
        { nombre: 'ROUTER', icono: 'wifi' },
        { nombre: 'SERVIDOR', icono: 'server' },
        { nombre: 'SWITCH', icono: 'wifi' },
        { nombre: 'TABLETA', icono: 'device-tablet' },
        { nombre: 'TELEFONO IP', icono: 'phone' },
        { nombre: 'UPS', icono: 'bolt' },
        { nombre: 'VIDEO BEAM', icono: 'presentation' },
    ];

    for (const cat of categorias) {
        await prisma.categoria.upsert({
            where: { nombre: cat.nombre },
            update: {},
            create: cat,
        });
    }
    console.log(`✅ ${categorias.length} categorías creadas`);

    // Catálogos base (Áreas y Cargos)
    const areas = [
        'EXTENSIÓN RURAL', 'TIC', 'COMUNICACIONES', 'CEDULACIÓN',
        'BENEFICIO ECOLÓGICO', 'SICA', 'TESORERÍA', 'PROYECTOS',
        'SECCIONAL IBAGUÉ', 'DESARROLLO SOCIAL', 'JURÍDICA',
        'CONTABILIDAD', 'FINANCIERA', 'RECURSOS HUMANOS',
        'BIENES Y SERVICIOS', 'DIRECCIÓN'
    ];

    for (const area of areas) {
        await prisma.catalogo.upsert({
            where: { dominio_valor: { dominio: 'AREA', valor: area.toUpperCase() } },
            update: {},
            create: { dominio: 'AREA', valor: area.toUpperCase() },
        });
    }

    const cargos = [
        'ANALISTA', 'APRENDIZ', 'AUXILIAR ADMINISTRATIVO BIENES Y SERVICIOS',
        'AUXILIAR ADMINISTRATIVO GESTION HUMANA', 'AUXILIAR ADMINISTRATIVO SERVICIOS',
        'COORDINADOR ADMINISTRATIVO', 'COORDINADOR CONTABLE', 'COORDINADOR FINANCIERO',
        'COORDINADOR FORTALECIMIENTO GREMIAL', 'COORDINADOR GRUPO BENEFICIO ECOLOGICO',
        'COORDINADOR PROGRAMA', 'COORDINADOR SECCIONAL EXTENSION RURAL',
        'DIRECTOR EJECUTIVO', 'EXTENSIONISTA', 'EXTENSIONISTA SICA',
        'LIDER DEPARTAMENTAL EXTENSION RURAL', 'NO APLICA', 'PASANTE',
        'PROFESIONAL DESARROLLO SOCIAL', 'PROMOTOR DESARROLLO RURAL',
        'RECEPCION', 'TESORERO AUXILIAR'
    ];

    for (const cargo of cargos) {
        await prisma.catalogo.upsert({
            where: { dominio_valor: { dominio: 'CARGO', valor: cargo.toUpperCase() } },
            update: {},
            create: { dominio: 'CARGO', valor: cargo.toUpperCase() },
        });
    }

    console.log(`✅ ${areas.length} áreas y ${cargos.length} cargos añadidos al catálogo`);

    // Usuario administrador por defecto
    const adminPassword = await bcrypt.hash('C0m1t3*', 10);
    await prisma.usuario.upsert({
        where: { email: 'admininventario@cafedecolombia.com' },
        update: {},
        create: {
            nombre: 'Administrador',
            email: 'admininventario@cafedecolombia.com',
            password: adminPassword,
            rol: 'ADMIN',
        },
    });
    console.log('✅ Usuario admin creado: admininventario@cafedecolombia.com / C0m1t3*');

    // Usuario invitado (Consulta) por defecto
    const invitadoPassword = await bcrypt.hash('C0m1t3*', 10);
    await prisma.usuario.upsert({
        where: { email: 'invitado@cafedecolombia.com' },
        update: {},
        create: {
            nombre: 'Usuario Consulta',
            email: 'invitado@cafedecolombia.com',
            password: invitadoPassword,
            rol: 'CONSULTA',
        },
    });
    console.log('✅ Usuario invitado creado: invitado@cafedecolombia.com / C0m1t3*');

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
