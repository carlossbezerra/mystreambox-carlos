// server/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// dotenv já foi carregado em server/server.js, então process.env.JWT_SECRET está disponível

const JWT_SECRET = process.env.JWT_SECRET;

// Não precisamos da verificação aqui se já fizemos no server.js, mas não prejudica.
if (!JWT_SECRET) {
    console.error("CRITICAL ERROR in authController: JWT_SECRET is not defined!");
    // Em um cenário real, você poderia impedir o servidor de continuar se isso for crítico.
    // Mas como server.js já faz process.exit(1), esta mensagem é mais para debug.
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça nome, email e senha.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário com este email já existe.' });
        }

        const newUser = await User.create({ name, email, password });

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
            expiresIn: '1h',
        });

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Erro no registro:", error);
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: 'Erro de validação', errors: messages });
        }
        res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.', errorDetails: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Mensagem genérica por segurança
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            // Mensagem genérica por segurança
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h',
        });

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login.', errorDetails: error.message });
    }
};

// (OPCIONAL - Endpoint /me para buscar dados do usuário logado)
// Você precisaria de um middleware de autenticação para proteger esta rota
// exports.getMe = async (req, res) => {
//     // req.user deve ser populado pelo middleware de autenticação após verificar o token JWT
//     if (!req.user || !req.user.id) {
//         return res.status(401).json({ message: 'Não autorizado ou usuário não encontrado no token.' });
//     }
//     try {
//         const user = await User.findByPk(req.user.id, {
//             attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'] // Não retorne a senha
//         });
//         if (!user) {
//             return res.status(404).json({ message: 'Usuário não encontrado.' });
//         }
//         res.status(200).json({ user });
//     } catch (error) {
//         console.error("Erro ao buscar dados do usuário (/me):", error);
//         res.status(500).json({ message: 'Erro interno do servidor.', errorDetails: error.message });
//     }
// };