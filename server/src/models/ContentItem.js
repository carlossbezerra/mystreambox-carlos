// server/src/models/ContentItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category'); 

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
    posterUrl: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    trailerUrl: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    contentType: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
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

Category.hasMany(ContentItem, { foreignKey: 'categoryId' });
ContentItem.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = ContentItem;