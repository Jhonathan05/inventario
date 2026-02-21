import { useState, useEffect } from 'react';
import api from '../../lib/axios';

const CatalogosForm = ({ open, onClose, item }) => {
    const [formData, setFormData] = useState({
        dominio: 'AREA',
        valor: '',
        descripcion: '',
        activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (item) {
            setFormData({
                dominio: item.dominio || 'AREA',
                valor: item.valor || '',
                descripcion: item.descripcion || '',
                activo: item.activo ?? true
            });
        } else {
            setFormData({
                dominio: 'AREA',
                valor: '',
                descripcion: '',
                activo: true
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (item) {
                await api.put(`/catalogos/${item.id}`, formData);
            } else {
                await api.post('/catalogos', formData);
            }
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar catálogo');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        {item ? 'Editar Ítem de Catálogo' : 'Nuevo Ítem de Catálogo'}
                    </h3>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Diminio (Tipo)</label>
                            <select
                                name="dominio"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                value={formData.dominio}
                                onChange={handleChange}
                            >
                                <option value="AREA">ÁREA</option>
                                <option value="CARGO">CARGO</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor (Nombre)</label>
                            <input
                                type="text"
                                name="valor"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                value={formData.valor}
                                onChange={handleChange}
                                placeholder="Ej: TIC, ANALISTA SICA..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                            <textarea
                                name="descripcion"
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="activo"
                                name="activo"
                                type="checkbox"
                                checked={formData.activo}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">
                                Item Activo
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => onClose(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CatalogosForm;
