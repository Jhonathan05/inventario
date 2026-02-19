import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatCurrency } from '../../../lib/utils';

export const generateMaintenanceReport = (activo, hojaVida) => {
    console.log("Generating report for:", activo, hojaVida);

    try {
        const doc = new jsPDF();
        console.log("jsPDF instance created:", doc);

        const pageWidth = doc.internal.pageSize.width;

        // Header
        console.log("Drawing Header...");
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('Reporte de Atención Técnica', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fecha de Impresión: ${new Date().toLocaleString()}`, pageWidth - 15, 30, { align: 'right' });
        doc.text(`ID Evento: #${hojaVida.id}`, 15, 30);

        // Section 1: Asset Information
        console.log("Drawing Asset Info Table...");
        autoTable(doc, {
            startY: 40,
            head: [['Información del Activo', '']],
            body: [
                ['Marca / Modelo', `${activo.marca} ${activo.modelo}`],
                ['Identificación', `Placa: ${activo.placa}  |  Serial: ${activo.serial}`],
                ['Ubicación', activo.ubicacion || 'No Registrada'],
                ['Categoría', activo.categoria?.nombre || 'General']
            ],
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }, // Indigo-600 used in app
            styles: { fontSize: 10, cellPadding: 3 }
        });

        // Section 2: Event Details
        console.log("Drawing Event Details Table...");
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Detalles del Servicio', '']],
            body: [
                ['Tipo de Evento', hojaVida.tipo],
                ['Estado Actual', hojaVida.estado],
                ['Fecha de Inicio', formatDate(hojaVida.fecha)],
                ['Técnico Responsable', hojaVida.responsable?.nombre || hojaVida.tecnico || 'Sin Asignar'],
                ['Caso Aranda', hojaVida.casoAranda || 'N/A'],
                ['Costo Reportado', formatCurrency(hojaVida.costo || 0)],
                ['Descripción del Problema', hojaVida.descripcion]
            ],
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 10, cellPadding: 3 }
        });

        // Section 3: Diagnosis / Conclusions
        if (hojaVida.diagnostico) {
            console.log("Drawing Diagnosis Table...");
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Diagnóstico Final / Conclusiones']],
                body: [[hojaVida.diagnostico]],
                theme: 'plain',
                headStyles: { fillColor: [229, 231, 235], textColor: 0, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 5 }
            });
        }

        // Section 4: History / Traceability
        const historyData = hojaVida.trazas?.map(t => [
            new Date(t.fecha).toLocaleString(),
            t.usuario?.nombre || 'Sistema',
            t.estadoNuevo,
            t.observacion
        ]) || [];

        if (historyData.length > 0) {
            console.log("Drawing History Table...");
            doc.text('Bitácora de Seguimiento', 14, doc.lastAutoTable.finalY + 12);
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 15,
                head: [['Fecha', 'Usuario', 'Estado', 'Observación']],
                body: historyData,
                theme: 'striped',
                headStyles: { fillColor: [107, 114, 128] }, // Gray-500
                styles: { fontSize: 9 }
            });
        }

        // Signatures Area
        console.log("Drawing Signatures...");
        const finalY = doc.lastAutoTable.finalY + 30;

        // Avoid page break constraints for simplicity in this version, usually check usage
        if (finalY < 250) {
            doc.setDrawColor(150);
            doc.line(30, finalY, 90, finalY); // Line 1
            doc.line(120, finalY, 180, finalY); // Line 2

            doc.setFontSize(9);
            doc.text('Firma del Técnico', 60, finalY + 5, { align: 'center' });
            doc.text('Recibido a Satisfacción', 150, finalY + 5, { align: 'center' });
        }

        // Save
        const fileName = `Reporte_${hojaVida.tipo}_${activo.placa}_${formatDate(hojaVida.fecha)}.pdf`;
        console.log("Saving PDF:", fileName);
        doc.save(fileName);
        console.log("PDF Saved successfully");

    } catch (error) {
        console.error("Error creating PDF:", error);
        alert(`Error: ${error.message}\nVer consola para más información.`);
    }
};
