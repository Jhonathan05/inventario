import api from '../lib/axios';

export const activosService = {
  getAll: (params) => api.get('/activos', { params }).then(r => r.data),
  getById: (id) => api.get(`/activos/${id}`).then(r => r.data),
  create: (data) => api.post('/activos', data).then(r => r.data),
  update: (id, data) => api.put(`/activos/${id}`, data).then(r => r.data),
  darBaja: (id, motivo) => api.post(`/activos/${id}/baja`, { motivo }).then(r => r.data),
  getHistorialByFuncionario: (funcionarioId) => api.get(`/activos/historial/${funcionarioId}`).then(r => r.data),
  // Dashboard indicators
  getResumen: () => api.get('/activos/resumen').then(r => r.data)
};
