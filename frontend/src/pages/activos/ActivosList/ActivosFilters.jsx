/**
 * ActivosFilters — Panel de búsqueda y filtros avanzados para la lista de activos.
 */
const ActivosFilters = ({
    search, setSearch,
    showFilters, setShowFilters,
    activeFilterCount,
    filterEstado, setFilterEstado,
    filterEmpresa, setFilterEmpresa,
    filterEstadoOp, setFilterEstadoOp,
    filterTipo, setFilterTipo,
    filterFuncionario, setFilterFuncionario,
    searchFuncionarioText, setSearchFuncionarioText,
    showFuncionarioDropdown, setShowFuncionarioDropdown,
    catalogs,
    funcionarios,
    clearFilters,
    onViewHistorial,
}) => (
    <>
        {/* Buscador + Toggle Filtros */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Buscar por placa, serial, marca, modelo, funcionario..."
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm px-3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-md px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition-colors ${activeFilterCount > 0
                    ? 'bg-indigo-50 text-indigo-700 ring-indigo-300'
                    : 'bg-white text-gray-700 ring-gray-300 hover:bg-gray-50'
                    }`}
            >
                🔽 Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
        </div>

        {/* Panel de Filtros Avanzados */}
        {showFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {/* Funcionario con autocomplete */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Funcionario Asignado</label>
                        <input
                            type="text"
                            placeholder="Buscar funcionario..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2"
                            value={searchFuncionarioText}
                            onChange={(e) => {
                                setSearchFuncionarioText(e.target.value);
                                setShowFuncionarioDropdown(true);
                                if (!e.target.value) setFilterFuncionario('');
                            }}
                            onFocus={() => setShowFuncionarioDropdown(true)}
                            onBlur={() => setTimeout(() => setShowFuncionarioDropdown(false), 200)}
                        />
                        {showFuncionarioDropdown && searchFuncionarioText && (() => {
                            const filtered = funcionarios.filter(f =>
                                f.nombre.toLowerCase().includes(searchFuncionarioText.toLowerCase()) ||
                                f.cedula?.includes(searchFuncionarioText)
                            );
                            return (
                                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                    {filtered.map(f => (
                                        <li
                                            key={f.id}
                                            className="cursor-pointer select-none py-2 pl-3 pr-4 hover:bg-indigo-50 text-gray-900 border-b border-gray-100 last:border-0"
                                            onClick={() => {
                                                setFilterFuncionario(f.id.toString());
                                                setSearchFuncionarioText(f.nombre);
                                                setShowFuncionarioDropdown(false);
                                            }}
                                        >
                                            <span className="block truncate font-medium">{f.nombre}</span>
                                            <span className="block truncate text-xs text-gray-500">CC: {f.cedula}</span>
                                        </li>
                                    ))}
                                    {filtered.length === 0 && (
                                        <li className="cursor-default select-none py-2 pl-3 pr-4 text-gray-500">Sin resultados</li>
                                    )}
                                </ul>
                            );
                        })()}
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                        <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                            <option value="">Todos</option>
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="ASIGNADO">Asignado</option>
                            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
                            <option value="DADO_DE_BAJA">Dado de Baja</option>
                        </select>
                    </div>

                    {/* Empresa */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Empresa Propietaria</label>
                        <select value={filterEmpresa} onChange={e => setFilterEmpresa(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                            <option value="">Todas</option>
                            {catalogs.EMPRESA_PROPIETARIA.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    {/* Estado Operativo */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Estado Operativo</label>
                        <select value={filterEstadoOp} onChange={e => setFilterEstadoOp(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                            <option value="">Todos</option>
                            {catalogs.ESTADO_OPERATIVO.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Equipo</label>
                        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm px-2">
                            <option value="">Todos</option>
                            {catalogs.TIPO_EQUIPO.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                </div>

                {filterFuncionario && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <button onClick={onViewHistorial} className="text-sm rounded-md bg-blue-50 text-blue-700 px-4 py-2 ring-1 ring-blue-600/20 hover:bg-blue-100 font-medium">
                            🕒 Ver Historial General del Funcionario
                        </button>
                    </div>
                )}

                {activeFilterCount > 0 && (
                    <div className="mt-3 flex justify-end">
                        <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            ✕ Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        )}
    </>
);

export default ActivosFilters;
