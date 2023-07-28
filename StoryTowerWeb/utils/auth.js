const jwt = require('jsonwebtoken');

const secret = 'thesecretfornow';
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    console.log('auth middleware')
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid Token');
    }
    return req;
  },
};
