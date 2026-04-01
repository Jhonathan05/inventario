import api from '../lib/axios';

export const categoriasService = {
  getAll: () => api.get('/categorias').then(r => r.data),
  create: (data) => api.post('/categorias', data).then(r => r.data),
  update: (id, data) => api.put(`/categorias/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/categorias/${id}`).then(r => r.data)
};
