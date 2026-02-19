import { useState, useEffect } from 'react';
import api from '../../../lib/axios';

const EstadoHojaVidaForm = ({ open, onClose, hojaVida }) => {
    const [formData, setFormData] = useState({
        tipo: hojaVida?.tipo || 'MANTENIMIENTO',
        diagnostico: hojaVida?.diagnostico || '',
        responsableId: hojaVida?.responsableId || '',
        casoAranda: hojaVida?.casoAranda || '',
        costo: hojaVida?.costo || '',
        estado: hojaVida?.estado || 'EN_PROCESO'
    });
    const [usuarios, setUsuarios] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch users for dropdown - Assuming role 'Analista TIC' corresponds to TECNICO or similar in DB
        const fetchUsuarios = async () => {
            try {
                // Adjust this filter based on your user roles
                const res = await api.get('/usuarios'); // Need an endpoint for this or filter locally
                // Filter for technicians/analysts
                const tecnicos = res.data.filter(u => u.rol === 'TECNICO' || u.rol === 'ADMIN');
                setUsuarios(tecnicos);
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('tipo', formData.tipo);
            if (formData.responsableId) data.append('responsableId', formData.responsableId);
            data.append('diagnostico', formData.diagnostico);
            data.append('casoAranda', formData.casoAranda);
            data.append('costo', formData.costo);
            data.append('estado', formData.estado);

            if (file) {
                data.append('file', file);
            }

            await api.put(`/hojavida/${hojaVida.id}/procesar`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onClose(true); // Close and refresh
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al actualizar registro');
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
                <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Gestionar Evento
                    </h3>

                    {error && <div className="mb-4 text-sm text-red-600 font-medium">{error}</div>}

                    <div className="mb-6 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Detalles Iniciales (Solo Lectura)</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-gray-500">Fecha de Creación</span>
                                <span className="font-medium">{new Date(hojaVida.fecha).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500">Registrado Por</span>
                                <span className="font-medium">{hojaVida.registradoPor || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="mt-2 text-sm">
                            <span className="block text-gray-500">Descripción Inicial</span>
                            <p className="mt-1 text-gray-800 whitespace-pre-wrap">{hojaVida.descripcion}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
                                <select
                                    name="tipo"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                >
                                    <option value="MANTENIMIENTO">Mantenimiento Preventivo</option>
                                    <option value="REPARACION">Reparación / Correctivo</option>
                                    <option value="SUMINISTRO">Suministro (Toner, Repuestos)</option>
                                    <option value="INSPECCION">Inspección / Diagnóstico</option>
                                    <option value="ACTUALIZACION">Actualización de SW/HW</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">TI Asignado</label>
                                <select
                                    name="responsableId"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                    value={formData.responsableId}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione...</option>
                                    {usuarios.map(u => (
                                        <option key={u.id} value={u.id}>{u.nombre} - {u.rol}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Diagnóstico / Tareas Realizadas</label>
                            <textarea
                                name="diagnostico"
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
                                value={formData.diagnostico}
                                onChange={handleChange}
                                placeholder="Describa el trabajo realizado..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Caso Aranda</label>
                                <input type="text" name="casoAranda" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.casoAranda} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Costo Total</label>
                                <input type="number" name="costo" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.costo} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estado del Evento</label>
                                <select
                                    name="estado"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white font-medium"
                                    value={formData.estado}
                                    onChange={handleChange}
                                >
                                    <option value="CREADO">Creado (Pendiente)</option>
                                    <option value="EN_PROCESO">En Proceso (Requiere más trabajo)</option>
                                    <option value="FINALIZADO">Finalizado (Cerrar caso)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Soporte (Img/PDF)</label>
                                <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" accept=".jpg,.jpeg,.png,.pdf" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => onClose(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Guardando...' : 'Actualizar y Procesar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EstadoHojaVidaForm;
