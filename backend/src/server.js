require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Permitir cualquier origen (necesario para acceso desde IP de LAN/móvil)
  credentials: true,
}));
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

module.exports = app;
