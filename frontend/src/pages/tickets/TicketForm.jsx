import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { funcionariosService } from '../../api/funcionarios.service';
import { activosService } from '../../api/activos.service';
import { ticketsService } from '../../api/tickets.service';
import SelectWithAdd from '../../components/SelectWithAdd';
import { XMarkIcon, TagIcon, PaperClipIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const sortList = (list) => {
    return [...list].sort((a, b) => {
        const valA = (a.nombre || a.valor || a).toString().toUpperCase();
        const valB = (b.nombre || b.valor || b).toString().toUpperCase();
        return valA.localeCompare(valB);
    });
};

const TicketForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [mostrarTodosLosActivos, setMostrarTodosLosActivos] = useState(false);
    const [adjuntos, setAdjuntos] = useState([]);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        prioridad: 'MEDIA',
        tipo: 'REQUERIMIENTO',
        funcionarioId: '',
        activoId: ''
    });

    const { data: funcionariosRaw = [] } = useQuery({
        queryKey: ['funcionarios', { activo: true }],
        queryFn: () => funcionariosService.getAll({ activo: true, limit: 500 }).then(r => r.data || r),
    });
    const funcionarios = sortList(funcionariosRaw);

    const { data: activosRaw = [] } = useQuery({
        queryKey: ['activos', { limit: 500 }],
        queryFn: () => activosService.getAll({ limit: 500 }).then(r => r.data || r),
    });
    const activos = sortList(activosRaw);



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
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            toast.success('Caso creado exitosamente');
            navigate(`/tickets/${res.data.id}`);
        } catch {
            toast.error('Error al crear el caso');
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            // Si cambia el funcionario, resetear el activo o al menos forzar filtrado
            if (name === 'funcionarioId') {
                // Opcional: setMostrarTodosLosActivos(false);
            }
            return next;
        });
    };

    // Obtener cédula del funcionario seleccionado para filtrar activos
    const selectedFuncionario = funcionarios.find(f => String(f.id) === String(formData.funcionarioId));
    
    // Filtrar activos según el funcionario seleccionado o mostrar todos
    const activosMostrados = (mostrarTodosLosActivos || !formData.funcionarioId)
        ? activos
        : activos.filter(a => a.cedulaFuncionario === selectedFuncionario?.cedula);

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
                            <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                placeholder="Ej. PROBLEMA CON ACCESO AL CORREO" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select required value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                <option value="INCIDENTE">Incidente (Falla de algo existente)</option>
                                <option value="REQUERIMIENTO">Requerimiento (Solicitud nueva)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
                            <select required value={formData.prioridad} onChange={e => setFormData({ ...formData, prioridad: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                <option value="ALTA">Alta</option>
                                <option value="BAJA">Baja</option>
                                <option value="CRITICA">Crítica (Interrumpe operación)</option>
                                <option value="MEDIA">Media</option>
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
                        <SelectWithAdd
                            label="Funcionario Solicitante"
                            name="funcionarioId"
                            value={formData.funcionarioId}
                            onChange={handleFormChange}
                            options={funcionarios.map(f => ({ id: f.id, nombre: `${f.nombre} (${f.cedula})` }))}
                            required={true}
                            canAdd={false}
                            placeholder="Buscar solicitante..."
                        />
                        <div className="flex flex-col">
                            <div className="flex justify-between items-end mb-1">
                                <label className="block text-xs font-medium text-gray-600">
                                    Activo Relacionado (Opcional)
                                </label>
                                {formData.funcionarioId && (
                                    <button
                                        type="button"
                                        onClick={() => setMostrarTodosLosActivos(!mostrarTodosLosActivos)}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                                            mostrarTodosLosActivos 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                                        }`}
                                    >
                                        {mostrarTodosLosActivos ? 'VER ASIGNADOS' : 'BUSCAR GLOBAL'}
                                    </button>
                                )}
                            </div>
                            <SelectWithAdd
                                label=""
                                name="activoId"
                                value={formData.activoId}
                                onChange={handleFormChange}
                                options={[
                                    ...activosMostrados,
                                    // Asegurar que el activo ya seleccionado siempre sea visible
                                    ...(formData.activoId && !activosMostrados.find(a => String(a.id) === String(formData.activoId))
                                        ? [activos.find(a => String(a.id) === String(formData.activoId))].filter(Boolean)
                                        : [])
                                ].map(a => ({ id: a.id, nombre: `${a.placa} — ${a.marca} ${a.modelo}` }))}
                                canAdd={false}
                                placeholder={
                                    !formData.funcionarioId 
                                    ? "Selecciona un funcionario primero..." 
                                    : (activosMostrados.length === 0 ? "Sin equipos asignados" : "Seleccione equipo...")
                                }
                            />
                            <p className="mt-1 text-[10px] text-gray-500 flex items-center gap-1 px-1">
                                <TagIcon className="w-3 h-3 text-blue-400" /> 
                                {mostrarTodosLosActivos 
                                    ? "Mostrando TODOS los activos del inventario." 
                                    : (formData.funcionarioId ? `Mostrando activos de ${selectedFuncionario?.nombre}` : "Asocia un funcionario para ver sus equipos.")}
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
