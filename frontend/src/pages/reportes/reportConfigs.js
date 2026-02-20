// Definición de columnas disponibles por tipo de reporte
// Cada columna: { key, label, default, group }

export const REPORT_TYPES = [
    {
        id: 'inventario',
        name: 'Inventario General',
        description: 'Listado completo de activos tecnológicos con todas sus propiedades',
        icon: '💻',
        color: 'indigo',
        endpoint: '/reportes/inventario',
    },
    {
        id: 'por-funcionario',
        name: 'Activos por Funcionario',
        description: 'Equipos asignados actualmente a cada persona',
        icon: '👤',
        color: 'blue',
        endpoint: '/reportes/por-funcionario',
    },
    {
        id: 'asignaciones',
        name: 'Asignaciones y Movimientos',
        description: 'Historial de asignaciones, traslados y devoluciones',
        icon: '🔄',
        color: 'green',
        endpoint: '/reportes/asignaciones',
    },
    {
        id: 'mantenimiento',
        name: 'Mantenimiento y Hoja de Vida',
        description: 'Eventos de servicio técnico: tipo, estado, costo, diagnóstico',
        icon: '🔧',
        color: 'yellow',
        endpoint: '/reportes/mantenimiento',
    },
    {
        id: 'garantias',
        name: 'Control de Garantías',
        description: 'Activos con garantía vigente, próxima a vencer o vencida',
        icon: '🛡️',
        color: 'red',
        endpoint: '/reportes/garantias',
    },
    {
        id: 'estadisticas',
        name: 'Resumen Estadístico',
        description: 'Conteos y totales por estado, empresa, tipo y categoría',
        icon: '📊',
        color: 'purple',
        endpoint: '/reportes/estadisticas',
    },
];

