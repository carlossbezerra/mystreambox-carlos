// client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// useAuth não é necessário aqui se for apenas a landing page pública
// import { useAuth } from '../context/AuthContext';

function HomePage() {
    // const { currentUser } = useAuth(); // Não precisamos mais disso aqui

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
        // Para um efeito de fundo com imagem e gradiente (substitua pela sua imagem)
        // Se for usar imagem, coloque-a na pasta `public` e referencie como url('/nome-da-imagem.jpg')
        // backgroundImage: 'linear-gradient(to bottom, rgba(16, 16, 18, 0.7) 0%, rgba(16, 16, 18, 1) 100%), url("/hero-background.jpg")',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center center',
    };

    const titleStyle = {
        fontSize: 'clamp(2.8rem, 7vw, 4.8rem)',
        fontWeight: '900', // Mais pesado
        marginBottom: '1.5rem',
        color: 'white',
        textShadow: '0px 3px 6px rgba(0,0,0,0.7)',
        letterSpacing: '-1px',
    };

    const subtitleStyle = {
        fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
        marginBottom: '3rem',
        maxWidth: '650px',
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
        fontSize: '1.15rem',
        fontWeight: 'bold',
        borderRadius: '4px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
        textTransform: 'uppercase',
        border: 'none',
        letterSpacing: '0.5px',
    };

    const primaryButtonStyle = {
        ...buttonBaseStyle,
        color: 'white',
        backgroundColor: 'var(--paramount-blue)',
        boxShadow: '0 4px 10px rgba(0, 115, 255, 0.3)',
    };

    const secondaryButtonStyle = {
        ...buttonBaseStyle,
        color: 'var(--text-light)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
    };
    
    // Simples hover com JS (CSS Modules ou classes são melhores para isso)
    const handleMouseEnter = (e, isPrimary) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        if(isPrimary) e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 115, 255, 0.4)';
        else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    };
    const handleMouseLeave = (e, isPrimary) => {
        e.currentTarget.style.transform = 'translateY(0px)';
         if(isPrimary) e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 115, 255, 0.3)';
         else e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
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