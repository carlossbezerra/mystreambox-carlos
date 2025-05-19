// server/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// A verificação do JWT_SECRET já é feita no server.js, mas uma dupla checagem não faz mal.
if (!JWT_SECRET) {
    console.error("CRITICAL ERROR in authController: JWT_SECRET is not defined! This should have been caught in server.js.");
    // Considerar um mecanismo de falha mais robusto se isso for alcançado.
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
            expiresIn: '1h', // Token expira em 1 hora
        });

        // Não retornar a senha, mesmo hasheada, na resposta padrão
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
            // Mensagem genérica por segurança para não revelar se o email existe ou não
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            // Mensagem genérica por segurança
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // Token expira em 1 hora
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