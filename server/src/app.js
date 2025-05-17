// server/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // Adicionado para servir arquivos estáticos
const authRoutes = require('./routes/authRoutes');      // MANTENHA APENAS UMA DESTAS
const contentRoutes = require('./routes/contentRoutes'); 

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Rotas da API
// A rota raiz '/' será tratada pela seção de servir arquivos estáticos abaixo em produção,
// ou mostrará uma mensagem de API em desenvolvimento se o build do cliente não for encontrado.
// app.get('/', (req, res) => { // Comentado ou removido se o '*' do static serve for o fallback principal
//     res.send('Welcome to MyStreamBox API!');
// });

app.use('/api/auth', authRoutes); // MANTENHA APENAS UMA DESTAS
app.use('/api/content', contentRoutes);

// Servir arquivos estáticos do front-end React em produção/teste
// Esta seção deve vir DEPOIS das suas rotas de API
if (process.env.NODE_ENV === 'production' || true) { // Mantenha true para testar localmente também
    const clientBuildPath = path.resolve(__dirname, '../../client/dist');
    const fs = require('fs');

    if (fs.existsSync(clientBuildPath)) {
        console.log(`INFO: Serving static files from: ${clientBuildPath}`);
        app.use(express.static(clientBuildPath));

        // Para qualquer outra rota não tratada pela API, servir o index.html do cliente
        // Isso permite que o React Router lide com o roteamento no lado do cliente
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(clientBuildPath, 'index.html'));
        });
    } else {
        console.warn(`WARNING: Client build path not found: ${clientBuildPath}`);
        console.warn('Make sure to build the client app (npm run build in client folder) if you expect the backend to serve it.');
        // Em modo de desenvolvimento, se o build do cliente não for encontrado, é normal
        // pois o Vite serve o cliente em uma porta separada.
        // Adicionamos uma rota raiz de fallback para indicar que a API está funcionando.
        app.get('/', (req, res) => {
            res.send('MyStreamBox API is running. Client build not served by backend in this mode or path not found.');
        });
    }
}

module.exports = app;