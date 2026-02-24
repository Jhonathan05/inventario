import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { XMarkIcon, TagIcon, PaperClipIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const TicketForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);
    const [activos, setActivos] = useState([]);
    const [funcSearch, setFuncSearch] = useState('');
    const [activoSearch, setActivoSearch] = useState('');
    const [adjuntos, setAdjuntos] = useState([]); // Files to attach

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        prioridad: 'MEDIA',
        tipo: 'REQUERIMIENTO',
        funcionarioId: '',
        activoId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [funcData, actData] = await Promise.all([
                    api.get('/funcionarios'),
                    api.get('/activos')
                ]);
                setFuncionarios(funcData.data);
                setActivos(actData.data);
            } catch {
                toast.error('Error al cargar datos');
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAdjuntos(prev => [...prev, ...files]);
        e.target.value = ''; // Reset input to allow re-selecting same file
    };

    const removeFile = (index) => {
        setAdjuntos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.funcionarioId) { toast.error('Selecciona un funcionario'); return; }

        try {
            setLoading(true);

            // Use FormData to support file uploads
            const payload = new FormData();
            payload.append('titulo', formData.titulo);
            payload.append('descripcion', formData.descripcion);
            payload.append('prioridad', formData.prioridad);
            payload.append('tipo', formData.tipo);
            payload.append('funcionarioId', formData.funcionarioId);
            if (formData.activoId) payload.append('activoId', formData.activoId);
            adjuntos.forEach(file => payload.append('adjuntos', file));

            const res = await api.post('/tickets', payload);
            toast.success('Caso creado exitosamente');
            navigate(`/tickets/${res.data.id}`);
        } catch {
            toast.error('Error al crear el caso');
        } finally {
            setLoading(false);
        }
    };

    const filteredFuncionarios = funcionarios.filter(f =>
        `${f.nombre} ${f.cedula}`.toLowerCase().includes(funcSearch.toLowerCase())
    );

    const filteredActivos = activos.filter(a =>
        `${a.placa} ${a.marca || ''} ${a.modelo || ''}`.toLowerCase().includes(activoSearch.toLowerCase())
    );

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return '🖼️';
        if (file.type === 'application/pdf') return '📄';
        return '📎';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nuevo Caso de Soporte</h1>
                    <p className="text-sm text-gray-500 mt-1">Registra un incidente o requerimiento</p>
                </div>
                <button onClick={() => navigate('/tickets')} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                {/* Info General */}
                <div>
                    <h3 className="text-sm font-semibold uppercase text-gray-500 border-b pb-2 mb-4 flex items-center gap-1.5">
                        <ExclamationCircleIcon className="w-4 h-4 text-blue-500" /> Detalles del Requerimiento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                            <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                placeholder="Ej. Problema con el acceso al correo" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select required value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                <option value="REQUERIMIENTO">Requerimiento (Solicitud nueva)</option>
                                <option value="INCIDENTE">Incidente (Falla de algo existente)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
                            <select required value={formData.prioridad} onChange={e => setFormData({ ...formData, prioridad: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                <option value="BAJA">Baja</option>
                                <option value="MEDIA">Media</option>
                                <option value="ALTA">Alta</option>
                                <option value="CRITICA">Crítica (Interrumpe operación)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                            <textarea required rows="4" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Describe el problema con el mayor detalle posible..." />
                        </div>
                    </div>
                </div>

                {/* Asociación */}
                <div>
                    <h3 className="text-sm font-semibold uppercase text-gray-500 border-b pb-2 mb-4">Asociación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Funcionario Solicitante *</label>
                            <input type="text" placeholder="Buscar por nombre o cédula..."
                                value={funcSearch} onChange={e => { setFuncSearch(e.target.value); setFormData({ ...formData, funcionarioId: '' }); }}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-t-lg text-sm focus:ring-2 focus:ring-blue-500" />
                            <select required value={formData.funcionarioId} onChange={e => setFormData({ ...formData, funcionarioId: e.target.value })}
                                size="4" className="w-full border border-t-0 border-gray-200 rounded-b-lg text-sm bg-white">
                                <option value="">-- Seleccionar --</option>
                                {filteredFuncionarios.slice(0, 50).map(f => (
                                    <option key={f.id} value={f.id}>{f.nombre} ({f.cedula})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Activo Relacionado (Opcional)</label>
                            <input type="text" placeholder="Buscar por placa o modelo..."
                                value={activoSearch} onChange={e => { setActivoSearch(e.target.value); setFormData({ ...formData, activoId: '' }); }}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-t-lg text-sm focus:ring-2 focus:ring-blue-500" />
                            <select value={formData.activoId} onChange={e => setFormData({ ...formData, activoId: e.target.value })}
                                size="4" className="w-full border border-t-0 border-gray-200 rounded-b-lg text-sm bg-white">
                                <option value="">-- Ninguno --</option>
                                {filteredActivos.slice(0, 50).map(a => (
                                    <option key={a.id} value={a.id}>{a.placa} — {a.marca} {a.modelo}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                <TagIcon className="w-3 h-3" /> Solo si el caso está asociado a un equipo específico.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Evidencias / Adjuntos */}
                <div>
                    <h3 className="text-sm font-semibold uppercase text-gray-500 border-b pb-2 mb-4 flex items-center gap-1.5">
                        <PaperClipIcon className="w-4 h-4 text-blue-500" /> Evidencias Adjuntas (Opcional)
                    </h3>

                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
                    >
                        <PaperClipIcon className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-sm font-medium text-gray-600">Arrastra archivos o haz clic para adjuntar</p>
                        <p className="text-xs text-gray-400 mt-1">Imágenes, PDF, Word — máx. 5 MB por archivo</p>
                        <input id="file-upload" type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileChange} className="hidden" />
                    </label>

                    {adjuntos.length > 0 && (
                        <ul className="mt-3 space-y-2">
                            {adjuntos.map((file, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                                    <span className="text-lg">{getFileIcon(file)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={() => navigate('/tickets')} disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium disabled:opacity-50">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 shadow-sm">
                        {loading ? 'Guardando...' : '✓ Crear Caso'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;
