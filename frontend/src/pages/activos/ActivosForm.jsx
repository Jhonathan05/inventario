import { useState, useEffect } from 'react';
import api from '../../lib/axios';

const ActivosForm = ({ open, onClose, activo }) => {
    const [formData, setFormData] = useState({
        placa: '',
        serial: '',
        marca: '',
        modelo: '',
        categoriaId: '',
        estado: 'DISPONIBLE',
        ubicacion: '',
        valorCompra: '',
        fechaCompra: '',
        observaciones: ''
    });
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (activo) {
            setFormData({
                placa: activo.placa || '',
                serial: activo.serial || '',
                marca: activo.marca || '',
                modelo: activo.modelo || '',
                categoriaId: activo.categoriaId || '',
                estado: activo.estado || 'DISPONIBLE',
                ubicacion: activo.ubicacion || '',
                valorCompra: activo.valorCompra || '',
                fechaCompra: activo.fechaCompra ? activo.fechaCompra.split('T')[0] : '',
                observaciones: activo.observaciones || ''
            });
            // Handle existing image preview if needed, but for now we only show new upload preview
        } else {
            setFormData({
                placa: '', serial: '', marca: '', modelo: '', categoriaId: '',
                estado: 'DISPONIBLE', ubicacion: '', valorCompra: '', fechaCompra: '', observaciones: ''
            });
            setImagen(null);
            setPreview(null);
        }
    }, [activo]);

    const fetchCategorias = async () => {
        try {
            const res = await api.get('/categorias');
            setCategorias(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Enforce Uppercase for technical fields
        if (['placa', 'serial', 'marca', 'modelo', 'ubicacion'].includes(name)) {
            newValue = value.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) data.append(key, formData[key]);
            });
            if (imagen) {
                data.append('imagen', imagen);
            }

            if (activo) {
                await api.put(`/activos/${activo.id}`, data);
            } else {
                await api.post('/activos', data);
            }
            onClose(true); // Close and refresh
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al guardar activo');
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

                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {activo ? 'Editar Activo' : 'Nuevo Activo'}
                        </h3>

                        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa *</label>
                                    <input type="text" name="placa" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.placa} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="serial" className="block text-sm font-medium text-gray-700">Serial</label>
                                    <input type="text" name="serial" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.serial} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca *</label>
                                    <input type="text" name="marca" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.marca} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">Modelo *</label>
                                    <input type="text" name="modelo" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.modelo} onChange={handleChange} />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700">Categoría *</label>
                                    <select name="categoriaId" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.categoriaId} onChange={handleChange}>
                                        <option value="">Seleccione...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select name="estado" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white" value={formData.estado} onChange={handleChange}>
                                        <option value="DISPONIBLE">DISPONIBLE</option>
                                        <option value="ASIGNADO">ASIGNADO</option>
                                        <option value="EN_MANTENIMIENTO">EN MANTENIMIENTO</option>
                                        <option value="DADO_DE_BAJA">DADO DE BAJA</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
                                    <input type="text" name="ubicacion" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.ubicacion} onChange={handleChange} />
                                </div>

                                <div>
                                    <label htmlFor="valorCompra" className="block text-sm font-medium text-gray-700">Valor Compra</label>
                                    <input type="number" name="valorCompra" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.valorCompra} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="fechaCompra" className="block text-sm font-medium text-gray-700">Fecha Compra</label>
                                    <input type="date" name="fechaCompra" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.fechaCompra} onChange={handleChange} />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea name="observaciones" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.observaciones} onChange={handleChange}></textarea>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Imagen Principal</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        {preview && (
                                            <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded shadow" />
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    </div>
                                </div>
                            </div>

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
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivosForm;
