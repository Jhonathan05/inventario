require('dotenv').config({path: './.env'});
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function check() {
    try {
        const admin = await prisma.usuario.findUnique({
            where: { email: 'admin@cafedecolombia.com' }
        });
        if (!admin) {
            console.log('Admin not found');
            return;
        }

        console.log('Admin hash:', admin.password);
        
        try {
            const valid = await bcrypt.compare('C0m1t3*', admin.password);
            console.log('Is C0m1t3* valid?', valid);
        } catch (e) {
            console.log('Bcrypt compare failed with ERROR:', e.message);
        }

    } catch (e) {
        console.error('Check failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
