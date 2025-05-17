// client/src/components/TrailerModal.jsx
import React from 'react';

function TrailerModal({ trailerUrl, title, onClose }) {
    if (!trailerUrl) {
        return null;
    }

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000, // Sobrepor tudo
    };

    const modalContentStyle = {
        backgroundColor: 'var(--dark-bg)', // Ou #000 para um modal bem escuro
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
        width: '90%',
        maxWidth: '800px', // Largura máxima do vídeo
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'transparent',
        border: 'none',
        color: 'var(--text-light)',
        fontSize: '1.8rem',
        cursor: 'pointer',
        lineHeight: '1'
    };

    const titleStyle = {
        color: 'var(--text-light)',
        marginBottom: '15px',
        fontSize: '1.5rem',
        textAlign: 'center'
    };

    const iframeContainerStyle = {
        position: 'relative',
        paddingBottom: '56.25%', // Proporção 16:9
        height: 0,
        overflow: 'hidden',
    };

    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}> {/* Clicar fora fecha o modal */}
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}> {/* Impede que o clique no conteúdo feche */}
                <button style={closeButtonStyle} onClick={onClose} aria-label="Fechar trailer">×</button>
                <h3 style={titleStyle}>{title} - Trailer</h3>
                <div style={iframeContainerStyle}>
                    <iframe
                        style={iframeStyle}
                        src={trailerUrl} // Ex: "https://www.youtube.com/embed/VIDEO_ID"
                        title={`${title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default TrailerModal;