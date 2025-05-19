// server/src/config/database.js
const { Sequelize } = require('sequelize');
// Carregar variáveis de ambiente. O path é relativo à localização DESTE arquivo.
// Se server.js (que está na raiz de /server) já carrega .env, esta linha pode não ser estritamente necessária aqui.
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') }); 

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './dev.sqlite', 
    logging: false, // Mude para console.log para ver as queries SQL, ou true
});

module.exports = sequelize;