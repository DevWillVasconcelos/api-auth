const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const swaggerSpecs = require('../swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/v1', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API de Autenticacao',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/v1/register',
      login: 'POST /api/v1/login',
      profile: 'GET /api/v1/me',
      updateProfile: 'PUT /api/v1/me',
      deleteProfile: 'DELETE /api/v1/me'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota nao encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

module.exports = app;