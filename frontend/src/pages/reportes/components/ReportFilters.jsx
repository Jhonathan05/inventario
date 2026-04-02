import { MUNICIPIOS_TOLIMA } from '../../../lib/constants';

export const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-2 group/select">
        <label className="block text-[9px] font-black text-text-muted mb-1 uppercase tracking-[0.2em] group-hover/select:text-text-accent transition-colors">
            :: {label.replace(/ /g, '_')}
        </label>
        <div className="relative">
            <select 
                value={value || ''} 
                onChange={e => onChange(e.target.value || undefined)}
                className="block w-full bg-bg-base border border-border-default py-2.5 px-4 text-text-primary focus:border-border-strong focus:outline-none text-[11px] font-black uppercase tracking-widest appearance-none cursor-pointer transition-all"
            >
                <option value="">[ ALL_RESOURCES ]</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-40 text-[8px]">
                [ &darr; ]
            </div>
        </div>
    </div>
);

export const FilterDate = ({ label, value, onChange }) => (
    <div className="space-y-2 group/date">
        <label className="block text-[9px] font-black text-text-muted mb-1 uppercase tracking-[0.2em] group-hover/date:text-text-accent transition-colors">
            / {label.replace(/ /g, '_')}
        </label>
        <input 
            type="date" 
            value={value || ''} 
            onChange={e => onChange(e.target.value || undefined)}
            className="block w-full bg-bg-base border border-border-default py-2.5 px-4 text-text-primary focus:border-border-strong focus:outline-none text-[11px] font-black uppercase tracking-widest transition-all" 
        />
    </div>
);

export const ReportFilters = ({ selectedReport, filters, setFilters, catalogs }) => {
    if (!selectedReport) return null;
    
    switch (selectedReport.id) {
        case 'inventario':
            return (
                <div className="space-y-6">
                    <FilterSelect label="Estado" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                        options={[{ value: 'DISPONIBLE', label: 'Disponible' }, { value: 'ASIGNADO', label: 'Asignado' }, { value: 'EN_MANTENIMIENTO', label: 'En Mantenimiento' }, { value: 'DADO_DE_BAJA', label: 'Dado de Baja' }]} />
                    <FilterSelect label="Empresa" value={filters.empresaPropietaria} onChange={v => setFilters(p => ({ ...p, empresaPropietaria: v }))}
                        options={catalogs.EMPRESA_PROPIETARIA.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Estado Operativo" value={filters.estadoOperativo} onChange={v => setFilters(p => ({ ...p, estadoOperativo: v }))}
                        options={catalogs.ESTADO_OPERATIVO.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Tipo Equipo" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                        options={catalogs.TIPO_EQUIPO.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Ciudad / Municipio" value={filters.ciudad} onChange={v => setFilters(p => ({ ...p, ciudad: v }))}
                        options={MUNICIPIOS_TOLIMA.map(m => ({ value: m, label: m }))} />
                </div>
            );
        case 'asignaciones':
            return (
                <div className="space-y-6">
                    <FilterSelect label="Tipo" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                        options={[{ value: 'ASIGNACION', label: 'Asignación' }, { value: 'TRASLADO', label: 'Traslado' }, { value: 'DEVOLUCION', label: 'Devolución' }]} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FilterDate label="Desde" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                        <FilterDate label="Hasta" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                    </div>
                </div>
            );
        case 'mantenimiento':
            return (
                <div className="space-y-6">
                    <FilterSelect label="Estado" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                        options={[{ value: 'CREADO', label: 'Creado' }, { value: 'EN_PROCESO', label: 'En Proceso' }, { value: 'FINALIZADO', label: 'Finalizado' }, { value: 'CERRADO', label: 'Cerrado' }]} />
                    <FilterSelect label="Tipo Servicio" value={filters.tipoServicio} onChange={v => setFilters(p => ({ ...p, tipoServicio: v }))}
                        options={[{ value: 'MANTENIMIENTO', label: 'Mantenimiento' }, { value: 'REPARACION', label: 'Reparación' }, { value: 'SUMINISTRO', label: 'Suministro' }, { value: 'INSPECCION', label: 'Inspección' }, { value: 'ACTUALIZACION', label: 'Actualización' }]} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FilterDate label="Desde" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                        <FilterDate label="Hasta" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                    </div>
                </div>
            );
        case 'garantias':
            return (
                <div className="space-y-6">
                    <FilterSelect label="Filtrar por" value={filters.filtro} onChange={v => setFilters(p => ({ ...p, filtro: v }))}
                        options={[{ value: 'vencidas', label: '[!] VENCIDAS' }, { value: 'proximas', label: '[?] PRÓXIMAS' }, { value: 'vigentes', label: '[*] VIGENTES' }]} />
                </div>
            );
        case 'por-funcionario':
            return (
                <div className="space-y-6">
                    <FilterSelect label="Ciudad / Municipio" value={filters.ciudad} onChange={v => setFilters(p => ({ ...p, ciudad: v }))}
                        options={MUNICIPIOS_TOLIMA.map(m => ({ value: m, label: m }))} />
                </div>
            );
        default: return null;
    }
};
