// client/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, loginWithPartner } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result && result.success) {
            navigate('/');
        } else {
            setError(result?.error?.message || 'Email ou senha inválidos.');
        }
        setLoading(false);
    };
    
    const handleLoginWithPartner = () => {
        loginWithPartner();
    };

    const styles = {
        container: { 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: 'calc(100vh - 85px)', // Subtrai altura aproximada do navbar + padding
            padding: '20px',
        },
        form: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            width: '100%', 
            maxWidth: '400px', 
            padding: '30px 35px', 
            backgroundColor: 'var(--dark-bg-secondary)', 
            borderRadius: '8px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)' 
        },
        // input já estilizado globalmente em index.css
        button: { 
            padding: '14px 18px', 
            backgroundColor: 'var(--paramount-blue)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: 'bold',
        },
        buttonSecondary: { 
            padding: '14px 18px', 
            backgroundColor: 'transparent', 
            color: 'var(--paramount-blue)', 
            border: '2px solid var(--paramount-blue)', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontSize: '1rem',
            fontWeight: 'bold', 
            textAlign: 'center',
        },
        error: { 
            color: '#ff4d4f', 
            backgroundColor: 'rgba(255, 77, 79, 0.1)',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '0px', // Removido margin bottom daqui, gap do form cuida
            textAlign: 'center',
            border: '1px solid rgba(255, 77, 79, 0.3)'
        },
        linkContainer: { 
            marginTop: '10px', // Reduzido margin
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
        },
        link: { 
            color: 'var(--paramount-blue)', 
            textDecoration: 'none',
            fontWeight: 'bold'
        },
        title: {
            textAlign: 'center',
            marginBottom: '15px', // Reduzido margin
            fontSize: '1.8rem',
            color: 'var(--text-light)',
            fontWeight: '700'
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Entrar</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    // style={styles.input} // Estilo global agora
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    // style={styles.input} // Estilo global agora
                />
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <button type="button" onClick={handleLoginWithPartner} disabled={loading} style={styles.buttonSecondary}>
                    Fazer Login com o Parceiro
                </button>
                <div style={styles.linkContainer}>
                    Não tem uma conta? <Link to="/register" style={styles.link}>Registre-se</Link>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;