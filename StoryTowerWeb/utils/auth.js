const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'non-production-secret';
const expiration = '6h';

const authMiddleware = ({ req }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secretKey, { maxAge: expiration });
      req.user = data;
      req.user.token = token
    } catch {
      console.log('Invalid Token');
    }
    return req;
  }

  const signToken = ({ username, email, _id }) => {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secretKey, { expiresIn: expiration })
  }

  module.exports = { authMiddleware, signToken };