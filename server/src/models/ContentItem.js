// server/src/models/ContentItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category'); // Importar Categoria

const ContentItem = sequelize.define('ContentItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    posterUrl: { // URL para a imagem do pôster
        type: DataTypes.STRING,
        allowNull: false,
    },
    trailerUrl: { // URL do trailer (ex: link do YouTube)
        type: DataTypes.STRING,
        allowNull: false,
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    contentType: { // 'movie' ou 'series'
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Chave estrangeira para Category
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
        }
    }
}, {
    timestamps: true,
});

// Definir a Associação
Category.hasMany(ContentItem, { foreignKey: 'categoryId' });
ContentItem.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = ContentItem;