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
    const inputCls = "block w-full bg-bg-base border border-border-default py-2 text-text-primary placeholder:opacity-20 focus:outline-none focus:border-border-strong text-[11px] font-black uppercase tracking-widest px-3 transition-all";

    return (
        <div className="font-mono">
            {/* Buscador + Toggle Filtros */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted opacity-40 group-focus-within:text-text-accent transition-colors">
                        &gt;_
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH_BY_PLATE_SERIAL_BRAND..."
                        className={`${inputCls} pl-10`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] border transition-all shadow-xl ${activeFilterCount > 0
                        ? 'bg-text-accent text-bg-base border-text-accent'
                        : 'bg-bg-elevated text-text-primary border-border-strong hover:border-text-accent hover:text-text-accent'
                        }`}
                >
                    [ {showFilters ? '-' : '+'} ] ADV_FILTERS {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                </button>
            </div>

            {/* Panel de Filtros Avanzados */}
            {showFilters && (
                <div className="mt-4 p-8 bg-bg-surface border border-border-default shadow-2xl animate-fadeIn relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[10px] font-black">FILTER_QUERY_ARRAY</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                        {/* Funcionario con autocomplete */}
                        <div className="relative">
                            <label className="block text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em]">:: ASIGNED_NODE_HOLDER</label>
                            <input
                                type="text"
                                placeholder="FIND_IDENTITY..."
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
                            {showFuncionarioDropdown && (() => {
                                const searchTerm = searchFuncionarioText.toLowerCase();
                                const filtered = funcionarios.filter(f =>
                                    f.nombre.toLowerCase().includes(searchTerm) ||
                                    f.cedula?.includes(searchTerm)
                                );
                                return (
                                    <ul className="absolute z-[100] mt-2 max-h-60 w-full overflow-auto bg-bg-surface border border-border-strong shadow-3xl custom-scrollbar">
                                        {filtered.map(f => (
                                            <li
                                                key={f.id}
                                                className="cursor-pointer select-none py-3 px-4 hover:bg-bg-elevated text-text-primary border-b border-border-default last:border-0 transition-colors"
                                                onClick={() => {
                                                    setFilterFuncionario(f.id.toString());
                                                    setSearchFuncionarioText(f.nombre);
                                                    setShowFuncionarioDropdown(false);
                                                }}
                                            >
                                                <span className="block truncate font-black text-[10px] uppercase tracking-tight">{f.nombre}</span>
                                                <span className="block truncate text-[8px] text-text-muted font-bold mt-1 opacity-60 uppercase">UID: {f.cedula}</span>
                                            </li>
                                        ))}
                                        {filtered.length === 0 && (
                                            <li className="cursor-default select-none py-4 px-4 text-text-accent text-[9px] font-black uppercase tracking-[0.4em] text-center">! NO_MATCH_FOUND</li>
                                        )}
                                    </ul>
                                );
                            })()}
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em]">:: CATEGORY_ID</label>
                            <select value={filterCategoria} onChange={e => setFilterCategoria(e.target.value)}
                                className={inputCls}>
                                <option value="">[ ALL_TYPES ]</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre.toUpperCase()}</option>)}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em]">:: LOGICAL_STATE</label>
                            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
                                className={inputCls}>
                                <option value="">[ ALL_STATES ]</option>
                                <option value="DISPONIBLE">AVAILABLE</option>
                                <option value="ASIGNADO">DEPLOYED</option>
                                <option value="EN_MANTENIMIENTO">MAINTENANCE</option>
                                <option value="DADO_DE_BAJA">OFFLINE</option>
                            </select>
                        </div>

                        {/* Empresa */}
                        <div>
                            <label className="block text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em]">:: OWNER_ENTITY</label>
                            <select value={filterEmpresa} onChange={e => setFilterEmpresa(e.target.value)}
                                className={inputCls}>
                                <option value="">[ ALL_ENTITIES ]</option>
                                {catalogs.EMPRESA_PROPIETARIA.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
                            </select>
                        </div>

                        {/* Estado Operativo */}
                        <div>
                            <label className="block text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em]">:: OP_INTEGRITY</label>
                            <select value={filterEstadoOp} onChange={e => setFilterEstadoOp(e.target.value)}
                                className={inputCls}>
                                <option value="">[ ALL_RANKS ]</option>
                                {catalogs.ESTADO_OPERATIVO.map(e => <option key={e} value={e}>{e.toUpperCase()}</option>)}
                            </select>
                        </div>

                        {/* Ciudad / Municipio */}
                        <div>
                            <label className="block text-[9px] font-black text-text-muted mb-2 uppercase tracking-[0.2em]">:: GEO_LOCATION</label>
                            <select value={filterCiudad} onChange={e => setFilterCiudad(e.target.value)}
                                className={inputCls}>
                                <option value="">[ ALL_REGIONS ]</option>
                                {MUNICIPIOS_TOLIMA.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border-default/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                        {filterFuncionario ? (
                            <button onClick={onViewHistorial} className="text-[10px] font-black uppercase tracking-[0.2em] border border-border-default px-6 py-3 hover:border-text-accent hover:text-text-accent transition-all bg-bg-base/30 shadow-xl">
                                [ h ] VIEW_HOLDER_CHRONOLOGY
                            </button>
                        ) : <div />}

                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-accent transition-all flex items-center gap-3 group">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span> [ x ] PURGE_QUERY_CACHE
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivosFilters;
