const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();

const app = express();

// Configuração CORS completa
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/v1', authRoutes);

// Rota para servir o front-end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB e iniciar servidor
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('✓ MongoDB conectado com sucesso');
    console.log(`  Database: ${mongoose.connection.name}`);
    
    app.listen(PORT, () => {
        console.log(`\n✓ Servidor rodando na porta ${PORT}`);
        console.log(`  Front-end: http://localhost:${PORT}`);
        console.log(`  API: http://localhost:${PORT}/api/v1`);
        console.log(`\n  Para testar:`);
        console.log(`  Registrar: POST http://localhost:${PORT}/api/v1/register`);
        console.log(`  Login: POST http://localhost:${PORT}/api/v1/login`);
        console.log(`\n  Acesse: http://localhost:${PORT}/register.html`);
    });
})
.catch(err => {
    console.error('✗ Erro ao conectar MongoDB:', err.message);
    console.log('\nSoluções:');
    console.log('1. Execute: mongod --dbpath C:\\data\\db');
    console.log('2. Ou use MongoDB Atlas');
    process.exit(1);
});