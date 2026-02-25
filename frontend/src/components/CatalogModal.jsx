import { useState } from 'react';
import api from '../lib/axios';

const CatalogModal = ({ open, onClose, domain, title, onSaveSuccess, isCategory = false }) => {
    const [nombre, setNombre] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        setSaving(true);
        setError('');
        try {
            let newVal;
            if (isCategory) {
                const res = await api.post('/categorias', { nombre: nombre.toUpperCase() });
                newVal = res.data;
            } else {
                const res = await api.post('/catalogos', {
                    dominio: domain,
                    valor: nombre.toUpperCase()
                });
                newVal = res.data;
            }
            onSaveSuccess(newVal);
            setNombre('');
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="relative inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        ✨ Agregar {title}
                    </h3>

                    {error && (
                        <p className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre / Valor *</label>
                            <input
                                type="text"
                                autoFocus
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                placeholder="Ingrese el nuevo valor..."
                            />
                        </div>

                        <div className="mt-5 flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:text-sm disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CatalogModal;
