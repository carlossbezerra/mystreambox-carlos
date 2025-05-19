// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'; 
import ContentCarousel from './components/ContentCarousel';
// TrailerModal não é mais importado aqui se ele só é usado em ContentDetailPage
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import ContentDetailPage from './pages/ContentDetailPage';

const API_CONTENT_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function HomePageLoggedIn() {
  const { currentUser } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [dramaItems, setDramaItems] = useState([]);
  const [comedyItems, setComedyItems] = useState([]);
  const [terrorItems, setTerrorItems] = useState([]);
  const [aventuraItems, setAventuraItems] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [errorContent, setErrorContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoadingContent(true);
      setErrorContent('');
      try {
        const responses = await Promise.all([
            axios.get(`${API_CONTENT_URL}/content/category/em-destaque`),
            axios.get(`${API_CONTENT_URL}/content/category/novidades`),
            axios.get(`${API_CONTENT_URL}/content/category/acao`),
            axios.get(`${API_CONTENT_URL}/content/category/drama`),
            axios.get(`${API_CONTENT_URL}/content/category/comedia`),
            axios.get(`${API_CONTENT_URL}/content/category/terror`),
            axios.get(`${API_CONTENT_URL}/content/category/aventura`)
        ]);

        const [featuredRes, newsRes, actionRes, dramaRes, comedyRes, terrorRes, aventuraRes] = responses;

        setFeaturedItems(featuredRes.data.items || []);
        setNewsItems(newsRes.data.items || []);
        setActionItems(actionRes.data.items || []);
        setDramaItems(dramaRes.data.items || []);
        setComedyItems(comedyRes.data.items || []);
        setTerrorItems(terrorRes.data.items || []);
        setAventuraItems(aventuraRes.data.items || []);

      } catch (err) {
        console.error("Erro ao buscar conteúdo:", err.response ? err.response.data : err.message);
        setErrorContent('Não foi possível carregar o conteúdo. Tente novamente mais tarde.');
      }
      setIsLoadingContent(false);
    };

    if (currentUser) {
        fetchContent();
    } else {
        setIsLoadingContent(false);
    }
  }, [currentUser]);

  const pageStyle = { 
    padding: '20px', 
    textAlign: 'left',
    color: 'var(--text-light)' 
  };

  // CORREÇÃO APLICADA AQUI: Removidos os comentários de dentro das condições
  if (isLoadingContent) { 
    return <div style={{...pageStyle, textAlign: 'center', fontSize: '1.2rem', marginTop: '50px'}}>Carregando conteúdo...</div>;
  }

  if (errorContent) { 
    return <div style={{...pageStyle, textAlign: 'center', color: '#ff4d4f', marginTop: '50px'}}>{errorContent}</div>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '30px', fontWeight: '700' }}>
        Bem-vindo à MyStreamBox, {currentUser?.name || currentUser?.email}!
      </h1>

      <ContentCarousel title="Em Destaque" items={featuredItems} />
      <ContentCarousel title="Novidades" items={newsItems} />
      <ContentCarousel title="Ação" items={actionItems} />
      <ContentCarousel title="Drama" items={dramaItems} />
      <ContentCarousel title="Comédia" items={comedyItems} />
      <ContentCarousel title="Terror" items={terrorItems} />
      <ContentCarousel title="Aventura" items={aventuraItems} />
    </div>
  );
}

// ... (Resto do App.jsx: ProtectedRoute, function App(), export default App;) ...
// Certifique-se que o resto do App.jsx está correto como na nossa última versão funcional dele.
// Vou incluir o App completo abaixo para garantir.

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: 'var(--text-light)' }}>Carregando autenticação...</div>;
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
      <main className="container" style={{ paddingTop: '85px' }}>
        <Routes>
          <Route 
            path="/" 
            element={currentUser ? <HomePageLoggedIn /> : <HomePage />} 
          />
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={currentUser ? <Navigate to="/" replace /> : <RegisterPage />} 
          />
          <Route 
            path="/item/:itemId" 
            element={
              <ProtectedRoute>
                <ContentDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/movies"
            element={
              <ProtectedRoute>
                <div style={{color: 'var(--text-light)', padding: '20px'}}>
                  <h1>Página de Filmes (Protegida)</h1>
                  <p>Aqui listaria todos os filmes para usuários logados.</p>
                </div>
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