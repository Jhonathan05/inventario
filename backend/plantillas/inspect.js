const XLSX = require('xlsx');
const wb = XLSX.readFile('/app/plantillas/novedad_activo.xls');
console.log('Sheets:', wb.SheetNames);
wb.SheetNames.forEach(sheetName => {
    console.log('\n=== HOJA:', sheetName, '===');
    const ws = wb.Sheets[sheetName];
    console.log('Ref:', ws['!ref']);
    // Show merged cells
    if (ws['!merges']) {
        console.log('Merged cells:', ws['!merges'].length);
    }
    // Print all non-empty cells
    for (const addr in ws) {
        if (addr.startsWith('!')) continue;
        const cell = ws[addr];
        if (cell.v !== undefined && String(cell.v).trim() !== '') {
            console.log(addr + ':', JSON.stringify(cell.v));
        }
    }
});
