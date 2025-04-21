const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

// Импортиране на модели и асоциации
require('./models');

const app = express();

// Настройки
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'library_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Проверка на връзката и синхронизиране на моделите
sequelize.authenticate()
  .then(() => {
    console.log('Успешна връзка с MySQL базата данни');
    return sequelize.sync();
  })
  .then(() => console.log('Моделите са синхронизирани с базата данни'))
  .catch(err => console.error('Грешка при свързване с базата данни:', err));

// Рутери
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

// Начална страница
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Библиотечна система',
    user: req.session.user 
  });
});

// 404 страница
app.use((req, res) => {
  res.status(404).render('404', {
    user: req.session.user
  });
});

// Стартиране на сървъра
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сървърът е стартиран на порт ${PORT}`);
}); 