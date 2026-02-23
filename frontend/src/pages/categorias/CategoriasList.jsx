import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const Categorias = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'TECNICO';

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({ nombre: '', icono: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Error desconocido';
            setError(`Error al cargar categorías: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenNew = () => {
        setFormData({ nombre: '', icono: '' });
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (cat) => {
        setFormData({ nombre: cat.nombre, icono: cat.icono || '' });
        setIsEditing(true);
        setCurrentId(cat.id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ nombre: '', icono: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing) {
                await api.put(`/categorias/${currentId}`, formData);
            } else {
                await api.post('/categorias', formData);
            }
            setShowModal(false);
            fetchCategorias();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error al guardar categoría');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) return;
        try {
            await api.delete(`/categorias/${id}`);
            fetchCategorias();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Error al eliminar categoría');
        }
    };

    if (loading && categorias.length === 0) return <div className="p-4">Cargando categorías...</div>;

    return (
        <div>
            {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">{error}</div>}

            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Categorías de Activos</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Tipos de activos disponibles en el inventario (ej. EQUIPO PORTATIL, IMPRESORA).
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    {canEdit && (
                        <button
                            type="button"
                            onClick={handleOpenNew}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Nueva Categoría
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Nombre
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Activos Relacionados
                                        </th>
                                        {canEdit && (
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Acciones</span>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {categorias.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {cat.id}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{cat.nombre}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {cat._count?.activos || 0}
                                            </td>
                                            {canEdit && (
                                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button onClick={() => handleOpenEdit(cat)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                                    <button onClick={() => handleDelete(cat.id, cat.nombre)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Crear/Editar */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">

                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                {isEditing ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                            </h3>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría *</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
                                        placeholder="EJ: MONITOR"
                                    />
                                </div>

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:col-start-2 sm:text-sm"
                                    >
                                        {saving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
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
