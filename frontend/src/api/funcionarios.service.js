import api from '../lib/axios';

export const funcionariosService = {
  getAll: (params) => api.get('/funcionarios', { params }).then(r => r.data),
  getById: (id) => api.get(`/funcionarios/${id}`).then(r => r.data),
  create: (data) => api.post('/funcionarios', data).then(r => r.data),
  update: (id, data) => api.put(`/funcionarios/${id}`, data).then(r => r.data),
  getOptions: () => api.get('/funcionarios/opciones').then(r => r.data),
};
