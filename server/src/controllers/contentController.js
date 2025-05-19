// server/src/controllers/contentController.js
const ContentItem = require('../models/ContentItem');
const Category = require('../models/Category');
const { Op } = require('sequelize'); // Para operadores como 'like', se for usar no futuro

// Listar conteúdo por slug de categoria (ex: 'em-destaque', 'novidades')
exports.getContentByCategorySlug = async (req, res) => {
    try {
        const { categorySlug } = req.params;
        const category = await Category.findOne({ where: { slug: categorySlug } });

        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }

        const items = await ContentItem.findAll({
            where: { categoryId: category.id },
            include: [{ model: Category, attributes: ['name', 'slug'] }], // Inclui dados da categoria
            order: [['releaseYear', 'DESC'], ['createdAt', 'DESC']], // Exemplo de ordenação
            limit: 10 // Limita a 10 itens por categoria por enquanto
        });

        res.status(200).json({ categoryName: category.name, items });
    } catch (error) {
        console.error(`Erro ao buscar conteúdo por categoria (${req.params.categorySlug}):`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar conteúdo por categoria.', errorDetails: error.message });
    }
};

// Buscar um item de conteúdo específico pelo ID (para detalhes/player)
exports.getContentItemById = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await ContentItem.findByPk(itemId, {
            include: [{ model: Category, attributes: ['name', 'slug'] }]
        });

        if (!item) {
            return res.status(404).json({ message: 'Item de conteúdo não encontrado.' });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error(`Erro ao buscar item de conteúdo por ID (${req.params.itemId}):`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar item por ID.', errorDetails: error.message });
    }
};