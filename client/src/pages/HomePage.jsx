// client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 85px)', // Considerando 85px de paddingTop do App.jsx
        textAlign: 'center',
        padding: '40px 20px',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-light)',
        // Imagem de fundo com gradiente sobreposto
        backgroundImage: 'linear-gradient(to bottom, rgba(16, 16, 18, 0.6) 0%, rgba(16, 16, 18, 0.9) 70%, var(--dark-bg) 100%), url("/hero-background.jpg")', // Substitua hero-background.jpg pelo nome da sua imagem
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
    };

    const titleStyle = {
        fontSize: 'clamp(2.8rem, 7vw, 4.2rem)', // Ajustado
        fontWeight: '900',
        marginBottom: '1.5rem',
        color: 'white',
        textShadow: '0px 4px 8px rgba(0,0,0,0.7)', // Sombra mais pronunciada
        maxWidth: '800px', // Para quebrar linha se for muito grande
    };

    const subtitleStyle = {
        fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
        marginBottom: '3rem',
        maxWidth: '600px',
        lineHeight: '1.7',
        color: 'var(--text-muted)',
    };

    const buttonContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '350px',
    };
    
    const buttonBaseStyle = {
        padding: '18px 22px',
        fontSize: '1.1rem', // Reduzido um pouco
        fontWeight: 'bold',
        borderRadius: '4px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
        textTransform: 'uppercase',
        border: 'none',
        letterSpacing: '0.5px',
        display: 'block', // Para que o Link ocupe a largura
    };

    const primaryButtonStyle = {
        ...buttonBaseStyle,
        color: 'white',
        backgroundColor: 'var(--paramount-blue)', // Usando a variável de cor
        boxShadow: '0 4px 12px rgba(0, 115, 255, 0.35)',
    };

    const secondaryButtonStyle = {
        ...buttonBaseStyle,
        color: 'var(--text-light)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Fundo mais sutil
        border: '2px solid rgba(255, 255, 255, 0.2)', // Borda sutil
    };
    
    const handleMouseEnter = (e, isPrimary) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        if(isPrimary) e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 115, 255, 0.45)';
        else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    };
    const handleMouseLeave = (e, isPrimary) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        if(isPrimary) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 115, 255, 0.35)';
        else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>UMA MONTANHA DE ENTRETENIMENTO.</h1>
            <p style={subtitleStyle}>Planos a partir de R$18,90 BRL / Mês.<br/>Cancele a qualquer momento. Termos se aplicam.</p>
            
            <div style={buttonContainerStyle}>
                <Link 
                    to="/register" 
                    style={primaryButtonStyle}
                    onMouseEnter={(e) => handleMouseEnter(e, true)}
                    onMouseLeave={(e) => handleMouseLeave(e, true)}
                >
                    ASSINE MYSTREAMBOX+
                </Link>
                <Link 
                    to="/login" 
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => handleMouseEnter(e, false)}
                    onMouseLeave={(e) => handleMouseLeave(e, false)}
                >
                    JÁ ASSINO MYSTREAMBOX+
                </Link>
            </div>
        </div>
    );
}

export default HomePage;