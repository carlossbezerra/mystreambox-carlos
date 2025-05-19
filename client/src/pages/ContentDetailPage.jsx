// client/src/pages/ContentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TrailerModal from '../components/TrailerModal'; // Reutilizar o modal do trailer
import { useAuth } from '../context/AuthContext'; // Para verificar se está logado para botão "Minha Lista" etc.

const API_CONTENT_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function ContentDetailPage() {
    const { itemId } = useParams(); // Pega o itemId da URL
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const navigate = useNavigate();
    // const { currentUser } = useAuth(); // Para funcionalidades futuras como "Adicionar à Minha Lista"

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`${API_CONTENT_URL}/content/item/${itemId}`);
                setItem(response.data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do item:", err);
                setError('Não foi possível carregar os detalhes do item. Pode ser que não exista ou ocorreu um erro.');
                if (err.response && err.response.status === 404) {
                    // Opcional: Redirecionar para página 404 se o item não for encontrado
                    // navigate('/404', { replace: true });
                }
            }
            setLoading(false);
        };

        if (itemId) {
            fetchItemDetails();
        }
    }, [itemId, navigate]);

    const handleOpenTrailer = () => {
        if (item && item.trailerUrl) {
            setShowTrailerModal(true);
        } else {
            alert("Trailer indisponível para este item.");
        }
    };

    const handleCloseTrailer = () => {
        setShowTrailerModal(false);
    };

    // Estilos (mantenha simples ou mova para CSS)
    const pageStyle = {
        padding: '20px',
        color: 'var(--text-light)',
        maxWidth: '1000px',
        margin: '0 auto',
    };
    const detailContainerStyle = {
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap', // Para telas menores
    };
    const posterStyle = {
        width: '300px',
        height: '450px',
        objectFit: 'cover',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    };
    const infoStyle = {
        flex: 1,
        minWidth: '300px', // Para quebra em telas menores
    };
    const titleStyle = { fontSize: '2.5rem', marginBottom: '10px', fontWeight: 'bold' };
    const descriptionStyle = { lineHeight: '1.7', marginBottom: '20px', color: 'var(--text-muted)' };
    const metaInfoStyle = { marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' };
    const buttonStyle = {
        padding: '12px 25px',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'var(--paramount-blue)',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '15px',
        marginBottom: '15px',
    };
     const backButtonStyle = {
        display: 'inline-block',
        marginBottom: '30px',
        color: 'var(--paramount-blue)',
        textDecoration: 'none',
        fontWeight: 'bold'
    };


    if (loading) {
        return <div style={{...pageStyle, textAlign: 'center', fontSize: '1.2rem'}}>Carregando detalhes...</div>;
    }

    if (error) {
        return (
            <div style={{...pageStyle, textAlign: 'center', color: '#ff4d4f'}}>
                <p>{error}</p>
                <Link to="/" style={backButtonStyle}>Voltar para a Home</Link>
            </div>
        );
    }

    if (!item) {
        // Isso pode não ser alcançado se o erro 404 já foi tratado, mas é uma segurança
        return <div style={{...pageStyle, textAlign: 'center'}}>Item não encontrado.</div>;
    }

    // Formatar URL do trailer para embed (lógica duplicada do App.jsx, idealmente seria um helper)
    let embedTrailerUrl = item.trailerUrl;
    if (embedTrailerUrl) {
        if (embedTrailerUrl.includes("watch?v=")) {
            embedTrailerUrl = embedTrailerUrl.replace("watch?v=", "embed/");
        }
        const videoIdMatch = embedTrailerUrl.match(/embed\/([^&?#]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
            embedTrailerUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        } else if (embedTrailerUrl.includes("youtu.be/")) {
             const videoId = embedTrailerUrl.split('youtu.be/')[1].split('?')[0].split('&')[0];
            embedTrailerUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (!embedTrailerUrl.includes("/embed/")) {
            console.warn("Formato de URL do trailer não é de embed direto na página de detalhes:", item.trailerUrl);
            embedTrailerUrl = null; // Define como null se não conseguir converter
        }
    }


    return (
        <div style={pageStyle}>
            <Link to="/" style={backButtonStyle}>← Voltar para a Home</Link>
            <div style={detailContainerStyle}>
                <img src={item.posterUrl} alt={item.title} style={posterStyle} />
                <div style={infoStyle}>
                    <h1 style={titleStyle}>{item.title}</h1>
                    <p style={metaInfoStyle}>
                        {item.contentType === 'movie' ? 'Filme' : 'Série'} 
                        {item.releaseYear && ` • ${item.releaseYear}`}
                        {item.Category && ` • ${item.Category.name}`}
                    </p>
                    <p style={descriptionStyle}>{item.description || "Descrição não disponível."}</p>
                    <div>
                        <button onClick={handleOpenTrailer} style={buttonStyle} disabled={!embedTrailerUrl}>
                            Assistir Trailer
                        </button>
                        <button style={{...buttonStyle, backgroundColor: '#555'}} disabled>
                            Assistir Agora (Em breve)
                        </button>
                        {/* Botão "Adicionar à Minha Lista" (requer currentUser e lógica) */}
                        {/* {currentUser && <button style={buttonStyle}>+ Minha Lista</button>} */}
                    </div>
                </div>
            </div>

            {showTrailerModal && embedTrailerUrl && (
                <TrailerModal
                    trailerUrl={embedTrailerUrl}
                    title={item.title}
                    onClose={handleCloseTrailer}
                />
            )}
        </div>
    );
}

export default ContentDetailPage;