// server/src/models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    slug: { // Para URLs amigáveis, ex: 'em-destaque', 'novidades'
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    timestamps: false, // Geralmente categorias não precisam de timestamps
});

module.exports = Category;