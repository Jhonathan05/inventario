import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import CatalogosForm from './CatalogosForm';


const CatalogosList = () => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'TECNICO';

    const [catalogos, setCatalogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterDominio, setFilterDominio] = useState('');

    useEffect(() => {
        fetchCatalogos();
    }, []);

    const fetchCatalogos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/catalogos');
            setCatalogos(response.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar catálogos');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsFormOpen(true);
    };

    const handleNew = () => {
        setSelectedItem(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = (refresh) => {
        setIsFormOpen(false);
        setSelectedItem(null);
        if (refresh) fetchCatalogos();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este ítem?')) return;
        try {
            await api.delete(`/catalogos/${id}`);
            fetchCatalogos();
        } catch (err) {
            alert('Error al eliminar');
        }
    };

    const filteredCatalogos = filterDominio
        ? catalogos.filter(c => c.dominio === filterDominio)
        : catalogos;

    if (loading && catalogos.length === 0) return <div className="p-4">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Configuración de Catálogos</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Administre las opciones de las listas desplegables (Áreas, Cargos, etc.)
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-4">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                        value={filterDominio}
                        onChange={(e) => setFilterDominio(e.target.value)}
                    >
                        <option value="">Todos los dominios</option>
                        <option value="AREA">ÁREAS</option>
                        <option value="CARGO">CARGOS</option>
                    </select>
                    {canEdit && (
                        <button
                            onClick={handleNew}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Nuevo Ítem
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">{error}</div>}

            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dominio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            {canEdit && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCatalogos.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <span className={`px-2 py-1 rounded-full text-xs ${item.dominio === 'AREA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {item.dominio}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.valor}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.activo ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <span className="h-2 w-2 bg-green-600 rounded-full"></span> Activo
                                        </span>
                                    ) : (
                                        <span className="text-red-500 flex items-center gap-1">
                                            <span className="h-2 w-2 bg-red-500 rounded-full"></span> Inactivo
                                        </span>
                                    )}
                                </td>
                                {canEdit && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {filteredCatalogos.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    No se encontraron ítems en este catálogo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CatalogosForm
                open={isFormOpen}
                onClose={handleCloseForm}
                item={selectedItem}
            />
        </div>
    );
};

export default CatalogosList;
