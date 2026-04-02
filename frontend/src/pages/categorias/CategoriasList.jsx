import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '../../api/categorias.service';
import { catalogosService } from '../../api/catalogos.service';
import { useAuth } from '../../context/AuthContext';

const MANAGEMENT_SECTIONS = [
    {
        id: 'MODULO_CATEGORIAS',
        title: 'Categorías',
        description: 'TIPOS_PRINCIPALES_DE_ACTIVOS (EJ. PORTATIL, MONITOR)',
        isCategory: true
    },
    {
        id: 'GRUPO_PERSONAL',
        title: 'Personal',
        description: 'CARGOS_Y_EMPRESAS_DE_VINCULACION',
        domains: ['CARGO', 'EMPRESA_FUNCIONARIO', 'TIPO_PERSONAL']
    },
    {
        id: 'GRUPO_HARDWARE',
        title: 'Hardware & Hardware',
        description: 'ESPECIFICACIONES_TECNICAS_DEL_EQUIPO',
        domains: ['TIPO_EQUIPO', 'PROCESADOR', 'MEMORIA_RAM', 'DISCO_DURO', 'SISTEMA_OPERATIVO']
    },
    {
        id: 'GRUPO_ADMIN',
        title: 'Administración',
        description: 'ESTADOS_OPERATIVOS_Y_FUENTES_DE_RECURSO',
        domains: ['EMPRESA_PROPIETARIA', 'FUENTE_RECURSO', 'TIPO_RECURSO', 'TIPO_CONTROL', 'ESTADO_OPERATIVO', 'RAZON_ESTADO']
    }
];

