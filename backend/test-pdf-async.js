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

async function test() {
    try {
        const docDefinition = {
            content: ['Hello Async World'],
            defaultStyle: { font: 'Helvetica' }
        };

        const pdfDoc = await printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream('test-async.pdf'));
        pdfDoc.end();
        console.log('PDF generation finished (check test-async.pdf)');
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
