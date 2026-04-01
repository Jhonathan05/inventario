import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';
import { ticketsService } from '../../../api/tickets.service';
import { usuariosService } from '../../../api/usuarios.service';
import { useAuth } from '../../../context/AuthContext';

export const useTicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [tecnicoAsignado, setTecnicoAsignado] = useState('');
    const [saving, setSaving] = useState(false);
    const [archivosComentario, setArchivosComentario] = useState([]);
    const [localTicket, setLocalTicket] = useState(null);

    const { user } = useAuth();
    const canEdit = user?.rol === 'ADMIN' || user?.rol === 'ANALISTA_TIC';

    const { data: ticketData, isLoading: loading } = useQuery({
        queryKey: ['ticket', id],
        queryFn: () => ticketsService.getById(id),
        onError: () => {
            toast.error('Error al cargar el caso');
            navigate('/tickets');
        }
    });

    // Update local state when ticket data arrives
    useEffect(() => {
        if (ticketData) {
            setNuevoEstado(ticketData.estado);
            setTecnicoAsignado(ticketData.asignadoAId || '');
            setLocalTicket(ticketData);
        }
    }, [ticketData]);

    const ticket = localTicket || ticketData;

    const { data: usuariosData = [] } = useQuery({
        queryKey: ['usuarios'],
        queryFn: usuariosService.getAll,
    });
    const tecnicos = usuariosData.filter(u => u.rol !== 'CONSULTA' && u.activo);

    const refetchTicket = () => queryClient.invalidateQueries({ queryKey: ['ticket', id] });

    const handleDownload = (doc) => {
        let apiUrl = import.meta.env.VITE_API_URL || '';
        let base = '';

        if (apiUrl && !apiUrl.includes('localhost:3003')) {
            base = apiUrl.replace(/\/api$/, '');
        } else {
            base = window.location.origin;
        }

        window.open(`${base}/uploads/${doc.nombreArchivo}`, '_blank');
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setArchivosComentario(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const handleRemoveFile = (index) => {
        setArchivosComentario(prev => prev.filter((_, i) => i !== index));
    };

    const handleAgregarComentario = async (e) => {
        if (e) e.preventDefault();
        const hasComment = nuevoComentario.trim().length > 0;
        const hasFiles = archivosComentario.length > 0;

        if (!hasComment && !hasFiles) {
            toast.error('Agrega un comentario o un archivo');
            return;
        }

        setSaving(true);
        try {
            const payload = new FormData();
            payload.append('comentario', nuevoComentario || '(Sin comentario)');
            archivosComentario.forEach(f => payload.append('adjuntos', f));

            await api.post(`/tickets/${id}/comentarios`, payload);

            setNuevoComentario('');
            setArchivosComentario([]);
            toast.success('Nota añadida');
            refetchTicket();
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
            await api.put(`/tickets/${id}/estado`, { 
                nuevoEstado,
                solucionTecnica: ticket.solucionTecnica,
                conclusiones: ticket.conclusiones
            });
            toast.success('Estado actualizado');
            refetchTicket();
        } catch {
            toast.error('Error al cambiar estado');
            setNuevoEstado(ticket.estado);
        }
    };

    const handleGuardarNotasTecnicas = async () => {
        setSaving(true);
        try {
            await api.put(`/tickets/${id}/estado`, { 
                nuevoEstado: ticket.estado,
                solucionTecnica: ticket.solucionTecnica,
                conclusiones: ticket.conclusiones
            });
            toast.success('Notas técnicas guardadas');
            refetchTicket();
        } catch {
            toast.error('Error al guardar notas');
        } finally {
            setSaving(false);
        }
    };

    const handleAsignarTecnico = async () => {
        if (String(tecnicoAsignado) === String(ticket.asignadoAId || '')) return;
        try {
            await api.put(`/tickets/${id}/asignar`, { asignadoAId: tecnicoAsignado || null });
            toast.success('Analista asignado');
            refetchTicket();
        } catch {
            toast.error('Error al asignar');
            setTecnicoAsignado(ticket.asignadoAId || '');
        }
    };

    return {
        id,
        ticket,
        loading,
        user,
        canEdit,
        tecnicos,
        nuevoComentario,
        setNuevoComentario,
        nuevoEstado,
        setNuevoEstado,
        tecnicoAsignado,
        setTecnicoAsignado,
        saving,
        archivosComentario,
        localTicket,
        setLocalTicket,
        fileInputRef,
        handleDownload,
        handleFileSelect,
        handleRemoveFile,
        handleAgregarComentario,
        handleCambiarEstado,
        handleGuardarNotasTecnicas,
        handleAsignarTecnico,
        navigate
    };
};
