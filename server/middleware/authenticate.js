const { User } = require('./../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');
  // returns a promise
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        // token match, but no user
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
      // handle promise rejection
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

module.exports = { authenticate };
