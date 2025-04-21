const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/create', authMiddleware.isLibrarian, bookController.createBookForm);
router.post('/', authMiddleware.isLibrarian, bookController.createBook);
router.get('/:id', bookController.getBookById);
router.post('/:id/borrow', authMiddleware.isAuthenticated, bookController.borrowBook);
router.post('/:id/return', authMiddleware.isAuthenticated, bookController.returnBook);

module.exports = router; 