const XlsxPopulate = require('xlsx-populate');
const path = require('path');
const fs = require('fs');

async function test() {
    try {
        const templatePath = path.join(__dirname, 'plantillas/novedad_activo.xlsx');
        const outputPath = path.join(__dirname, 'diag_populate_roundtrip.xlsx');

        console.log('Reading template with xlsx-populate...');
        const workbook = await XlsxPopulate.fromFileAsync(templatePath);
        
        console.log('Writing output...');
        await workbook.toFileAsync(outputPath);
        
        console.log('Success! File written to:', outputPath);
        const stats = fs.statSync(outputPath);
        console.log('Output size:', stats.size);
    } catch (err) {
        console.error('Error during xlsx-populate test:', err);
    }
}

test();
