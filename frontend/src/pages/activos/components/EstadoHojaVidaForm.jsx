import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { generateMaintenanceReport } from '../reports/MaintenanceReport';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EstadoHojaVidaForm = ({ open, onClose, hojaVida, activo }) => {
    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';
    const isReadOnly = !canEdit || hojaVida.estado === 'FINALIZADO';

    const [formData, setFormData] = useState({
        tipo: hojaVida?.tipo || 'MANTENIMIENTO',
        diagnostico: hojaVida?.diagnostico || '',
        responsableId: hojaVida?.responsableId || '',
        casoAranda: hojaVida?.casoAranda || '',
        costo: hojaVida?.costo || '',
        estado: hojaVida?.estado || 'EN_PROCESO',
        nuevaNota: ''
    });
    const [usuarios, setUsuarios] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch users for dropdown - Analista TIC
        const fetchUsuarios = async () => {
            try {
                const res = await api.get('/usuarios'); 
                const tecnicos = res.data.filter(u => u.rol === 'ANALISTA_TIC' || u.rol === 'ADMIN');
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
            data.append('nuevaNota', formData.nuevaNota);

            if (file) {
                data.append('file', file);
            }

            await api.put(`/hojavida/${hojaVida.id}/procesar`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onClose(true); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al actualizar registro');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => onClose(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h3 className="text-xl font-black text-charcoal-900 capitalize tracking-tight">Gestionar Evento</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[11px] font-bold text-charcoal-400 capitalize">ID: #{hojaVida.id}</p>
                            <span className="w-1 h-1 rounded-full bg-charcoal-200"></span>
                            <p className="text-[11px] font-bold text-primary capitalize">{hojaVida.estado?.toLowerCase()?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-charcoal-400">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
                    {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-bold text-xs italic">! {error}</div>}

                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-4">
                        <h4 className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-gray-100 pb-2">Contexto Inicial</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <span className="block text-[10px] font-bold text-charcoal-400 uppercase opacity-60">Fecha Creación</span>
                                <span className="text-[13px] font-bold text-charcoal-800">{new Date(hojaVida.fecha).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-charcoal-400 uppercase opacity-60">Registrado Por</span>
                                <span className="text-[13px] font-bold text-charcoal-800 capitalize">{hojaVida.registradoPor?.toLowerCase() || 'N/A'}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-[10px] font-bold text-charcoal-400 uppercase opacity-60">Descripción del Problema</span>
                                <p className="mt-1 text-[13px] text-charcoal-700 italic leading-relaxed whitespace-pre-wrap">"{hojaVida.descripcion}"</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Tipo de Evento</label>
                            <select
                                name="tipo"
                                disabled={isReadOnly}
                                className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none disabled:bg-gray-50"
                                value={formData.tipo}
                                onChange={handleChange}
                            >
                                <option value="MANTENIMIENTO">Mantenimiento Preventivo</option>
                                <option value="REPARACION">Reparación / Correctivo</option>
                                <option value="SUMINISTRO">Suministro (Toner, Repuestos)</option>
                                <option value="INSPECCION">Inspección / Diagnóstico</option>
                                <option value="ACTUALIZACION">Actualización de SW/HW</option>
                                <option value="GARANTIA">Trámite de Garantía</option>
                            </select>
                        </div>

                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">TI Asignado</label>
                            <select
                                name="responsableId"
                                disabled={isReadOnly}
                                className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none disabled:bg-gray-50"
                                value={formData.responsableId}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione analista...</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>{u.nombre?.toLowerCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">
                                {hojaVida.estado === 'FINALIZADO' ? 'Diagnóstico Final' : 'Bitácora / Avances Recientes'}
                            </label>
                            {hojaVida.estado !== 'FINALIZADO' ? (
                                <textarea
                                    name="nuevaNota"
                                    rows="2"
                                    disabled={isReadOnly || formData.estado !== 'EN_PROCESO' || !formData.responsableId}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm resize-none disabled:bg-gray-50"
                                    value={formData.nuevaNota}
                                    onChange={handleChange}
                                    placeholder={(!isReadOnly && (formData.estado !== 'EN_PROCESO' || !formData.responsableId)) ? "Cambie el estado a 'En Proceso' y asigne un TI para habilitar notas." : "Describa el avance realizado ahora..."}
                                ></textarea>
                            ) : (
                                <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 text-[13px] font-medium text-charcoal-700 italic whitespace-pre-wrap">
                                    {hojaVida.diagnostico || 'Sin diagnóstico final especificado'}
                                </div>
                            )}
                        </div>

                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Caso Aranda</label>
                            <input type="text" name="casoAranda" disabled={isReadOnly} className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm disabled:bg-gray-50" value={formData.casoAranda} onChange={handleChange} />
                        </div>
                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Costo Estimado</label>
                            <input type="number" name="costo" disabled={isReadOnly} className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm disabled:bg-gray-50" value={formData.costo} onChange={handleChange} />
                        </div>

                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Estado de Gestión</label>
                            <select
                                name="estado"
                                required
                                disabled={isReadOnly}
                                className="w-full bg-white border border-gray-100 rounded-full py-3 px-5 text-[13px] font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm appearance-none disabled:bg-gray-50"
                                value={formData.estado}
                                onChange={handleChange}
                            >
                                <option value="CREADO">Creado (Pendiente)</option>
                                <option value="EN_PROCESO">En Proceso (Ejecución)</option>
                                <option value="ESPERA_SUMINISTRO">En Espera de Suministro</option>
                                <option value="PROCESO_GARANTIA">En Proceso de Garantía</option>
                                <option value="FINALIZADO">Finalizado (Cerrar)</option>
                            </select>
                        </div>

                        <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest ml-1">Soporte Técnico</label>
                            <input type="file" disabled={isReadOnly} onChange={handleFileChange} className="w-full text-xs text-charcoal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-primary/5 file:text-primary hover:file:bg-primary/10 transition-all disabled:opacity-50" accept=".jpg,.jpeg,.png,.pdf" />
                        </div>
                    </div>

                    {/* Bitácora / Historia */}
                    <div className="mt-4">
                        <h4 className="text-[11px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Cronología de Intervención</h4>
                        <div className="space-y-4 pr-2">
                            {hojaVida.trazas && hojaVida.trazas.length > 0 ? (
                                hojaVida.trazas.map((traza, idx) => (
                                    <div key={traza.id} className="relative pl-8 pb-6 border-l-2 border-charcoal-50 last:border-0 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-sm flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-charcoal-400">{new Date(traza.fecha).toLocaleString()}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[9px] font-black uppercase border border-primary/10">{traza.estadoNuevo?.toLowerCase()?.replace('_', ' ')}</span>
                                            </div>
                                            <p className="text-[13px] text-charcoal-800 font-medium leading-relaxed">{traza.observacion}</p>
                                            <div className="text-[10px] text-charcoal-400 font-bold mt-1">
                                                Atendido por: <span className="text-charcoal-600 capitalize">{traza.usuario?.nombre?.toLowerCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-charcoal-300 italic font-bold text-center py-6">No se han registrado avances aún.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={() => generateMaintenanceReport(activo, hojaVida)}
                            className="btn-secondary flex-1"
                        >
                            Descargar PDF
                        </button>
                        <button type="button" onClick={() => onClose(false)} className="btn-secondary flex-1">
                            {isReadOnly ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {!isReadOnly && (
                            <button type="submit" disabled={loading} className="btn-primary flex-[1.5]">
                                {loading ? 'Sincronizando...' : 'Guardar Avance'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EstadoHojaVidaForm;
