// client/src/components/ContentCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function ContentCard({ item }) { // Removido onCardClick daqui por enquanto
    const navigate = useNavigate(); // Hook para navegação

    const handleCardClick = () => {
        if (item && item.id) {
            // Navega para a página de detalhes do item
            // Você pode adicionar /movie/ ou /series/ se quiser diferenciar na URL,
            // mas por simplicidade, vamos usar /item/:id
            navigate(`/item/${item.id}`);
        }
    };

    // ... (seus estilos cardStyle, imageStyle, titleOverlayStyle permanecem os mesmos) ...
    const cardStyle = {
        minWidth: '180px', 
        width: '180px',    
        height: '270px',   
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        backgroundColor: 'var(--dark-bg-secondary)' // Fundo caso a imagem demore
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover', 
        display: 'block',
    };

    const titleOverlayStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: 'white',
        padding: '8px',
        textAlign: 'center',
        fontSize: '0.9rem',
        opacity: 0, 
        transition: 'opacity 0.3s ease',
        // Para garantir que o texto não quebre de forma estranha
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
    
    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
        const titleOverlay = e.currentTarget.querySelector('.title-overlay');
        if (titleOverlay) titleOverlay.style.opacity = 1;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        const titleOverlay = e.currentTarget.querySelector('.title-overlay');
        if (titleOverlay) titleOverlay.style.opacity = 0;
    };


    if (!item) {
        return null; 
    }

    return (
        <div 
            style={cardStyle} 
            onClick={handleCardClick} // Chama a navegação
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="link" // Mais apropriado semanticamente agora
            tabIndex={0} 
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick()} 
        >
            <img src={item.posterUrl} alt={item.title} style={imageStyle} loading="lazy" /> {/* Adicionado loading="lazy" */}
            <div className="title-overlay" style={titleOverlayStyle}>
                {item.title}
            </div>
        </div>
    );
}

export default ContentCard;