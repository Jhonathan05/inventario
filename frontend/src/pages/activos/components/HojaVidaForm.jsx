import { useState } from 'react';
import api from '../../../lib/axios';

const HojaVidaForm = ({ open, onClose, activoId }) => {
    const [formData, setFormData] = useState({
        tipo: 'MANTENIMIENTO',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0]
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            data.append('activoId', activoId);
            data.append('tipo', formData.tipo);
            data.append('descripcion', formData.descripcion);
            data.append('fecha', formData.fecha);
            if (file) {
                data.append('file', file);
            }

            await api.post('/hojavida', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onClose(true);
        } catch (err) {
            console.error('Error creating HojaVida:', err);
            const msg = err.response?.data?.error || err.message || 'Error desconocido al guardar';
            setError(`${msg} (Status: ${err.response?.status})`);
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
                        Registrar Nuevo Evento
                    </h3>

                    {error && <div className="mb-4 text-sm text-red-600 font-medium">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <label className="block text-sm font-medium text-gray-700">Fecha del Evento</label>
                            <input type="date" name="fecha" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.fecha} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción Detallada *</label>
                            <textarea name="descripcion" required rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" value={formData.descripcion} onChange={handleChange} placeholder="Describa el problema o el motivo del evento..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Evidencia (Opcional)</label>
                            <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" accept=".jpg,.jpeg,.png,.pdf" />
                            <p className="text-xs text-gray-500 mt-1">Imágenes o PDF. Máx 5MB.</p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => onClose(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Guardando...' : 'Crear Evento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HojaVidaForm;
