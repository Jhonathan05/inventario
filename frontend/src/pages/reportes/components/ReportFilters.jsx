export const FilterSelect = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <select value={value || ''} onChange={e => onChange(e.target.value || undefined)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
            <option value="">Todos</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    </div>
);

export const FilterDate = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input type="date" value={value || ''} onChange={e => onChange(e.target.value || undefined)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2" />
    </div>
);

export const ReportFilters = ({ selectedReport, filters, setFilters, catalogs }) => {
    if (!selectedReport) return null;
    
    switch (selectedReport.id) {
        case 'inventario':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FilterSelect label="Estado" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                        options={[{ value: 'DISPONIBLE', label: 'Disponible' }, { value: 'ASIGNADO', label: 'Asignado' }, { value: 'EN_MANTENIMIENTO', label: 'En Mantenimiento' }, { value: 'DADO_DE_BAJA', label: 'Dado de Baja' }]} />
                    <FilterSelect label="Empresa" value={filters.empresaPropietaria} onChange={v => setFilters(p => ({ ...p, empresaPropietaria: v }))}
                        options={catalogs.EMPRESA_PROPIETARIA.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Estado Operativo" value={filters.estadoOperativo} onChange={v => setFilters(p => ({ ...p, estadoOperativo: v }))}
                        options={catalogs.ESTADO_OPERATIVO.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Tipo Equipo" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                        options={catalogs.TIPO_EQUIPO.map(e => ({ value: e, label: e }))} />
                </div>
            );
        case 'asignaciones':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FilterSelect label="Tipo" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                        options={[{ value: 'ASIGNACION', label: 'Asignación' }, { value: 'TRASLADO', label: 'Traslado' }, { value: 'DEVOLUCION', label: 'Devolución' }]} />
                    <FilterDate label="Desde" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                    <FilterDate label="Hasta" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                </div>
            );
        case 'mantenimiento':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FilterSelect label="Estado" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                        options={[{ value: 'CREADO', label: 'Creado' }, { value: 'EN_PROCESO', label: 'En Proceso' }, { value: 'FINALIZADO', label: 'Finalizado' }, { value: 'CERRADO', label: 'Cerrado' }]} />
                    <FilterSelect label="Tipo Servicio" value={filters.tipoServicio} onChange={v => setFilters(p => ({ ...p, tipoServicio: v }))}
                        options={[{ value: 'MANTENIMIENTO', label: 'Mantenimiento' }, { value: 'REPARACION', label: 'Reparación' }, { value: 'SUMINISTRO', label: 'Suministro' }, { value: 'INSPECCION', label: 'Inspección' }, { value: 'ACTUALIZACION', label: 'Actualización' }]} />
                    <FilterDate label="Desde" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                    <FilterDate label="Hasta" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                </div>
            );
        case 'garantias':
            return (
                <div className="grid grid-cols-1 gap-3">
                    <FilterSelect label="Filtrar por" value={filters.filtro} onChange={v => setFilters(p => ({ ...p, filtro: v }))}
                        options={[{ value: 'vencidas', label: '⛔ Vencidas' }, { value: 'proximas', label: '⚠️ Próximas (3 meses)' }, { value: 'vigentes', label: '✅ Vigentes' }]} />
                </div>
            );
        default: return null;
    }
};
