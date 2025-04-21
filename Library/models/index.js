const User = require('./User');
const Book = require('./Book');

// Дефинира връзките между моделите
Book.belongsTo(User, { foreignKey: 'borrowedById', as: 'borrowedBy' });
User.hasMany(Book, { foreignKey: 'borrowedById' });

module.exports = {
  User,
  Book
}; 