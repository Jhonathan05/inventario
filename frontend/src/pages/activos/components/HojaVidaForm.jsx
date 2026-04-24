import { useState } from 'react';
import api from '../../../lib/axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
            setError(`${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => onClose(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h3 className="text-lg font-black text-charcoal-900 capitalize tracking-tight">Registrar Nuevo Evento</h3>
                        <p className="text-[11px] font-bold text-charcoal-400 capitalize mt-1">Historial técnico del activo</p>
                    </div>
                    <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-bold text-xs italic">! {error}</div>}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Tipo de Evento *</label>
                            <select
                                name="tipo"
                                className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none"
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

                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Fecha del Evento *</label>
                            <input type="date" name="fecha" required className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" value={formData.fecha} onChange={handleChange} />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Descripción Detallada *</label>
                            <textarea name="descripcion" required rows="3" className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm resize-none" value={formData.descripcion} onChange={handleChange} placeholder="Describa el problema o el motivo del evento..."></textarea>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Evidencia (Opcional)</label>
                            <input type="file" onChange={handleFileChange} className="w-full text-xs text-charcoal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary/5 file:text-primary hover:file:bg-primary/10 transition-all" accept=".jpg,.jpeg,.png,.pdf" />
                            <p className="text-[9px] text-charcoal-400 mt-1 italic ml-1">Imágenes o PDF. Máx 5MB recomendado.</p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="submit" disabled={loading} className="flex-1 btn-primary">
                            {loading ? 'Guardando...' : 'Crear Registro'}
                        </button>
                        <button type="button" onClick={() => onClose(false)} className="flex-1 btn-secondary">
                            Descartar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HojaVidaForm;
