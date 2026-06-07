const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', apiRoutes);

// Rutas de interfaz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Iniciar servidor
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 CWL MVP Analyzer running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🔐 API Token configured: ${config.CLASH_API_TOKEN ? '✓' : '✗'}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
