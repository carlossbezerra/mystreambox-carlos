// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Para chamadas à API

// URL base da sua API de autenticação no back-end
const API_URL = 'http://localhost:3001/api/auth'; 

const AuthContext = createContext(null); // Inicializa com null

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Guarda os dados do usuário logado
    const [token, setToken] = useState(localStorage.getItem('authToken')); // Carrega o token inicial do localStorage
    const [loading, setLoading] = useState(true); // Estado para indicar se a autenticação inicial está carregando

    // Efeito para configurar o header Authorization do axios e buscar dados do usuário se um token existir
    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Se você tem um endpoint para buscar dados do usuário logado (ex: /api/users/me),
                // você poderia chamá-lo aqui para popular currentUser.
                // Por enquanto, vamos assumir que `register` e `login` retornam `user` e `token`.
                // E se o usuário recarregar a página, ele perderá `currentUser` mas manterá o `token`.
                // Uma lógica mais robusta buscaria o usuário aqui.
                // Exemplo (requer um endpoint /me no backend que retorne dados do usuário com base no token):
                /*
                try {
                    // Supondo que você tenha um endpoint como /api/auth/me ou /api/users/me
                    // que retorna os dados do usuário com base no token JWT válido
                    const response = await axios.get('http://localhost:3001/api/auth/me'); // Crie este endpoint no backend
                    setCurrentUser(response.data.user);
                } catch (error) {
                    console.error("Token inválido ou sessão expirada, deslogando:", error);
                    localStorage.removeItem('authToken');
                    delete axios.defaults.headers.common['Authorization'];
                    setToken(null);
                    setCurrentUser(null);
                }
                */
                // Se você não tem um endpoint /me, o currentUser só será setado após login/registro
                // e será perdido no refresh, a menos que você salve o user no localStorage também (não recomendado para objetos grandes)
            } else {
                delete axios.defaults.headers.common['Authorization'];
                localStorage.removeItem('authToken');
            }
            setLoading(false); // Conclui o carregamento inicial do estado de autenticação
        };

        initializeAuth();
    }, [token]); // Executa sempre que o token mudar

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, { name, email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('authToken', response.data.token); // Salva no localStorage
                setToken(response.data.token); // Atualiza o estado do token
                setCurrentUser(response.data.user); // Armazena os dados do usuário
                setLoading(false);
                return { success: true, data: response.data };
            }
        } catch (error) {
            console.error("Erro no registro (AuthContext):", error.response ? error.response.data : error.message);
            setLoading(false);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
        setLoading(false);
        return { success: false, error: { message: "Resposta inesperada do servidor no registro."} };
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                setToken(response.data.token);
                setCurrentUser(response.data.user);
                setLoading(false);
                return { success: true, data: response.data };
            }
        } catch (error) {
            console.error("Erro no login (AuthContext):", error.response ? error.response.data : error.message);
            setLoading(false);
            return { success: false, error: error.response ? error.response.data : { message: error.message } };
        }
        setLoading(false);
        return { success: false, error: { message: "Resposta inesperada do servidor no login."} };
    };

    const logout = () => {
        setLoading(true);
        setCurrentUser(null);
        setToken(null); // Isso vai disparar o useEffect para remover do localStorage e do header axios
        // Se você tivesse um endpoint de logout no backend para invalidar o token (mais seguro), chamaria aqui.
        // Ex: await axios.post(`${API_URL}/logout`);
        setLoading(false);
    };
    
    // Função placeholder para o "Login com Parceiro"
    const loginWithPartner = () => {
        alert("Funcionalidade 'Login com Parceiro' ainda não implementada.");
        // No futuro, isso poderia redirecionar para um fluxo OAuth ou similar.
    };

    const value = {
        currentUser,
        token,
        loading, // Expõe o estado de loading para que a UI possa reagir
        register,
        login,
        logout,
        loginWithPartner
    };

    // Não renderiza os children até que o carregamento inicial da autenticação esteja completo
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};