// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Importe o AuthProvider
import './index.css'; // Se você tiver um CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolve com BrowserRouter para habilitar rotas */}
      <AuthProvider> {/* Envolve com AuthProvider para estado de autenticação */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);