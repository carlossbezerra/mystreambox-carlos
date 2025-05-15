// server/server.js
require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sincronizar modelos com o banco de dados
        // CUIDADO: { force: true } apaga e recria as tabelas. Use com cautela em produção.
        // Para desenvolvimento inicial, pode ser útil.
        await sequelize.sync({ force: false }); // Mude para true se quiser recriar tabelas
        console.log('All models were synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database or start server:', error);
    }
}

startServer();