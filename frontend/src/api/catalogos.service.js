import api from '../lib/axios';

export const catalogosService = {
  getAll: () => api.get('/catalogos').then(r => r.data),
  getByDomain: (dominio) => api.get('/catalogos', { params: { dominio } }).then(r => r.data),
  create: (data) => api.post('/catalogos', data).then(r => r.data),
  update: (id, data) => api.put(`/catalogos/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/catalogos/${id}`).then(r => r.data),
};
