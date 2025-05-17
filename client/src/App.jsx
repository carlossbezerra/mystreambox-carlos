// client/src/App.jsx
import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'; // Esta é a nossa LandingPage pública
import ContentCarousel from './components/ContentCarousel'; // Importar o carrossel
import TrailerModal from './components/TrailerModal';     // Importar o modal do trailer
import { useAuth } from './context/AuthContext';
import axios from 'axios'; // Necessário para chamadas API aqui

// URL base da API de conteúdo (pode vir de um arquivo de config ou .env)
const API_CONTENT_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


// Componente para a Página Inicial quando o usuário está LOGADO
// Renomeado para HomePageLoggedIn para mais clareza
function HomePageLoggedIn() {
  const { currentUser } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [actionItems, setActionItems] = useState([]); // Exemplo de outra categoria
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [errorContent, setErrorContent] = useState('');

  const [selectedTrailer, setSelectedTrailer] = useState(null); // { url, title }

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoadingContent(true);
      setErrorContent('');
      try {
        // Buscar conteúdo para cada categoria
        // Certifique-se que os slugs 'em-destaque', 'novidades', 'acao' existem no seu DB
        const featuredResponse = await axios.get(`${API_CONTENT_URL}/content/category/em-destaque`);
        setFeaturedItems(featuredResponse.data.items || []);

        const newsResponse = await axios.get(`${API_CONTENT_URL}/content/category/novidades`);
        setNewsItems(newsResponse.data.items || []);
        
        const actionResponse = await axios.get(`${API_CONTENT_URL}/content/category/acao`);
        setActionItems(actionResponse.data.items || []);

      } catch (err) {
        console.error("Erro ao buscar conteúdo:", err);
        setErrorContent('Não foi possível carregar o conteúdo. Tente novamente mais tarde.');
      }
      setIsLoadingContent(false);
    };

    if (currentUser) { // Só busca conteúdo se o usuário estiver logado
        fetchContent();
    } else {
        setIsLoadingContent(false); // Se não há usuário, não há o que carregar
    }
  }, [currentUser]); // Dependência no currentUser para re-buscar se o usuário mudar (ou ao logar)

  const handleCardClick = (item) => {
    if (item && item.trailerUrl) {
        let embedUrl = item.trailerUrl;
        if (embedUrl.includes("watch?v=")) {
            embedUrl = embedUrl.replace("watch?v=", "embed/");
        }
        const videoIdMatch = embedUrl.match(/embed\/([^&?#]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
            embedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }
        setSelectedTrailer({ url: embedUrl, title: item.title });
    } else {
        alert("Trailer indisponível para este item.");
    }
  };

  const closeTrailerModal = () => {
    setSelectedTrailer(null);
  };

  const pageStyle = { 
    padding: '20px', 
    textAlign: 'left',
    color: 'var(--text-light)' 
  };

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

      <ContentCarousel title="Em Destaque" items={featuredItems} onCardClick={handleCardClick} />
      <ContentCarousel title="Novidades" items={newsItems} onCardClick={handleCardClick} />
      <ContentCarousel title="Ação" items={actionItems} onCardClick={handleCardClick} />
      {/* Adicione mais carrosséis para outras categorias conforme necessário */}

      {selectedTrailer && (
        <TrailerModal 
            trailerUrl={selectedTrailer.url} 
            title={selectedTrailer.title} 
            onClose={closeTrailerModal} 
        />
      )}
    </div>
  );
}

// Componente para Rotas Protegidas
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
            element={currentUser ? <HomePageLoggedIn /> : <HomePage />} /* HomePage é a LandingPage */
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
            path="/movies" // Exemplo de rota protegida
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