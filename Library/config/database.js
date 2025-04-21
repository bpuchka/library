const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('library_db', 'root', '1407', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Промени на true за дебъгване на SQL заявките
});

module.exports = sequelize; 