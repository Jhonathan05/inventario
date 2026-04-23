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
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../components/Pagination';

const MANAGEMENT_SECTIONS = [
    {
        id: 'MODULO_CATEGORIAS',
        title: 'Categorías',
        description: 'Tipos principales de activos (ej. PORTATIL, MONITOR)',
        isCategory: true
    },
    {
        id: 'GRUPO_PERSONAL',
        title: 'Personal',
        description: 'Cargos y empresas de vinculación',
        domains: ['CARGO', 'EMPRESA_FUNCIONARIO', 'TIPO_PERSONAL']
    },
    {
        id: 'GRUPO_HARDWARE',
        title: 'Hardware & Hardware',
        description: 'Especificaciones técnicas del equipo',
        domains: ['TIPO_EQUIPO', 'PROCESADOR', 'MEMORIA_RAM', 'DISCO_DURO', 'SISTEMA_OPERATIVO']
    },
    {
        id: 'GRUPO_ADMIN',
        title: 'Administración',
        description: 'Estados operativos y fuentes de recurso',
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
                queryClient.invalidateQueries({ queryKey: ['catalogos'] }); // clear forms cache
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
            <div className="lg:w-64 flex-none space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                    <Bars3Icon className="w-3 h-3" />
                    Catálogos del Sistema
                </h2>
                <div className="space-y-1">
                    {MANAGEMENT_SECTIONS.map(section => (
                        <button
                            key={section.id}
                            onClick={() => handleSectionChange(section)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${activeSection.id === section.id
                                ? 'bg-fnc-600 text-white shadow-lg border-fnc-700'
                                : 'text-charcoal-500 hover:bg-gray-50 border-transparent'
                                }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                {/* Sección de Encabezado: Título y Descripción */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="sm:flex sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-black text-charcoal-900 flex items-center gap-3">
                                <div className="bg-fnc-50 p-2 rounded-lg border border-fnc-100">
                                    <TagIcon className="w-6 h-6 text-fnc-600" />
                                </div>
                                {activeSection.title}
                            </h1>
                            <p className="text-charcoal-500 text-sm mt-1 font-medium ml-11">
                                {activeSection.description}
                            </p>
                        </div>
                        {canEdit && (
                            <button
                                type="button"
                                onClick={handleOpenNew}
                                className="bg-fnc-600 text-white px-5 py-2.5 rounded-lg hover:bg-fnc-700 flex items-center gap-2 shrink-0 shadow-sm transition-all font-black text-xs uppercase tracking-widest"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Nuevo Registro
                            </button>
                        )}
                    </div>

                    {/* Domain Tabs within header card */}
                    {activeSection.domains && (
                        <div className="flex flex-wrap gap-2 mt-6 ml-11">
                            {activeSection.domains.map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${activeDomain === domain
                                        ? 'bg-fnc-50 border-fnc-200 text-fnc-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-fnc-200 hover:text-fnc-600'
                                        }`}
                                >
                                    {domain.replace(/_/g, ' ')}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Cargando datos...</div>
                        ) : error ? (
                            <div className="p-12 text-center text-red-500">{error}</div>
                        ) : (
                            (() => {
                                const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
                                const currentItems = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);
                                const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
                                return (
                                    <>
                                        {/* Desktop View */}
                                        <div className="hidden md:block">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">ID Ref</th>
                                                        <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Valor / Nombre</th>
                                                        {!activeSection.isCategory && (
                                                            <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado</th>
                                                        )}
                                                        {activeSection.isCategory && (
                                                            <th className="px-6 py-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Recurso</th>
                                                        )}
                                                        {canEdit && <th className="px-6 py-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Acción</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-100">
                                                    {currentItems.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-charcoal-400">#{item.id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-bold text-charcoal-900">{item.valor}</div>
                                                                {item.descripcion && <div className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">{item.descripcion}</div>}
                                                            </td>
                                                            {!activeSection.isCategory && (
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {item.activo ? (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-green-50 text-green-700 border border-green-100 tracking-widest">Inscrito/Activo</span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-100 tracking-widest">Desactivado</span>
                                                                    )}
                                                                </td>
                                                            )}
                                                            {activeSection.isCategory && (
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="text-[10px] font-black text-fnc-600 bg-fnc-50 px-2 py-1 rounded-lg border border-fnc-100 uppercase tracking-widest">
                                                                        {item.count || 0} Activos
                                                                    </span>
                                                                </td>
                                                            )}
                                                            {canEdit && (
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="flex justify-end gap-1">
                                                                        <button onClick={() => handleOpenEdit(item)} className="p-2 text-charcoal-400 hover:text-fnc-600 rounded-lg transition-all" title="Editar">
                                                                            <PencilSquareIcon className="w-4 h-4" />
                                                                        </button>
                                                                        <button onClick={() => handleDelete(item.id, item.valor)} className="p-2 text-charcoal-400 hover:text-red-600 rounded-lg transition-all" title="Eliminar">
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
                                        <div className="md:hidden space-y-3 p-4 bg-gray-50/30">
                                            {currentItems.map((item) => (
                                                <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 hover:border-fnc-200 transition-all">
                                                    <div className="flex justify-between items-start">
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-charcoal-900 text-sm truncate">{item.valor}</h3>
                                                            <p className="text-[10px] text-charcoal-400 font-mono">ID: #{item.id}</p>
                                                        </div>
                                                        {!activeSection.isCategory && (
                                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${item.activo ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                                {item.activo ? 'ACTIVO' : 'INACTIVO'}
                                                            </span>
                                                        )}
                                                        {activeSection.isCategory && (
                                                            <span className="text-[10px] font-black text-fnc-600 bg-fnc-50 px-2 py-0.5 rounded-lg border border-fnc-100 uppercase tracking-widest">
                                                                {item.count || 0} ACTIVOS
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.descripcion && (
                                                        <p className="text-[10px] font-bold text-charcoal-500 bg-gray-50 p-2 rounded-lg border border-gray-100 uppercase tracking-widest">{item.descripcion}</p>
                                                    )}
                                                    {canEdit && (
                                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                                                            <button
                                                                onClick={() => handleOpenEdit(item)}
                                                                className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-fnc-600 bg-fnc-50 rounded-lg uppercase tracking-widest hover:bg-fnc-100 transition-all"
                                                            >
                                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.valor)}
                                                                className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black text-red-600 bg-red-50 rounded-lg uppercase tracking-widest hover:bg-red-100 transition-all"
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5" />
                                                                Borrar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {currentItems.length === 0 && (
                                            <div className="p-12 text-center bg-gray-50/20">
                                                <TagIcon className="mx-auto h-12 w-12 text-gray-200 mb-3" />
                                                <p className="text-charcoal-400 font-bold italic text-sm uppercase tracking-widest">No se encontraron registros</p>
                                            </div>
                                        )}
                                        
                                        {data.length > 0 && (
                                            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    totalItems={data.length}
                                                    itemsPerPage={ITEMS_PER_PAGE}
                                                    currentCount={currentItems.length}
                                                    onPageChange={(p) => {
                                                        setCurrentPage(p);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                );
                            })()
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-lg font-black text-charcoal-900 uppercase tracking-widest flex items-center gap-2">
                                    <TagIcon className="w-5 h-5 text-fnc-600" />
                                    {isEditing ? 'Editar Registro' : 'Nuevo Registro'}
                                </h3>
                                <p className="text-[10px] font-black text-charcoal-400 uppercase tracking-widest mt-0.5">Gestión de catálogos y taxonomías</p>
                            </div>
                            <button 
                                onClick={handleCloseModal} 
                                className="p-2 hover:bg-white rounded-full transition-colors text-charcoal-400 shadow-sm border border-transparent hover:border-gray-100"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Nombre / Valor *</label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-fnc-500 focus:border-fnc-500 transition-all outline-none"
                                    value={formData.valor}
                                    onChange={e => setFormData({ ...formData, valor: e.target.value })}
                                    placeholder="EJ: MONITOR"
                                />
                            </div>

                            {!activeSection.isCategory && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-black text-charcoal-400 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
                                        <textarea
                                            className="block w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium bg-white focus:ring-2 focus:ring-fnc-500 outline-none transition-all"
                                            rows="2"
                                            value={formData.descripcion}
                                            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                            placeholder="..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <input
                                            type="checkbox"
                                            id="activo"
                                            checked={formData.activo}
                                            onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                            className="h-5 w-5 text-fnc-600 focus:ring-fnc-500 border-gray-300 rounded-md transition-all cursor-pointer"
                                        />
                                        <label htmlFor="activo" className="text-[10px] font-black text-charcoal-600 uppercase tracking-widest cursor-pointer">Habilitado para uso en el sistema</label>
                                    </div>
                                </>
                            )}

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-fnc-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest shadow-lg hover:bg-fnc-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {saving && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                    {isEditing ? 'Actualizar' : 'Registrar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-white border border-gray-200 text-charcoal-600 rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
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
