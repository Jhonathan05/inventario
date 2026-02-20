import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatCurrency } from '../../../lib/utils';

export const generateMaintenanceReport = (activo, hojaVida) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Header
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text('Reporte de Atención Técnica', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fecha de Impresión: ${new Date().toLocaleString()}`, pageWidth - 15, 30, { align: 'right' });
        doc.text(`ID Evento: #${hojaVida.id}`, 15, 30);

        // Section 1: Asset Information (con campos nuevos)
        autoTable(doc, {
            startY: 40,
            head: [['Información del Activo', '']],
            body: [
                ['Marca / Modelo', `${activo.marca} ${activo.modelo}`],
                ['Tipo de Equipo', activo.tipo || 'No Especificado'],
                ['Identificación', `Placa: ${activo.placa}  |  Serial: ${activo.serial}`],
                ['Nombre de Equipo', activo.nombreEquipo || 'N/A'],
                ['Ubicación', activo.ubicacion || 'No Registrada'],
                ['Categoría', activo.categoria?.nombre || 'General'],
                ['Empresa Propietaria', activo.empresaPropietaria || 'No Registrada'],
                ['Dependencia', activo.dependencia || 'No Registrada'],
            ],
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 10, cellPadding: 3 }
        });

        // Section 2: Technical Specifications (NUEVA)
        if (activo.procesador || activo.memoriaRam || activo.discoDuro || activo.sistemaOperativo) {
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Especificaciones Técnicas', '']],
                body: [
                    ['Procesador', activo.procesador || 'N/A'],
                    ['Memoria RAM', activo.memoriaRam || 'N/A'],
                    ['Disco Duro', activo.discoDuro || 'N/A'],
                    ['Sistema Operativo', activo.sistemaOperativo || 'N/A'],
                ],
                theme: 'grid',
                headStyles: { fillColor: [99, 102, 241] },
                styles: { fontSize: 10, cellPadding: 3 }
            });
        }

        // Section 3: Administration Info (NUEVA)
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Información Administrativa', '']],
            body: [
                ['Fuente de Recurso', activo.fuenteRecurso || 'N/A'],
                ['Tipo de Recurso', activo.tipoRecurso || 'N/A'],
                ['Tipo de Control', activo.tipoControl || 'N/A'],
                ['Estado Operativo', activo.estadoOperativo || 'N/A'],
                ['Razón de Estado', activo.razonEstado || 'N/A'],
                ['Funcionario', activo.nombreFuncionario || 'Sin Asignar'],
                ['Cédula Funcionario', activo.cedulaFuncionario || 'N/A'],
            ],
            theme: 'grid',
            headStyles: { fillColor: [107, 114, 128] },
            styles: { fontSize: 10, cellPadding: 3 }
        });

        // Section 4: Event Details
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

        // Section 5: Diagnosis / Conclusions
        if (hojaVida.diagnostico) {
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Diagnóstico Final / Conclusiones']],
                body: [[hojaVida.diagnostico]],
                theme: 'plain',
                headStyles: { fillColor: [229, 231, 235], textColor: 0, fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 5 }
            });
        }

        // Section 6: History / Traceability
        const historyData = hojaVida.trazas?.map(t => [
            new Date(t.fecha).toLocaleString(),
            t.usuario?.nombre || 'Sistema',
            t.estadoNuevo,
            t.observacion
        ]) || [];

        if (historyData.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Bitácora de Seguimiento', 14, 20);
            autoTable(doc, {
                startY: 25,
                head: [['Fecha', 'Usuario', 'Estado', 'Observación']],
                body: historyData,
                theme: 'striped',
                headStyles: { fillColor: [107, 114, 128] },
                styles: { fontSize: 9 }
            });
        }

        // Signatures Area
        const finalY = doc.lastAutoTable.finalY + 30;

        if (finalY < 250) {
            doc.setDrawColor(150);
            doc.line(30, finalY, 90, finalY);
            doc.line(120, finalY, 180, finalY);

            doc.setFontSize(9);
            doc.text('Firma del Técnico', 60, finalY + 5, { align: 'center' });
            doc.text('Recibido a Satisfacción', 150, finalY + 5, { align: 'center' });
        }

        // Save
        const fileName = `Reporte_${hojaVida.tipo}_${activo.placa}_${formatDate(hojaVida.fecha)}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error("Error creating PDF:", error);
        alert(`Error: ${error.message}\nVer consola para más información.`);
    }
};
