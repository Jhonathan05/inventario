import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '../../api/categorias.service';
import { catalogosService } from '../../api/catalogos.service';
import { useAuth } from '../../context/AuthContext';
import { 
    TagIcon, 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    XMarkIcon,
    Bars3Icon,
    BriefcaseIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

const MANAGEMENT_SECTIONS = [
    {
        id: 'MODULO_CATEGORIAS',
        title: 'categorías de activos',
        description: 'Tipos principales de activos electrónicos y periféricos',
        isCategory: true
    },
    {
        id: 'GRUPO_PERSONAL',
        title: 'gestión de personal',
        description: 'Cargos y empresas de vinculación administrativa',
        domains: ['CARGO', 'EMPRESA_FUNCIONARIO', 'TIPO_PERSONAL']
    },
    {
        id: 'GRUPO_HARDWARE',
        title: 'especificaciones hardware',
        description: 'Componentes técnicos y sistemas operativos',
        domains: ['TIPO_EQUIPO', 'PROCESADOR', 'MEMORIA_RAM', 'DISCO_DURO', 'SISTEMA_OPERATIVO']
    },
    {
        id: 'GRUPO_ADMIN',
        title: 'administración global',
        description: 'Estados operativos, fuentes de recurso y procesos',
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
    const ITEMS_PER_PAGE = 9;

    // Query para categorías
    const { data: categoriasData = [], isLoading: loadingCategorias, error: errorCategorias } = useQuery({
        queryKey: ['categorias', 'management'],
        queryFn: async () => {
            const res = await categoriasService.getAll();
            return res.map(c => ({ id: c.id, valor: c.nombre, count: c._count?.activos }));
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
                    descripcion: formData.descripcion,
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
            alert(err.response?.data?.error || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, valor) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${valor}"?`)) return;
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
            alert(err.response?.data?.error || 'Error al eliminar');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Tabs */}
            <div className="lg:w-80 flex-none space-y-6">
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100/50">
                    <h2 className="text-[11px] font-black text-charcoal-400 uppercase tracking-widest px-2 mb-8 flex items-center gap-3">
                        <Bars3Icon className="w-4 h-4 text-primary" />
                        Configuración global
                    </h2>
                    <div className="space-y-3">
                        {MANAGEMENT_SECTIONS.map(section => (
                            <button
                                key={section.id}
                                onClick={() => handleSectionChange(section)}
                                className={`w-full text-left px-6 py-4 rounded-2xl text-[12.5px] font-extrabold capitalize transition-all duration-300 border ${activeSection.id === section.id
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 border-primary'
                                    : 'text-charcoal-500 hover:bg-gray-50 border-transparent hover:border-gray-100'
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
                {/* Header Módulo Estilo Agenda */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 mt-2 px-1">
                    <div>
                        <h1 className="page-header-title">{activeSection.title}</h1>
                        <p className="page-header-subtitle">
                            {activeSection.description}
                        </p>
                    </div>
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleOpenNew}
                            className="btn-primary"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nuevo Registro
                        </button>
                    )}
                </div>

                {/* Domain Tabs Estilo Agenda */}
                {activeSection.domains && (
                    <div className="flex flex-wrap gap-3 mb-10 px-1">
                        {activeSection.domains.map(domain => (
                            <button
                                key={domain}
                                onClick={() => handleDomainChange(domain)}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeDomain === domain
                                    ? 'bg-primary/5 border-primary/20 text-primary shadow-sm'
                                    : 'bg-white border-gray-100 text-charcoal-400 hover:bg-gray-50'
                                    }`}
                            >
                                {domain.replace(/_/g, ' ')?.toLowerCase()}
                            </button>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-20">
                            <ArrowPathIcon className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-3" />
                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sincronizando catálogos...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-rose-500 font-bold bg-rose-50/50">{error}</div>
                    ) : (
                        (() => {
                            const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
                            const currentItems = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);
                            const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
                            return (
                                <>
                                    {/* Desktop View */}
                                    <div className="hidden md:block">
                                        <table className="min-w-full divide-y divide-gray-50">
                                            <thead className="bg-transparent border-b border-gray-50">
                                                <tr>
                                                    <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Identificador</th>
                                                    <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Valor / Definición</th>
                                                    {!activeSection.isCategory && (
                                                        <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Estado</th>
                                                    )}
                                                    {activeSection.isCategory && (
                                                        <th className="px-6 py-5 text-left text-[11px] font-semibold text-charcoal-400 capitalize">Frecuencia</th>
                                                    )}
                                                    {canEdit && <th className="px-6 py-5 text-right text-[11px] font-semibold text-charcoal-400 capitalize">Acción</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-50">
                                                {currentItems.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <td className="px-6 py-6 whitespace-nowrap text-[12px] font-mono text-charcoal-400 opacity-70">#{item.id}</td>
                                                        <td className="px-6 py-6 whitespace-nowrap">
                                                            <div className="text-[13px] font-semibold text-charcoal-800 capitalize tracking-tight">{item.valor?.toLowerCase()}</div>
                                                            {item.descripcion && <div className="text-[10px] font-bold text-charcoal-400 capitalize opacity-70 tracking-tight">{item.descripcion?.toLowerCase()}</div>}
                                                        </td>
                                                        {!activeSection.isCategory && (
                                                            <td className="px-6 py-6 whitespace-nowrap">
                                                                {item.activo ? (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold capitalize bg-green-500/10 text-green-600 border border-green-500/20">activa</span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold capitalize bg-rose-500/10 text-rose-600 border border-rose-500/20">inactiva</span>
                                                                )}
                                                            </td>
                                                        )}
                                                        {activeSection.isCategory && (
                                                            <td className="px-6 py-6 whitespace-nowrap">
                                                                <span className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 tracking-tight">
                                                                    {item.count || 0} Activos vinculados
                                                                </span>
                                                            </td>
                                                        )}
                                                        {canEdit && (
                                                            <td className="px-6 py-6 whitespace-nowrap text-right">
                                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => handleOpenEdit(item)} className="p-2 text-charcoal-300 hover:text-primary rounded-full hover:bg-primary/5 transition-all" title="Editar">
                                                                        <PencilSquareIcon className="w-4 h-4" />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(item.id, item.valor)} className="p-2 text-charcoal-300 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-all" title="Eliminar">
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="md:hidden space-y-4 p-4 bg-gray-50/20">
                                        {currentItems.map((item) => (
                                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-charcoal-800 text-[13px] capitalize truncate">{item.valor?.toLowerCase()}</h3>
                                                        <p className="text-[11px] text-charcoal-400 font-mono opacity-70">ID: #{item.id}</p>
                                                    </div>
                                                    {!activeSection.isCategory && (
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold capitalize border ${item.activo ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                                            {item.activo ? 'activo' : 'inactivo'}
                                                        </span>
                                                    )}
                                                    {activeSection.isCategory && (
                                                        <span className="text-[9px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                                                            {item.count || 0} ACTIVOS
                                                        </span>
                                                    )}
                                                </div>
                                                {item.descripcion && (
                                                    <p className="text-[10px] font-bold text-charcoal-500 bg-gray-50 p-3 rounded-xl border border-gray-100 capitalize leading-relaxed">{item.descripcion?.toLowerCase()}</p>
                                                )}
                                                {canEdit && (
                                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                                        <button
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-primary bg-primary/5 rounded-full capitalize hover:bg-primary transition-all hover:text-white"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id, item.valor)}
                                                            className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-rose-600 bg-rose-50 rounded-full capitalize hover:bg-rose-500 transition-all hover:text-white"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                            Borrar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {currentItems.length === 0 && (
                                        <div className="py-20 text-center bg-gray-50/20">
                                            <TagIcon className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                                            <p className="text-charcoal-400 font-bold italic text-[11px] uppercase tracking-widest">Sin registros en este catálogo</p>
                                        </div>
                                    )}
                                    
                                    {data.length > 0 && (
                                        <div className="p-4 border-t border-gray-50">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                totalItems={data.length}
                                                itemsPerPage={ITEMS_PER_PAGE}
                                                currentCount={currentItems.length}
                                                onPageChange={setCurrentPage}
                                            />
                                        </div>
                                    )}
                                </>
                            );
                        })()
                    )}
                </div>
            </div>

            {/* Modal de Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h3 className="text-lg font-black text-charcoal-900 capitalize tracking-tight flex items-center gap-3">
                                    <div className="bg-primary/5 p-1.5 rounded-full border border-primary/10">
                                        <TagIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    {isEditing ? 'editar registro' : 'nuevo registro'}
                                </h3>
                                <p className="text-[11px] font-bold text-charcoal-400 capitalize mt-1.5 ml-10">Gestión de catálogos y taxonomías del sistema</p>
                            </div>
                            <button 
                                onClick={handleCloseModal} 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Nombre / Valor *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                    value={formData.valor}
                                    onChange={e => setFormData({ ...formData, valor: e.target.value })}
                                    placeholder="EJ: MONITOR"
                                />
                            </div>

                            {!activeSection.isCategory && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Descripción (Opcional)</label>
                                        <textarea
                                            className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm resize-none"
                                            rows="3"
                                            value={formData.descripcion}
                                            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                            placeholder="..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-0">
                                            <input
                                                type="checkbox"
                                                id="activo"
                                                checked={formData.activo}
                                                onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                                className="h-5 w-5 text-primary focus:ring-primary/20 border-gray-200 rounded transition-all cursor-pointer"
                                            />
                                        </div>
                                        <label htmlFor="activo" className="text-[11px] font-bold text-charcoal-600 capitalize cursor-pointer">Habilitado para uso inmediato en el sistema</label>
                                    </div>
                                </>
                            )}

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 btn-primary"
                                >
                                    {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                    {isEditing ? 'Guardar Cambios' : 'Crear Registro'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categorias;