const Categorias = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';
    const queryClient = useQueryClient();

    const [activeSection, setActiveSection] = useState(MANAGEMENT_SECTIONS[0]);
    const [activeDomain, setActiveDomain] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ valor: '', descripcion: '', activo: true });
    const [saving, setSaving] = useState(false);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Query para categorías
    const { data: categoriasData = [], isLoading: loadingCategorias, error: errorCategorias } = useQuery({
        queryKey: ['categorias', 'management'],
        queryFn: async () => {
            const res = await categoriasService.getAll();
            return res.map(c => ({ 
                id: c.id, 
                valor: c.nombre, 
                count: c._count?.activos,
                descripcion: `CATEGORIA_CORE_REF_${c.id}` 
            }));
        },
        enabled: activeSection.isCategory,
    });

    // Query para catálogos por dominio
    const { data: catalogosData = [], isLoading: loadingCatalogos, error: errorCatalogos } = useQuery({
        queryKey: ['catalogos', activeDomain],
        queryFn: () => catalogosService.getByDomain(activeDomain),
        enabled: !!activeDomain && !activeSection.isCategory,
    });

    const data = activeSection.isCategory ? categoriasData : catalogosData;
    const loading = activeSection.isCategory ? loadingCategorias : loadingCatalogos;
    const error = activeSection.isCategory ? errorCategorias?.message : errorCatalogos?.message;

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setCurrentPage(1);
        if (section.domains) {
            setActiveDomain(section.domains[0]);
        } else {
            setActiveDomain(null);
        }
    };

    const handleDomainChange = (domain) => {
        setActiveDomain(domain);
        setCurrentPage(1);
    };

    const handleOpenNew = () => {
        setFormData({ valor: '', descripcion: '', activo: true });
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (item) => {
        setFormData({
            valor: item.valor,
            descripcion: item.descripcion || '',
            activo: item.activo !== undefined ? item.activo : true
        });
        setIsEditing(true);
        setCurrentId(item.id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ valor: '', descripcion: '', activo: true });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (activeSection.isCategory) {
                if (isEditing) {
                    await categoriasService.update(currentId, { nombre: formData.valor.toUpperCase() });
                } else {
                    await categoriasService.create({ nombre: formData.valor.toUpperCase() });
                }
                queryClient.invalidateQueries({ queryKey: ['categorias'] });
                queryClient.invalidateQueries({ queryKey: ['catalogos'] });
            } else {
                const payload = {
                    dominio: activeDomain,
                    valor: formData.valor.toUpperCase(),
                    descripcion: formData.descripcion.toUpperCase(),
                    activo: formData.activo
                };
                if (isEditing) {
                    await catalogosService.update(currentId, payload);
                } else {
                    await catalogosService.create(payload);
                }
                queryClient.invalidateQueries({ queryKey: ['catalogos'] });
            }
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'ERROR_DURING_RECORD_COMMIT');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, valor) => {
        if (!window.confirm(`¿CONFIRMAR_PURGA_DE_NODE_"${valor.toUpperCase()}"_EN_EL_SISTEMA?`)) return;
        try {
            if (activeSection.isCategory) {
                await categoriasService.delete(id);
                queryClient.invalidateQueries({ queryKey: ['categorias'] });
                queryClient.invalidateQueries({ queryKey: ['catalogos'] });
            } else {
                await catalogosService.delete(id);
                queryClient.invalidateQueries({ queryKey: ['catalogos'] });
                queryClient.invalidateQueries({ queryKey: ['categorias'] });
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'ERROR_DURING_NODE_PURGE');
        }
    };

    const inputCls = "block w-full bg-bg-base border-2 border-border-default py-4 px-6 text-[13px] font-black uppercase tracking-widest text-text-primary placeholder:opacity-20 focus:outline-none focus:border-text-accent transition-all appearance-none shadow-inner";

    return (
        <div className="flex flex-col lg:flex-row gap-12 font-mono animate-fadeIn mb-24 px-4 sm:px-6 lg:px-8 border-l-4 border-l-border-default/10">
            {/* Sidebar / Navigation */}
            <div className="lg:w-96 flex-none space-y-12">
                <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[10px] font-black uppercase tracking-[0.8em] group-hover:opacity-30 transition-all">NAV_MANIFEST_0xFC</div>
                    <h2 className="text-[12px] font-black text-text-accent uppercase tracking-[0.5em] mb-10 border-b-2 border-border-default/50 pb-6 flex items-center gap-4">
                        <div className="w-2 h-2 bg-text-accent animate-pulse"></div>
                        :: SYSTEM_REGISTRY_DOMAIN
                    </h2>
                    <div className="space-y-6">
                        {MANAGEMENT_SECTIONS.map(section => (
                            <button
                                key={section.id}
                                onClick={() => handleSectionChange(section)}
                                className={`w-full text-left px-8 py-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-2 shadow-xl relative overflow-hidden active:scale-95
                                    ${activeSection.id === section.id
                                        ? 'bg-bg-elevated border-text-accent text-text-primary ring-2 ring-text-accent ring-inset'
                                        : 'bg-bg-base/40 border-transparent text-text-muted hover:text-text-primary hover:border-border-default hover:bg-bg-elevated/20 opacity-60'
                                    }`}
                            >
                                <span className="relative z-10">{section.title.replace(/ /g, '_')}</span>
                                {activeSection.id === section.id && <div className="absolute left-0 top-0 h-full w-1 bg-text-accent"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-bg-surface border-2 border-border-default p-10 shadow-3xl relative overflow-hidden group hover:border-border-strong transition-all opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 shadow-inner">
                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[10px] font-black uppercase tracking-widest italic animate-pulse">KERN_STATUS_RX</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted leading-loose space-y-2 border-l-4 border-border-default/30 pl-8">
                        <p>NODE_IDENT: <span className="text-text-primary">{activeSection.id}</span></p>
                        <p>DOMAIN_PTR: <span className="text-text-accent">{activeDomain || 'SYS_NULL'}</span></p>
                        <p>BUF_STRIDE: 0x{data.length.toString(16).toUpperCase().padStart(4, '0')}</p>
                        <p>COMMIT_READY: TRUE // ACK_OK</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
                <div className="bg-bg-surface border-2 border-border-default shadow-3xl overflow-hidden relative group hover:border-border-strong transition-all">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-sm font-black uppercase tracking-[1em] group-hover:opacity-20 transition-all">POOL_MANAGEMENT_CORE_TX</div>
                    
                    <div className="p-12 border-b-2 border-border-default/30 bg-bg-base/30 relative">
                         <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-text-accent/20 via-transparent to-transparent"></div>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-black text-text-primary uppercase tracking-[0.5em] flex items-center gap-6">
                                    <span className="text-text-accent opacity-30 text-4xl">/</span> {activeSection.title}
                                </h1>
                                <div className="flex items-center gap-6">
                                     <div className="w-3 h-3 bg-text-accent animate-pulse"></div>
                                     <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-80 italic">
                                         :: IDENT_POOL_METADATA_STREAM: <span className="text-text-primary not-italic">{activeSection.description}</span>
                                     </p>
                                </div>
                            </div>
                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={handleOpenNew}
                                    className="px-10 py-5 bg-text-primary border-2 border-text-primary text-[12px] font-black text-bg-base hover:bg-text-accent hover:border-text-accent uppercase tracking-[0.5em] transition-all shadow-3xl flex items-center gap-5 active:scale-95 group/btn"
                                >
                                    <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
                                    <span>[ REGISTER_NODE ]</span>
                                </button>
                            )}
                        </div>

                        {/* Domain Tabs within sections */}
                        {activeSection.domains && (
                            <div className="flex flex-wrap gap-5 mt-10 pt-10 border-t-2 border-border-default/20">
                                {activeSection.domains.map(domain => (
                                    <button
                                        key={domain}
                                        onClick={() => handleDomainChange(domain)}
                                        className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all border-2 shadow-xl active:scale-95
                                            ${activeDomain === domain
                                                ? 'bg-text-accent text-bg-base border-text-accent ring-2 ring-text-accent ring-offset-2 ring-offset-bg-base'
                                                : 'bg-bg-base/40 border-border-default/40 text-text-muted hover:border-text-accent hover:text-text-accent'
                                            }`}
                                    >
                                        [ {domain} ]
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-32 text-center font-mono space-y-8">
                                <div className="w-16 h-16 border-4 border-text-accent border-t-transparent animate-spin rounded-full mx-auto shadow-[0_0_30px_rgba(var(--text-accent),0.2)]"></div>
                                <div className="text-[13px] font-black text-text-accent animate-pulse uppercase tracking-[0.8em]"># EXECUTING_DOMAIN_SQL_QUERY...</div>
                            </div>
                        ) : error ? (
                            <div className="p-24 text-center text-text-accent text-[12px] font-black uppercase tracking-[0.6em] border-y-4 border-text-accent/30 mx-12 my-12 bg-bg-base shadow-inner animate-shake">
                                <span className="text-4xl block mb-6">!!!</span>
                                !! ERROR_SYSTEM_REJECTED: {error.toUpperCase()} !!
                            </div>
                        ) : (
                            (() => {
                                const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
                                const currentItems = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);
                                const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
                                return (
                                    <div className="animate-fadeIn">
                                        <table className="w-full text-left border-collapse min-w-[900px]">
                                            <thead>
                                                <tr className="bg-bg-base border-b-4 border-border-default">
                                                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-text-muted w-32">:: PTR_ID</th>
                                                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-text-muted">:: VALUE_METADATA_TX</th>
                                                    {!activeSection.isCategory ? (
                                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-text-muted w-40">:: STATUS_BIT</th>
                                                    ) : (
                                                        <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.5em] text-text-muted w-40">:: ASSET_BUF</th>
                                                    )}
                                                    {canEdit && <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.6em] text-text-muted w-64">_ACTIONS_MGMT</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-2 divide-border-default/10">
                                                {currentItems.map((item) => (
                                                    <tr key={item.id} className="hover:bg-bg-elevated/40 transition-all group/row border-l-4 border-l-transparent hover:border-l-text-accent cursor-default">
                                                        <td className="px-10 py-8 text-[12px] font-black text-text-muted opacity-40 tabular-nums uppercase group-hover/row:opacity-100 transition-opacity">0x{item.id.toString().padStart(4, '0')}</td>
                                                        <td className="px-10 py-8">
                                                            <div className="text-[13px] font-black text-text-primary uppercase tracking-[0.2em] group-hover/row:text-text-accent transition-all group-hover/row:tracking-[0.3em]">{item.valor}</div>
                                                            {item.descripcion && <div className="text-[9px] text-text-muted font-black uppercase tracking-[0.4em] mt-2 opacity-50 border-l-2 border-border-default pl-4 italic group-hover/row:opacity-100">:: {item.descripcion}</div>}
                                                        </td>
                                                        {!activeSection.isCategory ? (
                                                            <td className="px-10 py-8">
                                                                <span className={`inline-flex items-center px-4 py-1.5 border-2 text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${item.activo ? 'border-text-accent text-text-accent bg-text-accent/5' : 'border-border-default text-text-muted opacity-30 grayscale'}`}>
                                                                    <div className={`w-2 h-2 mr-3 ${item.activo ? 'bg-text-accent animate-pulse' : 'bg-text-muted'}`}></div>
                                                                    [{item.activo ? 'ACTIVE' : 'OFFLINE'}]
                                                                </span>
                                                            </td>
                                                        ) : (
                                                            <td className="px-10 py-8 text-[13px] font-black text-text-primary tabular-nums group-hover/row:text-text-accent transition-colors">
                                                                <span className="opacity-30">TX_</span>[{ (item.count || 0).toString().padStart(3, '0') }]
                                                            </td>
                                                        )}
                                                        {canEdit && (
                                                            <td className="px-10 py-8 text-right space-x-10">
                                                                <button onClick={() => handleOpenEdit(item)} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-primary transition-all underline decoration-text-accent/20 decoration-2 underline-offset-[10px] hover:decoration-text-accent">[ MODIFY_PROC ]</button>
                                                                <button onClick={() => handleDelete(item.id, item.valor)} className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted hover:text-text-accent transition-all underline decoration-text-accent/20 decoration-2 underline-offset-[10px] hover:decoration-text-accent">[ PURGE_NODE ]</button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                                {currentItems.length === 0 && (
                                                    <tr><td colSpan="4" className="py-32 text-center text-text-muted text-[13px] font-black uppercase tracking-[0.8em] opacity-30 italic animate-pulse">! NO_DATA_RECORDS_DETECTED_IN_POOL_BUFFER_RX</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                        
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex flex-col sm:flex-row items-center justify-between border-t-4 border-border-default/40 px-12 py-8 bg-bg-base/30 gap-8">
                                                <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] opacity-60 bg-bg-surface px-6 py-2 border-2 border-border-default shadow-inner tabular-nums">
                                                    SHOWING_CORE_NODES: {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, data.length)} // TOTAL: {data.length}
                                                </p>
                                                <div className="flex items-center gap-10">
                                                    <button
                                                        onClick={() => setCurrentPage(p => p - 1)}
                                                        disabled={currentPage === 1}
                                                        className="text-[12px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-text-primary disabled:opacity-5 transition-all active:scale-75"
                                                    >
                                                        [ &laquo; PREV_BUF ]
                                                    </button>
                                                    <span className="text-[14px] font-black text-text-primary underline decoration-text-accent decoration-4 underline-offset-8 px-6 tabular-nums">
                                                        {currentPage} / {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(p => p + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="text-[12px] font-black uppercase tracking-[0.5em] text-text-muted hover:text-text-primary disabled:opacity-5 transition-all active:scale-75"
                                                    >
                                                        [ NEXT_BUF &raquo; ]
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-8 text-center sm:p-0">
                        <div className="fixed inset-0 bg-bg-base/95 backdrop-blur-xl transition-opacity duration-500" onClick={handleCloseModal}></div>
                        
                        <div className="relative bg-bg-surface border-4 border-border-default p-14 text-left shadow-[0_0_150px_rgba(0,0,0,0.8)] w-full max-w-2xl z-10 overflow-hidden transform transition-all group/modal animate-slideUp">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-sm font-black uppercase tracking-[1.5em] group-hover:opacity-30 transition-all">RECORD_COMMIT_STREAM_TX_RX</div>
                            <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-text-accent via-transparent to-transparent opacity-40"></div>
                            
                            <div className="flex items-center justify-between mb-14 border-b-4 border-border-default pb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6">
                                         <div className="w-4 h-4 bg-text-accent animate-pulse shadow-[0_0_15px_rgba(var(--text-accent),0.7)]"></div>
                                         <h3 className="text-xl font-black text-text-primary uppercase tracking-[0.6em]">
                                             {isEditing ? '/ modify_registry_node' : '/ spawn_new_registry_node'}
                                         </h3>
                                    </div>
                                    <p className="text-[11px] text-text-muted font-black mt-2 uppercase tracking-[0.5em] opacity-60 bg-bg-base px-6 py-2 border-2 border-border-default/50 shadow-inner w-fit italic">TARGET_DOMAIN_POOL: {activeSection.title.toUpperCase()}</p>
                                </div>
                                <button onClick={handleCloseModal} className="text-text-muted hover:text-text-accent text-5xl leading-none font-black transition-all hover:rotate-90 active:scale-75 focus:outline-none">
                                    [ &times; ]
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-12">
                                <div className="space-y-4 group/field">
                                    <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] group-focus-within/field:text-text-accent transition-colors opacity-70">:: RECORD_IDENT_VALUE_ADDR *</label>
                                    <input
                                        type="text"
                                        required
                                        className={inputCls}
                                        value={formData.valor}
                                        onChange={e => setFormData({ ...formData, valor: e.target.value })}
                                        placeholder="EX: CORE_NODE_01_MANIFEST"
                                        autoFocus
                                        autoComplete="off"
                                    />
                                </div>

                                {!activeSection.isCategory && (
                                    <>
                                        <div className="space-y-4 group/field">
                                            <label className="block text-[11px] font-black text-text-muted uppercase tracking-[0.4em] group-focus-within/field:text-text-accent transition-colors opacity-70">:: DESCRIPTION_LOG_MANIFEST (OPTIONAL)</label>
                                            <textarea
                                                className={`${inputCls} resize-none h-32`}
                                                value={formData.descripcion}
                                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                                placeholder="SYSTEM_METADATA_DOMAIN_DESCRIPTION_TX..."
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="flex items-center gap-8 group/check cursor-pointer border-2 border-border-default p-6 bg-bg-base/40 hover:border-text-accent transition-all shadow-xl" onClick={() => setFormData({ ...formData, activo: !formData.activo })}>
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    id="activo"
                                                    checked={formData.activo}
                                                    readOnly
                                                    className="appearance-none w-8 h-8 border-2 border-border-default bg-bg-base checked:bg-text-primary checked:border-text-primary focus:outline-none transition-all cursor-pointer ring-offset-bg-base ring-offset-2 focus:ring-2 focus:ring-text-accent" 
                                                />
                                                {formData.activo && (
                                                    <div className="absolute pointer-events-none text-bg-base text-[18px] font-black select-none">
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="activo" className="text-[12px] font-black text-text-muted group-hover/check:text-text-primary uppercase tracking-[0.5em] cursor-pointer transition-all">ENABLE_FOR_SYSTEM_IO_USE</label>
                                                <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mt-1">IO_CHANNEL_STATE_RX</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-16 pt-12 border-t-4 border-border-default/50 flex flex-col sm:flex-row gap-8 items-center">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="w-full sm:w-auto px-12 py-6 text-[12px] font-black text-text-muted hover:text-text-primary uppercase tracking-[0.5em] border-2 border-border-default hover:border-border-strong transition-all bg-bg-base/30 shadow-2xl active:scale-95"
                                    >
                                        [ DISCARD_TX_PROC ]
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:flex-1 px-14 py-6 text-[13px] font-black text-bg-base bg-text-primary hover:bg-text-accent transition-all shadow-[0_0_60px_rgba(var(--text-primary),0.2)] disabled:opacity-20 uppercase tracking-[0.6em] relative overflow-hidden group/submit active:scale-95 ring-4 ring-text-primary hover:ring-text-accent transition-all ring-inset"
                                    >
                                        {saving && <div className="absolute inset-0 bg-white/10 animate-loadingBar"></div>}
                                        <span className="relative z-10 flex items-center justify-center gap-6 group-hover/submit:tracking-[0.8em] transition-all">
                                            {saving ? 'SYNCING_WITH_CORE_DB...' : '[ EXECUTE_MANIFEST_COMMIT ]'}
                                            {!saving && <span className="opacity-30 group-hover/submit:translate-x-4 transition-transform text-xl">&rarr;</span>}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categorias;
