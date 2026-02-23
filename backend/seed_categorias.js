const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TIPOS_EQUIPO = [
    'EQUIPO ESCRITORIO', 'EQUIPO PORTATIL', 'EQUIPO TODO EN UNO', 'IMPRESORA',
    'TABLETA', 'ESCANER', 'MONITOR', 'VIDEO BEAM', 'TELEFONO IP', 'SWITCH',
    'ROUTER', 'PLANTA TELEFONIA IP', 'UPS', 'SERVIDOR', 'CAMARA IP', 'BOCINA',
    'MICROFONO', 'CONTROLADORA MICROFONO'
];

async function main() {
    console.log('Iniciando actualización de categorías...');
    let creadas = 0;

    for (const nombre of TIPOS_EQUIPO) {
        const existe = await prisma.categoria.findUnique({ where: { nombre } });
        if (!existe) {
            await prisma.categoria.create({ data: { nombre } });
            console.log(`- Creada categoría: ${nombre}`);
            creadas++;
        }
    }

    console.log(`Proceso finalizado. ${creadas} categorías nuevas agregadas.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
