import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const authHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const ticketsService = {
    // Obtener todos los tickets (con filtros opcionales)
    getTickets: async (filtros = {}) => {
        const params = new URLSearchParams(filtros).toString();
        const url = params ? `${API_URL}/tickets?${params}` : `${API_URL}/tickets`;
        const response = await axios.get(url, authHeader());
        return response.data;
    },

    // Obtener un ticket por ID (incluye trazas)
    getTicketById: async (id) => {
        const response = await axios.get(`${API_URL}/tickets/${id}`, authHeader());
        return response.data;
    },

    // Crear un nuevo ticket
    createTicket: async (ticketData) => {
        const response = await axios.post(`${API_URL}/tickets`, ticketData, authHeader());
        return response.data;
    },

    // Actualizar el estado de un ticket
    updateTicketStatus: async (id, nuevoEstado, comentario) => {
        const response = await axios.put(
            `${API_URL}/tickets/${id}/estado`,
            { nuevoEstado, comentario },
            authHeader()
        );
        return response.data;
    },

    // Asignar un ticket a un analista
    assignTicket: async (id, asignadoAId, comentario) => {
        const response = await axios.put(
            `${API_URL}/tickets/${id}/asignar`,
            { asignadoAId, comentario },
            authHeader()
        );
        return response.data;
    },

    // Agregar un comentario (traza manual) al ticket
    addComment: async (id, comentario) => {
        const response = await axios.post(
            `${API_URL}/tickets/${id}/comentarios`,
            { comentario },
            authHeader()
        );
        return response.data;
    }
};
