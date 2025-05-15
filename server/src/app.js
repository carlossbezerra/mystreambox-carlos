// server/src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Criaremos este arquivo depois

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Para parsear corpo de requisições JSON
app.use(express.urlencoded({ extended: true })); // Para parsear corpo de requisições URL-encoded

// Rotas da API
app.get('/', (req, res) => {
    res.send('Welcome to MyStreamBox API!');
});
app.use('/api/auth', authRoutes); // Rotas de autenticação

// TODO: Adicionar outras rotas (conteúdo, etc.)

module.exports = app;