// server/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../../.env' }); // Garante que o .env da raiz do server seja lido

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './dev.sqlite', // Caminho para o arquivo do banco
    logging: false, // Defina como console.log para ver as queries SQL, ou false para desabilitar
});

module.exports = sequelize;