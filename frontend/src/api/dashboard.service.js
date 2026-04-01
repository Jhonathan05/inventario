import api from '../lib/axios';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then(r => r.data),
  getRecentActivity: () => api.get('/dashboard/actividad-reciente').then(r => r.data)
};
