import { useState, useEffect } from 'react';
import api from '../../lib/axios';

const FuncionariosForm = ({ open, onClose, funcionario }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        shortname: '',
        cedula: '',
        codigoPersonal: '',
        cargo: '',
        area: '',
        email: '',
        telefono: '',
        activo: true,
        vinculacion: '',
        empresaFuncionario: '',
        proyecto: '',
        departamento: '',
        ciudad: '',
        seccional: '',
        municipio: '',
        ubicacion: '',
        piso: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [options, setOptions] = useState({ areas: [], cargos: [] });

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const response = await api.get('/funcionarios/opciones');
            setOptions(response.data);
        } catch (err) {
            console.error('Error fetching options:', err);
        }
    };

    useEffect(() => {

        if (funcionario) {
            setFormData({
                nombre: funcionario.nombre || '',
                shortname: funcionario.shortname || '',
                cedula: funcionario.cedula || '',
                codigoPersonal: funcionario.codigoPersonal || '',
                cargo: funcionario.cargo || '',
                area: funcionario.area || '',
                email: funcionario.email || '',
                telefono: funcionario.telefono || '',
                activo: funcionario.activo ?? true,
                vinculacion: funcionario.vinculacion || '',
                empresaFuncionario: funcionario.empresaFuncionario || '',
                proyecto: funcionario.proyecto || '',
                departamento: funcionario.departamento || '',
                ciudad: funcionario.ciudad || '',
                seccional: funcionario.seccional || '',
                municipio: funcionario.municipio || '',
                ubicacion: funcionario.ubicacion || '',
                piso: funcionario.piso || ''
            });
        } else {
            setFormData({
                nombre: '', shortname: '', cedula: '', codigoPersonal: '', cargo: '', area: '', email: '', telefono: '', activo: true, vinculacion: '', empresaFuncionario: '', proyecto: '', departamento: '', ciudad: '', seccional: '', municipio: '', ubicacion: '', piso: ''
            });
        }
    }, [funcionario]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;

        if (type !== 'checkbox') {
            if (name === 'email') {
                newValue = value.toLowerCase();
            } else if (['cedula', 'telefono', 'codigoPersonal'].includes(name)) {
                newValue = value; // mantener como viene (puede tener letras en códigos)
            } else {
                // todos los demás campos de texto → MAYÚSCULAS
                newValue = value.toUpperCase();
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
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => onClose(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6 w-full max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                        {funcionario ? 'Editar Funcionario' : 'Nuevo Funcionario'}
                    </h3>

                    {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* SECCIÓN: INFORMACIÓN BÁSICA Y CONTACTO */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Información Personal y Contacto</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                                    <input type="text" name="nombre" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.nombre} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Alias / Nombre Corto</label>
                                    <input type="text" name="shortname" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.shortname} onChange={handleChange} placeholder="Ej. JUAN.PEREZ" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cédula *</label>
                                    <input type="text" name="cedula" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.cedula} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input type="text" name="telefono" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.telefono} onChange={handleChange} />
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        id="activo"
                                        name="activo"
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                    <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">
                                        Funcionario Activo
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN: INFORMACIÓN LABORAL */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Información Laboral Corporativa</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cód. Personal (Interno)</label>
                                    <input type="text" name="codigoPersonal" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.codigoPersonal} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Vinculación</label>
                                    <select name="vinculacion" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.vinculacion} onChange={handleChange}>
                                        <option value="">Seleccione...</option>
                                        <option value="EMPLEADO">EMPLEADO</option>
                                        <option value="CONTRATISTA">CONTRATISTA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cargo</label>
                                    <select name="cargo" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.cargo} onChange={handleChange}>
                                        <option value="">Seleccione...</option>
                                        {options.cargos.map(cargo => (
                                            <option key={cargo} value={cargo}>{cargo}</option>
                                        ))}
                                    </select>

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Área / Dependencia</label>
                                    <select name="area" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.area} onChange={handleChange}>
                                        <option value="">Seleccione...</option>
                                        {options.areas.map(area => (
                                            <option key={area} value={area}>{area}</option>
                                        ))}
                                    </select>

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Empresa (Tercero)</label>
                                    <input type="text" name="empresaFuncionario" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.empresaFuncionario} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Proyecto</label>
                                    <input type="text" name="proyecto" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.proyecto} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN: UBICACIÓN GEOGRÁFICA Y FÍSICA */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Ubicación</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Departamento</label>
                                    <input type="text" name="departamento" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.departamento} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                                    <input type="text" name="ciudad" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.ciudad} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Seccional</label>
                                    <input type="text" name="seccional" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.seccional} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Municipio</label>
                                    <input type="text" name="municipio" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.municipio} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ubicación (Sede Fija)</label>
                                    <input type="text" name="ubicacion" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.ubicacion} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Piso / Oficina</label>
                                    <input type="text" name="piso" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.piso} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={() => onClose(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {loading ? 'Guardando...' : 'Guardar Información'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FuncionariosForm;

