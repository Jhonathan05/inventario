const PdfPrinter = require('pdfmake/js/printer').default;
const fs = require('fs');

const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

const printer = new PdfPrinter(fonts);

const docDefinition = {
    content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ],
    defaultStyle: {
        font: 'Helvetica'
    }
};

const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('test.pdf'));
pdfDoc.end();

console.log('PDF generation finished (check test.pdf)');
