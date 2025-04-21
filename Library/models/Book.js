const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('налична', 'заета', 'върната'),
    defaultValue: 'налична'
  },
  borrowDate: {
    type: DataTypes.DATE
  },
  returnDate: {
    type: DataTypes.DATE
  }
});

module.exports = Book; 