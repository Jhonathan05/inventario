const xlsx = require('xlsx');
const path = require('path');

try {
    const filePath = path.join(__dirname, 'plantillas', 'CMDB USUARIO FINAL.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Read the first 2 rows
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    console.log('--- Headers ---');
    console.log(JSON.stringify(data[0], null, 2));

    console.log('\n--- First Row Data ---');
    console.log(JSON.stringify(data[1], null, 2));
} catch (e) {
    console.error(e);
}