export const REPORT_COLUMNS = {
    inventario: [
        // Identificación
        { key: 'id', label: 'ID', default: false, group: 'Identificación' },
        { key: 'placa', label: 'Placa', default: true, group: 'Identificación' },
        { key: 'serial', label: 'Serial', default: true, group: 'Identificación' },
        { key: 'marca', label: 'Marca', default: true, group: 'Identificación' },
        { key: 'modelo', label: 'Modelo', default: true, group: 'Identificación' },
        { key: 'categoria', label: 'Categoría', default: true, group: 'Identificación' },
        { key: 'tipo', label: 'Tipo de Equipo', default: true, group: 'Identificación' },
        { key: 'nombreEquipo', label: 'Nombre de Equipo', default: false, group: 'Identificación' },
        { key: 'estado', label: 'Estado', default: true, group: 'Identificación' },
        { key: 'ubicacion', label: 'Ubicación', default: true, group: 'Identificación' },
        { key: 'color', label: 'Color', default: false, group: 'Identificación' },
        // Administración
        { key: 'empresaPropietaria', label: 'Empresa Propietaria', default: true, group: 'Administración' },
        { key: 'dependencia', label: 'Dependencia', default: false, group: 'Administración' },
        { key: 'fuenteRecurso', label: 'Fuente de Recurso', default: false, group: 'Administración' },
        { key: 'tipoRecurso', label: 'Tipo de Recurso', default: false, group: 'Administración' },
        { key: 'tipoControl', label: 'Tipo de Control', default: false, group: 'Administración' },
        { key: 'estadoOperativo', label: 'Estado Operativo', default: true, group: 'Administración' },
        { key: 'razonEstado', label: 'Razón de Estado', default: false, group: 'Administración' },
        // Funcionario
        { key: 'empresaFuncionario', label: 'Empresa Funcionario', default: false, group: 'Funcionario' },
        { key: 'tipoPersonal', label: 'Tipo de Personal', default: false, group: 'Funcionario' },
        { key: 'cedulaFuncionario', label: 'Cédula Funcionario', default: true, group: 'Funcionario' },
        { key: 'shortname', label: 'Shortname', default: false, group: 'Funcionario' },
        { key: 'nombreFuncionario', label: 'Nombre Funcionario', default: true, group: 'Funcionario' },
        { key: 'departamento', label: 'Departamento', default: false, group: 'Funcionario' },
        { key: 'ciudad', label: 'Ciudad', default: false, group: 'Funcionario' },
        { key: 'cargo', label: 'Cargo', default: false, group: 'Funcionario' },
        { key: 'area', label: 'Área', default: false, group: 'Funcionario' },
        // Especificaciones
        { key: 'procesador', label: 'Procesador', default: false, group: 'Especificaciones' },
        { key: 'memoriaRam', label: 'Memoria RAM', default: false, group: 'Especificaciones' },
        { key: 'discoDuro', label: 'Disco Duro', default: false, group: 'Especificaciones' },
        { key: 'sistemaOperativo', label: 'Sistema Operativo', default: false, group: 'Especificaciones' },
        // Financiero
        { key: 'valorCompra', label: 'Valor Compra', default: false, group: 'Financiero' },
        { key: 'fechaCompra', label: 'Fecha Compra', default: false, group: 'Financiero' },
        { key: 'garantiaHasta', label: 'Garantía Hasta', default: false, group: 'Financiero' },
        { key: 'tiempoUso', label: 'Tiempo Uso (Años)', default: false, group: 'Financiero' },
        // Meta
        { key: 'asignadoA', label: 'Asignado A (Actual)', default: false, group: 'Meta' },
        { key: 'tipoPropiedad', label: 'Tipo de Propiedad', default: false, group: 'Meta' },
        { key: 'checklistTI', label: 'Checklist (Responsable TI)', default: false, group: 'Meta' },
        { key: 'ordenRemision', label: 'Orden de Remisión', default: false, group: 'Meta' },
        { key: 'observaciones', label: 'Observaciones', default: false, group: 'Meta' },
    ],
    'por-funcionario': [
        { key: 'funcionarioNombre', label: 'Nombre Funcionario', default: true, group: 'Funcionario' },
        { key: 'funcionarioCedula', label: 'Cédula', default: true, group: 'Funcionario' },
        { key: 'funcionarioCargo', label: 'Cargo', default: true, group: 'Funcionario' },
        { key: 'funcionarioArea', label: 'Área', default: true, group: 'Funcionario' },
        { key: 'activoPlaca', label: 'Placa Activo', default: true, group: 'Activo' },
        { key: 'activoSerial', label: 'Serial', default: true, group: 'Activo' },
        { key: 'activoMarca', label: 'Marca', default: true, group: 'Activo' },
        { key: 'activoModelo', label: 'Modelo', default: true, group: 'Activo' },
        { key: 'activoTipo', label: 'Tipo Equipo', default: true, group: 'Activo' },
        { key: 'activoCategoria', label: 'Categoría', default: false, group: 'Activo' },
        { key: 'activoEstado', label: 'Estado', default: false, group: 'Activo' },
        { key: 'activoUbicacion', label: 'Ubicación', default: false, group: 'Activo' },
    ],
    asignaciones: [
        { key: 'id', label: 'ID', default: false, group: 'Movimiento' },
        { key: 'tipo', label: 'Tipo Movimiento', default: true, group: 'Movimiento' },
        { key: 'fechaInicio', label: 'Fecha Inicio', default: true, group: 'Movimiento' },
        { key: 'fechaFin', label: 'Fecha Fin', default: true, group: 'Movimiento' },
        { key: 'observaciones', label: 'Observaciones', default: true, group: 'Movimiento' },
        { key: 'realizadoPor', label: 'Realizado Por', default: false, group: 'Movimiento' },
        { key: 'funcionarioNombre', label: 'Funcionario', default: true, group: 'Funcionario' },
        { key: 'funcionarioCedula', label: 'Cédula', default: true, group: 'Funcionario' },
        { key: 'activoPlaca', label: 'Placa', default: true, group: 'Activo' },
        { key: 'activoSerial', label: 'Serial', default: true, group: 'Activo' },
        { key: 'activoMarca', label: 'Marca', default: true, group: 'Activo' },
        { key: 'activoModelo', label: 'Modelo', default: true, group: 'Activo' },
        { key: 'activoCategoria', label: 'Categoría', default: false, group: 'Activo' },
    ],
    mantenimiento: [
        { key: 'id', label: 'ID', default: false, group: 'Evento' },
        { key: 'tipo', label: 'Tipo Servicio', default: true, group: 'Evento' },
        { key: 'estado', label: 'Estado', default: true, group: 'Evento' },
        { key: 'fecha', label: 'Fecha', default: true, group: 'Evento' },
        { key: 'descripcion', label: 'Descripción', default: true, group: 'Evento' },
        { key: 'diagnostico', label: 'Diagnóstico', default: true, group: 'Evento' },
        { key: 'tecnico', label: 'Técnico/Proveedor', default: true, group: 'Evento' },
        { key: 'responsable', label: 'Responsable', default: true, group: 'Evento' },
        { key: 'casoAranda', label: 'Caso Aranda', default: true, group: 'Evento' },
        { key: 'costo', label: 'Costo', default: true, group: 'Evento' },
        { key: 'activoPlaca', label: 'Placa Activo', default: true, group: 'Activo' },
        { key: 'activoSerial', label: 'Serial', default: false, group: 'Activo' },
        { key: 'activoMarca', label: 'Marca', default: true, group: 'Activo' },
        { key: 'activoModelo', label: 'Modelo', default: true, group: 'Activo' },
        { key: 'activoCategoria', label: 'Categoría', default: false, group: 'Activo' },
    ],
    garantias: [
        { key: 'placa', label: 'Placa', default: true, group: 'Identificación' },
        { key: 'serial', label: 'Serial', default: true, group: 'Identificación' },
        { key: 'marca', label: 'Marca', default: true, group: 'Identificación' },
        { key: 'modelo', label: 'Modelo', default: true, group: 'Identificación' },
        { key: 'tipo', label: 'Tipo Equipo', default: true, group: 'Identificación' },
        { key: 'categoria', label: 'Categoría', default: true, group: 'Identificación' },
        { key: 'garantiaHasta', label: 'Garantía Hasta', default: true, group: 'Garantía' },
        { key: 'estadoGarantia', label: 'Estado Garantía', default: true, group: 'Garantía' },
        { key: 'diasRestantes', label: 'Días Restantes', default: true, group: 'Garantía' },
        { key: 'estado', label: 'Estado Activo', default: true, group: 'Estado' },
        { key: 'estadoOperativo', label: 'Estado Operativo', default: false, group: 'Estado' },
        { key: 'empresaPropietaria', label: 'Empresa', default: false, group: 'Administración' },
        { key: 'valorCompra', label: 'Valor Compra', default: false, group: 'Financiero' },
        { key: 'fechaCompra', label: 'Fecha Compra', default: false, group: 'Financiero' },
    ],
};

