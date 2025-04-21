const { Book, User } = require('../models');
const { Op } = require('sequelize');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: ['borrowedBy']
    });
    res.render('books/index', { 
      title: 'Всички книги',
      books,
      user: req.session.user
    });
  } catch (error) {
    console.error('Грешка при извличане на книги:', error);
    res.status(500).render('error', { 
      title: 'Грешка',
      error: 'Грешка при извличане на книги',
      user: req.session.user
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: ['borrowedBy']
    });
    
    if (!book) {
      return res.status(404).render('error', { 
        title: 'Грешка',
        error: 'Книгата не е намерена',
        user: req.session.user
      });
    }
    
    res.render('books/show', { 
      title: book.title,
      book,
      user: req.session.user
    });
  } catch (error) {
    console.error('Грешка при извличане на книгата:', error);
    res.status(500).render('error', { 
      title: 'Грешка',
      error: 'Грешка при извличане на книгата',
      user: req.session.user
    });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query, type } = req.query;
    let where = {};
    
    if (query) {
      if (type === 'title') {
        where.title = { [Op.like]: `%${query}%` };
      } else if (type === 'author') {
        where.author = { [Op.like]: `%${query}%` };
      } else if (type === 'genre') {
        where.genre = { [Op.like]: `%${query}%` };
      } else {
        where = {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { author: { [Op.like]: `%${query}%` } },
            { genre: { [Op.like]: `%${query}%` } }
          ]
        };
      }
    }
    
    const books = await Book.findAll({
      where,
      include: ['borrowedBy']
    });
    
    res.render('books/search', { 
      title: 'Резултати от търсенето',
      books,
      query,
      type,
      user: req.session.user
    });
  } catch (error) {
    console.error('Грешка при търсене на книги:', error);
    res.status(500).render('error', { 
      title: 'Грешка',
      error: 'Грешка при търсене на книги',
      user: req.session.user
    });
  }
};

exports.createBookForm = (req, res) => {
  res.render('books/create', { 
    title: 'Добавяне на нова книга',
    user: req.session.user,
    error: null
  });
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    await Book.create({ title, author, genre });
    res.redirect('/books');
  } catch (error) {
    console.error('Грешка при създаване на книга:', error);
    res.render('books/create', { 
      title: 'Добавяне на нова книга',
      error: 'Грешка при създаване на книга',
      user: req.session.user
    });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).render('error', { 
        title: 'Грешка',
        error: 'Книгата не е намерена',
        user: req.session.user
      });
    }
    
    if (book.status !== 'налична') {
      return res.status(400).render('error', { 
        title: 'Грешка',
        error: 'Книгата не е налична за заемане',
        user: req.session.user
      });
    }
    
    await book.update({
      status: 'заета',
      borrowDate: new Date(),
      borrowedById: req.session.user.id
    });
    
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    console.error('Грешка при заемане на книгата:', error);
    res.status(500).render('error', { 
      title: 'Грешка',
      error: 'Грешка при заемане на книгата',
      user: req.session.user
    });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).render('error', { 
        title: 'Грешка',
        error: 'Книгата не е намерена',
        user: req.session.user
      });
    }
    
    if (book.status !== 'заета') {
      return res.status(400).render('error', { 
        title: 'Грешка',
        error: 'Книгата не е заета',
        user: req.session.user
      });
    }
    
    await book.update({
      status: 'върната',
      returnDate: new Date()
    });
    
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    console.error('Грешка при връщане на книгата:', error);
    res.status(500).render('error', { 
      title: 'Грешка',
      error: 'Грешка при връщане на книгата',
      user: req.session.user
    });
  }
}; 