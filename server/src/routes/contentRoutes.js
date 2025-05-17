// server/src/routes/contentRoutes.js
const express = require('express');
const contentController = require('../controllers/contentController');
const router = express.Router();

// Rota para buscar conteúdo por slug de categoria
router.get('/category/:categorySlug', contentController.getContentByCategorySlug);

// Rota para buscar um item de conteúdo específico
router.get('/item/:itemId', contentController.getContentItemById);

module.exports = router;