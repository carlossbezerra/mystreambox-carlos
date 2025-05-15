// server/src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/test', (req, res) => res.send('Auth route test is successful!'));

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;