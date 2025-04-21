const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

exports.registerForm = (req, res) => {
  res.render('users/register', { 
    title: 'Регистрация',
    error: null
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Проверка дали потребителското име или имейла вече съществуват
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.render('users/register', { 
        title: 'Регистрация',
        error: 'Потребителското име или имейл адресът вече са заети.'
      });
    }
    
    // Създаване на нов потребител
    await User.create({
      username,
      email,
      password, // хеширането се извършва в модела чрез hooks
      role: 'потребител'
    });
    
    res.redirect('/users/login');
  } catch (error) {
    console.error('Грешка при регистрация:', error);
    res.render('users/register', { 
      title: 'Регистрация',
      error: 'Възникна грешка при регистрацията. Моля, опитайте отново.'
    });
  }
};

exports.loginForm = (req, res) => {
  res.render('users/login', { 
    title: 'Вход',
    error: null
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.render('users/login', { 
        title: 'Вход',
        error: 'Невалидно потребителско име или парола'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.render('users/login', { 
        title: 'Вход',
        error: 'Невалидно потребителско име или парола'
      });
    }
    
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    
    res.redirect('/');
  } catch (error) {
    console.error('Грешка при вход:', error);
    res.render('users/login', { 
      title: 'Вход',
      error: 'Възникна грешка. Моля, опитайте отново.'
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['username', 'ASC']]
    });
    
    res.render('users/manage', {
      title: 'Управление на потребители',
      users,
      user: req.session.user,
      currentUser: req.session.user,
      message: req.query.message
    });
  } catch (error) {
    console.error('Грешка при извличане на потребители:', error);
    res.status(500).render('error', {
      title: 'Грешка',
      error: 'Грешка при извличане на потребители',
      user: req.session.user
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    // Проверяваме дали ролята е валидна
    if (!['потребител', 'библиотекар', 'администратор'].includes(role)) {
      return res.status(400).render('error', {
        title: 'Грешка',
        error: 'Невалидна роля',
        user: req.session.user
      });
    }
    
    // Намираме потребителя
    const userToUpdate = await User.findByPk(userId);
    
    if (!userToUpdate) {
      return res.status(404).render('error', {
        title: 'Грешка',
        error: 'Потребителят не е намерен',
        user: req.session.user
      });
    }
    
    // Не позволяваме на администратор да понижи собствената си роля
    if (userToUpdate.id === req.session.user.id && role !== 'администратор') {
      return res.status(403).render('error', {
        title: 'Грешка',
        error: 'Не можете да промените собствената си роля',
        user: req.session.user
      });
    }
    
    // Обновяваме ролята
    await userToUpdate.update({ role });
    
    // Ако администраторът променя собствената си роля, обновяваме и сесията
    if (userToUpdate.id === req.session.user.id) {
      req.session.user.role = role;
    }
    
    res.redirect('/users/manage?message=Ролята на потребителя беше променена успешно');
  } catch (error) {
    console.error('Грешка при обновяване на ролята:', error);
    res.status(500).render('error', {
      title: 'Грешка',
      error: 'Грешка при обновяване на ролята',
      user: req.session.user
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Проверяваме дали потребителят съществува
    const userToDelete = await User.findByPk(userId);
    
    if (!userToDelete) {
      return res.status(404).render('error', {
        title: 'Грешка',
        error: 'Потребителят не е намерен',
        user: req.session.user
      });
    }
    
    // Не позволяваме на администратор да изтрие собствения си акаунт
    if (userToDelete.id === req.session.user.id) {
      return res.status(403).render('error', {
        title: 'Грешка',
        error: 'Не можете да изтриете собствения си акаунт',
        user: req.session.user
      });
    }
    
    // Изтриваме потребителя
    await userToDelete.destroy();
    
    res.redirect('/users/manage?message=Потребителят беше изтрит успешно');
  } catch (error) {
    console.error('Грешка при изтриване на потребител:', error);
    res.status(500).render('error', {
      title: 'Грешка',
      error: 'Грешка при изтриване на потребителя',
      user: req.session.user
    });
  }
}; 