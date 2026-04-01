import api from '../lib/axios';

export const ticketsService = {
  // Obtener todos los tickets (con filtros opcionales)
  getAll: (params = {}) => api.get('/tickets', { params }).then(r => r.data),

  // Obtener un ticket por ID (incluye trazas)
  getById: (id) => api.get(`/tickets/${id}`).then(r => r.data),

  // Crear un nuevo ticket
  create: (data) => api.post('/tickets', data).then(r => r.data),

  // Actualizar el estado de un ticket
  updateStatus: (id, nuevoEstado, comentario) =>
    api.put(`/tickets/${id}/estado`, { nuevoEstado, comentario }).then(r => r.data),

  // Asignar un ticket a un analista
  assign: (id, asignadoAId, comentario) =>
    api.put(`/tickets/${id}/asignar`, { asignadoAId, comentario }).then(r => r.data),

  // Agregar un comentario (traza manual) al ticket
  addComment: (id, comentario) =>
    api.post(`/tickets/${id}/comentarios`, { comentario }).then(r => r.data),
};
