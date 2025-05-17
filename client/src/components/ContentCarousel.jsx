// client/src/components/ContentCarousel.jsx
import React from 'react';
import ContentCard from './ContentCard';

function ContentCarousel({ title, items, onCardClick }) {
    const carouselContainerStyle = {
        marginBottom: '40px', // Espaço entre os carrosséis
    };

    const titleStyle = {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: 'var(--text-light)',
        marginBottom: '20px', // Espaço entre o título e os cartões
        paddingLeft: '10px', // Pequeno padding para alinhar com os cartões se eles tiverem margem
    };

    const scrollableRowStyle = {
        display: 'flex',
        overflowX: 'auto', // Habilita o scroll horizontal
        paddingBottom: '15px', // Espaço para a barra de rolagem não sobrepor os cards
        gap: '15px', // Espaço entre os cartões
        // Para esconder a barra de rolagem visualmente (mas ainda funcional)
        // Isso pode variar entre navegadores
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none',  /* Internet Explorer 10+ */
    };
    
    // Estilo para a barra de rolagem no Chrome, Edge, Safari
    // É mais complexo e geralmente requer um seletor global,
    // então vamos omitir por simplicidade dos estilos inline,
    // mas você pode adicionar isso ao seu index.css:
    /*
    .scrollable-row::-webkit-scrollbar {
        display: none; // Para Chrome, Safari, Edge
    }
    */

    if (!items || items.length === 0) {
        // return <p style={{color: 'var(--text-muted)', paddingLeft: '10px'}}>Nenhum item disponível nesta categoria.</p>;
        return null; // Ou não renderiza nada se não houver itens
    }

    return (
        <div style={carouselContainerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <div style={scrollableRowStyle} className="scrollable-row"> {/* Adicionada classe para estilização global da scrollbar */}
                {items.map(item => (
                    <ContentCard 
                        key={item.id} 
                        item={item} 
                        onCardClick={onCardClick} 
                    />
                ))}
            </div>
        </div>
    );
}

export default ContentCarousel;