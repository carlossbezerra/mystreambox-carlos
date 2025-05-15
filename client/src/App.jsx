// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// HomePage será nossa LandingPage por enquanto
import HomePage from './pages/HomePage'; 
import { useAuth } from './context/AuthContext';

// Componente para a Página Inicial quando o usuário está LOGADO
function LoggedInContent() {
  const { currentUser } = useAuth();
  return (
    <div style={{ 
        padding: '20px', 
        textAlign: 'left',
        color: 'var(--text-light)' 
    }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '20px', fontWeight: '700' }}>
        Bem-vindo à MyStreamBox, {currentUser?.name || currentUser?.email}!
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px' }}>
        Explore nossa montanha de entretenimento.
      </p>
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '20px', color: 'var(--text-light)' }}>Em Destaque</h2>
        <p style={{ color: 'var(--text-muted)' }}>(Carrossel de filmes em destaque viria aqui)</p>
        
        <h2 style={{ fontSize: '1.75rem', marginTop: '40px', marginBottom: '20px', color: 'var(--text-light)' }}>Novidades</h2>
        <p style={{ color: 'var(--text-muted)' }}>(Carrossel de novidades viria aqui)</p>
      </div>
    </div>
  );
}

// Componente para Rotas Protegidas
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) { // Mostra um loader enquanto o estado de auth é verificado
    return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}


function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar />
      {/* paddingTop deve ser igual ou maior que a altura do Navbar */}
      <main className="container" style={{ paddingTop: '85px' /* 65px navbar + 20px margem */ }}>
        <Routes>
          <Route 
            path="/" 
            element={currentUser ? <LoggedInContent /> : <HomePage />} /* HomePage serve como LandingPage */
          />
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={currentUser ? <Navigate to="/" replace /> : <RegisterPage />} 
          />
          
          {/* Exemplo de rota protegida para uma futura página de filmes */}
          <Route 
            path="/movies"
            element={
              <ProtectedRoute>
                <div style={{color: 'var(--text-light)'}}><h1>Página de Filmes (Protegida)</h1><p>Conteúdo exclusivo para assinantes.</p></div>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-light)' }}>
              <h2 style={{fontSize: '2rem'}}>404 - Página Não Encontrada</h2>
              <Link to="/" style={{color: 'var(--paramount-blue)', fontSize: '1.2rem', marginTop: '20px', display: 'inline-block'}}>Voltar para a Home</Link>
            </div>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;