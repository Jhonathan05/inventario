const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'plantillas/novedad_activo.xls');
const outputPath = path.join(__dirname, 'plantillas/novedad_activo.xlsx');

console.log('Converting', inputPath, 'to', outputPath);

if (!fs.existsSync(inputPath)) {
    console.error('Input file not found');
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(inputPath);
    XLSX.writeFile(workbook, outputPath, { bookType: 'xlsx', type: 'buffer' });
    console.log('Conversion successful. Output size:', fs.statSync(outputPath).size);
} catch (err) {
    console.error('Conversion failed:', err);
    process.exit(1);
}
