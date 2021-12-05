const User = require('../models/user');

exports.form = (req, res) => {
  res.render('login', {title: 'Войти'})
}

exports.submit = (req, res, next) => {
  const data = req.body.user;
  let user = new User(data.login, data.password);

  user.authenticate().then((result) => {
    if (result) {
      req.session.uid = user.login;
      res.redirect('/articles');
    } else {
      res.error('Извините! Данные неверны.');
      res.redirect('back');
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  })
};
