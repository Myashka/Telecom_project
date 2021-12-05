const User = require('../models/user');

module.exports = (req, res, next) => {
  if (req.remoteUser) {
    res.locals.user = req.remoteUser;
  }

  let uid = req.session.uid;
  if (!uid) return next();

  User.get(uid).then((result) => {
    if ( result ) {
      let user = new User(result.login, result.password);
      req.user = res.locals.user = user;
      next();
    };
  });
};
