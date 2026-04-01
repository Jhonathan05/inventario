import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService } from '../../api/categorias.service';
import { catalogosService } from '../../api/catalogos.service';
import { useAuth } from '../../context/AuthContext';

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
        queryKey: ['categorias'],
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
            } else {
                await catalogosService.delete(id);
                queryClient.invalidateQueries({ queryKey: ['catalogos'] });
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error al eliminar');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Tabs */}
            <div className="lg:w-64 flex-none space-y-1">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Secciones</h2>
                {MANAGEMENT_SECTIONS.map(section => (
                    <button
                        key={section.id}
                        onClick={() => handleSectionChange(section)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection.id === section.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {section.title}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <div className="sm:flex sm:items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{activeSection.title}</h1>
                                <p className="mt-1 text-sm text-gray-500">{activeSection.description}</p>
                            </div>
                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={handleOpenNew}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-500 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nuevo Valor
                                </button>
                            )}
                        </div>

                        {/* Domain Tabs within sections */}
                        {activeSection.domains && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {activeSection.domains.map(domain => (
                                    <button
                                        key={domain}
                                        onClick={() => handleDomainChange(domain)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeDomain === domain
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-600'
                                            }`}
                                    >
                                        {domain.replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

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
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor / Nombre</th>
                                                    {!activeSection.isCategory && (
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                    )}
                                                    {activeSection.isCategory && (
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activos</th>
                                                    )}
                                                    {canEdit && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {currentItems.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{item.valor}</div>
                                                            {item.descripcion && <div className="text-xs text-gray-400">{item.descripcion}</div>}
                                                        </td>
                                                        {!activeSection.isCategory && (
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {item.activo ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {activeSection.isCategory && (
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count || 0}</td>
                                                        )}
                                                        {canEdit && (
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button onClick={() => handleOpenEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                                                <button onClick={() => handleDelete(item.id, item.valor)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                                {currentItems.length === 0 && (
                                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No hay registros</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 bg-gray-50">
                                                <p className="text-sm text-gray-500">
                                                    Mostrando {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, data.length)} de {data.length}
                                                </p>
                                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                                    <button
                                                        onClick={() => setCurrentPage(p => p - 1)}
                                                        disabled={currentPage === 1}
                                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40"
                                                    >
                                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                                                    </button>
                                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                                                        {currentPage} / {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(p => p + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40"
                                                    >
                                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                                                    </button>
                                                </nav>
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
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <div className="relative inline-block align-middle bg-white rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                {isEditing ? '✏️ Editar Registro' : '➕ Nuevo Registro'}
                            </h3>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre / Valor *</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        value={formData.valor}
                                        onChange={e => setFormData({ ...formData, valor: e.target.value })}
                                        placeholder="EJ: MONITOR"
                                    />
                                </div>

                                {!activeSection.isCategory && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                                            <textarea
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                rows="2"
                                                value={formData.descripcion}
                                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="activo"
                                                checked={formData.activo}
                                                onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="activo" className="text-sm text-gray-700">Habilitado para uso</label>
                                        </div>
                                    </>
                                )}

                                <div className="mt-8 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70"
                                    >
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        Cancelar
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
