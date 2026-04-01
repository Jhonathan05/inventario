require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://inventario.local'];

// Permitir cualquier IP privada de la LAN (192.168.x.x, 10.x.x.x, etc.)
const localIpRegex = /^(http:\/\/)(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || localIpRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true,
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/activos', require('./routes/activos.routes'));
app.use('/api/funcionarios', require('./routes/funcionarios.routes'));
app.use('/api/asignaciones', require('./routes/asignaciones.routes'));
app.use('/api/hojavida', require('./routes/hojaVida.routes'));
app.use('/api/documentos', require('./routes/documentos.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/reportes', require('./routes/reportes.routes'));
app.use('/api/actas', require('./routes/actas.routes'));
app.use('/api/importar', require('./routes/importar.routes'));
app.use('/api/catalogos', require('./routes/catalogos.routes'));
app.use('/api/respaldo', require('./routes/respaldo.routes'));
app.use('/api/tickets', require('./routes/ticket.routes'));
app.use('/api/alertas', require('./routes/alertas.routes'));
app.use('/api/licencias', require('./routes/licencias.routes'));


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Inicializar tareas programadas
const { startCronJobs } = require('./cron/jobs');
startCronJobs();

module.exports = app;