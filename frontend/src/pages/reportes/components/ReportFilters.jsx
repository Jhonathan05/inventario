import { MUNICIPIOS_TOLIMA } from '../../../lib/constants';

const UI_SELECT_CLASSES = "block w-full bg-bg-base border-4 border-border-default py-5 px-8 text-text-primary focus:border-text-accent focus:outline-none text-[14px] font-black uppercase tracking-[0.2em] appearance-none cursor-pointer transition-all shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] focus:shadow-[0_0_40px_rgba(var(--text-accent),0.1)] group-hover:border-text-accent/30";
const UI_LABEL_CLASSES = "block text-[11px] font-black text-text-muted mb-4 uppercase tracking-[0.6em] group-focus-within:text-text-accent transition-all opacity-40 group-focus-within:opacity-100 italic group-focus-within:not-italic flex items-center gap-4";

export const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-4 group/field relative animate-fadeInUp">
        <label className={UI_LABEL_CLASSES}>
            <div className="w-2 h-2 bg-text-accent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            :: {label.toUpperCase().replace(/ /g, '_')}
        </label>
        <div className="relative group/select">
            <select 
                value={value || ''} 
                onChange={e => onChange(e.target.value || undefined)}
                className={UI_SELECT_CLASSES}
            >
                <option value="">[ ALL_RESOURCES_MANIFEST ]</option>
                {options.map(o => <option key={o.value} value={o.value} className="bg-bg-elevated font-mono uppercase tracking-widest">{o.label.toUpperCase().replace(/ /g, '_')}</option>)}
            </select>
            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none opacity-20 text-text-accent group-hover/select:opacity-100 group-hover/select:scale-125 transition-all font-black text-[14px] italic">
                [&darr;]
            </div>
            {/* Focus underline detail RX Premium */}
            <div className="absolute bottom-0 left-0 h-[5px] bg-text-accent transition-all duration-1000 w-0 group-focus-within/select:w-full shadow-[0_0_20px_rgba(var(--text-accent),0.8)]"></div>
        </div>
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-text-accent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
    </div>
);

export const FilterDate = ({ label, value, onChange }) => (
    <div className="space-y-4 group/field relative animate-fadeInUp">
        <label className={UI_LABEL_CLASSES}>
            <div className="w-2 h-2 bg-text-accent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            / {label.toUpperCase().replace(/ /g, '_')}
        </label>
        <div className="relative group/date">
            <input 
                type="date" 
                value={value || ''} 
                onChange={e => onChange(e.target.value || undefined)}
                className="block w-full bg-bg-base border-4 border-border-default py-4.5 px-8 text-text-primary focus:border-text-accent focus:outline-none text-[14px] font-black uppercase tracking-[0.2em] transition-all shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] appearance-none group-hover:border-text-accent/30" 
            />
            {/* Focus underline detail RX Premium */}
            <div className="absolute bottom-0 left-0 h-[5px] bg-text-accent transition-all duration-1000 w-0 group-focus-within/date:w-full shadow-[0_0_20px_rgba(var(--text-accent),0.8)]"></div>
        </div>
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-text-accent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
    </div>
);

