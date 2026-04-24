import Select from 'react-select';
import { MUNICIPIOS_TOLIMA } from '../../../lib/constants';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const customSelectStyles = {
    control: (base, state) => ({
        ...base,
        borderRadius: '9999px',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: '600',
        borderColor: state.isFocused ? '#8d1024' : '#f3f4f6',
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        '&:hover': {
            borderColor: '#8d1024'
        },
        transition: 'all 0.2s ease',
        textTransform: 'capitalize'
    }),
    option: (base, state) => ({
        ...base,
        fontSize: '12px',
        fontWeight: state.isSelected ? '700' : '600',
        backgroundColor: state.isSelected ? '#f3f4f6' : state.isFocused ? '#f9fafb' : 'transparent',
        color: state.isSelected ? '#111827' : '#4b5563',
        cursor: 'pointer',
        padding: '10px 16px',
        textTransform: 'capitalize',
        '&:active': {
            backgroundColor: '#f3f4f6'
        }
    }),
    valueContainer: (base) => ({
        ...base,
        textTransform: 'capitalize'
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        padding: '4px',
        zIndex: 50
    }),
    groupHeading: (base) => ({
        ...base,
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#9ca3af',
        padding: '8px 16px'
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af',
        textTransform: 'none'
    })
};

/**
 * ActivosFilters — Panel de búsqueda y filtros avanzados con estética sobria / Acme.
 */
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

    // Preparar opciones para Categoría
    const categoriaOptions = [
        { value: '', label: 'Cualquier Categoría' },
        ...categorias.map(c => ({ value: c.id.toString(), label: c.nombre }))
    ];

    // Preparar opciones para Estado
    const estadoOptions = [
        { value: '', label: 'Cualquier Estado' },
        { value: 'DISPONIBLE', label: 'Disponible' },
        { value: 'ASIGNADO', label: 'Asignado' },
        { value: 'EN_MANTENIMIENTO', label: 'En Mantenimiento' },
        { value: 'DADO_DE_BAJA', label: 'Dado de Baja' }
    ];

    // Opciones para Empresa Propietaria
    const empresaOptions = [
        { value: '', label: 'Cualquier Empresa' },
        ...catalogs.EMPRESA_PROPIETARIA.map(e => ({ value: e, label: e }))
    ];

    // Opciones para Ciudad
    const ciudadOptions = [
        { value: '', label: 'Cualquier Municipio' },
        ...MUNICIPIOS_TOLIMA.map(m => ({ value: m, label: m }))
    ];

    // Opciones para Funcionario (Agrupado)
    const funcionarioOptions = [
        { value: '', label: 'Sin filtrar funcionario' },
        ...funcionarios.map(f => ({
            value: f.id.toString(),
            label: f.nombre,
            sub: `CC: ${f.cedula || 'N/A'}`
        }))
    ];

    const formatOptionWithSub = ({ label, sub }) => (
        <div className="flex flex-col">
            <span className="font-semibold">{label}</span>
            {sub && <span className="text-[10px] opacity-50">{sub}</span>}
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Header: Buscador principal y Toggle */}
            <div className="flex flex-col md:flex-row items-center gap-4 py-2">
                <div className="relative flex-1 w-full group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 group-focus-within:text-fnc-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Busca por marca, modelo, placa o serial..."
                        className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-fnc-500/20 focus:border-fnc-500 transition-all shadow-sm group-hover:border-gray-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-[12px] font-bold transition-all border ${
                            activeFilterCount > 0 
                            ? 'bg-fnc-50 border-fnc-200 text-fnc-700' 
                            : 'bg-white border-gray-100 text-charcoal-500 hover:bg-gray-50'
                        }`}
                    >
                        <FunnelIcon className="w-4 h-4" />
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        {activeFilterCount > 0 && (
                            <span className="bg-fnc-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="p-3 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                            title="Limpiar filtros"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Panel Desplegable de Filtros */}
            {showFilters && (
                <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
                    
                    {/* Funcionario */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Asignado A</label>
                        <Select
                            styles={customSelectStyles}
                            options={funcionarioOptions}
                            value={funcionarioOptions.find(o => o.value === filterFuncionario)}
                            onChange={(o) => {
                                setFilterFuncionario(o?.value || '');
                                if (o?.label) setSearchFuncionarioText(o.label);
                            }}
                            placeholder="Buscar Funcionario..."
                            isClearable
                            formatOptionLabel={formatOptionWithSub}
                        />
                    </div>

                    {/* Categoría */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Categoría</label>
                        <Select
                            styles={customSelectStyles}
                            options={categoriaOptions}
                            value={categoriaOptions.find(o => o.value === filterCategoria)}
                            onChange={(o) => setFilterCategoria(o?.value || '')}
                            placeholder="Todas"
                        />
                    </div>

                    {/* Estado */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Estado de Activo</label>
                        <Select
                            styles={customSelectStyles}
                            options={estadoOptions}
                            value={estadoOptions.find(o => o.value === filterEstado)}
                            onChange={(o) => setFilterEstado(o?.value || '')}
                            placeholder="Todos"
                        />
                    </div>

                    {/* Municipio */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Ubicación</label>
                        <Select
                            styles={customSelectStyles}
                            options={ciudadOptions}
                            value={ciudadOptions.find(o => o.value === filterCiudad)}
                            onChange={(o) => setFilterCiudad(o?.value || '')}
                            placeholder="Cualquier Ciudad"
                        />
                    </div>

                    {/* Botón de Historial si hay funcionario seleccionado */}
                    {filterFuncionario && (
                        <div className="col-span-full pt-2">
                            <button 
                                onClick={onViewHistorial} 
                                className="flex items-center gap-2 text-[11px] font-bold text-fnc-600 bg-fnc-50 hover:bg-fnc-100 px-4 py-2 rounded-full border border-fnc-100 transition-all uppercase tracking-widest"
                            >
                                <ClockIcon className="w-4 h-4" />
                                Consultar Historial del Funcionario
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivosFilters;
