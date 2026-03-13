const pdfmake = require('pdfmake');
console.log('pdfmake keys:', Object.keys(pdfmake));
if (pdfmake.default) {
    console.log('pdfmake.default keys:', Object.keys(pdfmake.default));
}
