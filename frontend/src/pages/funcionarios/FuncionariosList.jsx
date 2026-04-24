import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import { funcionariosService } from '../../api/funcionarios.service';
import { activosService } from '../../api/activos.service';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl, getAssetIconPath } from '../../lib/utils';
import { 
    UsersIcon, 
    UserPlusIcon, 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    IdentificationIcon, 
    BriefcaseIcon, 
    UserGroupIcon, 
    CheckBadgeIcon, 
    ComputerDesktopIcon, 
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

// Ícono SVG dinámico para activos sin imagen
const AssetIcon = ({ tipo, categoria }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor" className="h-full w-full p-2.5 text-charcoal-400">
        <path strokeLinecap="round" strokeLinejoin="round"
            d={getAssetIconPath(tipo, categoria?.nombre)} />
    </svg>
);

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

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
    })
};

const FuncionariosList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Filtros avanzados
    const [filterArea, setFilterArea] = useState('');
    const [filterCargo, setFilterCargo] = useState('');
    const [filterVinculacion, setFilterVinculacion] = useState('');
    const [filterActivo, setFilterActivo] = useState('');

    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        ...(search && { search }),
        ...(filterArea && { area: filterArea }),
        ...(filterCargo && { cargo: filterCargo }),
        ...(filterVinculacion && { vinculacion: filterVinculacion }),
        ...(filterActivo !== '' && { activo: filterActivo }),
    };

    const { data: options = { areas: [], cargos: [] } } = useQuery({
        queryKey: ['funcionarios', 'options'],
        queryFn: async () => {
             const res = await funcionariosService.getOptions();
             return {
                 areas: sortList(res.areas),
                 cargos: sortList(res.cargos)
             };
        }
    });

    const { data: responseData, isLoading: loading } = useQuery({
        queryKey: ['funcionarios', queryParams],
        queryFn: () => funcionariosService.getAll(queryParams)
    });

    const funcionarios = responseData?.data || [];
    const pagination = responseData?.pagination || { page: 1, totalPages: 1, total: funcionarios.length };

    const clearFilters = () => {
        setFilterArea('');
        setFilterCargo('');
        setFilterVinculacion('');
        setFilterActivo('');
        setCurrentPage(1);
    };

    const activeFilterCount = [filterArea, filterCargo, filterVinculacion, filterActivo].filter(Boolean).length;

    const handleCreate = () => { navigate('/funcionarios/nuevo'); };
    const handleEdit = (f) => { navigate(`/funcionarios/editar/${f.id}`); };

    // Modal de activos por funcionario
    const [showEquiposModal, setShowEquiposModal] = useState(false);
    const [equiposFuncionario, setEquiposFuncionario] = useState([]);
    const [equiposLoading, setEquiposLoading] = useState(false);
    const [equiposTitulo, setEquiposTitulo] = useState('');

    const fetchEquiposFuncionario = async (f) => {
        setEquiposTitulo(f.nombre);
        setEquiposLoading(true);
        setShowEquiposModal(true);
        try {
            const res = await activosService.getAll({ funcionarioId: f.id, limit: 100 });
            const data = Array.isArray(res) ? res : (res.data || []);
            setEquiposFuncionario(data.filter(a => a.estado === 'ASIGNADO'));
        } catch (err) {
            console.error('Error obteniendo equipos del funcionario', err);
        } finally {
            setEquiposLoading(false);
        }
    };

    // Logic for pagination
    const totalPages = pagination.pages || 1;
    const totalItems = pagination.total || funcionarios.length;

    return (
        <div className="space-y-6">
            {/* Header Módulo Estilo Agenda */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                <div>
                    <h1 className="page-header-title">Gestión de Funcionarios</h1>
                    <p className="page-header-subtitle">
                        Directorio y control administrativo del personal ({totalItems} registros)
                    </p>
                </div>
                {canEdit && (
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="btn-primary"
                    >
                        <UserPlusIcon className="w-5 h-5" />
                        Nuevo Funcionario
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="relative group w-full xl:max-w-md">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Busca por nombre, cédula, cargo..."
                                className="w-full bg-white border border-gray-100 rounded-full py-3 pl-11 pr-4 text-[13px] font-medium text-charcoal-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-[12px] font-bold transition-all border ${
                                    showFilters || activeFilterCount > 0 
                                    ? 'bg-fnc-50 border-fnc-200 text-fnc-700' 
                                    : 'bg-white border-gray-100 text-charcoal-500 hover:bg-gray-50'
                                }`}
                            >
                                <FunnelIcon className="w-4 h-4" />
                                {showFilters ? 'Ocultar Filtros' : 'Más Filtros'}
                                {activeFilterCount > 0 && (
                                    <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                            {(search || activeFilterCount > 0) && (
                                <button
                                    onClick={() => { setSearch(''); clearFilters(); }}
                                    className="p-3 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all border border-transparent hover:border-rose-100"
                                    title="Limpiar búsqueda"
                                >
                                    <ArrowPathIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up bg-white/50 p-4 rounded-2xl border border-gray-100/50">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Área</label>
                                <Select
                                    styles={customSelectStyles}
                                    options={[{value: '', label: 'Todas las Áreas'}, ...options.areas.map(a => ({ value: a, label: a.toLowerCase() }))]}
                                    value={{ value: filterArea, label: filterArea || 'Todas las Áreas' }}
                                    onChange={o => { setFilterArea(o?.value || ''); setCurrentPage(1); }}
                                    placeholder="Seleccionar Área"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Cargo</label>
                                <Select
                                    styles={customSelectStyles}
                                    options={[{value: '', label: 'Todos los Cargos'}, ...options.cargos.map(c => ({ value: c, label: c.toLowerCase() }))]}
                                    value={{ value: filterCargo, label: filterCargo || 'Todos los Cargos' }}
                                    onChange={o => { setFilterCargo(o?.value || ''); setCurrentPage(1); }}
                                    placeholder="Seleccionar Cargo"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Vinculación</label>
                                <Select
                                    styles={customSelectStyles}
                                    options={[
                                        { value: '', label: 'Todas' },
                                        { value: 'EMPLEADO', label: 'Empleado' },
                                        { value: 'CONTRATISTA', label: 'Contratista' }
                                    ]}
                                    value={{ value: filterVinculacion, label: filterVinculacion || 'Todas' }}
                                    onChange={o => { setFilterVinculacion(o?.value || ''); setCurrentPage(1); }}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Estado</label>
                                <Select
                                    styles={customSelectStyles}
                                    options={[
                                        { value: '', label: 'Todos' },
                                        { value: 'true', label: 'Activo' },
                                        { value: 'false', label: 'Inactivo' }
                                    ]}
                                    value={{ value: filterActivo, label: filterActivo === '' ? 'Todos' : filterActivo === 'true' ? 'Activo' : 'Inactivo' }}
                                    onChange={o => { setFilterActivo(o?.value || ''); setCurrentPage(1); }}
                                    isSearchable={false}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando registros...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-50">
                                    <thead className="bg-transparent border-b border-gray-50">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Funcionario</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Identificación</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Gestión / Área</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Vinculación</th>
                                            <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Activos</th>
                                            {canEdit && <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {funcionarios.map((f) => (
                                            <tr key={f.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-charcoal-400">
                                                            {f.nombre?.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-charcoal-800 text-[13px] capitalize tracking-tight">{f.nombre?.toLowerCase()}</span>
                                                            {f.shortname && <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{f.shortname?.toLowerCase()}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-[12px] text-charcoal-500 font-medium font-mono opacity-70">{f.cedula}</td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-charcoal-800 font-bold text-[11px] capitalize tracking-tight">{f.cargo?.toLowerCase()}</span>
                                                        <span className="text-charcoal-400 text-[10px] font-bold capitalize tracking-tight opacity-70">{f.area?.toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold capitalize border ${
                                                        f.vinculacion?.toUpperCase() === 'EMPLEADO'
                                                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                                            : f.vinculacion?.toUpperCase() === 'CONTRATISTA'
                                                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                                        }`}>
                                                        {f.vinculacion?.toLowerCase() || 'no registrado'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <button
                                                        onClick={() => fetchEquiposFuncionario(f)}
                                                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-bold capitalize bg-gray-50 text-charcoal-500 hover:bg-charcoal-600 hover:text-white transition-all border border-gray-100 gap-1.5 shadow-sm"
                                                    >
                                                        <ComputerDesktopIcon className="w-3.5 h-3.5" />
                                                        {f._count?.asignaciones || 0}
                                                    </button>
                                                </td>
                                                {canEdit && (
                                                    <td className="px-6 py-6 text-right">
                                                        <button
                                                            onClick={() => handleEdit(f)}
                                                            className="text-charcoal-300 hover:text-primary p-2 rounded-full hover:bg-primary/5 transition-all"
                                                            title="Editar Funcionario"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                {funcionarios.map((f) => (
                                    <div key={f.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-charcoal-400 shadow-inner">
                                                    {f.nombre?.[0] || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-charcoal-800 text-sm capitalize truncate w-40">{f.nombre?.toLowerCase()}</p>
                                                    <p className="text-[11px] text-charcoal-400 font-mono opacity-70">CC: {f.cedula}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => fetchEquiposFuncionario(f)}
                                                className="inline-flex items-center rounded-full bg-primary/5 border border-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm gap-1.5"
                                            >
                                                <ComputerDesktopIcon className="w-3.5 h-3.5" />
                                                {f._count?.asignaciones || 0}
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center text-[11px] font-bold border-t border-gray-50 pt-4">
                                            <div className="space-y-0.5">
                                                <span className="text-charcoal-400 capitalize tracking-tight flex items-center gap-1.5 opacity-70">
                                                    <BriefcaseIcon className="w-4 h-4 text-primary" /> {f.area?.toLowerCase()}
                                                </span>
                                                <p className="text-charcoal-800 capitalize ml-5 text-[10px] font-black">{f.cargo?.toLowerCase()}</p>
                                            </div>
                                            {canEdit && (
                                                <button
                                                    onClick={() => handleEdit(f)}
                                                    className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-[10px] capitalize hover:bg-primary transition-all hover:text-white"
                                                >
                                                    Gestionar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {!loading && totalItems > 0 && (
                    <div className="p-4 border-t border-gray-50">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentCount={funcionarios.length}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal Equipos Activos del Funcionario */}
            {showEquiposModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setShowEquiposModal(false)} />
                    <div className="relative bg-white border border-gray-100 rounded-3xl w-full max-w-2xl overflow-hidden animate-slide-up shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/5 p-2.5 rounded-full border border-primary/10">
                                    <ComputerDesktopIcon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-black text-charcoal-900 capitalize tracking-tight">Equipos Asignados</h3>
                            </div>
                            <button onClick={() => setShowEquiposModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Contenido Modal */}
                        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <p className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest pl-1">Usuario: <span className="text-primary">{equiposTitulo?.toLowerCase()}</span></p>
                            
                            {equiposLoading ? (
                                <div className="py-20 text-center">
                                    <ArrowPathIcon className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-3" />
                                    <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Consultando inventario técnico...</p>
                                </div>
                            ) : equiposFuncionario.length === 0 ? (
                                <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                    <ComputerDesktopIcon className="h-14 w-14 text-gray-200 mx-auto mb-4" />
                                    <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">El usuario no tiene activos vinculados</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {equiposFuncionario.map(a => (
                                        <div key={a.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-primary/20 transition-all hover:bg-gray-50 shadow-sm bg-white group">
                                            <div className="h-14 w-14 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform">
                                                {getImageUrl(a.imagen)
                                                    ? <img className="h-full w-full object-cover" src={getImageUrl(a.imagen)} alt="" />
                                                    : <AssetIcon tipo={a.tipo} categoria={a.categoria} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-charcoal-900 text-sm truncate capitalize tracking-tight">{a.marca?.toLowerCase()} {a.modelo?.toLowerCase()}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">PLACA: {a.placa}</span>
                                                    <span className="text-[10px] font-bold text-charcoal-400 capitalize opacity-70 tracking-tight">{a.categoria?.nombre?.toLowerCase()}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[9px] font-bold text-green-600 border border-green-500/20 uppercase tracking-widest">
                                                    <CheckBadgeIcon className="w-3.5 h-3.5" />
                                                    Activo
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                <button 
                                    onClick={() => setShowEquiposModal(false)} 
                                    className="px-8 py-3 text-[11px] font-bold text-charcoal-600 bg-gray-100 hover:bg-gray-200 rounded-full uppercase transition-all tracking-widest"
                                >
                                    Cerrar Vista
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FuncionariosList;
