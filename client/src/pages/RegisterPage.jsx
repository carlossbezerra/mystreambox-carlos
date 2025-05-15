// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }
        // Adicionar validação de força da senha se desejar
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
        }

        const result = await register(name, email, password);
        if (result && result.success) {
            navigate('/');
        } else {
            setError(result?.error?.message || 'Falha ao registrar. Tente novamente.');
        }
        setLoading(false);
    };

    // Reutilizando os mesmos estilos da LoginPage para consistência
    const styles = {
        container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 85px)', padding: '20px' },
        form: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px', padding: '30px 35px', backgroundColor: 'var(--dark-bg-secondary)', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
        button: { padding: '14px 18px', backgroundColor: 'var(--paramount-blue)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
        error: { color: '#ff4d4f', backgroundColor: 'rgba(255, 77, 79, 0.1)', padding: '12px', borderRadius: '4px', marginBottom: '0px', textAlign: 'center', border: '1px solid rgba(255, 77, 79, 0.3)'},
        linkContainer: { marginTop: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' },
        link: { color: 'var(--paramount-blue)', textDecoration: 'none', fontWeight: 'bold' },
        title: { textAlign: 'center', marginBottom: '15px', fontSize: '1.8rem', color: 'var(--text-light)', fontWeight: '700'}
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Criar Conta</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha (mínimo 6 caracteres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
                <div style={styles.linkContainer}>
                    Já tem uma conta? <Link to="/login" style={styles.link}>Faça Login</Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;