import { useState, useEffect } from 'react';
import api from '../../../lib/axios';

const UsuarioForm = ({ open, onClose, usuario }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'ANALISTA_TIC', // Valor por defecto seguro
        activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || '',
                email: usuario.email || '',
                password: '', // No mostramos la contraseña actual
                rol: usuario.rol || 'ANALISTA_TIC',
                activo: usuario.activo ?? true
            });
        } else {
            setFormData({
                nombre: '',
                email: '',
                password: '',
                rol: 'ANALISTA_TIC',
                activo: true
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        // email y password no se transforman
        if (type !== 'checkbox' && name !== 'email' && name !== 'password' && name !== 'rol') {
            newValue = value.toUpperCase();
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (usuario) {
                // Edit logic
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password; // Only send if changed
                await api.put(`/usuarios/${usuario.id}`, dataToUpdate);
            } else {
                // Create logic
                await api.post('/usuarios', formData);
            }
            onClose(true); // Close and refresh
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar usuario');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h3>

                        {error && <div className="mt-2 text-sm text-red-600 font-medium">{error}</div>}

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                                <input type="text" name="nombre" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.nombre} onChange={handleChange} />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="usuario@dominio.com"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                    title="Debe ser un correo válido: usuario@dominio.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    {usuario ? 'Contraseña (Dejar en blanco para no cambiar)' : 'Contraseña *'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required={!usuario}
                                    minLength="6"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol *</label>
                                <select name="rol" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.rol} onChange={handleChange}>
                                    <option value="ADMIN">Administrador</option>
                                    <option value="CONSULTA">Consulta</option>
                                    <option value="ANALISTA_TIC">Analista TIC</option>
                                </select>
                            </div>

                            {usuario && (
                                <div className="flex items-center">
                                    <input
                                        id="activo"
                                        name="activo"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={formData.activo}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                                        Usuario Activo
                                    </label>
                                </div>
                            )}

                            <div className="mt-5 sm:mt-6 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={() => onClose(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                                >
                                    {loading ? 'Guardando...' : 'Guardar Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsuarioForm;