// Funciones para transformar datos crudos en filas exportables
export const transformData = (reportId, rawData, selectedColumns) => {
    const columnDefs = selectedColumns;

    switch (reportId) {
        case 'inventario':
            return rawData.map(a => {
                const row = {};
                columnDefs.forEach(col => {
                    switch (col.key) {
                        case 'categoria': row[col.label] = a.categoria?.nombre || ''; break;
                        case 'asignadoA': row[col.label] = a.asignaciones?.[0]?.funcionario?.nombre || 'Sin Asignar'; break;
                        case 'valorCompra': row[col.label] = a.valorCompra ? Number(a.valorCompra) : ''; break;
                        case 'fechaCompra': row[col.label] = a.fechaCompra ? new Date(a.fechaCompra).toLocaleDateString() : ''; break;
                        case 'garantiaHasta': row[col.label] = a.garantiaHasta ? new Date(a.garantiaHasta).toLocaleDateString() : ''; break;
                        case 'tiempoUso': {
                            if (a.fechaCompra) {
                                const years = ((new Date() - new Date(a.fechaCompra)) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
                                row[col.label] = years;
                            } else { row[col.label] = ''; }
                            break;
                        }
                        case 'tipoPropiedad': row[col.label] = ''; break;
                        case 'checklistTI': row[col.label] = ''; break;
                        case 'ordenRemision': row[col.label] = ''; break;
                        default: row[col.label] = a[col.key] || ''; break;
                    }
                });
                return row;
            });

        case 'por-funcionario': {
            const rows = [];
            rawData.forEach(f => {
                if (f.asignaciones?.length === 0) {
                    const row = {};
                    columnDefs.forEach(col => {
                        switch (col.key) {
                            case 'funcionarioNombre': row[col.label] = f.nombre; break;
                            case 'funcionarioCedula': row[col.label] = f.cedula; break;
                            case 'funcionarioCargo': row[col.label] = f.cargo || ''; break;
                            case 'funcionarioArea': row[col.label] = f.area || ''; break;
                            default: row[col.label] = 'Sin equipos asignados'; break;
                        }
                    });
                    rows.push(row);
                } else {
                    f.asignaciones?.forEach(asig => {
                        const row = {};
                        columnDefs.forEach(col => {
                            switch (col.key) {
                                case 'funcionarioNombre': row[col.label] = f.nombre; break;
                                case 'funcionarioCedula': row[col.label] = f.cedula; break;
                                case 'funcionarioCargo': row[col.label] = f.cargo || ''; break;
                                case 'funcionarioArea': row[col.label] = f.area || ''; break;
                                case 'activoPlaca': row[col.label] = asig.activo?.placa || ''; break;
                                case 'activoSerial': row[col.label] = asig.activo?.serial || ''; break;
                                case 'activoMarca': row[col.label] = asig.activo?.marca || ''; break;
                                case 'activoModelo': row[col.label] = asig.activo?.modelo || ''; break;
                                case 'activoTipo': row[col.label] = asig.activo?.tipo || ''; break;
                                case 'activoCategoria': row[col.label] = asig.activo?.categoria?.nombre || ''; break;
                                case 'activoEstado': row[col.label] = asig.activo?.estado || ''; break;
                                case 'activoUbicacion': row[col.label] = asig.activo?.ubicacion || ''; break;
                                default: row[col.label] = ''; break;
                            }
                        });
                        rows.push(row);
                    });
                }
            });
            return rows;
        }

        case 'asignaciones':
            return rawData.map(a => {
                const row = {};
                columnDefs.forEach(col => {
                    switch (col.key) {
                        case 'fechaInicio': row[col.label] = a.fechaInicio ? new Date(a.fechaInicio).toLocaleDateString() : ''; break;
                        case 'fechaFin': row[col.label] = a.fechaFin ? new Date(a.fechaFin).toLocaleDateString() : 'Activa'; break;
                        case 'funcionarioNombre': row[col.label] = a.funcionario?.nombre || ''; break;
                        case 'funcionarioCedula': row[col.label] = a.funcionario?.cedula || ''; break;
                        case 'activoPlaca': row[col.label] = a.activo?.placa || ''; break;
                        case 'activoSerial': row[col.label] = a.activo?.serial || ''; break;
                        case 'activoMarca': row[col.label] = a.activo?.marca || ''; break;
                        case 'activoModelo': row[col.label] = a.activo?.modelo || ''; break;
                        case 'activoCategoria': row[col.label] = a.activo?.categoria?.nombre || ''; break;
                        default: row[col.label] = a[col.key] || ''; break;
                    }
                });
                return row;
            });

        case 'mantenimiento':
            return rawData.map(hv => {
                const row = {};
                columnDefs.forEach(col => {
                    switch (col.key) {
                        case 'fecha': row[col.label] = hv.fecha ? new Date(hv.fecha).toLocaleDateString() : ''; break;
                        case 'responsable': row[col.label] = hv.responsable?.nombre || ''; break;
                        case 'costo': row[col.label] = hv.costo ? Number(hv.costo) : 0; break;
                        case 'activoPlaca': row[col.label] = hv.activo?.placa || ''; break;
                        case 'activoSerial': row[col.label] = hv.activo?.serial || ''; break;
                        case 'activoMarca': row[col.label] = hv.activo?.marca || ''; break;
                        case 'activoModelo': row[col.label] = hv.activo?.modelo || ''; break;
                        case 'activoCategoria': row[col.label] = hv.activo?.categoria?.nombre || ''; break;
                        default: row[col.label] = hv[col.key] || ''; break;
                    }
                });
                return row;
            });

        case 'garantias':
            return rawData.map(a => {
                const now = new Date();
                const garantia = a.garantiaHasta ? new Date(a.garantiaHasta) : null;
                const dias = garantia ? Math.ceil((garantia - now) / (1000 * 60 * 60 * 24)) : null;

                const row = {};
                columnDefs.forEach(col => {
                    switch (col.key) {
                        case 'categoria': row[col.label] = a.categoria?.nombre || ''; break;
                        case 'garantiaHasta': row[col.label] = garantia ? garantia.toLocaleDateString() : ''; break;
                        case 'estadoGarantia':
                            row[col.label] = dias === null ? 'Sin garantía' : dias < 0 ? '⛔ Vencida' : dias <= 90 ? '⚠️ Próxima' : '✅ Vigente';
                            break;
                        case 'diasRestantes': row[col.label] = dias !== null ? dias : ''; break;
                        case 'valorCompra': row[col.label] = a.valorCompra ? Number(a.valorCompra) : ''; break;
                        case 'fechaCompra': row[col.label] = a.fechaCompra ? new Date(a.fechaCompra).toLocaleDateString() : ''; break;
                        default: row[col.label] = a[col.key] || ''; break;
                    }
                });
                return row;
            });

        default:
            return rawData;
    }
};
