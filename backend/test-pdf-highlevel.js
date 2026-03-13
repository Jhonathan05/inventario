const pdfmake = require('pdfmake');
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

pdfmake.setFonts(fonts);

async function test() {
    try {
        const docDefinition = {
            content: [
                { text: 'ACTA DE NOVEDAD', fontSize: 20, bold: true },
                { text: 'Prueba con API de ALTO NIVEL.' }
            ],
            defaultStyle: { font: 'Roboto' }
        };

        const pdfDoc = pdfmake.createPdf(docDefinition);
        const stream = await pdfDoc.getStream();
        const writeStream = fs.createWriteStream('test-highlevel.pdf');
        stream.pipe(writeStream);
        stream.end();
        
        writeStream.on('finish', () => {
            console.log('PDF generation finished (check test-highlevel.pdf)');
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
