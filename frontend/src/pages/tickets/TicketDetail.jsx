import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import {
    ArrowLeftIcon,
    ClockIcon,
    ChatBubbleLeftIcon,
    UserIcon,
    TagIcon,
    ComputerDesktopIcon,
    ExclamationCircleIcon,
    CalendarDaysIcon,
    PaperAirplaneIcon,
    UserPlusIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    WrenchIcon,
    PaperClipIcon,
    PrinterIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

// Helper: icon + label for file type
const getFileInfo = (tipoMime, nombre) => {
    if (!tipoMime) return { icon: '📎', color: 'text-gray-600 bg-gray-100' };
    if (tipoMime.startsWith('image/')) return { icon: '🖼️', color: 'text-purple-600 bg-purple-50' };
    if (tipoMime === 'application/pdf') return { icon: '📄', color: 'text-red-600 bg-red-50' };
    if (tipoMime.includes('word')) return { icon: '📝', color: 'text-blue-600 bg-blue-50' };
    if (tipoMime.includes('sheet') || tipoMime.includes('excel')) return { icon: '📊', color: 'text-green-600 bg-green-50' };
    return { icon: '📎', color: 'text-gray-600 bg-gray-100' };
};

// Attachment chip component
const AdjuntoChip = ({ doc, onDownload }) => {
    const { icon, color } = getFileInfo(doc.tipo, doc.nombre);
    return (
        <button
            onClick={() => onDownload(doc)}
            title={`Descargar: ${doc.nombre}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} hover:opacity-80 transition-opacity border border-current/10`}
        >
            <span>{icon}</span>
            <span className="max-w-[140px] truncate">{doc.nombre}</span>
            <ArrowDownTrayIcon className="w-3 h-3 shrink-0" />
        </button>
    );
};

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tecnicos, setTecnicos] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [tecnicoAsignado, setTecnicoAsignado] = useState('');
    const [saving, setSaving] = useState(false);
    const [archivosComentario, setArchivosComentario] = useState([]);

    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'TECNICO';

    useEffect(() => { cargarDatos(); }, [id]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [ticketRes, tecnicosRes] = await Promise.all([
                api.get(`/tickets/${id}`),
                api.get('/usuarios')
            ]);
            setTicket(ticketRes.data);
            setNuevoEstado(ticketRes.data.estado);
            setTecnicoAsignado(ticketRes.data.asignadoAId || '');
            setTecnicos(tecnicosRes.data.filter(u => u.rol !== 'CONSULTA' && u.activo));
        } catch {
            toast.error('Error al cargar el caso');
            navigate('/tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (doc) => {
        let apiUrl = import.meta.env.VITE_API_URL || '';
        let base = '';

        if (apiUrl && !apiUrl.includes('localhost:3003')) {
            base = apiUrl.replace(/\/api$/, '');
        } else {
            // En producción con Nginx, accedemos a /uploads directamente en el mismo host/puerto
            base = window.location.origin;
        }

        window.open(`${base}/uploads/${doc.nombreArchivo}`, '_blank');
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setArchivosComentario(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const handleAgregarComentario = async (e) => {
        e.preventDefault();
        const hasComment = nuevoComentario.trim().length > 0;
        const hasFiles = archivosComentario.length > 0;

        if (!hasComment && !hasFiles) {
            toast.error('Agrega un comentario o un archivo');
            return;
        }

        console.log('Enviando nota...', { id, hasComment, hasFiles });
        setSaving(true);
        try {
            const payload = new FormData();
            payload.append('comentario', nuevoComentario || '(Sin comentario)');
            archivosComentario.forEach(f => payload.append('adjuntos', f));

            await api.post(`/tickets/${id}/comentarios`, payload);
            console.log('Nota guardada con éxito');

            setNuevoComentario('');
            setArchivosComentario([]);
            toast.success('Nota añadida');
            cargarDatos();
        } catch (error) {
            console.error('Error al guardar nota:', error);
            toast.error('Error al guardar nota');
        } finally {
            setSaving(false);
        }
    };

    const handleCambiarEstado = async () => {
        if (nuevoEstado === ticket.estado) return;
        try {
            await api.put(`/tickets/${id}/estado`, { nuevoEstado });
            toast.success('Estado actualizado');
            cargarDatos();
        } catch {
            toast.error('Error al cambiar estado');
            setNuevoEstado(ticket.estado);
        }
    };

    const handleAsignarTecnico = async () => {
        if (String(tecnicoAsignado) === String(ticket.asignadoAId || '')) return;
        try {
            await api.put(`/tickets/${id}/asignar`, { asignadoAId: tecnicoAsignado || null });
            toast.success('Técnico asignado');
            cargarDatos();
        } catch {
            toast.error('Error al asignar');
            setTecnicoAsignado(ticket.asignadoAId || '');
        }
    };

    const handleEliminar = async () => {
        if (!window.confirm('¿ESTÁS COMPLETAMENTE SEGURO? Esta acción eliminará el ticket de forma permanente y NO se puede deshacer.')) return;

        try {
            setSaving(true);
            await api.delete(`/tickets/${id}`);
            toast.success('Ticket eliminado permanentemente');
            navigate('/tickets');
        } catch (err) {
            console.error(err);
            toast.error('Error al intentar eliminar el ticket');
        } finally {
            setSaving(false);
        }
    };

    const estadoBadgeColor = {
        CREADO: 'bg-gray-100 text-gray-700 border-gray-200',
        EN_CURSO: 'bg-blue-100 text-blue-700 border-blue-200',
        SIN_RESPUESTA: 'bg-red-100 text-red-700 border-red-200',
        COMPLETADO: 'bg-green-100 text-green-700 border-green-200'
    };

    const prioridadColor = {
        BAJA: 'bg-gray-100 text-gray-700',
        MEDIA: 'bg-blue-100 text-blue-700',
        ALTA: 'bg-orange-100 text-orange-700',
        CRITICA: 'bg-red-100 text-red-800 font-bold'
    };

    const getTrazaIcon = (tipo) => {
        switch (tipo) {
            case 'CREACION': return <TagIcon className="w-3.5 h-3.5 text-gray-500" />;
            case 'CAMBIO_ESTADO': return <ExclamationCircleIcon className="w-3.5 h-3.5 text-orange-500" />;
            case 'ASIGNACION': return <UserPlusIcon className="w-3.5 h-3.5 text-blue-500" />;
            default: return <ChatBubbleLeftIcon className="w-3.5 h-3.5 text-emerald-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }
    if (!ticket) return <div className="p-8 text-center text-red-500">Ticket no encontrado</div>;

    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Encabezado ---
        doc.setFontSize(20);
        doc.setTextColor(30, 58, 138); // Blue 800
        doc.text("REPORTE DE SOPORTE TÉCNICO", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Sistema de Gestión de Inventario", 14, 28);
        doc.text(`Generado: ${new Date().toLocaleString()}`, pageWidth - 14, 28, { align: 'right' });

        doc.setLineWidth(0.5);
        doc.setDrawColor(30, 58, 138);
        doc.line(14, 32, pageWidth - 14, 32);

        // --- Información General ---
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Ticket #${ticket.id}: ${ticket.titulo}`, 14, 42);

        const infoGeneral = [
            ["Estado", ticket.estado, "Prioridad", ticket.prioridad],
            ["Tipo", ticket.tipo, "Fecha Creación", new Date(ticket.creadoEn).toLocaleString()],
            ["Solicitante", ticket.funcionario?.nombre || 'N/A', "Área", ticket.funcionario?.area || 'N/A'],
            ["Activo", ticket.activo ? `${ticket.activo.placa} (${ticket.activo.marca} ${ticket.activo.modelo})` : 'Ninguno', "Responsable", ticket.asignadoA?.nombre || 'Sin asignar']
        ];

        autoTable(doc, {
            startY: 48,
            body: infoGeneral,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', fillColor: [243, 244, 246], cellWidth: 30 },
                2: { fontStyle: 'bold', fillColor: [243, 244, 246], cellWidth: 30 }
            }
        });

        // --- Descripción ---
        let currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Descripción del Problema:", 14, currentY);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        const splitDesc = doc.splitTextToSize(ticket.descripcion, pageWidth - 28);
        doc.text(splitDesc, 14, currentY + 7);
        currentY += (splitDesc.length * 5) + 15;

        // --- Trazabilidad (Timeline) ---
        if (ticket.trazas && ticket.trazas.length > 0) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text("Historial de Trazabilidad:", 14, currentY);

            const trazasBody = ticket.trazas.map(t => [
                new Date(t.creadoEn).toLocaleString(),
                t.creadoPor?.nombre || 'Sistema',
                t.tipoTraza,
                t.comentario
            ]);

            autoTable(doc, {
                startY: currentY + 5,
                head: [['Fecha', 'Usuario', 'Acción', 'Comentario']],
                body: trazasBody,
                theme: 'striped',
                headStyles: { fillColor: [30, 58, 138] }, // Blue 800 institucional
                styles: { fontSize: 8 }
            });
            currentY = doc.lastAutoTable.finalY + 10;
        }

        // --- Mantenimientos Relacionados ---
        if (ticket.hojaVida && ticket.hojaVida.length > 0) {
            if (currentY + 30 > doc.internal.pageSize.getHeight()) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text("Historial de Mantenimientos (Hoja de Vida):", 14, currentY);
            currentY += 7;

            ticket.hojaVida.forEach((h, index) => {
                const hBody = [[
                    new Date(h.fecha).toLocaleDateString(),
                    h.tipo,
                    h.descripcion,
                    h.responsable?.nombre || 'N/A',
                    h.diagnostico || '-'
                ]];

                autoTable(doc, {
                    startY: currentY,
                    head: index === 0 ? [['Fecha', 'Tipo', 'Descripción', 'Técnico', 'Diagnóstico']] : false,
                    body: hBody,
                    theme: 'grid',
                    headStyles: { fillColor: [30, 58, 138] }, // Blue 800 institucional
                    styles: { fontSize: 8, cellPadding: 2 }
                });
                currentY = doc.lastAutoTable.finalY;

                // Agregar Bitácora de Avances de este mantenimiento
                if (h.trazas && h.trazas.length > 0) {
                    const trazasHV = h.trazas.map(t => [
                        `  >> ${new Date(t.fecha).toLocaleString()}`,
                        `${t.estadoNuevo}: ${t.observacion} (${t.usuario?.nombre || 'Sist.'})`
                    ]);

                    autoTable(doc, {
                        startY: currentY,
                        body: trazasHV,
                        theme: 'plain',
                        styles: { fontSize: 7.5, fontStyle: 'italic', cellPadding: 1.5, textColor: [75, 85, 99] }, // Gray 600
                        columnStyles: {
                            0: { cellWidth: 40 },
                            1: { cellWidth: 'auto' }
                        }
                    });
                    currentY = doc.lastAutoTable.finalY + 4;
                } else {
                    currentY += 4;
                }

                // Salto de página preventivo
                if (currentY + 25 > doc.internal.pageSize.getHeight()) {
                    doc.addPage();
                    currentY = 20;
                }
            });
        }

        // --- Pie de página ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Pag. ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        doc.save(`Ticket_${ticket.id}_Reporte.pdf`);
    };

    return (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

            {/* Header / Logo (Only Print) */}
            <div className="print-only header-logo">
                <div className="flex flex-col">
                    <h1>REPORTE DE SOPORTE TÉCNICO</h1>
                    <p className="text-sm">Sistema de Gestión de Inventario y Mesa de Ayuda</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Ticket ID: #{ticket.id}</p>
                    <p className="text-xs">Generado: {new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
                <button
                    onClick={() => navigate('/tickets')}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    <span>Volver</span>
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={exportToPDF}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                    >
                        <PrinterIcon className="h-4 w-4 mr-2" />
                        Exportar PDF
                    </button>
                    {canEdit && (
                        <button
                            onClick={() => navigate(`/tickets/editar/${id}`)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-all"
                        >
                            <TagIcon className="h-4 w-4 mr-2" />
                            Editar
                        </button>
                    )}
                    {user?.rol === 'ADMIN' && (
                        <button
                            onClick={handleEliminar}
                            className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 shadow-sm transition-all"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Eliminar Caso
                        </button>
                    )}
                </div>
            </div>
            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <button onClick={() => navigate('/tickets')} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 no-print">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900">Caso #{ticket.id}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${estadoBadgeColor[ticket.estado] || estadoBadgeColor.CREADO}`}>
                            {ticket.estado.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${prioridadColor[ticket.prioridad]}`}>
                            {ticket.prioridad}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{ticket.titulo}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel Izquierdo: Info */}
                <div className="space-y-4">
                    {/* Detalles */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Detalles</h3>
                        <div>
                            <span className="text-xs font-medium text-gray-500 block mb-0.5">Tipo</span>
                            <span className="text-sm font-semibold text-gray-900">{ticket.tipo}</span>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-500 block mb-0.5">Creado</span>
                            <div className="flex items-center text-sm text-gray-900 gap-1">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                                {new Date(ticket.creadoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                            </div>
                        </div>
                        {ticket.cerradoEn && (
                            <div>
                                <span className="text-xs font-medium text-gray-500 block mb-0.5">Cerrado</span>
                                <span className="text-sm text-green-700">{new Date(ticket.cerradoEn).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-xs font-medium text-gray-500 block mb-1">Descripción</span>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border leading-relaxed">{ticket.descripcion}</p>
                        </div>
                    </div>

                    {/* Evidencias Iniciales del Ticket */}
                    {ticket.adjuntos && ticket.adjuntos.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-3 flex items-center gap-1.5">
                                <PaperClipIcon className="w-3.5 h-3.5" /> Evidencias ({ticket.adjuntos.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {ticket.adjuntos.map(doc => (
                                    <AdjuntoChip key={doc.id} doc={doc} onDownload={handleDownload} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Involucrados */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Involucrados</h3>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Solicitante</span>
                                <p className="text-sm font-semibold text-gray-900">{ticket.funcionario?.nombre}</p>
                                <p className="text-xs text-gray-500">{ticket.funcionario?.area || 'Sin área'}</p>
                            </div>
                        </div>
                        {ticket.activo && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                    <ComputerDesktopIcon className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Activo Vinculado</span>
                                    <p className="text-sm font-semibold text-gray-900">{ticket.activo.placa}</p>
                                    <p className="text-xs text-gray-500">{ticket.activo.marca} {ticket.activo.modelo}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gestión */}
                    {canEdit && (
                        <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-5 space-y-4 no-print">
                            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Gestión del Caso</h3>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Técnico Asignado</label>
                                <div className="flex gap-2">
                                    <select value={tecnicoAsignado} onChange={e => setTecnicoAsignado(e.target.value)}
                                        className="flex-1 text-sm border border-gray-200 rounded-md shadow-sm bg-white focus:ring-blue-500">
                                        <option value="">-- Sin Asignar --</option>
                                        {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                    </select>
                                    <button onClick={handleAsignarTecnico}
                                        disabled={String(tecnicoAsignado) === String(ticket.asignadoAId || '')}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                        Asignar
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Estado del Caso</label>
                                <div className="flex gap-2">
                                    <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}
                                        className="flex-1 text-sm border border-gray-200 rounded-md shadow-sm bg-white focus:ring-blue-500">
                                        <option value="CREADO">Creado</option>
                                        <option value="EN_CURSO">En Curso</option>
                                        <option value="SIN_RESPUESTA">Sin Respuesta</option>
                                        <option value="COMPLETADO">Completado</option>
                                    </select>
                                    <button onClick={handleCambiarEstado} disabled={nuevoEstado === ticket.estado}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                        Actualizar
                                    </button>
                                </div>
                            </div>
                            {canEdit && ticket.activoId && (
                                <div className="pt-2">
                                    <Link
                                        to={`/activos/${ticket.activoId}?ticketId=${ticket.id}`}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <WrenchIcon className="h-4 w-4 mr-2" />
                                        Registrar Mantenimiento
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mantenimientos Asociados (Hoja de Vida) */}
                    {ticket.hojaVida && ticket.hojaVida.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 mt-6">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
                                <WrenchIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <h3 className="text-sm font-semibold text-gray-900">Mantenimientos Asociados</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {ticket.hojaVida.map((hv) => (
                                    <div key={hv.id} className="p-3 border border-blue-50 bg-blue-50/30 rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 uppercase">
                                                {hv.tipo}
                                            </span>
                                            <span className="text-[10px] text-gray-400">{new Date(hv.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{hv.descripcion}</p>
                                        {hv.diagnostico && (
                                            <p className="mt-1 text-[10px] text-gray-500 italic">Diag: {hv.diagnostico}</p>
                                        )}
                                        <div className="mt-2 flex justify-between items-center text-[10px] text-gray-400">
                                            <span>Por: {hv.responsable?.nombre || 'N/A'}</span>
                                            <Link to={`/activos/${ticket.activoId}#hojavida`} className="text-blue-500 hover:underline no-print">Ver más</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Panel Derecho: Timeline */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                        <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-gray-400" /> Trazabilidad del Caso
                        </h2>

                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 max-h-[500px] overflow-y-auto pr-2 pb-2">
                            {ticket.trazas?.length === 0 && (
                                <p className="pl-6 text-sm text-gray-400 italic">Sin historial.</p>
                            )}
                            {ticket.trazas?.map((traza, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute -left-2.5 top-0.5 bg-white border-2 border-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
                                        {getTrazaIcon(traza.tipoTraza)}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                        <span className="font-semibold text-sm text-gray-900">{traza.creadoPor?.nombre || 'Sistema'}</span>
                                        <time className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(traza.creadoEn).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </div>
                                    <div className={`mt-1.5 text-sm text-gray-700 ${traza.tipoTraza === 'COMENTARIO' ? 'bg-gray-50 p-3 rounded-lg border' : ''}`}>
                                        {traza.comentario}
                                    </div>
                                    {traza.tipoTraza === 'CAMBIO_ESTADO' && traza.estadoAnterior && (
                                        <div className="mt-1 flex items-center gap-2 text-xs font-medium">
                                            <span className="text-gray-400 line-through">{traza.estadoAnterior}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className="text-blue-600">{traza.estadoNuevo}</span>
                                        </div>
                                    )}
                                    {/* Adjuntos de la traza */}
                                    {traza.adjuntos && traza.adjuntos.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {traza.adjuntos.map(doc => (
                                                <AdjuntoChip key={doc.id} doc={doc} onDownload={handleDownload} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Añadir Comentario con adjuntos */}
                    {canEdit && (
                        <form onSubmit={handleAgregarComentario} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden no-print">
                            <div className="p-4">
                                <textarea
                                    rows="2"
                                    value={nuevoComentario}
                                    onChange={e => setNuevoComentario(e.target.value)}
                                    placeholder="Añade una actualización o nota sobre este caso..."
                                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 text-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                />

                                {/* Preview de archivos a adjuntar */}
                                {archivosComentario.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2 px-4">
                                        {archivosComentario.map((f, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 border border-blue-100">
                                                <PaperClipIcon className="w-3 h-3" />
                                                <span className="max-w-[120px] truncate">{f.name}</span>
                                                <button type="button" onClick={() => setArchivosComentario(prev => prev.filter((_, j) => j !== i))}
                                                    className="ml-0.5 text-blue-400 hover:text-red-500">
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action bar */}
                            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                        onChange={handleFileSelect} className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                                        <PaperClipIcon className="w-4 h-4" />
                                        Adjuntar archivo
                                    </button>
                                </div>
                                <button type="submit" disabled={(nuevoComentario.trim().length === 0 && archivosComentario.length === 0) || saving}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                                    <PaperAirplaneIcon className="w-4 h-4" />
                                    {saving ? 'Enviando...' : 'Enviar Nota'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
