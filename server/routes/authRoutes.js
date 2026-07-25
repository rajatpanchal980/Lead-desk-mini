const { Router } = require('express');
const { getSession, login, logout } = require('../controllers/authController.js');
const protectAdmin = require('../middleware/authMiddleware.js');

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/session', protectAdmin, getSession);

module.exports = router;
