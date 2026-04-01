import api from '../lib/axios';

export const licenciasService = {
    getAll: async (params) => {
        const res = await api.get('/licencias', { params });
        return res.data;
    },
    
    getById: async (id) => {
        const res = await api.get(`/licencias/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post('/licencias', data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/licencias/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/licencias/${id}`);
        return res.data;
    }
};
