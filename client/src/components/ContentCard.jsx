// client/src/components/ContentCard.jsx
import React from 'react';

function ContentCard({ item, onCardClick }) {
    const cardStyle = {
        minWidth: '180px', // Largura mínima do cartão
        width: '180px',    // Largura fixa ou use flex-basis se preferir
        height: '270px',   // Altura do cartão (proporção comum para pôsteres)
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative', // Para posicionar o título sobreposto, se desejado
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Garante que a imagem cubra o card sem distorcer
        display: 'block',
    };

    // Estilo para o título que pode aparecer no hover (opcional)
    const titleOverlayStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px',
        textAlign: 'center',
        fontSize: '0.9rem',
        opacity: 0, // Começa invisível
        transition: 'opacity 0.3s ease',
    };

    // Simulação de hover para mostrar o título (melhor com CSS :hover em um arquivo .css)
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
        return null; // Ou um placeholder de carregamento para o card
    }

    return (
        <div 
            style={cardStyle} 
            onClick={() => onCardClick(item)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button" // Para acessibilidade
            tabIndex={0} // Para acessibilidade
            onKeyPress={(e) => e.key === 'Enter' && onCardClick(item)} // Para acessibilidade
        >
            <img src={item.posterUrl} alt={item.title} style={imageStyle} />
            <div className="title-overlay" style={titleOverlayStyle}>
                {item.title}
            </div>
        </div>
    );
}

export default ContentCard;
