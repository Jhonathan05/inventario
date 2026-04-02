import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { funcionariosService } from '../../api/funcionarios.service';
import { activosService } from '../../api/activos.service';
import { useAuth } from '../../context/AuthContext';
import FuncionariosForm from './FuncionariosForm';
import { getImageUrl } from '../../lib/utils';

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const FuncionariosList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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

    const { data: responseData, isLoading: loading, refetch: fetchFuncionarios } = useQuery({
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

    const handleCreate = () => { setSelectedFuncionario(null); setIsModalOpen(true); };
    const handleEdit = (f) => { setSelectedFuncionario(f); setIsModalOpen(true); };
    const handleCloseModal = (shouldRefresh = false) => {
        setIsModalOpen(false);
        if (shouldRefresh) fetchFuncionarios();
    };

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
            const assets = Array.isArray(res) ? res : (res.data || []);
            setEquiposFuncionario(assets.filter(a => a.estado === 'ASIGNADO'));
        } catch (err) {
            console.error('Error obteniendo equipos del funcionario', err);
        } finally {
            setEquiposLoading(false);
        }
    };

    const totalPages = pagination.pages || 1;
    const totalItems = pagination.total || funcionarios.length;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = Math.min(indexOfFirstItem + funcionarios.length, totalItems);

    const changePage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-12 font-mono mb-24 px-4 sm:px-6 lg:px-8 border-l-4 border-l-border-default/10 animate-fadeIn">
            {/* Header / Command Center */}
            <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[0.8em] group-hover:opacity-30 transition-opacity">PERSONNEL_CORE_RX_0x09</div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 relative z-10">
                    <div>
                        <div className="flex items-center gap-5 mb-4">
                             <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)]"></div>
                             <h1 className="text-3xl font-black uppercase tracking-[0.6em] text-text-primary leading-tight">
                                 / personnel_registry
                             </h1>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-10">
                            <div className="flex items-center gap-4">
                                 <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.5em] opacity-60">KERNEL_READY // <span className="text-text-primary underline decoration-text-accent decoration-2">{totalItems.toString().padStart(4, '0')}</span> RECORDS_ALLOCATED</p>
                            </div>
                            <span className="text-border-default/30 h-6 w-[2px] bg-border-default/30"></span>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic">SEGMENT_MAP: PERSONNEL_DATA_LAYER_STABLE</p>
                        </div>
                    </div>
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="bg-bg-elevated border-2 border-border-strong px-12 py-6 text-[12px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.7em] transition-all shadow-3xl hover:scale-105 active:scale-95 group/btn relative overflow-hidden ring-2 ring-transparent hover:ring-text-accent ring-inset"
                        >
                            <span className="relative z-10 group-hover/btn:tracking-[0.9em] transition-all">[ + ] CREATE_ENTITY_NODE</span>
                            <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                    )}
                </div>
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-text-accent/20">
                     <div className="h-full bg-text-accent w-1/4 animate-loadingBarSlow"></div>
                </div>
            </div>

            {/* Buscador + Toggle Filtros / Stream Query */}
            <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[8px] font-black uppercase tracking-widest">QUERY_STREAM_MAP_RX</div>
                <div className="flex flex-col sm:flex-row gap-8">
                    <div className="relative flex-1 group/search">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-text-muted opacity-30 text-[11px] font-black transition-opacity group-focus-within/search:opacity-100 group-focus-within/search:text-text-accent">
                            &gt;_ SCAN &raquo;
                        </div>
                        <input
                            type="text"
                            placeholder="NAME_UID_CODE_AREA_FRAGMENT..."
                            className="block w-full bg-bg-base border-2 border-border-default py-5 pl-36 pr-8 text-[13px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-10 py-5 text-[11px] font-black uppercase tracking-widest border-2 transition-all shadow-xl group/filter active:scale-95 flex items-center justify-center gap-6 ${activeFilterCount > 0
                            ? 'bg-text-accent/10 border-text-accent text-text-accent ring-2 ring-text-accent ring-inset'
                            : 'bg-bg-base border-border-default text-text-muted hover:border-border-strong hover:text-text-primary'
                            }`}
                    >
                        <span className="opacity-30 group-hover/filter:opacity-100 transition-opacity">{showFilters ? '[ - ]' : '[ + ]'}</span> 
                        ADV_QUERY {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                    </button>
                </div>
            </div>

            {/* Panel de Filtros Avanzados / Parameter Buffer */}
            {showFilters && (
                <div className="bg-bg-surface border-2 border-border-default p-12 shadow-3xl space-y-12 relative overflow-hidden animate-slideDown group hover:border-border-strong transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-widest">PARAMETER_MATRIX_RX_STABLE</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-70 underline decoration-border-default decoration-2 underline-offset-4">:: AREA_DOMAIN</label>
                            <div className="relative">
                                <select
                                    value={filterArea}
                                    onChange={e => setFilterArea(e.target.value)}
                                    className="w-full bg-bg-base border-2 border-border-default px-6 py-4 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="">[ ALL_DOMAINS ]</option>
                                    {options.areas.map(area => (
                                        <option key={area} value={area}>{area.toUpperCase()}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none opacity-40 text-[10px] font-black">
                                    &darr;
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-70 underline decoration-border-default decoration-2 underline-offset-4">:: POSITION_CLASS</label>
                            <div className="relative">
                                <select
                                    value={filterCargo}
                                    onChange={e => setFilterCargo(e.target.value)}
                                    className="w-full bg-bg-base border-2 border-border-default px-6 py-4 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="">[ ALL_ROLES ]</option>
                                    {options.cargos.map(cargo => (
                                        <option key={cargo} value={cargo}>{cargo.toUpperCase()}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none opacity-40 text-[10px] font-black">
                                    &darr;
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-70 underline decoration-border-default decoration-2 underline-offset-4">:: CONTRACT_INFRA</label>
                            <div className="relative">
                                <select
                                    value={filterVinculacion}
                                    onChange={e => setFilterVinculacion(e.target.value)}
                                    className="w-full bg-bg-base border-2 border-border-default px-6 py-4 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="">[ ALL_INFRA ]</option>
                                    <option value="EMPLEADO">FULL_STAFF_NODE</option>
                                    <option value="CONTRATISTA">EXTERN_ENTITY_NODE</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none opacity-40 text-[10px] font-black">
                                    &darr;
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.4em] opacity-70 underline decoration-border-default decoration-2 underline-offset-4">:: ACTIVE_STATE</label>
                            <div className="relative">
                                <select
                                    value={filterActivo}
                                    onChange={e => setFilterActivo(e.target.value)}
                                    className="w-full bg-bg-base border-2 border-border-default px-6 py-4 text-[12px] font-black uppercase tracking-widest text-text-primary focus:outline-none focus:border-text-accent transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                    <option value="">[ ALL_SYSTEM_STATES ]</option>
                                    <option value="true">STATE_ACTIVE_RX</option>
                                    <option value="false">STATE_DISABLED_TX</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none opacity-40 text-[10px] font-black">
                                    &darr;
                                </div>
                            </div>
                        </div>
                    </div>

                    {activeFilterCount > 0 && (
                        <div className="flex justify-end pt-10 border-t-2 border-border-default/20">
                            <button onClick={clearFilters} className="text-[11px] font-black text-text-accent hover:text-text-primary uppercase tracking-[0.4em] transition-all flex items-center gap-4 decoration-2 underline-offset-8 decoration-text-accent/30 underline active:scale-95">
                                <span className="text-xl font-black">[ &times; ]</span> NULLIFY_MANIFEST_PARAMS_TX
                            </button>
                        </div>
                    )}
                </div>
            )}

            {loading && (
                <div className="py-40 text-center flex flex-col items-center justify-center space-y-10 border-2 border-dashed border-border-default bg-bg-base/30 shadow-inner">
                    <div className="text-[15px] font-black text-text-accent animate-pulse uppercase tracking-[2em] pl-[2em]"># READING_ENTITIES_STREAM...</div>
                    <div className="w-64 h-1.5 bg-border-default/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-text-accent animate-loadingBar"></div>
                    </div>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.5em] opacity-40 italic">QUERYING_REMOTE_PERSONNEL_DATABASE // CRC_CHECK: OK</p>
                </div>
            )}

            {/* Desktop Table / Data Manifest */}
            {!loading && (
                <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden relative group/table hover:border-border-strong transition-all animate-fadeIn">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-xs font-black uppercase tracking-[1.5em] group-hover/table:text-text-accent transition-colors">MANIFEST_PERSONNEL_STREAM_RX_STABLE</div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1300px] border-spacing-0">
                            <thead>
                                <tr className="bg-bg-base border-b-2 border-border-default">
                                    <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: _ENTITY_NAME_ADDR</th>
                                    <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: _IDENT_UID</th>
                                    <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: _PERS_CODE_RX</th>
                                    <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: _POSITION_NAMESPACE</th>
                                    <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: _CONTRACT_CLASS</th>
                                    <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-text-muted border-r border-border-default/20">:: _ALLOC_BUFFER</th>
                                    {canEdit && (
                                        <th scope="col" className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-text-muted text-right">
                                            _IO_OPS
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-border-default/10 bg-bg-surface/30">
                                {funcionarios.map((f) => (
                                    <tr key={f.id} className="hover:bg-bg-elevated/50 transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <div className="text-[14px] font-black text-text-primary uppercase tracking-tight group-hover/row:text-text-accent transition-colors tabular-nums">{f.nombre.toUpperCase().replace(/ /g, '_')}</div>
                                            {f.shortname && <div className="text-[10px] text-text-muted font-black mt-2 uppercase tracking-widest opacity-40 group-hover/row:opacity-100 transition-opacity italic">ALIAS_TOKEN: {f.shortname.toUpperCase()}</div>}
                                        </td>
                                        <td className="px-10 py-8 text-[12px] text-text-primary font-black tracking-widest border-r border-border-default/10 tabular-nums opacity-60 group-hover/row:opacity-100 transition-opacity underline decoration-border-default/30">{f.cedula}</td>
                                        <td className="px-10 py-8 text-[12px] text-text-primary font-black opacity-30 border-r border-border-default/10 tabular-nums tracking-widest group-hover/row:opacity-80 transition-opacity">
                                            0x{(f.codigoPersonal || 'NULL').toUpperCase()}
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <div className="text-[12px] font-black text-text-primary uppercase tracking-widest">{f.cargo?.toUpperCase() || '-'}</div>
                                            <div className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-black mt-2 opacity-40 group-hover/row:opacity-100 transition-opacity">MAP: {f.area.toUpperCase().replace(/ /g, '_')}</div>
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            {f.vinculacion ? (
                                                <span className={`inline-flex items-center border-2 px-5 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${f.vinculacion === 'EMPLEADO' ? 'border-text-primary text-text-primary bg-bg-base ring-2 ring-text-primary/5' : 'border-border-default text-text-muted opacity-40 italic'}`}>
                                                    [{f.vinculacion === 'EMPLEADO' ? 'STAFF_NODE' : 'EXTERN_NODE'}]
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-10 py-8 border-r border-border-default/10">
                                            <button
                                                onClick={() => fetchEquiposFuncionario(f)}
                                                className="inline-flex items-center border-2 border-border-default px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-text-accent hover:text-text-primary hover:border-text-accent transition-all bg-bg-base/50 gap-6 shadow-xl active:scale-95 group/btn"
                                            >
                                                <span className="tabular-nums">{(f._count?.asignaciones || 0).toString().padStart(3, '0')} UNITS</span>
                                                <span className="opacity-20 group-hover/btn:translate-y-1 transition-transform font-black">v</span>
                                            </button>
                                        </td>
                                        {canEdit && (
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => handleEdit(f)}
                                                    className="inline-flex items-center justify-center text-[10px] font-black text-text-muted hover:text-text-primary hover:border-text-accent border-2 border-border-default bg-bg-base px-8 py-3 uppercase tracking-widest transition-all shadow-xl active:scale-95 group/edit"
                                                >
                                                    <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity mr-3">&raquo;</span>
                                                    [ MODIFY_NODE ]
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {funcionarios.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-10 py-40 text-center bg-bg-base/30">
                                            <div className="text-[13px] font-black text-text-muted uppercase tracking-[1em] opacity-40">! NO_ENTITY_DATA_IDENTIFIED_IN_BUFFER</div>
                                            <div className="mt-6 text-[10px] text-text-muted uppercase tracking-[0.4em] opacity-20 italic">KERNEL_SCAN_YIELDED_NULL_RESPONSE // RE-INITIALIZE_NODE_SYNC</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Mobile View / Node Clusters */}
            {!loading && (
                <div className="md:hidden space-y-8 animate-fadeIn">
                    {funcionarios.length === 0 && (
                        <div className="py-24 text-center text-[12px] font-black text-text-muted uppercase tracking-[0.5em] bg-bg-surface border-2 border-border-default opacity-40 shadow-inner">
                            ! NO_ENTITIES_IN_POOL_RX
                        </div>
                    )}
                    {funcionarios.map((f) => (
                        <div key={f.id} className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-text-accent transition-all ring-inset ring-transparent hover:ring-2 hover:ring-text-accent/20">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-[9px] font-black uppercase tracking-widest">ENTITY_IO_ADR</div>
                            <div className="flex items-start justify-between mb-10">
                                <div className="flex items-center gap-8">
                                    <div className="h-16 w-16 border-2 border-border-default bg-bg-base flex items-center justify-center text-text-primary font-black text-2xl group-hover:border-text-accent transition-colors shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                                        <span className="relative z-10">{f.nombre?.[0]?.toUpperCase() || '?'}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-black text-text-primary truncate text-[14px] uppercase tracking-tight group-hover:text-text-accent transition-colors">{f.nombre.toUpperCase().replace(/ /g, '_')}</div>
                                        <div className="text-[10px] text-text-muted font-black tracking-[0.3em] mt-3 opacity-60 group-hover:opacity-100 transition-opacity">UID: {f.cedula}</div>
                                    </div>
                                </div>
                                <span className="inline-flex flex-col items-center border-2 border-border-default bg-bg-base px-4 py-2 text-[10px] font-black text-text-accent uppercase tracking-widest shadow-xl tabular-nums group-hover:border-text-accent group-hover:scale-105 transition-all">
                                    <span className="opacity-40 text-[8px] mb-1">BUF:</span>
                                    {(f._count?.asignaciones || 0).toString().padStart(2, '0')}_RX
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="bg-bg-base border-2 border-border-default/50 px-6 py-4 shadow-inner space-y-2 group-hover:border-border-strong transition-colors">
                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-[0.3em] opacity-50 underline decoration-text-accent/20 underline-offset-4">POSITION_CLASS</span>
                                    <div className="text-[11px] font-black text-text-primary uppercase truncate tracking-widest">{f.cargo?.toUpperCase() || 'NULL_VAL'}</div>
                                </div>
                                <div className="bg-bg-base border-2 border-border-default/50 px-6 py-4 shadow-inner space-y-2 group-hover:border-border-strong transition-colors">
                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-[0.3em] opacity-50 underline decoration-text-accent/20 underline-offset-4">NAMESPACE_ADDR</span>
                                    <div className="text-[11px] font-black text-text-primary uppercase truncate tracking-widest">{f.area.toUpperCase().replace(/ /g, '_')}</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-bg-base/30 border-t-2 border-border-default/30 pt-8 gap-6">
                                <button
                                    onClick={() => fetchEquiposFuncionario(f)}
                                    className="flex-1 text-[11px] text-text-accent border-2 border-border-default bg-bg-base px-6 py-4 font-black uppercase tracking-[0.4em] hover:text-text-primary hover:border-text-accent transition-all shadow-2xl active:scale-95"
                                >
                                    [ SCAN_ALLOCATIONS ]
                                </button>
                                {canEdit && (
                                    <button
                                        onClick={() => handleEdit(f)}
                                        className="flex-1 text-[11px] text-text-muted border-2 border-border-default bg-bg-base px-6 py-4 font-black uppercase tracking-[0.4em] hover:text-text-primary hover:border-border-strong transition-all shadow-2xl active:scale-95"
                                    >
                                        [ MODIFY_NODE ]
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Component / Buffer Navigation */}
            {!loading && funcionarios.length > 0 && (
                <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group/page hover:border-border-strong transition-all">
                    <div className="absolute top-0 right-0 p-5 opacity-10 pointer-events-none text-[9px] font-black uppercase tracking-widest">BUF_NAV_CTRL_0xEF</div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
                        <div>
                            <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em]">
                                SHOWING_RANGE_STREAM: <span className="text-text-primary tabular-nums underline decoration-text-accent/30 decoration-2">{indexOfFirstItem + 1}</span> -- <span className="text-text-primary tabular-nums underline decoration-text-accent/30 decoration-2">{indexOfLastItem}</span> // TOTAL: <span className="text-text-primary tabular-nums font-black">{totalItems}</span>_RECORDS_ACTIVE
                            </p>
                        </div>
                        <div className="flex items-center gap-10 flex-wrap justify-center">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-10 py-4 bg-bg-base border-2 border-border-default text-[11px] font-black text-text-muted hover:text-text-primary hover:border-border-strong uppercase tracking-[0.4em] disabled:opacity-20 transition-all shadow-2xl active:scale-95"
                            >
                                [ &larr; ] PREV_SEGMENT
                            </button>
                            <span className="text-[13px] font-black text-text-accent uppercase tracking-[0.6em] px-10 border-x-2 border-border-default/30 py-2 tabular-nums">
                                NODE_{currentPage.toString().padStart(2, '0')} : {totalPages.toString().padStart(2, '0')}
                            </span>
                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-10 py-4 bg-bg-base border-2 border-border-default text-[11px] font-black text-text-muted hover:text-text-primary hover:border-border-strong uppercase tracking-[0.4em] disabled:opacity-20 transition-all shadow-2xl active:scale-95"
                            >
                                NEXT_SEGMENT [ &rarr; ]
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <FuncionariosForm
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    funcionario={selectedFuncionario}
                />
            )}

            {/* Modal Equipos Activos del Funcionario / Sub-Node-View */}
            {showEquiposModal && (
                <div className="fixed inset-0 z-[10001] overflow-y-auto font-mono animate-fadeIn" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-6 py-24 text-center sm:p-0">
                        <div className="fixed inset-0 bg-bg-base/95 backdrop-blur-xl transition-opacity duration-500 ease-out" onClick={() => setShowEquiposModal(false)} />
                        
                        <div className="relative bg-bg-surface border-4 border-border-default p-14 text-left shadow-[0_0_150px_rgba(0,0,0,0.8)] w-full max-w-4xl z-10 overflow-hidden transform transition-all group/modal animate-slideUp">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-sm font-black uppercase tracking-widest group-hover/modal:opacity-30 transition-all group-hover/modal:text-text-accent">ALLOCATION_BUFFER_RX_STREAM</div>
                            
                            <div className="flex justify-between items-center mb-14 border-b-4 border-border-default/30 pb-10">
                                <div>
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="w-3 h-3 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.75)]"></div>
                                        <h3 className="text-2xl font-black text-text-primary uppercase tracking-[0.5em]">/ assigned_assets_buffer</h3>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4">
                                        <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.4em] opacity-80 bg-bg-base px-4 py-1.5 border border-border-default shadow-inner underline decoration-text-accent/40 decoration-2 underline-offset-4">OWNER_NODE_RX: {equiposTitulo.toUpperCase().replace(/ /g, '_')}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowEquiposModal(false)} className="text-text-muted hover:text-text-accent text-5xl leading-none font-black transition-all transform hover:rotate-90 hover:scale-110 active:scale-75 focus:outline-none">
                                    [ &times; ]
                                </button>
                            </div>

                            {equiposLoading ? (
                                <div className="py-40 text-center flex flex-col items-center justify-center space-y-12">
                                    <div className="text-[18px] font-black text-text-accent animate-pulse uppercase tracking-[1.5em] pl-[1.5em]"># SCAN_LOCAL_DATABASE...</div>
                                    <div className="w-80 h-2 bg-border-default/10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-text-accent animate-loadingBarSlow"></div>
                                    </div>
                                    <p className="text-[11px] text-text-muted uppercase font-black tracking-[0.6em] opacity-40 italic">READING_ALLOCATION_METADATA_STREAM // PARITY_CHECK: OK</p>
                                </div>
                            ) : equiposFuncionario.length === 0 ? (
                                <div className="py-32 text-center">
                                    <div className="inline-block p-14 bg-bg-base/50 border-4 border-dashed border-border-default mb-10 shadow-inner group-hover/modal:border-text-accent/20 transition-colors">
                                        <p className="text-[14px] font-black text-text-muted uppercase tracking-[0.8em] opacity-40">! NO_ACTIVE_ALLOCATIONS_IDENTIFIED</p>
                                    </div>
                                    <p className="text-[10px] text-text-muted uppercase tracking-[0.4em] font-black opacity-30 mt-6 leading-relaxed bg-bg-base/30 py-3 block">
                                        ENTITY_NODE_UID: {selectedFuncionario?.cedula || 'NULL_VAL'}<br/>
                                        STATUS: ZERO_THRESHOLD_DETECTED // TX_LOG: STABLE
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8 max-h-[600px] overflow-y-auto pr-8 custom-scrollbar">
                                    {equiposFuncionario.map(a => (
                                        <div key={a.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-12 p-8 border-2 border-border-default bg-bg-base/30 group/item hover:border-text-accent hover:bg-bg-elevated/40 transition-all relative overflow-hidden ring-transparent hover:ring-2 hover:ring-text-accent/10 ring-inset">
                                            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-[9px] font-black uppercase tracking-tighter">SPEC_ID_RX_{a.id}</div>
                                            <div className="h-32 w-32 flex-shrink-0 border-2 border-border-default bg-bg-surface overflow-hidden p-3 shadow-3xl group-hover/item:border-text-accent group-hover/item:shadow-[0_0_25px_rgba(var(--text-accent),0.1)] transition-all relative">
                                                {getImageUrl(a.imagen) ? (
                                                    <img 
                                                        className="h-full w-full object-cover grayscale opacity-40 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700 scale-100 group-hover/item:scale-125" 
                                                        src={getImageUrl(a.imagen)} 
                                                        alt="" 
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-[11px] font-black text-text-muted uppercase tracking-tighter opacity-20 group-hover/item:opacity-80 transition-opacity italic">
                                                        [ NO_IMAGE_FRAGMENT ]
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 border-2 border-transparent group-hover/item:border-text-accent transition-colors z-10"></div>
                                            </div>
                                            <div className="flex-1 min-w-0 z-10">
                                                <div className="flex items-center gap-6 mb-4">
                                                    <span className="text-[12px] font-black text-text-accent uppercase tracking-widest tabular-nums bg-text-accent/5 px-4 py-1 border border-text-accent/30 shadow-sm">[ ATLAS_ID: {a.placa.toUpperCase()} ]</span>
                                                    <div className="h-[2px] w-12 bg-border-default/20 group-hover/item:bg-text-accent/30 transition-all group-hover/item:w-20"></div>
                                                    <span className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 group-hover/item:opacity-100 transition-opacity italic">{a.categoria?.nombre?.toUpperCase().replace(/ /g, '_')}</span>
                                                </div>
                                                <div className="font-black text-[15px] text-text-primary uppercase tracking-tight group-hover/item:text-text-accent transition-all flex items-center gap-4 group-hover/item:translate-x-3 duration-500 tabular-nums">
                                                    {a.marca.toUpperCase()} // {a.modelo.toUpperCase()}
                                                </div>
                                                <div className="mt-5 flex items-center gap-10 opacity-30 group-hover/item:opacity-100 transition-all duration-700">
                                                    <div className="flex items-center gap-3">
                                                         <div className="w-1.5 h-1.5 bg-text-accent animate-pulse"></div>
                                                         <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em]">HEALTH_STATUS: OPTIMAL_RX</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                         <div className="w-1.5 h-1.5 bg-text-accent"></div>
                                                         <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em]">ADDR_SECURE: PASS_TX</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-5 flex-shrink-0 z-10">
                                                <span className="text-[11px] font-black text-bg-base bg-text-accent px-6 py-2.5 uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(var(--text-accent),0.35)] group-hover/item:scale-105 transition-transform ring-4 ring-text-accent/10">
                                                    STAGED_ACTIVE
                                                </span>
                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] tabular-nums opacity-20 group-hover/item:opacity-60 transition-opacity bg-bg-base border border-border-default/50 px-3 py-1">SYS_REF_ID: 0x{a.id.toString(16).toUpperCase()}</span>
                                            </div>
                                            {/* Hover highlight line */}
                                            <div className="absolute bottom-0 left-0 h-[2px] bg-text-accent w-0 group-hover/item:w-full transition-all duration-700 ease-in-out"></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-14 flex flex-col sm:flex-row justify-between items-center p-10 bg-bg-base/40 border-2 border-border-default shadow-inner gap-10 relative overflow-hidden group/footer-modal">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-text-accent/20 to-transparent"></div>
                                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.6em] opacity-40 flex items-center gap-5 transition-all group-hover/footer-modal:opacity-100 group-hover/footer-modal:text-text-primary">
                                    <div className="w-2.5 h-2.5 bg-text-accent rotate-45 group-hover/footer-modal:animate-spin"></div>
                                    END_OF_MANIFEST_DATA_BUFFER // SEG_ID: 0xFD
                                </div>
                                <button 
                                    onClick={() => setShowEquiposModal(false)} 
                                    className="w-full sm:w-auto px-16 py-6 bg-bg-elevated border-2 border-border-strong text-[12px] font-black text-text-primary hover:text-text-accent uppercase tracking-[0.6em] transition-all shadow-3xl hover:border-text-accent hover:scale-105 active:scale-95 relative overflow-hidden group/close"
                                >
                                    <span className="relative z-10">[ CLOSE_IO_STREAM_VIEW ]</span>
                                    <div className="absolute inset-0 bg-text-accent/5 opacity-0 group-hover/close:opacity-100 transition-opacity"></div>
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
