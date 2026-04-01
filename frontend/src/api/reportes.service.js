import api from '../lib/axios';

export const reportesService = {
  getConteo: (tipo) => api.get(`/reportes/conteo?tipo=${tipo}`).then(r => r.data),
  getGarantiasPoproximas: () => api.get('/reportes/garantias-proximas').then(r => r.data),
  getMantenimientosAtrasados: () => api.get('/reportes/mantenimientos-atrasados').then(r => r.data),
  // ... other exported reportes if needed
};
