exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
};

exports.isLibrarian = (req, res, next) => {
  if (!req.session.user || (req.session.user.role !== 'библиотекар' && req.session.user.role !== 'администратор')) {
    return res.status(403).render('error', { 
      title: 'Достъпът отказан',
      error: 'Нямате разрешение за достъп до тази страница'
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'администратор') {
    return res.status(403).render('error', { 
      title: 'Достъпът отказан',
      error: 'Само администратори имат достъп до тази страница',
      user: req.session.user
    });
  }
  next();
}; 