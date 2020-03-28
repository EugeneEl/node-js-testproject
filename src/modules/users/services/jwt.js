const jwt = require('jsonwebtoken');
const CONFIG = require('../../../config');

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, CONFIG.secret);
  },
  verifyToken: (token) => {
    return jwt.verify(token, CONFIG.secret);
  },
};
