import { MUNICIPIOS_TOLIMA } from '../../../lib/constants';

const ActivosFilters = ({
    search, setSearch,
    showFilters, setShowFilters,
    activeFilterCount,
    filterCategoria, setFilterCategoria,
    filterEstado, setFilterEstado,
    filterEmpresa, setFilterEmpresa,
    filterEstadoOp, setFilterEstadoOp,
    filterCiudad, setFilterCiudad,
    filterFuncionario, setFilterFuncionario,
    searchFuncionarioText, setSearchFuncionarioText,
    showFuncionarioDropdown, setShowFuncionarioDropdown,
    catalogs,
    categorias,
    funcionarios,
    clearFilters,
    onViewHistorial,
}) => {
    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-text-primary placeholder:opacity-10 focus:outline-none focus:border-text-accent text-[13px] font-black uppercase tracking-[0.1em] transition-all shadow-inner focus:shadow-[0_0_20px_rgba(var(--text-accent),0.05)] appearance-none";

    return (
        <div className="font-mono">
            {/* Main Search & Toggle Gateway */}
            <div className="flex flex-col sm:flex-row gap-8">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-text-accent opacity-30 group-focus-within:opacity-100 group-focus-within:scale-110 transition-all font-black text-xl">
                        &gt;_
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH_BY_PLATE_SERIAL_BRAND_NODE_ID..."
                        className={`${inputCls} pl-16`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute bottom-0 left-0 h-[3px] bg-text-accent transition-all duration-700 w-0 group-focus-within:w-full"></div>
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-10 py-5 text-[12px] font-black uppercase tracking-[0.4em] border-4 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95 group/adv relative overflow-hidden ${activeFilterCount > 0
                        ? 'bg-text-accent text-bg-base border-text-accent'
                        : 'bg-bg-surface text-text-primary border-border-default hover:border-text-accent'
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-4">
                        [ {showFilters ? '-' : '+'} ] ADV_QUERY_FILTERS 
                        {activeFilterCount > 0 && <span className="bg-bg-base text-text-accent px-3 py-0.5 border border-bg-base/20 tabular-nums">0x{activeFilterCount}</span>}
                    </span>
                    {activeFilterCount === 0 && <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/adv:opacity-100 transition-opacity"></div>}
                </button>
            </div>

            {/* Advanced Query Panel - Standardized v4 */}
            {showFilters && (
                <div className="mt-8 p-12 bg-bg-surface border-4 border-border-default shadow-[0_40px_120px_rgba(0,0,0,0.7)] animate-fadeIn relative overflow-hidden group/panel hover:border-text-accent transition-colors duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-[11px] font-black uppercase tracking-[2em] group-hover/panel:opacity-15 transition-all italic">FILTER_QUERY_ARRAY_0xAF42</div>
                    <div className="absolute top-0 left-0 w-2 h-full bg-text-accent/20 opacity-0 group-hover/panel:opacity-100 transition-opacity"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10">
                        {/* Funcionario with High-Fidelity Autocomplete */}
                        <div className="relative group/field">
                            <label className="block text-[11px] font-black text-text-muted mb-4 uppercase tracking-[0.5em] group-focus-within/field:text-text-accent transition-colors opacity-70 group-focus-within/field:opacity-100 italic">:: HOLDER_NODE</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="FIND_IDENTITY_RX..."
                                    className={inputCls}
                                    value={searchFuncionarioText}
                                    onChange={(e) => {
                                        setSearchFuncionarioText(e.target.value);
                                        setShowFuncionarioDropdown(true);
                                        if (!e.target.value) setFilterFuncionario('');
                                    }}
                                    onFocus={() => setShowFuncionarioDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowFuncionarioDropdown(false), 200)}
                                />
                                <div className="absolute bottom-0 left-0 h-[2px] bg-text-accent transition-all duration-500 w-0 group-focus-within/field:w-full"></div>
                            </div>
                            
                            {showFuncionarioDropdown && (() => {
                                const searchTerm = searchFuncionarioText.toLowerCase();
                                const filtered = funcionarios.filter(f =>
                                    f.nombre.toLowerCase().includes(searchTerm) ||
                                    f.cedula?.includes(searchTerm)
                                );
                                return (
                                    <ul className="absolute z-[100] mt-4 max-h-[350px] w-[300px] overflow-auto bg-bg-surface border-4 border-text-accent shadow-[0_40px_100px_rgba(0,0,0,0.8)] custom-scrollbar animate-fadeIn">
                                        <div className="bg-text-accent text-bg-base px-6 py-2 text-[9px] font-black uppercase tracking-[0.4em]">RESULTS_FROM_ENTITY_COMMITTEE</div>
                                        {filtered.map(f => (
                                            <li
                                                key={f.id}
                                                className="cursor-pointer select-none py-5 px-6 hover:bg-text-accent/5 text-text-primary border-b border-border-default/10 last:border-0 transition-all group/opt active:bg-text-accent/10"
                                                onClick={() => {
                                                    setFilterFuncionario(f.id.toString());
                                                    setSearchFuncionarioText(f.nombre);
                                                    setShowFuncionarioDropdown(false);
                                                }}
                                            >
                                                <span className="block truncate font-black text-[11px] uppercase tracking-tighter group-hover/opt:tracking-[0.1em] transition-all">{f.nombre}</span>
                                                <span className="block truncate text-[9px] text-text-muted font-bold mt-2 opacity-50 uppercase tracking-widest italic group-hover/opt:opacity-100 group-hover/opt:text-text-accent transition-all">UID_HASH: {f.cedula}</span>
                                            </li>
                                        ))}
                                        {filtered.length === 0 && (
                                            <li className="cursor-default select-none py-8 px-6 text-text-accent text-[11px] font-black uppercase tracking-[0.5em] text-center italic bg-bg-base/30 animate-pulse">! NO_TX_MATCH_FOUND</li>
                                        )}
                                    </ul>
                                );
                            })()}
                        </div>

                        {/* Standard Selectors Logic v4 */}
                        {[
                            { label: 'CATEGORY_ID', value: filterCategoria, setter: setFilterCategoria, options: [{value: '', label: '[ ALL_TYPES ]'}, ...categorias.map(c => ({value: c.id, label: c.nombre}))] },
                            { label: 'LOGICAL_STATE', value: filterEstado, setter: setFilterEstado, options: [
                                {value: '', label: '[ ALL_STATES ]'},
                                {value: 'DISPONIBLE', label: 'AVAILABLE'},
                                {value: 'ASIGNADO', label: 'DEPLOYED'},
                                {value: 'EN_MANTENIMIENTO', label: 'MAINTENANCE'},
                                {value: 'DADO_DE_BAJA', label: 'OFFLINE'}
                            ] },
                            { label: 'OWNER_ENTITY', value: filterEmpresa, setter: setFilterEmpresa, options: [{value: '', label: '[ ALL_ENTITIES ]'}, ...catalogs.EMPRESA_PROPIETARIA.map(e => ({value: e, label: e}))] },
                            { label: 'OP_INTEGRITY', value: filterEstadoOp, setter: setFilterEstadoOp, options: [{value: '', label: '[ ALL_RANKS ]'}, ...catalogs.ESTADO_OPERATIVO.map(e => ({value: e, label: e}))] },
                            { label: 'GEO_LOCATION', value: filterCiudad, setter: setFilterCiudad, options: [{value: '', label: '[ ALL_REGIONS ]'}, ...MUNICIPIOS_TOLIMA.map(m => ({value: m, label: m}))] },
                        ].map((field, idx) => (
                            <div key={idx} className="group/field relative">
                                <label className="block text-[11px] font-black text-text-muted mb-4 uppercase tracking-[0.5em] group-focus-within/field:text-text-accent transition-colors opacity-70 group-focus-within/field:opacity-100 italic">:: {field.label}</label>
                                <div className="relative group/select">
                                    <select 
                                        value={field.value} 
                                        onChange={e => field.setter(e.target.value)}
                                        className={inputCls}
                                    >
                                        {field.options.map((opt, i) => <option key={i} value={opt.value}>{opt.label.toUpperCase().replace(/ /g, '_')}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none opacity-20 text-text-accent group-hover/select:opacity-100 group-hover/select:scale-125 transition-all font-black text-[12px]">[ v ]</div>
                                    <div className="absolute bottom-0 left-0 h-[2px] bg-text-accent transition-all duration-500 w-0 group-focus-within/field:w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-10 border-t-4 border-border-default/40 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex gap-6 items-center">
                            {filterFuncionario ? (
                                <button
                                    onClick={onViewHistorial}
                                    className="text-[12px] font-black uppercase tracking-[0.4em] border-4 border-border-default px-10 py-4 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/50 shadow-2xl active:scale-90 group/h"
                                >
                                    <span className="opacity-40 mr-4 group-hover/h:opacity-100 group-hover/h:animate-pulse transition-all">#</span> [ h_VIEW_CHRONOLOGY ]
                                </button>
                            ) : (
                                <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.5em] opacity-20 italic">WAITING_FOR_IDENTITY_TARGET...</div>
                            )}
                        </div>

                        {activeFilterCount > 0 && (
                            <button 
                                onClick={clearFilters} 
                                className="text-[12px] font-black uppercase tracking-[0.5em] text-text-accent hover:text-text-primary transition-all flex items-center gap-6 group/purge relative overflow-hidden bg-text-accent/5 px-8 py-3 border-2 border-text-accent/20"
                            >
                                <span className="opacity-0 group-hover/purge:opacity-100 group-hover/purge:-translate-x-2 transition-all">&gt;_</span> 
                                [ x_PURGE_QUERY_CACHE_AF22 ]
                                <div className="absolute inset-0 bg-text-accent animate-pulse opacity-5 group-hover:opacity-10 pointer-events-none"></div>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivosFilters;
