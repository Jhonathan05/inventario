require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        console.log('Searching for 10054140 in Actas...');
        const actaById = await prisma.acta.findUnique({
            where: { id: 10054140 }
        });
        console.log('Acta by ID:', !!actaById);

        const actasWithDetails = await prisma.acta.findMany({
            where: {
                OR: [
                    { observaciones: { contains: '10054140' } },
                    { detalles: { path: ['activos'], array_contains: { placa: '10054140' } } }
                ]
            }
        });
        console.log('Actas matching total:', actasWithDetails.length);
        
        // Búsqueda cruda en el JSON de detalles
        const allActas = await prisma.acta.findMany({ take: 100 });
        const matches = allActas.filter(a => JSON.stringify(a.detalles).includes('10054140'));
        console.log('Matches in JSON details (first 100):', matches.length);
        if (matches.length > 0) {
            console.log('First match ID:', matches[0].id);
        }

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
