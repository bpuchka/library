const express = require('express');
const userController = require('../controllers/userController');
console.log('userController:', userController);
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/register', userController.registerForm);
router.post('/register', userController.register);
router.get('/login', userController.loginForm);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Нови маршрути за управление на потребители
router.get('/manage', authMiddleware.isAdmin, userController.getAllUsers);
router.post('/:id/role', authMiddleware.isAdmin, userController.updateUserRole);

// Добавете този тестов маршрут
router.get('/test', (req, res) => {
  res.send('Тестовият маршрут работи!');
});

// Добавете този маршрут след останалите маршрути
router.post('/:id/delete', authMiddleware.isAdmin, userController.deleteUser);

module.exports = router; 