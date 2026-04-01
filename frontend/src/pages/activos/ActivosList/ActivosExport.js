import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { exportToExcel } from '../../../lib/exportUtils';

// ── Exportación de Activos ────────────────────────────────────────────────────

export const exportActivosExcel = (activos) => {
    if (!activos.length) return;
    const data = activos.map(a => ({
        Placa: a.placa || '',
        Serial: a.serial || '',
        Marca: a.marca || '',
        Modelo: a.modelo || '',
        Categoría: a.categoria?.nombre || '',
        Estado: a.estado || '',
        EstadoOperativo: a.estadoOperativo || '',
        'Ubicación y Piso': a.ubicacion || (a.asignaciones?.[0]?.funcionario?.ubicacion
            ? `${a.asignaciones[0].funcionario.ubicacion}${a.asignaciones[0].funcionario.piso ? ` - Piso ${a.asignaciones[0].funcionario.piso}` : ''}`
            : 'Sin Ubicación'),
        Funcionario_Asignado: a.asignaciones?.[0]?.funcionario?.nombre || 'Sin Asignar',
        Cédula_Funcionario: a.asignaciones?.[0]?.funcionario?.cedula || '',
    }));
    exportToExcel(data, `Reporte_Activos_${new Date().toISOString().split('T')[0]}`);
};

export const exportActivosPDF = (activos, funcionarios, filterFuncionario) => {
    if (!activos.length) return;
    const doc = new jsPDF('landscape');

    let headerText = 'Reporte General de Activos';
    if (filterFuncionario) {
        const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre;
        headerText = `Reporte de Activos Asignados a: ${funcName || 'Funcionario'}`;
    }

    doc.setFontSize(14);
    doc.text(headerText, 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Resultados: ${activos.length}`, 14, 22);

    const tableColumn = ['Placa', 'Serial', 'Marca/Modelo', 'Categoría', 'Estado', 'Ubicación y Piso', 'Asignado A'];
    const tableRows = activos.map(a => [
        a.placa || 'N/A',
        a.serial || 'N/A',
        `${a.marca || ''} ${a.modelo || ''}`.trim(),
        a.categoria?.nombre || 'N/A',
        a.estado || 'N/A',
        a.ubicacion || (a.asignaciones?.[0]?.funcionario?.ubicacion
            ? `${a.asignaciones[0].funcionario.ubicacion}${a.asignaciones[0].funcionario.piso ? ` - Piso ${a.asignaciones[0].funcionario.piso}` : ''}`
            : 'N/A'),
        a.asignaciones?.[0]?.funcionario?.nombre || 'N/A',
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [79, 70, 229] } });
    doc.save(`Activos_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ── Exportación de Historial de Funcionario ───────────────────────────────────

export const exportHistorialExcel = (historialData, funcionarios, filterFuncionario) => {
    if (!historialData.length) return;
    const exportData = historialData.map(asig => ({
        'Fecha Inicio': new Date(asig.fechaInicio).toLocaleDateString(),
        'Fecha Fin / Devolución': asig.fechaFin ? new Date(asig.fechaFin).toLocaleDateString() : 'Actual (Vigente)',
        'Movimiento': asig.tipo,
        'Activo (Equipo)': `${asig.activo?.marca || ''} ${asig.activo?.modelo || ''}`.trim() || 'N/A',
        'Placa': asig.activo?.placa || 'N/A',
        'Serial': asig.activo?.serial || 'N/A',
        'Observaciones': asig.observaciones || '-',
    }));
    const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre || 'Funcionario';
    exportToExcel(exportData, `Historial_Activos_${funcName.replace(/\s+/g, '_')}`);
};

export const exportHistorialPDF = (historialData, funcionarios, filterFuncionario) => {
    if (!historialData.length) return;
    const doc = new jsPDF('landscape');
    const funcName = funcionarios.find(f => f.id.toString() === filterFuncionario)?.nombre || 'Funcionario';

    doc.setFontSize(14);
    doc.text(`Historial Completo de Activos — ${funcName}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Movimientos: ${historialData.length}`, 14, 22);

    const tableColumn = ['Fecha Inicio', 'Fecha Fin', 'Movimiento', 'Equipo', 'Placa', 'Observaciones'];
    const tableRows = historialData.map(asig => [
        new Date(asig.fechaInicio).toLocaleDateString(),
        asig.fechaFin ? new Date(asig.fechaFin).toLocaleDateString() : 'Actual (Vigente)',
        asig.tipo || 'N/A',
        `${asig.activo?.marca || ''} ${asig.activo?.modelo || ''}`.trim() || 'N/A',
        asig.activo?.placa || 'N/A',
        asig.observaciones || '-',
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [79, 70, 229] } });
    doc.save(`Historial_Activos_${funcName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
