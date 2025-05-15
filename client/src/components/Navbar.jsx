// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2.5rem', // Padding horizontal
        backgroundColor: 'rgba(20, 20, 20, 0.95)', // Fundo escuro, levemente translúcido
        color: 'var(--text-light)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        boxSizing: 'border-box',
        height: '65px', // Altura definida
        borderBottom: `1px solid var(--border-color)`, // Borda sutil na parte inferior
    };

    const navLinksStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    };

    const logoStyle = {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: 'var(--paramount-blue)',
        textDecoration: 'none',
        letterSpacing: '-1px' // Ajuste fino
    };

    const buttonBaseStyle = {
        padding: '8px 18px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        textDecoration: 'none',
        textAlign: 'center',
        border: 'none', // Removido para ser adicionado condicionalmente
        transition: 'background-color 0.2s ease, opacity 0.2s ease, color 0.2s ease',
    };
    
    const primaryButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: 'var(--paramount-blue)',
        color: 'white',
    };

    const secondaryButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: 'transparent',
        color: 'var(--text-light)',
        border: '1px solid var(--text-light)',
    };
    
    const userInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        color: 'var(--text-muted)',
        fontSize: '0.95rem'
    };

    // Simples hover com JS para botões (CSS Modules ou classes são melhores para isso)
    const handleMouseEnter = (e, isPrimary) => {
        e.currentTarget.style.opacity = '0.8';
        if (!isPrimary) {
             e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
        }
    };
    const handleMouseLeave = (e, isPrimary) => {
        e.currentTarget.style.opacity = '1';
        if (!isPrimary) {
            e.currentTarget.style.backgroundColor = 'transparent';
        }
    };


    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>MyStreamBox</Link>
            <div style={navLinksStyle}>
                {currentUser ? (
                    <div style={userInfoStyle}>
                        <span>Olá, {currentUser.name || currentUser.email}!</span>
                        <button 
                            onClick={handleLogout} 
                            style={secondaryButtonStyle}
                            onMouseEnter={(e) => handleMouseEnter(e, false)}
                            onMouseLeave={(e) => handleMouseLeave(e, false)}
                        >
                            Sair
                        </button>
                    </div>
                ) : (
                    <>
                        <Link 
                            to="/login" 
                            style={primaryButtonStyle}
                            onMouseEnter={(e) => handleMouseEnter(e, true)}
                            onMouseLeave={(e) => handleMouseLeave(e, true)}
                        >
                            Entrar
                        </Link>
                        <Link 
                            to="/register" 
                            style={secondaryButtonStyle}
                            onMouseEnter={(e) => handleMouseEnter(e, false)}
                            onMouseLeave={(e) => handleMouseLeave(e, false)}
                        >
                            Assine Já
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;