import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { toTitleCase } from '../../lib/utils';

const FuncionariosForm = ({ open, onClose, funcionario }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        cargo: '',
        area: '',
        email: '',
        telefono: '',
        activo: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (funcionario) {
            setFormData({
                nombre: funcionario.nombre || '',
                cedula: funcionario.cedula || '',
                cargo: funcionario.cargo || '',
                area: funcionario.area || '',
                email: funcionario.email || '',
                telefono: funcionario.telefono || '',
                activo: funcionario.activo ?? true
            });
        } else {
            setFormData({
                nombre: '', cedula: '', cargo: '', area: '', email: '', telefono: '', activo: true
            });
        }
    }, [funcionario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (type !== 'checkbox') {
            if (name === 'nombre') {
                newValue = toTitleCase(value);
            } else if (['cargo', 'area'].includes(name)) {
                newValue = value.toUpperCase();
            } else if (name === 'email') {
                newValue = value.toLowerCase();
            } else if (['cedula', 'telefono'].includes(name)) {
                // Allow only numbers
                newValue = value.replace(/\D/g, '');
            }
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

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setError('Por favor ingrese un correo electrónico válido');
            setLoading(false);
            return;
        }

        try {
            if (funcionario) {
                await api.put(`/funcionarios/${funcionario.id}`, formData);
            } else {
                await api.post('/funcionarios', formData);
            }
            onClose(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar funcionario');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {funcionario ? 'Editar Funcionario' : 'Nuevo Funcionario'}
                    </h3>

                    {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                            <input type="text" name="nombre" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cédula / ID *</label>
                            <input type="text" name="cedula" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.cedula} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cargo</label>
                                <input type="text" name="cargo" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.cargo} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Área / Sede</label>
                                <input type="text" name="area" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.area} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ejemplo@empresa.com"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Debe ser un correo válido: ejemplo@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="text" name="telefono" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.telefono} onChange={handleChange} />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => onClose(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FuncionariosForm;
