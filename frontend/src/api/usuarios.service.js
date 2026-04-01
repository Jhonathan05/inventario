import api from '../lib/axios';

export const usuariosService = {
  getAll: () => api.get('/usuarios').then(r => r.data),
  create: (data) => api.post('/usuarios', data).then(r => r.data),
  update: (id, data) => api.put(`/usuarios/${id}`, data).then(r => r.data),
  toggleStatus: (id) => api.patch(`/usuarios/${id}/toggle`).then(r => r.data)
};
