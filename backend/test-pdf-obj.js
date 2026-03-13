const PdfPrinter = require('pdfmake/js/printer').default;
const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};
const printer = new PdfPrinter(fonts);
const docDefinition = { content: ['Hello'], defaultStyle: { font: 'Helvetica' } };
const pdfDoc = printer.createPdfKitDocument(docDefinition);

console.log('pdfDoc type:', typeof pdfDoc);
console.log('pdfDoc keys:', Object.keys(pdfDoc));
console.log('pdfDoc constructor name:', pdfDoc.constructor.name);
