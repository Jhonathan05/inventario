/**
 * Utility to map and format Asset data for CMDB export.
 */
const formatAssetForCMDB = (activo) => {
    return {
        'ID_ACTIVO': activo.id,
        'PLACA_INVENTARIO': activo.placa,
        'SERIAL': activo.serial || 'N/A',
        'ACTIVO_FIJO': activo.activoFijo || 'N/A',
        'MARCA': activo.marca,
        'MODELO': activo.modelo,
        'CATEGORIA': activo.categoria?.nombre || 'N/A',
        'TIPO_EQUIPO': activo.tipo || 'N/A',
        'ESTADO': activo.estado,
        'ESTADO_OPERATIVO': activo.estadoOperativo || 'N/A',
        
        // Technical Specs (CMDB Core)
        'NOMBRE_RED_HOST': activo.nombreEquipo || 'N/A',
        'PROCESADOR': activo.procesador || 'N/A',
        'RAM': activo.memoriaRam || 'N/A',
        'DISCO_DURO': activo.discoDuro || 'N/A',
        'SISTEMA_OPERATIVO': activo.sistemaOperativo || 'N/A',
        
        // Network Specs
        'DIRECCION_IP': activo.direccionIp || 'N/A',
        'DIRECCION_MAC': activo.direccionMac || 'N/A',
        'PUERTO_RED': activo.puertoRed || 'N/A',
        'VLAN': activo.vlan || 'N/A',

        // Administrative
        'EMPRESA_PROPIETARIA': activo.empresaPropietaria || 'FEDERACION',
        'DEPENDENCIA': activo.dependencia || 'N/A',
        'UBICACION': activo.ubicacion || 'N/A',
        
        // Assignment (Current User)
        'USUARIO_ASIGNADO': activo.nombreFuncionario || 'DISPONIBLE EN TI',
        'CEDULA_USUARIO': activo.cedulaFuncionario || 'N/A',
        'AREA_USUARIO': activo.area || 'N/A',
        
        'FECHA_ACTUALIZACION': activo.actualizadoEn.toISOString()
    };
};

/**
 * Generate a CSV string from an array of assets
 */
const generateCMDB_CSV = (activos) => {
    if (!activos || activos.length === 0) return '';
    
    const formatted = activos.map(formatAssetForCMDB);
    const headers = Object.keys(formatted[0]);
    
    const csvRows = [
        headers.join(','), // Header row
        ...formatted.map(row => 
            headers.map(header => {
                const val = row[header];
                const escaped = ('' + val).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',')
        )
    ];
    
    return csvRows.join('\n');
};

module.exports = {
    formatAssetForCMDB,
    generateCMDB_CSV
};
