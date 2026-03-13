const PdfPrinter = require('pdfmake/js/printer').default;
const fs = require('fs');
const path = require('path');

const fonts = {
    Roboto: {
        normal: path.join(__dirname, 'node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf'),
        bold: path.join(__dirname, 'node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf'),
        italics: path.join(__dirname, 'node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, 'node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf')
    }
};

const printer = new PdfPrinter(fonts);

async function test() {
    try {
        const docDefinition = {
            content: [
                { text: 'ACTA DE NOVEDAD', fontSize: 20, bold: true, color: '#A10F2A' },
                { text: 'Prueba de generación premium con Roboto.', margin: [0, 10] }
            ],
            defaultStyle: { font: 'Roboto' }
        };

        const pdfDoc = await printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream('test-premium.pdf'));
        pdfDoc.end();
        console.log('PDF generation finished (check test-premium.pdf)');
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