export const ReportFilters = ({ selectedReport, filters, setFilters, catalogs }) => {
    if (!selectedReport) return null;
    
    switch (selectedReport.id) {
        case 'inventario':
            return (
                <div className="space-y-12 animate-fadeIn bg-bg-base/30 p-8 border-4 border-dashed border-border-default/10 shadow-[inset_0_20px_60px_rgba(0,0,0,0.4)]">
                    <FilterSelect label="Status" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                        options={[{ value: 'DISPONIBLE', label: 'Disponible' }, { value: 'ASIGNADO', label: 'Asignado' }, { value: 'EN_MANTENIMIENTO', label: 'Mantenimiento' }, { value: 'DADO_DE_BAJA', label: 'Baja' }]} />
                    <FilterSelect label="Entity_Owner" value={filters.empresaPropietaria} onChange={v => setFilters(p => ({ ...p, empresaPropietaria: v }))}
                        options={catalogs.EMPRESA_PROPIETARIA.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Ops_State" value={filters.estadoOperativo} onChange={v => setFilters(p => ({ ...p, estadoOperativo: v }))}
                        options={catalogs.ESTADO_OPERATIVO.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Hardware_Type" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                        options={catalogs.TIPO_EQUIPO.map(e => ({ value: e, label: e }))} />
                    <FilterSelect label="Regional_Node" value={filters.ciudad} onChange={v => setFilters(p => ({ ...p, ciudad: v }))}
                        options={MUNICIPIOS_TOLIMA.map(m => ({ value: m, label: m }))} />
                </div>
            );
        case 'asignaciones':
            return (
                <div className="space-y-12 animate-fadeIn bg-bg-base/30 p-8 border-4 border-dashed border-border-default/10 shadow-[inset_0_20px_60px_rgba(0,0,0,0.4)]">
                    <FilterSelect label="Ops_Mode" value={filters.tipo} onChange={v => setFilters(p => ({ ...p, tipo: v }))}
                        options={[{ value: 'ASIGNACION', label: 'Asignación' }, { value: 'TRASLADO', label: 'Traslado' }, { value: 'DEVOLUCION', label: 'Devolución' }]} />
                    <div className="grid grid-cols-1 gap-12 pt-6 border-t-2 border-border-default/20">
                        <FilterDate label="Timestamp_Start" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                        <FilterDate label="Timestamp_End" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                    </div>
                </div>
            );
        case 'mantenimiento':
            return (
                <div className="space-y-12 animate-fadeIn bg-bg-base/30 p-8 border-4 border-dashed border-border-default/10 shadow-[inset_0_20px_60px_rgba(0,0,0,0.4)]">
                    <FilterSelect label="Cycle_Status" value={filters.estado} onChange={v => setFilters(p => ({ ...p, estado: v }))}
                        options={[{ value: 'CREADO', label: 'Creado' }, { value: 'EN_PROCESO', label: 'En Proceso' }, { value: 'FINALIZADO', label: 'Finalizado' }, { value: 'CERRADO', label: 'Cerrado' }]} />
                    <FilterSelect label="Service_Class" value={filters.tipoServicio} onChange={v => setFilters(p => ({ ...p, tipoServicio: v }))}
                        options={[{ value: 'MANTENIMIENTO', label: 'Mantenimiento' }, { value: 'REPARACION', label: 'Reparación' }, { value: 'SUMINISTRO', label: 'Suministro' }, { value: 'INSPECCION', label: 'Inspección' }, { value: 'ACTUALIZACION', label: 'Actualización' }]} />
                    <div className="grid grid-cols-1 gap-12 pt-6 border-t-2 border-border-default/20">
                        <FilterDate label="Log_Start_TX" value={filters.fechaDesde} onChange={v => setFilters(p => ({ ...p, fechaDesde: v }))} />
                        <FilterDate label="Log_End_TX" value={filters.fechaHasta} onChange={v => setFilters(p => ({ ...p, fechaHasta: v }))} />
                    </div>
                </div>
            );
        case 'garantias':
            return (
                <div className="space-y-12 animate-fadeIn bg-bg-base/30 p-8 border-4 border-dashed border-border-default/10 shadow-[inset_0_20px_60px_rgba(0,0,0,0.4)]">
                    <FilterSelect label="Expiry_Heuristics" value={filters.filtro} onChange={v => setFilters(p => ({ ...p, filtro: v }))}
                        options={[{ value: 'vencidas', label: '[!] EXPIRED_ONLY' }, { value: 'proximas', label: '[?] CRITICAL_NEAR_TS' }, { value: 'vigentes', label: '[*] ACTIVE_WARRANTY' }]} />
                </div>
            );
        case 'por-funcionario':
            return (
                <div className="space-y-12 animate-fadeIn bg-bg-base/30 p-8 border-4 border-dashed border-border-default/10 shadow-[inset_0_20px_60px_rgba(0,0,0,0.4)]">
                    <FilterSelect label="Regional_Sector" value={filters.ciudad} onChange={v => setFilters(p => ({ ...p, ciudad: v }))}
                        options={MUNICIPIOS_TOLIMA.map(m => ({ value: m, label: m }))} />
                </div>
            );
        default: return null;
    }
};
