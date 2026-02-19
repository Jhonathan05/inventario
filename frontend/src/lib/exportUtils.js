import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
    // 1. Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // 3. Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
